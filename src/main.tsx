import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";

if (/\/abbiamo\/?$/.test(window.location.pathname) && !window.location.hash) {
  window.history.replaceState(null, "", `${window.location.pathname.replace(/\/?$/, "/")}#/abbiamo`);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </HelmetProvider>
  </StrictMode>,
);
