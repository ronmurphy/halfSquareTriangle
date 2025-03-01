// grid.js - Creates and manages the quilting grid

let currentGrid = {
    width: 8,
    height: 8,
    cells: [],
    activeColor: '#FFFFFF'
};

document.addEventListener('DOMContentLoaded', function() {
    // Initialize grid on page load
    createNewGrid(8, 8);
    
    // Set up event listeners for grid tools
    document.getElementById('newProjectButton').addEventListener('click', showNewProjectModal);
    document.getElementById('clearGridButton').addEventListener('click', clearGrid);
    
    // Initialize new project form
    const newProjectForm = document.getElementById('newProjectForm');
    if (newProjectForm) {
        newProjectForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const width = parseInt(document.getElementById('gridWidth').value);
            const height = parseInt(document.getElementById('gridHeight').value);
            const projectName = document.getElementById('projectNameInput').value || 'Untitled';
            
            createNewGrid(width, height, projectName);
            hideModal('newProjectModal');
        });
    }
    
    // Close modal buttons
    document.querySelectorAll('.close-button').forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Set first color swatch as active
    const firstSwatch = document.querySelector('.color-swatch');
    if (firstSwatch) {
        firstSwatch.classList.add('active');
        setActiveColor(firstSwatch.getAttribute('data-color'));
    }
});

function createNewGrid(width, height, projectName = 'Untitled') {
    // Update current grid data
    currentGrid.width = width;
    currentGrid.height = height;
    currentGrid.cells = [];
    currentGrid.projectName = projectName;
    
    // Update project info
    document.getElementById('projectName').textContent = projectName;
    document.getElementById('gridDimensions').textContent = `${width} × ${height}`;
    document.getElementById('blockSize').textContent = `${width * height} cells`;
    
    // Create grid container
    const gridContainer = document.getElementById('gridContainer');
    gridContainer.innerHTML = '';
    
    const grid = document.createElement('div');
    grid.className = 'grid';
    grid.style.gridTemplateColumns = `repeat(${width}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${height}, 1fr)`;
    
    // Calculate cell size to maintain square proportion
    const containerWidth = gridContainer.clientWidth - 20; // Padding
    const containerHeight = gridContainer.clientHeight - 20;
    const cellSize = Math.min(
        Math.floor(containerWidth / width),
        Math.floor(containerHeight / height)
    );
    
    // Create cells
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.style.width = `${cellSize}px`;
            cell.style.height = `${cellSize}px`;
            cell.setAttribute('data-x', x);
            cell.setAttribute('data-y', y);
            cell.style.backgroundColor = '#FFFFFF';
            
            // Store cell data
            currentGrid.cells.push({
                x: x,
                y: y,
                color: '#FFFFFF',
                type: 'square' // Default type
            });
            
            // Add click event with HST support
            cell.addEventListener('click', function(e) {
                const x = parseInt(this.getAttribute('data-x'));
                const y = parseInt(this.getAttribute('data-y'));
                
                if (window.hstToolActive) {
                    // Place HST with current colors
                    placeHST(x, y, window.hstColor1, window.hstColor2, window.currentOrientation);
                } else if (this.classList.contains('hst')) {
                    // If it's already an HST, show the controls
                    showHSTControls(this);
                } else {
                    // Normal color fill
                    this.style.backgroundColor = currentGrid.activeColor;
                    
                    // Update cell data
                    const cellIndex = y * width + x;
                    currentGrid.cells[cellIndex].color = currentGrid.activeColor;
                    currentGrid.cells[cellIndex].type = 'square';
                    
                    // Hide HST controls if visible
                    hideHSTControls();
                }
                
                // Update block count in the info panel
                updateBlockCounts();
            });
            
            // Add right-click to rotate HST
            cell.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                if (window.hstToolActive) {
                    const x = parseInt(this.getAttribute('data-x'));
                    const y = parseInt(this.getAttribute('data-y'));
                    rotateHST(x, y);
                }
            });
            
            grid.appendChild(cell);
        }
    }
    
    gridContainer.appendChild(grid);
    updateBlockCounts();
    
    // Check if grid panel should be visible
    const panelContent = document.querySelector('.panel-content');
    if (!panelContent.classList.contains('visible')) {
        document.querySelector('.panel-header').click();
    }
}

