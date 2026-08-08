import faiss
import numpy as np
import pandas as pd
import torch
import sys
import os

# Allow imports from root directory
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models.candidate_two_tower import ItemTower, UserTower

class VectorSearchEngine:
    def __init__(self, embedding_dim=128):
        self.embedding_dim = embedding_dim
        # Flat Inner Product index on normalized vectors = Cosine Similarity Search
        self.index = faiss.IndexFlatIP(self.embedding_dim)
        self.items_df = None
        self.item_tower = None
        self.user_tower = None

    def initialize_and_build_index(self, items_path="data/items.csv"):
        print("⚡ Building Faiss Vector Index...")
        self.items_df = pd.read_csv(items_path)
        num_items = len(self.items_df)

        self.item_tower = ItemTower(num_items=num_items, embedding_dim=self.embedding_dim)
        self.user_tower = UserTower(num_users=1000, embedding_dim=self.embedding_dim)
        self.item_tower.eval()
        self.user_tower.eval()

        with torch.no_grad():
            item_ids = torch.tensor(self.items_df["item_id"].values, dtype=torch.long)
            item_embeddings = self.item_tower(item_ids).numpy()

        self.index.add(item_embeddings)
        print(f"✅ Faiss Index ready with {self.index.ntotal} item vectors!")

    def search_candidates(self, user_id=0, top_k=50):
        with torch.no_grad():
            user_tensor = torch.tensor([user_id], dtype=torch.long)
            user_vec = self.user_tower(user_tensor).numpy()

        scores, indices = self.index.search(user_vec, top_k)
        results = []
        for idx, score in zip(indices[0], scores[0]):
            item_row = self.items_df.iloc[idx].to_dict()
            item_row["retrieval_score"] = float(score)
            results.append(item_row)
        return results

if __name__ == "__main__":
    engine = VectorSearchEngine()
    engine.initialize_and_build_index()
    res = engine.search_candidates(user_id=1, top_k=3)
    print("\n🔍 Test Candidate Retrieval Output:")
    for item in res:
        print(f"   • Item ID {item['item_id']} | {item['title']} | Category: {item['category']} | Score: {item['retrieval_score']:.4f}")