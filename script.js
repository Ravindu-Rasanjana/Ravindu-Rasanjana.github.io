// Window management
let windows = [];
let activeWindowId = null;
let windowCounter = 0;
let isDragging = false;
let isResizing = false;
let dragTarget = null;
let resizeTarget = null;
let dragOffset = { x: 0, y: 0 };
let resizeStart = { x: 0, y: 0, width: 0, height: 0 };

// Window content templates
const windowContent = {
    about: `
        <div class="content-container">
            <h2>About Me</h2>
            <p>Hello! I'm a passionate developer and designer with expertise in creating modern web applications. I specialize in React, TypeScript, and creating beautiful user experiences.</p>
            <p>With over 5 years of experience in the industry, I've worked on various projects ranging from e-commerce platforms to complex enterprise applications.</p>
        </div>
    `,
    projects: `
        <div class="content-container">
            <h2>My Projects</h2>
            <div class="project-card">
                <h3>E-Commerce Platform</h3>
                <p>A full-stack online shopping solution with payment integration</p>
            </div>
            <div class="project-card">
                <h3>Task Management App</h3>
                <p>Collaborative project management tool with real-time updates</p>
            </div>
            <div class="project-card">
                <h3>Portfolio Website</h3>
                <p>Custom portfolio sites for creative professionals</p>
            </div>
        </div>
    `,
    resume: `
        <div class="content-container">
            <h2>Resume</h2>
            <div class="resume-section">
                <h3>Experience</h3>
                <div class="resume-item">
                    <div class="title">Senior Developer - Tech Corp</div>
                    <div class="subtitle">2020 - Present</div>
                </div>
                <div class="resume-item">
                    <div class="title">Full Stack Developer - StartUp Inc</div>
                    <div class="subtitle">2018 - 2020</div>
                </div>
            </div>
            <div class="resume-section">
                <h3>Skills</h3>
                <p>React, TypeScript, Node.js, Python, UI/UX Design</p>
            </div>
        </div>
    `,
    contact: `
        <div class="content-container">
            <h2>Contact Me</h2>
            <div class="contact-item">
                <label>Email:</label>
                <p>hello@example.com</p>
            </div>
            <div class="contact-item">
                <label>LinkedIn:</label>
                <p>linkedin.com/in/yourprofile</p>
            </div>
            <div class="contact-item">
                <label>GitHub:</label>
                <p>github.com/yourprofile</p>
            </div>
        </div>
    `,
    gallery: `
        <div class="content-container">
            <h2>Gallery</h2>
            <div class="gallery-grid">
                <div class="gallery-item">Project 1</div>
                <div class="gallery-item">Project 2</div>
                <div class="gallery-item">Project 3</div>
                <div class="gallery-item">Project 4</div>
            </div>
        </div>
    `,
    pdf: `
        <div class="pdf-viewer">
            <!-- <div class="pdf-toolbar">
                <button onclick="window.pdfZoomOut()">-</button>
                <button onclick="window.pdfZoomIn()">+</button>
                <span style="margin-left: 8px; font-size: 12px;">Zoom</span>
            </div> -->
            <div class="pdf-content" id="pdf-content">
                <iframe src="resume.pdf" style="width: 100%; height: 100%;"></iframe>
            </div>
        </div>
    `,
    media: `
        <div class="media-player">
            <div class="media-display" id="media-display">
                <div class="media-placeholder">
                    <p style="font-size: 16px; margin-bottom: 8px; color: #666;">🖼️ Windows Picture and Fax Viewer</p>
                    <p style="color: #666;">Click below to load an image or video</p>
                    <input type="file" id="media-file-input" class="file-input-hidden" accept="image/*,video/*">
                    <button onclick="document.getElementById('media-file-input').click()">Open File</button>
                </div>
            </div>
            <div class="media-controls">
                <button class="media-btn" id="btn-prev" title="Previous">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                    </svg>
                </button>
                <button class="media-btn" id="btn-play" onclick="window.mediaTogglePlay()" title="Play">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                </button>
                <button class="media-btn" id="btn-next" title="Next">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
                    </svg>
                </button>
                <div class="media-separator"></div>
                <button class="media-btn" id="btn-rotate-left" onclick="window.mediaRotateLeft()" title="Rotate Left">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7.11 8.53L5.7 7.11C4.8 8.27 4.24 9.61 4.07 11h2.02c.14-.87.49-1.72 1.02-2.47zM6.09 13H4.07c.17 1.39.72 2.73 1.62 3.89l1.41-1.42c-.52-.75-.87-1.59-1.01-2.47zm1.01 5.32c1.16.9 2.51 1.44 3.9 1.61V17.9c-.87-.15-1.71-.49-2.46-1.03L7.1 18.32zM13 4.07V1L8.45 5.55 13 10V6.09c2.84.48 5 2.94 5 5.91s-2.16 5.43-5 5.91v2.02c3.95-.49 7-3.85 7-7.93s-3.05-7.44-7-7.93z"/>
                    </svg>
                </button>
                <button class="media-btn" id="btn-rotate-right" onclick="window.mediaRotateRight()" title="Rotate Right">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M15.55 5.55L11 1v3.07C7.06 4.56 4 7.92 4 12s3.05 7.44 7 7.93v-2.02c-2.84-.48-5-2.94-5-5.91s2.16-5.43 5-5.91V10l4.55-4.45zM19.93 11c-.17-1.39-.72-2.73-1.62-3.89l-1.42 1.42c.54.75.88 1.6 1.02 2.47h2.02zM13 17.9v2.02c1.39-.17 2.74-.71 3.9-1.61l-1.44-1.44c-.75.54-1.59.89-2.46 1.03zm3.89-2.42l1.42 1.41c.9-1.16 1.45-2.5 1.62-3.89h-2.02c-.14.87-.48 1.72-1.02 2.48z"/>
                    </svg>
                </button>
                <div class="media-separator"></div>
                <button class="media-btn" id="btn-zoom-in" onclick="window.mediaZoomIn()" title="Zoom In">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                        <path d="M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z"/>
                    </svg>
                </button>
                <button class="media-btn" id="btn-zoom-out" onclick="window.mediaZoomOut()" title="Zoom Out">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zM7 9h5v1H7z"/>
                    </svg>
                </button>
                <div class="media-separator"></div>
                <button class="media-btn" id="btn-actual-size" onclick="window.mediaActualSize()" title="Actual Size">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z"/>
                    </svg>
                </button>
                <button class="media-btn" id="btn-best-fit" onclick="window.mediaBestFit()" title="Best Fit">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 5v4h2V5h4V3H5c-1.1 0-2 .9-2 2zm2 10H3v4c0 1.1.9 2 2 2h4v-2H5v-4zm14 4h-4v2h4c1.1 0 2-.9 2-2v-4h-2v4zm0-16h-4v2h4v4h2V5c0-1.1-.9-2-2-2z"/>
                    </svg>
                </button>
                <div class="media-separator"></div>
                <button class="media-btn" id="btn-delete" onclick="window.mediaDelete()" title="Delete">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                </button>
                <div class="media-separator"></div>
                <button class="media-btn" id="btn-print" title="Print">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/>
                    </svg>
                </button>
                <button class="media-btn" id="btn-copy" title="Copy">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                    </svg>
                </button>
                <button class="media-btn" id="btn-help" title="Help">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
                    </svg>
                </button>
            </div>
        </div>
    `
};

