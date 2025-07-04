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
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const barWidth = canvas.width / data.length;
    const maxHeight = canvas.height - 40;
    const maxValue = Math.max(...data);
    
    data.forEach((value, index) => {
        const barHeight = (value / maxValue) * maxHeight;
        const x = index * barWidth;
        const y = canvas.height - barHeight;
        
        // Color based on whether it's highlighted or has custom color
        if (colors[index]) {
            ctx.fillStyle = colors[index];
        } else if (highlightIndices.includes(index)) {
            ctx.fillStyle = '#f56565'; // Red for comparison
        } else {
            ctx.fillStyle = '#667eea'; // Default blue
        }
        
        ctx.fillRect(x + 2, y, barWidth - 4, barHeight);
        
        // Draw value text
        ctx.fillStyle = currentTheme === 'dark' ? '#f7fafc' : '#2d3748';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(value, x + barWidth / 2, canvas.height - 5);
    });
}

function drawGraph(nodes, edges, highlightNodes = [], highlightEdges = []) {
    const canvas = document.getElementById('visualizationCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw edges first
    ctx.strokeStyle = currentTheme === 'dark' ? '#a0aec0' : '#718096';
    ctx.lineWidth = 2;
    
    edges.forEach((edge, index) => {
        const from = nodes[edge.from];
        const to = nodes[edge.to];
        
        if (highlightEdges.includes(index)) {
            ctx.strokeStyle = '#f56565';
            ctx.lineWidth = 3;
        } else {
            ctx.strokeStyle = currentTheme === 'dark' ? '#a0aec0' : '#718096';
            ctx.lineWidth = 2;
        }
        
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
        
        // Draw weight if exists
        if (edge.weight !== undefined) {
            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;
            
            ctx.fillStyle = currentTheme === 'dark' ? '#f7fafc' : '#2d3748';
            ctx.font = '12px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(edge.weight, midX, midY);
        }
    });
    
    // Draw nodes
    nodes.forEach((node, index) => {
        if (highlightNodes.includes(index)) {
            ctx.fillStyle = '#f56565';
        } else {
            ctx.fillStyle = '#667eea';
        }
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw node label
        ctx.fillStyle = 'white';
        ctx.font = '14px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(node.label || index, node.x, node.y + 5);
    });
}

function drawStack(stack, highlightIndex = -1) {
    const canvas = document.getElementById('visualizationCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const blockWidth = 100;
    const blockHeight = 40;
    const startX = canvas.width / 2 - blockWidth / 2;
    const startY = canvas.height - 50;
    
    stack.forEach((value, index) => {
        const y = startY - (index * blockHeight);
        
        if (index === highlightIndex) {
            ctx.fillStyle = '#f56565';
        } else {
            ctx.fillStyle = '#667eea';
        }
        
        ctx.fillRect(startX, y, blockWidth, blockHeight);
        ctx.strokeStyle = currentTheme === 'dark' ? '#a0aec0' : '#718096';
        ctx.strokeRect(startX, y, blockWidth, blockHeight);
        
        // Draw value
        ctx.fillStyle = 'white';
        ctx.font = '16px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(value, startX + blockWidth / 2, y + blockHeight / 2 + 5);
    });
    
    // Draw "TOP" pointer
    if (stack.length > 0) {
        const topY = startY - ((stack.length - 1) * blockHeight);
        ctx.fillStyle = currentTheme === 'dark' ? '#f7fafc' : '#2d3748';
        ctx.font = '14px Inter';
        ctx.textAlign = 'left';
        ctx.fillText('← TOP', startX + blockWidth + 10, topY + blockHeight / 2);
    }
}

function drawQueue(queue, highlightIndex = -1) {
    const canvas = document.getElementById('visualizationCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const blockWidth = 60;
    const blockHeight = 40;
    const startX = 50;
    const y = canvas.height / 2 - blockHeight / 2;
    
    queue.forEach((value, index) => {
        const x = startX + (index * blockWidth);
        
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
        ctx.fillText('FRONT', startX + blockWidth / 2, y - 20);
        ctx.fillText('↓', startX + blockWidth / 2, y - 5);
        
        // REAR pointer
        const rearX = startX + ((queue.length - 1) * blockWidth) + blockWidth / 2;
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
    
    function drawTree(highlightValue = null) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const positions = {
            50: { x: 400, y: 100 },
            30: { x: 250, y: 200 },
            70: { x: 550, y: 200 },
            20: { x: 180, y: 300 },
            40: { x: 320, y: 300 },
            60: { x: 480, y: 300 },
            80: { x: 620, y: 300 }
        };
        
        // Draw edges
        ctx.strokeStyle = currentTheme === 'dark' ? '#a0aec0' : '#718096';
        ctx.lineWidth = 2;
        
        const edges = [
            [50, 30], [50, 70], [30, 20], [30, 40], [70, 60], [70, 80]
        ];
        
        edges.forEach(([from, to]) => {
            const fromPos = positions[from];
            const toPos = positions[to];
            
            ctx.beginPath();
            ctx.moveTo(fromPos.x, fromPos.y);
            ctx.lineTo(toPos.x, toPos.y);
            ctx.stroke();
        });
        
        // Draw nodes
        Object.entries(positions).forEach(([value, pos]) => {
            if (parseInt(value) === highlightValue) {
                ctx.fillStyle = '#f56565';
            } else {
                ctx.fillStyle = '#667eea';
            }
            
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 25, 0, 2 * Math.PI);
            ctx.fill();
            
            ctx.fillStyle = 'white';
            ctx.font = '16px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(value, pos.x, pos.y + 5);
        });
    }
    
    // Animate traversal
    for (let i = 0; i < traversalOrder.length && visualizationState.isRunning; i++) {
        while (visualizationState.isPaused) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        drawTree(traversalOrder[i]);
        visualizationState.comparisons++;
        updateVisualizationInfo();
        
        await new Promise(resolve => setTimeout(resolve, 1500 / visualizationState.speed));
    }
    
    drawTree();
    markVisualizationComplete();
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
}`,
        cpp: `#include <iostream>
#include <vector>
using namespace std;

void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}

int main() {
    vector<int> numbers = {64, 34, 25, 12, 22, 11, 90};
    bubbleSort(numbers);
    for (int num : numbers) {
        cout << num << " ";
    }
    return 0;
}`
    },
    'insertion-sort': {
        python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr

# Example usage
numbers = [64, 34, 25, 12, 22, 11, 90]
sorted_numbers = insertion_sort(numbers)
print(sorted_numbers)`,
        javascript: `function insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
    return arr;
}

// Example usage
const numbers = [64, 34, 25, 12, 22, 11, 90];
const sortedNumbers = insertionSort(numbers);
console.log(sortedNumbers);`,
        java: `public static void insertionSort(int[] arr) {
    for (int i = 1; i < arr.length; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
        cpp: `void insertionSort(vector<int>& arr) {
    for (int i = 1; i < arr.size(); i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`
    },
    'quick-sort': {
        python: `def quick_sort(arr, low, high):
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] < pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`,
        javascript: `function quickSort(arr, low = 0, high = arr.length - 1) {
    if (low < high) {
        const pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
    return arr;
}

function partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
}`,
        java: `public static void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

public static int partition(int[] arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    return i + 1;
}`,
        cpp: `void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return i + 1;
}`
    },
    'binary-search': {
        python: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1  # Not found

# Example usage
sorted_array = [11, 12, 22, 25, 34, 64, 90]
result = binary_search(sorted_array, 25)
print(f"Element found at index: {result}")`,
        javascript: `function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1; // Not found
}

// Example usage
const sortedArray = [11, 12, 22, 25, 34, 64, 90];
const result = binarySearch(sortedArray, 25);
console.log(\`Element found at index: \${result}\`);`,
        java: `public static int binarySearch(int[] arr, int target) {
    int left = 0;
    int right = arr.length - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1; // Not found
}`,
        cpp: `int binarySearch(vector<int>& arr, int target) {
    int left = 0;
    int right = arr.size() - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1; // Not found
}`
    }
};

