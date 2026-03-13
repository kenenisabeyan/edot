// ===== EDOT Platform - Lesson Module =====

// Get parameters from URL
const urlParams = new URLSearchParams(window.location.search);
const courseId = urlParams.get('course');
const lessonId = urlParams.get('lesson');

// State
let courseData = null;
let currentLessonIndex = 0;
let lessons = [];
let notes = {};

// ===== LOAD LESSON DATA =====
const loadLessonData = async () => {
    if (!courseId) {
        window.location.href = 'dashboard.html';
        return;
    }

    try {
        // Load course details with lessons
        const data = await apiCall(`/courses/${courseId}`);
        courseData = data.course;
        lessons = courseData.lessons || [];
        
        // Load saved notes
        loadSavedNotes();
        
        // Find current lesson
        if (lessonId) {
            currentLessonIndex = lessons.findIndex(l => l._id === lessonId);
        }
        
        if (currentLessonIndex === -1 && lessons.length > 0) {
            currentLessonIndex = 0;
        }
        
        // Update UI
        updateSidebar();
        updateLessonContent();
        updateNavigation();
        updateProgress();
        
    } catch (error) {
        console.error('Failed to load lesson:', error);
        showError('Failed to load lesson. Please try again.');
    }
};

// ===== LOAD SAVED NOTES =====
const loadSavedNotes = () => {
    const savedNotes = localStorage.getItem(`notes_${courseId}`);
    if (savedNotes) {
        notes = JSON.parse(savedNotes);
    }
};

// ===== UPDATE SIDEBAR =====
const updateSidebar = () => {
    const courseTitle = document.getElementById('courseTitle');
    const lessonList = document.getElementById('lessonList');
    const totalLessonsSpan = document.getElementById('totalLessons');
    
    if (courseTitle) {
        courseTitle.textContent = courseData.title;
    }
    
    if (totalLessonsSpan) {
        totalLessonsSpan.textContent = lessons.length;
    }
    
    if (lessonList) {
        lessonList.innerHTML = lessons.map((lesson, index) => {
            const isActive = index === currentLessonIndex;
            const isCompleted = checkLessonCompleted(lesson._id);
            
            return `
                <li class="lesson-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}"
                    onclick="navigateToLesson(${index})">
                    <i class="fas ${isCompleted ? 'fa-check-circle' : 'fa-play-circle'}"></i>
                    <div class="lesson-info">
                        <span class="lesson-title">${lesson.title}</span>
                        <span class="lesson-duration">${lesson.duration || 10} min</span>
                    </div>
                </li>
            `;
        }).join('');
    }
};

// ===== UPDATE LESSON CONTENT =====
const updateLessonContent = () => {
    if (lessons.length === 0) return;
    
    const lesson = lessons[currentLessonIndex];
    
    const lessonTitle = document.getElementById('lessonTitle');
    const lessonDescription = document.getElementById('lessonDescription');
    const videoPlayer = document.getElementById('videoPlayer');
    const notesTextarea = document.getElementById('lessonNotes');
    const resourcesList = document.getElementById('resourcesList');
    
    if (lessonTitle) {
        lessonTitle.textContent = lesson.title;
    }
    
    if (lessonDescription) {
        lessonDescription.textContent = lesson.description || 'No description available.';
    }
    
    if (videoPlayer) {
        // Update video source
        const source = videoPlayer.querySelector('source');
        if (source) {
            source.src = lesson.videoUrl || '';
            videoPlayer.load();
        }
    }
    
    if (notesTextarea) {
        notesTextarea.value = notes[lesson._id] || '';
    }
    
    if (resourcesList) {
        const resources = lesson.resources || [];
        if (resources.length > 0) {
            resourcesList.innerHTML = resources.map(resource => `
                <li>
                    <a href="${resource.fileUrl}" target="_blank">
                        <i class="fas fa-file-${resource.type || 'download'}"></i>
                        ${resource.title}
                    </a>
                </li>
            `).join('');
        } else {
            resourcesList.innerHTML = '<li>No resources available for this lesson.</li>';
        }
    }
    
    // Update URL without reload
    const url = new URL(window.location);
    url.searchParams.set('lesson', lesson._id);
    window.history.pushState({}, '', url);
};

