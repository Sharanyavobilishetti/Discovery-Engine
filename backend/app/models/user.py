from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any

class UserBase(BaseModel):
    email: str = Field(..., example="user@example.com")
    full_name: str = Field(..., example="Alex Johnson")

class UserCreate(UserBase):
    password: str = Field(..., min_length=6, example="password123")

class UserLogin(BaseModel):
    email: str = Field(..., example="user@example.com")
    password: str = Field(..., example="password123")

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class CartItem(BaseModel):
    product_id: str
    quantity: int = Field(1, ge=1)
    added_at: Optional[str] = None

class CartRequest(BaseModel):
    product_id: str
    quantity: int = 1

class UserProfile(UserBase):
    id: str
    preferred_categories: List[str] = Field(default_factory=list)
    active_intent: Optional[str] = Field("Casual browsing")
    cart: List[CartItem] = Field(default_factory=list)
    wishlist: List[str] = Field(default_factory=list) # product_ids

class UserInDB(UserProfile):
    hashed_password: str
