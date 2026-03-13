/**
 * EDOT Platform - Dashboard Module
 * @version 1.0.0
 */

// ===== STATE =====
const DashboardState = {
    user: null,
    enrolledCourses: [],
    notifications: [],
    currentTab: 'overview',
    isLoading: false,
    charts: {},
};

// ===== DOM ELEMENTS =====
const DashboardElements = {
    container: document.getElementById('dashboardContent'),
    sidebar: document.querySelector('.dashboard-sidebar'),
    menu: document.querySelector('.dashboard-menu'),
    userName: document.getElementById('userName'),
    userEmail: document.getElementById('userEmail'),
    userAvatar: document.getElementById('userAvatar'),
    userRole: document.getElementById('userRole'),
};

// ===== INITIALIZATION =====
const initDashboard = async () => {
    // Check authentication
    if (!AppState.isAuthenticated) {
        window.location.href = 'login.html';
        return;
    }
    
    await loadDashboardData();
    initEventListeners();
    loadTabFromURL();
};

// ===== LOAD DASHBOARD DATA =====
const loadDashboardData = async () => {
    DashboardState.isLoading = true;
    
    try {
        // Load user profile
        const profileData = await API.get('/users/profile');
        DashboardState.user = profileData.user;
        
        // Load enrolled courses
        const coursesData = await API.get('/users/mycourses');
        DashboardState.enrolledCourses = coursesData.enrolledCourses;
        
        // Update UI
        updateUserInfo();
        
    } catch (error) {
        handleDashboardError(error);
    } finally {
        DashboardState.isLoading = false;
    }
};

// ===== UPDATE USER INFO =====
const updateUserInfo = () => {
    const user = DashboardState.user;
    if (!user) return;
    
    if (DashboardElements.userName) {
        DashboardElements.userName.textContent = user.name;
    }
    
    if (DashboardElements.userEmail) {
        DashboardElements.userEmail.textContent = user.email;
    }
    
    if (DashboardElements.userRole) {
        DashboardElements.userRole.textContent = user.role === 'instructor' ? 'Instructor' : 'Student';
        DashboardElements.userRole.className = `badge ${user.role}`;
    }
    
    if (DashboardElements.userAvatar) {
        DashboardElements.userAvatar.src = user.avatar || 'https://via.placeholder.com/100';
        DashboardElements.userAvatar.alt = user.name;
    }
};

// ===== TAB MANAGEMENT =====
const loadTabFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab') || 'overview';
    loadTab(tab);
};

const loadTab = async (tab) => {
    DashboardState.currentTab = tab;
    
    // Update active menu
    document.querySelectorAll('.dashboard-menu a').forEach(link => {
        const linkTab = link.dataset.tab;
        link.classList.toggle('active', linkTab === tab);
    });
    
    // Update URL
    const url = new URL(window.location);
    url.searchParams.set('tab', tab);
    window.history.pushState({}, '', url);
    
    // Load tab content
    DashboardState.isLoading = true;
    showLoading();
    
    try {
        switch(tab) {
            case 'overview':
                await loadOverview();
                break;
            case 'my-courses':
                await loadMyCourses();
                break;
            case 'progress':
                await loadProgress();
                break;
            case 'wishlist':
                await loadWishlist();
                break;
            case 'instructor':
                if (DashboardState.user?.role === 'instructor') {
                    await loadInstructorDashboard();
                } else {
                    await loadOverview();
                }
                break;
            case 'settings':
                await loadSettings();
                break;
            default:
                await loadOverview();
        }
    } catch (error) {
        handleDashboardError(error);
    } finally {
        DashboardState.isLoading = false;
    }
};

