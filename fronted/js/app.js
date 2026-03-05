// ===== EDOT Platform - Main Application =====

// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// State Management
let currentUser = null;
let isAuthenticated = false;

// DOM Elements
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.querySelector('.nav-menu');
const navButtons = document.getElementById('navButtons');

// ===== UTILITY FUNCTIONS =====
const showLoading = (element) => {
    element.innerHTML = '<div class="loading-spinner"></div>';
};

const showError = (element, message) => {
    element.innerHTML = `
        <div class="alert alert-error">
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
        </div>
    `;
};

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

// ===== AUTHENTICATION =====
const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        updateUIForGuest();
        return false;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            isAuthenticated = true;
            updateUIForUser();
            return true;
        } else {
            logout();
            return false;
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        return false;
    }
};

const updateUIForGuest = () => {
    if (navButtons) {
        navButtons.innerHTML = `
            <a href="login.html" class="btn btn-outline">Login</a>
            <a href="register.html" class="btn btn-primary">Sign Up</a>
        `;
    }
    
    // Update nav menu
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === 'dashboard.html') {
            link.style.display = 'none';
        }
    });
};

const updateUIForUser = () => {
    if (!currentUser) return;

    if (navButtons) {
        navButtons.innerHTML = `
            <span class="user-greeting">Hi, ${currentUser.name}</span>
            <button onclick="logout()" class="btn btn-outline">Logout</button>
        `;
    }
    
    // Show dashboard link
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === 'dashboard.html') {
            link.style.display = 'block';
        }
    });
};

// ===== LOGOUT =====
window.logout = () => {
    localStorage.removeItem('token');
    currentUser = null;
    isAuthenticated = false;
    window.location.href = 'index.html';
};

// ===== API CALLS =====
const apiCall = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        }
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'API call failed');
        }

        return data;
    } catch (error) {
        console.error('API call error:', error);
        throw error;
    }
};

// ===== LOAD CATEGORIES =====
const loadCategories = async () => {
    const categoriesGrid = document.getElementById('categoriesGrid');
    if (!categoriesGrid) return;

    const categories = [
        { name: 'Programming', icon: 'fa-code', count: '120+' },
        { name: 'Mathematics', icon: 'fa-calculator', count: '85+' },
        { name: 'Science', icon: 'fa-flask', count: '95+' },
        { name: 'Exam Prep', icon: 'fa-pencil-alt', count: '150+' },
        { name: 'Languages', icon: 'fa-language', count: '60+' },
        { name: 'Business', icon: 'fa-chart-line', count: '75+' }
    ];

    categoriesGrid.innerHTML = categories.map(category => `
        <a href="courses.html?category=${category.name.toLowerCase()}" class="category-card">
            <i class="fas ${category.icon}"></i>
            <h3>${category.name}</h3>
            <span>${category.count} courses</span>
        </a>
    `).join('');
};
