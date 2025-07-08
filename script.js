// Global state
let currentTheme = 'light';
let visualizationState = {
    isRunning: false,
    isPaused: false,
    data: [],
    algorithm: 'bubble-sort',
    speed: 5,
    comparisons: 0,
    swaps: 0,
    currentAlgorithm: null,
    currentStep: 0
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

// Navigation functions for visualizer page
function handleNavigation(href) {
    if (href.startsWith('#')) {
        // Internal section navigation (shouldn't happen on visualizer page)
        const sectionId = href.substring(1);
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    } else if (href.includes('#')) {
        // Cross-page navigation with section
        window.location.href = href;
    } else {
        // Regular page navigation
        window.location.href = href;
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

// Load specific visualization
function loadVisualization(topic) {
    // Navigate to visualizer section
    navigateToSection('visualize');
    
    // Set the algorithm selector based on topic
    const algorithmSelect = document.getElementById('algorithmSelect');
    if (algorithmSelect) {
        algorithmSelect.value = topic;
        
        // Trigger change event to update display
        algorithmSelect.dispatchEvent(new Event('change'));
    }
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

// Button state management
function updateVisualizationButtons() {
    const startBtn = document.querySelector('[onclick="startVisualization()"]');
    const pauseBtn = document.querySelector('[onclick="pauseVisualization()"]');
    const resetBtn = document.querySelector('[onclick="resetVisualization()"]');
    
    if (visualizationState.isRunning) {
        // Disable start button when running
        if (startBtn) {
            startBtn.disabled = true;
            startBtn.classList.add('btn-disabled');
            startBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Running...';
        }
        
        // Enable pause and reset buttons
        if (pauseBtn) {
            pauseBtn.disabled = false;
            pauseBtn.classList.remove('btn-disabled');
        }
        if (resetBtn) {
            resetBtn.disabled = false;
            resetBtn.classList.remove('btn-disabled');
        }
    } else {
        // Enable start button when not running
        if (startBtn) {
            startBtn.disabled = false;
            startBtn.classList.remove('btn-disabled');
            startBtn.innerHTML = '<i class="fas fa-play"></i> Start';
        }
        
        // Reset pause button text
        if (pauseBtn) {
            pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
            pauseBtn.disabled = false;
            pauseBtn.classList.remove('btn-disabled');
        }
        
        if (resetBtn) {
            resetBtn.disabled = false;
            resetBtn.classList.remove('btn-disabled');
        }
    }
}

// Visualization functions
function startVisualization() {
    // Prevent starting if already running
    if (visualizationState.isRunning) {
        return;
    }
    
    const algorithm = document.getElementById('algorithmSelect').value;
    const inputData = document.getElementById('inputData').value;
    const speed = document.getElementById('speedControl').value;
    
    // Parse input data
    const data = inputData.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
    
    if (data.length === 0) {
        alert('Please enter valid numbers separated by commas');
        return;
    }
    
    // Show algorithm title overlay
    showAlgorithmTitle(algorithm);
    
    visualizationState = {
        isRunning: true,
        isPaused: false,
        data: [...data],
        algorithm: algorithm,
        speed: parseInt(speed),
        currentAlgorithm: algorithm,
        currentStep: 0,
        comparisons: 0,
        swaps: 0
    };
    
    updateVisualizationInfo();
    updateVisualizationButtons();
    
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
        case 'insertion-sort':
            animateInsertionSort(data);
            break;
        case 'binary-search':
            animateBinarySearch(data);
            break;
        case 'linear-search':
            animateLinearSearch(data);
            break;
        case 'bfs':
            animateBFS();
            break;
        case 'dfs':
            animateDFS();
            break;
        case 'dijkstra':
            animateDijkstra();
            break;
        case 'stack-operations':
            animateStackOperations();
            break;
        case 'queue-operations':
            animateQueueOperations();
            break;
        case 'binary-tree':
            animateBinaryTreeTraversal();
            break;
        default:
            animateBubbleSort(data);
    }
}

function pauseVisualization() {
    if (!visualizationState.isRunning) return;
    
    visualizationState.isPaused = !visualizationState.isPaused;
    const pauseBtn = document.querySelector('[onclick="pauseVisualization()"]');
    if (pauseBtn) {
        pauseBtn.innerHTML = visualizationState.isPaused ? 
            '<i class="fas fa-play"></i> Resume' : 
            '<i class="fas fa-pause"></i> Pause';
    }
}

function resetVisualization() {
    visualizationState.isRunning = false;
    visualizationState.isPaused = false;
    visualizationState.comparisons = 0;
    visualizationState.swaps = 0;
    
    updateVisualizationInfo();
    updateVisualizationButtons();
    clearVisualizationCanvas();
}

function updateVisualizationInfo() {
    const comparisonsEl = document.getElementById('comparisons');
    const swapsEl = document.getElementById('swaps');
    
    if (comparisonsEl) comparisonsEl.textContent = visualizationState.comparisons;
    if (swapsEl) swapsEl.textContent = visualizationState.swaps;
}

function clearVisualizationCanvas() {
    const canvas = document.getElementById('visualizationCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawBars(data, highlightIndices = [], colors = {}) {
    const canvas = document.getElementById('visualizationCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);
    
    ctx.clearRect(0, 0, width, height);
    
    // Calculate content area (centered with padding for overlays)
    const padding = {
        top: 180,
        bottom: 120,
        left: Math.max(100, width * 0.1),
        right: Math.max(100, width * 0.1)
    };
    
    const contentWidth = width - padding.left - padding.right;
    const contentHeight = height - padding.top - padding.bottom;
    
    // Fix: Better auto-sizing based on data length with maximum limits
    const maxBarWidth = Math.min(80, contentWidth / data.length);
    const barWidth = Math.max(20, maxBarWidth); // Minimum 20px, maximum based on available space
    const totalBarsWidth = barWidth * data.length;
    const startX = padding.left + Math.max(0, (contentWidth - totalBarsWidth) / 2);
    
    const maxValue = Math.max(...data);
    const maxBarHeight = Math.min(contentHeight * 0.7, 300); // Limit maximum bar height
    
    data.forEach((value, index) => {
        const barHeight = (value / maxValue) * maxBarHeight;
        const x = startX + (index * barWidth);
        const y = height - padding.bottom - barHeight;
        
        // Color based on state
        if (colors[index]) {
            ctx.fillStyle = colors[index];
        } else if (highlightIndices.includes(index)) {
            ctx.fillStyle = '#f56565';
        } else {
            ctx.fillStyle = '#667eea';
        }
        
        // Fix: Add bounds checking to prevent drawing outside canvas
        if (x >= 0 && x + barWidth <= width && y >= 0) {
            ctx.fillRect(x + 2, y, barWidth - 4, barHeight);
            
            // Draw value text only if there's enough space
            if (barWidth > 25) {
                ctx.fillStyle = currentTheme === 'dark' ? '#f7fafc' : '#2d3748';
                const fontSize = Math.min(12, barWidth * 0.4);
                ctx.font = `${fontSize}px Inter`;
                ctx.textAlign = 'center';
                ctx.fillText(value, x + barWidth / 2, height - padding.bottom + 20);
            }
        }
    });
}

function drawGraph(nodes, edges, highlightNodes = [], highlightEdges = []) {
    const canvas = document.getElementById('visualizationCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);
    
    ctx.clearRect(0, 0, width, height);
    
    // Calculate content area with proper padding
    const padding = {
        top: 180,
        bottom: 120,
        left: 150,
        right: 150
    };
    
    const contentWidth = width - padding.left - padding.right;
    const contentHeight = height - padding.top - padding.bottom;
    
    // Fix: Proper scaling to fit content area
    const baseWidth = 400;
    const baseHeight = 300;
    const scaleX = contentWidth / baseWidth;
    const scaleY = contentHeight / baseHeight;
    const scale = Math.min(scaleX, scaleY, 1.5); // Limit maximum scale
    
    const offsetX = padding.left + (contentWidth - baseWidth * scale) / 2;
    const offsetY = padding.top + (contentHeight - baseHeight * scale) / 2;
    
    // Draw edges
    ctx.strokeStyle = currentTheme === 'dark' ? '#a0aec0' : '#718096';
    ctx.lineWidth = Math.max(1, 2 * scale);
    
    edges.forEach((edge, index) => {
        const from = nodes[edge.from];
        const to = nodes[edge.to];
        
        if (highlightEdges.includes(index)) {
            ctx.strokeStyle = '#f56565';
            ctx.lineWidth = Math.max(2, 3 * scale);
        } else {
            ctx.strokeStyle = currentTheme === 'dark' ? '#a0aec0' : '#718096';
            ctx.lineWidth = Math.max(1, 2 * scale);
        }
        
        const fromX = offsetX + from.x * scale;
        const fromY = offsetY + from.y * scale;
        const toX = offsetX + to.x * scale;
        const toY = offsetY + to.y * scale;
        
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
        
        // Draw weight if exists
        if (edge.weight !== undefined) {
            const midX = (fromX + toX) / 2;
            const midY = (fromY + toY) / 2;
            
            ctx.fillStyle = currentTheme === 'dark' ? '#f7fafc' : '#2d3748';
            ctx.font = `${Math.max(10, 14 * scale)}px Inter`;
            ctx.textAlign = 'center';
            ctx.fillText(edge.weight, midX, midY);
        }
    });
    
    // Draw nodes
    nodes.forEach((node, index) => {
        const nodeX = offsetX + node.x * scale;
        const nodeY = offsetY + node.y * scale;
        const nodeRadius = Math.max(15, Math.min(30, 25 * scale));
        
        if (highlightNodes.includes(index)) {
            ctx.fillStyle = '#f56565';
        } else {
            ctx.fillStyle = '#667eea';
        }
        
        ctx.beginPath();
        ctx.arc(nodeX, nodeY, nodeRadius, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw node label
        ctx.fillStyle = 'white';
        ctx.font = `${Math.max(12, 16 * scale)}px Inter`;
        ctx.textAlign = 'center';
        ctx.fillText(node.label || index, nodeX, nodeY + Math.max(4, 6 * scale));
    });
}

function drawStack(stack, highlightIndex = -1) {
    const canvas = document.getElementById('visualizationCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Get available space considering overlays
    const overlayPadding = 80;
    const availableWidth = canvas.width - overlayPadding;
    const availableHeight = canvas.height - overlayPadding;
    const startX = overlayPadding / 2;
    const startY = overlayPadding / 2;
    
    const blockWidth = 100;
    const blockHeight = 40;
    const centerX = startX + availableWidth / 2 - blockWidth / 2;
    const bottomY = startY + availableHeight - 50;
    
    stack.forEach((value, index) => {
        const y = bottomY - (index * blockHeight);
        
        if (index === highlightIndex) {
            ctx.fillStyle = '#f56565';
        } else {
            ctx.fillStyle = '#667eea';
        }
        
        ctx.fillRect(centerX, y, blockWidth, blockHeight);
        ctx.strokeStyle = currentTheme === 'dark' ? '#a0aec0' : '#718096';
        ctx.strokeRect(centerX, y, blockWidth, blockHeight);
        
        // Draw value
        ctx.fillStyle = 'white';
        ctx.font = '16px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(value, centerX + blockWidth / 2, y + blockHeight / 2 + 5);
    });
    
    // Draw "TOP" pointer
    if (stack.length > 0) {
        const topY = bottomY - ((stack.length - 1) * blockHeight);
        ctx.fillStyle = currentTheme === 'dark' ? '#f7fafc' : '#2d3748';
        ctx.font = '14px Inter';
        ctx.textAlign = 'left';
        ctx.fillText('← TOP', centerX + blockWidth + 10, topY + blockHeight / 2);
    }
}

function drawQueue(queue, highlightIndex = -1) {
    const canvas = document.getElementById('visualizationCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Get available space considering overlays
    const overlayPadding = 80;
    const availableWidth = canvas.width - overlayPadding;
    const availableHeight = canvas.height - overlayPadding;
    const startX = overlayPadding / 2;
    const startY = overlayPadding / 2;
    
    const blockWidth = 60;
    const blockHeight = 40;
    const queueStartX = startX + 50;
    const y = startY + availableHeight / 2 - blockHeight / 2;
    
    queue.forEach((value, index) => {
        const x = queueStartX + (index * blockWidth);
        
        if (index === highlightIndex) {
            ctx.fillStyle = '#f56565';
        } else {
            ctx.fillStyle = '#667eea';
        }
        
        ctx.fillRect(x, y, blockWidth, blockHeight);
        ctx.strokeStyle = currentTheme === 'dark' ? '#a0aec0' : '#718096';
        ctx.strokeRect(x, y, blockWidth, blockHeight);
        
        // Draw value
        ctx.fillStyle = 'white';
        ctx.font = '16px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(value, x + blockWidth / 2, y + blockHeight / 2 + 5);
    });
    
    // Draw FRONT and REAR pointers
    if (queue.length > 0) {
        ctx.fillStyle = currentTheme === 'dark' ? '#f7fafc' : '#2d3748';
        ctx.font = '14px Inter';
        ctx.textAlign = 'center';
        
        // FRONT pointer
        ctx.fillText('FRONT', queueStartX + blockWidth / 2, y - 20);
        ctx.fillText('↓', queueStartX + blockWidth / 2, y - 5);
        
        // REAR pointer
        const rearX = queueStartX + ((queue.length - 1) * blockWidth) + blockWidth / 2;
        ctx.fillText('REAR', rearX, y + blockHeight + 35);
        ctx.fillText('↑', rearX, y + blockHeight + 20);
    }
}

// Helper function to mark visualization as completed
function markVisualizationComplete() {
    visualizationState.isRunning = false;
    visualizationState.isPaused = false;
    updateVisualizationButtons();
}

// Sorting algorithms
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
    markVisualizationComplete();
}

async function animateInsertionSort(originalData) {
    const data = [...originalData];
    const n = data.length;
    
    for (let i = 1; i < n; i++) {
        if (!visualizationState.isRunning) return;
        
        let key = data[i];
        let j = i - 1;
        
        // Highlight current element being inserted
        drawBars(data, [i]);
        await new Promise(resolve => setTimeout(resolve, 1000 / visualizationState.speed));
        
        while (j >= 0 && data[j] > key) {
            while (visualizationState.isPaused) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            visualizationState.comparisons++;
            updateVisualizationInfo();
            
            data[j + 1] = data[j];
            visualizationState.swaps++;
            updateVisualizationInfo();
            
            drawBars(data, [j, j + 1]);
            await new Promise(resolve => setTimeout(resolve, 1000 / visualizationState.speed));
            
            j--;
        }
        
        data[j + 1] = key;
        drawBars(data, [j + 1]);
        await new Promise(resolve => setTimeout(resolve, 1000 / visualizationState.speed));
    }
    
    drawBars(data);
    markVisualizationComplete();
}

async function animateQuickSort(originalData) {
    const data = [...originalData];
    
    async function quickSortHelper(arr, low, high) {
        if (low < high && visualizationState.isRunning) {
            const pi = await partition(arr, low, high);
            await quickSortHelper(arr, low, pi - 1);
            await quickSortHelper(arr, pi + 1, high);
        }
    }
    
    async function partition(arr, low, high) {
        const pivot = arr[high];
        let i = low - 1;
        
        for (let j = low; j < high; j++) {
            while (visualizationState.isPaused) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            visualizationState.comparisons++;
            updateVisualizationInfo();
            
            drawBars(arr, [j, high], { [high]: '#fbbf24' }); // Highlight pivot in yellow
            await new Promise(resolve => setTimeout(resolve, 1000 / visualizationState.speed));
            
            if (arr[j] < pivot) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
                visualizationState.swaps++;
                updateVisualizationInfo();
                
                drawBars(arr, [i, j], { [high]: '#fbbf24' });
                await new Promise(resolve => setTimeout(resolve, 1000 / visualizationState.speed));
            }
        }
        
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        visualizationState.swaps++;
        updateVisualizationInfo();
        
        drawBars(arr, [i + 1]);
        await new Promise(resolve => setTimeout(resolve, 1000 / visualizationState.speed));
        
        return i + 1;
    }
    
    await quickSortHelper(data, 0, data.length - 1);
    drawBars(data);
    markVisualizationComplete();
}

async function animateMergeSort(originalData) {
    const data = [...originalData];
    
    async function mergeSortHelper(arr, left, right) {
        if (left < right && visualizationState.isRunning) {
            const mid = Math.floor((left + right) / 2);
            
            await mergeSortHelper(arr, left, mid);
            await mergeSortHelper(arr, mid + 1, right);
            await merge(arr, left, mid, right);
        }
    }
    
    async function merge(arr, left, mid, right) {
        const leftArr = arr.slice(left, mid + 1);
        const rightArr = arr.slice(mid + 1, right + 1);
        
        let i = 0, j = 0, k = left;
        
        while (i < leftArr.length && j < rightArr.length) {
            while (visualizationState.isPaused) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            visualizationState.comparisons++;
            updateVisualizationInfo();
            
            const highlights = [];
            for (let idx = left; idx <= right; idx++) {
                highlights.push(idx);
            }
            
            drawBars(arr, highlights);
            await new Promise(resolve => setTimeout(resolve, 1000 / visualizationState.speed));
            
            if (leftArr[i] <= rightArr[j]) {
                arr[k] = leftArr[i];
                i++;
            } else {
                arr[k] = rightArr[j];
                j++;
            }
            
            visualizationState.swaps++;
            updateVisualizationInfo();
            k++;
        }
        
        while (i < leftArr.length) {
            arr[k] = leftArr[i];
            i++;
            k++;
        }
        
        while (j < rightArr.length) {
            arr[k] = rightArr[j];
            j++;
            k++;
        }
        
        const highlights = [];
        for (let idx = left; idx <= right; idx++) {
            highlights.push(idx);
        }
        drawBars(arr, highlights);
        await new Promise(resolve => setTimeout(resolve, 1000 / visualizationState.speed));
    }
    
    await mergeSortHelper(data, 0, data.length - 1);
    drawBars(data);
    markVisualizationComplete();
}

// Search algorithms
async function animateBinarySearch(originalData) {
    const data = [...originalData].sort((a, b) => a - b);
    const target = data[Math.floor(Math.random() * data.length)];
    
    let left = 0;
    let right = data.length - 1;
    let found = false;
    
    // Show initial state
    drawBars(data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    while (left <= right && visualizationState.isRunning && !found) {
        while (visualizationState.isPaused) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        const mid = Math.floor((left + right) / 2);
        
        // Highlight current search range
        const highlightIndices = [];
        for (let i = left; i <= right; i++) {
            highlightIndices.push(i);
        }
        
        drawBars(data, highlightIndices, { [mid]: '#fbbf24' }); // Mid in yellow
        visualizationState.comparisons++;
        updateVisualizationInfo();
        
        await new Promise(resolve => setTimeout(resolve, 1500 / visualizationState.speed));
        
        if (data[mid] === target) {
            // Found target
            drawBars(data, [mid], { [mid]: '#48bb78' }); // Green for found
            found = true;
        } else if (data[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    markVisualizationComplete();
}

async function animateLinearSearch(originalData) {
    const data = [...originalData];
    const target = data[Math.floor(Math.random() * data.length)];
    
    for (let i = 0; i < data.length && visualizationState.isRunning; i++) {
        while (visualizationState.isPaused) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        visualizationState.comparisons++;
        updateVisualizationInfo();
        
        if (data[i] === target) {
            drawBars(data, [i], { [i]: '#48bb78' }); // Green for found
            break;
        } else {
            drawBars(data, [i], { [i]: '#f56565' }); // Red for checking
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000 / visualizationState.speed));
    }
    
    markVisualizationComplete();
}

// Graph algorithms
async function animateBFS() {
    const nodes = [
        { x: 100, y: 100, label: 'A' },
        { x: 200, y: 100, label: 'B' },
        { x: 300, y: 100, label: 'C' },
        { x: 150, y: 200, label: 'D' },
        { x: 250, y: 200, label: 'E' }
    ];
    
    const edges = [
        { from: 0, to: 1 },
        { from: 0, to: 3 },
        { from: 1, to: 2 },
        { from: 1, to: 4 },
        { from: 3, to: 4 }
    ];
    
    const queue = [0];
    const visited = new Set([0]);
    
    drawGraph(nodes, edges, [0]);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    while (queue.length > 0 && visualizationState.isRunning) {
        while (visualizationState.isPaused) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        const current = queue.shift();
        
        // Find adjacent nodes
        const adjacentEdges = [];
        edges.forEach((edge, index) => {
            if (edge.from === current && !visited.has(edge.to)) {
                queue.push(edge.to);
                visited.add(edge.to);
                adjacentEdges.push(index);
            }
        });
        
        drawGraph(nodes, edges, Array.from(visited), adjacentEdges);
        visualizationState.comparisons++;
        updateVisualizationInfo();
        
        await new Promise(resolve => setTimeout(resolve, 1500 / visualizationState.speed));
    }
    
    markVisualizationComplete();
}

async function animateDFS() {
    const nodes = [
        { x: 100, y: 100, label: 'A' },
        { x: 200, y: 100, label: 'B' },
        { x: 300, y: 100, label: 'C' },
        { x: 150, y: 200, label: 'D' },
        { x: 250, y: 200, label: 'E' }
    ];
    
    const edges = [
        { from: 0, to: 1 },
        { from: 0, to: 3 },
        { from: 1, to: 2 },
        { from: 1, to: 4 },
        { from: 3, to: 4 }
    ];
    
    const visited = new Set();
    
    async function dfsHelper(node) {
        if (visited.has(node) || !visualizationState.isRunning) return;
        
        while (visualizationState.isPaused) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        visited.add(node);
        drawGraph(nodes, edges, Array.from(visited));
        visualizationState.comparisons++;
        updateVisualizationInfo();
        
        await new Promise(resolve => setTimeout(resolve, 1500 / visualizationState.speed));
        
        // Visit adjacent nodes
        for (const edge of edges) {
            if (edge.from === node && !visited.has(edge.to)) {
                await dfsHelper(edge.to);
            }
        }
    }
    
    await dfsHelper(0);
    markVisualizationComplete();
}

async function animateDijkstra() {
    const nodes = [
        { x: 100, y: 150, label: 'A' },
        { x: 200, y: 100, label: 'B' },
        { x: 300, y: 150, label: 'C' },
        { x: 200, y: 200, label: 'D' }
    ];
    
    const edges = [
        { from: 0, to: 1, weight: 4 },
        { from: 0, to: 3, weight: 2 },
        { from: 1, to: 2, weight: 3 },
        { from: 3, to: 1, weight: 1 },
        { from: 3, to: 2, weight: 5 }
    ];
    
    const distances = Array(nodes.length).fill(Infinity);
    distances[0] = 0;
    const visited = new Set();
    
    drawGraph(nodes, edges, [0]);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    while (visited.size < nodes.length && visualizationState.isRunning) {
        while (visualizationState.isPaused) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // Find unvisited node with minimum distance
        let minNode = -1;
        let minDistance = Infinity;
        
        for (let i = 0; i < nodes.length; i++) {
            if (!visited.has(i) && distances[i] < minDistance) {
                minDistance = distances[i];
                minNode = i;
            }
        }
        
        if (minNode === -1) break;
        
        visited.add(minNode);
        
        // Update distances to adjacent nodes
        edges.forEach(edge => {
            if (edge.from === minNode && !visited.has(edge.to)) {
                const newDistance = distances[minNode] + edge.weight;
                if (newDistance < distances[edge.to]) {
                    distances[edge.to] = newDistance;
                }
            }
        });
        
        drawGraph(nodes, edges, Array.from(visited));
        visualizationState.comparisons++;
        updateVisualizationInfo();
        
        await new Promise(resolve => setTimeout(resolve, 1500 / visualizationState.speed));
    }
    
    markVisualizationComplete();
}

// Data structure operations
async function animateStackOperations() {
    const stack = [];
    const operations = ['push', 'push', 'push', 'pop', 'push', 'pop', 'pop'];
    const values = [10, 20, 30, null, 40, null, null];
    
    for (let i = 0; i < operations.length && visualizationState.isRunning; i++) {
        while (visualizationState.isPaused) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        const operation = operations[i];
        const value = values[i];
        
        if (operation === 'push') {
            stack.push(value);
            drawStack(stack, stack.length - 1);
            visualizationState.swaps++; // Count operations
        } else if (operation === 'pop' && stack.length > 0) {
            drawStack(stack, stack.length - 1);
            await new Promise(resolve => setTimeout(resolve, 1000 / visualizationState.speed));
            stack.pop();
            drawStack(stack);
            visualizationState.swaps++; // Count operations
        }
        
        updateVisualizationInfo();
        await new Promise(resolve => setTimeout(resolve, 1500 / visualizationState.speed));
    }
    
    markVisualizationComplete();
}

async function animateQueueOperations() {
    const queue = [];
    const operations = ['enqueue', 'enqueue', 'enqueue', 'dequeue', 'enqueue', 'dequeue'];
    const values = [10, 20, 30, null, 40, null];
    
    for (let i = 0; i < operations.length && visualizationState.isRunning; i++) {
        while (visualizationState.isPaused) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        const operation = operations[i];
        const value = values[i];
        
        if (operation === 'enqueue') {
            queue.push(value);
            drawQueue(queue, queue.length - 1);
            visualizationState.swaps++; // Count operations
        } else if (operation === 'dequeue' && queue.length > 0) {
            drawQueue(queue, 0);
            await new Promise(resolve => setTimeout(resolve, 1000 / visualizationState.speed));
            queue.shift();
            drawQueue(queue);
            visualizationState.swaps++; // Count operations
        }
        
        updateVisualizationInfo();
        await new Promise(resolve => setTimeout(resolve, 1500 / visualizationState.speed));
    }
    
    markVisualizationComplete();
}

async function animateBinaryTreeTraversal() {
    // Simple binary tree visualization
    const canvas = document.getElementById('visualizationCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    const tree = {
        value: 50,
        left: { value: 30, left: { value: 20 }, right: { value: 40 } },
        right: { value: 70, left: { value: 60 }, right: { value: 80 } }
    };
    
    const traversalOrder = [];
    
    function inorderTraversal(node) {
        if (node) {
            inorderTraversal(node.left);
            traversalOrder.push(node.value);
            inorderTraversal(node.right);
        }
    }
    
    inorderTraversal(tree);
    
    // Draw tree nodes
    function drawTree(node, x, y, spacing) {
        if (!node) return;
        
        // Draw node
        ctx.fillStyle = '#2196F3';
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw value
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(node.value, x, y + 5);
        
        // Draw connections and child nodes
        if (node.left) {
            ctx.strokeStyle = '#666';
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x - spacing, y + 60);
            ctx.stroke();
            drawTree(node.left, x - spacing, y + 60, spacing / 2);
        }
        
        if (node.right) {
            ctx.strokeStyle = '#666';
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + spacing, y + 60);
            ctx.stroke();
            drawTree(node.right, x + spacing, y + 60, spacing / 2);
        }
    }
    
    // Initial draw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTree(tree, canvas.width / 2, 50, 100);
    
    // Animate traversal
    for (let i = 0; i < traversalOrder.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Highlight current node (simplified)
        ctx.fillStyle = '#FF5722';
        ctx.font = '16px Arial';
        ctx.fillText(`Visiting: ${traversalOrder[i]}`, 10, 30);
    }
}

// Canvas management for full viewport
function initFullPageCanvas() {
    const canvas = document.getElementById('visualizationCanvas');
    if (!canvas) return;
    
    // Set canvas to full viewport size
    resizeCanvasToViewport();
    
    // Handle window resize
    window.addEventListener('resize', resizeCanvasToViewport);
}

function resizeCanvasToViewport() {
    const canvas = document.getElementById('visualizationCanvas');
    if (!canvas) return;
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Set canvas size to viewport
    canvas.width = width;
    canvas.height = height;
    
    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    
    // Redraw current visualization if any
    if (visualizationState.isRunning || visualizationState.data.length > 0) {
        redrawCurrentVisualization();
    }
}

function redrawCurrentVisualization() {
    const canvas = document.getElementById('visualizationCanvas');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Redraw based on current algorithm
    if (visualizationState.currentAlgorithm) {
        const algorithm = visualizationState.currentAlgorithm;
        const data = visualizationState.data;
        
        if (algorithm.includes('sort') || algorithm.includes('search')) {
            drawBars(data, -1, -1);
        } else if (algorithm === 'stack-operations') {
            drawStack(data);
        } else if (algorithm === 'queue-operations') {
            drawQueue(data);
        } else if (algorithm.includes('bfs') || algorithm.includes('dfs') || algorithm.includes('dijkstra')) {
            drawGraph(data);
        }
    }
}

// Overlay management
function toggleOverlay(panelId) {
    const panel = document.getElementById(panelId);
    if (!panel) return;
    
    const isMinimized = panel.classList.contains('minimized');
    const minimizeBtn = panel.querySelector('.minimize-btn i');
    
    if (isMinimized) {
        panel.classList.remove('minimized');
        minimizeBtn.className = 'fas fa-minus';
    } else {
        panel.classList.add('minimized');
        minimizeBtn.className = 'fas fa-plus';
    }
}

// Fixed implementation modal management
function showImplementationDetails() {
    const modal = document.getElementById('implementationModal');
    if (!modal) {
        console.error('Implementation modal not found');
        return;
    }
    
    const algorithm = document.getElementById('algorithmSelect').value;
    
    // Update modal content
    updateModalContent(algorithm);
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Add event listener for outside clicks
    setTimeout(() => {
        modal.addEventListener('click', handleModalOutsideClick);
    }, 100);
}

function handleModalOutsideClick(e) {
    const modal = document.getElementById('implementationModal');
    if (e.target === modal) {
        closeImplementationModal();
    }
}

function closeImplementationModal() {
    const modal = document.getElementById('implementationModal');
    if (!modal) return;
    
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Remove event listener
    modal.removeEventListener('click', handleModalOutsideClick);
}

function updateModalContent(algorithm) {
    // Update code display
    const activeLanguage = document.querySelector('.tab-btn.active')?.dataset.lang || 'python';
    updateCodeDisplay(algorithm, activeLanguage);
    
    // Update explanation
    updateAlgorithmExplanation(algorithm);
    
    // Update complexity analysis
    updateComplexityAnalysis(algorithm);
}

function updateComplexityAnalysis(algorithm) {
    const complexityDiv = document.getElementById('complexityAnalysis');
    if (!complexityDiv) return;
    
    const explanation = algorithmExplanations[algorithm] || algorithmExplanations['bubble-sort'];
    const complexity = algorithmComplexities[algorithm] || algorithmComplexities['bubble-sort'];
    
    complexityDiv.innerHTML = `
        <div class="complexity-overview">
            <h3>${explanation.title} - Complexity Analysis</h3>
            <div class="complexity-grid">
                <div class="complexity-item">
                    <h4>Time Complexity</h4>
                    <div class="complexity-value">${complexity.time}</div>
                    <p>${explanation.timeComplexity}</p>
                </div>
                <div class="complexity-item">
                    <h4>Space Complexity</h4>
                    <div class="complexity-value">${complexity.space}</div>
                    <p>${explanation.spaceComplexity}</p>
                </div>
                <div class="complexity-item">
                    <h4>Stability</h4>
                    <div class="complexity-value">${explanation.stability.includes('Yes') ? 'Stable' : 'Unstable'}</div>
                    <p>${explanation.stability}</p>
                </div>
            </div>
        </div>
    `;
}

// Algorithm title management
function showAlgorithmTitle(algorithm) {
    const titleOverlay = document.getElementById('algorithmTitle');
    const titleText = document.getElementById('algorithmTitleText');
    
    const titles = {
        'bubble-sort': 'Bubble Sort Visualization',
        'quick-sort': 'Quick Sort Visualization',
        'merge-sort': 'Merge Sort Visualization',
        'insertion-sort': 'Insertion Sort Visualization',
        'binary-search': 'Binary Search Visualization',
        'linear-search': 'Linear Search Visualization',
        'bfs': 'Breadth-First Search',
        'dfs': 'Depth-First Search',
        'dijkstra': 'Dijkstra\'s Algorithm',
        'stack-operations': 'Stack Operations',
        'queue-operations': 'Queue Operations',
        'binary-tree': 'Binary Tree Traversal'
    };
    
    titleText.textContent = titles[algorithm] || 'Algorithm Visualization';
    titleOverlay.classList.add('visible');
    
    // Hide after 3 seconds
    setTimeout(() => {
        titleOverlay.classList.remove('visible');
    }, 3000);
}

// Updated DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
    
    // Initialize full page canvas
    initFullPageCanvas();
    
    // Initialize button states
    updateVisualizationButtons();
    
    // Handle navigation clicks for visualizer page
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            handleNavigation(href);
        });
    });
    
    // Set active nav link for visualizer page
    if (window.location.pathname.includes('visualizer')) {
        updateActiveNavLink('visualizer.html');
    }
    
    // Check for selected algorithm from localStorage
    const selectedAlgorithm = localStorage.getItem('selectedAlgorithm');
    if (selectedAlgorithm) {
        const algorithmSelect = document.getElementById('algorithmSelect');
        if (algorithmSelect) {
            algorithmSelect.value = selectedAlgorithm;
            algorithmSelect.dispatchEvent(new Event('change'));
        }
        localStorage.removeItem('selectedAlgorithm');
    }
    
    // Algorithm selector change
    const algorithmSelect = document.getElementById('algorithmSelect');
    if (algorithmSelect) {
        algorithmSelect.addEventListener('change', function() {
            const algorithm = this.value;
            updateCodeDisplay(algorithm);
            updateAlgorithmExplanation(algorithm);
            updateComplexityDisplay(algorithm);
        });
    }
    
    // Speed control
    const speedControl = document.getElementById('speedControl');
    if (speedControl) {
        speedControl.addEventListener('input', function() {
            const speed = this.value;
            const speedDisplay = document.getElementById('speedDisplay');
            if (speedDisplay) {
                speedDisplay.textContent = speed + 'x';
            }
            visualizationState.speed = parseInt(speed);
        });
    }
    
    // Modal tab functionality
    document.querySelectorAll('.modal-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            
            // Update active tab
            document.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Update active content
            document.querySelectorAll('.modal-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            const targetTab = document.getElementById(tabName + 'Tab');
            if (targetTab) {
                targetTab.classList.add('active');
            }
        });
    });
    
    // Language tab functionality in modal
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const language = this.dataset.lang;
            const algorithm = document.getElementById('algorithmSelect').value;
            updateCodeDisplay(algorithm, language);
        });
    });
    
    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeImplementationModal();
        }
    });
    
    // Initialize with default algorithm
    const defaultAlgorithm = 'bubble-sort';
    updateCodeDisplay(defaultAlgorithm);
    updateAlgorithmExplanation(defaultAlgorithm);
    updateComplexityDisplay(defaultAlgorithm);
    
    // Fix: Ensure implementation button is properly initialized
    const detailsButton = document.querySelector('#detailsButton .btn');
    if (detailsButton) {
        detailsButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            showImplementationDetails();
        });
    }
});

// Close modal on escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeImplementationModal();
    }
    
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
});

// Responsive canvas handling
function handleCanvasResize() {
    const canvas = document.getElementById('visualizationCanvas');
    if (!canvas) return;
    
    const container = canvas.parentElement;
    const containerWidth = container.clientWidth - 40; // Account for padding
    
    if (containerWidth < canvas.width) {
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
    }
}

window.addEventListener('resize', handleCanvasResize);
document.addEventListener('DOMContentLoaded', handleCanvasResize);

// Additional function to debug button issues
function debugImplementationButton() {
    const button = document.querySelector('#detailsButton .btn');
    const modal = document.getElementById('implementationModal');
    
    console.log('Implementation button:', button);
    console.log('Implementation modal:', modal);
    
    if (button && modal) {
        console.log('Both elements found - button should work');
    } else {
        console.error('Missing elements:', { button: !!button, modal: !!modal });
    }
}

// Call debug function after DOM is loaded (remove this in production)
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(debugImplementationButton, 1000);
});