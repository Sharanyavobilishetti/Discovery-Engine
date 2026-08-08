import math
import numpy as np
from typing import List, Dict, Any, Optional
from app.db.mongodb import get_database
from app.services.product_service import ProductService

def cosine_similarity(v1: List[float], v2: List[float]) -> float:
    """Compute cosine similarity between two float vectors."""
    if not v1 or not v2 or len(v1) != len(v2):
        return 0.0
    dot_product = sum(a * b for a, b in zip(v1, v2))
    norm_v1 = math.sqrt(sum(a * a for a in v1))
    norm_v2 = math.sqrt(sum(b * b for b in v2))
    if norm_v1 == 0 or norm_v2 == 0:
        return 0.0
    return dot_product / (norm_v1 * norm_v2)

class HybridRecommendationEngine:
    """Production-grade Hybrid Recommendation Engine combining Content-Based, Collaborative, and Session Intent Filtering."""
    
    @staticmethod
    async def get_recommendations(
        user_id: Optional[str] = None,
        intent: Optional[str] = "Casual browsing",
        category: Optional[str] = None,
        recent_product_ids: Optional[List[str]] = None,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        db = get_database()
        products_col = db.get_collection("products")
        all_products = await products_col.find_all(limit=1000)

        if not all_products:
            return []

        # 1. Fetch user context & session profile
        user_cart_ids = []
        user_wishlist_ids = []
        if user_id:
            users_col = db.get_collection("users")
            user_doc = await users_col.find_one({"id": user_id})
            if user_doc:
                user_cart_ids = [item.get("product_id") for item in user_doc.get("cart", [])]
                user_wishlist_ids = user_doc.get("wishlist", [])

        recent_ids = set(recent_product_ids or []) | set(user_cart_ids) | set(user_wishlist_ids)

        # Build reference feature vector from recent items
        reference_vector = None
        if recent_ids:
            vectors = [p["embedding"] for p in all_products if p.get("id") in recent_ids and p.get("embedding")]
            if vectors:
                reference_vector = np.mean(vectors, axis=0).tolist()

        scored_products = []
        intent_lower = (intent or "casual browsing").lower()

        for prod in all_products:
            # Skip items already in cart
            if prod.get("id") in user_cart_ids:
                continue

            # Category constraint filter
            if category and category.lower() != "all" and prod.get("category", "").lower() != category.lower():
                continue

            # --- SCORE COMPONENT 1: Content-Based Similarity ---
            content_score = 0.5
            if reference_vector and prod.get("embedding"):
                content_score = max(0.0, cosine_similarity(reference_vector, prod["embedding"]))

            # --- SCORE COMPONENT 2: Collaborative Filtering Affinity ---
            collab_score = 0.5
            # Items in wishlist or matching popular tags receive collaborative boost
            if prod.get("id") in user_wishlist_ids:
                collab_score += 0.4
            collab_score += min(0.3, (prod.get("rating", 4.0) - 3.5) / 1.5)
            collab_score += min(0.2, math.log1p(prod.get("review_count", 0)) / 10.0)

            # --- SCORE COMPONENT 3: Session Intent Weighting ---
            intent_boost = 1.0
            price = float(prod.get("price", 0))
            tags = [t.lower() for t in prod.get("tags", [])]
            b_tier = prod.get("budget_tier", "").lower()

            if "budget" in intent_lower:
                if b_tier == "budget" or price <= 2500:
                    intent_boost = 1.5
                elif price > 10000:
                    intent_boost = 0.3
            elif "urgent" in intent_lower:
                if prod.get("express_delivery"):
                    intent_boost = 1.6
                else:
                    intent_boost = 0.6
            elif "fashion" in intent_lower:
                if prod.get("category") in ["Fashion", "Footwear", "Accessories"]:
                    intent_boost = 1.4
                else:
                    intent_boost = 0.5
            elif "seasonal" in intent_lower:
                if prod.get("seasonal_intent", "").lower() in ["summer", "winter", "holiday", "monsoon"]:
                    intent_boost = 1.5
                else:
                    intent_boost = 0.7

            # --- HYBRID SCORE COMPUTATION ---
            # Composite Hybrid Formula: 0.45 * Content + 0.35 * Collaborative + 0.20 * Popularity * Intent_Multiplier
            hybrid_score = (0.45 * content_score + 0.35 * collab_score) * intent_boost

            # Format human-readable explanation
            explanation = HybridRecommendationEngine._generate_explanation(prod, intent_lower, content_score, collab_score)

            item_res = prod.copy()
            item_res["hybrid_score"] = round(hybrid_score, 4)
            item_res["explanation"] = explanation
            scored_products.append(item_res)

        # Sort by final hybrid score in descending order
        scored_products.sort(key=lambda x: x["hybrid_score"], reverse=True)
        return scored_products[:limit]

    @staticmethod
    async def get_similar_products(product_id: str, limit: int = 6) -> List[Dict[str, Any]]:
        """Compute top-N visually and metadata similar products using cosine vector distance."""
        target_product = await ProductService.get_product_by_id(product_id)
        if not target_product or not target_product.get("embedding"):
            return []

        target_vector = target_product["embedding"]
        db = get_database()
        products_col = db.get_collection("products")
        all_products = await products_col.find_all(limit=1000)

        similar_items = []
        for prod in all_products:
            if prod.get("id") == product_id or not prod.get("embedding"):
                continue
            sim = cosine_similarity(target_vector, prod["embedding"])
            prod_copy = prod.copy()
            prod_copy["similarity_score"] = round(sim, 4)
            prod_copy["explanation"] = f"Visually and feature-similar item in {prod.get('category')} (Similarity: {round(sim*100)}%)"
            similar_items.append(prod_copy)

        similar_items.sort(key=lambda x: x["similarity_score"], reverse=True)
        return similar_items[:limit]

    @staticmethod
    async def search_by_visual_features(query_embedding: List[float], limit: int = 8) -> List[Dict[str, Any]]:
        """Search products using visual feature embedding vector similarity."""
        db = get_database()
        products_col = db.get_collection("products")
        all_products = await products_col.find_all(limit=1000)

        matched_items = []
        for prod in all_products:
            if not prod.get("embedding"):
                continue
            sim = cosine_similarity(query_embedding, prod["embedding"])
            prod_copy = prod.copy()
            prod_copy["visual_match_score"] = round(sim, 4)
            prod_copy["explanation"] = f"Visual AI similarity match ({round(sim*100)}% visual match score)"
            matched_items.append(prod_copy)

        matched_items.sort(key=lambda x: x["visual_match_score"], reverse=True)
        return matched_items[:limit]

    @staticmethod
    def _generate_explanation(prod: Dict[str, Any], intent: str, content_score: float, collab_score: float) -> str:
        price = prod.get("price", 0)
        rating = prod.get("rating", 4.5)
        cat = prod.get("category", "Catalog")

        if "budget" in intent and price <= 2500:
            return f"Recommended for Budget Intent: Rs.{price} price point with {rating} stars rating."
        if "urgent" in intent and prod.get("express_delivery"):
            return f"Recommended for Urgent Intent: Available with Express 24h Delivery."
        if "fashion" in intent and cat in ["Fashion", "Footwear", "Accessories"]:
            return f"Recommended for Fashion Intent: Top style pick in {cat}."
        if content_score > 0.7:
            return f"Matches your recent browser session activity and product interest."
        return f"Popular high-rated choice ({rating} stars) in {cat}."


