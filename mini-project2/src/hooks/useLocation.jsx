import { useState, useEffect } from "react";

// Custom hook definition
const useLocation = () => {

  // State to store location data and any potential error
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    error: null,
  });

  // Function to handle successful retrieval of location
  const handleSuccess = (position) => {
    const { latitude, longitude } = position.coords;

    // Updating the location state with the new latitude and longitude
    setLocation({
      latitude,
      longitude,
      error: null,
    });
  };

   // Function to handle errors in retrieving location
  const handleError = (error) => {

    // Updating the location state with the error message
    setLocation({
      latitude: null,
      longitude: null,
      error: error.message,
    });
  };

  // useEffect hook to execute geolocation code when the component mounts
  useEffect(() => {

    // Checking if the geolocation API is available in the browser
    if (!navigator.geolocation) {

       // Updating the location state with an error if geolocation is not supported
      setLocation((prevState) => ({
        ...prevState,
        error: "Geolocation is not supported by your browser",
      }));
    } else {
      // Requesting the current position
       // handleSuccess is called if successful, handleError if there's an error
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
    }
  }, []); // Empty dependency array ensures this runs once on mount
  
  return location;
};

export default useLocation;
