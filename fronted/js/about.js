/**
 * EDOT Platform - About Page Module
 * @version 1.0.0
 */

// ===== STATS COUNTER ANIMATION =====
const initStatsCounter = () => {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (!statNumbers.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = parseInt(target.getAttribute('data-target') || target.textContent.replace(/[^0-9]/g, ''), 10);
                animateCounter(target, finalValue);
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        // Store final value in data-target
        const raw = stat.textContent;
        const num = parseInt(raw.replace(/[^0-9]/g, ''), 10);
        stat.setAttribute('data-target', num);
        stat.textContent = '0' + (raw.includes('+') ? '+' : '');
        observer.observe(stat);
    });
};

const animateCounter = (element, final) => {
    let current = 0;
    const increment = final / 50; // 50 steps
    const timer = setInterval(() => {
        current += increment;
        if (current >= final) {
            element.textContent = final + (element.textContent.includes('+') ? '+' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '');
        }
    }, 20);
};

// ===== TEAM CARD HOVER EFFECT =====
const initTeamCards = () => {
    const cards = document.querySelectorAll('.team-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
};

// ===== TIMELINE ANIMATION (optional) =====
const initTimeline = () => {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.3 });

    timelineItems.forEach(item => observer.observe(item));
};

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    initStatsCounter();
    initTeamCards();
    initTimeline();
});