# Quilt Block Designer

## Overview
The Quilt Block Designer is a web application that allows users to create and design quilt blocks on a grid. Users can select colors, shapes, and sizes for their blocks, and the application provides functionality to save their designs as PNG images. Additionally, it generates a list of needed blocks, sizes, and colors for easy reference.

## Features
- Interactive grid for designing quilt blocks
- Color and shape selection tools
- Save designs as PNG images
- Generate a list of required blocks, sizes, and colors

## Project Structure
```
quilt-block-designer
├── index.html          # Main HTML document
├── css
│   ├── style.css      # Main styles for the application
│   └── grid.css       # Styles for the grid layout
├── js
│   ├── app.js         # Entry point for the JavaScript application
│   ├── grid.js        # Grid creation and manipulation
│   ├── design.js      # Quilt block design logic
│   ├── export.js      # Export functionality for PNG images
│   └── utilities.js    # Utility functions
├── assets
│   └── icons
│       ├── save.svg   # Icon for save functionality
│       └── palette.svg # Icon for color palette selection
└── README.md          # Project documentation
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd quilt-block-designer
   ```
3. Open `index.html` in your web browser to start using the application.

## Usage
- Use the grid to design your quilt block by clicking on the cells to fill them with color.
- Select colors and shapes from the palette.
- Once your design is complete, click the save button to download your design as a PNG image.
- The application will also generate a list of blocks needed for your design.

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request with your changes. 

## License
This project is licensed under the MIT License.