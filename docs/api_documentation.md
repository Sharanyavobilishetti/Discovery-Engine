# REST API Documentation - Findora Discovery Engine

Base URL: `http://localhost:8000/api`

---

## Authentication Endpoints (`/api/auth`)

### `POST /api/auth/register`
Creates a new customer account.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "secretpassword",
    "full_name": "Jane Doe"
  }
  ```
- **Response**: JWT Token + User profile object.

### `POST /api/auth/login`
Authenticates existing credentials.
- **Response**: `access_token` JWT string.

---

## Recommendation Endpoints (`/api/recommendations`)

### `GET /api/recommendations/two-tower`
Fetches Two-Tower intent-matched product recommendations.
- **Query Parameters**:
  - `session_id` (string): Active session ID for real-time intent vector calculation.
  - `limit` (int, default=8): Number of items to return.
- **Response**: Array of product objects containing `match_score` (e.g. `0.94`) and `explanation` (e.g. `"Matches your search for running shoes"`).

### `GET /api/recommendations/content-based/{product_id}`
Returns similar products based on feature similarity.

### `GET /api/recommendations/frequently-bought-together/{product_id}`
Returns co-purchased item bundles.

### `GET /api/recommendations/complete-the-look/{product_id}`
Returns style/outfit complementary items across categories.

### `GET /api/recommendations/cold-start`
Returns top trending fallback items for new shoppers.

---

## Search Endpoints (`/api/search`)

### `POST /api/search/semantic`
Performs FAISS natural language vector search.
- **Request Body**:
  ```json
  {
    "query": "I need comfortable black running shoes under ₹3000",
    "session_id": "sess_12345"
  }
  ```
- **Response**:
  ```json
  {
    "query": "I need comfortable black running shoes under ₹3000",
    "detected_intent": "Budget <= ₹3000 ; Colors: black ; Intents: Footwear",
    "extracted_budget": 3000.0,
    "total_found": 4,
    "latency_ms": 14.2,
    "results": [...]
  }
  ```

### `POST /api/search/assistant`
Interacts with the AI RAG Shopping Assistant for advice, comparisons, and recommendations.

---

## Dashboard Endpoints (`/api/dashboard`)

### `GET /api/dashboard/stats`
Returns metrics for total users, total revenue, recommendation CTR %, top queries, category distribution, and intent velocity for Chart.js rendering.
