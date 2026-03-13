// ===== EDOT Platform - Dashboard Module =====

// State
let userData = null;
let enrolledCourses = [];
let notifications = [];

// DOM Elements
const dashboardContent = document.getElementById('dashboardContent');
const dashboardMenu = document.querySelector('.dashboard-menu');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const userAvatar = document.getElementById('userAvatar');
const userRole = document.getElementById('userRole');

// ===== LOAD DASHBOARD DATA =====
const loadDashboardData = async () => {
    try {
        // Get user profile
        const profileData = await apiCall('/users/profile');
        userData = profileData.user;
        
        // Get enrolled courses
        const coursesData = await apiCall('/users/mycourses');
        enrolledCourses = coursesData.enrolledCourses;
        
        // Update UI with user data
        updateUserInfo();
        
        // Load default tab
        const urlParams = new URLSearchParams(window.location.search);
        const tab = urlParams.get('tab') || 'overview';
        loadTab(tab);
        
    } catch (error) {
        console.error('Failed to load dashboard data:', error);
        showError('Failed to load dashboard data. Please refresh the page.');
    }
};

// ===== UPDATE USER INFO =====
const updateUserInfo = () => {
    if (userName) userName.textContent = userData.name;
    if (userEmail) userEmail.textContent = userData.email;
    if (userRole) {
        userRole.textContent = userData.role === 'instructor' ? 'Instructor' : 'Student';
        userRole.className = `badge ${userData.role}`;
    }
    if (userAvatar) {
        userAvatar.src = userData.avatar || 'https://via.placeholder.com/100';
    }
};

// ===== LOAD TAB CONTENT =====
const loadTab = async (tab) => {
    // Update active menu
    document.querySelectorAll('.dashboard-menu a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-tab') === tab) {
            link.classList.add('active');
        }
    });
    
    // Load tab content
    switch(tab) {
        case 'overview':
            loadOverview();
            break;
        case 'my-courses':
            loadMyCourses();
            break;
        case 'progress':
            loadProgress();
            break;
        case 'wishlist':
            loadWishlist();
            break;
        case 'instructor':
            if (userData.role === 'instructor') {
                loadInstructorDashboard();
            }
            break;
        case 'settings':
            loadSettings();
            break;
        default:
            loadOverview();
    }
};

// ===== LOAD OVERVIEW =====
const loadOverview = () => {
    const completedCourses = enrolledCourses.filter(e => e.progress === 100).length;
    const inProgress = enrolledCourses.filter(e => e.progress > 0 && e.progress < 100).length;
    const totalLessons = enrolledCourses.reduce((acc, curr) => 
        acc + (curr.course?.lessons?.length || 0), 0
    );
    const completedLessons = enrolledCourses.reduce((acc, curr) => 
        acc + (curr.completedLessons?.length || 0), 0
    );

    dashboardContent.innerHTML = `
        <div class="dashboard-header">
            <h2>Dashboard Overview</h2>
            <p>Welcome back, ${userData.name}!</p>
        </div>
        
        <div class="dashboard-stats">
            <div class="stat-card">
                <h4>Enrolled Courses</h4>
                <span class="stat-number">${enrolledCourses.length}</span>
            </div>
            <div class="stat-card">
                <h4>In Progress</h4>
                <span class="stat-number">${inProgress}</span>
            </div>
            <div class="stat-card">
                <h4>Completed</h4>
                <span class="stat-number">${completedCourses}</span>
            </div>
            <div class="stat-card">
                <h4>Lessons Completed</h4>
                <span class="stat-number">${completedLessons}/${totalLessons}</span>
            </div>
        </div>
        
        <div class="recent-activity">
            <h3>Recent Activity</h3>
            ${enrolledCourses.slice(0, 3).map(course => `
                <div class="activity-item">
                    <h4>${course.course?.title || 'Course'}</h4>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${course.progress}%"></div>
                    </div>
                    <p>${course.progress}% complete</p>
                </div>
            `).join('')}
        </div>
    `;
};

