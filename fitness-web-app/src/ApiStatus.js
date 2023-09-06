import React, {useEffect, useState} from "react";
import axios from "axios";


// Placeholder page, has no real use in final design but kept for legacy reasons
const ApiStatus = () => {
    const [connectionStatus, setConnectionStatus] = useState("");
  
    // Simple api check, if localhost 4000 is up and running. i.e. the server, then this page will say so. Otherwise it'll throw an error.
    useEffect(() => {
      const fetchConnectionStatus = async () => {
        try {
          const response = await axios.get("http://localhost:4000/");
          setConnectionStatus(response.data.message);
        } catch (error) {
          console.error("Error fetching connection status:", error);
          setConnectionStatus("Error connecting to the server");
        }
      };
  
      fetchConnectionStatus();
    }, []);
  
    return <h1 data-testid = "api-test1">Connection Status: {connectionStatus}</h1>;

          
  };
  
  export default ApiStatus;