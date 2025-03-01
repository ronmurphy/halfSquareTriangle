// design.js - Manages design state and operations

let designHistory = [];
let currentHistoryIndex = -1;

// Save current design state
function saveDesignState() {
    // Clone the current grid to avoid reference issues
    const gridClone = JSON.parse(JSON.stringify(currentGrid));
    
    // If we're not at the end of the history, remove future states
    if (currentHistoryIndex < designHistory.length - 1) {
        designHistory = designHistory.slice(0, currentHistoryIndex + 1);
    }
    
    // Add the current state to history
    designHistory.push(gridClone);
    currentHistoryIndex = designHistory.length - 1;
    
    // Limit history size
    if (designHistory.length > 20) {
        designHistory.shift();
        currentHistoryIndex--;
    }
}

// Undo function
function undoDesign() {
    if (currentHistoryIndex > 0) {
        currentHistoryIndex--;
        restoreDesignState(designHistory[currentHistoryIndex]);
    }
}

// Redo function
function redoDesign() {
    if (currentHistoryIndex < designHistory.length - 1) {
        currentHistoryIndex++;
        restoreDesignState(designHistory[currentHistoryIndex]);
    }
}

// Restore a design state
function restoreDesignState(state) {
    if (!state) return;
    
    currentGrid.width = state.width;
    currentGrid.height = state.height;
    currentGrid.cells = state.cells;
    
    // Update the UI
    updateGridDisplay();
}

// Save design to local storage
function saveDesign(name = null) {
    if (!name) {
        name = currentGrid.projectName || 'Untitled';
    }
    
    const designData = {
        name: name,
        timestamp: new Date().toISOString(),
        grid: JSON.parse(JSON.stringify(currentGrid))
    };
    
    // Get existing designs
    let savedDesigns = JSON.parse(localStorage.getItem('quiltBlockDesigns')) || {};
    
    // Add/update this design
    savedDesigns[name] = designData;
    
    // Save back to localStorage
    try {
        localStorage.setItem('quiltBlockDesigns', JSON.stringify(savedDesigns));
        showMessage('Design saved successfully', 'success');
    } catch (e) {
        showMessage('Error saving design: ' + e.message, 'error');
    }
}

// Load design from local storage
function loadDesign(name) {
    const savedDesigns = JSON.parse(localStorage.getItem('quiltBlockDesigns')) || {};
    const design = savedDesigns[name];
    
    if (design) {
        restoreDesignState(design.grid);
        currentGrid.projectName = design.name;
        
        // Update UI
        document.getElementById('projectName').textContent = design.name;
        document.getElementById('gridDimensions').textContent = `${design.grid.width} × ${design.grid.height}`;
        document.getElementById('blockSize').textContent = `${design.grid.width * design.grid.height} cells`;
        
        // Save to history
        saveDesignState();
        
        showMessage('Design loaded successfully', 'success');
    } else {
        showMessage('Design not found', 'error');
    }
}

// Load saved designs into the load project modal
function populateSavedDesigns() {
    const savedDesignsList = document.getElementById('savedProjectsList');
    if (!savedDesignsList) return;
    
    // Clear the list
    savedDesignsList.innerHTML = '';
    
    // Get saved designs
    const savedDesigns = JSON.parse(localStorage.getItem('quiltBlockDesigns')) || {};
    const designNames = Object.keys(savedDesigns);
    
    if (designNames.length === 0) {
        savedDesignsList.innerHTML = '<div class="empty-message">No saved projects found</div>';
        return;
    }
    
    // Add each design to the list
    designNames.forEach(name => {
        const design = savedDesigns[name];
        const projectItem = document.createElement('div');
        projectItem.className = 'project-item';
        
        const nameElement = document.createElement('div');
        nameElement.className = 'project-name';
        nameElement.textContent = design.name;
        
        const timestamp = new Date(design.timestamp);
        const dateString = timestamp.toLocaleDateString() + ' ' + timestamp.toLocaleTimeString();
        
        const timeElement = document.createElement('div');
        timeElement.className = 'timestamp';
        timeElement.textContent = dateString;
        
        projectItem.appendChild(nameElement);
        projectItem.appendChild(timeElement);
        
        projectItem.addEventListener('click', function() {
            loadDesign(design.name);
            hideModal('loadProjectModal');
        });
        
        savedDesignsList.appendChild(projectItem);
    });
}