// ===== LOAD MY COURSES =====
const loadMyCourses = () => {
    if (enrolledCourses.length === 0) {
        dashboardContent.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-book-open" style="font-size: 64px; color: var(--text-light);"></i>
                <h3>No enrolled courses yet</h3>
                <p>Start your learning journey by enrolling in a course!</p>
                <a href="courses.html" class="btn btn-primary">Browse Courses</a>
            </div>
        `;
        return;
    }

    dashboardContent.innerHTML = `
        <div class="dashboard-header">
            <h2>My Courses</h2>
        </div>
        
        <div class="my-courses-grid">
            ${enrolledCourses.map(enrollment => `
                <div class="course-progress-card">
                    <img src="${enrollment.course?.thumbnail || 'https://via.placeholder.com/300x200'}" 
                         alt="${enrollment.course?.title}">
                    <div class="course-progress-info">
                        <h3>${enrollment.course?.title}</h3>
                        <p>${enrollment.course?.instructor?.name || 'Expert Instructor'}</p>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${enrollment.progress}%"></div>
                        </div>
                        <p>${enrollment.progress}% complete (${enrollment.completedLessons.length}/${enrollment.course?.lessons?.length || 0} lessons)</p>
                        <a href="lesson.html?course=${enrollment.course?._id}" class="btn btn-primary btn-small">
                            ${enrollment.progress === 100 ? 'Review Course' : 'Continue Learning'}
                        </a>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
};

// ===== LOAD PROGRESS =====
const loadProgress = () => {
    const totalProgress = enrolledCourses.reduce((acc, curr) => acc + curr.progress, 0) / 
                         (enrolledCourses.length || 1);
    
    dashboardContent.innerHTML = `
        <div class="dashboard-header">
            <h2>Learning Progress</h2>
        </div>
        
        <div class="progress-overview">
            <div class="overall-progress">
                <h3>Overall Progress</h3>
                <div class="circular-progress" style="--progress: ${totalProgress}">
                    <span>${Math.round(totalProgress)}%</span>
                </div>
            </div>
            
            <div class="progress-chart">
                <h3>Course Breakdown</h3>
                ${enrolledCourses.map(enrollment => `
                    <div class="course-progress-item">
                        <span>${enrollment.course?.title || 'Course'}</span>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${enrollment.progress}%"></div>
                        </div>
                        <span>${Math.round(enrollment.progress)}%</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
};

// ===== LOAD WISHLIST =====
const loadWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    if (wishlist.length === 0) {
        dashboardContent.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-heart" style="font-size: 64px; color: var(--text-light);"></i>
                <h3>Your wishlist is empty</h3>
                <p>Save courses you're interested in for later!</p>
                <a href="courses.html" class="btn btn-primary">Browse Courses</a>
            </div>
        `;
        return;
    }

    dashboardContent.innerHTML = `
        <div class="dashboard-header">
            <h2>My Wishlist</h2>
        </div>
        
        <div class="wishlist-grid">
            ${wishlist.map(courseId => `
                <div class="wishlist-item">
                    <span>Course ID: ${courseId}</span>
                    <button onclick="removeFromWishlist('${courseId}')" class="btn btn-outline btn-small">
                        Remove
                    </button>
                </div>
            `).join('')}
        </div>
    `;
};

// ===== LOAD INSTRUCTOR DASHBOARD =====
const loadInstructorDashboard = () => {
    dashboardContent.innerHTML = `
        <div class="dashboard-header">
            <h2>Instructor Dashboard</h2>
            <button onclick="showCreateCourseModal()" class="btn btn-primary">
                <i class="fas fa-plus"></i> Create New Course
            </button>
        </div>
        
        <div class="instructor-stats">
            <div class="stat-card">
                <h4>Total Students</h4>
                <span class="stat-number">1,234</span>
            </div>
            <div class="stat-card">
                <h4>Total Courses</h4>
                <span class="stat-number">5</span>
            </div>
            <div class="stat-card">
                <h4>Total Revenue</h4>
                <span class="stat-number">$12,345</span>
            </div>
            <div class="stat-card">
                <h4>Average Rating</h4>
                <span class="stat-number">4.8</span>
            </div>
        </div>
        
        <div class="instructor-courses">
            <h3>My Courses</h3>
            <!-- Course list will go here -->
        </div>
    `;
};

// ===== LOAD SETTINGS =====
const loadSettings = () => {
    dashboardContent.innerHTML = `
        <div class="dashboard-header">
            <h2>Profile Settings</h2>
        </div>
        
        <form id="profileForm" class="settings-form">
            <div class="form-group">
                <label for="profileName">Name</label>
                <input type="text" id="profileName" value="${userData.name}" required>
            </div>
            
            <div class="form-group">
                <label for="profileEmail">Email</label>
                <input type="email" id="profileEmail" value="${userData.email}" readonly disabled>
            </div>
            
            <div class="form-group">
                <label for="profileBio">Bio</label>
                <textarea id="profileBio" rows="4">${userData.bio || ''}</textarea>
            </div>
            
            <div class="form-group">
                <label for="profileAvatar">Avatar URL</label>
                <input type="url" id="profileAvatar" value="${userData.avatar || ''}">
            </div>
            
            <button type="submit" class="btn btn-primary">Save Changes</button>
        </form>
        
        <div class="danger-zone">
            <h3>Danger Zone</h3>
            <button onclick="deleteAccount()" class="btn btn-outline" style="border-color: #ef4444; color: #ef4444;">
                Delete Account
            </button>
        </div>
    `;
    
    // Add form handler
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }
};

// ===== HANDLE PROFILE UPDATE =====
const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    try {
        const name = document.getElementById('profileName').value;
        const bio = document.getElementById('profileBio').value;
        const avatar = document.getElementById('profileAvatar').value;
        
        const data = await apiCall('/users/profile', {
            method: 'PUT',
            body: JSON.stringify({ name, bio, avatar })
        });
        
        if (data.success) {
            showNotification('Profile updated successfully!', 'success');
            loadDashboardData(); // Reload data
        }
    } catch (error) {
        showNotification(error.message || 'Failed to update profile', 'error');
    }
};

// ===== SHOW NOTIFICATION =====
const showNotification = (message, type) => {
    // Use same notification function from auth.js
    if (window.showNotification) {
        window.showNotification(message, type);
    }
};

// ===== INITIALIZE DASHBOARD =====
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    
    // Load dashboard data
    loadDashboardData();
    
    // Add click handlers to menu items
    document.querySelectorAll('.dashboard-menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = link.getAttribute('data-tab');
            if (tab) {
                loadTab(tab);
                // Update URL without reload
                const url = new URL(window.location);
                url.searchParams.set('tab', tab);
                window.history.pushState({}, '', url);
            }
        });
    });
});