const windowTitles = {
    about: 'About Me',
    projects: 'My Projects',
    resume: 'Resume',
    contact: 'Contact',
    gallery: 'Gallery',
    pdf: 'PDF Reader - My Resume.pdf',
    media: 'Windows Media Player'
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initLoginScreen();
    initDesktopIcons();
    initStartMenu();
    initClock();
});

// Login Screen
function initLoginScreen() {
    const userProfile = document.getElementById('user-profile');
    const loginScreen = document.getElementById('login-screen');
    const desktop = document.getElementById('desktop');
    
    if (userProfile) {
        userProfile.addEventListener('click', () => {
            // Play startup sound
            playStartupSound();
            
            // Fade out login screen
            loginScreen.style.transition = 'opacity 0.5s';
            loginScreen.style.opacity = '0';
            
            setTimeout(() => {
                loginScreen.style.display = 'none';
                desktop.classList.remove('hidden');
            }, 500);
        });
    }
}

// Play Windows XP startup sound
function playStartupSound() {
    const audio = document.getElementById('startup-sound');
    if (audio) {
        audio.volume = 0.5;
        audio.play().catch(err => {
            console.log('Audio play failed:', err);
        });
    }
}

// Desktop icons
function initDesktopIcons() {
    const icons = document.querySelectorAll('.desktop-icon');
    icons.forEach(icon => {
        icon.addEventListener('dblclick', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const windowType = icon.getAttribute('data-window');
            openWindow(windowType);
        });
    });
}

