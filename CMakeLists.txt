cmake_minimum_required(VERSION 3.10)
project(IrishDictionaryExtension)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Check if we're compiling to WebAssembly
if(EMSCRIPTEN)
    # Create the executable
    add_executable(irish_parser src/html_parser.cpp)
    
    # Emscripten-specific compilation flags - NOTE THE --bind FLAG
    set_target_properties(irish_parser PROPERTIES
        LINK_FLAGS "-s WASM=1 -s ALLOW_MEMORY_GROWTH=1 -s NO_EXIT_RUNTIME=1 --bind -O3"
    )
    
    # Install the build artifacts to the extension directory
    install(TARGETS irish_parser DESTINATION ${CMAKE_SOURCE_DIR}/extension)
    install(FILES ${CMAKE_CURRENT_BINARY_DIR}/irish_parser.wasm DESTINATION ${CMAKE_SOURCE_DIR}/extension)
else()
    message(FATAL_ERROR "This project is designed to be built with Emscripten. Please use emcmake.")
endif()

