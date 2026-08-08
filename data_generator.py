import os
import pandas as pd
import numpy as np

def generate_mock_data():
    print("⏳ Generating synthetic H&M style dataset with product images...")
    os.makedirs("data", exist_ok=True)
    
    np.random.seed(42)
    num_users = 1000
    num_items = 500
    num_interactions = 10000
    
    # Image pools for each category (High-res Unsplash Fashion Photos)
    category_images = {
        "Dresses": [
            "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&auto=format&fit=crop&q=80"
        ],
        "Footwear": [
            "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&auto=format&fit=crop&q=80"
        ],
        "Accessories": [
            "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=400&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=400&auto=format&fit=crop&q=80"
        ],
        "Outerwear": [
            "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1544441893-675973e31985?w=400&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&auto=format&fit=crop&q=80"
        ],
        "Tops": [
            "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&auto=format&fit=crop&q=80"
        ],
        "Bottoms": [
            "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=400&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=400&auto=format&fit=crop&q=80"
        ]
    }
    
    categories = list(category_images.keys())
    
    # Generate Items
    item_categories = np.random.choice(categories, size=num_items)
    item_images = [np.random.choice(category_images[cat]) for cat in item_categories]
    
    items = pd.DataFrame({
        "item_id": np.arange(num_items),
        "title": [f"Product_{i}" for i in range(num_items)],
        "category": item_categories,
        "price": np.round(np.random.uniform(15.0, 180.0, size=num_items), 2),
        "image_url": item_images
    })
    items.to_csv("data/items.csv", index=False)
    
    # Generate Interactions
    user_ids = np.random.randint(0, num_users, size=num_interactions)
    item_ids = np.random.randint(0, num_items, size=num_interactions)
    actions = np.random.choice([0, 1, 2, 3], size=num_interactions, p=[0.5, 0.3, 0.15, 0.05])
    
    interactions = pd.DataFrame({
        "user_id": user_ids,
        "item_id": item_ids,
        "action": actions,
        "timestamp": pd.date_range(start="2026-01-01", periods=num_interactions, freq="min")
    })
    interactions.to_csv("data/interactions.csv", index=False)
    print("✅ Dataset with product images generated successfully!")

if __name__ == "__main__":
    generate_mock_data()