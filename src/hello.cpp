#include <emscripten/emscripten.h>

extern "C" {
// Function exposed to JavaScript
EMSCRIPTEN_KEEPALIVE
const char *sayHello() { return "Hello from WebAssembly!"; }

// Function to add two numbers (simple example)
EMSCRIPTEN_KEEPALIVE
int add(int a, int b) { return a + b; }
}
