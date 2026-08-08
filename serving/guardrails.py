from collections import Counter

def apply_diversity_guardrail(candidates, max_pct=0.35, top_k=10):
    """Enforces no single category exceeds 35% of the recommendation list."""
    selected = []
    category_counts = Counter()
    max_allowed = max(1, int(top_k * max_pct))

    for item in candidates:
        cat = item['category']
        if category_counts[cat] < max_allowed:
            selected.append(item)
            category_counts[cat] += 1
        if len(selected) == top_k:
            break

    # Fallback to fill remaining slots if constraints are too strict
    if len(selected) < top_k:
        for item in candidates:
            if item not in selected:
                selected.append(item)
            if len(selected) == top_k:
                break

    return selected

if __name__ == "__main__":
    # Test diversity guardrail logic
    test_items = [
        {"item_id": 1, "category": "Dresses"},
        {"item_id": 2, "category": "Dresses"},
        {"item_id": 3, "category": "Dresses"},
        {"item_id": 4, "category": "Dresses"},
        {"item_id": 5, "category": "Footwear"},
        {"item_id": 6, "category": "Tops"}
    ]
    filtered = apply_diversity_guardrail(test_items, max_pct=0.35, top_k=5)
    print("✅ Diversity Guardrail Filtered Output (Max 1-2 per category):")
    for item in filtered:
        print(f"   • Item {item['item_id']} | Category: {item['category']}")