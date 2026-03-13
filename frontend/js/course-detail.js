/**
 * EDOT Platform - Course Detail Module
 * @version 1.0.0
 */

// ===== STATE =====
const CourseDetailState = {
    courseId: null,
    courseData: null,
    isEnrolled: false,
    isInWishlist: false,
    isLoading: true,
};

// ===== DOM ELEMENTS =====
const CourseDetailElements = {
    headerContent: document.getElementById('courseHeaderContent'),
    headerImage: document.getElementById('courseHeaderImage'),
    description: document.getElementById('courseDescription'),
    learnGrid: document.getElementById('learnGrid'),
    curriculumList: document.getElementById('curriculumList'),
    requirementsList: document.getElementById('requirementsList'),
    instructorCard: document.getElementById('instructorCard'),
    reviewsSummary: document.getElementById('reviewsSummary'),
    reviewsList: document.getElementById('reviewsList'),
    price: document.getElementById('coursePrice'),
    level: document.getElementById('courseLevel'),
    duration: document.getElementById('courseDuration'),
    students: document.getElementById('totalStudents'),
    lessons: document.getElementById('totalLessons'),
    enrollBtn: document.getElementById('enrollBtn'),
    wishlistBtn: document.getElementById('wishlistBtn'),
};

// ===== INITIALIZATION =====
const initCourseDetail = async () => {
    // Get course ID from URL
    const params = new URLSearchParams(window.location.search);
    CourseDetailState.courseId = params.get('id');
    
    if (!CourseDetailState.courseId) {
        window.location.href = 'courses.html';
        return;
    }
    
    await loadCourseData();
    checkWishlistStatus();
    initEventListeners();
};

// ===== LOAD COURSE DATA =====
const loadCourseData = async () => {
    CourseDetailState.isLoading = true;
    
    try {
        const data = await API.get(`/courses/${CourseDetailState.courseId}`, true);
        CourseDetailState.courseData = data.course;
        
        // Check enrollment if user is logged in
        if (AppState.isAuthenticated) {
            await checkEnrollmentStatus();
        }
        
        renderAllSections();
        
    } catch (error) {
        handleCourseDetailError(error);
    } finally {
        CourseDetailState.isLoading = false;
    }
};

// ===== RENDER ALL SECTIONS =====
const renderAllSections = () => {
    const course = CourseDetailState.courseData;
    if (!course) return;
    
    renderHeader();
    renderDescription();
    renderWhatYouLearn();
    renderCurriculum();
    renderRequirements();
    renderInstructor();
    renderReviews();
    renderSidebar();
};

const renderHeader = () => {
    const course = CourseDetailState.courseData;
    if (!course) return;
    
    const headerContent = CourseDetailElements.headerContent;
    const headerImage = CourseDetailElements.headerImage;
    
    if (headerContent) {
        headerContent.innerHTML = `
            <h1>${escapeHtml(course.title)}</h1>
            <p>${escapeHtml(course.description.substring(0, 200))}...</p>
            <div class="course-header-meta">
                <span><i class="fas fa-star"></i> ${course.rating || 4.5}</span>
                <span><i class="fas fa-users"></i> ${Formatters.number(course.totalStudents || 0)} students</span>
                <span><i class="fas fa-clock"></i> ${Formatters.duration((course.duration || 0) * 60)}</span>
                <span><i class="fas fa-signal"></i> ${escapeHtml(course.level || 'Beginner')}</span>
            </div>
            <div class="course-instructor-info">
                <img src="${course.instructor?.avatar || 'https://via.placeholder.com/60'}" 
                     alt="${escapeHtml(course.instructor?.name || 'Instructor')}">
                <div>
                    <h4>${escapeHtml(course.instructor?.name || 'Expert Instructor')}</h4>
                    <p>${escapeHtml(course.instructor?.bio || 'Experienced professional')}</p>
                </div>
            </div>
        `;
    }
    
    if (headerImage) {
        headerImage.innerHTML = `
            <img src="${course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'}" 
                 alt="${escapeHtml(course.title)}">
        `;
    }
};

