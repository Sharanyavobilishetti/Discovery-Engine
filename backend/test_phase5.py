import asyncio
from main import app
from fastapi.testclient import TestClient
from seed_data import seed_database

async def main():
    await seed_database()
    client = TestClient(app)
    
    # 1. Test Recommendations for Budget Intent
    res = client.get("/api/v1/recommendations?intent=Budget%20shopping&limit=5")
    print("1. GET /recommendations?intent=Budget shopping -> Status:", res.status_code)
    assert res.status_code == 200
    items = res.json()
    print("   Top Pick:", items[0]["name"], "| Price: Rs." + str(items[0]["price"]), "| Hybrid Score:", items[0]["hybrid_score"])
    print("   Explanation:", items[0]["explanation"])
    
    # 2. Test Recommendations for Urgent Intent
    res = client.get("/api/v1/recommendations?intent=Urgent%20purchase&limit=5")
    print("2. GET /recommendations?intent=Urgent purchase -> Status:", res.status_code)
    assert res.status_code == 200
    items = res.json()
    print("   Top Pick:", items[0]["name"], "| Express Delivery:", items[0]["express_delivery"], "| Score:", items[0]["hybrid_score"])
    
    # 3. Test Similar Products for prod_101 (Nike Pegasus Shoes)
    res = client.get("/api/v1/recommendations/similar/prod_101?limit=3")
    print("3. GET /recommendations/similar/prod_101 -> Status:", res.status_code)
    assert res.status_code == 200
    sim_items = res.json()
    print("   Top Similar Item:", sim_items[0]["name"], "| Similarity:", sim_items[0]["similarity_score"])
    
    print("\nPhase 5 Hybrid Recommendation Engine Verification Passed Successfully!")

if __name__ == "__main__":
    asyncio.run(main())
