/**
 * EDOT Platform - Courses Listing Module
 * @version 1.0.0
 */

// ===== STATE =====
const CoursesState = {
    currentPage: 1,
    totalPages: 1,
    totalCourses: 0,
    filters: {
        category: '',
        level: '',
        search: '',
        sort: '-createdAt'
    },
    courses: [],
    isLoading: false,
    observer: null,
};

// ===== DOM ELEMENTS =====
const CoursesElements = {
    grid: document.getElementById('coursesGrid'),
    searchInput: document.getElementById('searchInput'),
    categoryFilter: document.getElementById('categoryFilter'),
    levelFilter: document.getElementById('levelFilter'),
    sortFilter: document.getElementById('sortFilter'),
    pagination: document.getElementById('pagination'),
    totalCourses: document.getElementById('totalCourses'),
    resetBtn: document.querySelector('[onclick="resetFilters()"]'),
};

// ===== INITIALIZATION =====
const initCourses = () => {
    loadFiltersFromURL();
    initEventListeners();
    initInfiniteScroll();
    loadCourses();
};

// ===== LOAD COURSES =====
const loadCourses = async (page = 1) => {
    if (!CoursesElements.grid) return;
    
    CoursesState.isLoading = true;
    CoursesState.currentPage = page;
    
    if (page === 1) {
        showLoadingSkeleton();
    }
    
    try {
        const queryParams = buildQueryParams(page);
        const data = await API.get(`/courses?${queryParams}`, true);
        
        CoursesState.courses = data.courses;
        CoursesState.totalPages = data.totalPages;
        CoursesState.totalCourses = data.total;
        
        if (page === 1) {
            renderCourses(data.courses);
        } else {
            appendCourses(data.courses);
        }
        
        updatePagination();
        updateResultsInfo();
        
    } catch (error) {
        handleCoursesError(error);
    } finally {
        CoursesState.isLoading = false;
    }
};

// ===== BUILD QUERY PARAMS =====
const buildQueryParams = (page) => {
    const params = new URLSearchParams({
        page,
        limit: 9,
        ...CoursesState.filters
    });
    
    // Remove empty filters
    Object.keys(CoursesState.filters).forEach(key => {
        if (!CoursesState.filters[key]) {
            params.delete(key);
        }
    });
    
    return params.toString();
};

// ===== RENDER COURSES =====
const renderCourses = (courses) => {
    if (!CoursesElements.grid) return;
    
    if (!courses || courses.length === 0) {
        renderEmptyState();
        return;
    }
    
    CoursesElements.grid.innerHTML = courses.map(course => createCourseCard(course)).join('');
    lazyLoadImages();
};

const appendCourses = (courses) => {
    if (!CoursesElements.grid) return;
    
    const html = courses.map(course => createCourseCard(course)).join('');
    CoursesElements.grid.insertAdjacentHTML('beforeend', html);
    lazyLoadImages();
};

const createCourseCard = (course) => {
    const thumbnail = course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80';
    const instructorName = course.instructor?.name || 'Expert Instructor';
    const rating = course.rating || 4.5;
    const students = course.totalStudents || 0;
    const duration = course.duration || 10;
    const price = course.price === 0 ? 'Free' : `$${course.price}`;
    const priceClass = course.price === 0 ? 'free' : '';
    
    return `
        <div class="course-card" data-id="${course._id}">
            <div class="course-image">
                <img data-src="${thumbnail}" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'%3E%3C/svg%3E" 
                     alt="${escapeHtml(course.title)}" class="lazy-image">
                <span class="course-level">${escapeHtml(course.level || 'Beginner')}</span>
            </div>
            <div class="course-content">
                <span class="course-category">${escapeHtml(course.category)}</span>
                <h3 class="course-title">
                    <a href="course.html?id=${course._id}">${escapeHtml(course.title)}</a>
                </h3>
                <p class="course-instructor">
                    <i class="fas fa-user"></i> ${escapeHtml(instructorName)}
                </p>
                <div class="course-meta">
                    <div class="course-rating">
                        <i class="fas fa-star"></i>
                        <span>${rating} (${Formatters.number(students)} students)</span>
                    </div>
                    <div class="course-duration">
                        <i class="fas fa-clock"></i>
                        <span>${Formatters.duration(duration * 60)}</span>
                    </div>
                </div>
                <div class="course-footer">
                    <span class="course-price ${priceClass}">${price}</span>
                    <a href="course.html?id=${course._id}" class="btn btn-primary btn-small">
                        View Course
                    </a>
                </div>
            </div>
        </div>
    `;
};

