// ============================================
// MAIN JAVASCRIPT - GLOBAL FUNCTIONALITY
// ============================================

// Initialize app on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize all features
function initializeApp() {
    // Initialize products
    initializeProducts();
    
    // Load dark mode preference
    loadDarkModePreference();
    
    // Setup dark mode toggle
    setupDarkModeToggle();
    
    // Setup scroll animations
    setupScrollAnimations();
    
    // Load featured products on home page
    if (document.getElementById('featuredProducts')) {
        loadFeaturedProducts();
    }
}

// ============================================
// DARK MODE
// ============================================

function loadDarkModePreference() {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'enabled') {
        document.body.classList.add('dark-mode');
        updateDarkModeIcon();
    }
}

function setupDarkModeToggle() {
    const toggle = document.getElementById('darkModeToggle');
    if (toggle) {
        toggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            const isDarkMode = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
            updateDarkModeIcon();
        });
    }
}

function updateDarkModeIcon() {
    const toggle = document.getElementById('darkModeToggle');
    if (toggle) {
        if (document.body.classList.contains('dark-mode')) {
            toggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
            toggle.title = 'Toggle Light Mode';
        } else {
            toggle.innerHTML = '<i class="bi bi-moon-fill"></i>';
            toggle.title = 'Toggle Dark Mode';
        }
    }
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    document.querySelectorAll('.card, .category-card, .feature-box').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}

// ============================================
// FEATURED PRODUCTS
// ============================================

function loadFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;

    const products = getAllProducts();
    const featured = products.slice(0, 6);

    container.innerHTML = featured.map(product => `
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
                    <button class="btn btn-sm btn-outline-primary w-100 mt-auto" onclick="viewProductDetail('${product.code}')">
                        <i class="bi bi-eye me-1"></i>View Details
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// ============================================
// PRODUCT MODAL
// ============================================

function viewProductDetail(code) {
    const product = getProductByCode(code);
    if (!product) return;

    document.getElementById('modalTitle').textContent = product.name;
    document.getElementById('modalImage').src = product.image;
    document.getElementById('modalCode').textContent = product.code;
    document.getElementById('modalCategory').textContent = product.category;
    document.getElementById('modalDescription').textContent = product.description;
    
    const stockText = product.stock > 0 
        ? `<span class="badge bg-success">In Stock (${product.stock} units)</span>`
        : '<span class="badge bg-danger">Out of Stock</span>';
    document.getElementById('modalStock').innerHTML = stockText;

    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    modal.show();
}

// ============================================
// IMAGE LAZY LOADING
// ============================================

function setupLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function for search
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

// Format number with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Get URL parameters
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const paramsObject = {};
    params.forEach((value, key) => {
        paramsObject[key] = value;
    });
    return paramsObject;
}

// Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!', 'success');
    }).catch(() => {
        showToast('Failed to copy', 'error');
    });
}

// Show toast notification
function showToast(message, type = 'info') {
    const toastHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert" style="position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px;">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    const toastElement = document.createElement('div');
    toastElement.innerHTML = toastHTML;
    document.body.appendChild(toastElement);
    
    setTimeout(() => {
        toastElement.remove();
    }, 4000);
}

// Initialize tooltips
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

// Prefetch resources
function prefetchResources() {
    const links = [
        { rel: 'prefetch', href: 'catalogue.html' },
        { rel: 'prefetch', href: 'about.html' },
        { rel: 'prefetch', href: 'contact.html' }
    ];

    links.forEach(link => {
        const prefetchLink = document.createElement('link');
        prefetchLink.rel = link.rel;
        prefetchLink.href = link.href;
        document.head.appendChild(prefetchLink);
    });
}

// ============================================
// PAGE ANALYTICS
// ============================================

function trackPageView(pageName) {
    if (window.gtag) {
        gtag('config', 'GA_MEASUREMENT_ID', {
            'page_title': pageName,
            'page_path': window.location.pathname
        });
    }
}

// ============================================
// SMOOTH SCROLL NAVIGATION
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// SERVICE WORKER REGISTRATION
// ============================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('sw.js');
    });
}