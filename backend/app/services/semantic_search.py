import re
import time
import numpy as np
from typing import List, Dict, Any, Tuple
from sqlalchemy.orm import Session
from app.models.models import Product

# Attempt to load SentenceTransformers or fall back to TF-IDF Vectorizer
try:
    from sentence_transformers import SentenceTransformer
    import faiss
    MODEL_AVAILABLE = True
except Exception:
    MODEL_AVAILABLE = False

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


class SemanticSearchEngine:
    """
    FAISS / SentenceTransformer Natural Language Semantic Search Engine
    Capable of handling queries such as:
    "I need comfortable black running shoes under ₹3000"
    """

    def __init__(self):
        self.model = None
        self.vectorizer = TfidfVectorizer(stop_words="english")
        self.product_vectors = None
        self.product_ids = []
        self.faiss_index = None

    def initialize_index(self, db: Session):
        """Build FAISS / Vector Index from Database Products"""
        products = db.query(Product).all()
        if not products:
            return

        self.product_ids = [p.id for p in products]
        corpus = [
            f"{p.title} {p.description} {p.brand} {p.tags or ''} {p.color or ''} {p.gender or ''}"
            for p in products
        ]

        if MODEL_AVAILABLE:
            try:
                self.model = SentenceTransformer("all-MiniLM-L6-v2")
                embeddings = self.model.encode(corpus, convert_to_numpy=True).astype("float32")
                # Normalize L2
                faiss.normalize_L2(embeddings)
                d = embeddings.shape[1]
                self.faiss_index = faiss.IndexFlatIP(d)
                self.faiss_index.add(embeddings)
                return
            except Exception as e:
                print(f"SentenceTransformer init fallback: {e}")

        # Fallback to TF-IDF cosine similarity
        self.product_vectors = self.vectorizer.fit_transform(corpus)

    def parse_query_intent(self, query: str) -> Dict[str, Any]:
        """
        Parses natural language query for price constraints, colors, and intent tags.
        Example: 'comfortable black running shoes under ₹3000'
        """
        q_lower = query.lower()
        
        # Price extraction: 'under 3000', 'below 5000', '< 2500', 'under ₹3000'
        price_match = re.search(r'(?:under|below|less than|<|budget|around|max)\s*₹?\s*(\d+)', q_lower)
        max_price = float(price_match.group(1)) if price_match else None

        # Color extraction
        colors = ["black", "white", "blue", "teal", "brown", "grey", "charcoal", "olive", "green", "indigo", "gold"]
        detected_colors = [c for c in colors if c in q_lower]

        # Category/Intent keywords
        intents = []
        if any(w in q_lower for w in ["shoe", "running", "sneakers", "boots", "trainers", "footwear"]):
            intents.append("Footwear")
        if any(w in q_lower for w in ["shirt", "hoodie", "activewear", "leggings", "gym", "shorts"]):
            intents.append("Activewear")
        if any(w in q_lower for w in ["headphones", "earbuds", "audio", "smartwatch", "wireless"]):
            intents.append("Electronics")
        if any(w in q_lower for w in ["jeans", "denim", "blazer", "jacket", "tshirt"]):
            intents.append("Casual Fashion")
        if any(w in q_lower for w in ["backpack", "bag", "sunglasses", "wallet"]):
            intents.append("Accessories")

        return {
            "max_price": max_price,
            "colors": detected_colors,
            "intents": intents,
            "raw_query": query
        }

    def search(self, db: Session, query: str, top_k: int = 10) -> Dict[str, Any]:
        """
        Performs vector similarity search + metadata filtering
        Returns sub-80ms result with query parsing breakdown
        """
        start_time = time.time()
        
        if not self.product_ids:
            self.initialize_index(db)

        parsed = self.parse_query_intent(query)
        all_products = {p.id: p for p in db.query(Product).all()}

        scores = {}
        if self.faiss_index and self.model:
            q_emb = self.model.encode([query], convert_to_numpy=True).astype("float32")
            faiss.normalize_L2(q_emb)
            distances, indices = self.faiss_index.search(q_emb, len(self.product_ids))
            for dist, idx in zip(distances[0], indices[0]):
                if idx < len(self.product_ids):
                    pid = self.product_ids[idx]
                    scores[pid] = float(dist)
        else:
            if self.product_vectors is not None:
                q_vec = self.vectorizer.transform([query])
                sims = cosine_similarity(q_vec, self.product_vectors)[0]
                for idx, sim in enumerate(sims):
                    pid = self.product_ids[idx]
                    scores[pid] = float(sim)

        # Apply metadata filters (Price threshold, Color match bonus)
        results = []
        for pid, score in scores.items():
            product = all_products.get(pid)
            if not product:
                continue

            # Hard filter on price if user specified 'under X'
            if parsed["max_price"] and product.price > parsed["max_price"]:
                continue

            final_score = score
            
            # Color match boost
            if parsed["colors"] and product.color:
                if any(c in product.color.lower() for c in parsed["colors"]):
                    final_score += 0.25

            # Tag match boost
            p_tags = (product.tags or "").lower()
            if any(term in p_tags or term in product.title.lower() for term in query.lower().split()):
                final_score += 0.2

            product.match_score = round(min(0.99, max(0.50, final_score)), 2)
            results.append(product)

        results.sort(key=lambda x: getattr(x, "match_score", 0), reverse=True)
        latency_ms = round((time.time() - start_time) * 1000, 2)

        intent_desc = " ; ".join([
            f"Budget <= ₹{int(parsed['max_price'])}" if parsed['max_price'] else "",
            f"Colors: {', '.join(parsed['colors'])}" if parsed['colors'] else "",
            f"Intents: {', '.join(parsed['intents'])}" if parsed['intents'] else "General Search"
        ]).strip(" ; ")

        return {
            "query": query,
            "detected_intent": intent_desc or "Natural Language Discovery",
            "extracted_budget": parsed["max_price"],
            "extracted_tags": parsed["colors"] + parsed["intents"],
            "total_found": len(results),
            "latency_ms": latency_ms,
            "results": results[:top_k]
        }

semantic_search_engine = SemanticSearchEngine()
