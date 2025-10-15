# Utility functions (for future enhancements)
import json

def load_products():
    """Load products from JSON file"""
    with open('products.json', 'r') as f:
        return json.load(f)

def save_products(products):
    """Save products to JSON file"""
    with open('products.json', 'w') as f:
        json.dump(products, f, indent=2)