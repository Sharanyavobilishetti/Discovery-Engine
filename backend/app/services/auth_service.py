from typing import Optional, Dict, Any, List
from app.db.mongodb import get_database
from app.core.security import get_password_hash, verify_password, create_access_token, decode_access_token
from app.models.user import UserCreate, UserLogin
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
import uuid

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

class AuthService:
    @staticmethod
    async def register_user(user_in: UserCreate) -> Dict[str, Any]:
        db = get_database()
        users_col = db.get_collection("users")
        
        # Check if user email already exists
        existing = await users_col.find_one({"email": user_in.email.lower()})
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Account with this email already exists."
            )
            
        user_id = f"usr_{uuid.uuid4().hex[:8]}"
        hashed_pwd = get_password_hash(user_in.password)
        
        user_doc = {
            "id": user_id,
            "email": user_in.email.lower(),
            "full_name": user_in.full_name,
            "hashed_password": hashed_pwd,
            "preferred_categories": [],
            "active_intent": "Casual browsing",
            "cart": [],
            "wishlist": []
        }
        
        await users_col.insert_one(user_doc)
        
        token = create_access_token(user_id)
        user_response = {k: v for k, v in user_doc.items() if k != "hashed_password"}
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": user_response
        }

    @staticmethod
    async def authenticate_user(login_in: UserLogin) -> Dict[str, Any]:
        db = get_database()
        users_col = db.get_collection("users")
        
        user_doc = await users_col.find_one({"email": login_in.email.lower()})
        if not user_doc or not verify_password(login_in.password, user_doc.get("hashed_password", "")):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password."
            )
            
        token = create_access_token(user_doc["id"])
        user_response = {k: v for k, v in user_doc.items() if k != "hashed_password"}
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": user_response
        }

    @staticmethod
    async def get_current_user(token: str = Depends(oauth2_scheme)) -> Dict[str, Any]:
        user_id = decode_access_token(token)
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired authentication token."
            )
            
        db = get_database()
        users_col = db.get_collection("users")
        user_doc = await users_col.find_one({"id": user_id})
        if not user_doc:
            raise HTTPException(status_code=404, detail="User account not found.")
            
        return {k: v for k, v in user_doc.items() if k != "hashed_password"}

    @staticmethod
    async def add_to_cart(user_id: str, product_id: str, quantity: int = 1) -> List[Dict[str, Any]]:
        db = get_database()
        users_col = db.get_collection("users")
        user = await users_col.find_one({"id": user_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found.")
            
        cart = user.get("cart", [])
        found = False
        for item in cart:
            if item.get("product_id") == product_id:
                item["quantity"] = item.get("quantity", 1) + quantity
                found = True
                break
        if not found:
            cart.append({"product_id": product_id, "quantity": quantity})
            
        await users_col.update_one({"id": user_id}, {"$set": {"cart": cart}})
        return cart

    @staticmethod
    async def remove_from_cart(user_id: str, product_id: str) -> List[Dict[str, Any]]:
        db = get_database()
        users_col = db.get_collection("users")
        user = await users_col.find_one({"id": user_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found.")
            
        cart = [item for item in user.get("cart", []) if item.get("product_id") != product_id]
        await users_col.update_one({"id": user_id}, {"$set": {"cart": cart}})
        return cart

    @staticmethod
    async def toggle_wishlist(user_id: str, product_id: str) -> List[str]:
        db = get_database()
        users_col = db.get_collection("users")
        user = await users_col.find_one({"id": user_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found.")
            
        wishlist = user.get("wishlist", [])
        if product_id in wishlist:
            wishlist.remove(product_id)
        else:
            wishlist.append(product_id)
            
        await users_col.update_one({"id": user_id}, {"$set": {"wishlist": wishlist}})
        return wishlist