// ===== OVERVIEW TAB =====
const loadOverview = async () => {
    const enrolled = DashboardState.enrolledCourses;
    
    const stats = {
        total: enrolled.length,
        inProgress: enrolled.filter(e => e.progress > 0 && e.progress < 100).length,
        completed: enrolled.filter(e => e.progress === 100).length,
        totalLessons: enrolled.reduce((acc, curr) => acc + (curr.course?.lessons?.length || 0), 0),
        completedLessons: enrolled.reduce((acc, curr) => acc + (curr.completedLessons?.length || 0), 0),
    };
    
    const content = `
        <div class="dashboard-header">
            <div>
                <h2>Welcome back, ${DashboardState.user.name}!</h2>
                <p>Here's what's happening with your learning journey.</p>
            </div>
            <div class="header-actions">
                <a href="courses.html" class="btn btn-primary">
                    <i class="fas fa-plus"></i> Browse Courses
                </a>
            </div>
        </div>
        
        <div class="dashboard-stats">
            <div class="stat-card">
                <h4>Enrolled Courses</h4>
                <span class="stat-number">${stats.total}</span>
                <small>Total courses</small>
            </div>
            <div class="stat-card">
                <h4>In Progress</h4>
                <span class="stat-number">${stats.inProgress}</span>
                <small>Courses being learned</small>
            </div>
            <div class="stat-card">
                <h4>Completed</h4>
                <span class="stat-number">${stats.completed}</span>
                <small>Courses finished</small>
            </div>
            <div class="stat-card">
                <h4>Lessons Done</h4>
                <span class="stat-number">${stats.completedLessons}/${stats.totalLessons}</span>
                <small>Overall progress</small>
            </div>
        </div>
        
        <div class="recent-activity">
            <h3>Continue Learning</h3>
            ${renderContinueLearning()}
        </div>
        
        <div class="recent-activity">
            <h3>Recent Activity</h3>
            ${renderRecentActivity()}
        </div>
    `;
    
    DashboardElements.container.innerHTML = content;
};

const renderContinueLearning = () => {
    const inProgress = DashboardState.enrolledCourses
        .filter(e => e.progress > 0 && e.progress < 100)
        .slice(0, 3);
    
    if (inProgress.length === 0) {
        return `
            <div class="empty-state">
                <p>No courses in progress. <a href="courses.html">Start learning now!</a></p>
            </div>
        `;
    }
    
    return inProgress.map(enrollment => `
        <div class="activity-item">
            <div class="course-info">
                <h4>${escapeHtml(enrollment.course?.title || 'Course')}</h4>
                <p>${escapeHtml(enrollment.course?.instructor?.name || 'Instructor')}</p>
            </div>
            <div class="progress-info">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${enrollment.progress}%"></div>
                </div>
                <span>${Math.round(enrollment.progress)}% complete</span>
            </div>
            <a href="lesson.html?course=${enrollment.course?._id}" class="btn btn-primary btn-small">
                Continue Learning
            </a>
        </div>
    `).join('');
};

const renderRecentActivity = () => {
    // This would come from an API in production
    const activities = [
        { type: 'enrolled', course: 'Web Development Bootcamp', date: '2 days ago' },
        { type: 'completed', lesson: 'JavaScript Basics', date: '3 days ago' },
        { type: 'achievement', name: 'Fast Learner', date: '1 week ago' },
    ];
    
    return activities.map(activity => `
        <div class="activity-item">
            <i class="fas ${getActivityIcon(activity.type)}"></i>
            <div class="activity-details">
                <p>${getActivityText(activity)}</p>
                <small>${activity.date}</small>
            </div>
        </div>
    `).join('');
};

const getActivityIcon = (type) => {
    const icons = {
        enrolled: 'fa-graduation-cap',
        completed: 'fa-check-circle',
        achievement: 'fa-trophy',
        review: 'fa-star',
    };
    return icons[type] || 'fa-clock';
};

const getActivityText = (activity) => {
    switch(activity.type) {
        case 'enrolled':
            return `Enrolled in ${activity.course}`;
        case 'completed':
            return `Completed lesson: ${activity.lesson}`;
        case 'achievement':
            return `Earned achievement: ${activity.name}`;
        default:
            return 'Activity recorded';
    }
};

