# C++ WebAssembly Hello World with CMake and Nix

This is a starter project for C++ WebAssembly development using CMake and Nix.

## Project Structure

```
cpp-wasm-hello-world/
├── build/              # Build output directory
├── src/                # C++ source files
│   └── hello.cpp       # Main source file with WASM exports
├── web/                # Web files
│   └── index.html      # HTML to load and interact with WASM
├── CMakeLists.txt      # CMake configuration
├── default.nix         # Nix development environment
├── shell.nix           # Simple wrapper for default.nix
└── README.md           # This file
```

## Requirements

- [Nix package manager](https://nixos.org/download.html)
- Alternatively: Emscripten, CMake, and a web server

## Getting Started with Nix

1. Enter the development environment:

```bash
nix-shell
```

2. Build the WebAssembly module:

```bash
build-wasm
```

3. Start a local web server:

```bash
serve
```

4. Open your browser and navigate to http://localhost:8000

## Manual Setup (without Nix)

If you prefer not to use Nix, you'll need to install:

1. [Emscripten](https://emscripten.org/docs/getting_started/downloads.html)
2. [CMake](https://cmake.org/download/)

Then build manually:

```bash
mkdir -p build
cd build
emcmake cmake ..
make
make install
cd ../web
python -m http.server 8000  # Or any other web server
```

## What's Included

- **C++ to WebAssembly Compilation**: Using Emscripten
- **CMake Configuration**: For cross-platform build setup
- **Two Example Functions**:
  - `sayHello()`: Returns a string
  - `add(a, b)`: Adds two numbers
- **HTML Interface**: For interacting with the WebAssembly module
- **Nix Development Environment**: For consistent, reproducible builds

## Extending the Project

- Add more functions to `src/hello.cpp`
- Expose them by adding them to the `-s EXPORTED_FUNCTIONS` list in CMakeLists.txt
- Use them in your JavaScript code with `Module.ccall()`

## Resources

- [Emscripten Documentation](https://emscripten.org/docs/index.html)
- [WebAssembly Reference](https://webassembly.github.io/spec/)
- [CMake Documentation](https://cmake.org/documentation/)
- [Nix Package Manager](https://nixos.org/manual/nix/stable/)
# cpp-wasm-template
