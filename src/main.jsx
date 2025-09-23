import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App.jsx";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-icons/font/bootstrap-icons.css";
import { ApiProvider } from "./ApiContext.jsx";

// ✅ Import interceptor
import { enableAxiosInterceptor } from "./axiosInterceptor.js";

// Enable API interceptor globally
enableAxiosInterceptor(3000, (url, data) => {
  console.log("📢 Updated from API:", url, data);
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ApiProvider>
    <App />
    </ApiProvider>
  </StrictMode>
);
