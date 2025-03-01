// sidebar.js - Manages sidebar functionality

document.addEventListener('DOMContentLoaded', function() {
    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('full-width');
    });
    
    // Category buttons
    const categoryButtons = document.querySelectorAll('.category-button');
    const templateGroups = document.querySelectorAll('.template-group');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding template group
            templateGroups.forEach(group => {
                if (group.getAttribute('data-category') === category) {
                    group.classList.add('active');
                } else {
                    group.classList.remove('active');
                }
            });
        });
    });

    window.hstToolActive = false;
    window.currentOrientation = 'top-right';
    window.hstColor1 = '#457B9D'; // Default first color
    window.hstColor2 = '#FFFFFF'; // Default second color
    
    // Add HST tool button handler
    const hstToolButton = document.getElementById('hstToolButton');
    if (hstToolButton) {
        hstToolButton.addEventListener('click', function() {
            window.hstToolActive = !window.hstToolActive;
            
            if (window.hstToolActive) {
                this.classList.add('active');
                showMessage('HST Tool activated. Click cells to place half-square triangles. Right-click to rotate them.', 'info');
            } else {
                this.classList.remove('active');
            }
        });
    }
    
    // Add HST Tool to the tools section in HTML
    document.querySelector('.tool-buttons').insertAdjacentHTML('beforeend', `
        <button id="hstToolButton" class="sidebar-button">
            <svg viewBox="0 0 24 24" class="icon">
                <path d="M3 3h18v18H3z M3 3L21 21" />
            </svg>
            HST Tool
        </button>
    `);
    
    // Template selection
    const templateItems = document.querySelectorAll('.template-item');
    templateItems.forEach(item => {
        item.addEventListener('click', function() {
            const templateName = this.getAttribute('data-template');
            applyTemplate(templateName);
        });
    });
    
    // Design properties panel toggle
    const panelHeader = document.querySelector('.panel-header');
    const panelContent = document.querySelector('.panel-content');
    
    if (panelHeader && panelContent) {
        panelHeader.addEventListener('click', function() {
            panelContent.classList.toggle('visible');
            const toggleButton = this.querySelector('.toggle-button');
            if (panelContent.classList.contains('visible')) {
                toggleButton.innerHTML = '<svg viewBox="0 0 24 24" class="icon"><path d="M7 14l5-5 5 5z"/></svg>';
            } else {
                toggleButton.innerHTML = '<svg viewBox="0 0 24 24" class="icon"><path d="M7 10l5 5 5-5z"/></svg>';
            }
        });
    }
    
    // Color swatch selection
    const colorSwatches = document.querySelectorAll('.color-swatch');
    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', function() {
            const color = this.getAttribute('data-color');
            // Set as active color
            colorSwatches.forEach(s => s.classList.remove('active'));
            this.classList.add('active');
            // Set as current color for grid cells
            setActiveColor(color);
        });
    });

        // Add to your event listeners in sidebar.js
    const prevColorBtn = document.getElementById('prevColorPalette');
    const nextColorBtn = document.getElementById('nextColorPalette');
    const colorPalettes = document.querySelectorAll('.color-palette');
    let currentPaletteIndex = 0;
    
    if(prevColorBtn && nextColorBtn) {
        prevColorBtn.addEventListener('click', function() {
            colorPalettes[currentPaletteIndex].classList.remove('active');
            currentPaletteIndex = (currentPaletteIndex - 1 + colorPalettes.length) % colorPalettes.length;
            colorPalettes[currentPaletteIndex].classList.add('active');
        });
        
        nextColorBtn.addEventListener('click', function() {
            colorPalettes[currentPaletteIndex].classList.remove('active');
            currentPaletteIndex = (currentPaletteIndex + 1) % colorPalettes.length;
            colorPalettes[currentPaletteIndex].classList.add('active');
        });
    }



    // Add color button
    const colorPicker = document.getElementById('colorPicker');
    const addColorButton = document.getElementById('addColorButton');
    
    if (colorPicker && addColorButton) {
        addColorButton.addEventListener('click', function() {
            const color = colorPicker.value;
            addColorToRecent(color);
        });
    }
});

// Function to add a color to the recent colors palette
function addColorToRecent(color) {
    console.log(`Adding color to recents: ${color}`);
    
    // Create new swatch
    const swatch = document.createElement('div');
    swatch.className = 'color-swatch';
    swatch.style.backgroundColor = color;
    swatch.setAttribute('data-color', color);
    
    // Add click event
    swatch.addEventListener('click', function() {
        const swatchColor = this.getAttribute('data-color');
        document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
        this.classList.add('active');
        setActiveColor(swatchColor);
    });
    
    // Add to recent colors (limited to first 6)
    const recentColors = document.getElementById('recentColors');
    if (recentColors) {
        if (recentColors.children.length >= 6) {
            recentColors.removeChild(recentColors.lastChild);
        }
        recentColors.insertBefore(swatch, recentColors.firstChild);
    }

    function setupCellClickHandlers() {
        const cells = document.querySelectorAll('.grid-cell');
        cells.forEach(cell => {
            cell.addEventListener('click', function(e) {
                const x = parseInt(this.getAttribute('data-x'));
                const y = parseInt(this.getAttribute('data-y'));
                
                if (hstToolActive) {
                    // Place HST
                    placeHST(x, y, hstColor1, hstColor2, currentOrientation);
                    
                    // Toggle orientation on right click or long press
                    if (e.button === 2) { // Right click
                        rotateHST(x, y);
                    }
                } else {
                    // Regular color fill
                    this.style.backgroundColor = currentGrid.activeColor;
                    
                    // Update cell data
                    const cellIndex = y * currentGrid.width + x;
                    currentGrid.cells[cellIndex].color = currentGrid.activeColor;
                    currentGrid.cells[cellIndex].type = 'square';
                    
                    updateBlockCounts();
                }
            });
            
            // Add right-click handler for rotating HSTs
            cell.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                
                if (hstToolActive) {
                    const x = parseInt(this.getAttribute('data-x'));
                    const y = parseInt(this.getAttribute('data-y'));
                    rotateHST(x, y);
                }
            });
        });
    }
    
    // Function to place an HST
    function placeHST(x, y, color1, color2, orientation) {
        const cellIndex = y * currentGrid.width + x;
        
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
        }
        
        updateBlockCounts();
    }
    
    // Function to rotate an HST
    function rotateHST(x, y) {
        const cell = document.querySelector(`.grid-cell[data-x="${x}"][data-y="${y}"]`);
        if (!cell || cell.className.indexOf('hst') === -1) return;
        
        const orientations = ['top-right', 'bottom-right', 'bottom-left', 'top-left'];
        const currentOrientation = cell.getAttribute('data-orientation') || 'top-right';
        const currentIndex = orientations.indexOf(currentOrientation);
        const newOrientation = orientations[(currentIndex + 1) % orientations.length];
        
        // Update the cell
        cell.setAttribute('data-orientation', newOrientation);
        
        // Update the data model
        const cellIndex = y * currentGrid.width + x;
        currentGrid.cells[cellIndex].orientation = newOrientation;
    }


}