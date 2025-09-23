// apiInterceptor.js
const activeRequests = new Set();

export function enableApiInterceptor(refreshInterval = 5000, onDataUpdate) {
  const originalFetch = window.fetch;

  window.fetch = async (...args) => {
    const url = args[0];

    // Track only backend API calls (skip images, CSS, etc.)
    if (typeof url === "string" && url.includes("/api/")) {
      activeRequests.add(url);
    }

    return originalFetch(...args);
  };

  // Auto-refresh every X ms
  setInterval(async () => {
    for (let url of activeRequests) {
      try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("🔄 Auto-refreshed:", url, data);

        // Send updated data to React app (if handler provided)
        if (onDataUpdate) {
          onDataUpdate(url, data);
        }
      } catch (err) {
        console.error("Refresh failed:", url, err);
      }
    }
  }, refreshInterval);
}
