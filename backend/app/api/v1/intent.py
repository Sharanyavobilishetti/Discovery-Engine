from fastapi import APIRouter, Body
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

router = APIRouter(prefix="/intent", tags=["Session Shopping Intent AI"])

class SessionIntentRequest(BaseModel):
    clickstream: Optional[List[Dict[str, Any]]] = []
    recent_search: Optional[str] = ""
    cart_items: Optional[List[Dict[str, Any]]] = []
    user_id: Optional[str] = None

class IntentDetectionResponse(BaseModel):
    detected_intent: str
    confidence: float
    reasoning: str
    suggested_filters: Dict[str, Any]

@router.post("/detect", response_model=IntentDetectionResponse)
async def detect_session_intent(session_data: SessionIntentRequest = Body(...)):
    """Analyze real-time session clickstream, search queries, and cart items to dynamically infer active shopping intent."""
    search_q = (session_data.recent_search or "").lower()
    clicks = session_data.clickstream or []
    
    # 1. Budget Intent Evaluation
    if "budget" in search_q or "under" in search_q or "cheap" in search_q or "discount" in search_q:
        return IntentDetectionResponse(
            detected_intent="Budget shopping",
            confidence=0.92,
            reasoning="Detected cost-sensitive search keywords or price filter criteria.",
            suggested_filters={"max_price": 2500, "budget_tier": "budget"}
        )
    
    if clicks:
        avg_price = sum(float(c.get("price", 0)) for c in clicks) / len(clicks)
        if avg_price < 2500:
            return IntentDetectionResponse(
                detected_intent="Budget shopping",
                confidence=0.85,
                reasoning=f"Recent product views average Rs.{round(avg_price)}, indicating budget intent.",
                suggested_filters={"max_price": 2500}
            )

    # 2. Urgent Purchase Intent Evaluation
    if "urgent" in search_q or "fast" in search_q or "today" in search_q or "express" in search_q:
        return IntentDetectionResponse(
            detected_intent="Urgent purchase",
            confidence=0.95,
            reasoning="Explicit request for expedited delivery or immediate fulfillment.",
            suggested_filters={"express_delivery": True}
        )

    # 3. Fashion & Style Intent Evaluation
    fashion_keywords = ["shirt", "dress", "shoes", "wear", "jacket", "style", "outfit", "fashion", "denim", "sneakers"]
    if any(k in search_q for k in fashion_keywords):
        return IntentDetectionResponse(
            detected_intent="Fashion matching",
            confidence=0.88,
            reasoning="Apparel or footwear context detected in search session.",
            suggested_filters={"categories": ["Fashion", "Footwear", "Accessories"]}
        )

    # 4. Seasonal Shopping Intent Evaluation
    seasonal_keywords = ["summer", "winter", "rain", "monsoon", "jacket", "coat", "fan", "ac", "holiday"]
    if any(k in search_q for k in seasonal_keywords):
        return IntentDetectionResponse(
            detected_intent="Seasonal shopping",
            confidence=0.87,
            reasoning="Seasonal product terms identified in search session.",
            suggested_filters={"seasonal": True}
        )

    # 5. Default Exploratory Intent
    return IntentDetectionResponse(
        detected_intent="Casual browsing",
        confidence=0.75,
        reasoning="Exploratory multi-category discovery session.",
        suggested_filters={}
    )
