/* eslint-disable no-lone-blocks */
import React from "react";
import "./App.css";
import SearchComponent from "./components/SearchComponent";
import ResponseItem from "./components/SearchResponseList";
import ParameterPanel from "./components/ParameterPanel";
import { SearchProvider, SearchContext } from "./context/SearchContext";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * The main application component.
 *
 * Renders the search bar, summary, and search results.
 *
 * @returns {JSX.Element} The JSX element representing the application.
 */
function App() {
  return (
    <SearchProvider>
      <div className="bg-gradient-to-r from-sky-500 to-indigo-500 min-h-screen flex flex-col items-center">
        <div className="w-full px-4 pt-16">
          <h1 className="text-2xl font-bold text-center text-white mb-6">
            Vertex AI Search Engine Demo
          </h1>
          <div className="flex w-full items-start justify-start mb-8 ml-4">
            <SearchComponent />
          </div>

          <div className="bg-white rounded-md p-4 w-full mb-8">
            <div className="flex items-start">
              <img
                src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-gemini-icon.png"
                alt="gemini"
                className="w-6 h-6 mr-4"
              />
              <div className="block">
                <p className="text-xs">Summary</p>
                <SearchContext.Consumer>
                  {({ searchResults }) => (
                    <h1 className="text-xl font-medium text-start mb-6">
                      {searchResults && searchResults.summary
                        ? searchResults.summary.summaryText
                        : "Summary will appear here for your answers"}
                    </h1>
                  )}
                </SearchContext.Consumer>
              </div>
            </div>
          </div>
          <div className="flex items-baseline">
            <ParameterPanel />
            <SearchContext.Consumer>
              {({ searchResults }) => {
                const summaryText =
                  searchResults?.summary?.summaryText ??
                  "Summary will appear here for your answers";

                return (
                  <div className="prose max-w-none text-gray-800">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {summaryText}
                    </ReactMarkdown>
                  </div>
                );
              }}
            </SearchContext.Consumer>
          </div>
        </div>
      </div>
    </SearchProvider>
  );
}

export default App;
