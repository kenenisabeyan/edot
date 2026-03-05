/**
 * EDOT Platform - Contact Module
 * @version 1.0.0
 */

// ===== STATE =====
const ContactState = {
    isSubmitting: false,
    formData: {},
    notifications: [],
};

// ===== DOM ELEMENTS =====
const ContactElements = {
    form: document.getElementById('contactForm'),
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    subject: document.getElementById('subject'),
    message: document.getElementById('message'),
    newsletter: document.getElementById('newsletter'),
    submitBtn: null,
};

// ===== INITIALIZATION =====
const initContact = () => {
    cacheElements();
    initEventListeners();
    prefillUserData();
    initMapInteractions();
    initFormValidation();
    initCharacterCounter();
    initFaqAccordion();
};

const cacheElements = () => {
    ContactElements.submitBtn = ContactElements.form?.querySelector('button[type="submit"]');
};

// ===== EVENT LISTENERS =====
const initEventListeners = () => {
    if (ContactElements.form) {
        ContactElements.form.addEventListener('submit', handleSubmit);
    }
    
    // Real-time validation
    if (ContactElements.email) {
        ContactElements.email.addEventListener('blur', () => validateField('email'));
    }
    
    if (ContactElements.phone) {
        ContactElements.phone.addEventListener('blur', () => validateField('phone'));
    }
    
    if (ContactElements.message) {
        ContactElements.message.addEventListener('input', updateCharacterCounter);
    }
};

// ===== FORM HANDLING =====
const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (ContactState.isSubmitting) return;
    
    // Get form data
    const formData = {
        name: ContactElements.name?.value.trim() || '',
        email: ContactElements.email?.value.trim() || '',
        phone: ContactElements.phone?.value.trim() || '',
        subject: ContactElements.subject?.value || '',
        message: ContactElements.message?.value.trim() || '',
        newsletter: ContactElements.newsletter?.checked || false,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
    };
    
    // Validate form
    if (!validateForm(formData)) {
        return;
    }
    
    // Show loading state
    setLoadingState(true);
    
    try {
        // Send to backend
        const response = await submitContactForm(formData);
        
        // Show success message
        showSuccessMessage();
        
        // Reset form
        resetForm();
        
        // Track conversion
        trackContactConversion(formData);
        
    } catch (error) {
        handleSubmitError(error);
    } finally {
        setLoadingState(false);
    }
};

const submitContactForm = async (formData) => {
    // In production, this would be a real API call
    // For now, we'll simulate with a delay
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Contact form submitted:', formData);
            resolve({ success: true });
        }, 1500);
    });
    
    // Real implementation would be:
    // return await API.post('/contact', formData);
};

// ===== VALIDATION =====
const initFormValidation = () => {
    // Add validation styles
    const style = document.createElement('style');
    style.textContent = `
        .form-group {
            position: relative;
            margin-bottom: var(--space-5);
        }
        
        .form-group.error input,
        .form-group.error select,
        .form-group.error textarea {
            border-color: #ef4444;
            background-color: #fef2f2;
        }
        
        .form-group.success input,
        .form-group.success select,
        .form-group.success textarea {
            border-color: #22c55e;
            background-color: #f0fdf4;
        }
        
        .field-feedback {
            font-size: 0.875rem;
            margin-top: 0.25rem;
            display: flex;
            align-items: center;
            gap: 0.25rem;
        }
        
        .field-feedback.error {
            color: #ef4444;
        }
        
        .field-feedback.success {
            color: #22c55e;
        }
        
        .field-feedback i {
            font-size: 0.875rem;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .shake {
            animation: shake 0.5s ease-in-out;
        }
    `;
    document.head.appendChild(style);
};

