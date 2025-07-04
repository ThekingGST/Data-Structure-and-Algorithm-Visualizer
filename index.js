// Global state
let currentTheme = 'light';

// Theme management
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    const themeIcon = document.querySelector('.theme-toggle i');
    themeIcon.className = currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    
    // Save theme preference
    localStorage.setItem('theme', currentTheme);
}

// Load saved theme
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    currentTheme = savedTheme;
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    const themeIcon = document.querySelector('.theme-toggle i');
    themeIcon.className = currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Navigation functions
function navigateToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        updateActiveNavLink(`#${sectionId}`);
    }
}

function updateActiveNavLink(activeHref) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`[href="${activeHref}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

function handleNavigation(href) {
    if (href.startsWith('#')) {
        // Internal section navigation
        const sectionId = href.substring(1);
        navigateToSection(sectionId);
    } else if (href.includes('#')) {
        // Cross-page navigation with section
        window.location.href = href;
    } else {
        // Regular page navigation
        window.location.href = href;
    }
}

// Open visualizer with specific algorithm
function openVisualizerWith(algorithm) {
    // Store the selected algorithm in localStorage
    localStorage.setItem('selectedAlgorithm', algorithm);
    // Navigate to visualizer page
    window.location.href = 'visualizer.html';
}

// Hero animation
function initHeroAnimation() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Animate a simple sorting visualization
    const bars = [];
    const numBars = 20;
    const barWidth = canvas.width / numBars;
    
    // Initialize bars with random heights
    for (let i = 0; i < numBars; i++) {
        bars.push({
            x: i * barWidth,
            height: Math.random() * (canvas.height - 50) + 10,
            color: `hsl(${240 + i * 5}, 70%, 60%)`,
            targetHeight: Math.random() * (canvas.height - 50) + 10
        });
    }
    
    let animationFrame = 0;
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw bars with smooth animation
        bars.forEach((bar, index) => {
            // Smoothly animate to target height
            const diff = bar.targetHeight - bar.height;
            bar.height += diff * 0.02;
            
            // Change target occasionally for continuous animation
            if (Math.abs(diff) < 1) {
                bar.targetHeight = Math.random() * (canvas.height - 50) + 10;
            }
            
            ctx.fillStyle = bar.color;
            ctx.fillRect(bar.x + 2, canvas.height - bar.height, barWidth - 4, bar.height);
            
            // Add subtle wave effect
            bar.height += Math.sin(animationFrame * 0.02 + index * 0.5) * 0.5;
        });
        
        animationFrame++;
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Intersection Observer for scroll-based nav updates
function initScrollObserver() {
    const sections = document.querySelectorAll('section[id]');
    
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '-100px 0px -50% 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                if (sectionId === 'home') {
                    updateActiveNavLink('index.html');
                } else {
                    updateActiveNavLink(`#${sectionId}`);
                }
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
    initHeroAnimation();
    initScrollObserver();
    
    // Handle navigation clicks
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            handleNavigation(href);
        });
    });
    
    // Set active nav link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    if (currentPage === 'index.html' || currentPage === '') {
        updateActiveNavLink('index.html');
    }
});

// Animation observer for cards
const cardObserverOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
        }
    });
}, cardObserverOptions);

// Observe all cards for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.topic-card').forEach(card => {
        card.style.animationPlayState = 'paused';
        cardObserver.observe(card);
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + T to toggle theme
    if ((e.ctrlKey || e.metaKey) && e.code === 'KeyT') {
        e.preventDefault();
        toggleTheme();
    }
});