// ===== MY COURSES TAB =====
const loadMyCourses = async () => {
    const enrolled = DashboardState.enrolledCourses;
    
    if (enrolled.length === 0) {
        DashboardElements.container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-book-open"></i>
                <h3>No enrolled courses yet</h3>
                <p>Start your learning journey by enrolling in a course!</p>
                <a href="courses.html" class="btn btn-primary">
                    <i class="fas fa-search"></i> Browse Courses
                </a>
            </div>
        `;
        return;
    }
    
    const content = `
        <div class="dashboard-header">
            <h2>My Courses</h2>
            <a href="courses.html" class="btn btn-outline">
                <i class="fas fa-plus"></i> Add More
            </a>
        </div>
        
        <div class="my-courses-grid">
            ${enrolled.map(enrollment => renderCourseCard(enrollment)).join('')}
        </div>
    `;
    
    DashboardElements.container.innerHTML = content;
};

const renderCourseCard = (enrollment) => {
    const course = enrollment.course;
    if (!course) return '';
    
    const thumbnail = course.thumbnail || 'https://via.placeholder.com/300x200';
    const progress = enrollment.progress || 0;
    const completedLessons = enrollment.completedLessons?.length || 0;
    const totalLessons = course.lessons?.length || 0;
    
    return `
        <div class="course-progress-card">
            <img src="${thumbnail}" alt="${escapeHtml(course.title)}" loading="lazy">
            <div class="course-progress-info">
                <h3>${escapeHtml(course.title)}</h3>
                <p class="instructor">${escapeHtml(course.instructor?.name || 'Expert Instructor')}</p>
                <div class="progress-details">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <span class="progress-text">
                        ${Math.round(progress)}% complete (${completedLessons}/${totalLessons} lessons)
                    </span>
                </div>
                <div class="card-actions">
                    <a href="lesson.html?course=${course._id}" class="btn btn-primary btn-small">
                        ${progress === 100 ? 'Review Course' : 'Continue Learning'}
                    </a>
                    ${progress < 100 ? `
                        <button onclick="markCourseComplete('${course._id}')" class="btn btn-outline btn-small">
                            <i class="fas fa-check"></i> Mark Complete
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
};

// ===== PROGRESS TAB =====
const loadProgress = async () => {
    const enrolled = DashboardState.enrolledCourses;
    
    const overallProgress = enrolled.reduce((acc, curr) => acc + curr.progress, 0) / 
                           (enrolled.length || 1);
    
    const content = `
        <div class="dashboard-header">
            <h2>Learning Progress</h2>
        </div>
        
        <div class="progress-overview">
            <div class="overall-progress-card">
                <h3>Overall Progress</h3>
                <div class="circular-progress" style="--progress: ${overallProgress}">
                    <svg viewBox="0 0 100 100">
                        <circle class="progress-bg" cx="50" cy="50" r="45"></circle>
                        <circle class="progress-fill" cx="50" cy="50" r="45" 
                                style="stroke-dasharray: ${2 * Math.PI * 45}; 
                                       stroke-dashoffset: ${2 * Math.PI * 45 * (1 - overallProgress/100)}">
                        </circle>
                    </svg>
                    <span class="progress-value">${Math.round(overallProgress)}%</span>
                </div>
            </div>
            
            <div class="courses-progress-list">
                <h3>Course Breakdown</h3>
                ${enrolled.map(enrollment => `
                    <div class="course-progress-item">
                        <div class="course-info">
                            <h4>${escapeHtml(enrollment.course?.title || 'Course')}</h4>
                            <span class="progress-percent">${Math.round(enrollment.progress)}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${enrollment.progress}%"></div>
                        </div>
                        <div class="lesson-stats">
                            <small>${enrollment.completedLessons?.length || 0}/${enrollment.course?.lessons?.length || 0} lessons</small>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    DashboardElements.container.innerHTML = content;
    initCircularProgress();
};

const initCircularProgress = () => {
    // Add CSS for circular progress if not exists
    if (!document.getElementById('circular-progress-styles')) {
        const style = document.createElement('style');
        style.id = 'circular-progress-styles';
        style.textContent = `
            .circular-progress {
                position: relative;
                width: 200px;
                height: 200px;
                margin: 0 auto;
            }
            
            .circular-progress svg {
                width: 100%;
                height: 100%;
                transform: rotate(-90deg);
            }
            
            .circular-progress .progress-bg {
                fill: none;
                stroke: var(--border);
                stroke-width: 10;
            }
            
            .circular-progress .progress-fill {
                fill: none;
                stroke: var(--primary);
                stroke-width: 10;
                stroke-linecap: round;
                transition: stroke-dashoffset 0.5s ease;
            }
            
            .progress-value {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 2rem;
                font-weight: 700;
                color: var(--primary);
            }
        `;
        document.head.appendChild(style);
    }
};

// ===== WISHLIST TAB =====
const loadWishlist = async () => {
    const wishlist = Storage.get('wishlist', []);
    
    if (wishlist.length === 0) {
        DashboardElements.container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-heart"></i>
                <h3>Your wishlist is empty</h3>
                <p>Save courses you're interested in for later!</p>
                <a href="courses.html" class="btn btn-primary">
                    <i class="fas fa-search"></i> Browse Courses
                </a>
            </div>
        `;
        return;
    }
    
    // Load course details for wishlist items
    const wishlistCourses = await Promise.all(
        wishlist.map(async (courseId) => {
            try {
                return await API.get(`/courses/${courseId}`);
            } catch {
                return null;
            }
        })
    );
    
    const validCourses = wishlistCourses.filter(Boolean);
    
    const content = `
        <div class="dashboard-header">
            <h2>My Wishlist (${validCourses.length})</h2>
        </div>
        
        <div class="wishlist-grid">
            ${validCourses.map(course => `
                <div class="wishlist-item">
                    <img src="${course.course.thumbnail || 'https://via.placeholder.com/100'}" 
                         alt="${escapeHtml(course.course.title)}">
                    <div class="wishlist-info">
                        <h4>${escapeHtml(course.course.title)}</h4>
                        <p>${escapeHtml(course.course.instructor?.name || 'Instructor')}</p>
                        <span class="price ${course.course.price === 0 ? 'free' : ''}">
                            ${course.course.price === 0 ? 'Free' : `$${course.course.price}`}
                        </span>
                    </div>
                    <div class="wishlist-actions">
                        <a href="course.html?id=${course.course._id}" class="btn btn-primary btn-small">
                            View Course
                        </a>
                        <button onclick="removeFromWishlist('${course.course._id}')" 
                                class="btn btn-outline btn-small">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    DashboardElements.container.innerHTML = content;
};

// ===== INSTRUCTOR DASHBOARD =====
const loadInstructorDashboard = async () => {
    // This would fetch instructor-specific data from API
    const stats = {
        totalStudents: 1234,
        totalCourses: 5,
        totalRevenue: 12345,
        averageRating: 4.8,
    };
    
    const content = `
        <div class="dashboard-header">
            <h2>Instructor Dashboard</h2>
            <button onclick="showCreateCourseModal()" class="btn btn-primary">
                <i class="fas fa-plus"></i> Create New Course
            </button>
        </div>
        
        <div class="dashboard-stats">
            <div class="stat-card">
                <h4>Total Students</h4>
                <span class="stat-number">${stats.totalStudents.toLocaleString()}</span>
            </div>
            <div class="stat-card">
                <h4>Total Courses</h4>
                <span class="stat-number">${stats.totalCourses}</span>
            </div>
            <div class="stat-card">
                <h4>Total Revenue</h4>
                <span class="stat-number">$${stats.totalRevenue.toLocaleString()}</span>
            </div>
            <div class="stat-card">
                <h4>Average Rating</h4>
                <span class="stat-number">${stats.averageRating}</span>
            </div>
        </div>
        
        <div class="instructor-courses">
            <h3>My Courses</h3>
            <div class="courses-table">
                <table>
                    <thead>
                        <tr>
                            <th>Course</th>
                            <th>Students</th>
                            <th>Revenue</th>
                            <th>Rating</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colspan="5" class="text-center">Loading courses...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        
        <div class="recent-reviews">
            <h3>Recent Reviews</h3>
            <!-- Reviews would be loaded here -->
        </div>
    `;
    
    DashboardElements.container.innerHTML = content;
};

// ===== SETTINGS TAB =====
const loadSettings = () => {
    const user = DashboardState.user;
    
    const content = `
        <div class="dashboard-header">
            <h2>Profile Settings</h2>
        </div>
        
        <form id="profileForm" class="settings-form" onsubmit="updateProfile(event)">
            <div class="form-group">
                <label for="profileName">Full Name</label>
                <input type="text" id="profileName" value="${escapeHtml(user.name)}" required>
            </div>
            
            <div class="form-group">
                <label for="profileEmail">Email Address</label>
                <input type="email" id="profileEmail" value="${escapeHtml(user.email)}" disabled>
                <small class="form-text">Email cannot be changed</small>
            </div>
            
            <div class="form-group">
                <label for="profileBio">Bio</label>
                <textarea id="profileBio" rows="4">${escapeHtml(user.bio || '')}</textarea>
            </div>
            
            <div class="form-group">
                <label for="profileAvatar">Avatar URL</label>
                <input type="url" id="profileAvatar" value="${escapeHtml(user.avatar || '')}">
            </div>
            
            <h3>Change Password</h3>
            <div class="form-group">
                <label for="currentPassword">Current Password</label>
                <input type="password" id="currentPassword">
            </div>
            
            <div class="form-group">
                <label for="newPassword">New Password</label>
                <input type="password" id="newPassword">
            </div>
            
            <div class="form-group">
                <label for="confirmPassword">Confirm New Password</label>
                <input type="password" id="confirmPassword">
            </div>
            
            <button type="submit" class="btn btn-primary">Save Changes</button>
        </form>
        
        <div class="danger-zone">
            <h3>Danger Zone</h3>
            <button onclick="deleteAccount()" class="btn btn-outline" style="border-color: #ef4444; color: #ef4444;">
                <i class="fas fa-exclamation-triangle"></i> Delete Account
            </button>
        </div>
    `;
    
    DashboardElements.container.innerHTML = content;
};

// ===== SETTINGS ACTIONS =====
window.updateProfile = async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('profileName').value,
        bio: document.getElementById('profileBio').value,
        avatar: document.getElementById('profileAvatar').value,
    };
    
    // Validate
    if (!Validators.name(formData.name)) {
        UI.showNotification('Name must be at least 2 characters', 'error');
        return;
    }
    
    try {
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        
        const data = await API.put('/users/profile', formData);
        
        DashboardState.user = data.user;
        updateUserInfo();
        UI.showNotification('Profile updated successfully!', 'success');
        
    } catch (error) {
        UI.showNotification(error.message || 'Failed to update profile', 'error');
    } finally {
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Save Changes';
    }
};

window.deleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        return;
    }
    
    if (!confirm('This will permanently delete all your data. Type "DELETE" to confirm.')) {
        return;
    }
    
    try {
        await API.delete('/users/profile');
        API.logout();
    } catch (error) {
        UI.showNotification('Failed to delete account. Please contact support.', 'error');
    }
};