const renderDescription = () => {
    const description = CourseDetailElements.description;
    if (!description) return;
    
    description.innerHTML = `
        <h2>About This Course</h2>
        <p>${escapeHtml(CourseDetailState.courseData.description)}</p>
    `;
};

const renderWhatYouLearn = () => {
    const learnGrid = CourseDetailElements.learnGrid;
    if (!learnGrid) return;
    
    const learnItems = CourseDetailState.courseData.whatYouWillLearn || [
        'Master fundamental concepts',
        'Build real-world projects',
        'Get hands-on experience',
        'Learn from industry experts',
        'Get certified upon completion',
        'Access to community support'
    ];
    
    learnGrid.innerHTML = learnItems.map(item => `
        <div class="learn-item">
            <i class="fas fa-check-circle"></i>
            <span>${escapeHtml(item)}</span>
        </div>
    `).join('');
};

const renderCurriculum = () => {
    const curriculumList = CourseDetailElements.curriculumList;
    if (!curriculumList) return;
    
    const lessons = CourseDetailState.courseData.lessons || [];
    
    if (lessons.length === 0) {
        curriculumList.innerHTML = `
            <div class="empty-state">
                <p>Curriculum is being prepared. Check back soon!</p>
            </div>
        `;
        return;
    }
    
    curriculumList.innerHTML = lessons.map((lesson, index) => `
        <div class="curriculum-item">
            <div class="curriculum-item-header">
                <div>
                    <i class="fas fa-play-circle"></i>
                    <span>Lesson ${index + 1}: ${escapeHtml(lesson.title)}</span>
                </div>
                <span class="lesson-duration">${Formatters.duration(lesson.duration || 10)}</span>
            </div>
            ${lesson.isPreview ? `
                <div class="curriculum-item-preview">
                    <p>${escapeHtml(lesson.description || '')}</p>
                    <button class="btn btn-small btn-primary" onclick="previewLesson('${lesson._id}')">
                        <i class="fas fa-play"></i> Preview
                    </button>
                </div>
            ` : ''}
        </div>
    `).join('');
    
    // Add click handlers for curriculum items
    document.querySelectorAll('.curriculum-item-header').forEach((header, index) => {
        header.addEventListener('click', () => {
            const preview = header.nextElementSibling;
            if (preview?.classList.contains('curriculum-item-preview')) {
                preview.classList.toggle('active');
                const icon = header.querySelector('i');
                if (icon) {
                    icon.style.transform = preview.classList.contains('active') ? 'rotate(90deg)' : 'rotate(0)';
                }
            }
        });
    });
};

const renderRequirements = () => {
    const requirementsList = CourseDetailElements.requirementsList;
    if (!requirementsList) return;
    
    const requirements = CourseDetailState.courseData.requirements || [
        'No prior experience needed',
        'A computer with internet connection',
        'Willingness to learn',
        'Basic computer skills'
    ];
    
    requirementsList.innerHTML = requirements.map(req => `
        <li><i class="fas fa-check"></i> ${escapeHtml(req)}</li>
    `).join('');
};

const renderInstructor = () => {
    const instructorCard = CourseDetailElements.instructorCard;
    if (!instructorCard) return;
    
    const instructor = CourseDetailState.courseData.instructor || {};
    
    instructorCard.innerHTML = `
        <div class="instructor-header">
            <img src="${instructor.avatar || 'https://via.placeholder.com/100'}" 
                 alt="${escapeHtml(instructor.name || 'Instructor')}">
            <div>
                <h3>${escapeHtml(instructor.name || 'Expert Instructor')}</h3>
                <p class="instructor-title">Course Instructor</p>
                <div class="instructor-stats">
                    <span><i class="fas fa-star"></i> 4.8 Instructor Rating</span>
                    <span><i class="fas fa-users"></i> 10,000+ Students</span>
                    <span><i class="fas fa-play-circle"></i> 15 Courses</span>
                </div>
            </div>
        </div>
        <div class="instructor-bio">
            <p>${escapeHtml(instructor.bio || 'Experienced professional passionate about teaching and helping students succeed in their learning journey.')}</p>
        </div>
    `;
};

