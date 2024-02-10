import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loginError, setLoginError] = useState("");

  const refreshUserState = (userData) => {
    setUser(userData);
  };

  useEffect(() => {
    console.log("Current User: ", user);
  }, [user]);

  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:8082/api/users/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

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
  const logout = () => {
    setUser(null);
  };

const updateUserContext = (updatedUserData) => {
  // Assuming updatedUserData is the latest user data including the phone number
  setUser((prevUser) => ({
    ...prevUser,
    user: updatedUserData
  }));
};

  const value = {
    user,
    loginError,
    login,
    logout,
    updateUserContext,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
