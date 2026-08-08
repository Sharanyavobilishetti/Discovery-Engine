import asyncio
from main import app
from fastapi.testclient import TestClient
from seed_data import seed_database

async def main():
    await seed_database()
    
    client = TestClient(app)
    
    # 1. Test List Products
    res = client.get("/api/v1/products")
    print("1. GET /api/v1/products -> Status:", res.status_code, "Count:", len(res.json()))
    assert res.status_code == 200
    assert len(res.json()) > 0
    
    # 2. Test Get Categories
    res = client.get("/api/v1/products/categories")
    print("2. GET /api/v1/products/categories -> Status:", res.status_code, "Categories:", [c["category"] for c in res.json()])
    assert res.status_code == 200
    
    # 3. Test Search Products
    res = client.get("/api/v1/products/search?q=running")
    print("3. GET /api/v1/products/search?q=running -> Status:", res.status_code, "Matches:", [p["name"] for p in res.json()])
    assert res.status_code == 200
    
    # 4. Test Single Product Detail
    res = client.get("/api/v1/products/prod_101")
    print("4. GET /api/v1/products/prod_101 -> Status:", res.status_code, "Product Name:", res.json().get("name"))
    assert res.status_code == 200
    
    print("\nPhase 2 Backend Verification Passed Successfully!")

if __name__ == "__main__":
    asyncio.run(main())