// Start menu
function initStartMenu() {
    const startButton = document.getElementById('start-button');
    const startMenu = document.getElementById('start-menu');
    
    startButton.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleStartMenu();
    });

    const startMenuItems = document.querySelectorAll('.start-menu-item');
    startMenuItems.forEach(item => {
        item.addEventListener('click', () => {
            const windowType = item.getAttribute('data-window');
            openWindow(windowType);
            closeStartMenu();
        });
    });

    document.addEventListener('click', (e) => {
        if (!startMenu.contains(e.target) && !startButton.contains(e.target)) {
            closeStartMenu();
        }
    });
}

function toggleStartMenu() {
    const startMenu = document.getElementById('start-menu');
    const startButton = document.getElementById('start-button');
    startMenu.classList.toggle('hidden');
    startButton.classList.toggle('active');
}

function closeStartMenu() {
    const startMenu = document.getElementById('start-menu');
    const startButton = document.getElementById('start-button');
    startMenu.classList.add('hidden');
    startButton.classList.remove('active');
}

// Clock
function initClock() {
    updateClock();
    setInterval(updateClock, 1000);
}

function updateClock() {
    const clock = document.getElementById('clock');
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    clock.textContent = `${hours}:${minutes}`;
}

// Window management
function openWindow(type) {
    const id = ++windowCounter;
    const window = {
        id,
        type,
        title: windowTitles[type],
        x: 100 + windows.length * 30,
        y: 80 + windows.length * 30,
        width: 600,
        height: 400,
        minimized: false,
        maximized: false
    };

    windows.push(window);
    renderWindow(window);
    createTaskbarButton(window);
    setActiveWindow(id);
}

function renderWindow(window) {
    const container = document.getElementById('windows-container');
    const windowEl = document.createElement('div');
    windowEl.className = 'window';
    windowEl.id = `window-${window.id}`;
    windowEl.style.left = `${window.x}px`;
    windowEl.style.top = `${window.y}px`;
    windowEl.style.width = `${window.width}px`;
    windowEl.style.height = `${window.height}px`;
    windowEl.style.zIndex = 100;

    windowEl.innerHTML = `
        <div class="window-titlebar">
            <div class="window-title">
                <div class="window-icon"></div>
                <span>${window.title}</span>
            </div>
            <div class="window-controls">
                <button class="window-control-btn minimize">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </button>
                <button class="window-control-btn maximize">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    </svg>
                </button>
                <button class="window-control-btn close">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        </div>
        <div class="window-content">
            ${windowContent[window.type]}
        </div>
        <div class="window-resize-handle"></div>
    `;

    container.appendChild(windowEl);

    // Add event listeners
    const titlebar = windowEl.querySelector('.window-titlebar');
    titlebar.addEventListener('mousedown', (e) => startDragging(e, window.id));

    const resizeHandle = windowEl.querySelector('.window-resize-handle');
    resizeHandle.addEventListener('mousedown', (e) => startResizing(e, window.id));

    const minimizeBtn = windowEl.querySelector('.minimize');
    minimizeBtn.addEventListener('click', () => minimizeWindow(window.id));

    const maximizeBtn = windowEl.querySelector('.maximize');
    maximizeBtn.addEventListener('click', () => toggleMaximize(window.id));

    const closeBtn = windowEl.querySelector('.close');
    closeBtn.addEventListener('click', () => closeWindow(window.id));

    windowEl.addEventListener('mousedown', () => setActiveWindow(window.id));
    
    // Initialize PDF reader if it's a PDF window
    if (window.type === 'pdf') {
        // PDF will load automatically from resume.pdf
        setTimeout(() => {
            const iframe = document.querySelector('#pdf-content iframe');
            if (iframe) {
                iframe.style.transform = `scale(${pdfZoom})`;
            }
        }, 100);
    }
    
    // Initialize media player if it's a media window
    if (window.type === 'media') {
        initMediaPlayer();
    }
}

function createTaskbarButton(window) {
    const taskbar = document.getElementById('taskbar-windows');
    const button = document.createElement('button');
    button.className = 'taskbar-window';
    button.id = `taskbar-${window.id}`;
    button.innerHTML = `
        <div class="taskbar-window-icon"></div>
        <span>${window.title}</span>
    `;
    button.addEventListener('click', () => {
        const win = windows.find(w => w.id === window.id);
        if (win.minimized) {
            restoreWindow(window.id);
        } else if (activeWindowId === window.id) {
            minimizeWindow(window.id);
        } else {
            setActiveWindow(window.id);
        }
    });
    taskbar.appendChild(button);
}

