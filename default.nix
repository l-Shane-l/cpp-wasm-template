{ pkgs ? import <nixpkgs> { } }:

pkgs.mkShell {
  name = "cpp-wasm-env";

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
  ];

  shellHook = ''
    echo "C++ WebAssembly Development Environment"
    echo "----------------------------------------"
    echo "Available commands:"
    echo "  build-wasm    - Build the WebAssembly project"
    echo "  serve         - Serve the web directory on localhost:8000"
    
    # Define helper functions for the environment
    build-wasm() {
      mkdir -p build
      cd build
      emcmake cmake ..
      make
      make install
      # Symlink compile_commands.json to project root for IDE integration
      cd ..
    #      ln -sf build/compile_commands.json .
      # Check if files were correctly installed
      if [ ! -f "web/hello.js" ] || [ ! -f "web/hello.wasm" ]; then
        echo "Warning: Files may not have been installed correctly."
        echo "Manually copying files to web directory..."
        cp build/hello.js build/hello.wasm web/
      fi
      echo "Build complete! Files are in the web/ directory."
    }
    
    serve() {
      cd web
      python3 -m http.server 8000
    }
  '';
}
