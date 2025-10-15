from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import random
from PIL import Image
import io
import requests
import numpy as np

app = Flask(__name__)
CORS(app)  # This allows frontend to communicate with backend

# Load products from JSON file
with open('products.json', 'r') as f:
    products = json.load(f)

@app.route('/')
def home():
    return jsonify({"message": "Visual Product Matcher API is running!"})

@app.route('/api/search', methods=['POST'])
def search_similar_products():
    try:
        # Check if image file was uploaded
        if 'image' in request.files:
            image_file = request.files['image']
            if image_file.filename == '':
                return jsonify({'error': 'No file selected'}), 400
            
            # For demo purposes, we'll simulate image processing
            # In a real app, you'd use AI/ML here
            similar_products = simulate_image_analysis()
            
        # Check if image URL was provided
        elif request.json and 'url' in request.json:
            image_url = request.json['url']
            if not image_url:
                return jsonify({'error': 'No URL provided'}), 400
            
            # For demo purposes, simulate processing
            similar_products = simulate_image_analysis()
            
        else:
            return jsonify({'error': 'Please provide either an image file or URL'}), 400
        
        return jsonify({
            'success': True,
            'products': similar_products,
            'total': len(similar_products)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/products', methods=['GET'])
def get_all_products():
    """Get all products (for testing)"""
    return jsonify({
        'products': products,
        'total': len(products)
    })

def simulate_image_analysis():
    """Simulate AI analysis by returning random products with similarity scores"""
    # Shuffle products and take 6 random ones
    shuffled_products = products.copy()
    random.shuffle(shuffled_products)
    
    # Add similarity scores (for demo purposes)
    results = []
    for i, product in enumerate(shuffled_products[:6]):
        # Generate random similarity score between 0.7 and 0.95
        similarity_score = round(random.uniform(0.7, 0.95), 2)
        product_with_score = product.copy()
        product_with_score['similarity_score'] = similarity_score
        results.append(product_with_score)
    
    # Sort by similarity score (highest first)
    results.sort(key=lambda x: x['similarity_score'], reverse=True)
    return results

@app.route('/api/upload-test', methods=['POST'])
def upload_test():
    """Simple endpoint to test file upload"""
    if 'image' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    return jsonify({
        'success': True,
        'message': 'File received successfully',
        'filename': file.filename,
        'content_type': file.content_type
    })

if __name__ == '__main__':
    app.run(debug=True, port=5001)