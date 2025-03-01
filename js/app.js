// app.js - Main application code

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    console.log('Quilt Block Designer initialized');
    
    // Add event listeners for modal opening
    const newProjectButton = document.getElementById('newProjectButton');
    if (newProjectButton) {
        newProjectButton.addEventListener('click', function() {
            showModal('newProjectModal');
        });
    }
    
    const loadProjectButton = document.getElementById('loadProjectButton');
    if (loadProjectButton) {
        loadProjectButton.addEventListener('click', function() {
            showModal('loadProjectModal');
            populateSavedDesigns();
        });
    }
    
    const saveButton = document.getElementById('saveButton');
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            saveDesign();
        });
    }

    // Set up tab navigation in modals
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab button
            tabButtons.forEach(btn => {
                if (btn.getAttribute('data-tab') === tabId) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            
            // Update tab content visibility
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(content => {
                if (content.id === tabId) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
        });
    });
    
    // Import project functionality
    const importButton = document.getElementById('importButton');
    if (importButton) {
        importButton.addEventListener('click', function() {
            const fileInput = document.getElementById('importFile');
            if (fileInput && fileInput.files.length > 0) {
                const file = fileInput.files[0];
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        const design = JSON.parse(e.target.result);
                        restoreDesignState(design.grid);
                        currentGrid.projectName = design.name;
                        
                        // Update UI
                        document.getElementById('projectName').textContent = design.name;
                        document.getElementById('gridDimensions').textContent = 
                            `${design.grid.width} × ${design.grid.height}`;
                        document.getElementById('blockSize').textContent = 
                            `${design.grid.width * design.grid.height} cells`;
                        
                        hideModal('loadProjectModal');
                        showMessage('Design imported successfully', 'success');
                    } catch (error) {
                        showMessage('Error importing design: ' + error.message, 'error');
                    }
                };
                
                reader.readAsText(file);
            } else {
                showMessage('Please select a file to import', 'error');
            }
        });
    }
});

// Show a modal dialog
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

// Hide a modal dialog
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
});