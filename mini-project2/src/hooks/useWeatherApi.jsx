import { useState, useEffect } from "react";
import config from "../../config";

// Custom hook definition for fetching weather data
const useWeatherApi = (lat, lon, units) => { 

  // State to store the fetched weather data
    const [weatherData, setWeatherData] = useState(null); 

    // API key for the OpenWeather API
    const apiKey = config.OPENWEATHER_API_KEY;
  
    useEffect(() => {
       // Only proceed if latitude and longitude are provided
      if (lat && lon) {
        // Defining an asynchronous function to fetch weather data
        const fetchData = async () => {
          try {
             // Fetching data from OpenWeather API using the provided lat, lon, units, and API key
            const response = await fetch(
              `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`
            );
            // Parsing the JSON response
            const data = await response.json();
            // Updating the weatherData state with the fetched data
            setWeatherData(data); 
          } catch (error) {
             // Logging any errors encountered during the fetch operation
            console.error("Error fetching weather data:", error);
          }
        };
        // Calling the fetchData function
        fetchData();
      }
    }, [lat, lon, units, apiKey]); // Dependency array for useEffect, the hook will re-run when these values change
  
    return weatherData;
  };
  
  export default useWeatherApi;
  