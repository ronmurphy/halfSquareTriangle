// templates.js - Manages quilt block templates

// Template patterns for different block types
const blockTemplates = {
    "nine-patch": function(grid, width, height) {
        const cellSize = Math.floor(Math.min(width, height) / 3);
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {
                if ((x + y) % 2 === 1) { // Alternating pattern
                    fillArea(grid, x * cellSize, y * cellSize, cellSize, cellSize, '#A8DADC');
                }
            }
        }
    },
    "four-patch": function(grid, width, height) {
        const cellSize = Math.floor(Math.min(width, height) / 2);
        for (let y = 0; y < 2; y++) {
            for (let x = 0; x < 2; x++) {
                if ((x + y) % 2 === 1) { // Alternating pattern
                    fillArea(grid, x * cellSize, y * cellSize, cellSize, cellSize, '#A8DADC');
                }
            }
        }
    },
    "log-cabin": function(grid, width, height) {
        const size = Math.min(width, height);
        const center = Math.floor(size / 2);
        const colors = ['#E63946', '#457B9D', '#1D3557', '#F1FAEE', '#A8DADC'];
        
        // Center square
        fillArea(grid, center - 1, center - 1, 2, 2, colors[0]);
        
        // Spiral out layers
        let layer = 1;
        while (center - layer - 1 >= 0 && center + layer < size) {
            const colorIndex = layer % colors.length;
            
            // Top strip
            fillArea(grid, center - layer - 1, center - layer - 1, 2 * layer + 3, 1, colors[colorIndex]);
            
            // Right strip
            fillArea(grid, center + layer, center - layer, 1, 2 * layer + 1, colors[colorIndex]);
            
            // Bottom strip
            fillArea(grid, center - layer, center + layer, 2 * layer + 1, 1, colors[colorIndex]);
            
            // Left strip
            fillArea(grid, center - layer - 1, center - layer, 1, 2 * layer, colors[colorIndex]);
            
            layer++;
        }
    },
    "rail-fence": function(grid, width, height) {
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if ((Math.floor(x/2) + Math.floor(y/2)) % 2 === 0) {
                    setCellColor(grid, x, y, '#457B9D');
                }
            }
        }
    },
    "ohio-star": function(grid, width, height) {
    const size = Math.min(width, height);
    if (size < 3) return; // Too small for this pattern
    
    // Create a 3x3 grid of cells
    const cellSize = Math.floor(size / 3);
    
    // Center square
    fillArea(grid, cellSize, cellSize, cellSize, cellSize, '#E63946');
    
    // Corner squares (plain)
    fillArea(grid, 0, 0, cellSize, cellSize, '#FFFFFF');
    fillArea(grid, 2*cellSize, 0, cellSize, cellSize, '#FFFFFF');
    fillArea(grid, 0, 2*cellSize, cellSize, cellSize, '#FFFFFF');
    fillArea(grid, 2*cellSize, 2*cellSize, cellSize, cellSize, '#FFFFFF');
    
    // Side squares with HSTs (Quarter Square Triangles actually)
    fillHST(grid, cellSize, 0, cellSize, cellSize, '#457B9D', '#FFFFFF', 'top');
    fillHST(grid, 0, cellSize, cellSize, cellSize, '#457B9D', '#FFFFFF', 'left');
    fillHST(grid, 2*cellSize, cellSize, cellSize, cellSize, '#457B9D', '#FFFFFF', 'right');
    fillHST(grid, cellSize, 2*cellSize, cellSize, cellSize, '#457B9D', '#FFFFFF', 'bottom');
},

"sawtooth-star": function(grid, width, height) {
    const size = Math.min(width, height);
    if (size < 3) return; // Too small for this pattern
    
    const cellSize = Math.floor(size / 3);
    
    // Center square
    fillArea(grid, cellSize, cellSize, cellSize, cellSize, '#E63946');
    
    // Corner squares
    fillArea(grid, 0, 0, cellSize, cellSize, '#FFFFFF');
    fillArea(grid, 2*cellSize, 0, cellSize, cellSize, '#FFFFFF');
    fillArea(grid, 0, 2*cellSize, cellSize, cellSize, '#FFFFFF');
    fillArea(grid, 2*cellSize, 2*cellSize, cellSize, cellSize, '#FFFFFF');
    
    // Flying geese units in the sides (different from Ohio Star)
    fillHST(grid, cellSize, 0, cellSize, cellSize, '#1D3557', '#FFFFFF', 'top-left');
    fillHST(grid, 2*cellSize, cellSize, cellSize, cellSize, '#1D3557', '#FFFFFF', 'top-right');
    fillHST(grid, cellSize, 2*cellSize, cellSize, cellSize, '#1D3557', '#FFFFFF', 'bottom-right');
    fillHST(grid, 0, cellSize, cellSize, cellSize, '#1D3557', '#FFFFFF', 'bottom-left');
},
    "flying-geese": function(grid, width, height) {
    const size = Math.min(width, height);
    
    // Determine how many geese to place horizontally and vertically
    const geeseSizeH = Math.floor(size / 2); // Each goose is 2:1 ratio
    const geeseSizeV = Math.floor(geeseSizeH / 2);
    
    // Create a row of flying geese
    for (let x = 0; x < width; x += geeseSizeH) {
        for (let y = 0; y < height; y += geeseSizeV) {
            if (x + geeseSizeH <= width && y + geeseSizeV <= height) {
                // Create a "flying goose" - a right triangle
                fillHST(grid, x, y, geeseSizeH, geeseSizeV, '#457B9D', '#FFFFFF', 'top-right');
            }
        }
    }
},

