from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# Auth Schemas
class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str
    role: Optional[str] = "customer"

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    avatar_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Category Schemas
class CategorySchema(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str] = None
    image_url: Optional[str] = None

    class Config:
        from_attributes = True

# Product Schemas
class ProductSchema(BaseModel):
    id: int
    title: str
    description: str
    price: float
    category_id: int
    brand: str
    image_url: str
    rating: float
    reviews_count: int
    is_trending: bool
    is_new_arrival: bool
    tags: Optional[str] = None
    features: Optional[str] = None
    color: Optional[str] = None
    gender: Optional[str] = None
    stock: int
    category_name: Optional[str] = None
    explanation: Optional[str] = None
    match_score: Optional[float] = None

    class Config:
        from_attributes = True

class ProductListResponse(BaseModel):
    items: List[ProductSchema]
    total: int
    page: int
    size: int
    pages: int

# Track Behavior Interaction Schema
class TrackInteractionRequest(BaseModel):
    product_id: int
    action: str  # view, click, cart, search, purchase
    session_id: Optional[str] = None
    duration_seconds: Optional[int] = 5
    metadata: Optional[str] = None

# Semantic Search Request/Response
class SemanticSearchRequest(BaseModel):
    query: str
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    category_id: Optional[int] = None
    session_id: Optional[str] = None

class SearchResultResponse(BaseModel):
    query: str
    detected_intent: str
    extracted_budget: Optional[float] = None
    extracted_tags: List[str] = []
    total_found: int
    latency_ms: float
    results: List[ProductSchema]

# Recommendation Request/Response
class RecommendationResponse(BaseModel):
    algorithm: str
    description: str
    detected_session_intents: List[str] = []
    products: List[ProductSchema]

# Order Schemas
class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int

class OrderCreate(BaseModel):
    items: List[OrderItemCreate]
    shipping_address: str

class OrderResponse(BaseModel):
    id: int
    total_amount: float
    status: str
    shipping_address: Optional[str]
    created_at: datetime
    items: List[dict]

    class Config:
        from_attributes = True

# RAG Shopping Assistant Request/Response
class ChatAssistantRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    current_product_id: Optional[int] = None

class ChatAssistantResponse(BaseModel):
    reply: str
    intent_summary: str
    suggested_products: List[ProductSchema] = []
    suggested_queries: List[str] = []

# Admin Dashboard Stats Response
class AdminDashboardStats(BaseModel):
    total_users: int
    total_products: int
    total_orders: int
    total_revenue: float
    recommendation_ctr: float
    top_search_queries: List[dict]
    sales_over_time: List[dict]
    category_distribution: List[dict]
    active_intents: List[dict]
