function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function isValidColor(color) {
    const s = new Option().style;
    s.color = color;
    return s.color !== '';
}

function createGrid(rows, cols) {
    const grid = [];
    for (let i = 0; i < rows; i++) {
        grid[i] = Array(cols).fill(null);
    }
    return grid;
}

function clearGrid(grid) {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            grid[i][j] = null;
        }
    }
}

function getBlockSize(grid) {
    return {
        width: grid[0].length,
        height: grid.length
    };
}

// utilities.js - General utility functions

// Show message to user
function showMessage(message, type = 'info') {
    // Create message box if it doesn't exist
    let messageBox = document.getElementById('messageBox');
    
    if (!messageBox) {
        messageBox = document.createElement('div');
        messageBox.id = 'messageBox';
        document.body.appendChild(messageBox);
    }
    
    // Set message content and type
    messageBox.textContent = message;
    messageBox.className = type;
    messageBox.style.display = 'block';
    
    // Hide after 3 seconds
    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 3000);
}

// Debounce function to limit how often a function can be called
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

// Get URL parameters as an object
function getUrlParams() {
    const params = {};
    const queryString = window.location.search.substring(1);
    const pairs = queryString.split('&');
    
    for (const pair of pairs) {
        const [key, value] = pair.split('=');
        if (key) {
            params[decodeURIComponent(key)] = decodeURIComponent(value || '');
        }
    }
    
    return params;
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

// Detect touch support
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints;
}