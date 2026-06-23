// ============================================
// ADMIN PANEL FUNCTIONALITY
// ============================================

const ADMIN_PASSWORD = 'admin123'; // Change this in production!
let isAuthenticated = false;

document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    setupEventListeners();
});

function checkAuthentication() {
    const token = localStorage.getItem('adminToken');
    if (token && token === btoa(ADMIN_PASSWORD)) {
        isAuthenticated = true;
        showAdminPanel();
    } else {
        showLoginForm();
    }
}

function showLoginForm() {
    document.getElementById('loginSection').style.display = 'flex';
    document.getElementById('adminSection').style.display = 'none';
    
    const form = document.getElementById('loginForm');
    if (form) {
        form.addEventListener('submit', handleLogin);
    }
}

function showAdminPanel() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('adminSection').style.display = 'block';
    
    loadDashboard();
    loadProductsTable();
}

function handleLogin(e) {
    e.preventDefault();
    
    const password = document.getElementById('adminPassword').value;
    const errorDiv = document.getElementById('loginError');
    
    if (password === ADMIN_PASSWORD) {
        localStorage.setItem('adminToken', btoa(ADMIN_PASSWORD));
        isAuthenticated = true;
        errorDiv.style.display = 'none';
        showAdminPanel();
    } else {
        errorDiv.textContent = 'Invalid password. Please try again.';
        errorDiv.style.display = 'block';
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('[data-tab]').forEach(btn => {
        btn.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });
    
    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Add product form
    const addForm = document.getElementById('addProductForm');
    if (addForm) {
        addForm.addEventListener('submit', handleAddProduct);
    }
    
    // Product search
    const productSearch = document.getElementById('productSearch');
    if (productSearch) {
        productSearch.addEventListener('input', function() {
            filterProductsTable(this.value);
        });
    }
    
    // Sync button
    const syncBtn = document.getElementById('syncBtn');
    if (syncBtn) {
        syncBtn.addEventListener('click', handleSync);
    }
    
    // Clear filters buttons
    const clearBtns = document.querySelectorAll('[id^="clearFilters"]');
    clearBtns.forEach(btn => {
        btn.addEventListener('click', clearFilters);
    });
}

// ============================================
// TAB SWITCHING
// ============================================

function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    
    // Remove active class from buttons
    document.querySelectorAll('[data-tab]').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    const tabElement = document.getElementById(tabName);
    if (tabElement) {
        tabElement.style.display = 'block';
    }
    
    // Add active class to button
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Load relevant data
    if (tabName === 'products') {
        loadProductsTable();
    }
}

// ============================================
// DASHBOARD
// ============================================

function loadDashboard() {
    const products = getAllProducts();
    
    // Update stats
    document.getElementById('totalProducts').textContent = products.length;
    document.getElementById('inStockCount').textContent = products.filter(p => p.stock > 0).length;
    document.getElementById('categoryCount').textContent = getCategories().length;
    document.getElementById('lastUpdated').textContent = new Date().toLocaleDateString();
    
    // Recent activities
    const activities = [
        'Dashboard loaded',
        `Total ${products.length} products in inventory`,
        `${products.filter(p => p.stock > 0).length} products in stock`,
        `${getCategories().length} product categories`
    ];
    
    const activitiesHtml = activities.map(activity => 
        `<p class="mb-2"><i class="bi bi-check-circle text-success me-2"></i>${activity}</p>`
    ).join('');
    
    document.getElementById('recentActivities').innerHTML = activitiesHtml;
}

// ============================================
// PRODUCTS TABLE
// ============================================

