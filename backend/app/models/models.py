from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="customer") # customer / admin
    avatar_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    orders = relationship("Order", back_populates="user")
    wishlists = relationship("Wishlist", back_populates="user")
    browsing_histories = relationship("BrowsingHistory", back_populates="user")
    search_histories = relationship("SearchHistory", back_populates="user")

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    slug = Column(String, unique=True, nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String, nullable=True)

    products = relationship("Product", back_populates="category")

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=False)
    price = Column(Float, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"))
    brand = Column(String, index=True, nullable=False)
    image_url = Column(String, nullable=False)
    rating = Column(Float, default=4.5)
    reviews_count = Column(Integer, default=120)
    is_trending = Column(Boolean, default=False)
    is_new_arrival = Column(Boolean, default=False)
    tags = Column(String, nullable=True) # Comma-separated tags e.g. "running,breathable,black,sneakers"
    features = Column(Text, nullable=True) # JSON string or descriptive bullet text
    color = Column(String, nullable=True)
    gender = Column(String, nullable=True) # Unisex, Men, Women
    stock = Column(Integer, default=50)
    created_at = Column(DateTime, default=datetime.utcnow)

    category = relationship("Category", back_populates="products")
    order_items = relationship("OrderItem", back_populates="product")
    wishlists = relationship("Wishlist", back_populates="product")

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    total_amount = Column(Float, nullable=False)
    status = Column(String, default="completed") # pending, completed, cancelled
    shipping_address = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    price = Column(Float, nullable=False)
    quantity = Column(Integer, default=1)

    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")

class Wishlist(Base):
    __tablename__ = "wishlist"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="wishlists")
    product = relationship("Product", back_populates="wishlists")

class SearchHistory(Base):
    __tablename__ = "search_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    session_id = Column(String, nullable=True)
    query = Column(String, nullable=False)
    intent_detected = Column(String, nullable=True)
    results_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="search_histories")

class BrowsingHistory(Base):
    __tablename__ = "browsing_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    session_id = Column(String, nullable=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    action_type = Column(String, default="view") # view, click, cart, purchase
    duration_seconds = Column(Integer, default=5)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="browsing_histories")

class UserInteraction(Base):
    __tablename__ = "user_interactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    session_id = Column(String, nullable=True)
    product_id = Column(Integer, nullable=False)
    action = Column(String, nullable=False) # view, click, cart, purchase, search
    score = Column(Float, default=1.0)
    created_at = Column(DateTime, default=datetime.utcnow)

class RecommendationLog(Base):
    __tablename__ = "recommendation_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    session_id = Column(String, nullable=True)
    product_id = Column(Integer, nullable=False)
    algo_used = Column(String, nullable=False) # two_tower, intent_based, collaborative, content_based, fbt, complete_look, cold_start
    clicked = Column(Boolean, default=False)
    rationale = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
