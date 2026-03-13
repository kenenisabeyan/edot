// ===== EDOT Platform - Course Detail Module =====

// Get course ID from URL
const urlParams = new URLSearchParams(window.location.search);
const courseId = urlParams.get('id');

// State
let courseData = null;
let isEnrolled = false;
let isInWishlist = false;

// ===== LOAD COURSE DETAILS =====
const loadCourseDetails = async () => {
    if (!courseId) {
        window.location.href = 'courses.html';
        return;
    }

    try {
        const data = await apiCall(`/courses/${courseId}`);
        courseData = data.course;
        
        // Check if user is enrolled
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            // Check enrollment status
            checkEnrollmentStatus();
        }
        
        // Check wishlist
        checkWishlistStatus();
        
        // Update UI
        updateCourseHeader();
        updateCourseDescription();
        updateWhatYouLearn();
        updateCurriculum();
        updateRequirements();
        updateInstructor();
        updateReviews();
        updateSidebar();
        
    } catch (error) {
        console.error('Failed to load course:', error);
        showError('Failed to load course details. Please try again.');
    }
};

// ===== CHECK ENROLLMENT STATUS =====
const checkEnrollmentStatus = async () => {
    try {
        const data = await apiCall('/users/mycourses');
        isEnrolled = data.enrolledCourses.some(e => e.course._id === courseId);
        
        const enrollBtn = document.getElementById('enrollBtn');
        if (enrollBtn) {
            if (isEnrolled) {
                enrollBtn.innerHTML = '<i class="fas fa-check"></i> Enrolled';
                enrollBtn.classList.add('enrolled');
                enrollBtn.disabled = true;
            }
        }
    } catch (error) {
        console.error('Failed to check enrollment:', error);
    }
};

// ===== CHECK WISHLIST STATUS =====
const checkWishlistStatus = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    isInWishlist = wishlist.includes(courseId);
    
    const wishlistBtn = document.getElementById('wishlistBtn');
    if (wishlistBtn) {
        if (isInWishlist) {
            wishlistBtn.innerHTML = '<i class="fas fa-heart"></i> Remove from Wishlist';
        } else {
            wishlistBtn.innerHTML = '<i class="far fa-heart"></i> Add to Wishlist';
        }
    }
};

// ===== UPDATE COURSE HEADER =====
const updateCourseHeader = () => {
    const headerContent = document.getElementById('courseHeaderContent');
    const headerImage = document.getElementById('courseHeaderImage');
    
    if (headerContent) {
        headerContent.innerHTML = `
            <h1>${courseData.title}</h1>
            <p>${courseData.description.substring(0, 200)}...</p>
            <div class="course-header-meta">
                <span><i class="fas fa-star"></i> ${courseData.rating || 4.5}</span>
                <span><i class="fas fa-users"></i> ${courseData.totalStudents || 0} students</span>
                <span><i class="fas fa-clock"></i> ${courseData.duration || 0} hours</span>
                <span><i class="fas fa-signal"></i> ${courseData.level || 'Beginner'}</span>
            </div>
            <div class="course-instructor-info">
                <img src="${courseData.instructor?.avatar || 'https://via.placeholder.com/60'}" 
                     alt="${courseData.instructor?.name}">
                <div>
                    <h4>${courseData.instructor?.name || 'Expert Instructor'}</h4>
                    <p>${courseData.instructor?.bio || 'Experienced professional'}</p>
                </div>
            </div>
        `;
    }
    
    if (headerImage) {
        headerImage.innerHTML = `
            <img src="${courseData.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'}" 
                 alt="${courseData.title}">
        `;
    }
};

// ===== UPDATE COURSE DESCRIPTION =====
const updateCourseDescription = () => {
    const descriptionDiv = document.getElementById('courseDescription');
    if (descriptionDiv) {
        descriptionDiv.innerHTML = `
            <h2>About This Course</h2>
            <p>${courseData.description}</p>
        `;
    }
};

// ===== UPDATE WHAT YOU'LL LEARN =====
const updateWhatYouLearn = () => {
    const learnGrid = document.getElementById('learnGrid');
    if (!learnGrid) return;
    
    const learnItems = courseData.whatYouWillLearn || [
        'Master fundamental concepts',
        'Build real-world projects',
        'Get hands-on experience',
        'Learn from industry experts'
    ];
    
    learnGrid.innerHTML = learnItems.map(item => `
        <div class="learn-item">
            <i class="fas fa-check-circle"></i>
            <span>${item}</span>
        </div>
    `).join('');
};

// ===== UPDATE CURRICULUM =====
const updateCurriculum = () => {
    const curriculumList = document.getElementById('curriculumList');
    if (!curriculumList) return;
    
    const lessons = courseData.lessons || [];
    
    curriculumList.innerHTML = lessons.map((lesson, index) => `
        <div class="curriculum-item">
            <div class="curriculum-item-header">
                <div>
                    <i class="fas fa-play-circle"></i>
                    <span>Lesson ${index + 1}: ${lesson.title}</span>
                </div>
                <span class="lesson-duration">${lesson.duration || 10} min</span>
            </div>
            <div class="curriculum-item-preview" style="display: none;">
                <p>${lesson.description || ''}</p>
                ${lesson.isPreview ? '<button class="btn btn-small">Preview</button>' : ''}
            </div>
        </div>
    `).join('');
    
    // Add click handlers
    document.querySelectorAll('.curriculum-item-header').forEach((header, index) => {
        header.addEventListener('click', () => {
            const preview = header.nextElementSibling;
            const isVisible = preview.style.display === 'block';
            
            // Hide all others
            document.querySelectorAll('.curriculum-item-preview').forEach(p => {
                p.style.display = 'none';
            });
            
            // Toggle current
            preview.style.display = isVisible ? 'none' : 'block';
            
            // Rotate icon
            const icon = header.querySelector('i');
            if (icon) {
                icon.style.transform = isVisible ? 'rotate(0deg)' : 'rotate(90deg)';
            }
        });
    });
};

