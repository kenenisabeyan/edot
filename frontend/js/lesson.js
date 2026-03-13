/**
 * EDOT Platform - Lesson Player Module
 * @version 1.0.0
 */

// ===== STATE =====
const LessonState = {
    courseId: null,
    lessonId: null,
    courseData: null,
    lessons: [],
    currentLessonIndex: 0,
    notes: {},
    videoProgress: {},
    isCompleted: false,
    autoPlay: true,
};

// ===== DOM ELEMENTS =====
const LessonElements = {
    container: document.querySelector('.lesson-container'),
    sidebar: document.querySelector('.lesson-sidebar'),
    lessonList: document.getElementById('lessonList'),
    videoPlayer: document.getElementById('videoPlayer'),
    videoContainer: document.getElementById('videoContainer'),
    lessonTitle: document.getElementById('lessonTitle'),
    lessonDescription: document.getElementById('lessonDescription'),
    courseTitle: document.getElementById('courseTitle'),
    courseProgress: document.getElementById('courseProgress'),
    completedLessons: document.getElementById('completedLessons'),
    totalLessons: document.getElementById('totalLessons'),
    prevBtn: document.getElementById('prevLesson'),
    nextBtn: document.getElementById('nextLesson'),
    markCompleteBtn: document.getElementById('markComplete'),
    notesTextarea: document.getElementById('lessonNotes'),
    resourcesList: document.getElementById('resourcesList'),
};

// ===== INITIALIZATION =====
const initLesson = async () => {
    // Check authentication
    if (!AppState.isAuthenticated) {
        window.location.href = 'login.html';
        return;
    }
    
    // Get parameters from URL
    const params = new URLSearchParams(window.location.search);
    LessonState.courseId = params.get('course');
    LessonState.lessonId = params.get('lesson');
    
    if (!LessonState.courseId) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    await loadLessonData();
    initEventListeners();
    initVideoEvents();
    loadSavedNotes();
    loadVideoProgress();
    
    // Auto-save notes every 30 seconds
    setInterval(saveNotes, 30000);
};

// ===== LOAD LESSON DATA =====
const loadLessonData = async () => {
    try {
        // Show loading state
        showLoading();
        
        // Load course details with lessons
        const data = await API.get(`/courses/${LessonState.courseId}`);
        LessonState.courseData = data.course;
        LessonState.lessons = data.course.lessons || [];
        
        // Find current lesson
        if (LessonState.lessonId) {
            LessonState.currentLessonIndex = LessonState.lessons.findIndex(
                l => l._id === LessonState.lessonId
            );
        }
        
        if (LessonState.currentLessonIndex === -1 && LessonState.lessons.length > 0) {
            LessonState.currentLessonIndex = 0;
        }
        
        // Update UI
        updateSidebar();
        updateLessonContent();
        updateNavigation();
        await updateProgress();
        
    } catch (error) {
        handleLessonError(error);
    }
};

// ===== UPDATE SIDEBAR =====
const updateSidebar = () => {
    if (LessonElements.courseTitle) {
        LessonElements.courseTitle.textContent = LessonState.courseData.title;
    }
    
    if (LessonElements.totalLessons) {
        LessonElements.totalLessons.textContent = LessonState.lessons.length;
    }
    
    if (LessonElements.lessonList) {
        LessonElements.lessonList.innerHTML = LessonState.lessons.map((lesson, index) => {
            const isActive = index === LessonState.currentLessonIndex;
            const isCompleted = checkLessonCompleted(lesson._id);
            
            return `
                <li class="lesson-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}"
                    data-index="${index}" data-id="${lesson._id}">
                    <i class="fas ${isCompleted ? 'fa-check-circle' : 'fa-play-circle'}"></i>
                    <div class="lesson-info">
                        <span class="lesson-title">${escapeHtml(lesson.title)}</span>
                        <span class="lesson-duration">${Formatters.duration(lesson.duration || 10)}</span>
                    </div>
                </li>
            `;
        }).join('');
        
        // Add click handlers to lesson items
        document.querySelectorAll('.lesson-item').forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.index);
                navigateToLesson(index);
            });
        });
    }
};