// ===== UPDATE NAVIGATION =====
const updateNavigation = () => {
    const prevBtn = document.getElementById('prevLesson');
    const nextBtn = document.getElementById('nextLesson');
    
    if (prevBtn) {
        prevBtn.disabled = currentLessonIndex === 0;
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentLessonIndex === lessons.length - 1;
    }
};

// ===== UPDATE PROGRESS =====
const updateProgress = async () => {
    try {
        const data = await apiCall('/users/mycourses');
        const enrollment = data.enrolledCourses.find(e => e.course._id === courseId);
        
        if (enrollment) {
            const progressBar = document.getElementById('courseProgress');
            const completedSpan = document.getElementById('completedLessons');
            
            if (progressBar) {
                progressBar.style.width = `${enrollment.progress}%`;
            }
            
            if (completedSpan) {
                completedSpan.textContent = enrollment.completedLessons.length;
            }
        }
    } catch (error) {
        console.error('Failed to update progress:', error);
    }
};

// ===== CHECK LESSON COMPLETED =====
const checkLessonCompleted = (lessonId) => {
    // This will be checked against user's completed lessons
    return false; // Placeholder
};

// ===== NAVIGATE TO LESSON =====
window.navigateToLesson = (index) => {
    if (index >= 0 && index < lessons.length) {
        currentLessonIndex = index;
        updateSidebar();
        updateLessonContent();
        updateNavigation();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

// ===== NAVIGATE LESSON =====
window.navigateLesson = (direction) => {
    if (direction === 'prev' && currentLessonIndex > 0) {
        navigateToLesson(currentLessonIndex - 1);
    } else if (direction === 'next' && currentLessonIndex < lessons.length - 1) {
        navigateToLesson(currentLessonIndex + 1);
    }
};

// ===== MARK LESSON COMPLETE =====
window.markLessonComplete = async () => {
    const lesson = lessons[currentLessonIndex];
    
    try {
        const data = await apiCall(`/courses/${courseId}/lessons/${lesson._id}/complete`, {
            method: 'POST'
        });
        
        if (data.success) {
            showNotification('Lesson completed!', 'success');
            updateSidebar();
            updateProgress();
            
            // Auto-navigate to next lesson
            if (currentLessonIndex < lessons.length - 1) {
                setTimeout(() => {
                    navigateToLesson(currentLessonIndex + 1);
                }, 1500);
            }
        }
    } catch (error) {
        showNotification(error.message || 'Failed to mark lesson complete', 'error');
    }
};

// ===== SAVE NOTES =====
window.saveNotes = () => {
    const lesson = lessons[currentLessonIndex];
    const notesTextarea = document.getElementById('lessonNotes');
    
    if (lesson && notesTextarea) {
        notes[lesson._id] = notesTextarea.value;
        localStorage.setItem(`notes_${courseId}`, JSON.stringify(notes));
        showNotification('Notes saved!', 'success');
    }
};

// ===== SHOW ERROR =====
const showError = (message) => {
    const main = document.querySelector('.lesson-main');
    if (main) {
        main.innerHTML = `
            <div class="alert alert-error">
                <i class="fas fa-exclamation-circle"></i>
                <p>${message}</p>
                <button onclick="location.reload()" class="btn btn-primary">Retry</button>
            </div>
        `;
    }
};

// ===== SHOW NOTIFICATION =====
const showNotification = (message, type) => {
    // Use same notification function from auth.js
    if (window.showNotification) {
        window.showNotification(message, type);
    }
};

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    
    loadLessonData();
});

// Auto-save notes every 30 seconds
setInterval(() => {
    if (document.getElementById('lessonNotes')) {
        saveNotes();
    }
}, 30000);