const validateForm = (data) => {
    let isValid = true;
    
    // Clear previous validation states
    clearValidation();
    
    // Validate name
    if (!data.name) {
        showFieldError('name', 'Name is required');
        isValid = false;
    } else if (data.name.length < 2) {
        showFieldError('name', 'Name must be at least 2 characters');
        isValid = false;
    } else if (data.name.length > 50) {
        showFieldError('name', 'Name cannot exceed 50 characters');
        isValid = false;
    } else {
        showFieldSuccess('name');
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email) {
        showFieldError('email', 'Email is required');
        isValid = false;
    } else if (!emailRegex.test(data.email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    } else {
        showFieldSuccess('email');
    }
    
    // Validate phone (optional)
    if (data.phone) {
        const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        if (!phoneRegex.test(data.phone)) {
            showFieldError('phone', 'Please enter a valid phone number');
            isValid = false;
        } else {
            showFieldSuccess('phone');
        }
    }
    
    // Validate subject
    if (!data.subject) {
        showFieldError('subject', 'Please select a subject');
        isValid = false;
    } else {
        showFieldSuccess('subject');
    }
    
    // Validate message
    if (!data.message) {
        showFieldError('message', 'Message is required');
        isValid = false;
    } else if (data.message.length < 10) {
        showFieldError('message', 'Message must be at least 10 characters');
        isValid = false;
    } else if (data.message.length > 1000) {
        showFieldError('message', 'Message cannot exceed 1000 characters');
        isValid = false;
    } else {
        showFieldSuccess('message');
    }
    
    // Shake form if invalid
    if (!isValid && ContactElements.form) {
        ContactElements.form.classList.add('shake');
        setTimeout(() => {
            ContactElements.form?.classList.remove('shake');
        }, 500);
    }
    
    return isValid;
};

const validateField = (fieldName) => {
    const field = ContactElements[fieldName];
    if (!field) return;
    
    const value = field.value.trim();
    let isValid = true;
    
    switch(fieldName) {
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(value);
            break;
        case 'phone':
            if (value) {
                const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
                isValid = phoneRegex.test(value);
            }
            break;
    }
    
    if (isValid) {
        showFieldSuccess(fieldName);
    } else {
        showFieldError(fieldName, `Invalid ${fieldName} format`);
    }
};

const showFieldError = (fieldName, message) => {
    const field = ContactElements[fieldName];
    if (!field) return;
    
    const group = field.closest('.form-group');
    if (!group) return;
    
    // Remove existing feedback
    const existing = group.querySelector('.field-feedback');
    if (existing) existing.remove();
    
    // Add error class
    group.classList.add('error');
    group.classList.remove('success');
    
    // Add error message
    const feedback = document.createElement('div');
    feedback.className = 'field-feedback error';
    feedback.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    group.appendChild(feedback);
    
    // Add ARIA attributes
    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', `error-${fieldName}`);
    feedback.id = `error-${fieldName}`;
};

const showFieldSuccess = (fieldName) => {
    const field = ContactElements[fieldName];
    if (!field) return;
    
    const group = field.closest('.form-group');
    if (!group) return;
    
    // Remove existing feedback
    const existing = group.querySelector('.field-feedback');
    if (existing) existing.remove();
    
    // Add success class
    group.classList.add('success');
    group.classList.remove('error');
    
    // Add success indicator
    const feedback = document.createElement('div');
    feedback.className = 'field-feedback success';
    feedback.innerHTML = '<i class="fas fa-check-circle"></i> Looks good!';
    group.appendChild(feedback);
    
    // Update ARIA attributes
    field.setAttribute('aria-invalid', 'false');
    field.removeAttribute('aria-describedby');
};

const clearValidation = () => {
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error', 'success');
        const feedback = group.querySelector('.field-feedback');
        if (feedback) feedback.remove();
    });
    
    document.querySelectorAll('[aria-invalid]').forEach(field => {
        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-describedby');
    });
};

// ===== CHARACTER COUNTER =====
const initCharacterCounter = () => {
    if (!ContactElements.message) return;
    
    const counter = document.createElement('div');
    counter.className = 'char-counter';
    counter.innerHTML = '<span id="charCount">0</span>/1000 characters';
    ContactElements.message.parentNode.appendChild(counter);
};