"hst-pinwheel": function(grid, width, height) {
    const size = Math.min(width, height);
    if (size < 2) return; // Too small for this pattern
    
    const halfSize = Math.floor(size / 2);
    
    // Create a pinwheel pattern with 4 HSTs
    // Top-left HST
    fillHST(grid, 0, 0, halfSize, halfSize, '#457B9D', '#FFFFFF', 'top-right');
    
    // Top-right HST
    fillHST(grid, halfSize, 0, halfSize, halfSize, '#457B9D', '#FFFFFF', 'top-left');
    
    // Bottom-left HST
    fillHST(grid, 0, halfSize, halfSize, halfSize, '#457B9D', '#FFFFFF', 'bottom-right');
    
    // Bottom-right HST
    fillHST(grid, halfSize, halfSize, halfSize, halfSize, '#457B9D', '#FFFFFF', 'bottom-left');
},
        // Add after "hst-pinwheel" in the blockTemplates object:
    "churn-dash": function(grid, width, height) {
        // Implementation for Churn Dash pattern
    },
    "friendship-star": function(grid, width, height) {
        // Implementation for Friendship Star pattern
    },
    "card-trick": function(grid, width, height) {
        // Implementation for Card Trick pattern
    },
    "bear-paw": function(grid, width, height) {
        // Implementation for Bear Paw pattern
    },
    "shoofly": function(grid, width, height) {
        // Implementation for Shoofly pattern
    },
    "maple-leaf": function(grid, width, height) {
        // Implementation for Maple Leaf pattern
    }
};

// Helper function to apply a template to the grid
function applyTemplate(templateName) {
    console.log(`Applying template: ${templateName}`);
    
    if (!blockTemplates[templateName]) {
        console.error(`Template '${templateName}' not found`);
        return;
    }
    
    // Get grid dimensions
    const width = currentGrid.width;
    const height = currentGrid.height;
    
    // Apply the template function
    blockTemplates[templateName](currentGrid, width, height);
    
    // Update the visual grid
    updateGridDisplay();
}

// Helper function to fill an area with a color
function fillArea(grid, startX, startY, width, height, color) {
    for (let y = startY; y < startY + height && y < grid.height; y++) {
        for (let x = startX; x < startX + width && x < grid.width; x++) {
            setCellColor(grid, x, y, color);
        }
    }
}

// Helper function to set a cell's color
function setCellColor(grid, x, y, color) {
    // Update data model
    const cellIndex = y * grid.width + x;
    if (cellIndex >= 0 && cellIndex < grid.cells.length) {
        grid.cells[cellIndex].color = color;
    }
    
    // Update UI
    const cell = document.querySelector(`.grid-cell[data-x="${x}"][data-y="${y}"]`);
    if (cell) {
        cell.style.backgroundColor = color;
    }
}

// Helper function to create half-square triangles
// Replace the current fillHST function with this version in templates.js
function fillHST(grid, startX, startY, width, height, color1, color2, orientation = 'top-right') {
    for (let y = startY; y < startY + height && y < grid.height; y++) {
        for (let x = startX; x < startX + width && x < grid.width; x++) {
            const cellIndex = y * grid.width + x;
            if (cellIndex >= 0 && cellIndex < grid.cells.length) {
                // Update the cell to be an HST type with two colors
                grid.cells[cellIndex].type = 'hst';
                grid.cells[cellIndex].color1 = color1;
                grid.cells[cellIndex].color2 = color2;
                grid.cells[cellIndex].orientation = orientation;
                
                // Update the UI if cell exists
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
            }
        }
    }
}

// Function to update the grid display based on the current data model
function updateGridDisplay() {
    currentGrid.cells.forEach((cell, index) => {
        const x = cell.x;
        const y = cell.y;
        const color = cell.color;
        
        const cellElement = document.querySelector(`.grid-cell[data-x="${x}"][data-y="${y}"]`);
        if (cellElement) {
            cellElement.style.backgroundColor = color;
        }
    });
    
    // Update block counts
    updateBlockCounts();
}