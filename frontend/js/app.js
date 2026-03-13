/**
 * EDOT Platform - Core Application Module
 * @version 1.0.0
 */

// ===== CONSTANTS & CONFIGURATION =====
const CONFIG = {
    API_BASE_URL: window.location.hostname === 'localhost' 
        ? 'http://localhost:5000/api' 
        : 'https://api.edot.com/api',
    TOKEN_KEY: 'edot_token',
    USER_KEY: 'edot_user',
    THEME_KEY: 'edot_theme',
    CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,
};

// ===== STATE MANAGEMENT =====
const AppState = {
    user: null,
    isAuthenticated: false,
    token: null,
    theme: 'light',
    notifications: [],
    cache: new Map(),
    
    init() {
        this.loadFromStorage();
        this.initTheme();
        this.initEventListeners();
    },
    
    loadFromStorage() {
        try {
            this.token = localStorage.getItem(CONFIG.TOKEN_KEY);
            const userData = localStorage.getItem(CONFIG.USER_KEY);
            if (userData) {
                this.user = JSON.parse(userData);
                this.isAuthenticated = true;
            }
        } catch (error) {
            console.error('Failed to load from storage:', error);
            this.clearStorage();
        }
    },
    
    saveToStorage() {
        try {
            if (this.token) {
                localStorage.setItem(CONFIG.TOKEN_KEY, this.token);
            }
            if (this.user) {
                localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(this.user));
            }
        } catch (error) {
            console.error('Failed to save to storage:', error);
        }
    },
    
    clearStorage() {
        localStorage.removeItem(CONFIG.TOKEN_KEY);
        localStorage.removeItem(CONFIG.USER_KEY);
        this.token = null;
        this.user = null;
        this.isAuthenticated = false;
    },
    
    initTheme() {
        const savedTheme = localStorage.getItem(CONFIG.THEME_KEY);
        if (savedTheme) {
            this.theme = savedTheme;
            document.documentElement.setAttribute('data-theme', savedTheme);
        }
    },
    
    setTheme(theme) {
        this.theme = theme;
        localStorage.setItem(CONFIG.THEME_KEY, theme);
        document.documentElement.setAttribute('data-theme', theme);
    },
    
    initEventListeners() {
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.refreshAuth();
            }
        });
    },
    
    async refreshAuth() {
        if (this.token && this.user) {
            try {
                await API.checkAuth();
            } catch (error) {
                console.warn('Auth refresh failed:', error);
            }
        }
    }
};

// ===== API SERVICE =====
const API = {
    async request(endpoint, options = {}) {
        const url = `${CONFIG.API_BASE_URL}${endpoint}`;
        const token = AppState.token;
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
            },
            credentials: 'include',
        };
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout
        
        try {
            const response = await fetch(url, {
                ...defaultOptions,
                ...options,
                headers: {
                    ...defaultOptions.headers,
                    ...options.headers,
                },
                signal: controller.signal,
            });
            
            clearTimeout(timeoutId);
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new APIError(
                    data.message || 'API request failed',
                    response.status,
                    data
                );
            }
            
            return data;
        } catch (error) {
            clearTimeout(timeoutId);
            
            if (error.name === 'AbortError') {
                throw new APIError('Request timeout', 408);
            }
            
            if (error instanceof APIError) {
                throw error;
            }
            
            throw new APIError(error.message || 'Network error', 0);
        }
    },
    
    async get(endpoint, useCache = false) {
        if (useCache) {
            const cached = CacheManager.get(endpoint);
            if (cached) return cached;
        }
        
        const response = await this.request(endpoint, { method: 'GET' });
        
        if (useCache) {
            CacheManager.set(endpoint, response);
        }
        
        return response;
    },
    
    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    
    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },
    
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    },
    
    async upload(endpoint, formData) {
        return this.request(endpoint, {
            method: 'POST',
            body: formData,
            headers: {}, // Let browser set content-type for FormData
        });
    },
    
    async checkAuth() {
        try {
            const data = await this.get('/auth/me');
            AppState.user = data.user;
            AppState.isAuthenticated = true;
            AppState.saveToStorage();
            return data;
        } catch (error) {
            if (error.status === 401) {
                AppState.clearStorage();
                UI.updateAuthUI(false);
            }
            throw error;
        }
    },
    
    async login(credentials) {
        const data = await this.post('/auth/login', credentials);
        AppState.token = data.token;
        AppState.user = data.user;
        AppState.isAuthenticated = true;
        AppState.saveToStorage();
        UI.updateAuthUI(true);
        return data;
    },
    
    async register(userData) {
        const data = await this.post('/auth/register', userData);
        AppState.token = data.token;
        AppState.user = data.user;
        AppState.isAuthenticated = true;
        AppState.saveToStorage();
        UI.updateAuthUI(true);
        return data;
    },
    
    logout() {
        AppState.clearStorage();
        UI.updateAuthUI(false);
        window.location.href = '/';
    },
};

