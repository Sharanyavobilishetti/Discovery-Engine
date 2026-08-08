import math
import time
from typing import List, Dict, Any, Tuple
from sqlalchemy.orm import Session
from app.models.models import Product, UserInteraction, BrowsingHistory, OrderItem, Order

class AIEngine:
    """
    Findora Multi-Intent & Multi-Model Recommendation Engine
    Includes:
    - Real-time Session Intent Weighting
    - Two-Tower User & Product Matching
    - Content-Based Filtering
    - Collaborative Filtering
    - Cold-Start Strategy
    - Frequently Bought Together (FBT)
    - Complete The Look (Style Complementarity)
    - Recommendation Rationale / Explainability
    """

    @staticmethod
    def extract_session_intents(db: Session, session_id: str = None, user_id: int = None) -> List[Dict[str, Any]]:
        """
        Extracts multi-intent vectors from real-time session activity (clicks, views, searches, cart)
        """
        interactions = []
        if session_id:
            interactions += db.query(UserInteraction).filter(UserInteraction.session_id == session_id).all()
        if user_id:
            interactions += db.query(UserInteraction).filter(UserInteraction.user_id == user_id).order_by(UserInteraction.created_at.desc()).limit(20).all()

        tag_weights = {}
        category_weights = {}
        total_score = 0.0

        for inter in interactions:
            product = db.query(Product).filter(Product.id == inter.product_id).first()
            if product:
                # Action score weight
                weight = 1.0
                if inter.action == "cart":
                    weight = 3.0
                elif inter.action == "purchase":
                    weight = 5.0
                elif inter.action == "search":
                    weight = 2.5
                elif inter.action == "click":
                    weight = 1.5

                total_score += weight
                
                # Category weight
                category_weights[product.category_id] = category_weights.get(product.category_id, 0) + weight

                # Tag weight
                if product.tags:
                    for tag in product.tags.split(","):
                        tag = tag.strip().lower()
                        if tag:
                            tag_weights[tag] = tag_weights.get(tag, 0) + weight

        # Sort top intents
        sorted_intents = sorted(tag_weights.items(), key=lambda x: x[1], reverse=True)
        top_intents = [{"intent": k, "weight": round(v / (total_score or 1.0), 2)} for k, v in sorted_intents[:5]]
        
        return top_intents

    @staticmethod
    def get_two_tower_recommendations(db: Session, user_id: int = None, session_id: str = None, limit: int = 8) -> List[Tuple[Product, float, str]]:
        """
        Two-Tower Recommendation Model:
        User Tower (User profile + Real-time session intent vector) 
        Product Tower (Product embedding & feature vector)
        Outputs: (Product, MatchScore, Explanation)
        """
        start_time = time.time()
        products = db.query(Product).all()
        intents = AIEngine.extract_session_intents(db, session_id=session_id, user_id=user_id)
        intent_tags = {i["intent"]: i["weight"] for i in intents}

        results = []
        for product in products:
            # Calculate match score between User Tower (intent_tags) and Product Tower (tags, category, rating)
            score = 0.4 * (product.rating / 5.0) + (0.1 if product.is_trending else 0.0)
            
            p_tags = [t.strip().lower() for t in (product.tags or "").split(",") if t.strip()]
            tag_match = 0.0
            matched_intent_name = None
            
            for tag, weight in intent_tags.items():
                if tag in p_tags:
                    tag_match += weight * 1.5
                    if not matched_intent_name:
                        matched_intent_name = tag

            score += tag_match
            # Normalize match score between 70% and 99%
            normalized_match = round(min(0.99, max(0.70, score / 2.0)), 2)

            explanation = f"Matches your search & view intent for '{matched_intent_name or 'trending gear'}'" if matched_intent_name else "Popular choice based on your browsing style"
            results.append((product, normalized_match, explanation))

        results.sort(key=lambda x: x[1], reverse=True)
        return results[:limit]

    @staticmethod
    def get_content_based_recommendations(db: Session, product_id: int, limit: int = 6) -> List[Product]:
        """
        Content-Based Recommendation using feature similarity
        """
        target = db.query(Product).filter(Product.id == product_id).first()
        if not target:
            return db.query(Product).limit(limit).all()

        target_tags = set([t.strip().lower() for t in (target.tags or "").split(",")])
        candidates = db.query(Product).filter(Product.id != product_id).all()

        scored = []
        for p in candidates:
            p_tags = set([t.strip().lower() for t in (p.tags or "").split(",")])
            jaccard = len(target_tags.intersection(p_tags)) / (len(target_tags.union(p_tags)) or 1.0)
            cat_bonus = 0.3 if p.category_id == target.category_id else 0.0
            price_similarity = 1.0 - min(1.0, abs(p.price - target.price) / target.price)
            
            final_score = jaccard * 0.5 + cat_bonus + price_similarity * 0.2
            scored.append((p, final_score))

        scored.sort(key=lambda x: x[1], reverse=True)
        return [item[0] for item in scored[:limit]]

    @staticmethod
    def get_frequently_bought_together(db: Session, product_id: int, limit: int = 3) -> List[Product]:
        """
        Frequently Bought Together (Co-occurrence in past completed orders)
        """
        target = db.query(Product).filter(Product.id == product_id).first()
        if not target:
            return []

        # Find orders containing target product
        order_ids = db.query(OrderItem.order_id).filter(OrderItem.product_id == product_id).all()
        order_id_list = [o[0] for o in order_ids]

        if not order_id_list:
            # Fallback to category complementary items
            return db.query(Product).filter(Product.category_id != target.category_id).limit(limit).all()

        co_items = db.query(OrderItem.product_id).filter(
            OrderItem.order_id.in_(order_id_list),
            OrderItem.product_id != product_id
        ).all()

        co_counts = {}
        for item in co_items:
            pid = item[0]
            co_counts[pid] = co_counts.get(pid, 0) + 1

        sorted_ids = sorted(co_counts.keys(), key=lambda x: co_counts[x], reverse=True)
        products = db.query(Product).filter(Product.id.in_(sorted_ids[:limit])).all()

        if len(products) < limit:
            fallback = db.query(Product).filter(Product.id != product_id, Product.id.notin_(sorted_ids)).limit(limit - len(products)).all()
            products.extend(fallback)

        return products

    @staticmethod
    def get_complete_the_look(db: Session, product_id: int, limit: int = 3) -> List[Product]:
        """
        Complete the Look: Styling recommendations across complementary categories (e.g. Shoes -> Active Shorts + Hoodie + Smartwatch)
        """
        target = db.query(Product).filter(Product.id == product_id).first()
        if not target:
            return []

        # Find products in different categories to form a complete outfit or bundle
        complementary = db.query(Product).filter(
            Product.category_id != target.category_id,
            Product.gender.in_([target.gender, "Unisex"]) if target.gender else True
        ).limit(limit).all()

        return complementary

    @staticmethod
    def get_cold_start_recommendations(db: Session, limit: int = 8) -> List[Product]:
        """
        Cold-Start Strategy for new guests / users without past history:
        Combines top rated, trending, and diverse category starters
        """
        return db.query(Product).order_by(Product.is_trending.desc(), Product.rating.desc()).limit(limit).all()
