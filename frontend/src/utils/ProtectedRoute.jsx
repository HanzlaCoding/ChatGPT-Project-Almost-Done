import React, { useState, createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const authContext = createContext(null);

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));

    if (!token) {
      navigate("/login", { replace: true });
    } else {
      setUser(token);
    }
  }, [navigate]);

  return (
    <authContext.Provider value={{ user, setUser }}>
      {children}
    </authContext.Provider>
  );
};

export default ProtectedRoute;
