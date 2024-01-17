import { useState, useEffect } from "react";

const useLocation = () => {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    error: null,
  });

  const handleSuccess = (position) => {
    const { latitude, longitude } = position.coords;
    setLocation({
      latitude,
      longitude,
      error: null,
    });
  };

  const handleError = (error) => {
    setLocation({
      latitude: null,
      longitude: null,
      error: error.message,
    });
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation((prevState) => ({
        ...prevState,
        error: "Geolocation is not supported by your browser",
      }));
    } else {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
    }
  }, []);
  return location;
};

export default useLocation;
