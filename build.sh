#!/bin/bash

# Create necessary directories
mkdir -p extension/images
mkdir -p src

# Copy HTML parser source to src directory
cp html_parser.cpp src/

# Generate icons using ImageMagick
convert -size 128x128 xc:#4CAF50 -fill white -gravity center -pointsize 80 -annotate 0 "G" extension/images/icon128.png
convert extension/images/icon128.png -resize 48x48 extension/images/icon48.png
convert extension/images/icon128.png -resize 16x16 extension/images/icon16.png

# Build the WebAssembly module
mkdir -p build
cd build
emcmake cmake ..
make
make install
cd ..

# Copy extension files
cp manifest.json extension/
cp popup.html extension/
cp popup.js extension/
cp background.js extension/
cp content.js extension/
cp tooltip.css extension/

echo "Build complete! Extension files are in the 'extension' directory."
echo "To install in Chrome:"
echo "1. Go to chrome://extensions/"
echo "2. Enable 'Developer mode'"
echo "3. Click 'Load unpacked'"
echo "4. Select the 'extension' directory"