// ===== WISHLIST ACTIONS =====
window.removeFromWishlist = (courseId) => {
    const wishlist = Storage.get('wishlist', []);
    const index = wishlist.indexOf(courseId);
    
    if (index > -1) {
        wishlist.splice(index, 1);
        Storage.set('wishlist', wishlist);
        UI.showNotification('Removed from wishlist', 'info');
        loadWishlist(); // Reload the wishlist tab
    }
};

// ===== COURSE ACTIONS =====
window.markCourseComplete = async (courseId) => {
    try {
        await API.post(`/courses/${courseId}/complete`);
        UI.showNotification('Course marked as complete!', 'success');
        loadDashboardData(); // Reload data
        loadTab('my-courses'); // Reload current tab
    } catch (error) {
        UI.showNotification('Failed to mark course as complete', 'error');
    }
};

// ===== CREATE COURSE MODAL =====
window.showCreateCourseModal = () => {
    // Create modal dynamically
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Create New Course</h2>
                <button onclick="this.closest('.modal').remove()" class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <form id="createCourseForm" onsubmit="createCourse(event)">
                    <div class="form-group">
                        <label for="courseTitle">Course Title *</label>
                        <input type="text" id="courseTitle" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="courseDescription">Description *</label>
                        <textarea id="courseDescription" rows="4" required></textarea>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="courseCategory">Category *</label>
                            <select id="courseCategory" required>
                                <option value="">Select Category</option>
                                <option value="Programming">Programming</option>
                                <option value="Mathematics">Mathematics</option>
                                <option value="Science">Science</option>
                                <option value="Business">Business</option>
                                <option value="Design">Design</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="courseLevel">Level *</label>
                            <select id="courseLevel" required>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="coursePrice">Price ($)</label>
                            <input type="number" id="coursePrice" min="0" step="0.01" value="0">
                        </div>
                        
                        <div class="form-group">
                            <label for="courseDuration">Duration (hours)</label>
                            <input type="number" id="courseDuration" min="1" value="10">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="courseThumbnail">Thumbnail URL</label>
                        <input type="url" id="courseThumbnail" placeholder="https://...">
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-block">Create Course</button>
                </form>
            </div>
        </div>
    `;
    
    // Add modal styles
    if (!document.getElementById('modal-styles')) {
        const style = document.createElement('style');
        style.id = 'modal-styles';
        style.textContent = `
            .modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: var(--z-modal);
                animation: fadeIn 0.3s ease;
            }
            
            .modal-content {
                background: var(--white);
                border-radius: var(--radius-lg);
                width: 90%;
                max-width: 600px;
                max-height: 90vh;
                overflow-y: auto;
                animation: slideInUp 0.3s ease;
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: var(--space-4);
                border-bottom: 1px solid var(--border);
            }
            
            .modal-header h2 {
                margin: 0;
            }
            
            .close-btn {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: var(--text-light);
                transition: var(--transition-fast);
            }
            
            .close-btn:hover {
                color: var(--error);
            }
            
            .modal-body {
                padding: var(--space-4);
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(modal);
};