function setActiveColor(color) {
    currentGrid.activeColor = color;
    console.log(`Active color set to: ${color}`);
}

function clearGrid() {
    // Reset all cells to white
    const cells = document.querySelectorAll('.grid-cell');
    cells.forEach(cell => {
        cell.style.backgroundColor = '#FFFFFF';
        const x = parseInt(cell.getAttribute('data-x'));
        const y = parseInt(cell.getAttribute('data-y'));
        const cellIndex = y * currentGrid.width + x;
        currentGrid.cells[cellIndex].color = '#FFFFFF';
    });
    
    updateBlockCounts();
}

function updateBlockCounts() {
    // Count colors and block types
    const blockCounts = {
        squares: {},
        hst: {}
    };
    
    currentGrid.cells.forEach(cell => {
        if (cell.type === 'square' && cell.color !== '#FFFFFF') { 
            if (!blockCounts.squares[cell.color]) {
                blockCounts.squares[cell.color] = 0;
            }
            blockCounts.squares[cell.color]++;
        } 
        else if (cell.type === 'hst') {
            const colorKey = `${cell.color1}_${cell.color2}`;
            if (!blockCounts.hst[colorKey]) {
                blockCounts.hst[colorKey] = 0;
            }
            blockCounts.hst[colorKey]++;
        }
    });
    
    // Update the block list
    const blockList = document.getElementById('blockList');
    blockList.innerHTML = '';
    
    // Add solid squares
    Object.keys(blockCounts.squares).forEach(color => {
        const li = document.createElement('li');
        li.className = 'block-item';
        
        const colorSample = document.createElement('div');
        colorSample.className = 'color-sample';
        colorSample.style.backgroundColor = color;
        
        const blockText = document.createElement('span');
        blockText.textContent = `${blockCounts.squares[color]} solid squares - ${color}`;
        
        li.appendChild(colorSample);
        li.appendChild(blockText);
        blockList.appendChild(li);
    });
    
    // Add HSTs
    Object.keys(blockCounts.hst).forEach(colorKey => {
        const [color1, color2] = colorKey.split('_');
        const li = document.createElement('li');
        li.className = 'block-item';
        
        const hstSample = document.createElement('div');
        hstSample.className = 'hst-sample';
        hstSample.style.setProperty('--triangle-color1', color1);
        hstSample.style.setProperty('--triangle-color2', color2);
        
        const blockText = document.createElement('span');
        blockText.textContent = `${blockCounts.hst[colorKey]} HST blocks - ${color1} & ${color2}`;
        
        li.appendChild(hstSample);
        li.appendChild(blockText);
        blockList.appendChild(li);
    });
    
    // If no blocks, show message
    if (Object.keys(blockCounts.squares).length === 0 && Object.keys(blockCounts.hst).length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = 'No colored blocks added yet';
        blockList.appendChild(emptyMessage);
    }
}

