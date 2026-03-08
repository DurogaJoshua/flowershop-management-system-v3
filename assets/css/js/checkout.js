/**
 * CHECKOUT FUNCTIONALITY
 */

class CheckoutManager {
    constructor() {
        this.step = 1;
        this.shippingInfo = {};
        this.paymentMethod = 'cod';
        this.init();
    }

    init() {
        this.renderOrderSummary();
        this.attachEventListeners();
        this.updateProgress();
    }

    attachEventListeners() {
        // Payment method selection
        document.querySelectorAll('.payment-option').forEach(option => {
            option.addEventListener('click', () => this.selectPayment(option));
        });

        // Form submission
        const form = document.querySelector('.checkout-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.placeOrder();
            });
        }

        // Step navigation
        document.querySelectorAll('.btn-next-step').forEach(btn => {
            btn.addEventListener('click', () => this.nextStep());
        });

        document.querySelectorAll('.btn-prev-step').forEach(btn => {
            btn.addEventListener('click', () => this.prevStep());
        });
    }

    selectPayment(element) {
        // Remove selected from all
        document.querySelectorAll('.payment-option').forEach(opt => {
            opt.classList.remove('selected');
            opt.querySelector('input[type="radio"]').checked = false;
        });

        // Add selected to clicked
        element.classList.add('selected');
        element.querySelector('input[type="radio"]').checked = true;

        // Show/hide GCash field
        const isGCash = element.dataset.method === 'gcash';
        const gcashField = document.getElementById('gcashField');
        if (gcashField) {
            gcashField.style.display = isGCash ? 'block' : 'none';
        }

        this.paymentMethod = element.dataset.method;
    }

    nextStep() {
        if (this.validateStep()) {
            this.step++;
            this.updateProgress();
            this.showStep();
        }
    }

    prevStep() {
        this.step--;
        this.updateProgress();
        this.showStep();
    }

    validateStep() {
        const currentStepEl = document.querySelector(`.checkout-step[data-step="${this.step}"]`);
        if (!currentStepEl) return true;

        const requiredFields = currentStepEl.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
                field.style.borderColor = 'var(--error)';
            } else {
                field.classList.remove('error');
                field.style.borderColor = '';
            }
        });

        if (!isValid) {
            toast.show('Please fill in all required fields', 'error');
        }

        return isValid;
    }

    updateProgress() {
        document.querySelectorAll('.step').forEach((step, index) => {
            step.classList.remove('active', 'completed');
            
            if (index + 1 < this.step) {
                step.classList.add('completed');
            } else if (index + 1 === this.step) {
                step.classList.add('active');
            }
        });
    }

    showStep() {
        document.querySelectorAll('.checkout-step').forEach(el => {
            el.classList.add('hidden');
        });
        
        const currentStep = document.querySelector(`.checkout-step[data-step="${this.step}"]`);
        if (currentStep) {
            currentStep.classList.remove('hidden');
            currentStep.classList.add('animate-fade-in');
        }
    }

    renderOrderSummary() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const container = document.querySelector('.checkout-summary-items');
        
        if (!container) return;

        if (cart.length === 0) {
            container.innerHTML = '<p>Your cart is empty</p>';
            return;
        }

        container.innerHTML = cart.map(item => `
            <div class="summary-item">
                <div class="summary-item-img">🌸</div>
                <div class="summary-item-details">
                    <div class="summary-item-name">${item.name}</div>
                    <div class="summary-item-qty">Qty: ${item.quantity}</div>
                </div>
                <div class="summary-item-price">${item.price}</div>
            </div>
        `).join('');

        this.calculateTotals();
    }

    calculateTotals() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        
        const subtotal = cart.reduce((sum, item) => {
            const price = parseFloat(item.price.replace(/[^0-9.-]+/g, ''));
            return sum + (price * item.quantity);
        }, 0);

        const shipping = subtotal > 5000 ? 0 : 50;
        const tax = subtotal * 0.12;
        const total = subtotal + shipping + tax;

        // Update display
        const updateElement = (selector, value) => {
            const el = document.querySelector(selector);
            if (el) el.textContent = formatCurrency(value);
        };

        updateElement('.summary-subtotal', subtotal);
        updateElement('.summary-shipping', shipping);
        updateElement('.summary-tax', tax);
        updateElement('.summary-total', total);
    }

    placeOrder() {
        // Collect form data
        const formData = new FormData(document.querySelector('.checkout-form'));
        const orderData = {
            id: generateId('ORD'),
            date: new Date().toISOString(),
            customer: {
                name: formData.get('fullname'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                address: formData.get('address'),
                city: formData.get('city'),
                postal: formData.get('postal')
            },
            items: JSON.parse(localStorage.getItem('cart') || '[]'),
            payment: {
                method: this.paymentMethod,
                status: this.paymentMethod === 'cod' ? 'pending' : 'paid'
            },
            status: 'pending',
            totals: this.calculateTotals()
        };

        // Save order
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(orderData);
        localStorage.setItem('orders', JSON.stringify(orders));

        // Clear cart
        localStorage.removeItem('cart');

        // Redirect to confirmation
        window.location.href = `tracking.html?order=${orderData.id}`;
    }
}

// Initialize checkout
const checkout = new CheckoutManager();