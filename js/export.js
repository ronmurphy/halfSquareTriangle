function exportDesignAsPNG(canvasId, filename) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error('Canvas not found');
        return;
    }

    canvas.toBlob(function(blob) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename || 'quilt-block-design.png';
        link.click();
    }, 'image/png');
}

function generateBlockList(design) {
    const blockList = {};
    
    design.forEach(block => {
        const key = `${block.size}-${block.color}`;
        if (!blockList[key]) {
            blockList[key] = 0;
        }
        blockList[key]++;
    });

    return blockList;
}

// export.js - Handles exporting designs

// Export the design as a PNG image
function exportAsPNG() {
    const gridContainer = document.querySelector('.grid');
    if (!gridContainer) {
        showMessage('No grid to export', 'error');
        return;
    }
    
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const gridWidth = currentGrid.width;
    const gridHeight = currentGrid.height;
    
    // Set canvas size (40px per cell)
    const cellSize = 40;
    canvas.width = gridWidth * cellSize;
    canvas.height = gridHeight * cellSize;
    
    const ctx = canvas.getContext('2d');
    
    // Draw the grid
    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            const cellIndex = y * gridWidth + x;
            const color = currentGrid.cells[cellIndex].color;
            
            ctx.fillStyle = color;
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            
            // Add cell border
            ctx.strokeStyle = '#ccc';
            ctx.lineWidth = 1;
            ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }
    
    // Create download link
    const link = document.createElement('a');
    const projectName = currentGrid.projectName || 'quilt-design';
    link.download = `${projectName}.png`;
    link.href = canvas.toDataURL('image/png');
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Export design as JSON file
function exportAsJSON() {
    const designData = {
        name: currentGrid.projectName || 'Untitled',
        timestamp: new Date().toISOString(),
        grid: JSON.parse(JSON.stringify(currentGrid))
    };
    
    // Convert to JSON string
    const jsonString = JSON.stringify(designData, null, 2);
    
    // Create download link
    const link = document.createElement('a');
    const projectName = designData.name.replace(/\s+/g, '-').toLowerCase();
    link.download = `${projectName}.quiltblock.json`;
    
    // Create blob and set link href
    const blob = new Blob([jsonString], { type: 'application/json' });
    link.href = URL.createObjectURL(blob);
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Export design as PDF with cutting requirements
// PDF export function
function exportToPDF() {
    showMessage('Preparing PDF export...', 'info');
    
    // For a full implementation, you'd use a library like jsPDF
    // This is a simplified version that creates a preview window
    // In production, replace this with actual PDF generation
    
    const gridContainer = document.querySelector('.grid');
    const canvas = document.createElement('canvas');
    const gridWidth = currentGrid.width;
    const gridHeight = currentGrid.height;
    
    // Set canvas size (40px per cell)
    const cellSize = 40;
    canvas.width = gridWidth * cellSize;
    canvas.height = gridHeight * cellSize;
    
    const ctx = canvas.getContext('2d');
    
    // Draw the grid (same code as in exportAsPNG)
    // ... (rendering code)
    
    // Get the image data
    const imageDataUrl = canvas.toDataURL('image/png');
    
    // Get block counts
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
    
    // Create PDF preview (in production, use jsPDF)
    const newWindow = window.open('', '_blank');
    newWindow.document.write(`
        <html>
        <head>
            <title>${currentGrid.projectName} - Quilt Design</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { color: #6a4c93; }
                .pdf-container { max-width: 800px; margin: 0 auto; }
                .image-container { text-align: center; margin: 20px 0; }
                img { max-width: 100%; border: 1px solid #ddd; }
                .color-sample { display: inline-block; width: 20px; height: 20px; margin-right: 10px; vertical-align: middle; border: 1px solid #ccc; }
                .hst-sample { 
                    display: inline-block; 
                    width: 30px; 
                    height: 30px; 
                    margin-right: 10px;
                    position: relative;
                    vertical-align: middle;
                }
                .hst-sample:before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: var(--triangle-color1);
                    clip-path: polygon(0 0, 100% 0, 0 100%);
                }
                .hst-sample:after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: var(--triangle-color2);
                    clip-path: polygon(100% 0, 100% 100%, 0 100%);
                }
                .block-item { margin-bottom: 8px; }
                .section { margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-radius: 5px; }
                h2 { color: #457B9D; }
            </style>
        </head>
        <body>
            <div class="pdf-container">
                <h1>${currentGrid.projectName}</h1>
                <div class="section">
                    <h2>Quilt Details</h2>
                    <p><strong>Grid size:</strong> ${currentGrid.width} × ${currentGrid.height}</p>
                    <p><strong>Total blocks:</strong> ${currentGrid.width * currentGrid.height}</p>
                </div>
                
                <div class="image-container">
                    <h2>Design Preview</h2>
                    <img src="${imageDataUrl}" alt="Quilt Design">
                </div>
                
                <div class="section">
                    <h2>Blocks Required</h2>
    `);
    
    // Add solid squares
    if (Object.keys(blockCounts.squares).length > 0) {
        newWindow.document.write(`
            <h3>Solid Squares</h3>
        `);
        
        Object.keys(blockCounts.squares).forEach(color => {
            newWindow.document.write(`
                <div class="block-item">
                    <div class="color-sample" style="background-color: ${color}"></div>
                    <span>${blockCounts.squares[color]} blocks - Color: ${color}</span>
                </div>
            `);
        });
    }
    
    // Add HSTs
    if (Object.keys(blockCounts.hst).length > 0) {
        newWindow.document.write(`
            <h3>Half-Square Triangles</h3>
        `);
        
        Object.keys(blockCounts.hst).forEach(colorKey => {
            const [color1, color2] = colorKey.split('_');
            newWindow.document.write(`
                <div class="block-item">
                    <div class="hst-sample" style="--triangle-color1: ${color1}; --triangle-color2: ${color2};"></div>
                    <span>${blockCounts.hst[colorKey]} blocks - Colors: ${color1} & ${color2}</span>
                </div>
            `);
        });
    }
    
    newWindow.document.write(`
                </div>
                <div class="section">
                    <h2>Notes</h2>
                    <p>This document was generated from your quilt block design. For best results, print this PDF for reference.</p>
                </div>
            </div>
        </body>
        </html>
    `);
    
    newWindow.document.close();
    newWindow.focus();
    
    // In a production environment, we'd use jsPDF library to create an actual PDF
    showMessage('PDF preview generated. Use browser print function to save as PDF.', 'success');
}

// Handle the export button click
document.addEventListener('DOMContentLoaded', function() {
    const exportButton = document.getElementById('exportButton');
    if (exportButton) {
        exportButton.addEventListener('click', function() {
            if (!currentGrid.projectName || currentGrid.projectName === 'Untitled') {
                promptProjectName(function(name) {
                    if (name) {
                        currentGrid.projectName = name;
                        document.getElementById('projectName').textContent = name;
                        exportDesign();
                    }
                });
            } else {
                exportDesign();
            }
        });
    }

    const exportPdfButton = document.getElementById('exportPdfButton');
    if (exportPdfButton) {
        exportPdfButton.addEventListener('click', function() {
            if (!currentGrid.projectName || currentGrid.projectName === 'Untitled') {
                promptProjectName(function(name) {
                    if (name) {
                        currentGrid.projectName = name;
                        document.getElementById('projectName').textContent = name;
                        exportToPDF();
                    }
                });
            } else {
                exportToPDF();
            }
        });
    }

});

// Add a project name prompt
function promptProjectName(callback) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-button">&times;</span>
            <h2>Export Project</h2>
            <div class="form-group">
                <label for="exportProjectName">Project Name:</label>
                <input type="text" id="exportProjectName" placeholder="My Quilt Block" value="My Quilt Project">
            </div>
            <div class="form-group">
                <button id="confirmExportName" class="primary-button">Continue</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Set up event handlers
    const closeBtn = modal.querySelector('.close-button');
    const confirmBtn = modal.querySelector('#confirmExportName');
    const nameInput = modal.querySelector('#exportProjectName');
    
    closeBtn.addEventListener('click', function() {
        document.body.removeChild(modal);
        callback(null);
    });
    
    confirmBtn.addEventListener('click', function() {
        const name = nameInput.value || 'My Quilt Project';
        document.body.removeChild(modal);
        callback(name);
    });
    
    nameInput.focus();
}

