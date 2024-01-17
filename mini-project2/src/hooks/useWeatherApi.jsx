import { useState, useEffect } from "react";
import config from "../../config";

const useWeatherApi = (lat, lon, units) => { 
    const [weatherData, setWeatherData] = useState(null); 
    const apiKey = config.OPENWEATHER_API_KEY;
  
    useEffect(() => {
      // Only proceed if lat and lon are not null
      if (lat && lon) {
        const fetchData = async () => {
          try {
            const response = await fetch(
              `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`
            );
            const data = await response.json();
            setWeatherData(data); 
          } catch (error) {
            console.error("Error fetching weather data:", error);
          }
        };
        fetchData();
      }
    }, [lat, lon, units, apiKey]);
  
    return weatherData;
  };
  
  export default useWeatherApi;
  