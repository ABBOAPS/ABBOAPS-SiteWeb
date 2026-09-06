import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import "./styles/press-mentions.css";

const isDirectCrawlableEntry =
  !window.location.hash && (/^\/abbiamo\/?$/.test(window.location.pathname) || /^\/news\/[^/]+\/?$/.test(window.location.pathname));
const Router = isDirectCrawlableEntry ? BrowserRouter : HashRouter;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <Router>
        <App />
      </Router>
    </HelmetProvider>
  </StrictMode>,
);