// ===== UPDATE LESSON CONTENT =====
const updateLessonContent = () => {
    if (LessonState.lessons.length === 0) return;
    
    const lesson = LessonState.lessons[LessonState.currentLessonIndex];
    
    if (LessonElements.lessonTitle) {
        LessonElements.lessonTitle.textContent = lesson.title;
    }
    
    if (LessonElements.lessonDescription) {
        LessonElements.lessonDescription.textContent = 
            lesson.description || 'No description available.';
    }
    
    // Update video
    updateVideoPlayer(lesson);
    
    // Update notes
    if (LessonElements.notesTextarea) {
        LessonElements.notesTextarea.value = LessonState.notes[lesson._id] || '';
    }
    
    // Update resources
    updateResources(lesson);
    
    // Update URL
    const url = new URL(window.location);
    url.searchParams.set('lesson', lesson._id);
    window.history.pushState({}, '', url);
    
    // Mark as viewed for progress tracking
    trackLessonView(lesson._id);
};

const updateVideoPlayer = (lesson) => {
    if (!LessonElements.videoPlayer) return;
    
    // If video element exists, update source
    if (LessonElements.videoPlayer.tagName === 'VIDEO') {
        const source = LessonElements.videoPlayer.querySelector('source');
        if (source) {
            source.src = lesson.videoUrl || '';
            LessonElements.videoPlayer.load();
            
            // Restore progress if exists
            if (LessonState.videoProgress[lesson._id]) {
                LessonElements.videoPlayer.currentTime = LessonState.videoProgress[lesson._id];
            }
        }
    } else {
        // If iframe (YouTube/Vimeo), update src
        LessonElements.videoPlayer.src = lesson.videoUrl || '';
    }
};

const updateResources = (lesson) => {
    if (!LessonElements.resourcesList) return;
    
    const resources = lesson.resources || [];
    
    if (resources.length > 0) {
        LessonElements.resourcesList.innerHTML = resources.map(resource => `
            <li>
                <a href="${escapeHtml(resource.fileUrl)}" target="_blank" rel="noopener noreferrer">
                    <i class="fas fa-file-${getFileIcon(resource.type)}"></i>
                    ${escapeHtml(resource.title)}
                </a>
            </li>
        `).join('');
    } else {
        LessonElements.resourcesList.innerHTML = '<li>No resources available for this lesson.</li>';
    }
};

const getFileIcon = (type) => {
    const icons = {
        pdf: 'pdf',
        video: 'video',
        audio: 'audio',
        image: 'image',
        link: 'link',
        file: 'download',
    };
    return icons[type] || 'download';
};

// ===== PROGRESS TRACKING =====
const updateProgress = async () => {
    try {
        const data = await API.get('/users/mycourses');
        const enrollment = data.enrolledCourses.find(
            e => e.course._id === LessonState.courseId
        );
        
        if (enrollment) {
            if (LessonElements.courseProgress) {
                LessonElements.courseProgress.style.width = `${enrollment.progress}%`;
            }
            
            if (LessonElements.completedLessons) {
                LessonElements.completedLessons.textContent = enrollment.completedLessons.length;
            }
            
            // Update lesson completion status
            LessonState.lessons.forEach(lesson => {
                lesson.completed = enrollment.completedLessons.includes(lesson._id);
            });
            
            // Re-render sidebar to update completion icons
            updateSidebar();
        }
    } catch (error) {
        console.error('Failed to update progress:', error);
    }
};

const checkLessonCompleted = (lessonId) => {
    return LessonState.lessons.find(l => l._id === lessonId)?.completed || false;
};

const trackLessonView = (lessonId) => {
    // Track view for analytics
    console.log('Viewing lesson:', lessonId);
};

