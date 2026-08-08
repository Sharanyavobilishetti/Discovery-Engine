import sys
import os

sys.path.insert(0, os.path.abspath("backend"))

try:
    print("Testing backend modules import...")
    from app.database import engine, Base, SessionLocal
    from app.models.models import User, Product, Category, Order, Wishlist
    from app.services.seed_data import seed_database
    from app.services.ai_engine import AIEngine
    from app.services.semantic_search import semantic_search_engine
    from app.main import app

    print("All backend imports succeeded!")

    db = SessionLocal()
    seed_database(db)
    print("Database seeding test: SUCCESS")

    intents = AIEngine.extract_session_intents(db)
    print(f"AI Engine test: SUCCESS (intents={intents})")

    res = semantic_search_engine.search(db, "comfortable running shoes under 3000")
    print(f"Semantic Search test: SUCCESS (found {res['total_found']} items)")

    db.close()
    print("--- ALL BACKEND VERIFICATIONS PASSED CLEANLY ---")
except Exception as e:
    import traceback
    print("BACKEND ERROR DETECTED:")
    traceback.print_exc()
