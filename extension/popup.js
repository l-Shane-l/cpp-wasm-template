// Instead of defining Module, we'll wait for it to be initialized
document.addEventListener("DOMContentLoaded", function () {
  // If Module is already initialized
  if (Module && Module.ccall) {
    setupButtons();
  } else {
    // Wait for Module to be initialized
    window.Module = window.Module || {};
    window.Module.onRuntimeInitialized = function () {
      console.log("WebAssembly module loaded!");
      setupButtons();
    };
  }

  function setupButtons() {
    // Set up the hello button
    document.getElementById("hello-btn").addEventListener("click", function () {
      const result = Module.ccall("sayHello", "string", [], []);
      document.getElementById("hello-result").textContent = result;
    });

    // Set up the add button
    document.getElementById("add-btn").addEventListener("click", function () {
      const num1 = parseInt(document.getElementById("num1").value);
      const num2 = parseInt(document.getElementById("num2").value);
      const result = Module.ccall(
        "add",
        "number",
        ["number", "number"],
        [num1, num2],
      );
      document.getElementById("add-result").textContent =
        `${num1} + ${num2} = ${result}`;
    });
  }
});
