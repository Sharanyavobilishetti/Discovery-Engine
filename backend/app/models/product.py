from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class ProductBase(BaseModel):
    name: str = Field(..., example="UltraBook Pro 15 Gaming Laptop")
    category: str = Field(..., example="Electronics")
    sub_category: Optional[str] = Field(None, example="Laptops")
    price: float = Field(..., example="55000.00")
    original_price: Optional[float] = Field(None, example="65000.00")
    rating: float = Field(4.5, ge=0.0, le=5.0)
    review_count: int = Field(0, ge=0)
    description: str
    image_url: str
    tags: List[str] = Field(default_factory=list)
    gender: Optional[str] = Field("Unisex") # Men, Women, Unisex
    seasonal_intent: Optional[str] = Field("All") # Summer, Winter, Monsoon, Holiday, All
    budget_tier: str = Field("Mid", example="Budget") # Budget, Mid, Premium
    express_delivery: bool = Field(False)
    specs: Dict[str, Any] = Field(default_factory=dict)

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: str
    embedding: Optional[List[float]] = None

    class Config:
        json_schema_extra = {
            "example": {
                "id": "prod_101",
                "name": "Nike Air Zoom Running Shoes",
                "category": "Footwear",
                "sub_category": "Sports Shoes",
                "price": 2499.00,
                "rating": 4.7,
                "review_count": 128,
                "description": "High performance breathable mesh running shoes with responsive cushioning.",
                "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
                "tags": ["running", "sports", "shoes", "comfort", "casual"],
                "gender": "Men",
                "seasonal_intent": "All",
                "budget_tier": "Mid",
                "express_delivery": True
            }
        }

class CategoryCount(BaseModel):
    category: str
    count: int
    image_url: str
