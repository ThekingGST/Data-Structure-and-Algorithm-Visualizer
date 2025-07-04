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

// Navigation
function navigateToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`[href="#${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
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

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
    initHeroAnimation();
    
    // Smooth scrolling for navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // If it's an internal link (starts with #), handle smooth scrolling
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                navigateToSection(targetId);
            }
            // If it's an external link or page, let it navigate normally
        });
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
        }
    });
}, observerOptions);

// Observe all cards for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.topic-card').forEach(card => {
        card.style.animationPlayState = 'paused';
        observer.observe(card);
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