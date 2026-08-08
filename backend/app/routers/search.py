from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import Optional, List

from app.database import get_db
from app.models.models import SearchHistory, Product
from app.schemas.pydantic_schemas import (
    SemanticSearchRequest, SearchResultResponse, ChatAssistantRequest, ChatAssistantResponse
)
from app.services.semantic_search import semantic_search_engine
from app.services.rag_assistant import RAGShoppingAssistant

router = APIRouter(prefix="/api/search", tags=["Semantic Search & AI Assistant"])

@router.post("/semantic", response_model=SearchResultResponse)
def perform_semantic_search(req: SemanticSearchRequest, db: Session = Depends(get_db)):
    """
    Natural Language Vector Semantic Search (<80ms response)
    Processes queries such as: 'I need comfortable black running shoes under ₹3000'
    """
    res = semantic_search_engine.search(db, query=req.query, top_k=12)

    # Log search query history
    history = SearchHistory(
        session_id=req.session_id,
        query=req.query,
        intent_detected=res["detected_intent"],
        results_count=res["total_found"]
    )
    db.add(history)
    db.commit()

    return res

@router.post("/assistant", response_model=ChatAssistantResponse)
def chat_with_rag_assistant(req: ChatAssistantRequest, db: Session = Depends(get_db)):
    """
    AI RAG Shopping Assistant for interactive conversation, styling advice, product comparison
    """
    return RAGShoppingAssistant.answer_query(
        db, query=req.message, session_id=req.session_id, current_product_id=req.current_product_id
    )

@router.get("/suggestions")
def get_search_suggestions(q: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    q_lower = q.lower()
    products = db.query(Product).filter(
        (Product.title.ilike(f"%{q_lower}%")) | (Product.tags.ilike(f"%{q_lower}%"))
    ).limit(6).all()

    suggestions = [p.title for p in products]
    if "running" in q_lower and "running shoes under ₹3000" not in suggestions:
        suggestions.append("comfortable black running shoes under ₹3000")
    if "headphones" in q_lower and "wireless noise-canceling headphones" not in suggestions:
        suggestions.append("wireless noise-canceling headphones")

    return {"query": q, "suggestions": suggestions[:6]}
