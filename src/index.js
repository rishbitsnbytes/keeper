import App from "App";
import { makeServer } from "server";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider, NotesProvider } from "contexts";
import Portal from "Portal";
import { ScrollToTop } from "utils";
import React from "react";
import ReactDOM from "react-dom";

// Call make Server
makeServer();

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <NotesProvider>
          <ScrollToTop>
            <Portal />
            <App />
          </ScrollToTop>
        </NotesProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
