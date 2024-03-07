import React, { createContext, useContext, useState, useEffect } from "react";

// Creating a new Context for authentication
const AuthContext = createContext();

// Custom hook for using the authentication context
export function useAuth() {
  return useContext(AuthContext);
}

// AuthProvider component that wraps around children components to provide authentication context
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loginError, setLoginError] = useState("");

  // Function to update the user state
  const refreshUserState = (userData) => {
    setUser(userData);
  };

  // useEffect to log the current user to the console whenever the user state changes
  useEffect(() => {
    console.log("Current User: ", user);
  }, [user]);

  // Async function to handle user login
  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:8082/api/users/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // Parsing the JSON response from the API
      const result = await response.json();
      if (response.ok) {
        refreshUserState(result);
        setLoginError("");
      } else {
        throw new Error(result.message || " Login Failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError(error.message);
      setUser(null);
    }
  };
  // Updates the user context with new data
  const updateUserContext = (updatedUserData) => {
    console.log(
      "Updating user context with:",
      JSON.stringify(updatedUserData, null, 2)
    );
    setUser((prevUser) => ({
      ...prevUser,
      ...updatedUserData,
    }));
  };

  // Function to log out the user by setting the user state to null
  const logout = () => {
    setUser(null);
  };

  // Preparing the context value to be provided to children components
  const value = {
    user,
    loginError,
    login,
    logout,
    updateUserContext,
  };
  // Returning the AuthContext provider with the defined value, wrapping children components to provide them access to the context
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
