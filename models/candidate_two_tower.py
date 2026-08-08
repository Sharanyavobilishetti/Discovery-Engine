import torch
import torch.nn as nn
import torch.nn.functional as F

class UserTower(nn.Module):
    """Generates a 128-dim vector embedding representing the user's session & intent."""
    def __init__(self, num_users, embedding_dim=128):
        super().__init__()
        self.user_embedding = nn.Embedding(num_users, 64)
        self.fc = nn.Sequential(
            nn.Linear(64, 128),
            nn.ReLU(),
            nn.Linear(128, embedding_dim)
        )

    def forward(self, user_ids):
        x = self.user_embedding(user_ids)
        x = self.fc(x)
        return F.normalize(x, p=2, dim=-1)


class ItemTower(nn.Module):
    """Generates a 128-dim vector embedding representing item attributes."""
    def __init__(self, num_items, embedding_dim=128):
        super().__init__()
        self.item_embedding = nn.Embedding(num_items, 64)
        self.fc = nn.Sequential(
            nn.Linear(64, 128),
            nn.ReLU(),
            nn.Linear(128, embedding_dim)
        )

    def forward(self, item_ids):
        x = self.item_embedding(item_ids)
        x = self.fc(x)
        return F.normalize(x, p=2, dim=-1)

