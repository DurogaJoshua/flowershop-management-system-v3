/**
 * CART FUNCTIONALITY
 */

class CartManager {
    constructor() {
        this.cart = this.getCart();
        this.init();
    }

    init() {
        this.renderCart();
        this.attachEventListeners();
    }

    getCart() {
        return JSON.parse(localStorage.getItem('cart') || '[]');
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateCartCount();
    }

    updateCartCount() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCount = document.querySelector('.cart-count');
        
        if (cartCount) {
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }

    addItem(item) {
        const existingItem = this.cart.find(i => i.id === item.id);
        
        if (existingItem) {
            existingItem.quantity += item.quantity;
            toast.show(`Updated ${item.name} quantity`, 'success');
        } else {
            this.cart.push(item);
            toast.show(`${item.name} added to cart`, 'success');
        }
        
        this.saveCart();
        this.renderCart();
    }

    removeItem(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveCart();
        this.renderCart();
        toast.show('Item removed from cart', 'info');
    }

    updateQuantity(itemId, change) {
        const item = this.cart.find(i => i.id === itemId);
        if (!item) return;

        item.quantity += change;
        
        if (item.quantity <= 0) {
            this.removeItem(itemId);
            return;
        }
        
        this.saveCart();
        this.renderCart();
    }

    clearCart() {
        if (confirm('Are you sure you want to clear your cart?')) {
            this.cart = [];
            this.saveCart();
            this.renderCart();
            toast.show('Cart cleared', 'info');
        }
    }

    calculateTotals() {
        const subtotal = this.cart.reduce((sum, item) => {
            const price = parseFloat(item.price.replace(/[^0-9.-]+/g, ''));
            return sum + (price * item.quantity);
        }, 0);

        const shipping = subtotal > 5000 ? 0 : 50;
        const tax = subtotal * 0.12;
        const total = subtotal + shipping + tax;

        return { subtotal, shipping, tax, total };
    }

    renderCart() {
        const cartContainer = document.querySelector('.cart-items');
        const summaryContainer = document.querySelector('.cart-summary');
        
        if (!cartContainer) return;

        if (this.cart.length === 0) {
            cartContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🛒</div>
                    <h3 class="empty-title">Your cart is empty</h3>
                    <p class="empty-text">Looks like you haven't added any flowers yet.</p>
                    <a href="shop.html" class="btn btn-primary">Continue Shopping</a>
                </div>
            `;
            if (summaryContainer) summaryContainer.style.display = 'none';
            return;
        }

        if (summaryContainer) summaryContainer.style.display = 'block';

        // Render cart items
        cartContainer.innerHTML = this.cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">🌸</div>
                <div class="cart-item-details">
                    <h3 class="cart-item-title">${item.name}</h3>
                    <div class="cart-item-price">${item.price}</div>
                    <div class="cart-item-actions">
                        <div class="quantity-control">
                            <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', -1)">-</button>
                            <span class="quantity-value">${item.quantity}</span>
                            <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', 1)">+</button>
                        </div>
                        <button class="btn btn-ghost btn-sm" onclick="cart.removeItem('${item.id}')" style="color: var(--error);">
                            <i class="fas fa-trash"></i> Remove
                        </button>
                        <button class="btn btn-ghost btn-sm">
                            <i class="far fa-heart"></i> Save
                        </button>
                    </div>
                </div>
                <div class="cart-item-total">
                    ${formatCurrency(parseFloat(item.price.replace(/[^0-9.-]+/g, '')) * item.quantity)}
                </div>
            </div>
        `).join('');

        // Render summary
        this.renderSummary();
    }

    renderSummary() {
        const totals = this.calculateTotals();
        
        const summaryRows = document.querySelectorAll('.summary-row');
        if (summaryRows.length >= 4) {
            summaryRows[0].querySelector('span:last-child').textContent = formatCurrency(totals.subtotal);
            summaryRows[1].querySelector('span:last-child').textContent = formatCurrency(totals.shipping);
            summaryRows[2].querySelector('span:last-child').textContent = formatCurrency(totals.tax);
            summaryRows[3].querySelector('span:last-child').textContent = formatCurrency(totals.total);
        }
    }

    attachEventListeners() {
        // Clear cart button
        const clearBtn = document.querySelector('.btn-clear-cart');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearCart());
        }

        // Checkout button
        const checkoutBtn = document.querySelector('.btn-checkout');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (this.cart.length === 0) {
                    toast.show('Your cart is empty', 'error');
                    return;
                }
                window.location.href = 'checkout.html';
            });
        }
    }
}

// Initialize cart
const cart = new CartManager();