const algorithmExplanations = {
    'bubble-sort': {
        title: 'Bubble Sort',
        description: 'Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they\'re in the wrong order.',
        steps: [
            'Compare adjacent elements in the array',
            'Swap them if they\'re in the wrong order',
            'Continue until no more swaps are needed',
            'The largest element "bubbles up" to its correct position'
        ],
        timeComplexity: 'O(n²) worst/average case, O(n) best case',
        spaceComplexity: 'O(1) - sorts in-place',
        stability: 'Yes - maintains relative order of equal elements'
    },
    'insertion-sort': {
        title: 'Insertion Sort',
        description: 'Insertion Sort builds the final sorted array one item at a time by repeatedly taking elements from the unsorted portion and inserting them into their correct position.',
        steps: [
            'Start with the second element (index 1)',
            'Compare it with previous elements',
            'Shift larger elements to the right',
            'Insert the current element in its correct position'
        ],
        timeComplexity: 'O(n²) worst/average case, O(n) best case',
        spaceComplexity: 'O(1) - sorts in-place',
        stability: 'Yes - maintains relative order of equal elements'
    },
    'quick-sort': {
        title: 'Quick Sort',
        description: 'Quick Sort is an efficient divide-and-conquer algorithm that works by selecting a pivot element and partitioning the array around it.',
        steps: [
            'Choose a pivot element from the array',
            'Partition the array so elements smaller than pivot come before it',
            'Elements greater than pivot come after it',
            'Recursively apply the same process to sub-arrays'
        ],
        timeComplexity: 'O(n log n) average case, O(n²) worst case',
        spaceComplexity: 'O(log n) average case',
        stability: 'No - may change relative order of equal elements'
    },
    'binary-search': {
        title: 'Binary Search',
        description: 'Binary Search is an efficient algorithm for finding an item from a sorted list by repeatedly dividing the search interval in half.',
        steps: [
            'Start with the middle element of the sorted array',
            'If target equals middle element, return its position',
            'If target is less than middle, search the left half',
            'If target is greater than middle, search the right half',
            'Repeat until target is found or search space is empty'
        ],
        timeComplexity: 'O(log n)',
        spaceComplexity: 'O(1) iterative, O(log n) recursive',
        stability: 'N/A - search algorithm'
    }
};