// ===== VIDEO PROGRESS =====
const initVideoEvents = () => {
    if (!LessonElements.videoPlayer) return;
    
    if (LessonElements.videoPlayer.tagName === 'VIDEO') {
        // Save progress every 10 seconds
        LessonElements.videoPlayer.addEventListener('timeupdate', 
            Debouncer.debounce(() => {
                const lesson = LessonState.lessons[LessonState.currentLessonIndex];
                if (lesson) {
                    LessonState.videoProgress[lesson._id] = LessonElements.videoPlayer.currentTime;
                    saveVideoProgress();
                }
            }, 10000)
        );
        
        // Mark as completed when video ends
        LessonElements.videoPlayer.addEventListener('ended', () => {
            if (confirm('Lesson completed! Would you like to mark it as complete?')) {
                markLessonComplete();
            }
        });
        
        // Autoplay next lesson
        LessonElements.videoPlayer.addEventListener('ended', () => {
            if (LessonState.autoPlay && LessonState.currentLessonIndex < LessonState.lessons.length - 1) {
                setTimeout(() => {
                    navigateToLesson(LessonState.currentLessonIndex + 1);
                }, 3000);
            }
        });
    }
};

const saveVideoProgress = () => {
    try {
        localStorage.setItem(
            `video_progress_${LessonState.courseId}`,
            JSON.stringify(LessonState.videoProgress)
        );
    } catch (error) {
        console.error('Failed to save video progress:', error);
    }
};

const loadVideoProgress = () => {
    try {
        const saved = localStorage.getItem(`video_progress_${LessonState.courseId}`);
        if (saved) {
            LessonState.videoProgress = JSON.parse(saved);
        }
    } catch (error) {
        console.error('Failed to load video progress:', error);
    }
};

// ===== NOTES =====
const loadSavedNotes = () => {
    try {
        const saved = localStorage.getItem(`notes_${LessonState.courseId}`);
        if (saved) {
            LessonState.notes = JSON.parse(saved);
        }
    } catch (error) {
        console.error('Failed to load notes:', error);
    }
};

const saveNotes = () => {
    const lesson = LessonState.lessons[LessonState.currentLessonIndex];
    if (!lesson || !LessonElements.notesTextarea) return;
    
    LessonState.notes[lesson._id] = LessonElements.notesTextarea.value;
    
    try {
        localStorage.setItem(
            `notes_${LessonState.courseId}`,
            JSON.stringify(LessonState.notes)
        );
        UI.showNotification('Notes saved!', 'success', 2000);
    } catch (error) {
        console.error('Failed to save notes:', error);
    }
};

// ===== NAVIGATION =====
const updateNavigation = () => {
    if (LessonElements.prevBtn) {
        LessonElements.prevBtn.disabled = LessonState.currentLessonIndex === 0;
    }
    
    if (LessonElements.nextBtn) {
        LessonElements.nextBtn.disabled = 
            LessonState.currentLessonIndex === LessonState.lessons.length - 1;
    }
    
    // Update mark complete button
    if (LessonElements.markCompleteBtn) {
        const currentLesson = LessonState.lessons[LessonState.currentLessonIndex];
        const isCompleted = currentLesson?.completed;
        
        LessonElements.markCompleteBtn.innerHTML = isCompleted ?
            '<i class="fas fa-check-circle"></i> Completed' :
            '<i class="fas fa-check-circle"></i> Mark as Completed';
        
        LessonElements.markCompleteBtn.classList.toggle('btn-success', isCompleted);
    }
};

