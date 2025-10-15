# Visual Product Matcher

## Approach

Built a full-stack web application using Flask backend and vanilla JavaScript frontend. The system supports dual image input methods (file upload + URL) with a mobile-responsive interface designed for optimal user experience across all devices.

Implemented a structured product database with 50+ items featuring comprehensive metadata including categories, prices, and visual attributes. The architecture follows clean separation of concerns with RESTful API design between frontend and backend. Features include real-time image preview, similarity scoring, and dynamic filtering by similarity threshold.

Focused on production-quality code with comprehensive error handling, loading states, and user feedback throughout the interface. The similarity matching system uses simulated scoring to demonstrate the complete product matching workflow, structured to easily integrate with computer vision APIs in production.

Technologies: Python, Flask, JavaScript, HTML5, CSS3
Key Features: Image upload, similarity search, real-time filtering, mobile responsiveness, error handling

## Features

- Image file upload
- Image URL input  
- Mobile responsive design
- Similarity scoring
- Result filtering
- Real-time preview

## Live Demo

**Application URL:** http://localhost:8000 (when running locally)

## Local Setup

### Prerequisites
- Python 3.7+
- Web browser with JavaScript enabled

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python app.py
```
Server runs on: http://localhost:5001

### Frontend Setup
```bash
cd frontend
python -m http.server 8000
```
Application runs on: http://localhost:8000

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Python, Flask
- **Database**: JSON file with 50+ products
- **Styling**: Custom CSS with responsive design

## API Endpoints

- `GET /` - Health check
- `GET /api/products` - Get all products  
- `POST /api/search` - Search similar products

## Project Structure

```
visual-product-matcher/
├── frontend/
│   ├── index.html          # Main application interface
│   ├── style.css           # Responsive styling
│   └── script.js           # Frontend logic & API calls
├── backend/
│   ├── app.py             # Flask server & API routes
│   ├── products.json      # Product database (50+ items)
│   ├── requirements.txt   # Python dependencies
│   └── utils.py          # Utility functions
└── README.md             # Project documentation
```

## Usage

1. Start both backend and frontend servers
2. Open http://localhost:8000 in your browser
3. Choose an image by:
   - Dragging & dropping a file
   - Clicking to select from computer
   - Pasting an image URL
4. Click "Find Similar Products"
5. View results and use similarity filter

## Future Enhancements

- Integrate computer vision APIs for actual image analysis
- Add user accounts and search history
- Implement real product database
- Deploy to cloud hosting