const updateCharacterCounter = () => {
    if (!ContactElements.message) return;
    
    const count = ContactElements.message.value.length;
    const counter = document.querySelector('.char-counter span');
    
    if (counter) {
        counter.textContent = count;
        counter.style.color = count > 900 ? '#ef4444' : 
                             count > 800 ? '#f97316' : 
                             'var(--text-light)';
    }
};

// ===== FAQ ACCORDION =====
const initFaqAccordion = () => {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('h4');
        const answer = item.querySelector('p');
        
        if (question && answer) {
            // Add icon
            const icon = document.createElement('i');
            icon.className = 'fas fa-chevron-down faq-icon';
            question.prepend(icon);
            
            // Style answer
            answer.style.display = 'none';
            
            // Add click handler
            question.addEventListener('click', () => {
                const isOpen = answer.style.display === 'block';
                
                // Close others
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        const otherAnswer = otherItem.querySelector('p');
                        const otherIcon = otherItem.querySelector('.faq-icon');
                        if (otherAnswer) otherAnswer.style.display = 'none';
                        if (otherIcon) otherIcon.className = 'fas fa-chevron-down faq-icon';
                    }
                });
                
                // Toggle current
                answer.style.display = isOpen ? 'none' : 'block';
                icon.className = isOpen ? 'fas fa-chevron-down faq-icon' : 
                                          'fas fa-chevron-up faq-icon';
            });
        }
    });
    
    // Add FAQ styles
    const style = document.createElement('style');
    style.textContent = `
        .faq-item h4 {
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: var(--space-2);
            padding: var(--space-2);
            margin: 0;
            transition: var(--transition-fast);
        }
        
        .faq-item h4:hover {
            color: var(--primary);
        }
        
        .faq-icon {
            font-size: 0.875rem;
            color: var(--primary);
            transition: var(--transition-fast);
        }
        
        .faq-item p {
            padding-left: calc(1.5rem + var(--space-2));
            margin-top: var(--space-2);
            animation: fadeIn 0.3s ease;
        }
    `;
    document.head.appendChild(style);
};

// ===== MAP INTERACTIONS =====
const initMapInteractions = () => {
    const mapContainer = document.querySelector('.map-container');
    if (!mapContainer) return;
    
    // Add zoom controls
    const controls = document.createElement('div');
    controls.className = 'map-controls';
    controls.innerHTML = `
        <button class="map-control zoom-in" title="Zoom in">
            <i class="fas fa-plus"></i>
        </button>
        <button class="map-control zoom-out" title="Zoom out">
            <i class="fas fa-minus"></i>
        </button>
        <button class="map-control fullscreen" title="Full screen">
            <i class="fas fa-expand"></i>
        </button>
    `;
    
    mapContainer.appendChild(controls);
    
    // Add map styles
    const style = document.createElement('style');
    style.textContent = `
        .map-container {
            position: relative;
        }
        
        .map-controls {
            position: absolute;
            top: var(--space-4);
            right: var(--space-4);
            display: flex;
            gap: var(--space-2);
            z-index: 10;
        }
        
        .map-control {
            width: 40px;
            height: 40px;
            background: var(--white);
            border: 1px solid var(--border);
            border-radius: var(--radius-sm);
            color: var(--text);
            cursor: pointer;
            transition: var(--transition-fast);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: var(--shadow-md);
        }
        
        .map-control:hover {
            background: var(--primary);
            color: var(--white);
            transform: scale(1.1);
        }
        
        .map-control i {
            font-size: 1rem;
        }
    `;
    document.head.appendChild(style);
    
    // Add control handlers
    const iframe = mapContainer.querySelector('iframe');
    if (iframe) {
        // Note: Actual zoom/fullscreen would require Google Maps API
        // These are UI placeholders
        mapContainer.querySelector('.zoom-in')?.addEventListener('click', () => {
            UI.showNotification('Zoom in - Maps API integration required', 'info');
        });
        
        mapContainer.querySelector('.zoom-out')?.addEventListener('click', () => {
            UI.showNotification('Zoom out - Maps API integration required', 'info');
        });
        
        mapContainer.querySelector('.fullscreen')?.addEventListener('click', () => {
            if (iframe.requestFullscreen) {
                iframe.requestFullscreen();
            } else {
                UI.showNotification('Fullscreen not supported', 'error');
            }
        });
    }
};

