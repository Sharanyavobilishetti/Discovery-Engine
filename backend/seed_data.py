import asyncio
import random
import logging
from app.db.mongodb import db_manager
from app.core.config import settings

logger = logging.getLogger("uvicorn")

# Seed Products Dataset
SAMPLE_PRODUCTS = [
    # --- FOOTWEAR & SPORTS ---
    {
        "id": "prod_101",
        "name": "Nike Air Zoom Pegasus 40 Running Shoes",
        "category": "Footwear",
        "sub_category": "Sports Shoes",
        "price": 1499.00,
        "original_price": 2999.00,
        "rating": 4.8,
        "review_count": 245,
        "description": "Engineered mesh running shoes featuring responsive Zoom Air cushioning. Perfect for daily road runs and fitness training.",
        "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
        "tags": ["running", "shoes", "sports", "budget", "fitness", "blue", "breathable"],
        "gender": "Men",
        "seasonal_intent": "All",
        "budget_tier": "Budget",
        "express_delivery": True,
        "specs": {"Brand": "Nike", "Material": "Mesh/Synthetic", "Weight": "280g", "Closure": "Lace-Up"}
    },
    {
        "id": "prod_102",
        "name": "Adidas Ultraboost Light Running Shoes",
        "category": "Footwear",
        "sub_category": "Sports Shoes",
        "price": 3499.00,
        "original_price": 4999.00,
        "rating": 4.7,
        "review_count": 182,
        "description": "Ultra lightweight energy-returning Boost midsole with Continental rubber outsole for maximum grip in all weather conditions.",
        "image_url": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80",
        "tags": ["running", "shoes", "black", "cushioning", "premium", "fashion"],
        "gender": "Unisex",
        "seasonal_intent": "All",
        "budget_tier": "Mid",
        "express_delivery": True,
        "specs": {"Brand": "Adidas", "Material": "Primeknit", "Weight": "260g"}
    },
    {
        "id": "prod_103",
        "name": "Puma Classic White Casual Sneakers",
        "category": "Footwear",
        "sub_category": "Casual Shoes",
        "price": 1199.00,
        "original_price": 1999.00,
        "rating": 4.5,
        "review_count": 310,
        "description": "Timeless low-top minimalist leather sneakers. Pairs effortlessly with denim jeans, casual shorts, and summer shirts.",
        "image_url": "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80",
        "tags": ["white", "sneakers", "casual", "budget", "fashion", "minimalist"],
        "gender": "Unisex",
        "seasonal_intent": "Summer",
        "budget_tier": "Budget",
        "express_delivery": True,
        "specs": {"Brand": "Puma", "Material": "Synthetic Leather"}
    },

    # --- FASHION & CLOTHING ---
    {
        "id": "prod_104",
        "name": "Slim-Fit Oxford Blue Formal Shirt",
        "category": "Fashion",
        "sub_category": "Men Shirts",
        "price": 1299.00,
        "original_price": 1999.00,
        "rating": 4.6,
        "review_count": 140,
        "description": "100% breathable Egyptian cotton formal shirt. Perfect tailored fit for office meetings, weddings, and formal dining.",
        "image_url": "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80",
        "tags": ["blue", "formal", "shirt", "office", "cotton", "budget", "fashion"],
        "gender": "Men",
        "seasonal_intent": "All",
        "budget_tier": "Budget",
        "express_delivery": True,
        "specs": {"Fabric": "100% Cotton", "Pattern": "Solid", "Fit": "Slim"}
    },
    {
        "id": "prod_105",
        "name": "Vintage Black Leather Biker Jacket",
        "category": "Fashion",
        "sub_category": "Jackets",
        "price": 4200.00,
        "original_price": 5999.00,
        "rating": 4.9,
        "review_count": 88,
        "description": "Handcrafted genuine leather jacket with asymmetrical zip front, quilted shoulder pads, and warm thermal lining.",
        "image_url": "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80",
        "tags": ["black", "leather", "jacket", "winter", "biker", "fashion", "matching"],
        "gender": "Men",
        "seasonal_intent": "Winter",
        "budget_tier": "Premium",
        "express_delivery": False,
        "specs": {"Outer": "Genuine Leather", "Lining": "Viscose", "Closure": "Zipper"}
    },
    {
        "id": "prod_106",
        "name": "Floral Print Summer Sundress",
        "category": "Fashion",
        "sub_category": "Dresses",
        "price": 1450.00,
        "original_price": 2200.00,
        "rating": 4.7,
        "review_count": 195,
        "description": "Lightweight breathable rayon sundress featuring vibrant tropical floral patterns and a flared A-line silhouette.",
        "image_url": "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80",
        "tags": ["dress", "floral", "summer", "yellow", "casual", "budget", "vacation"],
        "gender": "Women",
        "seasonal_intent": "Summer",
        "budget_tier": "Budget",
        "express_delivery": True,
        "specs": {"Fabric": "Rayon", "Length": "Midi", "Sleeve": "Sleeveless"}
    },

    # --- ELECTRONICS & GADGETS ---
    {
        "id": "prod_107",
        "name": "Asus ROG Strix Budget Gaming Laptop 15.6\"",
        "category": "Electronics",
        "sub_category": "Laptops",
        "price": 48500.00,
        "original_price": 56000.00,
        "rating": 4.8,
        "review_count": 412,
        "description": "Powered by AMD Ryzen 7 7735HS, NVIDIA GeForce RTX 3050, 16GB DDR5 RAM, 512GB NVMe SSD, and 144Hz IPS display.",
        "image_url": "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80",
        "tags": ["laptop", "gaming", "budget", "asus", "rtx", "electronics", "fast"],
        "gender": "Unisex",
        "seasonal_intent": "All",
        "budget_tier": "Budget",
        "express_delivery": True,
        "specs": {"Processor": "Ryzen 7", "RAM": "16GB", "Storage": "512GB SSD", "GPU": "RTX 3050"}
    },
    {
        "id": "prod_108",
        "name": "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
        "category": "Electronics",
        "sub_category": "Audio",
        "price": 24990.00,
        "original_price": 29990.00,
        "rating": 4.9,
        "review_count": 520,
        "description": "Industry leading active noise cancellation with 8 microphones, 30 hour battery life, crystal clear hands-free calling, and LDAC audio.",
        "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
        "tags": ["headphones", "sony", "audio", "noise canceling", "black", "wireless", "premium"],
        "gender": "Unisex",
        "seasonal_intent": "All",
        "budget_tier": "Premium",
        "express_delivery": True,
        "specs": {"Battery": "30 Hours", "ANC": "Yes", "Weight": "250g"}
    },
    {
        "id": "prod_109",
        "name": "Apple Watch Series 9 GPS 45mm Midnight",
        "category": "Electronics",
        "sub_category": "Smartwatches",
        "price": 38900.00,
        "original_price": 41900.00,
        "rating": 4.8,
        "review_count": 290,
        "description": "Advanced S9 SiP processor, double tap gesture control, brighter always-on Retina display, ECG monitoring, and crash detection.",
        "image_url": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80",
        "tags": ["apple", "smartwatch", "fitness", "health", "black", "gadget", "urgent"],
        "gender": "Unisex",
        "seasonal_intent": "All",
        "budget_tier": "Premium",
        "express_delivery": True,
        "specs": {"Case Size": "45mm", "Display": "OLED", "Water Resistance": "50m"}
    },

    # --- ACCESSORIES & LIFESTYLE ---
    {
        "id": "prod_110",
        "name": "Waterproof Travel Laptop Backpack 30L",
        "category": "Accessories",
        "sub_category": "Bags",
        "price": 1150.00,
        "original_price": 1899.00,
        "rating": 4.6,
        "review_count": 340,
        "description": "Durable Oxford polyester backpack with padded 15.6 inch laptop sleeve, USB charging port, anti-theft back pocket, and rain cover.",
        "image_url": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
        "tags": ["backpack", "bag", "travel", "laptop", "budget", "waterproof", "black"],
        "gender": "Unisex",
        "seasonal_intent": "Monsoon",
        "budget_tier": "Budget",
        "express_delivery": True,
        "specs": {"Capacity": "30L", "Material": "Oxford Fabric", "Laptop Sleeve": "15.6 inch"}
    },
    {
        "id": "prod_111",
        "name": "Polarized UV400 Aviator Sunglasses",
        "category": "Accessories",
        "sub_category": "Eyewear",
        "price": 899.00,
        "original_price": 1499.00,
        "rating": 4.5,
        "review_count": 160,
        "description": "Classic metal frame aviator sunglasses with HD polarized lenses eliminating glare during driving and beach outdoor activities.",
        "image_url": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
        "tags": ["sunglasses", "aviator", "summer", "fashion", "gold", "budget", "beach"],
        "gender": "Unisex",
        "seasonal_intent": "Summer",
        "budget_tier": "Budget",
        "express_delivery": True,
        "specs": {"Lens": "Polarized Tac", "Frame": "Stainless Steel"}
    },
    {
        "id": "prod_112",
        "name": "Minimalist Matte Black Ceramic Coffee Mug",
        "category": "Home",
        "sub_category": "Kitchenware",
        "price": 499.00,
        "original_price": 799.00,
        "rating": 4.9,
        "review_count": 480,
        "description": "Microwave and dishwasher safe 400ml ceramic mug with ergonomic handle. Keeps coffee and tea hot for longer.",
        "image_url": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
        "tags": ["mug", "coffee", "black", "home", "ceramic", "budget", "kitchen"],
        "gender": "Unisex",
        "seasonal_intent": "Winter",
        "budget_tier": "Budget",
        "express_delivery": True,
        "specs": {"Volume": "400ml", "Material": "Ceramic"}
    }
]

def generate_mock_embedding(seed_str: str, dim: int = 512):
    """Generates a deterministic normalized pseudo-embedding vector for similarity indexing."""
    random.seed(hash(seed_str) % (2**32))
    vec = [random.uniform(-1.0, 1.0) for _ in range(dim)]
    norm = sum(x**2 for x in vec) ** 0.5
    return [round(x / norm, 6) for x in vec]

async def seed_database():
    logger.info("Connecting to Database Manager for Seeding...")
    await db_manager.connect_to_database(settings.MONGODB_URL, settings.DATABASE_NAME)
    collection = db_manager.get_collection("products")

    logger.info("Populating Catalog Seed Products...")
    for prod in SAMPLE_PRODUCTS:
        # Precalculate normalized embedding vector for PyTorch CLIP / FAISS compatibility
        embedding_key = f"{prod['name']} {prod['category']} {' '.join(prod['tags'])}"
        prod["embedding"] = generate_mock_embedding(embedding_key)

        await collection.update_one(
            {"id": prod["id"]},
            {"$set": prod},
            upsert=True
        )

    logger.info(f"Successfully seeded {len(SAMPLE_PRODUCTS)} products into database.")

if __name__ == "__main__":
    asyncio.run(seed_database())
