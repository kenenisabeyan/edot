/**
 * EDOT Platform - Authentication Module
 * @version 1.0.0
 */

// ===== DOM ELEMENTS =====
const AuthElements = {
    loginForm: document.getElementById('loginForm'),
    registerForm: document.getElementById('registerForm'),
    logoutBtn: document.getElementById('logoutBtn'),
    forgotPassword: document.getElementById('forgotPassword'),
};

// ===== INITIALIZATION =====
const initAuth = () => {
    if (AuthElements.loginForm) initLoginForm();
    if (AuthElements.registerForm) initRegisterForm();
    if (AuthElements.logoutBtn) initLogout();
    if (AuthElements.forgotPassword) initForgotPassword();
    initPasswordToggles();
};

// ===== LOGIN FORM =====
const initLoginForm = () => {
    const form = AuthElements.loginForm;
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberCheck = document.getElementById('remember');
    
    // Pre-fill email if remembered
    const rememberedEmail = Storage.get('remembered_email');
    if (rememberedEmail && emailInput) {
        emailInput.value = rememberedEmail;
        if (rememberCheck) rememberCheck.checked = true;
    }
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Clear previous errors
        clearFieldErrors();
        
        // Get values
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const remember = rememberCheck?.checked || false;
        
        // Validate
        if (!validateLoginForm(email, password)) {
            return;
        }
        
        // Show loading
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        setButtonLoading(submitBtn, true, 'Logging in...');
        
        try {
            const data = await API.login({ email, password });
            
            // Save email if remember me is checked
            if (remember) {
                Storage.set('remembered_email', email);
            } else {
                Storage.remove('remembered_email');
            }
            
            UI.showNotification('Login successful! Redirecting...', 'success');
            
            // Redirect based on role
            setTimeout(() => {
                if (data.user.role === 'instructor') {
                    window.location.href = 'dashboard.html?tab=instructor';
                } else {
                    window.location.href = 'dashboard.html';
                }
            }, 1500);
            
        } catch (error) {
            handleAuthError(error);
            setButtonLoading(submitBtn, false, originalText);
        }
    });
};

// ===== REGISTER FORM =====
const initRegisterForm = () => {
    const form = AuthElements.registerForm;
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmInput = document.getElementById('confirmPassword');
    const roleSelect = document.getElementById('role');
    
    // Real-time password strength indicator
    if (passwordInput) {
        passwordInput.addEventListener('input', () => {
            updatePasswordStrength(passwordInput.value);
        });
    }
    
    // Real-time password match
    if (confirmInput && passwordInput) {
        confirmInput.addEventListener('input', () => {
            checkPasswordMatch(passwordInput.value, confirmInput.value);
        });
    }
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Clear previous errors
        clearFieldErrors();
        
        // Get values
        const userData = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            password: passwordInput.value,
            confirmPassword: confirmInput.value,
            role: roleSelect?.value || 'student'
        };
        
        // Validate
        if (!validateRegisterForm(userData)) {
            return;
        }
        
        // Show loading
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        setButtonLoading(submitBtn, true, 'Creating account...');
        
        try {
            await API.register(userData);
            
            UI.showNotification('Account created successfully! Welcome to EDOT!', 'success');
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
            
        } catch (error) {
            handleAuthError(error);
            setButtonLoading(submitBtn, false, originalText);
        }
    });
};