function setActiveWindow(id) {
    activeWindowId = id;
    
    // Update window classes
    document.querySelectorAll('.window').forEach(win => {
        win.classList.remove('active');
        win.style.zIndex = 100;
    });
    
    const activeWin = document.getElementById(`window-${id}`);
    if (activeWin) {
        activeWin.classList.add('active');
        activeWin.style.zIndex = 1000;
    }

    // Update taskbar buttons
    document.querySelectorAll('.taskbar-window').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeBtn = document.getElementById(`taskbar-${id}`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

function minimizeWindow(id) {
    const window = windows.find(w => w.id === id);
    window.minimized = true;
    document.getElementById(`window-${id}`).classList.add('minimized');
}

function restoreWindow(id) {
    const window = windows.find(w => w.id === id);
    window.minimized = false;
    window.maximized = false;
    const windowEl = document.getElementById(`window-${id}`);
    windowEl.classList.remove('minimized');
    windowEl.classList.remove('maximized');
    setActiveWindow(id);
}

function toggleMaximize(id) {
    const window = windows.find(w => w.id === id);
    window.maximized = !window.maximized;
    const windowEl = document.getElementById(`window-${id}`);
    
    if (window.maximized) {
        windowEl.classList.add('maximized');
    } else {
        windowEl.classList.remove('maximized');
    }
}

function closeWindow(id) {
    windows = windows.filter(w => w.id !== id);
    const windowEl = document.getElementById(`window-${id}`);
    const taskbarBtn = document.getElementById(`taskbar-${id}`);
    
    if (windowEl) windowEl.remove();
    if (taskbarBtn) taskbarBtn.remove();
    
    if (activeWindowId === id) {
        activeWindowId = windows.length > 0 ? windows[windows.length - 1].id : null;
        if (activeWindowId) setActiveWindow(activeWindowId);
    }
}

// Dragging
function startDragging(e, id) {
    const window = windows.find(w => w.id === id);
    if (window.maximized) return;

    isDragging = true;
    dragTarget = id;
    
    const windowEl = document.getElementById(`window-${id}`);
    const rect = windowEl.getBoundingClientRect();
    dragOffset = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };

    setActiveWindow(id);
}

// Resizing
function startResizing(e, id) {
    e.stopPropagation();
    const window = windows.find(w => w.id === id);
    if (window.maximized) return;

    isResizing = true;
    resizeTarget = id;
    
    const windowEl = document.getElementById(`window-${id}`);
    const rect = windowEl.getBoundingClientRect();
    
    resizeStart = {
        x: e.clientX,
        y: e.clientY,
        width: rect.width,
        height: rect.height
    };

    setActiveWindow(id);
}

document.addEventListener('mousemove', (e) => {
    if (isDragging && dragTarget) {
        const window = windows.find(w => w.id === dragTarget);
        if (window.maximized) return;

        const newX = e.clientX - dragOffset.x;
        const newY = Math.max(0, e.clientY - dragOffset.y);

        window.x = newX;
        window.y = newY;

        const windowEl = document.getElementById(`window-${dragTarget}`);
        windowEl.style.left = `${newX}px`;
        windowEl.style.top = `${newY}px`;
    }
    
    if (isResizing && resizeTarget) {
        const window = windows.find(w => w.id === resizeTarget);
        if (window.maximized) return;

        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;

        const newWidth = Math.max(300, resizeStart.width + deltaX);
        const newHeight = Math.max(200, resizeStart.height + deltaY);

        window.width = newWidth;
        window.height = newHeight;

        const windowEl = document.getElementById(`window-${resizeTarget}`);
        windowEl.style.width = `${newWidth}px`;
        windowEl.style.height = `${newHeight}px`;
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    isResizing = false;
    dragTarget = null;
    resizeTarget = null;
});

// PDF Reader Functions
let pdfZoom = 1;

window.pdfZoomIn = function() {
    pdfZoom += 0.1;
    const iframe = document.querySelector('#pdf-content iframe');
    if (iframe) {
        iframe.style.transform = `scale(${pdfZoom})`;
    }
};

window.pdfZoomOut = function() {
    if (pdfZoom > 0.5) {
        pdfZoom -= 0.1;
        const iframe = document.querySelector('#pdf-content iframe');
        if (iframe) {
            iframe.style.transform = `scale(${pdfZoom})`;
        }
    }
};

// Media Player Functions
let currentMedia = null;
let isPlaying = false;
let mediaRotation = 0;
let mediaZoom = 1;

function initMediaPlayer() {
    const fileInput = document.getElementById('media-file-input');
    if (fileInput && !fileInput.hasAttribute('data-initialized')) {
        fileInput.setAttribute('data-initialized', 'true');
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                loadMediaFile(file);
            }
        });
    }
}

