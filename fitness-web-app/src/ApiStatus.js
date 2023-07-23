import React, {useEffect, useState} from "react";

const ApiStatus = () => {
    const [connectionStatus, setConnectionStatus] = useState("");
  
    useEffect(() => {
      const fetchConnectionStatus = async () => {
        try {
          const response = await fetch("http://localhost:4000/");
          const data = await response.json();
          setConnectionStatus(data.message);
        } catch (error) {
          console.error("Error fetching connection status:", error);
          setConnectionStatus("Error connecting to the server");
        }
      };
  
      fetchConnectionStatus();
    }, []);
  
    return <h1>Connection Status: {connectionStatus}</h1>;

          
  };
  
  export default ApiStatus;