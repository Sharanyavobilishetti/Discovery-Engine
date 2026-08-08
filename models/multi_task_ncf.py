import torch
import torch.nn as nn

class MultiTaskNCF(nn.Module):
    """Predicts Click, Cart, and Purchase likelihoods simultaneously."""
    def __init__(self, num_users=1000, num_items=500, embedding_dim=64):
        super().__init__()
        self.user_embed = nn.Embedding(num_users, embedding_dim)
        self.item_embed = nn.Embedding(num_items, embedding_dim)
        
        # Shared-bottom neural layers
        self.shared_layer = nn.Sequential(
            nn.Linear(embedding_dim * 2, 128),
            nn.ReLU(),
            nn.Linear(128, 64),
            nn.ReLU()
        )
        
        # Multi-task heads for micro-intents
        self.click_head = nn.Linear(64, 1)
        self.cart_head = nn.Linear(64, 1)
        self.purchase_head = nn.Linear(64, 1)

    def forward(self, user_ids, item_ids):
        u = self.user_embed(user_ids)
        i = self.item_embed(item_ids)
        x = torch.cat([u, i], dim=-1)
        shared = self.shared_layer(x)
        
        return {
            "p_click": torch.sigmoid(self.click_head(shared)),
            "p_cart": torch.sigmoid(self.cart_head(shared)),
            "p_purchase": torch.sigmoid(self.purchase_head(shared))
        }

if __name__ == "__main__":
    model = MultiTaskNCF()
    test_users = torch.tensor([1, 1, 1], dtype=torch.long)
    test_items = torch.tensor([449, 437, 305], dtype=torch.long)
    outputs = model(test_users, test_items)
    print("✅ Multi-Task NCF Model Output test successful:")
    print("   • p_cart shape:", outputs["p_cart"].shape)