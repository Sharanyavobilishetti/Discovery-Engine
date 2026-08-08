import os
import sys
import time
import pandas as pd
import torch

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.multi_task_ncf import MultiTaskNCF
from serving.guardrails import apply_diversity_guardrail
from serving.vector_search import VectorSearchEngine


class DiscoveryEnginePipeline:

  def __init__(self):
    print("🚀 Initializing Discovery Engine Pipeline...")
    self.search_engine = VectorSearchEngine()
    self.search_engine.initialize_and_build_index()
    self.mt_ncf = MultiTaskNCF()
    self.mt_ncf.eval()
    print("✅ Pipeline ready with Micro-Intent Contextualization!")

  def get_recommendations(
      self,
      user_id=1,
      top_k=8,
      query="",
      is_cold_start=False,
      micro_intent="Seasonal Browsing",
  ):
    start_time = time.time()

    # 1. Candidate Retrieval Stage
    t0 = time.time()
    if is_cold_start:
      candidates = self.search_engine.items_df.sample(
          frac=1.0, random_state=42
      ).to_dict("records")
      for c in candidates:
        c["final_score"] = 0.85
    else:
      candidates = self.search_engine.search_candidates(
          user_id=user_id, top_k=100
      )

    retrieval_ms = (time.time() - t0) * 1000

    # Query Filtering
    if query and query.strip():
      q_terms = query.strip().lower().split()
      filtered = [
          c
          for c in candidates
          if any(
              term in c["category"].lower() or term in c["title"].lower()
              for term in q_terms
          )
      ]
      if filtered:
        candidates = filtered

    # 2. Multi-Task NCF Scoring Stage
    t1 = time.time()
    if not is_cold_start:
      item_ids = torch.tensor(
          [c["item_id"] for c in candidates], dtype=torch.long
      )
      user_ids = torch.tensor([user_id] * len(candidates), dtype=torch.long)

      with torch.no_grad():
        preds = self.mt_ncf(user_ids, item_ids)
        p_cart = preds["p_cart"].squeeze().numpy()
        if p_cart.ndim == 0:
          p_cart = [float(p_cart)]

      for idx, c in enumerate(candidates):
        c["final_score"] = float(p_cart[idx])

      candidates.sort(key=lambda x: x["final_score"], reverse=True)

    scoring_ms = (time.time() - t1) * 1000

    # 3. Micro-Intent Contextual Reranking 🎯
    if micro_intent == "Bargain Hunting":
      # Sort candidates by price ascending (cheapest items first)
      candidates.sort(key=lambda x: float(x["price"]))
    elif micro_intent == "Urgent Purchase":
      # Strictly top match scores with high confidence
      candidates.sort(key=lambda x: x["final_score"], reverse=True)

    # 4. Guardrail Diversity Stage
    t2 = time.time()
    final_recs = apply_diversity_guardrail(
        candidates, max_pct=0.35, top_k=top_k
    )
    guardrail_ms = (time.time() - t2) * 1000

    total_latency_ms = (time.time() - start_time) * 1000

    return {
        "items": final_recs,
        "latency_ms": round(total_latency_ms, 2),
        "stage_latency": {
            "Retrieval (Two-Tower)": round(retrieval_ms, 2),
            "Scoring (Multi-Task NCF)": round(scoring_ms, 2),
            "Guardrails & Diversity": round(guardrail_ms, 2),
        },
        "is_cold_start": is_cold_start,
        "micro_intent": micro_intent,
    }