function loadProductsTable() {
    const products = getAllProducts();
    const tbody = document.getElementById('productsTableBody');
    
    if (!tbody) return;
    
    tbody.innerHTML = products.map(product => `
        <tr>
            <td><code>${product.code}</code></td>
            <td>${product.name}</td>
            <td><span class="badge bg-secondary">${product.category}</span></td>
            <td>
                <span class="badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}">
                    ${product.stock}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editProduct('${product.code}')">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteProductConfirm('${product.code}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function filterProductsTable(query) {
    const products = getAllProducts();
    const filtered = products.filter(p => 
        p.code.toLowerCase().includes(query.toLowerCase()) ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
    );
    
    const tbody = document.getElementById('productsTableBody');
    tbody.innerHTML = filtered.map(product => `
        <tr>
            <td><code>${product.code}</code></td>
            <td>${product.name}</td>
            <td><span class="badge bg-secondary">${product.category}</span></td>
            <td>
                <span class="badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}">
                    ${product.stock}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editProduct('${product.code}')">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteProductConfirm('${product.code}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// ============================================
// ADD PRODUCT
// ============================================

function handleAddProduct(e) {
    e.preventDefault();
    
    const product = {
        code: document.getElementById('newShadeCode').value.toUpperCase(),
        name: document.getElementById('newProductName').value,
        category: document.getElementById('newCategory').value,
        description: document.getElementById('newDescription').value,
        stock: parseInt(document.getElementById('newStock').value),
        image: document.getElementById('newImageUrl').value
    };
    
    // Validate
    if (!product.code || !product.name || !product.category || !product.image) {
        showMessage('addProductMessage', 'Please fill all required fields', 'danger');
        return;
    }
    
    // Check if code already exists
    if (getProductByCode(product.code)) {
        showMessage('addProductMessage', 'Product code already exists', 'danger');
        return;
    }
    
    // Add product
    addProduct(product);
    
    // Show success message
    showMessage('addProductMessage', `Product ${product.code} added successfully!`, 'success');
    
    // Reset form
    document.getElementById('addProductForm').reset();
    
    // Refresh products table
    loadProductsTable();
    loadDashboard();
}

// ============================================
// EDIT PRODUCT
// ============================================

function editProduct(code) {
    const product = getProductByCode(code);
    if (!product) return;
    
    // Populate form (simplified - in production use a modal)
    document.getElementById('newShadeCode').value = product.code;
    document.getElementById('newProductName').value = product.name;
    document.getElementById('newCategory').value = product.category;
    document.getElementById('newDescription').value = product.description;
    document.getElementById('newStock').value = product.stock;
    document.getElementById('newImageUrl').value = product.image;
    
    // Change button text
    const form = document.getElementById('addProductForm');
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = '✓ Update Product';
    
    // Switch to add product tab
    switchTab('add-product');
    
    // Modify form submission
    form.onsubmit = function(e) {
        e.preventDefault();
        updateProduct(code, {
            name: document.getElementById('newProductName').value,
            category: document.getElementById('newCategory').value,
            description: document.getElementById('newDescription').value,
            stock: parseInt(document.getElementById('newStock').value),
            image: document.getElementById('newImageUrl').value
        });
        
        showMessage('addProductMessage', 'Product updated successfully!', 'success');
        document.getElementById('addProductForm').reset();
        btn.textContent = '+ Add Product';
        form.onsubmit = handleAddProduct;
        loadProductsTable();
        loadDashboard();
    };
}

// ============================================
// DELETE PRODUCT
// ============================================

function deleteProductConfirm(code) {
    if (confirm(`Are you sure you want to delete product ${code}?`)) {
        deleteProduct(code);
        showMessage('', `Product ${code} deleted successfully!`, 'success');
        loadProductsTable();
        loadDashboard();
    }
}

// ============================================
// SYNC DATA
// ============================================

function handleSync() {
    const sheetUrl = document.getElementById('sheetUrl').value;
    
    if (!sheetUrl) {
        showMessage('syncMessage', 'Using local storage. No Google Sheet URL configured.', 'info');
        return;
    }
    
    // Fetch from Google Sheet
    fetch(sheetUrl)
        .then(response => response.text())
        .then(csv => {
            const products = parseCSV(csv);
            localStorage.setItem('products', JSON.stringify(products));
            showMessage('syncMessage', `Synced ${products.length} products from Google Sheet!`, 'success');
            loadProductsTable();
            loadDashboard();
        })
        .catch(error => {
            showMessage('syncMessage', `Sync failed: ${error.message}`, 'danger');
        });
}

function parseCSV(csv) {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',');
    const products = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        products.push({
            code: values[0]?.trim().toUpperCase() || '',
            name: values[1]?.trim() || '',
            category: values[2]?.trim() || '',
            description: values[3]?.trim() || '',
            stock: parseInt(values[4]?.trim()) || 0,
            image: values[5]?.trim() || 'https://via.placeholder.com/400x500'
        });
    }
    
    return products.filter(p => p.code); // Remove empty rows
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function showMessage(elementId, message, type) {
    const messageDiv = document.getElementById(elementId);
    if (!messageDiv) return;
    
    messageDiv.className = `alert alert-${type}`;
    messageDiv.innerHTML = message;
    messageDiv.style.display = 'block';
    
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 4000);
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('adminToken');
        isAuthenticated = false;
        location.reload();
    }
}

function clearFilters() {
    document.getElementById('productSearch').value = '';
    loadProductsTable();
}