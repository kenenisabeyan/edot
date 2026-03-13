// ===== EDOT Platform - Courses Module =====

// State
let currentPage = 1;
let totalPages = 1;
let currentFilters = {
    category: '',
    level: '',
    search: '',
    sort: '-createdAt'
};

// DOM Elements
const coursesGrid = document.getElementById('coursesGrid');
const filtersForm = document.getElementById('filtersForm');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const levelFilter = document.getElementById('levelFilter');
const sortFilter = document.getElementById('sortFilter');
const paginationContainer = document.getElementById('pagination');
const totalCoursesElement = document.getElementById('totalCourses');

// ===== LOAD COURSES =====
const loadCourses = async (page = 1) => {
    if (!coursesGrid) return;

    // Show loading skeleton
    coursesGrid.innerHTML = Array(6).fill(0).map(() => `
        <div class="course-card loading-skeleton">
            <div class="course-image"></div>
            <div class="course-content">
                <div style="height: 20px; width: 100px; margin-bottom: 10px;"></div>
                <div style="height: 24px; width: 100%; margin-bottom: 10px;"></div>
                <div style="height: 16px; width: 150px;"></div>
            </div>
        </div>
    `).join('');

    try {
        // Build query string
        const queryParams = new URLSearchParams({
            page,
            limit: 9,
            ...currentFilters
        });

        const data = await apiCall(`/courses?${queryParams}`);
        
        if (data.courses && data.courses.length > 0) {
            displayCourses(data.courses);
            totalPages = data.totalPages;
            currentPage = data.currentPage;
            
            if (totalCoursesElement) {
                totalCoursesElement.textContent = data.total;
            }
            
            renderPagination();
        } else {
            coursesGrid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search" style="font-size: 48px; color: var(--text-light);"></i>
                    <h3>No courses found</h3>
                    <p>Try adjusting your filters or search criteria</p>
                    <button onclick="resetFilters()" class="btn btn-primary">Reset Filters</button>
                </div>
            `;
        }
    } catch (error) {
        console.error('Failed to load courses:', error);
        coursesGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-exclamation-circle" style="font-size: 48px; color: #ef4444;"></i>
                <h3>Failed to load courses</h3>
                <p>Please try again later</p>
                <button onclick="location.reload()" class="btn btn-primary">Retry</button>
            </div>
        `;
    }
};

// ===== DISPLAY COURSES =====
const displayCourses = (courses) => {
    coursesGrid.innerHTML = courses.map(course => `
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
};

// ===== RENDER PAGINATION =====
const renderPagination = () => {
    if (!paginationContainer) return;

    let paginationHTML = '<ul class="pagination">';
    
    // Previous button
    paginationHTML += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a href="#" class="page-link" onclick="changePage(${currentPage - 1}); return false;">
                <i class="fas fa-chevron-left"></i>
            </a>
        </li>
    `;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            paginationHTML += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a href="#" class="page-link" onclick="changePage(${i}); return false;">${i}</a>
                </li>
            `;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            paginationHTML += '<li class="page-item"><span class="page-link">...</span></li>';
        }
    }
    
    // Next button
    paginationHTML += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a href="#" class="page-link" onclick="changePage(${currentPage + 1}); return false;">
                <i class="fas fa-chevron-right"></i>
            </a>
        </li>
    `;
    
    paginationHTML += '</ul>';
    paginationContainer.innerHTML = paginationHTML;
};

// ===== CHANGE PAGE =====
window.changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        loadCourses(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

// ===== APPLY FILTERS =====
const applyFilters = () => {
    currentFilters = {
        category: categoryFilter?.value || '',
        level: levelFilter?.value || '',
        search: searchInput?.value || '',
        sort: sortFilter?.value || '-createdAt'
    };
    
    currentPage = 1;
    loadCourses(1);
};

// ===== RESET FILTERS =====
window.resetFilters = () => {
    if (searchInput) searchInput.value = '';
    if (categoryFilter) categoryFilter.value = '';
    if (levelFilter) levelFilter.value = '';
    if (sortFilter) sortFilter.value = '-createdAt';
    
    currentFilters = {
        category: '',
        level: '',
        search: '',
        sort: '-createdAt'
    };
    
    currentPage = 1;
    loadCourses(1);
};

// ===== SEARCH WITH DEBOUNCE =====
let searchTimeout;
if (searchInput) {
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            applyFilters();
        }, 500);
    });
}

// ===== FILTER CHANGE HANDLERS =====
if (categoryFilter) {
    categoryFilter.addEventListener('change', applyFilters);
}

if (levelFilter) {
    levelFilter.addEventListener('change', applyFilters);
}

if (sortFilter) {
    sortFilter.addEventListener('change', applyFilters);
}

// ===== LOAD CATEGORY FROM URL =====
const loadCategoryFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    if (category && categoryFilter) {
        categoryFilter.value = category;
        currentFilters.category = category;
    }
};

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    loadCategoryFromUrl();
    loadCourses(1);
});