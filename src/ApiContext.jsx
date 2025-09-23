import React, { createContext, useContext, useState, useEffect } from "react";

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const [latestApiData, setLatestApiData] = useState({});

  useEffect(() => {
    const handler = (event) => {
      const { url, data } = event.detail;
      setLatestApiData((prev) => ({ ...prev, [url]: data }));
    };

    window.addEventListener("apiDataUpdated", handler);
    return () => window.removeEventListener("apiDataUpdated", handler);
  }, []);

  return (
    <ApiContext.Provider value={{ latestApiData }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApiData = () => useContext(ApiContext);