const renderReviews = () => {
    const reviewsSummary = CourseDetailElements.reviewsSummary;
    const reviewsList = CourseDetailElements.reviewsList;
    
    const rating = CourseDetailState.courseData.rating || 4.5;
    
    if (reviewsSummary) {
        reviewsSummary.innerHTML = `
            <div class="average-rating">
                <span class="rating-number">${rating}</span>
                <div class="rating-stars">
                    ${Array(5).fill(0).map((_, i) => `
                        <i class="fas fa-star ${i < Math.floor(rating) ? 'active' : ''}"></i>
                    `).join('')}
                </div>
                <p>Course Rating</p>
            </div>
        `;
    }
    
    if (reviewsList) {
        const sampleReviews = [
            {
                name: 'John Doe',
                avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
                rating: 5,
                comment: 'Excellent course! Very well structured and easy to follow.',
                date: '2 months ago'
            },
            {
                name: 'Jane Smith',
                avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
                rating: 4,
                comment: 'Great content, but could use more practical examples.',
                date: '1 month ago'
            }
        ];
        
        reviewsList.innerHTML = sampleReviews.map(review => `
            <div class="review-item">
                <img src="${review.avatar}" alt="${escapeHtml(review.name)}">
                <div class="review-content">
                    <div class="review-header">
                        <h4>${escapeHtml(review.name)}</h4>
                        <span class="review-date">${review.date}</span>
                    </div>
                    <div class="review-rating">
                        ${Array(5).fill(0).map((_, i) => `
                            <i class="fas fa-star ${i < review.rating ? 'active' : ''}"></i>
                        `).join('')}
                    </div>
                    <p>${escapeHtml(review.comment)}</p>
                </div>
            </div>
        `).join('');
    }
};

const renderSidebar = () => {
    const course = CourseDetailState.courseData;
    
    if (CourseDetailElements.price) {
        CourseDetailElements.price.innerHTML = course.price === 0 ? 
            '<span class="free">Free</span>' : 
            `<span>$${course.price}</span>`;
    }
    
    if (CourseDetailElements.level) {
        CourseDetailElements.level.textContent = course.level || 'Beginner';
    }
    
    if (CourseDetailElements.duration) {
        CourseDetailElements.duration.textContent = Formatters.duration((course.duration || 0) * 60);
    }
    
    if (CourseDetailElements.students) {
        CourseDetailElements.students.textContent = `${Formatters.number(course.totalStudents || 0)} students`;
    }
    
    if (CourseDetailElements.lessons) {
        CourseDetailElements.lessons.textContent = course.lessons?.length || 0;
    }
};

// ===== ENROLLMENT =====
const checkEnrollmentStatus = async () => {
    try {
        const data = await API.get('/users/mycourses');
        CourseDetailState.isEnrolled = data.enrolledCourses.some(
            e => e.course._id === CourseDetailState.courseId
        );
        
        updateEnrollButton();
    } catch (error) {
        console.error('Failed to check enrollment:', error);
    }
};

const updateEnrollButton = () => {
    const btn = CourseDetailElements.enrollBtn;
    if (!btn) return;
    
    if (CourseDetailState.isEnrolled) {
        btn.innerHTML = '<i class="fas fa-check"></i> Enrolled';
        btn.classList.add('enrolled');
        btn.onclick = () => {
            window.location.href = `lesson.html?course=${CourseDetailState.courseId}`;
        };
    } else {
        btn.innerHTML = '<i class="fas fa-shopping-cart"></i> Enroll Now';
        btn.classList.remove('enrolled');
        btn.onclick = enrollInCourse;
    }
};

// ===== WISHLIST =====
const checkWishlistStatus = () => {
    const wishlist = Storage.get('wishlist', []);
    CourseDetailState.isInWishlist = wishlist.includes(CourseDetailState.courseId);
    updateWishlistButton();
};