const algorithmComplexities = {
    'bubble-sort': { time: 'O(n²)', space: 'O(1)' },
    'insertion-sort': { time: 'O(n²)', space: 'O(1)' },
    'quick-sort': { time: 'O(n log n)', space: 'O(log n)' },
    'merge-sort': { time: 'O(n log n)', space: 'O(n)' },
    'binary-search': { time: 'O(log n)', space: 'O(1)' },
    'linear-search': { time: 'O(n)', space: 'O(1)' },
    'bfs': { time: 'O(V + E)', space: 'O(V)' },
    'dfs': { time: 'O(V + E)', space: 'O(V)' },
    'dijkstra': { time: 'O((V + E) log V)', space: 'O(V)' },
    'stack-operations': { time: 'O(1)', space: 'O(n)' },
    'queue-operations': { time: 'O(1)', space: 'O(n)' },
    'binary-tree': { time: 'O(n)', space: 'O(h)' }
};

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
    initHeroAnimation();
    
    // Initialize button states
    updateVisualizationButtons();
    
    // Check if we need to set a specific algorithm
    const selectedAlgorithm = localStorage.getItem('selectedAlgorithm');
    if (selectedAlgorithm) {
        const algorithmSelect = document.getElementById('algorithmSelect');
        if (algorithmSelect) {
            algorithmSelect.value = selectedAlgorithm;
            algorithmSelect.dispatchEvent(new Event('change'));
        }
        // Clear the stored selection
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
            if (topic) {
                loadVisualization(topic);
            }
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
    
    // Initialize with default algorithm
    const defaultAlgorithm = 'bubble-sort';
    updateCodeDisplay(defaultAlgorithm);
    updateAlgorithmExplanation(defaultAlgorithm);
    updateComplexityDisplay(defaultAlgorithm);
});

// Add this new function to your existing script.js
function setAlgorithmAndStart(algorithm) {
    const algorithmSelect = document.getElementById('algorithmSelect');
    if (algorithmSelect) {
        algorithmSelect.value = algorithm;
        algorithmSelect.dispatchEvent(new Event('change'));
        
        // Small delay to ensure UI updates, then start visualization
        setTimeout(() => {
            startVisualization();
        }, 100);
    }
}

function updateCodeDisplay(algorithm, language = 'python') {
    const codeDisplay = document.getElementById('codeDisplay');
    if (!codeDisplay) return;
    
    const code = codeExamples[algorithm]?.[language] || codeExamples['bubble-sort'][language];
    codeDisplay.textContent = code;
    codeDisplay.className = `language-${language}`;
}

function updateAlgorithmExplanation(algorithm) {
    const explanation = algorithmExplanations[algorithm] || algorithmExplanations['bubble-sort'];
    const explanationDiv = document.getElementById('algorithmExplanation');
    
    if (!explanationDiv) return;
    
    explanationDiv.innerHTML = `
        <p><strong>${explanation.title}</strong> ${explanation.description}</p>
        <div class="steps-list">
            <h4>Algorithm Steps:</h4>
            <ol>
                ${explanation.steps.map(step => `<li>${step}</li>`).join('')}
            </ol>
        </div>
        <div class="complexity-info">
            <h4>Complexity Analysis:</h4>
            <p><strong>Time Complexity:</strong> ${explanation.timeComplexity}</p>
            <p><strong>Space Complexity:</strong> ${explanation.spaceComplexity}</p>
            <p><strong>Stability:</strong> ${explanation.stability}</p>
        </div>
    `;
}

function updateComplexityDisplay(algorithm) {
    const complexities = algorithmComplexities[algorithm] || algorithmComplexities['bubble-sort'];
    
    const timeComplexityEl = document.getElementById('timeComplexity');
    const spaceComplexityEl = document.getElementById('spaceComplexity');
    
    if (timeComplexityEl) timeComplexityEl.textContent = complexities.time;
    if (spaceComplexityEl) spaceComplexityEl.textContent = complexities.space;
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
    document.querySelectorAll('.topic-card').forEach(card => {
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