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
    `
};

const windowTitles = {
    about: 'About Me',
    projects: 'My Projects',
    resume: 'Resume',
    contact: 'Contact',
    gallery: 'Gallery'
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initDesktopIcons();
    initStartMenu();
    initClock();
});

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