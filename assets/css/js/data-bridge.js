// Data Bridge for Maria's Floral Fantasy
// Handles synchronization between admin and storefront

const MFF_DataBridge = {
    keys: {
        STORE_INFO: 'mff_store_info',
        PRODUCTS: 'mff_products',
        CATEGORIES: 'mff_categories',
        HOMEPAGE: 'mff_homepage',
        CART: 'mff_cart'
    },

    // Getters
    getStoreInfo() {
        return JSON.parse(localStorage.getItem(this.keys.STORE_INFO)) || {};
    },

    getProducts() {
        return JSON.parse(localStorage.getItem(this.keys.PRODUCTS)) || [];
    },

    getCategories() {
        return JSON.parse(localStorage.getItem(this.keys.CATEGORIES)) || [];
    },

    getHomepage() {
        return JSON.parse(localStorage.getItem(this.keys.HOMEPAGE)) || {};
    },

    getCart() {
        return JSON.parse(localStorage.getItem(this.keys.CART)) || [];
    },

    // Setters with event dispatch
    saveStoreInfo(data) {
        localStorage.setItem(this.keys.STORE_INFO, JSON.stringify(data));
        this.notifyChange('store_info', data);
    },

    saveProducts(products) {
        localStorage.setItem(this.keys.PRODUCTS, JSON.stringify(products));
        this.notifyChange('products', products);
    },

    saveCategories(categories) {
        localStorage.setItem(this.keys.CATEGORIES, JSON.stringify(categories));
        this.notifyChange('categories', categories);
    },

    saveHomepage(homepage) {
        localStorage.setItem(this.keys.HOMEPAGE, JSON.stringify(homepage));
        this.notifyChange('homepage', homepage);
    },

    addToCart(product) {
        const cart = this.getCart();
        const existing = cart.find(item => item.id === product.id);
        
        if (existing) {
            existing.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        
        localStorage.setItem(this.keys.CART, JSON.stringify(cart));
        this.notifyChange('cart', cart);
        return cart;
    },

    // Event system
    notifyChange(type, data) {
        window.dispatchEvent(new CustomEvent('mff_data_changed', {
            detail: { type, data }
        }));
    },

    onChange(callback) {
        window.addEventListener('mff_data_changed', (e) => callback(e.detail));
    },

    // Initialize default data
    initDefaults() {
        const defaults = {
            storeInfo: {
                name: "Maria's Floral Fantasy",
                email: "hello@mariasfloral.ph",
                tagline: "Fresh Flowers Delivered to Your Doorstep",
                description: "Beautiful, hand-crafted bouquets for every occasion...",
                phone: "0956-431-7832",
                address: "Brgy. 106 New Hope Tacloban City",
                themeColor: "#e91e63"
            },
            products: [
                { id: 1, name: "Rose Bouquet Deluxe", price: 1250, category: "roses", emoji: "🌹", featured: true },
                { id: 2, name: "Sunflower Sunshine Box", price: 850, category: "boxes", emoji: "🌻", featured: true }
            ],
            categories: [
                { id: "roses", name: "Roses", emoji: "🌹", count: 24 },
                { id: "weddings", name: "Weddings", emoji: "💒", count: 18 }
            ],
            homepage: {
                hero: {
                    title: "Fresh Flowers Delivered to Your Doorstep",
                    subtitle: "Beautiful, hand-crafted bouquets for every occasion...",
                    cta1: "Shop Now",
                    cta2: "View Collection"
                },
                featuredProductIds: [1, 2]
            }
        };

        if (!localStorage.getItem(this.keys.STORE_INFO)) {
            this.saveStoreInfo(defaults.storeInfo);
        }
        if (!localStorage.getItem(this.keys.PRODUCTS)) {
            this.saveProducts(defaults.products);
        }
        if (!localStorage.getItem(this.keys.CATEGORIES)) {
            this.saveCategories(defaults.categories);
        }
        if (!localStorage.getItem(this.keys.HOMEPAGE)) {
            this.saveHomepage(defaults.homepage);
        }
    }
};

// Auto-initialize
MFF_DataBridge.initDefaults();