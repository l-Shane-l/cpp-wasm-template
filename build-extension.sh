#!/bin/bash

# Create directories
mkdir -p build extension extension/images

# Copy extension files
cp manifest.json extension/
cp popup.html extension/
cp popup.js extension/

# Generate icons

# Build the WebAssembly module
cd build
emcmake cmake ..
make
make install
cd ..

echo "Extension built successfully. Files are in the extension/ directory."
echo "To load the extension in Chrome:"
echo "1. Go to chrome://extensions/"
echo "2. Enable Developer mode"
echo "3. Click 'Load unpacked'"
echo "4. Select the 'extension' directory from this project"
