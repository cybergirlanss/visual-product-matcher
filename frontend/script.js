// Global variables
let currentUploadedImage = null;
let allProducts = [];

// DOM Elements
const fileUploadArea = document.getElementById('fileUploadArea');
const imageUpload = document.getElementById('imageUpload');
const uploadPreview = document.querySelector('.upload-preview');
const uploadPlaceholder = document.querySelector('.upload-placeholder');
const urlInput = document.getElementById('imageUrl');
const urlPreview = document.querySelector('.url-preview');
const searchBtn = document.getElementById('searchBtn');
const loadingSection = document.getElementById('loadingSection');
const errorSection = document.getElementById('errorSection');
const errorText = document.getElementById('errorText');
const resultsSection = document.getElementById('resultsSection');
const productsGrid = document.getElementById('productsGrid');
const noResults = document.getElementById('noResults');
const originalImageContainer = document.getElementById('originalImageContainer');
const filterHighSimilarity = document.getElementById('filterHighSimilarity');

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // File upload event listeners
    fileUploadArea.addEventListener('click', () => imageUpload.click());
    fileUploadArea.addEventListener('dragover', handleDragOver);
    fileUploadArea.addEventListener('dragleave', handleDragLeave);
    fileUploadArea.addEventListener('drop', handleFileDrop);
    
    imageUpload.addEventListener('change', handleFileSelect);
    urlInput.addEventListener('input', handleUrlInput);
    
    // Enable search button when an image is selected
    updateSearchButton();
}

// Drag and Drop Handlers
function handleDragOver(e) {
    e.preventDefault();
    fileUploadArea.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    fileUploadArea.classList.remove('dragover');
}

function handleFileDrop(e) {
    e.preventDefault();
    fileUploadArea.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleImageFile(files[0]);
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleImageFile(file);
    }
}

function handleImageFile(file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showError('Please select a valid image file (JPG, PNG, WebP)');
        return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showError('Image size should be less than 5MB');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        // Show preview
        const previewImg = document.getElementById('uploadPreview');
        previewImg.src = e.target.result;
        uploadPreview.classList.remove('hidden');
        uploadPlaceholder.classList.add('hidden');
        
        // Store the uploaded image
        currentUploadedImage = {
            type: 'file',
            data: e.target.result,
            file: file
        };
        
        updateSearchButton();
    };
    reader.readAsDataURL(file);
}

function handleUrlInput(e) {
    const url = e.target.value.trim();
    
    if (url === '') {
        clearUrlInput();
        return;
    }
    
    // Basic URL validation
    if (!isValidUrl(url)) {
        return;
    }
    
    // Show preview
    const previewImg = document.getElementById('urlPreview');
    previewImg.src = url;
    previewImg.onload = function() {
        urlPreview.classList.remove('hidden');
        currentUploadedImage = {
            type: 'url',
            data: url
        };
        updateSearchButton();
    };
    
    previewImg.onerror = function() {
        showError('Could not load image from URL. Please check the URL and try again.');
        clearUrlInput();
    };
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function clearFileUpload() {
    imageUpload.value = '';
    uploadPreview.classList.add('hidden');
    uploadPlaceholder.classList.remove('hidden');
    currentUploadedImage = null;
    updateSearchButton();
}

function clearUrlInput() {
    urlInput.value = '';
    urlPreview.classList.add('hidden');
    currentUploadedImage = null;
    updateSearchButton();
}

function updateSearchButton() {
    searchBtn.disabled = !currentUploadedImage;
}

// Main Search Function
async function searchSimilarProducts() {
    if (!currentUploadedImage) {
        showError('Please select an image first');
        return;
    }
    
    // Show loading state
    showLoading();
    hideError();
    hideResults();
    
    try {
        let response;
        
        if (currentUploadedImage.type === 'file') {
            // Send as FormData for file upload
            const formData = new FormData();
            formData.append('image', currentUploadedImage.file);
            
            response = await fetch('http://localhost:5001/api/search', {
                method: 'POST',
                body: formData
            });
        } else {
            // Send as JSON for URL
            response = await fetch('http://localhost:5001/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: currentUploadedImage.data
                })
            });
        }
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Something went wrong');
        }
        
        // Display results
        displayResults(data.products);
        
    } catch (error) {
        console.error('Search error:', error);
        showError(error.message || 'Failed to search for similar products. Please try again.');
    } finally {
        hideLoading();
    }
}

// Display Results
function displayResults(products) {
    allProducts = products;
    
    if (!products || products.length === 0) {
        showNoResults();
        return;
    }
    
    // Show original image
    displayOriginalImage();
    
    // Render products
    renderProducts(products);
    
    // Show results section
    showResults();
}

function displayOriginalImage() {
    let imageHtml = '';
    
    if (currentUploadedImage.type === 'file') {
        imageHtml = `<img src="${currentUploadedImage.data}" alt="Uploaded image">`;
    } else {
        imageHtml = `<img src="${currentUploadedImage.data}" alt="URL image" onerror="this.style.display='none'">`;
    }
    
    originalImageContainer.innerHTML = imageHtml;
}

function renderProducts(products) {
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.innerHTML += productCard;
    });
}

function createProductCard(product) {
    const similarityPercent = Math.round(product.similarity_score * 100);
    
    return `
        <div class="product-card" data-similarity="${product.similarity_score}">
            <img src="${product.image_url}" alt="${product.name}" class="product-image" onerror="this.src='https://via.placeholder.com/300x200?text=Image+Not+Found'">
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-category">${product.category}</div>
                <div class="product-price">${product.price}</div>
                <div class="similarity-score">${similarityPercent}% Match</div>
            </div>
        </div>
    `;
}

// Filter Results
function filterResults() {
    if (!allProducts.length) return;
    
    let filteredProducts;
    
    if (filterHighSimilarity.checked) {
        // Show only products with similarity > 80%
        filteredProducts = allProducts.filter(product => product.similarity_score > 0.8);
    } else {
        // Show all products
        filteredProducts = allProducts;
    }
    
    if (filteredProducts.length === 0) {
        showNoResults();
    } else {
        renderProducts(filteredProducts);
        document.getElementById('resultsCount').textContent = `${filteredProducts.length} products`;
    }
}

// UI State Management
function showLoading() {
    loadingSection.classList.remove('hidden');
}

function hideLoading() {
    loadingSection.classList.add('hidden');
}

function showError(message) {
    errorText.textContent = message;
    errorSection.classList.remove('hidden');
}

function hideError() {
    errorSection.classList.add('hidden');
}

function showResults() {
    resultsSection.classList.remove('hidden');
    document.getElementById('resultsCount').textContent = `${allProducts.length} products`;
}

function hideResults() {
    resultsSection.classList.add('hidden');
}

function showNoResults() {
    productsGrid.innerHTML = '';
    noResults.classList.remove('hidden');
}

// Utility function to test the API
async function testApi() {
    try {
        const response = await fetch('http://localhost:5001/api/products');
        const data = await response.json();
        console.log('API test successful:', data);
    } catch (error) {
        console.error('API test failed:', error);
    }
}

// Initialize API test on load
window.addEventListener('load', testApi);