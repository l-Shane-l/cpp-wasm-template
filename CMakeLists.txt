
cmake_minimum_required(VERSION 3.10)
project(WasmHelloWorld)

# Generate compile_commands.json for IDE integration
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

# Set C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Check if we're compiling to WebAssembly
if(EMSCRIPTEN)
    # Output directory for the final .js and .wasm files
    set(CMAKE_EXECUTABLE_SUFFIX ".js")
    
    # Create the executable
    add_executable(hello src/hello.cpp)
    
    # Emscripten-specific compilation flags
    set_target_properties(hello PROPERTIES
        LINK_FLAGS "-s WASM=1 -s EXPORTED_RUNTIME_METHODS=['ccall','cwrap'] -s EXPORTED_FUNCTIONS=['_sayHello','_add','_malloc','_free'] -s ALLOW_MEMORY_GROWTH=1 -s NO_EXIT_RUNTIME=1 --bind -O3"
    )
    
    # Install the build artifacts to the 'extension' directory with absolute path
    install(TARGETS hello DESTINATION ${CMAKE_SOURCE_DIR}/extension)
    install(FILES ${CMAKE_CURRENT_BINARY_DIR}/hello.wasm DESTINATION ${CMAKE_SOURCE_DIR}/extension)
else()
    message(FATAL_ERROR "This project is designed to be built with Emscripten. Please use emcmake.")
endif()