// ===== VALIDATION FUNCTIONS =====
const validateLoginForm = (email, password) => {
    let isValid = true;
    
    if (!Validators.required(email)) {
        showFieldError('email', 'Email is required');
        isValid = false;
    } else if (!Validators.email(email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    if (!Validators.required(password)) {
        showFieldError('password', 'Password is required');
        isValid = false;
    } else if (!Validators.minLength(password, 6)) {
        showFieldError('password', 'Password must be at least 6 characters');
        isValid = false;
    }
    
    return isValid;
};

const validateRegisterForm = (data) => {
    let isValid = true;
    
    // Name validation
    if (!Validators.required(data.name)) {
        showFieldError('name', 'Name is required');
        isValid = false;
    } else if (!Validators.minLength(data.name, 2)) {
        showFieldError('name', 'Name must be at least 2 characters');
        isValid = false;
    } else if (!Validators.maxLength(data.name, 50)) {
        showFieldError('name', 'Name cannot exceed 50 characters');
        isValid = false;
    }
    
    // Email validation
    if (!Validators.required(data.email)) {
        showFieldError('email', 'Email is required');
        isValid = false;
    } else if (!Validators.email(data.email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Password validation
    if (!Validators.required(data.password)) {
        showFieldError('password', 'Password is required');
        isValid = false;
    } else if (!Validators.minLength(data.password, 6)) {
        showFieldError('password', 'Password must be at least 6 characters');
        isValid = false;
    } else {
        const strength = checkPasswordStrength(data.password);
        if (strength.score < 2) {
            showFieldError('password', 'Password is too weak. Add uppercase, numbers, or special characters.');
            isValid = false;
        }
    }
    
    // Confirm password validation
    if (data.password !== data.confirmPassword) {
        showFieldError('confirmPassword', 'Passwords do not match');
        isValid = false;
    }
    
    return isValid;
};

// ===== PASSWORD STRENGTH =====
const checkPasswordStrength = (password) => {
    let score = 0;
    const feedback = [];
    
    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    
    // Character variety
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    // Feedback messages
    if (password.length < 8) {
        feedback.push('Use at least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
        feedback.push('Add uppercase letters');
    }
    if (!/[0-9]/.test(password)) {
        feedback.push('Add numbers');
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
        feedback.push('Add special characters');
    }
    
    return {
        score: Math.min(score, 4),
        feedback: feedback,
        strength: ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'][score]
    };
};

const updatePasswordStrength = (password) => {
    const strength = checkPasswordStrength(password);
    const meter = document.getElementById('passwordStrength');
    
    if (!meter) {
        // Create strength meter if it doesn't exist
        createPasswordStrengthMeter();
    }
    
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    
    if (strengthBar) {
        strengthBar.style.width = `${(strength.score + 1) * 20}%`;
        strengthBar.className = `strength-bar strength-${strength.score}`;
    }
    
    if (strengthText) {
        strengthText.textContent = strength.strength;
        strengthText.className = `strength-text strength-${strength.score}`;
    }
};

const createPasswordStrengthMeter = () => {
    const passwordGroup = document.querySelector('.form-group:has(#password)');
    if (!passwordGroup) return;
    
    const meter = document.createElement('div');
    meter.id = 'passwordStrength';
    meter.className = 'password-strength';
    meter.innerHTML = `
        <div class="strength-meter">
            <div class="strength-bar"></div>
        </div>
        <span class="strength-text"></span>
    `;
    
    passwordGroup.appendChild(meter);
};

const checkPasswordMatch = (password, confirm) => {
    const confirmGroup = document.getElementById('confirmPassword')?.parentNode;
    const existingMessage = confirmGroup?.querySelector('.password-match');
    
    if (existingMessage) {
        existingMessage.remove();
    }
    
    if (confirm && password !== confirm) {
        const message = document.createElement('small');
        message.className = 'password-match error';
        message.innerHTML = '<i class="fas fa-times-circle"></i> Passwords do not match';
        confirmGroup?.appendChild(message);
    } else if (confirm && password === confirm) {
        const message = document.createElement('small');
        message.className = 'password-match success';
        message.innerHTML = '<i class="fas fa-check-circle"></i> Passwords match';
        confirmGroup?.appendChild(message);
    }
};

// ===== FIELD ERROR HANDLING =====
const showFieldError = (fieldId, message) => {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    field.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.id = `error-${fieldId}`;
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    
    const container = field.parentNode;
    container.appendChild(errorDiv);
    
    // Remove error on input
    field.addEventListener('input', function removeError() {
        this.classList.remove('error');
        const error = document.getElementById(`error-${fieldId}`);
        if (error) error.remove();
        this.removeEventListener('input', removeError);
    }, { once: true });
};

const clearFieldErrors = () => {
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
};

// ===== BUTTON LOADING STATE =====
const setButtonLoading = (button, isLoading, text = null) => {
    if (isLoading) {
        button.dataset.originalText = button.innerHTML;
        button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text || 'Loading...'}`;
        button.disabled = true;
        button.classList.add('btn-loading');
    } else {
        button.innerHTML = text || button.dataset.originalText || 'Submit';
        button.disabled = false;
        button.classList.remove('btn-loading');
    }
};

// ===== ERROR HANDLING =====
const handleAuthError = (error) => {
    console.error('Auth error:', error);
    
    let message = 'An error occurred. Please try again.';
    
    if (error instanceof APIError) {
        switch (error.status) {
            case 400:
                message = error.data?.message || 'Invalid request. Please check your input.';
                break;
            case 401:
                message = 'Invalid email or password.';
                break;
            case 403:
                message = 'Account is locked. Please contact support.';
                break;
            case 409:
                message = 'An account with this email already exists.';
                break;
            case 429:
                message = 'Too many attempts. Please try again later.';
                break;
            case 500:
                message = 'Server error. Please try again later.';
                break;
            default:
                message = error.message || message;
        }
    }
    
    UI.showNotification(message, 'error');
};

// ===== PASSWORD TOGGLE =====
const initPasswordToggles = () => {
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.target;
            const input = document.getElementById(targetId);
            
            if (!input) return;
            
            const type = input.type === 'password' ? 'text' : 'password';
            input.type = type;
            
            const icon = btn.querySelector('i');
            if (icon) {
                icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
            }
        });
    });
};

// ===== FORGOT PASSWORD =====
const initForgotPassword = () => {
    const link = AuthElements.forgotPassword;
    
    link.addEventListener('click', async (e) => {
        e.preventDefault();
        
        const email = prompt('Please enter your email address:');
        if (!email) return;
        
        if (!Validators.email(email)) {
            UI.showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        try {
            // Show loading state
            link.style.opacity = '0.5';
            link.style.pointerEvents = 'none';
            
            // API call would go here
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            UI.showNotification(
                'If an account exists with this email, you will receive password reset instructions.',
                'success'
            );
        } catch (error) {
            UI.showNotification('Failed to send reset email. Please try again.', 'error');
        } finally {
            link.style.opacity = '1';
            link.style.pointerEvents = 'auto';
        }
    });
};

// ===== LOGOUT =====
const initLogout = () => {
    AuthElements.logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        API.logout();
    });
};

// ===== ADD CSS FOR PASSWORD STRENGTH =====
const addAuthStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        .password-strength {
            margin-top: var(--space-2);
        }
        
        .strength-meter {
            height: 4px;
            background: var(--border);
            border-radius: var(--radius-full);
            overflow: hidden;
            margin-bottom: var(--space-1);
        }
        
        .strength-bar {
            height: 100%;
            width: 0;
            transition: var(--transition-base);
        }
        
        .strength-0 { background: #ef4444; width: 20%; }
        .strength-1 { background: #f97316; width: 40%; }
        .strength-2 { background: #eab308; width: 60%; }
        .strength-3 { background: #22c55e; width: 80%; }
        .strength-4 { background: #15803d; width: 100%; }
        
        .strength-text {
            font-size: 0.75rem;
            color: var(--text-light);
        }
        
        .strength-text.strength-0 { color: #ef4444; }
        .strength-text.strength-1 { color: #f97316; }
        .strength-text.strength-2 { color: #eab308; }
        .strength-text.strength-3 { color: #22c55e; }
        .strength-text.strength-4 { color: #15803d; }
        
        .password-match {
            display: block;
            font-size: 0.75rem;
            margin-top: var(--space-1);
        }
        
        .password-match.error {
            color: #ef4444;
        }
        
        .password-match.success {
            color: #22c55e;
        }
        
        .btn-loading {
            position: relative;
            pointer-events: none;
            opacity: 0.8;
        }
        
        .btn-loading i {
            animation: spin 1s linear infinite;
        }
    `;
    document.head.appendChild(style);
};

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    addAuthStyles();
});

// ===== EXPORT FOR GLOBAL USE =====
window.initAuth = initAuth;