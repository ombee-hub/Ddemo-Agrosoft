// ===== Mobile Navigation =====
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('.nav');
const submenuParents = document.querySelectorAll('.has-submenu');

hamburger.addEventListener('click', () => {
    const isActive = hamburger.classList.toggle('active');
    nav.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isActive);
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    }
});

// Mobile/Tablet submenu toggle
submenuParents.forEach(parent => {
    const link = parent.querySelector(':scope > a');
    link.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            e.stopImmediatePropagation();
            // Close other open submenus
            submenuParents.forEach(other => {
                if (other !== parent) other.classList.remove('open');
            });
            parent.classList.toggle('open');
        }
    });
});

// ===== Cookie Banner =====
const cookieBanner = document.getElementById('cookieBanner');
const cookieAccept = document.getElementById('cookieAccept');
const cookieDecline = document.getElementById('cookieDecline');

// Check if user already made a choice
if (localStorage.getItem('cookieConsent')) {
    cookieBanner.classList.add('hidden');
}

cookieAccept.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'accepted');
    cookieBanner.classList.add('hidden');
});

cookieDecline.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'declined');
    cookieBanner.classList.add('hidden');
});

// ===== Accessibility Panel =====
const a11yBtn = document.getElementById('accessibilityBtn');
const a11yPanel = document.getElementById('accessibilityPanel');
const a11yClose = document.getElementById('a11yClose');
const a11yOptions = document.querySelectorAll('.a11y-option');

a11yBtn.addEventListener('click', () => {
    a11yPanel.classList.toggle('active');
});

a11yClose.addEventListener('click', () => {
    a11yPanel.classList.remove('active');
});

// Close panel when clicking outside
document.addEventListener('click', (e) => {
    if (!a11yPanel.contains(e.target) && !a11yBtn.contains(e.target)) {
        a11yPanel.classList.remove('active');
    }
});

// Close panel with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && a11yPanel.classList.contains('active')) {
        a11yPanel.classList.remove('active');
        a11yBtn.focus();
    }
});

// Accessibility class map
const classMap = {
    'high-contrast': 'high-contrast',
    'large-text': 'large-text',
    'grayscale': 'grayscale',
    'highlight-links': 'highlight-links',
    'big-cursor': 'big-cursor',
    'line-height': 'line-height-plus',
    'hide-images': 'hide-images',
    'disable-animations': 'disable-animations',
    'dyslexia-font': 'dyslexia-font',
    'text-spacing': 'text-spacing',
    'color-saturation': 'color-saturation',
    'image-captions': 'image-captions',
    'text-align': 'text-align-left',
    'dark-mode': 'dark-mode',
};

// Reverse map for loading settings
const classToAction = {};
Object.entries(classMap).forEach(([action, cls]) => {
    classToAction[cls] = action;
});

// Conflicting modes — only one filter at a time
const filterModes = ['high-contrast', 'grayscale', 'color-saturation'];

// Accessibility actions
a11yOptions.forEach(option => {
    option.addEventListener('click', () => {
        const action = option.dataset.action;

        if (action === 'reset') {
            // Remove all accessibility classes
            Object.values(classMap).forEach(cls => document.body.classList.remove(cls));
            a11yOptions.forEach(opt => opt.classList.remove('active'));
            localStorage.removeItem('a11ySettings');
            return;
        }

        const className = classMap[action];
        if (!className) return;

        // Handle conflicting filter modes
        if (filterModes.includes(action)) {
            filterModes.forEach(mode => {
                if (mode !== action) {
                    document.body.classList.remove(classMap[mode]);
                    const otherBtn = document.querySelector(`.a11y-option[data-action="${mode}"]`);
                    if (otherBtn) otherBtn.classList.remove('active');
                }
            });
        }

        option.classList.toggle('active');
        document.body.classList.toggle(className);

        // Load dyslexia font dynamically
        if (action === 'dyslexia-font' && document.body.classList.contains('dyslexia-font')) {
            loadDyslexiaFont();
        }

        // Save settings
        saveA11ySettings();
    });
});

function loadDyslexiaFont() {
    if (!document.getElementById('dyslexia-font-link')) {
        const link = document.createElement('link');
        link.id = 'dyslexia-font-link';
        link.rel = 'stylesheet';
        link.href = 'https://fonts.cdnfonts.com/css/opendyslexic';
        document.head.appendChild(link);
    }
}

function saveA11ySettings() {
    const activeClasses = Object.values(classMap).filter(cls => document.body.classList.contains(cls));
    localStorage.setItem('a11ySettings', JSON.stringify(activeClasses));
}

function loadA11ySettings() {
    const saved = localStorage.getItem('a11ySettings');
    if (saved) {
        try {
            const classes = JSON.parse(saved);
            classes.forEach(cls => {
                document.body.classList.add(cls);
                // Load dyslexia font if needed
                if (cls === 'dyslexia-font') loadDyslexiaFont();
            });

            // Update button active states
            a11yOptions.forEach(option => {
                const action = option.dataset.action;
                const expectedClass = classMap[action];
                if (expectedClass && classes.includes(expectedClass)) {
                    option.classList.add('active');
                }
            });
        } catch (e) {
            localStorage.removeItem('a11ySettings');
        }
    }
}

loadA11ySettings();

// ===== Smooth scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Close mobile menu if open
            hamburger.classList.remove('active');
            nav.classList.remove('active');
        }
    });
});

// ===== Header scroll effect =====
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    const scrollTop = window.pageYOffset;

    if (scrollTop > 100) {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.4)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
    }

    lastScroll = scrollTop;
});