const updateWishlistButton = () => {
    const btn = CourseDetailElements.wishlistBtn;
    if (!btn) return;
    
    btn.innerHTML = CourseDetailState.isInWishlist ?
        '<i class="fas fa-heart"></i> Remove from Wishlist' :
        '<i class="far fa-heart"></i> Add to Wishlist';
};

// ===== EVENT HANDLERS =====
const initEventListeners = () => {
    if (CourseDetailElements.enrollBtn) {
        CourseDetailElements.enrollBtn.addEventListener('click', enrollInCourse);
    }
    
    if (CourseDetailElements.wishlistBtn) {
        CourseDetailElements.wishlistBtn.addEventListener('click', toggleWishlist);
    }
};

const enrollInCourse = async () => {
    if (!AppState.isAuthenticated) {
        // Save current page for redirect after login
        sessionStorage.setItem('redirectAfterLogin', window.location.href);
        window.location.href = 'login.html';
        return;
    }
    
    if (CourseDetailState.isEnrolled) {
        window.location.href = `lesson.html?course=${CourseDetailState.courseId}`;
        return;
    }
    
    try {
        CourseDetailElements.enrollBtn.disabled = true;
        CourseDetailElements.enrollBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enrolling...';
        
        await API.post(`/courses/${CourseDetailState.courseId}/enroll`);
        
        CourseDetailState.isEnrolled = true;
        updateEnrollButton();
        UI.showNotification('Successfully enrolled in course!', 'success');
        
        // Update student count
        if (CourseDetailElements.students) {
            const current = CourseDetailState.courseData.totalStudents || 0;
            CourseDetailState.courseData.totalStudents = current + 1;
            CourseDetailElements.students.textContent = `${Formatters.number(current + 1)} students`;
        }
        
    } catch (error) {
        console.error('Enrollment error:', error);
        UI.showNotification(error.message || 'Failed to enroll', 'error');
        CourseDetailElements.enrollBtn.disabled = false;
        updateEnrollButton();
    }
};

const toggleWishlist = () => {
    const wishlist = Storage.get('wishlist', []);
    
    if (CourseDetailState.isInWishlist) {
        const index = wishlist.indexOf(CourseDetailState.courseId);
        if (index > -1) {
            wishlist.splice(index, 1);
        }
        UI.showNotification('Removed from wishlist', 'info');
    } else {
        wishlist.push(CourseDetailState.courseId);
        UI.showNotification('Added to wishlist', 'success');
    }
    
    Storage.set('wishlist', wishlist);
    CourseDetailState.isInWishlist = !CourseDetailState.isInWishlist;
    updateWishlistButton();
};

// ===== PREVIEW LESSON =====
window.previewLesson = (lessonId) => {
    // For preview, you might want to show a modal or redirect to a preview page
    UI.showNotification('Lesson preview is available for enrolled students only.', 'info');
};

// ===== ERROR HANDLING =====
const handleCourseDetailError = (error) => {
    console.error('Course detail error:', error);
    
    const main = document.querySelector('.course-detail');
    if (!main) return;
    
    let message = 'Failed to load course details. Please try again.';
    
    if (error instanceof APIError) {
        if (error.status === 404) {
            message = 'Course not found.';
        } else if (error.status === 429) {
            message = 'Too many requests. Please wait a moment.';
        }
    }
    
    main.innerHTML = `
        <div class="container">
            <div class="empty-state">
                <i class="fas fa-exclamation-circle" style="color: #ef4444;"></i>
                <h3>Something went wrong</h3>
                <p>${message}</p>
                <a href="courses.html" class="btn btn-primary">
                    <i class="fas fa-arrow-left"></i> Back to Courses
                </a>
            </div>
        </div>
    `;
};

// ===== UTILITY FUNCTIONS =====
const escapeHtml = (text) => {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
};

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    initCourseDetail();
});

// ===== EXPORT =====
window.initCourseDetail = initCourseDetail;
window.enrollInCourse = enrollInCourse;
window.toggleWishlist = toggleWishlist;