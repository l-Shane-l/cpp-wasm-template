#include <emscripten/bind.h>
#include <regex>
#include <string>

using namespace emscripten;

// Extract translations from HTML
val parseIrishDictionary(const std::string &html, const std::string &word) {
  // Create result object
  val result = val::object();
  result.set("word", word);

  // Extract translations using regex
  std::regex translationRegex("<span class=\"fgb r clickable\">([^<]+)</span>");
  std::string::const_iterator searchStart = html.cbegin();
  std::smatch matches;

  val translations = val::array();
  int count = 0;

  while (
      std::regex_search(searchStart, html.cend(), matches, translationRegex)) {
    if (matches.size() > 1) {
      std::string translation = matches[1].str();
      translation =
          std::regex_replace(translation, std::regex("^\\s+|\\s+$"), "");
      if (!translation.empty()) {
        translations.set(count++, translation);
      }
    }
    searchStart = matches.suffix().first;
  }

  result.set("translations", translations);
  return result;
}

// Expose the function to JavaScript
EMSCRIPTEN_BINDINGS(irish_dictionary_module) {
  function("parseIrishDictionary", &parseIrishDictionary);
}
