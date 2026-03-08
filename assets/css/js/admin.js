/**
 * ADMIN DASHBOARD FUNCTIONALITY
 */

class AdminManager {
    constructor() {
        this.currentPage = 'dashboard';
        this.sidebarOpen = false;
        this.init();
    }

    init() {
        this.initSidebar();
        this.initDataTables();
        this.initCharts();
        this.initModals();
        this.loadDashboardData();
    }

    initSidebar() {
        // Mobile sidebar toggle
        const toggleBtn = document.querySelector('.sidebar-toggle');
        const sidebar = document.querySelector('.sidebar');
        
        if (toggleBtn && sidebar) {
            toggleBtn.addEventListener('click', () => {
                this.sidebarOpen = !this.sidebarOpen;
                sidebar.classList.toggle('active', this.sidebarOpen);
            });
        }

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024 && this.sidebarOpen) {
                if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
                    sidebar.classList.remove('active');
                    this.sidebarOpen = false;
                }
            }
        });

        // Highlight current page in sidebar
        const currentPath = window.location.pathname;
        document.querySelectorAll('.sidebar-link').forEach(link => {
            const href = link.getAttribute('href');
            if (currentPath.includes(href)) {
                link.classList.add('active');
            }
        });
    }

    initDataTables() {
        // Select all checkbox
        const selectAll = document.querySelector('#selectAll');
        if (selectAll) {
            selectAll.addEventListener('change', (e) => {
                document.querySelectorAll('.table-checkbox').forEach(cb => {
                    cb.checked = e.target.checked;
                });
            });
        }

        // Search functionality
        const tableSearch = document.querySelector('.table-search');
        if (tableSearch) {
            tableSearch.addEventListener('input', debounce((e) => {
                this.filterTable(e.target.value);
            }, 300));
        }

        // Status filter
        const statusFilter = document.querySelector('.status-filter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.filterByStatus(e.target.value);
            });
        }
    }

    filterTable(query) {
        const rows = document.querySelectorAll('.data-table tbody tr');
        const lowerQuery = query.toLowerCase();

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(lowerQuery) ? '' : 'none';
        });
    }

    filterByStatus(status) {
        if (status === 'all') {
            document.querySelectorAll('.data-table tbody tr').forEach(row => {
                row.style.display = '';
            });
            return;
        }

        document.querySelectorAll('.data-table tbody tr').forEach(row => {
            const rowStatus = row.dataset.status;
            row.style.display = rowStatus === status ? '' : 'none';
        });
    }

    initCharts() {
        // Simple chart rendering using CSS
        this.renderSalesChart();
        this.renderOrderStatusChart();
    }

    renderSalesChart() {
        const chartContainer = document.querySelector('#salesChart');
        if (!chartContainer) return;

        // Mock data
        const data = [65, 59, 80, 81, 56, 55, 40, 70, 90, 100, 85, 95];
        const max = Math.max(...data);
        
        const bars = data.map((value, index) => `
            <div class="chart-bar" style="
                height: ${(value / max) * 100}%;
                background: linear-gradient(to top, var(--primary-500), var(--primary-600));
                border-radius: 4px 4px 0 0;
                position: relative;
                cursor: pointer;
                transition: all 0.3s;
            " title="₱${value}k">
                <div class="chart-tooltip" style="
                    position: absolute;
                    bottom: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    background: var(--neutral-900);
                    color: white;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.2s;
                    white-space: nowrap;
                    margin-bottom: 4px;
                ">₱${value}k</div>
            </div>
        `).join('');

        chartContainer.innerHTML = `
            <div style="display: flex; align-items: flex-end; justify-content: space-between; height: 200px; gap: 8px; padding-top: 20px;">
                ${bars}
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 8px; font-size: 12px; color: var(--neutral-600);">
                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
            </div>
        `;

        // Add hover effects
        chartContainer.querySelectorAll('.chart-bar').forEach(bar => {
            bar.addEventListener('mouseenter', () => {
                bar.querySelector('.chart-tooltip').style.opacity = '1';
                bar.style.transform = 'scaleY(1.05)';
            });
            bar.addEventListener('mouseleave', () => {
                bar.querySelector('.chart-tooltip').style.opacity = '0';
                bar.style.transform = 'scaleY(1)';
            });
        });
    }

    renderOrderStatusChart() {
        const chartContainer = document.querySelector('#orderStatusChart');
        if (!chartContainer) return;

        const data = [
            { label: 'Pending', value: 5, color: 'var(--warning)' },
            { label: 'Processing', value: 12, color: 'var(--info)' },
            { label: 'Shipped', value: 8, color: 'var(--primary-500)' },
            { label: 'Delivered', value: 45, color: 'var(--success)' }
        ];

        const total = data.reduce((sum, item) => sum + item.value, 0);

        // Create simple bar chart
        const bars = data.map(item => `
            <div style="margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 12px;">
                    <span>${item.label}</span>
                    <span>${item.value} (${Math.round((item.value/total)*100)}%)</span>
                </div>
                <div style="height: 8px; background: var(--neutral-200); border-radius: 4px; overflow: hidden;">
                    <div style="
                        width: ${(item.value / total) * 100}%;
                        height: 100%;
                        background: ${item.color};
                        border-radius: 4px;
                        transition: width 0.5s ease;
                    "></div>
                </div>
            </div>
        `).join('');

        chartContainer.innerHTML = bars;
    }

    initModals() {
        // Add Product Modal
        const addProductBtn = document.querySelector('.btn-add-product');
        if (addProductBtn) {
            addProductBtn.addEventListener('click', () => {
                openModal('addProductModal');
            });
        }

        // Image upload preview
        const imageUpload = document.querySelector('.image-upload');
        if (imageUpload) {
            imageUpload.addEventListener('click', () => {
                // Simulate file input click
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.multiple = true;
                
                input.addEventListener('change', (e) => {
                    this.handleImageUpload(e.target.files);
                });
                
                input.click();
            });

            // Drag and drop
            imageUpload.addEventListener('dragover', (e) => {
                e.preventDefault();
                imageUpload.style.borderColor = 'var(--primary-500)';
                imageUpload.style.backgroundColor = 'var(--primary-50)';
            });

            imageUpload.addEventListener('dragleave', () => {
                imageUpload.style.borderColor = '';
                imageUpload.style.backgroundColor = '';
            });

            imageUpload.addEventListener('drop', (e) => {
                e.preventDefault();
                imageUpload.style.borderColor = '';
                imageUpload.style.backgroundColor = '';
                this.handleImageUpload(e.dataTransfer.files);
            });
        }

        // Save product
        const saveProductBtn = document.querySelector('.btn-save-product');
        if (saveProductBtn) {
            saveProductBtn.addEventListener('click', () => {
                this.saveProduct();
            });
        }
    }

    handleImageUpload(files) {
        const previewContainer = document.querySelector('.image-preview-grid');
        if (!previewContainer) return;

        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const div = document.createElement('div');
                div.className = 'image-preview';
                div.innerHTML = `
                    <img src="${e.target.result}" alt="Preview">
                    <button class="image-preview-remove" onclick="this.parentElement.remove()">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                previewContainer.appendChild(div);
            };
            reader.readAsDataURL(file);
        });
    }

    saveProduct() {
        const form = document.querySelector('#addProductForm');
        if (!form) return;

        const formData = new FormData(form);
        const product = {
            id: generateId('PROD'),
            name: formData.get('name'),
            description: formData.get('description'),
            price: parseFloat(formData.get('price')),
            stock: parseInt(formData.get('stock')),
            category: formData.get('category'),
            createdAt: new Date().toISOString()
        };

        // Save to localStorage (mock database)
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        products.push(product);
        localStorage.setItem('products', JSON.stringify(products));

        closeModal('addProductModal');
        toast.show('Product saved successfully', 'success');
        
        // Refresh product list
        this.loadProducts();
    }

    loadDashboardData() {
        // Load stats
        this.updateStats();
        
        // Load recent orders
        this.loadRecentOrders();
        
        // Load products if on products page
        if (document.querySelector('.products-page')) {
            this.loadProducts();
        }
    }

    updateStats() {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        
        // Calculate stats
        const todayOrders = orders.filter(o => {
            const orderDate = new Date(o.date);
            const today = new Date();
            return orderDate.toDateString() === today.toDateString();
        }).length;

        const totalRevenue = orders.reduce((sum, o) => sum + (o.totals?.total || 0), 0);
        const pendingOrders = orders.filter(o => o.status === 'pending').length;
        const lowStock = products.filter(p => p.stock < 5).length;

        // Update DOM
        const updateStat = (selector, value) => {
            const el = document.querySelector(selector);
            if (el) el.textContent = value;
        };

        updateStat('.stat-today-orders', todayOrders);
        updateStat('.stat-total-revenue', '₱' + (totalRevenue / 1000).toFixed(1) + 'k');
        updateStat('.stat-pending-orders', pendingOrders);
        updateStat('.stat-low-stock', lowStock);
    }

    loadRecentOrders() {
        const container = document.querySelector('.recent-orders-table tbody');
        if (!container) return;

        const orders = JSON.parse(localStorage.getItem('orders') || '[]')
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

        if (orders.length === 0) {
            container.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center" style="padding: 40px; color: var(--neutral-600);">
                        No orders yet
                    </td>
                </tr>
            `;
            return;
        }

        container.innerHTML = orders.map(order => `
            <tr data-status="${order.status}">
                <td>${order.id}</td>
                <td>
                    <div class="table-customer">
                        <div class="table-avatar">${order.customer?.name?.charAt(0) || 'U'}</div>
                        ${order.customer?.name || 'Unknown'}
                    </div>
                </td>
                <td>${order.items?.length || 0} items</td>
                <td class="table-price">${formatCurrency(order.totals?.total || 0)}</td>
                <td><span class="badge badge-${order.status}">${order.status}</span></td>
                <td>
                    <div class="table-actions-cell">
                        <button class="table-btn edit" onclick="admin.viewOrder('${order.id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="table-btn edit" onclick="admin.editOrder('${order.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    loadProducts() {
        const container = document.querySelector('.products-table tbody');
        if (!container) return;

        const products = JSON.parse(localStorage.getItem('products') || '[]');

        if (products.length === 0) {
            // Show sample data
            container.innerHTML = `
                <tr>
                    <td><input type="checkbox" class="table-checkbox"></td>
                    <td>
                        <div class="table-product">
                            <div class="table-product-img">🌹</div>
                            <div class="table-product-info">
                                <div class="table-product-title">Rose Bouquet Deluxe</div>
                            </div>
                        </div>
                    </td>
                    <td>Bouquets</td>
                    <td>₱1,250.00</td>
                    <td>25</td>
                    <td><span class="badge badge-delivered">Active</span></td>
                    <td>
                        <div class="table-actions-cell">
                            <button class="table-btn edit"><i class="fas fa-edit"></i></button>
                            <button class="table-btn delete"><i class="fas fa-trash"></i></button>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        container.innerHTML = products.map(product => `
            <tr>
                <td><input type="checkbox" class="table-checkbox"></td>
                <td>
                    <div class="table-product">
                        <div class="table-product-img">🌸</div>
                        <div class="table-product-info">
                            <div class="table-product-title">${product.name}</div>
                        </div>
                    </div>
                </td>
                <td>${product.category}</td>
                <td>${formatCurrency(product.price)}</td>
                <td>${product.stock}</td>
                <td>
                    <span class="badge ${product.stock === 0 ? 'badge-out' : product.stock < 5 ? 'badge-low' : 'badge-delivered'}">
                        ${product.stock === 0 ? 'Out of Stock' : product.stock < 5 ? 'Low Stock' : 'Active'}
                    </span>
                </td>
                <td>
                    <div class="table-actions-cell">
                        <button class="table-btn edit" onclick="admin.editProduct('${product.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="table-btn delete" onclick="admin.deleteProduct('${product.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    viewOrder(orderId) {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const order = orders.find(o => o.id === orderId);
        if (!order) return;

        // Create and show order detail modal
        const modalHTML = `
            <div class="modal-overlay active" id="orderDetailModal">
                <div class="modal modal-lg">
                    <div class="modal-header">
                        <h3 class="modal-title">Order ${order.id}</h3>
                        <button class="modal-close" onclick="closeModal('orderDetailModal')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">
                            <div>
                                <h4 style="margin-bottom: 12px; color: var(--neutral-600); font-size: 12px; text-transform: uppercase;">Customer</h4>
                                <p style="font-weight: 600;">${order.customer?.name}</p>
                                <p style="font-size: 14px; color: var(--neutral-600);">${order.customer?.email}</p>
                                <p style="font-size: 14px; color: var(--neutral-600);">${order.customer?.phone}</p>
                            </div>
                            <div>
                                <h4 style="margin-bottom: 12px; color: var(--neutral-600); font-size: 12px; text-transform: uppercase;">Shipping Address</h4>
                                <p style="font-size: 14px;">${order.customer?.address}</p>
                                <p style="font-size: 14px;">${order.customer?.city}, ${order.customer?.postal}</p>
                            </div>
                        </div>
                        
                        <h4 style="margin-bottom: 12px; color: var(--neutral-600); font-size: 12px; text-transform: uppercase;">Items</h4>
                        <div style="border: 1px solid var(--neutral-200); border-radius: 8px; overflow: hidden; margin-bottom: 24px;">
                            ${order.items?.map(item => `
                                <div style="display: flex; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid var(--neutral-200);">
                                    <div>
                                        <div style="font-weight: 600;">${item.name}</div>
                                        <div style="font-size: 12px; color: var(--neutral-600);">Qty: ${item.quantity}</div>
                                    </div>
                                    <div style="font-weight: 600;">${item.price}</div>
                                </div>
                            `).join('') || '<div style="padding: 16px;">No items</div>'}
                        </div>
                        
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <span class="badge badge-${order.status}">${order.status}</span>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-size: 12px; color: var(--neutral-600);">Total</div>
                                <div style="font-size: 24px; font-weight: 700; color: var(--primary-500);">
                                    ${formatCurrency(order.totals?.total || 0)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="closeModal('orderDetailModal')">Close</button>
                        <button class="btn btn-primary" onclick="admin.updateOrderStatus('${order.id}')">Update Status</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    editOrder(orderId) {
        this.viewOrder(orderId); // For now, same as view
    }

    updateOrderStatus(orderId) {
        const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        const currentStatus = document.querySelector(`#orderDetailModal .badge`).textContent;
        const currentIndex = statuses.indexOf(currentStatus);
        const nextStatus = statuses[(currentIndex + 1) % statuses.length];

        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const order = orders.find(o => o.id === orderId);
        if (order) {
            order.status = nextStatus;
            localStorage.setItem('orders', JSON.stringify(orders));
            
            toast.show(`Order status updated to ${nextStatus}`, 'success');
            closeModal('orderDetailModal');
            this.loadRecentOrders();
        }
    }

    editProduct(productId) {
        toast.show('Edit product functionality coming soon', 'info');
    }

    deleteProduct(productId) {
        if (!confirm('Are you sure you want to delete this product?')) return;

        let products = JSON.parse(localStorage.getItem('products') || '[]');
        products = products.filter(p => p.id !== productId);
        localStorage.setItem('products', JSON.stringify(products));
        
        toast.show('Product deleted', 'success');
        this.loadProducts();
    }

    updateOrderStatusFromTable(orderId, newStatus) {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const order = orders.find(o => o.id === orderId);
        if (order) {
            order.status = newStatus;
            localStorage.setItem('orders', JSON.stringify(orders));
            this.loadRecentOrders();
            toast.show('Status updated', 'success');
        }
    }
}

// Initialize admin
const admin = new AdminManager();