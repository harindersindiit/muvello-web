import { createContext, useContext, useState, useEffect } from "react";
import localStorageService from "@/utils/localStorageService";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(localStorageService.getItem("user") || {});

  const updateUser = (newUser) => {
    localStorageService.setItem("user", newUser);
    setUser(newUser);
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