function showNewProjectModal() {
    const modal = document.getElementById('newProjectModal');
    modal.style.display = 'block';
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Variables to track HST interaction
let selectedCell = null;
let hstControls = null;
let selectedCellCoords = { x: -1, y: -1 };

// Initialize HST controls when document is loaded
document.addEventListener('DOMContentLoaded', function() {
    hstControls = document.getElementById('hstControls');
    
    // Set up rotation button
    const rotateButton = document.getElementById('rotateHstButton');
    if (rotateButton) {
        rotateButton.addEventListener('click', function(e) {
            e.stopPropagation();
            if (selectedCellCoords.x >= 0 && selectedCellCoords.y >= 0) {
                rotateHST(selectedCellCoords.x, selectedCellCoords.y);
            }
        });
    }
    
    // Set up confirm button
    const confirmButton = document.getElementById('confirmHstButton');
    if (confirmButton) {
        confirmButton.addEventListener('click', function(e) {
            e.stopPropagation();
            hideHSTControls();
        });
    }
    
    // Hide controls when clicking elsewhere
    document.addEventListener('click', function(e) {
        if (!hstControls.contains(e.target) && 
            (!selectedCell || !selectedCell.contains(e.target))) {
            hideHSTControls();
        }
    });
});

// Show HST controls near a cell
function showHSTControls(cell) {
    if (!hstControls) return;
    
    // Clear any previous selection
    if (selectedCell && selectedCell !== cell) {
        selectedCell.classList.remove('selected');
    }
    
    selectedCell = cell;
    selectedCell.classList.add('selected');
    
    // Get cell position
    const rect = cell.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
    
    // Position the controls near the cell
    hstControls.style.top = (rect.bottom + scrollTop + 10) + 'px';
    hstControls.style.left = (rect.left + scrollLeft) + 'px';
    hstControls.classList.add('visible');
    
    // Store cell coordinates for rotation
    selectedCellCoords.x = parseInt(cell.getAttribute('data-x'));
    selectedCellCoords.y = parseInt(cell.getAttribute('data-y'));
}

// Hide HST controls
function hideHSTControls() {
    if (!hstControls) return;
    
    hstControls.classList.remove('visible');
    
    if (selectedCell) {
        selectedCell.classList.remove('selected');
        selectedCell = null;
    }
    
    selectedCellCoords.x = -1;
    selectedCellCoords.y = -1;
}

// Update the rotateHST function to include all orientations
// Update the rotateHST function to rotate in clockwise order
function rotateHST(x, y) {
    const cell = document.querySelector(`.grid-cell[data-x="${x}"][data-y="${y}"]`);
    if (!cell || !cell.classList.contains('hst')) return;
    
    // Define orientations in clockwise order:
    // 11 o'clock -> 2 o'clock -> 4 o'clock -> 8 o'clock -> 11 o'clock
    const orientations = ['top-left', 'top-right', 'bottom-right', 'bottom-left'];
    const currentOrientation = cell.getAttribute('data-orientation') || 'top-left';
    
    // Find current index and get next orientation
    let currentIndex = orientations.indexOf(currentOrientation);
    if (currentIndex === -1) currentIndex = 0; // Safety check
    
    const newOrientation = orientations[(currentIndex + 1) % orientations.length];
    console.log(`Rotating from ${currentOrientation} to ${newOrientation}`);
    
    // Update the cell
    cell.setAttribute('data-orientation', newOrientation);
    
    // Update the data model
    const cellIndex = y * currentGrid.width + x;
    currentGrid.cells[cellIndex].orientation = newOrientation;
}

// Update the placeHST function to show controls after placing
// Make sure initial orientation is correct when placing an HST
window.currentOrientation = 'top-left';
function placeHST(x, y, color1, color2, orientation = 'top-left') {
        const cellIndex = y * currentGrid.width + x;
    
    // Make sure we're using a valid orientation
    const validOrientations = ['top-right', 'bottom-right', 'bottom-left', 'top-left'];
    if (!validOrientations.includes(orientation)) {
        orientation = 'top-right'; // Default if invalid
    }
    
    // Update the data model
    currentGrid.cells[cellIndex].type = 'hst';
    currentGrid.cells[cellIndex].color1 = color1;
    currentGrid.cells[cellIndex].color2 = color2;
    currentGrid.cells[cellIndex].orientation = orientation;
    
    // Update the UI
    const cell = document.querySelector(`.grid-cell[data-x="${x}"][data-y="${y}"]`);
    if (cell) {
        cell.className = 'grid-cell hst';
        cell.setAttribute('data-orientation', orientation);
        cell.setAttribute('data-color1', color1);
        cell.setAttribute('data-color2', color2);
        
        // Remove any existing background color
        cell.style.backgroundColor = '';
        
        // Set the triangle colors using CSS variables
        cell.style.setProperty('--triangle-color1', color1);
        cell.style.setProperty('--triangle-color2', color2);
        
        // Show controls for touch devices
        showHSTControls(cell);
    }
}