const navigateToLesson = (index) => {
    if (index >= 0 && index < LessonState.lessons.length) {
        // Save current video progress before navigating
        saveVideoProgress();
        
        LessonState.currentLessonIndex = index;
        updateSidebar();
        updateLessonContent();
        updateNavigation();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

window.navigateLesson = (direction) => {
    if (direction === 'prev' && LessonState.currentLessonIndex > 0) {
        navigateToLesson(LessonState.currentLessonIndex - 1);
    } else if (direction === 'next' && 
               LessonState.currentLessonIndex < LessonState.lessons.length - 1) {
        navigateToLesson(LessonState.currentLessonIndex + 1);
    }
};

// ===== LESSON COMPLETION =====
const markLessonComplete = async () => {
    const lesson = LessonState.lessons[LessonState.currentLessonIndex];
    
    if (!lesson) return;
    
    try {
        LessonElements.markCompleteBtn.disabled = true;
        LessonElements.markCompleteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        
        await API.post(`/courses/${LessonState.courseId}/lessons/${lesson._id}/complete`);
        
        lesson.completed = true;
        await updateProgress();
        
        UI.showNotification('Lesson marked as complete!', 'success');
        
        // Auto-navigate to next lesson
        if (LessonState.currentLessonIndex < LessonState.lessons.length - 1) {
            setTimeout(() => {
                navigateToLesson(LessonState.currentLessonIndex + 1);
            }, 2000);
        }
        
    } catch (error) {
        UI.showNotification('Failed to mark lesson as complete', 'error');
    } finally {
        LessonElements.markCompleteBtn.disabled = false;
        updateNavigation();
    }
};

window.markLessonComplete = markLessonComplete;

// ===== KEYBOARD SHORTCUTS =====
const initKeyboardShortcuts = () => {
    document.addEventListener('keydown', (e) => {
        // Don't trigger if user is typing in an input
        if (e.target.matches('input, textarea, select')) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    navigateLesson('prev');
                }
                break;
            case 'ArrowRight':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    navigateLesson('next');
                }
                break;
            case ' ':
                // Toggle play/pause for video
                if (LessonElements.videoPlayer?.tagName === 'VIDEO') {
                    e.preventDefault();
                    if (LessonElements.videoPlayer.paused) {
                        LessonElements.videoPlayer.play();
                    } else {
                        LessonElements.videoPlayer.pause();
                    }
                }
                break;
            case 'm':
            case 'M':
                // Mark complete
                e.preventDefault();
                markLessonComplete();
                break;
            case 's':
            case 'S':
                // Save notes
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    saveNotes();
                }
                break;
        }
    });
};

// ===== EVENT LISTENERS =====
const initEventListeners = () => {
    if (LessonElements.prevBtn) {
        LessonElements.prevBtn.addEventListener('click', () => navigateLesson('prev'));
    }
    
    if (LessonElements.nextBtn) {
        LessonElements.nextBtn.addEventListener('click', () => navigateLesson('next'));
    }
    
    if (LessonElements.markCompleteBtn) {
        LessonElements.markCompleteBtn.addEventListener('click', markLessonComplete);
    }
    
    if (LessonElements.notesTextarea) {
        // Auto-save when user stops typing
        LessonElements.notesTextarea.addEventListener('input', 
            Debouncer.debounce(saveNotes, 2000)
        );
    }
    
    initKeyboardShortcuts();
    
    // Handle browser back/forward
    window.addEventListener('popstate', () => {
        const params = new URLSearchParams(window.location.search);
        const lessonId = params.get('lesson');
        
        if (lessonId && lessonId !== LessonState.lessonId) {
            const index = LessonState.lessons.findIndex(l => l._id === lessonId);
            if (index !== -1) {
                navigateToLesson(index);
            }
        }
    });
};

// ===== UTILITY FUNCTIONS =====
const showLoading = () => {
    // Show loading skeletons
    if (LessonElements.lessonList) {
        LessonElements.lessonList.innerHTML = Array(3).fill(0).map(() => `
            <li class="loading-skeleton" style="height: 50px; margin-bottom: 4px;"></li>
        `).join('');
    }
};

const handleLessonError = (error) => {
    console.error('Lesson error:', error);
    
    if (!LessonElements.container) return;
    
    let message = 'Failed to load lesson. Please try again.';
    
    if (error instanceof APIError) {
        if (error.status === 403) {
            message = 'You are not enrolled in this course.';
        } else if (error.status === 404) {
            message = 'Lesson not found.';
        }
    }
    
    LessonElements.container.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1;">
            <i class="fas fa-exclamation-circle" style="color: #ef4444;"></i>
            <h3>Something went wrong</h3>
            <p>${message}</p>
            <a href="dashboard.html" class="btn btn-primary">
                <i class="fas fa-arrow-left"></i> Back to Dashboard
            </a>
        </div>
    `;
};

const escapeHtml = (text) => {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
};

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    initLesson();
});

// ===== EXPORT =====
window.initLesson = initLesson;
window.saveNotes = saveNotes;
window.navigateLesson = navigateLesson;
window.markLessonComplete = markLessonComplete;