// ===== USER DATA PREFILL =====
const prefillUserData = () => {
    if (AppState.isAuthenticated && AppState.user) {
        if (ContactElements.name) {
            ContactElements.name.value = AppState.user.name || '';
        }
        
        if (ContactElements.email) {
            ContactElements.email.value = AppState.user.email || '';
        }
        
        // Trigger validation
        if (ContactElements.name) validateField('name');
        if (ContactElements.email) validateField('email');
    }
};

// ===== LOADING STATE =====
const setLoadingState = (isLoading) => {
    ContactState.isSubmitting = isLoading;
    
    if (!ContactElements.submitBtn) return;
    
    if (isLoading) {
        ContactElements.submitBtn.disabled = true;
        ContactElements.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    } else {
        ContactElements.submitBtn.disabled = false;
        ContactElements.submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    }
    
    // Disable all form inputs
    const inputs = ContactElements.form?.querySelectorAll('input, select, textarea');
    inputs?.forEach(input => {
        input.disabled = isLoading;
    });
};

// ===== SUCCESS MESSAGE =====
const showSuccessMessage = () => {
    // Create success message
    const message = document.createElement('div');
    message.className = 'contact-success';
    message.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <h3>Thank You!</h3>
        <p>Your message has been sent successfully. We'll get back to you within 24 hours.</p>
        <button onclick="this.parentElement.remove()" class="btn btn-outline btn-small">
            <i class="fas fa-times"></i> Close
        </button>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .contact-success {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--white);
            padding: var(--space-8);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-2xl);
            text-align: center;
            z-index: var(--z-modal);
            max-width: 400px;
            width: 90%;
            animation: slideInUp 0.5s ease;
        }
        
        .contact-success i {
            font-size: 4rem;
            color: #22c55e;
            margin-bottom: var(--space-4);
        }
        
        .contact-success h3 {
            margin-bottom: var(--space-2);
        }
        
        .contact-success p {
            margin-bottom: var(--space-6);
            color: var(--text-light);
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(message);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (message.parentNode) {
            message.remove();
        }
    }, 5000);
};

// ===== RESET FORM =====
const resetForm = () => {
    if (ContactElements.form) {
        ContactElements.form.reset();
        clearValidation();
        
        // Reset character counter
        const counter = document.querySelector('.char-counter span');
        if (counter) counter.textContent = '0';
    }
};

// ===== ERROR HANDLING =====
const handleSubmitError = (error) => {
    console.error('Contact form error:', error);
    
    let message = 'Failed to send message. Please try again.';
    
    if (error instanceof APIError) {
        if (error.status === 429) {
            message = 'Too many messages. Please try again later.';
        } else if (error.status >= 500) {
            message = 'Server error. Please try again later or email us directly.';
        }
    }
    
    UI.showNotification(message, 'error');
};

// ===== TRACKING =====
const trackContactConversion = (formData) => {
    // Track for analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'contact_form_submit', {
            'event_category': 'engagement',
            'event_label': formData.subject,
        });
    }
    
    console.log('Contact conversion tracked:', formData.subject);
};

// ===== SOCIAL MEDIA TRACKING =====
const initSocialTracking = () => {
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const platform = btn.classList[1]; // facebook, twitter, etc.
            
            // Track social click
            if (typeof gtag !== 'undefined') {
                gtag('event', 'social_click', {
                    'event_category': 'social',
                    'event_label': platform,
                });
            }
            
            console.log('Social click tracked:', platform);
        });
    });
};

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    initContact();
    initSocialTracking();
});

// ===== EXPORT =====
window.initContact = initContact;