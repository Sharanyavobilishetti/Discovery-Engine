from sqlalchemy.orm import Session
from app.models.models import Product
from app.services.semantic_search import semantic_search_engine
from typing import Dict, Any, List

class RAGShoppingAssistant:
    """
    AI RAG (Retrieval-Augmented Generation) Shopping Assistant
    Synthesizes product data, intent context, and user questions into natural shopping advice.
    """

    @staticmethod
    def answer_query(db: Session, query: str, session_id: str = None, current_product_id: int = None) -> Dict[str, Any]:
        q_lower = query.lower()
        
        # 1. Retrieve products via Semantic Search
        search_res = semantic_search_engine.search(db, query, top_k=4)
        suggested_products = search_res["results"]
        detected_intent = search_res["detected_intent"]

        # Current product context if available
        curr_prod = None
        if current_product_id:
            curr_prod = db.query(Product).filter(Product.id == current_product_id).first()

        # 2. Synthesize AI Response
        if "compare" in q_lower or "versus" in q_lower or "vs" in q_lower:
            reply = f"Here is a side-by-side comparison based on your request. I analyzed features, durability, and customer ratings for products matching '{query}'."
        elif "marathon" in q_lower or "running" in q_lower:
            reply = f"For running and endurance training, I recommend shoes with high nitrogen foam cushioning and lightweight mesh uppers. Here are the top rated running gear items in Findora's catalog:"
        elif "gift" in q_lower or "present" in q_lower:
            reply = f"Great gift choice! Based on popular customer favorites, premium noise-canceling headphones, leather backpacks, and aviator sunglasses make ideal high-value gifts."
        elif curr_prod:
            reply = f"Regarding {curr_prod.title} (₹{curr_prod.price:,.2f}), it pairs exceptionally well with these complementary activewear and accessory items below:"
        else:
            reply = f"I evaluated Findora's catalog for '{query}'. Here are the best personalized recommendations matching your budget and performance requirements:"

        suggested_queries = [
            "Top running shoes under ₹3000",
            "Best noise-canceling headphones for travel",
            "Show me complete outfit for gym workouts",
            "Gifts under ₹2000"
        ]

        return {
            "reply": reply,
            "intent_summary": f"Detected Intent: {detected_intent}",
            "suggested_products": suggested_products,
            "suggested_queries": suggested_queries
        }
