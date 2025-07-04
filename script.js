// Global state
let currentTheme = 'light';
let visualizationState = {
    isRunning: false,
    isPaused: false,
    data: [],
    algorithm: 'bubble-sort',
    speed: 5,
    comparisons: 0,
    swaps: 0
};

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

// Hero animation
function initHeroAnimation() {
    const canvas = document.getElementById('heroCanvas');
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
            color: `hsl(${240 + i * 5}, 70%, 60%)`
        });
    }
    
    let animationFrame = 0;
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw bars
        bars.forEach((bar, index) => {
            ctx.fillStyle = bar.color;
            ctx.fillRect(bar.x + 2, canvas.height - bar.height, barWidth - 4, bar.height);
            
            // Add subtle animation
            bar.height += Math.sin(animationFrame * 0.02 + index * 0.5) * 0.5;
        });
        
        animationFrame++;
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Visualization functions
function startVisualization() {
    const algorithm = document.getElementById('algorithmSelect').value;
    const inputData = document.getElementById('inputData').value;
    const speed = document.getElementById('speedControl').value;
    
    // Parse input data
    const data = inputData.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
    
    if (data.length === 0) {
        alert('Please enter valid numbers separated by commas');
        return;
    }
    
    visualizationState = {
        isRunning: true,
        isPaused: false,
        data: [...data],
        algorithm: algorithm,
        speed: parseInt(speed),
        comparisons: 0,
        swaps: 0
    };
    
    updateVisualizationInfo();
    
    switch (algorithm) {
        case 'bubble-sort':
            animateBubbleSort(data);
            break;
        case 'quick-sort':
            animateQuickSort(data);
            break;
        case 'merge-sort':
            animateMergeSort(data);
            break;
        default:
            animateBubbleSort(data);
    }
}

function pauseVisualization() {
    visualizationState.isPaused = !visualizationState.isPaused;
    const pauseBtn = document.querySelector('[onclick="pauseVisualization()"]');
    pauseBtn.innerHTML = visualizationState.isPaused ? 
        '<i class="fas fa-play"></i> Resume' : 
        '<i class="fas fa-pause"></i> Pause';
}

function resetVisualization() {
    visualizationState.isRunning = false;
    visualizationState.isPaused = false;
    visualizationState.comparisons = 0;
    visualizationState.swaps = 0;
    
    updateVisualizationInfo();
    clearVisualizationCanvas();
    
    const pauseBtn = document.querySelector('[onclick="pauseVisualization()"]');
    pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
}

function updateVisualizationInfo() {
    document.getElementById('comparisons').textContent = visualizationState.comparisons;
    document.getElementById('swaps').textContent = visualizationState.swaps;
}

function clearVisualizationCanvas() {
    const canvas = document.getElementById('visualizationCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawBars(data, highlightIndices = []) {
    const canvas = document.getElementById('visualizationCanvas');
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const barWidth = canvas.width / data.length;
    const maxHeight = canvas.height - 40;
    const maxValue = Math.max(...data);
    
    data.forEach((value, index) => {
        const barHeight = (value / maxValue) * maxHeight;
        const x = index * barWidth;
        const y = canvas.height - barHeight;
        
        // Color based on whether it's highlighted
        if (highlightIndices.includes(index)) {
            ctx.fillStyle = '#f56565'; // Red for comparison
        } else {
            ctx.fillStyle = '#667eea'; // Default blue
        }
        
        ctx.fillRect(x + 2, y, barWidth - 4, barHeight);
        
        // Draw value text
        ctx.fillStyle = '#2d3748';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(value, x + barWidth / 2, canvas.height - 5);
    });
}

async function animateBubbleSort(originalData) {
    const data = [...originalData];
    const n = data.length;
    
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (!visualizationState.isRunning) return;
            
            while (visualizationState.isPaused) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            // Highlight comparison
            drawBars(data, [j, j + 1]);
            visualizationState.comparisons++;
            updateVisualizationInfo();
            
            await new Promise(resolve => setTimeout(resolve, 1000 / visualizationState.speed));
            
            if (data[j] > data[j + 1]) {
                // Swap
                [data[j], data[j + 1]] = [data[j + 1], data[j]];
                visualizationState.swaps++;
                updateVisualizationInfo();
                
                // Show swap
                drawBars(data, [j, j + 1]);
                await new Promise(resolve => setTimeout(resolve, 1000 / visualizationState.speed));
            }
        }
    }
    
    // Final draw without highlights
    drawBars(data);
    visualizationState.isRunning = false;
}

async function animateQuickSort(data) {
    // Simplified quick sort animation
    await animateBubbleSort(data); // For demo purposes
}

async function animateMergeSort(data) {
    // Simplified merge sort animation
    await animateBubbleSort(data); // For demo purposes
}

