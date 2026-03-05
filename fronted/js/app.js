// ===== EDOT Platform - Main Application =====
// Continued from previous...

// ===== LOAD CATEGORIES (Continued) =====
const loadCategories = async () => {
    const categoriesGrid = document.getElementById('categoriesGrid');
    if (!categoriesGrid) return;

    const categories = [
        { name: 'Programming', icon: 'fa-code', count: '120+', color: '#2563EB' },
        { name: 'Mathematics', icon: 'fa-calculator', count: '85+', color: '#22C55E' },
        { name: 'Science', icon: 'fa-flask', count: '95+', color: '#EF4444' },
        { name: 'Exam Prep', icon: 'fa-pencil-alt', count: '150+', color: '#F59E0B' },
        { name: 'Languages', icon: 'fa-language', count: '60+', color: '#8B5CF6' },
        { name: 'Business', icon: 'fa-chart-line', count: '75+', color: '#EC4899' }
    ];

    categoriesGrid.innerHTML = categories.map(category => `
        <a href="courses.html?category=${category.name.toLowerCase()}" class="category-card">
            <i class="fas ${category.icon}" style="color: ${category.color}"></i>
            <h3>${category.name}</h3>
            <span>${category.count} courses</span>
        </a>
    `).join('');
};

// ===== LOAD FEATURED COURSES =====
const loadFeaturedCourses = async () => {
    const featuredGrid = document.getElementById('featuredCourses');
    if (!featuredGrid) return;

    showLoading(featuredGrid);

    try {
        const data = await apiCall('/courses?limit=6&sort=-createdAt');
        
        if (data.courses && data.courses.length > 0) {
            featuredGrid.innerHTML = data.courses.map(course => `
                <div class="course-card">
                    <div class="course-image">
                        <img src="${course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'}" 
                             alt="${course.title}">
                        <span class="course-level">${course.level || 'Beginner'}</span>
                    </div>
                    <div class="course-content">
                        <span class="course-category">${course.category}</span>
                        <h3 class="course-title">
                            <a href="course.html?id=${course._id}">${course.title}</a>
                        </h3>
                        <p class="course-instructor">
                            <i class="fas fa-user"></i> ${course.instructor?.name || 'Expert Instructor'}
                        </p>
                        <div class="course-meta">
                            <div class="course-rating">
                                <i class="fas fa-star"></i>
                                <span>${course.rating || 4.5} (${course.totalStudents || 0} students)</span>
                            </div>
                            <div class="course-duration">
                                <i class="fas fa-clock"></i>
                                <span>${course.duration || 10} hours</span>
                            </div>
                        </div>
                        <div class="course-footer">
                            <span class="course-price ${course.price === 0 ? 'free' : ''}">
                                ${course.price === 0 ? 'Free' : `$${course.price}`}
                            </span>
                            <a href="course.html?id=${course._id}" class="btn btn-primary btn-small">
                                View Course
                            </a>
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            // Show sample courses if API returns empty
            featuredGrid.innerHTML = getSampleCourses();
        }
    } catch (error) {
        console.error('Failed to load courses:', error);
        // Show sample courses on error
        featuredGrid.innerHTML = getSampleCourses();
    }
};

// ===== SAMPLE COURSES FOR DEMO =====
const getSampleCourses = () => {
    const sampleCourses = [
        {
            title: 'Complete Web Development Bootcamp',
            category: 'Programming',
            instructor: 'John Smith',
            rating: 4.8,
            students: 15234,
            duration: 42,
            level: 'Beginner',
            price: 89.99,
            image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&auto=format&fit=crop&w=1631&q=80'
        },
        {
            title: 'Advanced JavaScript: From Fundamentals',
            category: 'Programming',
            instructor: 'Sarah Johnson',
            rating: 4.9,
            students: 8732,
            duration: 28,
            level: 'Intermediate',
            price: 79.99,
            image: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
        },
        {
            title: 'Data Science & Machine Learning',
            category: 'Science',
            instructor: 'Michael Chen',
            rating: 4.7,
            students: 6543,
            duration: 56,
            level: 'Advanced',
            price: 99.99,
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
        }
    ];

    return sampleCourses.map(course => `
        <div class="course-card">
            <div class="course-image">
                <img src="${course.image}" alt="${course.title}">
                <span class="course-level">${course.level}</span>
            </div>
            <div class="course-content">
                <span class="course-category">${course.category}</span>
                <h3 class="course-title">
                    <a href="course.html">${course.title}</a>
                </h3>
                <p class="course-instructor">
                    <i class="fas fa-user"></i> ${course.instructor}
                </p>
                <div class="course-meta">
                    <div class="course-rating">
                        <i class="fas fa-star"></i>
                        <span>${course.rating} (${course.students.toLocaleString()} students)</span>
                    </div>
                    <div class="course-duration">
                        <i class="fas fa-clock"></i>
                        <span>${course.duration} hours</span>
                    </div>
                </div>
                <div class="course-footer">
                    <span class="course-price">$${course.price}</span>
                    <a href="course.html" class="btn btn-primary btn-small">
                        View Course
                    </a>
                </div>
            </div>
        </div>
    `).join('');
};

// ===== LOAD TESTIMONIALS =====
const loadTestimonials = async () => {
    const testimonialsGrid = document.getElementById('testimonialsGrid');
    if (!testimonialsGrid) return;

    const testimonials = [
        {
            name: 'Emily Rodriguez',
            role: 'Software Developer',
            avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
            text: 'EDOT completely transformed my career. The courses are well-structured and the instructors are amazing!',
            rating: 5
        },
        {
            name: 'David Kim',
            role: 'Data Scientist',
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            text: 'The quality of content is outstanding. I\'ve learned more here than in my entire college education.',
            rating: 5
        },
        {
            name: 'Sarah Williams',
            role: 'UX Designer',
            avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
            text: 'Flexible learning schedule and great community support. Highly recommended!',
            rating: 5
        }
    ];

    testimonialsGrid.innerHTML = testimonials.map(testimonial => `
        <div class="testimonial-card">
            <div class="testimonial-content">
                <i class="fas fa-quote-left"></i>
                <p>${testimonial.text}</p>
            </div>
            <div class="testimonial-author">
                <img src="${testimonial.avatar}" alt="${testimonial.name}">
                <div class="author-info">
                    <h4>${testimonial.name}</h4>
                    <p>${testimonial.role}</p>
                    <div class="course-rating">
                        ${Array(testimonial.rating).fill('<i class="fas fa-star"></i>').join('')}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
};

// ===== MOBILE MENU TOGGLE =====
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon.classList.contains('fa-bars')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication
    await checkAuth();
    
    // Load page-specific content
    loadCategories();
    loadFeaturedCourses();
    loadTestimonials();
    
    // Handle active navigation
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});