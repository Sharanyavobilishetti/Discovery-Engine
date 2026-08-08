from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.models import Order, OrderItem, Product, User, UserInteraction
from app.schemas.pydantic_schemas import OrderCreate, OrderResponse
from app.routers.auth import get_current_user

router = APIRouter(prefix="/api/orders", tags=["Orders"])

@router.post("", response_model=OrderResponse)
def create_order(req: OrderCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not req.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    total_amount = 0.0
    order_items_data = []

    for item in req.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            continue
        line_total = product.price * item.quantity
        total_amount += line_total
        order_items_data.append({
            "product_id": product.id,
            "price": product.price,
            "quantity": item.quantity,
            "title": product.title,
            "image_url": product.image_url
        })

    new_order = Order(
        user_id=current_user.id,
        total_amount=total_amount,
        shipping_address=req.shipping_address,
        status="completed"
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    for o_item in order_items_data:
        db_item = OrderItem(
            order_id=new_order.id,
            product_id=o_item["product_id"],
            price=o_item["price"],
            quantity=o_item["quantity"]
        )
        db.add(db_item)

        # Log purchase interaction for Collaborative Filtering & FBT
        interaction = UserInteraction(
            user_id=current_user.id,
            product_id=o_item["product_id"],
            action="purchase",
            score=5.0
        )
        db.add(interaction)

    db.commit()

    return {
        "id": new_order.id,
        "total_amount": new_order.total_amount,
        "status": new_order.status,
        "shipping_address": new_order.shipping_address,
        "created_at": new_order.created_at,
        "items": order_items_data
    }

@router.get("", response_model=List[OrderResponse])
def get_user_orders(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    orders = db.query(Order).filter(Order.user_id == current_user.id).order_by(Order.created_at.desc()).all()
    res = []
    for order in orders:
        items_data = []
        for item in order.items:
            items_data.append({
                "product_id": item.product_id,
                "price": item.price,
                "quantity": item.quantity,
                "title": item.product.title if item.product else "Product",
                "image_url": item.product.image_url if item.product else ""
            })
        res.append({
            "id": order.id,
            "total_amount": order.total_amount,
            "status": order.status,
            "shipping_address": order.shipping_address,
            "created_at": order.created_at,
            "items": items_data
        })
    return res
