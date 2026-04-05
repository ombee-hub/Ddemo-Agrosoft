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

// Mobile submenu toggle
submenuParents.forEach(parent => {
    parent.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            const link = parent.querySelector('a');
            if (e.target === link) {
                e.preventDefault();
                parent.classList.toggle('open');
            }
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

// Accessibility actions
a11yOptions.forEach(option => {
    option.addEventListener('click', () => {
        const action = option.dataset.action;

        if (action === 'reset') {
            document.body.className = '';
            a11yOptions.forEach(opt => opt.classList.remove('active'));
            localStorage.removeItem('a11ySettings');
            return;
        }

        const classMap = {
            'high-contrast': 'high-contrast',
            'large-text': 'large-text',
            'grayscale': 'grayscale',
            'highlight-links': 'highlight-links',
            'big-cursor': 'big-cursor',
            'line-height': 'line-height-plus',
        };

        const className = classMap[action];
        if (!className) return;

        option.classList.toggle('active');
        document.body.classList.toggle(className);

        // Save settings
        saveA11ySettings();
    });
});

function saveA11ySettings() {
    const classes = Array.from(document.body.classList);
    localStorage.setItem('a11ySettings', JSON.stringify(classes));
}

function loadA11ySettings() {
    const saved = localStorage.getItem('a11ySettings');
    if (saved) {
        const classes = JSON.parse(saved);
        classes.forEach(cls => document.body.classList.add(cls));

        // Update button states
        const classToAction = {
            'high-contrast': 'high-contrast',
            'large-text': 'large-text',
            'grayscale': 'grayscale',
            'highlight-links': 'highlight-links',
            'big-cursor': 'big-cursor',
            'line-height-plus': 'line-height',
        };

        a11yOptions.forEach(option => {
            const action = option.dataset.action;
            const expectedClass = Object.entries(classToAction).find(([, a]) => a === action);
            if (expectedClass && classes.includes(expectedClass[0])) {
                option.classList.add('active');
            }
        });
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