// ===== CACHE MANAGER =====
const CacheManager = {
    set(key, data) {
        AppState.cache.set(key, {
            data,
            timestamp: Date.now(),
        });
    },
    
    get(key) {
        const cached = AppState.cache.get(key);
        if (!cached) return null;
        
        if (Date.now() - cached.timestamp > CONFIG.CACHE_DURATION) {
            AppState.cache.delete(key);
            return null;
        }
        
        return cached.data;
    },
    
    clear() {
        AppState.cache.clear();
    },
    
    remove(key) {
        AppState.cache.delete(key);
    },
};

// ===== CUSTOM ERROR CLASS =====
class APIError extends Error {
    constructor(message, status, data = null) {
        super(message);
        this.name = 'APIError';
        this.status = status;
        this.data = data;
        this.timestamp = new Date().toISOString();
    }
}

// ===== UI UTILITIES =====
const UI = {
    elements: {
        mobileMenuBtn: null,
        navMenu: null,
        navButtons: null,
    },
    
    init() {
        this.cacheElements();
        this.initEventListeners();
        this.initMobileMenu();
        this.updateAuthUI(AppState.isAuthenticated);
    },
    
    cacheElements() {
        this.elements = {
            mobileMenuBtn: document.getElementById('mobileMenuBtn'),
            navMenu: document.querySelector('.nav-menu'),
            navButtons: document.getElementById('navButtons'),
        };
    },
    
    initEventListeners() {
        // Close mobile menu on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.elements.navMenu) {
                this.elements.navMenu.classList.remove('active');
            }
        });
        
        // Close mobile menu on click outside
        document.addEventListener('click', (e) => {
            if (this.elements.navMenu?.classList.contains('active')) {
                if (!e.target.closest('.nav-menu') && !e.target.closest('.mobile-menu-btn')) {
                    this.elements.navMenu.classList.remove('active');
                    const icon = this.elements.mobileMenuBtn?.querySelector('i');
                    if (icon) {
                        icon.className = 'fas fa-bars';
                    }
                }
            }
        });
        
        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.elements.navMenu?.classList.contains('active')) {
                this.toggleMobileMenu();
            }
        });
    },
    
    initMobileMenu() {
        if (this.elements.mobileMenuBtn) {
            this.elements.mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
        }
    },
    
    toggleMobileMenu() {
        if (!this.elements.navMenu) return;
        
        this.elements.navMenu.classList.toggle('active');
        const icon = this.elements.mobileMenuBtn?.querySelector('i');
        
        if (icon) {
            icon.className = this.elements.navMenu.classList.contains('active')
                ? 'fas fa-times'
                : 'fas fa-bars';
        }
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = this.elements.navMenu.classList.contains('active')
            ? 'hidden'
            : '';
    },
    
    updateAuthUI(isAuthenticated) {
        const navButtons = this.elements.navButtons;
        if (!navButtons) return;
        
        if (isAuthenticated && AppState.user) {
            navButtons.innerHTML = `
                <span class="user-greeting">Hi, ${AppState.user.name}</span>
                <button onclick="API.logout()" class="btn btn-outline">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
            `;
            
            // Show dashboard link
            document.querySelectorAll('.nav-link[href="dashboard.html"]').forEach(link => {
                link.style.display = 'block';
            });
            
            // Show instructor menu if user is instructor
            if (AppState.user.role === 'instructor') {
                document.querySelectorAll('.instructor-menu').forEach(el => {
                    el.style.display = 'block';
                });
            }
        } else {
            navButtons.innerHTML = `
                <a href="login.html" class="btn btn-outline">Login</a>
                <a href="register.html" class="btn btn-primary">Sign Up</a>
            `;
            
            // Hide dashboard link
            document.querySelectorAll('.nav-link[href="dashboard.html"]').forEach(link => {
                link.style.display = 'none';
            });
            
            document.querySelectorAll('.instructor-menu').forEach(el => {
                el.style.display = 'none';
            });
        }
    },
    
    showNotification(message, type = 'info', duration = 5000) {
        const notification = new Notification(message, type, duration);
        notification.show();
    },
    
    showLoading(container) {
        if (!container) return;
        container.innerHTML = '<div class="loading-spinner"></div>';
    },
    
    showError(container, message, retry = null) {
        if (!container) return;
        container.innerHTML = `
            <div class="alert alert-error">
                <i class="fas fa-exclamation-circle"></i>
                <p>${message}</p>
                ${retry ? '<button onclick="location.reload()" class="btn btn-small">Retry</button>' : ''}
            </div>
        `;
    },
    
    setActiveNavLink() {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-link').forEach(link => {
            const href = link.getAttribute('href');
            link.classList.toggle('active', href === currentPath);
        });
    },
};

