from typing import List, Optional, Dict, Any
from app.db.mongodb import get_database
from app.models.product import Product
import random

class ProductService:
    @staticmethod
    async def get_all_products(
        category: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        intent: Optional[str] = None,
        search_query: Optional[str] = None,
        limit: int = 50,
        skip: int = 0
    ) -> List[Dict[str, Any]]:
        db = get_database()
        collection = db.get_collection("products")
        
        raw_items = await collection.find_all(limit=1000)
        
        filtered = []
        for item in raw_items:
            # Filter by Category
            if category and category.lower() != "all" and item.get("category", "").lower() != category.lower():
                continue
                
            # Filter by Price Range
            price = float(item.get("price", 0))
            if min_price is not None and price < min_price:
                continue
            if max_price is not None and price > max_price:
                continue
                
            # Filter by Intent
            if intent and intent.lower() != "all":
                intent_lower = intent.lower()
                tags = [t.lower() for t in item.get("tags", [])]
                b_tier = item.get("budget_tier", "").lower()
                
                if "budget" in intent_lower and b_tier != "budget" and price > 2500:
                    continue
                if "urgent" in intent_lower and not item.get("express_delivery"):
                    continue
                if "fashion" in intent_lower and item.get("category") not in ["Fashion", "Footwear", "Accessories"]:
                    continue
                if "seasonal" in intent_lower and item.get("seasonal_intent", "").lower() not in ["summer", "winter", "holiday"]:
                    continue

            # Filter by Search Query keyword
            if search_query:
                q = search_query.lower()
                name = item.get("name", "").lower()
                desc = item.get("description", "").lower()
                cat = item.get("category", "").lower()
                tags = [t.lower() for t in item.get("tags", [])]
                
                if not (q in name or q in desc or q in cat or any(q in t for t in tags)):
                    continue

            filtered.append(item)

        return filtered[skip:skip + limit]

    @staticmethod
    async def get_product_by_id(product_id: str) -> Optional[Dict[str, Any]]:
        db = get_database()
        collection = db.get_collection("products")
        return await collection.find_one({"id": product_id})

    @staticmethod
    async def get_categories() -> List[Dict[str, Any]]:
        db = get_database()
        collection = db.get_collection("products")
        raw_items = await collection.find_all(limit=1000)
        
        category_counts = {}
        category_images = {}
        
        for item in raw_items:
            cat = item.get("category", "General")
            category_counts[cat] = category_counts.get(cat, 0) + 1
            if cat not in category_images and item.get("image_url"):
                category_images[cat] = item.get("image_url")

        return [
            {
                "category": cat,
                "count": count,
                "image_url": category_images.get(cat, "https://images.unsplash.com/photo-1472851294608-062f824d29cc")
            }
            for cat, count in category_counts.items()
        ]
