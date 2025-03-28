{ pkgs ? import <nixpkgs> { } }:

pkgs.mkShell {
  name = "cpp-wasm-extension-env";

  buildInputs = with pkgs; [
    # Basic development tools
    gcc
    cmake
    gnumake

    # Clang tools for IDE integration
    clang-tools

    # Emscripten - the WASM compiler toolkit
    emscripten

    bear

    # Python for emscripten and serving
    python3

    # Node.js for testing
    nodejs

    # For generating icons
    imagemagick
  ];

  shellHook = ''
    echo "C++ WebAssembly Chrome Extension Development Environment"
    echo "-------------------------------------------------------"
    echo "Available commands:"
    echo "  build-extension  - Build the WebAssembly project for Chrome extension"
    echo "  generate-icons   - Generate icons for the extension"
    
    # Define helper functions for the environment
    build-extension() {
      mkdir -p build
      cd build
      emcmake cmake ..
      make
      make install
      cd ..
      # Check if files were correctly installed
      if [ ! -f "extension/hello.js" ] || [ ! -f "extension/hello.wasm" ]; then
        echo "Warning: Files may not have been installed correctly."
        echo "Manually copying files to extension directory..."
        mkdir -p extension
        cp build/hello.js build/hello.wasm extension/
      fi
      echo "Build complete! Files are in the extension/ directory."
    }
    
    generate-icons() {
      mkdir -p extension/images
      # Generate a simple green square icon with W letter for WebAssembly
      convert -size 128x128 xc:green -fill white -gravity center -pointsize 80 -annotate 0 "W" extension/images/icon128.png
      convert extension/images/icon128.png -resize 48x48 extension/images/icon48.png
      convert extension/images/icon128.png -resize 16x16 extension/images/icon16.png
      echo "Icons generated in extension/images directory."
    }
  '';
}