// Code examples for different languages
const codeExamples = {
    'bubble-sort': {
        python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

# Example usage
numbers = [64, 34, 25, 12, 22, 11, 90]
sorted_numbers = bubble_sort(numbers)
print(sorted_numbers)`,
        javascript: `function bubbleSort(arr) {
    let n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}

// Example usage
const numbers = [64, 34, 25, 12, 22, 11, 90];
const sortedNumbers = bubbleSort(numbers);
console.log(sortedNumbers);`,
        java: `public class BubbleSort {
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }
    
    public static void main(String[] args) {
        int[] numbers = {64, 34, 25, 12, 22, 11, 90};
        bubbleSort(numbers);
        System.out.println(Arrays.toString(numbers));
    }
}`
    }
};

const algorithmExplanations = {
    'bubble-sort': {
        title: 'Bubble Sort',
        description: 'Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they\'re in the wrong order.',
        steps: [
            'Compare adjacent elements',
            'Swap if they\'re in wrong order',
            'Repeat until no swaps needed'
        ],
        timeComplexity: 'O(n²) in worst case, O(n) in best case',
        spaceComplexity: 'O(1)'
    }
};

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
    initHeroAnimation();
    
    // Algorithm selector change
    document.getElementById('algorithmSelect').addEventListener('change', function() {
        const algorithm = this.value;
        updateCodeDisplay(algorithm);
        updateAlgorithmExplanation(algorithm);
        updateTimeComplexity(algorithm);
    });
    
    // Speed control
    document.getElementById('speedControl').addEventListener('input', function() {
        const speed = this.value;
        document.getElementById('speedDisplay').textContent = speed + 'x';
        visualizationState.speed = parseInt(speed);
    });
    
    // Language tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const language = this.dataset.lang;
            const algorithm = document.getElementById('algorithmSelect').value;
            updateCodeDisplay(algorithm, language);
        });
    });
    
    // Topic cards
    document.querySelectorAll('.topic-card').forEach(card => {
        card.addEventListener('click', function() {
            const topic = this.dataset.topic;
            // Navigate to topic detail or show modal
            console.log('Navigate to topic:', topic);
        });
    });
    
    // Learning path cards
    document.querySelectorAll('.learning-card').forEach(card => {
        card.addEventListener('click', function() {
            const path = this.dataset.path;
            // Navigate to learning path
            console.log('Navigate to learning path:', path);
        });
    });
    
    // Practice filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            filterProblems(filter);
        });
    });
    
    // Smooth scrolling for navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            navigateToSection(targetId);
        });
    });
});

function updateCodeDisplay(algorithm, language = 'python') {
    const codeDisplay = document.getElementById('codeDisplay');
    const code = codeExamples[algorithm]?.[language] || codeExamples['bubble-sort'][language];
    codeDisplay.textContent = code;
    codeDisplay.className = `language-${language}`;
}

function updateAlgorithmExplanation(algorithm) {
    const explanation = algorithmExplanations[algorithm] || algorithmExplanations['bubble-sort'];
    const explanationDiv = document.getElementById('algorithmExplanation');
    
    explanationDiv.innerHTML = `
        <p><strong>${explanation.title}</strong> ${explanation.description}</p>
        <ol>
            ${explanation.steps.map(step => `<li>${step}</li>`).join('')}
        </ol>
        <p><strong>Time Complexity:</strong> ${explanation.timeComplexity}</p>
        <p><strong>Space Complexity:</strong> ${explanation.spaceComplexity}</p>
    `;
}

function updateTimeComplexity(algorithm) {
    const complexities = {
        'bubble-sort': 'O(n²)',
        'quick-sort': 'O(n log n)',
        'merge-sort': 'O(n log n)',
        'binary-search': 'O(log n)',
        'bfs': 'O(V + E)',
        'dfs': 'O(V + E)'
    };
    
    document.getElementById('timeComplexity').textContent = complexities[algorithm] || 'O(n²)';
}

function filterProblems(difficulty) {
    const problems = document.querySelectorAll('.problem-card');
    
    problems.forEach(problem => {
        if (difficulty === 'all' || problem.dataset.difficulty === difficulty) {
            problem.style.display = 'block';
        } else {
            problem.style.display = 'none';
        }
    });
}

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
    document.querySelectorAll('.learning-card, .topic-card, .problem-card').forEach(card => {
        card.style.animationPlayState = 'paused';
        observer.observe(card);
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Space to toggle visualization
    if (e.code === 'Space' && visualizationState.isRunning) {
        e.preventDefault();
        pauseVisualization();
    }
    
    // Escape to reset visualization
    if (e.code === 'Escape' && visualizationState.isRunning) {
        e.preventDefault();
        resetVisualization();
    }
    
    // Ctrl/Cmd + T to toggle theme
    if ((e.ctrlKey || e.metaKey) && e.code === 'KeyT') {
        e.preventDefault();
        toggleTheme();
    }
});