window.createCourse = async (e) => {
    e.preventDefault();
    
    const formData = {
        title: document.getElementById('courseTitle').value,
        description: document.getElementById('courseDescription').value,
        category: document.getElementById('courseCategory').value,
        level: document.getElementById('courseLevel').value,
        price: parseFloat(document.getElementById('coursePrice').value) || 0,
        duration: parseInt(document.getElementById('courseDuration').value) || 10,
        thumbnail: document.getElementById('courseThumbnail').value,
    };
    
    // Validate
    if (!formData.title || !formData.description || !formData.category) {
        UI.showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    try {
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';
        
        await API.post('/courses', formData);
        
        UI.showNotification('Course created successfully!', 'success');
        
        // Close modal
        document.querySelector('.modal').remove();
        
        // Reload instructor dashboard
        if (DashboardState.currentTab === 'instructor') {
            loadInstructorDashboard();
        }
        
    } catch (error) {
        UI.showNotification(error.message || 'Failed to create course', 'error');
    }
};

// ===== UTILITY FUNCTIONS =====
const showLoading = () => {
    if (!DashboardElements.container) return;
    DashboardElements.container.innerHTML = '<div class="loading-spinner"></div>';
};

const handleDashboardError = (error) => {
    console.error('Dashboard error:', error);
    
    if (!DashboardElements.container) return;
    
    let message = 'Failed to load dashboard data. Please try again.';
    
    if (error instanceof APIError) {
        if (error.status === 401) {
            window.location.href = 'login.html';
            return;
        }
    }
    
    DashboardElements.container.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-exclamation-circle" style="color: #ef4444;"></i>
            <h3>Something went wrong</h3>
            <p>${message}</p>
            <button onclick="location.reload()" class="btn btn-primary">
                <i class="fas fa-sync-alt"></i> Retry
            </button>
        </div>
    `;
};

const escapeHtml = (text) => {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
};

// ===== EVENT LISTENERS =====
const initEventListeners = () => {
    // Menu click handlers
    if (DashboardElements.menu) {
        DashboardElements.menu.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.dataset.tab) {
                e.preventDefault();
                loadTab(link.dataset.tab);
            }
        });
    }
    
    // Handle browser back/forward
    window.addEventListener('popstate', () => {
        loadTabFromURL();
    });
};

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
});

// ===== EXPORT =====
window.initDashboard = initDashboard;
window.loadTab = loadTab;