// ===== UPDATE REQUIREMENTS =====
const updateRequirements = () => {
    const requirementsList = document.getElementById('requirementsList');
    if (!requirementsList) return;
    
    const requirements = courseData.requirements || [
        'No prior experience needed',
        'A computer with internet connection',
        'Willingness to learn'
    ];
    
    requirementsList.innerHTML = requirements.map(req => `
        <li><i class="fas fa-check"></i> ${req}</li>
    `).join('');
};

// ===== UPDATE INSTRUCTOR =====
const updateInstructor = () => {
    const instructorCard = document.getElementById('instructorCard');
    if (!instructorCard) return;
    
    const instructor = courseData.instructor || {};
    
    instructorCard.innerHTML = `
        <div class="instructor-header">
            <img src="${instructor.avatar || 'https://via.placeholder.com/100'}" 
                 alt="${instructor.name || 'Instructor'}">
            <div>
                <h3>${instructor.name || 'Expert Instructor'}</h3>
                <p class="instructor-title">Course Instructor</p>
                <div class="instructor-stats">
                    <span><i class="fas fa-star"></i> 4.8 Instructor Rating</span>
                    <span><i class="fas fa-users"></i> 10,000+ Students</span>
                    <span><i class="fas fa-play-circle"></i> 15 Courses</span>
                </div>
            </div>
        </div>
        <div class="instructor-bio">
            <p>${instructor.bio || 'Experienced professional passionate about teaching and helping students succeed in their learning journey.'}</p>
        </div>
    `;
};

// ===== UPDATE REVIEWS =====
const updateReviews = () => {
    const reviewsSummary = document.getElementById('reviewsSummary');
    const reviewsList = document.getElementById('reviewsList');
    
    if (reviewsSummary) {
        reviewsSummary.innerHTML = `
            <div class="average-rating">
                <span class="rating-number">${courseData.rating || 4.5}</span>
                <div class="rating-stars">
                    ${Array(5).fill(0).map((_, i) => `
                        <i class="fas fa-star ${i < Math.floor(courseData.rating || 4.5) ? 'active' : ''}"></i>
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
                <img src="${review.avatar}" alt="${review.name}">
                <div class="review-content">
                    <div class="review-header">
                        <h4>${review.name}</h4>
                        <span class="review-date">${review.date}</span>
                    </div>
                    <div class="review-rating">
                        ${Array(5).fill(0).map((_, i) => `
                            <i class="fas fa-star ${i < review.rating ? 'active' : ''}"></i>
                        `).join('')}
                    </div>
                    <p>${review.comment}</p>
                </div>
            </div>
        `).join('');
    }
};

// ===== UPDATE SIDEBAR =====
const updateSidebar = () => {
    const priceElement = document.getElementById('coursePrice');
    const levelElement = document.getElementById('courseLevel');
    const durationElement = document.getElementById('courseDuration');
    const studentsElement = document.getElementById('totalStudents');
    const lessonsElement = document.getElementById('totalLessons');
    
    if (priceElement) {
        priceElement.innerHTML = courseData.price === 0 ? 
            '<span class="free">Free</span>' : 
            `<span>$${courseData.price}</span>`;
    }
    
    if (levelElement) levelElement.textContent = courseData.level || 'Beginner';
    if (durationElement) durationElement.textContent = `${courseData.duration || 0} hours`;
    if (studentsElement) studentsElement.textContent = `${courseData.totalStudents || 0} students`;
    if (lessonsElement) lessonsElement.textContent = courseData.lessons?.length || 0;
};

// ===== ENROLL IN COURSE =====
window.enrollInCourse = async () => {
    if (!isAuthenticated) {
        window.location.href = 'login.html';
        return;
    }
    
    if (isEnrolled) {
        window.location.href = `lesson.html?course=${courseId}`;
        return;
    }
    
    try {
        const data = await apiCall(`/courses/${courseId}/enroll`, {
            method: 'POST'
        });
        
        if (data.success) {
            showNotification('Successfully enrolled in course!', 'success');
            isEnrolled = true;
            
            const enrollBtn = document.getElementById('enrollBtn');
            enrollBtn.innerHTML = '<i class="fas fa-check"></i> Enrolled';
            enrollBtn.classList.add('enrolled');
            
            // Redirect to lesson page after 2 seconds
            setTimeout(() => {
                window.location.href = `lesson.html?course=${courseId}`;
            }, 2000);
        }
    } catch (error) {
        showNotification(error.message || 'Failed to enroll', 'error');
    }
};

// ===== TOGGLE WISHLIST =====
window.toggleWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    if (isInWishlist) {
        const index = wishlist.indexOf(courseId);
        if (index > -1) {
            wishlist.splice(index, 1);
        }
        showNotification('Removed from wishlist', 'info');
    } else {
        wishlist.push(courseId);
        showNotification('Added to wishlist', 'success');
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    isInWishlist = !isInWishlist;
    checkWishlistStatus();
};

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    loadCourseDetails();
});