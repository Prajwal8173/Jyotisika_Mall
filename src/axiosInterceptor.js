import axios from "axios";

let trackedUrls = new Set();

function notifyReact(url, data) {
  window.dispatchEvent(
    new CustomEvent("apiDataUpdated", { detail: { url, data } })
  );
}

export function enableAxiosInterceptor(refreshInterval = 5000) {
  // Track API URLs on request
  axios.interceptors.request.use((config) => {
    if (config.url.includes("/User_Api_Controller/")) {
      trackedUrls.add(config.url);
    }
    return config;
  });

  // Periodically refresh tracked URLs
  setInterval(async () => {
    for (let url of trackedUrls) {
      try {
        const res = await axios.get(url);
        console.log("🔄 Auto-refreshed:", url, res.data);
        notifyReact(url, res.data);
      } catch (err) {
        console.error("Refresh failed:", url, err);
      }
    }
  }, refreshInterval);
}
