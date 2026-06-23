// ============================================
// CATALOGUE PAGE FUNCTIONALITY
// ============================================

let currentPage = 1;
const itemsPerPage = 12;
let allProducts = [];
let filteredProducts = [];

document.addEventListener('DOMContentLoaded', function() {
    initializeCatalogue();
});

function initializeCatalogue() {
    // Load products
    allProducts = getAllProducts();
    filteredProducts = allProducts;

    // Setup filters
    setupCategoryFilter();
    setupSearch();
    setupSort();
    setupClearFilters();
    
    // Load initial products
    loadProducts();
}

// ============================================
// CATEGORY FILTER
// ============================================

function setupCategoryFilter() {
    const container = document.getElementById('categoryFilter');
    const categories = getCategories();

    let html = `
        <label class="list-group-item bg-light border-0 ps-0">
            <input class="form-check-input me-2" type="radio" name="category" value="" checked>
            All Categories
        </label>
    `;

    categories.forEach(category => {
        html += `
            <label class="list-group-item bg-light border-0 ps-0">
                <input class="form-check-input me-2" type="radio" name="category" value="${category}">
                ${category}
            </label>
        `;
    });

    container.innerHTML = html;

    // Add event listeners
    document.querySelectorAll('input[name="category"]').forEach(radio => {
        radio.addEventListener('change', function() {
            currentPage = 1;
            filterProducts();
        });
    });
}

// ============================================
// SEARCH FUNCTIONALITY
// ============================================

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearch');

    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            currentPage = 1;
            filterProducts();
        }, 300));
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            if (searchInput) {
                searchInput.value = '';
                currentPage = 1;
                filterProducts();
            }
        });
    }
}

// ============================================
// SORT FUNCTIONALITY
// ============================================

function setupSort() {
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            currentPage = 1;
            loadProducts();
        });
    }
}

// ============================================
// FILTER PRODUCTS
// ============================================

function filterProducts() {
    const searchQuery = document.getElementById('searchInput')?.value || '';
    const selectedCategory = document.querySelector('input[name="category"]:checked')?.value || '';

    const filters = {
        category: selectedCategory || undefined
    };

    filteredProducts = searchProducts(searchQuery, filters);
    currentPage = 1;
    loadProducts();
}

// ============================================
// LOAD AND RENDER PRODUCTS
// ============================================

function loadProducts() {
    const sortBy = document.getElementById('sortSelect')?.value || '';
    
    // Sort products
    let productsToDisplay = sortProducts(filteredProducts, sortBy);
    
    // Paginate
    const pagination = paginateProducts(productsToDisplay, currentPage, itemsPerPage);
    
    // Render
    renderProducts(pagination.items);
    renderPagination(pagination);
    updateProductCount(pagination.total);
    
    // Show/hide no results
    const noResults = document.getElementById('noResults');
    if (pagination.total === 0) {
        if (noResults) noResults.style.display = 'block';
        document.getElementById('productsGrid').innerHTML = '';
    } else {
        if (noResults) noResults.style.display = 'none';
    }
}

function renderProducts(products) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    grid.innerHTML = products.map(product => `
        <div class="col-md-6 col-lg-4">
            <div class="product-card">
                <div class="product-image-wrapper">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    <div class="product-badge">${product.category}</div>
                </div>
                <div class="product-info">
                    <div class="product-code">${product.code}</div>
                    <h6>${product.name}</h6>
                    <p class="product-category">${product.category}</p>
                    <p class="text-muted small flex-grow-1">${product.description}</p>
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-outline-primary flex-grow-1" 
                                onclick="viewProductDetail('${product.code}')">
                            <i class="bi bi-eye me-1"></i>View
                        </button>
                        <button class="btn btn-sm btn-outline-success flex-grow-1"
                                onclick="openInquiry('${product.code}')">
                            <i class="bi bi-chat-dots me-1"></i>Inquire
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    // Setup lazy loading
    setupLazyLoading();
}

// ============================================
// PAGINATION
// ============================================

function renderPagination(pagination) {
    const container = document.getElementById('pagination');
    if (!container) return;

    let html = '';

    // Previous button
    if (currentPage > 1) {
        html += `<li class="page-item"><a class="page-link" href="#" onclick="goToPage(${currentPage - 1})">Previous</a></li>`;
    } else {
        html += `<li class="page-item disabled"><span class="page-link">Previous</span></li>`;
    }

    // Page numbers
    const maxPages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxPages - 1);

    if (endPage - startPage < maxPages - 1) {
        startPage = Math.max(1, endPage - maxPages + 1);
    }

    if (startPage > 1) {
        html += `<li class="page-item"><a class="page-link" href="#" onclick="goToPage(1)">1</a></li>`;
        if (startPage > 2) {
            html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        if (i === currentPage) {
            html += `<li class="page-item active"><span class="page-link">${i}</span></li>`;
        } else {
            html += `<li class="page-item"><a class="page-link" href="#" onclick="goToPage(${i})">${i}</a></li>`;
        }
    }

    if (endPage < pagination.totalPages) {
        if (endPage < pagination.totalPages - 1) {
            html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
        html += `<li class="page-item"><a class="page-link" href="#" onclick="goToPage(${pagination.totalPages})">${pagination.totalPages}</a></li>`;
    }

    // Next button
    if (currentPage < pagination.totalPages) {
        html += `<li class="page-item"><a class="page-link" href="#" onclick="goToPage(${currentPage + 1})">Next</a></li>`;
    } else {
        html += `<li class="page-item disabled"><span class="page-link">Next</span></li>`;
    }

    container.innerHTML = html;
}

function goToPage(page) {
    currentPage = page;
    loadProducts();
    
    // Scroll to top of products
    document.querySelector('.container-fluid').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============================================
// UPDATE PRODUCT COUNT
// ============================================

function updateProductCount(count) {
    const badge = document.getElementById('productCount');
    if (badge) {
        badge.textContent = `${count} Product${count !== 1 ? 's' : ''}`;
    }
}

// ============================================
// CLEAR FILTERS
// ============================================

function setupClearFilters() {
    const buttons = document.querySelectorAll('[id^="clearFilters"]');
    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            document.getElementById('searchInput').value = '';
            document.querySelector('input[name="category"][value=""]').checked = true;
            document.getElementById('sortSelect').value = '';
            
            currentPage = 1;
            filteredProducts = allProducts;
            loadProducts();
        });
    });
}

// ============================================
// INQUIRY FUNCTION
// ============================================

function openInquiry(code) {
    const product = getProductByCode(code);
    if (!product) return;

    const whatsappMessage = `Hi, I'm interested in your furniture mica shade: ${product.code} - ${product.name}. Could you provide more details and pricing?`;
    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(whatsappMessage)}`;
    
    window.open(whatsappUrl, '_blank');
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