function loadMediaFile(file) {
    const mediaDisplay = document.getElementById('media-display');
    const fileURL = URL.createObjectURL(file);
    
    mediaRotation = 0;
    mediaZoom = 1;
    
    if (file.type.startsWith('image/')) {
        mediaDisplay.innerHTML = `<img id="media-element" src="${fileURL}" alt="Image" style="transform: rotate(${mediaRotation}deg) scale(${mediaZoom});">`;
        currentMedia = document.getElementById('media-element');
    } else if (file.type.startsWith('video/')) {
        mediaDisplay.innerHTML = `<video id="media-element" src="${fileURL}" style="max-width: 100%; max-height: 100%;"></video>`;
        currentMedia = document.getElementById('media-element');
        setupMediaListeners();
    }
}

function setupMediaListeners() {
    if (currentMedia && currentMedia.tagName === 'VIDEO') {
        currentMedia.addEventListener('ended', () => {
            isPlaying = false;
            updatePlayButton();
        });
    }
}

function updatePlayButton() {
    const playBtn = document.getElementById('btn-play');
    if (playBtn) {
        if (isPlaying) {
            playBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
            `;
        } else {
            playBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                </svg>
            `;
        }
    }
}

window.mediaTogglePlay = function() {
    if (!currentMedia || currentMedia.tagName !== 'VIDEO') return;
    
    if (isPlaying) {
        currentMedia.pause();
        isPlaying = false;
    } else {
        currentMedia.play();
        isPlaying = true;
    }
    updatePlayButton();
};

window.mediaRotateLeft = function() {
    if (!currentMedia || currentMedia.tagName !== 'IMG') return;
    mediaRotation -= 90;
    currentMedia.style.transform = `rotate(${mediaRotation}deg) scale(${mediaZoom})`;
};

window.mediaRotateRight = function() {
    if (!currentMedia || currentMedia.tagName !== 'IMG') return;
    mediaRotation += 90;
    currentMedia.style.transform = `rotate(${mediaRotation}deg) scale(${mediaZoom})`;
};

window.mediaZoomIn = function() {
    if (!currentMedia || currentMedia.tagName !== 'IMG') return;
    mediaZoom += 0.2;
    currentMedia.style.transform = `rotate(${mediaRotation}deg) scale(${mediaZoom})`;
};

window.mediaZoomOut = function() {
    if (!currentMedia || currentMedia.tagName !== 'IMG') return;
    if (mediaZoom > 0.2) {
        mediaZoom -= 0.2;
        currentMedia.style.transform = `rotate(${mediaRotation}deg) scale(${mediaZoom})`;
    }
};

window.mediaActualSize = function() {
    if (!currentMedia || currentMedia.tagName !== 'IMG') return;
    mediaZoom = 1;
    currentMedia.style.transform = `rotate(${mediaRotation}deg) scale(${mediaZoom})`;
};

window.mediaBestFit = function() {
    if (!currentMedia || currentMedia.tagName !== 'IMG') return;
    mediaZoom = 1;
    mediaRotation = 0;
    currentMedia.style.transform = `rotate(${mediaRotation}deg) scale(${mediaZoom})`;
};

window.mediaDelete = function() {
    if (!currentMedia) return;
    if (confirm('Are you sure you want to delete this file?')) {
        const mediaDisplay = document.getElementById('media-display');
        mediaDisplay.innerHTML = `
            <div class="media-placeholder">
                <p style="font-size: 16px; margin-bottom: 8px; color: #666;">🖼️ Windows Picture and Fax Viewer</p>
                <p style="color: #666;">Click below to load an image or video</p>
                <input type="file" id="media-file-input" class="file-input-hidden" accept="image/*,video/*">
                <button onclick="document.getElementById('media-file-input').click()">Open File</button>
            </div>
        `;
        currentMedia = null;
        initMediaPlayer();
    }
};