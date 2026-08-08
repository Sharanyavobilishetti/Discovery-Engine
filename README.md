# 🧭 Findora - AI-Powered Personalized Multi-Intent E-Commerce Discovery Engine

[![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20FastAPI%20%7C%20PyTorch%20%7C%20FAISS-teal)](https://github.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**Findora** is a production-ready e-commerce Discovery Engine that provides intelligent product recommendations and natural language semantic product search powered by Artificial Intelligence. It analyzes real-time user session behavior, search intent, and multimodal text/feature embeddings to deliver personalized recommendations with **sub-80ms response latency**.

---

## 🌟 Key Features

- **⚡ Real-Time Multi-Intent Behavior Tracking**: Captures user clicks, views, category switches, cart additions, and price filters to compute dynamic session intent vectors.
- **🗼 Two-Tower Recommendation Model**: Matches User Tower intent vectors against Product Tower feature embeddings in real time with explainable AI match tags (e.g. `94% AI Match`).
- **🔍 FAISS & SentenceTransformers Natural Language Search**: Handles complex natural language queries like *"I need comfortable black running shoes under ₹3000"* with budget parsing, color extraction, and vector similarity ranking.
- **🛍️ Frequently Bought Together & Complete the Look**: Co-purchase bundle matrix and cross-category style outfit pairings.
- **❄️ Cold-Start Recommendation Engine**: Multi-tier fallback strategy (Trending + High Rated + Category Starters) for new guest sessions.
- **🤖 AI RAG Shopping Assistant**: Context-aware floating chat widget providing intelligent shopping advice, item comparisons, and instant product recommendations.
- **📊 Admin Analytics Dashboard**: Interactive Chart.js analytics for search query counts, recommendation CTR, sales revenue, user growth, and active intent velocity.
- **🎨 Modern Responsive UI**: Teal + Blue + Grey glassmorphism design with dark/light mode toggle built using React 18, Material UI v5, and Vite.

---

## 🏗️ Project Architecture

```
discovery-engine/
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI Application Initialization
│   │   ├── config.py                # Database & JWT Settings
│   │   ├── database.py              # SQLAlchemy SQLite Setup
│   │   ├── models/                  # Database Models (User, Product, Order, Wishlist, Intent)
│   │   ├── schemas/                 # Pydantic Request/Response Schemas
│   │   ├── services/
│   │   │   ├── ai_engine.py         # Two-Tower, Content, Collaborative, FBT, Cold-Start
│   │   │   ├── semantic_search.py   # FAISS / SentenceTransformer Vector Search Engine
│   │   │   ├── rag_assistant.py     # AI Shopping Assistant RAG Service
│   │   │   └── seed_data.py         # 50+ Product Seed Data & Demo Users
│   │   └── routers/                 # REST API Endpoints (Auth, Products, Recs, Search, Admin)
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/              # Navbar, Footer, ProductCard, ExplainableBadge, AIAssistant
│   │   ├── context/                 # AuthContext, CartWishlistContext, IntentContext
│   │   ├── pages/                   # Home, ProductListing, Details, SemanticSearch, Recs, Admin
│   │   ├── services/                # Axios API Client
│   │   └── theme/                   # Teal + Blue + Grey MUI Dark/Light Theme
│   ├── package.json
│   └── vite.config.js
├── datasets/                        # Seed Product Datasets
├── architecture/                    # System Diagrams & Documentation
├── docs/                            # API Documentation & Models Reference
└── README.md
```

---

## 🚀 Quick Setup & Installation Guide

### Prerequisites
- Python 3.10+
- Node.js v18+

### 1. Backend Setup (FastAPI)
```bash
# Navigate to workspace root
cd discovery-engine

# Create & activate virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate

# Install Backend Dependencies
pip install -r backend/requirements.txt

# Start FastAPI Backend Server (Runs on http://127.0.0.1:8000)
uvicorn app.main:app --reload --app-dir backend
```
> Note: On initial startup, the backend automatically seeds SQLite database (`findora.db`) with sample products and builds the FAISS vector index.

### 2. Frontend Setup (React + Vite)
```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Run Vite Dev Server (Runs on http://localhost:3000)
npm run dev
```

---

## 🔑 Demo Account Credentials

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Customer** | `alex@example.com` | `alex123` | Personal Dashboard, Wishlist, Order History |
| **Admin** | `admin@findora.com` | `admin123` | Admin Analytics Dashboard, CTR & Revenue Metrics |

---

## 📡 API Reference Overview

- `POST /api/search/semantic`: Vector semantic search (`{"query": "comfortable black running shoes under ₹3000"}`).
- `GET /api/recommendations/two-tower`: Two-tower intent-matched recommendations.
- `POST /api/search/assistant`: AI RAG shopping assistant chat.
- `GET /api/dashboard/stats`: Admin analytics and Chart.js metrics.

For detailed REST API endpoints, read [`docs/api_documentation.md`](file:///c:/Users/rprav/OneDrive/Desktop/Discovery-Engine/docs/api_documentation.md).