const renderEmptyState = () => {
    CoursesElements.grid.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-search"></i>
            <h3>No courses found</h3>
            <p>Try adjusting your filters or search criteria</p>
            <button onclick="resetFilters()" class="btn btn-primary">
                <i class="fas fa-undo"></i> Reset Filters
            </button>
        </div>
    `;
};

const showLoadingSkeleton = () => {
    if (!CoursesElements.grid) return;
    
    CoursesElements.grid.innerHTML = Array(6).fill(0).map(() => `
        <div class="course-card loading-skeleton">
            <div class="course-image" style="height: 200px;"></div>
            <div class="course-content">
                <div style="height: 20px; width: 100px; margin-bottom: 10px; background: var(--border);"></div>
                <div style="height: 24px; width: 100%; margin-bottom: 10px; background: var(--border);"></div>
                <div style="height: 16px; width: 150px; background: var(--border);"></div>
            </div>
        </div>
    `).join('');
};

// ===== LAZY LOADING =====
const lazyLoadImages = () => {
    const images = document.querySelectorAll('.lazy-image');
    
    if ('IntersectionObserver' in window) {
        if (CoursesState.observer) {
            CoursesState.observer.disconnect();
        }
        
        CoursesState.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy-image');
                    CoursesState.observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });
        
        images.forEach(img => CoursesState.observer.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy-image');
        });
    }
};

// ===== INFINITE SCROLL =====
const initInfiniteScroll = () => {
    if (!CoursesElements.grid) return;
    
    const sentinel = document.createElement('div');
    sentinel.id = 'scroll-sentinel';
    sentinel.style.height = '10px';
    CoursesElements.grid.parentNode.appendChild(sentinel);
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && 
                !CoursesState.isLoading && 
                CoursesState.currentPage < CoursesState.totalPages) {
                loadCourses(CoursesState.currentPage + 1);
            }
        });
    }, {
        rootMargin: '100px'
    });
    
    observer.observe(sentinel);
};

// ===== FILTERS =====
const initEventListeners = () => {
    // Search with debounce
    if (CoursesElements.searchInput) {
        CoursesElements.searchInput.addEventListener('input', 
            Debouncer.debounce(() => applyFilters(), 500)
        );
    }
    
    // Filter changes
    [CoursesElements.categoryFilter, CoursesElements.levelFilter, CoursesElements.sortFilter].forEach(filter => {
        if (filter) {
            filter.addEventListener('change', () => applyFilters());
        }
    });
    
    // Reset button
    if (CoursesElements.resetBtn) {
        CoursesElements.resetBtn.addEventListener('click', (e) => {
            e.preventDefault();
            resetFilters();
        });
    }
};

const applyFilters = () => {
    // Update state
    CoursesState.filters = {
        category: CoursesElements.categoryFilter?.value || '',
        level: CoursesElements.levelFilter?.value || '',
        search: CoursesElements.searchInput?.value.trim() || '',
        sort: CoursesElements.sortFilter?.value || '-createdAt'
    };
    
    // Update URL
    updateURL();
    
    // Reset page and load
    CoursesState.currentPage = 1;
    loadCourses(1);
    
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

const resetFilters = () => {
    // Clear inputs
    if (CoursesElements.searchInput) CoursesElements.searchInput.value = '';
    if (CoursesElements.categoryFilter) CoursesElements.categoryFilter.value = '';
    if (CoursesElements.levelFilter) CoursesElements.levelFilter.value = '';
    if (CoursesElements.sortFilter) CoursesElements.sortFilter.value = '-createdAt';
    
    // Reset state
    CoursesState.filters = {
        category: '',
        level: '',
        search: '',
        sort: '-createdAt'
    };
    
    // Clear URL
    const url = new URL(window.location);
    url.search = '';
    window.history.pushState({}, '', url);
    
    // Reload courses
    CoursesState.currentPage = 1;
    loadCourses(1);
};

// ===== URL MANAGEMENT =====
const loadFiltersFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    
    CoursesState.filters = {
        category: params.get('category') || '',
        level: params.get('level') || '',
        search: params.get('search') || '',
        sort: params.get('sort') || '-createdAt'
    };
    
    // Update UI
    if (CoursesElements.categoryFilter) CoursesElements.categoryFilter.value = CoursesState.filters.category;
    if (CoursesElements.levelFilter) CoursesElements.levelFilter.value = CoursesState.filters.level;
    if (CoursesElements.searchInput) CoursesElements.searchInput.value = CoursesState.filters.search;
    if (CoursesElements.sortFilter) CoursesElements.sortFilter.value = CoursesState.filters.sort;
};

const updateURL = () => {
    const url = new URL(window.location);
    
    // Update params
    Object.entries(CoursesState.filters).forEach(([key, value]) => {
        if (value) {
            url.searchParams.set(key, value);
        } else {
            url.searchParams.delete(key);
        }
    });
    
    url.searchParams.set('page', CoursesState.currentPage);
    window.history.pushState({}, '', url);
};

// ===== PAGINATION =====
const updatePagination = () => {
    if (!CoursesElements.pagination) return;
    
    if (CoursesState.totalPages <= 1) {
        CoursesElements.pagination.innerHTML = '';
        return;
    }
    
    let html = '<ul class="pagination">';
    
    // Previous button
    html += `
        <li class="page-item ${CoursesState.currentPage === 1 ? 'disabled' : ''}">
            <a href="#" class="page-link" onclick="changePage(${CoursesState.currentPage - 1}); return false;">
                <i class="fas fa-chevron-left"></i>
            </a>
        </li>
    `;
    
    // Page numbers
    for (let i = 1; i <= CoursesState.totalPages; i++) {
        if (i === 1 || i === CoursesState.totalPages || 
            (i >= CoursesState.currentPage - 2 && i <= CoursesState.currentPage + 2)) {
            html += `
                <li class="page-item ${i === CoursesState.currentPage ? 'active' : ''}">
                    <a href="#" class="page-link" onclick="changePage(${i}); return false;">${i}</a>
                </li>
            `;
        } else if (i === CoursesState.currentPage - 3 || i === CoursesState.currentPage + 3) {
            html += '<li class="page-item"><span class="page-link">...</span></li>';
        }
    }
    
    // Next button
    html += `
        <li class="page-item ${CoursesState.currentPage === CoursesState.totalPages ? 'disabled' : ''}">
            <a href="#" class="page-link" onclick="changePage(${CoursesState.currentPage + 1}); return false;">
                <i class="fas fa-chevron-right"></i>
            </a>
        </li>
    `;
    
    html += '</ul>';
    CoursesElements.pagination.innerHTML = html;
};

const updateResultsInfo = () => {
    if (CoursesElements.totalCourses) {
        CoursesElements.totalCourses.textContent = Formatters.number(CoursesState.totalCourses);
    }
};

// ===== ERROR HANDLING =====
const handleCoursesError = (error) => {
    console.error('Courses error:', error);
    
    if (!CoursesElements.grid) return;
    
    let message = 'Failed to load courses. Please try again.';
    
    if (error instanceof APIError) {
        if (error.status === 429) {
            message = 'Too many requests. Please wait a moment.';
        } else if (error.status >= 500) {
            message = 'Server error. Please try again later.';
        }
    }
    
    CoursesElements.grid.innerHTML = `
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

// ===== PAGE CHANGE =====
window.changePage = (page) => {
    if (page >= 1 && page <= CoursesState.totalPages) {
        CoursesState.currentPage = page;
        loadCourses(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

// ===== RESET FILTERS (GLOBAL) =====
window.resetFilters = resetFilters;

// ===== UTILITY FUNCTIONS =====
const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
};

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    initCourses();
});

// ===== EXPORT =====
window.initCourses = initCourses;
window.changePage = changePage;