// ===== NOTIFICATION CLASS =====
class Notification {
    constructor(message, type = 'info', duration = 5000) {
        this.message = message;
        this.type = type;
        this.duration = duration;
        this.element = null;
        this.timeout = null;
    }
    
    create() {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle',
        };
        
        this.element = document.createElement('div');
        this.element.className = `notification-toast alert alert-${this.type}`;
        this.element.innerHTML = `
            <i class="fas ${icons[this.type] || icons.info}"></i>
            <span>${this.message}</span>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        return this.element;
    }
    
    show() {
        const element = this.create();
        document.body.appendChild(element);
        
        this.timeout = setTimeout(() => {
            element.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (element.parentNode) {
                    element.remove();
                }
            }, 300);
        }, this.duration);
        
        // Clear timeout if notification is manually closed
        element.querySelector('.notification-close').addEventListener('click', () => {
            clearTimeout(this.timeout);
        });
    }
}

// ===== VALIDATION UTILITIES =====
const Validators = {
    email(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    password(password) {
        return password.length >= 6;
    },
    
    name(name) {
        return name.length >= 2 && name.length <= 50;
    },
    
    phone(phone) {
        if (!phone) return true; // Optional
        const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        return re.test(phone);
    },
    
    url(url) {
        if (!url) return true;
        const re = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        return re.test(url);
    },
    
    required(value) {
        return value !== undefined && value !== null && value.toString().trim() !== '';
    },
    
    minLength(value, min) {
        return value.length >= min;
    },
    
    maxLength(value, max) {
        return value.length <= max;
    },
};

// ===== FORMATTING UTILITIES =====
const Formatters = {
    currency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    },
    
    date(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(new Date(date));
    },
    
    relativeTime(date) {
        const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
        const now = new Date();
        const diff = new Date(date) - now;
        
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) return rtf.format(-days, 'day');
        if (hours > 0) return rtf.format(-hours, 'hour');
        if (minutes > 0) return rtf.format(-minutes, 'minute');
        return rtf.format(-seconds, 'second');
    },
    
    duration(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        
        if (hours === 0) return `${mins} min`;
        if (mins === 0) return `${hours} hr`;
        return `${hours} hr ${mins} min`;
    },
    
    number(num) {
        return new Intl.NumberFormat('en-US').format(num);
    },
    
    percentage(num) {
        return new Intl.NumberFormat('en-US', {
            style: 'percent',
            minimumFractionDigits: 0,
            maximumFractionDigits: 1,
        }).format(num / 100);
    },
};

// ===== STORAGE UTILITIES =====
const Storage = {
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Storage set error:', error);
        }
    },
    
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Storage get error:', error);
            return defaultValue;
        }
    },
    
    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Storage remove error:', error);
        }
    },
    
    clear() {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Storage clear error:', error);
        }
    },
};

// ===== DEBOUNCE & THROTTLE =====
const Debouncer = {
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
};

// ===== DOM READY HELPER =====
const DomReady = (callback) => {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
    } else {
        callback();
    }
};

// ===== INITIALIZATION =====
DomReady(() => {
    // Initialize app state
    AppState.init();
    
    // Initialize UI
    UI.init();
    
    // Set active navigation
    UI.setActiveNavLink();
    
    // Check authentication on page load
    if (AppState.token) {
        API.checkAuth().catch(() => {
            // Silent fail - UI will update accordingly
        });
    }
    
    // Load page-specific modules
    const page = document.body.dataset.page;
    if (page && window[`init${page}`]) {
        window[`init${page}`]();
    }
});

// ===== EXPORT GLOBALS =====
window.API = API;
window.UI = UI;
window.Validators = Validators;
window.Formatters = Formatters;
window.Storage = Storage;
window.Debouncer = Debouncer;
window.AppState = AppState;