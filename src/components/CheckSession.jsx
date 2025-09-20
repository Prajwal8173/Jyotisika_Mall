import React, { useEffect, useState } from "react";

const CheckSession = () => {
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch(
          "https://jyotisika.in/jyotisika_test//User_Api_Controller/getSessionData",
          {
            method: "GET",
            credentials: "include", // ensures cookies/session are sent
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data);
        setSessionData(data);
      } catch (err) {
        console.error("Error fetching session:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Check Session Page</h2>
      {loading && <p>Loading session data...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {sessionData && (
        <pre style={{ background: "#f4f4f4", padding: "1rem" }}>
          {JSON.stringify(sessionData, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default CheckSession;
