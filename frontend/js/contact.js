// ===== EDOT Platform - Contact Module =====

// DOM Elements
const contactForm = document.getElementById('contactForm');

// ===== HANDLE CONTACT FORM SUBMISSION =====
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value.trim(),
            newsletter: document.getElementById('newsletter').checked
        };
        
        // Validate form
        if (!validateContactForm(formData)) {
            return;
        }
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            // Here you would typically send the data to your backend
            // For now, we'll simulate an API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message
            showNotification('Message sent successfully! We\'ll get back to you within 24 hours.', 'success');
            
            // Reset form
            contactForm.reset();
            
            // Log for demo purposes (remove in production)
            console.log('Contact form submitted:', formData);
            
        } catch (error) {
            showNotification('Failed to send message. Please try again or email us directly at support@edot.com', 'error');
            console.error('Contact form error:', error);
        } finally {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ===== VALIDATE CONTACT FORM =====
const validateContactForm = (data) => {
    let isValid = true;
    
    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    
    // Validate name
    if (!data.name || data.name.length < 2) {
        showFieldError('name', 'Please enter your full name (at least 2 characters)');
        isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate subject
    if (!data.subject) {
        showFieldError('subject', 'Please select a subject');
        isValid = false;
    }
    
    // Validate message
    if (!data.message || data.message.length < 10) {
        showFieldError('message', 'Message must be at least 10 characters');
        isValid = false;
    }
    
    // Validate phone if provided (optional)
    if (data.phone && data.phone.length > 0) {
        const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        if (!phoneRegex.test(data.phone)) {
            showFieldError('phone', 'Please enter a valid phone number');
            isValid = false;
        }
    }
    
    return isValid;
};

// ===== SHOW FIELD ERROR =====
const showFieldError = (fieldId, message) => {
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.add('error');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        field.parentNode.appendChild(errorDiv);
        
        // Remove error on input
        field.addEventListener('input', function removeError() {
            this.classList.remove('error');
            const error = this.parentNode.querySelector('.error-message');
            if (error) error.remove();
            this.removeEventListener('input', removeError);
        });
    }
};

// ===== SHOW NOTIFICATION =====
const showNotification = (message, type = 'success') => {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification-toast');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification-toast alert alert-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    notification.style.position = 'fixed';
    notification.style.top = '100px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.style.minWidth = '350px';
    notification.style.maxWidth = '450px';
    notification.style.animation = 'slideInRight 0.3s ease';
    notification.style.boxShadow = 'var(--shadow-lg)';
    
    // Add close button styles
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.background = 'none';
    closeBtn.style.border = 'none';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.marginLeft = 'auto';
    closeBtn.style.padding = '0 5px';
    closeBtn.style.fontSize = '18px';
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
};

// ===== INITIALIZE MAP INTERACTION =====
const initMapInteraction = () => {
    const mapContainer = document.querySelector('.map-container');
    if (mapContainer) {
        mapContainer.addEventListener('click', () => {
            // Optional: Add analytics tracking
            console.log('Map clicked - user wants to see location');
        });
    }
};

// ===== PRE-FILL FORM IF USER IS LOGGED IN =====
const prefillUserData = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        
        if (nameInput && user.name) {
            nameInput.value = user.name;
        }
        
        if (emailInput && user.email) {
            emailInput.value = user.email;
        }
    }
};

// ===== ADD INPUT FOCUS ANIMATIONS =====
const addInputAnimations = () => {
    const inputs = document.querySelectorAll('.contact-form input, .contact-form select, .contact-form textarea');
    
    inputs.forEach(input => {
        // Add focus effect
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });
        
        // Add character counter for message
        if (input.id === 'message') {
            const counter = document.createElement('small');
            counter.className = 'char-counter';
            counter.style.display = 'block';
            counter.style.textAlign = 'right';
            counter.style.marginTop = '5px';
            counter.style.color = 'var(--text-light)';
            counter.style.fontSize = '12px';
            input.parentNode.appendChild(counter);
            
            input.addEventListener('input', () => {
                const remaining = 1000 - input.value.length;
                counter.textContent = `${input.value.length}/1000 characters`;
                if (remaining < 100) {
                    counter.style.color = '#ef4444';
                } else {
                    counter.style.color = 'var(--text-light)';
                }
            });
        }
    });
};

// ===== ADDITIONAL CSS FOR NOTIFICATIONS =====
const addNotificationStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .notification-toast {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px 20px;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            cursor: default;
        }
        
        .notification-toast i:first-child {
            font-size: 20px;
        }
        
        .notification-toast .notification-close {
            opacity: 0.7;
            transition: var(--transition);
        }
        
        .notification-toast .notification-close:hover {
            opacity: 1;
            transform: scale(1.1);
        }
        
        .form-group.focused label {
            color: var(--primary);
        }
        
        .char-counter {
            transition: var(--transition);
        }
    `;
    document.head.appendChild(style);
};

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    initMapInteraction();
    prefillUserData();
    addInputAnimations();
    addNotificationStyles();
    
    // Add smooth scroll to contact sections
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Track page view (for analytics)
    console.log('Contact page loaded');
});

// ===== EXPORT FUNCTIONS FOR GLOBAL USE =====
window.showNotification = showNotification;