// Comprehensive export function
function exportDesign() {
    // Get project name - use sanitized version for filenames
    const projectName = currentGrid.projectName || 'quilt-design';
    const filePrefix = projectName.replace(/\s+/g, '-').toLowerCase();
    
    // Export PNG image
    exportAsPNG(filePrefix);
    
    // Export block list as TXT
    exportBlockList(filePrefix);
}

// Update the PNG export function
function exportAsPNG(filePrefix) {
    const gridContainer = document.querySelector('.grid');
    if (!gridContainer) {
        showMessage('No grid to export', 'error');
        return;
    }
    
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const gridWidth = currentGrid.width;
    const gridHeight = currentGrid.height;
    
    // Set canvas size (40px per cell)
    const cellSize = 40;
    canvas.width = gridWidth * cellSize;
    canvas.height = gridHeight * cellSize;
    
    const ctx = canvas.getContext('2d');
    
    // Draw the grid
    currentGrid.cells.forEach(cell => {
        const x = cell.x;
        const y = cell.y;
        
        if (cell.type === 'square') {
            ctx.fillStyle = cell.color;
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        } 
        else if (cell.type === 'hst') {
            // Draw first triangle
            ctx.fillStyle = cell.color1;
            ctx.beginPath();
            
            // Draw different triangle paths based on orientation
            switch(cell.orientation) {
                case 'top-right':
                    ctx.moveTo(x * cellSize, y * cellSize);
                    ctx.lineTo((x + 1) * cellSize, y * cellSize);
                    ctx.lineTo(x * cellSize, (y + 1) * cellSize);
                    break;
                case 'top-left':
                    ctx.moveTo(x * cellSize, y * cellSize);
                    ctx.lineTo((x + 1) * cellSize, y * cellSize);
                    ctx.lineTo((x + 1) * cellSize, (y + 1) * cellSize);
                    break;
                case 'bottom-left':
                    ctx.moveTo(x * cellSize, (y + 1) * cellSize);
                    ctx.lineTo((x + 1) * cellSize, (y + 1) * cellSize);
                    ctx.lineTo((x + 1) * cellSize, y * cellSize);
                    break;
                case 'bottom-right':
                    ctx.moveTo(x * cellSize, y * cellSize);
                    ctx.lineTo(x * cellSize, (y + 1) * cellSize);
                    ctx.lineTo((x + 1) * cellSize, (y + 1) * cellSize);
                    break;
                // Add other orientations if needed
            }
            ctx.closePath();
            ctx.fill();
            
            // Draw second triangle
            ctx.fillStyle = cell.color2;
            ctx.beginPath();
            
            switch(cell.orientation) {
                case 'top-right':
                    ctx.moveTo((x + 1) * cellSize, y * cellSize);
                    ctx.lineTo((x + 1) * cellSize, (y + 1) * cellSize);
                    ctx.lineTo(x * cellSize, (y + 1) * cellSize);
                    break;
                case 'top-left':
                    ctx.moveTo(x * cellSize, y * cellSize);
                    ctx.lineTo(x * cellSize, (y + 1) * cellSize);
                    ctx.lineTo((x + 1) * cellSize, (y + 1) * cellSize);
                    break;
                case 'bottom-left':
                    ctx.moveTo(x * cellSize, y * cellSize);
                    ctx.lineTo((x + 1) * cellSize, y * cellSize);
                    ctx.lineTo(x * cellSize, (y + 1) * cellSize);
                    break;
                case 'bottom-right':
                    ctx.moveTo((x + 1) * cellSize, y * cellSize);
                    ctx.lineTo(x * cellSize, y * cellSize);
                    ctx.lineTo((x + 1) * cellSize, (y + 1) * cellSize);
                    break;
                // Add other orientations if needed
            }
            ctx.closePath();
            ctx.fill();
        }
        
        // Add cell border
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 1;
        ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
    });
    
    // Create download link
    const link = document.createElement('a');
    link.download = `${filePrefix}.png`;
    link.href = canvas.toDataURL('image/png');
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Add block list export
function exportBlockList(filePrefix) {
    // Get block counts
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
    
    // Create text content
    let textContent = `QUILT BLOCK PROJECT: ${currentGrid.projectName}\n`;
    textContent += `=================================\n\n`;
    textContent += `Grid size: ${currentGrid.width} × ${currentGrid.height}\n\n`;
    textContent += `BLOCKS REQUIRED:\n`;
    textContent += `---------------\n\n`;
    
    // Add solid squares
    if (Object.keys(blockCounts.squares).length > 0) {
        textContent += `SOLID SQUARES:\n`;
        Object.keys(blockCounts.squares).forEach(color => {
            textContent += `  ${blockCounts.squares[color]} blocks - Color: ${color}\n`;
        });
        textContent += `\n`;
    }
    
    // Add HSTs
    if (Object.keys(blockCounts.hst).length > 0) {
        textContent += `HALF-SQUARE TRIANGLES:\n`;
        Object.keys(blockCounts.hst).forEach(colorKey => {
            const [color1, color2] = colorKey.split('_');
            textContent += `  ${blockCounts.hst[colorKey]} blocks - Colors: ${color1} & ${color2}\n`;
        });
    }
    
    // Create blob and download link
    const blob = new Blob([textContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.download = `${filePrefix}-blocks.txt`;
    link.href = URL.createObjectURL(blob);
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}