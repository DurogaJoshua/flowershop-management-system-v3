// Maria's Floral Fantasy - Main JavaScript

// Storage Keys
const StorageKeys = {
    CART: 'mff_cart',
    USER: 'currentUser',
    STORE_INFO: 'mff_store_info'
};

// Toast Notification System
const toast = {
    show: function(message, type = 'success', duration = 3000) {
        // Remove existing toast
        const existing = document.querySelector('.toast-notification');
        if (existing) existing.remove();
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add styles
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 9999;
            animation: slideIn 0.3s ease;
            border-left: 4px solid ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6'};
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
};

// Cart Functions
const cart = {
    get: function() {
        return JSON.parse(localStorage.getItem(StorageKeys.CART) || '[]');
    },
    
    add: function(item) {
        const items = this.get();
        const existing = items.find(i => i.id === item.id);
        
        if (existing) {
            existing.quantity += item.quantity || 1;
        } else {
            items.push({ ...item, quantity: item.quantity || 1 });
        }
        
        localStorage.setItem(StorageKeys.CART, JSON.stringify(items));
        this.updateBadge();
        toast.show('Added to cart');
    },
    
    remove: function(id) {
        const items = this.get().filter(i => i.id !== id);
        localStorage.setItem(StorageKeys.CART, JSON.stringify(items));
        this.updateBadge();
    },
    
    clear: function() {
        localStorage.removeItem(StorageKeys.CART);
        this.updateBadge();
    },
    
    getCount: function() {
        return this.get().reduce((sum, item) => sum + item.quantity, 0);
    },
    
    updateBadge: function() {
        const badges = document.querySelectorAll('.cart-count');
        const count = this.getCount();
        badges.forEach(badge => {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        });
    }
};

// User Functions
const user = {
    get: function() {
        return JSON.parse(localStorage.getItem(StorageKeys.USER) || '{}');
    },
    
    isLoggedIn: function() {
        return !!this.get().loggedIn;
    },
    
    isAdmin: function() {
        const u = this.get();
        return u.loggedIn && u.role === 'admin';
    },
    
    logout: function() {
        localStorage.removeItem(StorageKeys.USER);
        window.location.href = 'login.html';
    }
};

// Format Currency
function formatPrice(amount) {
    return '₱' + parseFloat(amount).toLocaleString('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Format Date
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Debounce Function
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

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Update cart badge
    cart.updateBadge();
    
    // Check auth for protected pages
    const protectedPages = ['account.html', 'checkout.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage) && !user.isLoggedIn()) {
        window.location.href = 'login.html?return=' + encodeURIComponent(window.location.href);
    }
});