import asyncio
from main import app
from fastapi.testclient import TestClient
from seed_data import seed_database

async def main():
    await seed_database()
    client = TestClient(app)
    
    # 1. Register User
    reg_data = {
        "email": "testuser@example.com",
        "full_name": "Test User",
        "password": "secretpassword123"
    }
    res = client.post("/api/v1/auth/register", json=reg_data)
    print("1. POST /api/v1/auth/register -> Status:", res.status_code)
    assert res.status_code == 201
    token = res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # 2. Get User Profile
    res = client.get("/api/v1/auth/me", headers=headers)
    print("2. GET /api/v1/auth/me -> Status:", res.status_code, "Email:", res.json()["email"])
    assert res.status_code == 200
    
    # 3. Add item to Cart
    res = client.post("/api/v1/user/cart", json={"product_id": "prod_101", "quantity": 2}, headers=headers)
    print("3. POST /api/v1/user/cart -> Status:", res.status_code, "Cart:", res.json()["cart"])
    assert res.status_code == 200
    
    # 4. View Cart
    res = client.get("/api/v1/user/cart", headers=headers)
    print("4. GET /api/v1/user/cart -> Status:", res.status_code, "Items in Cart:", res.json()["count"])
    assert res.status_code == 200
    assert res.json()["count"] == 1
    
    # 5. Toggle Wishlist
    res = client.post("/api/v1/user/wishlist/prod_104", headers=headers)
    print("5. POST /api/v1/user/wishlist/prod_104 -> Status:", res.status_code, "Wishlist:", res.json()["wishlist"])
    assert res.status_code == 200
    
    # 6. View Wishlist
    res = client.get("/api/v1/user/wishlist", headers=headers)
    print("6. GET /api/v1/user/wishlist -> Status:", res.status_code, "Wishlist Count:", res.json()["count"])
    assert res.status_code == 200
    assert res.json()["count"] == 1
    
    print("\nPhase 3 Backend Verification Passed Successfully!")

if __name__ == "__main__":
    asyncio.run(main())
