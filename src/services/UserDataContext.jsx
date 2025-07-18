import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../pages/Account/AuthContext";
import { userDataService } from "./userDataService";

const UserDataContext = createContext();

export function useUserData() {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error("useUserData must be used within a UserDataProvider");
  }
  return context;
}

export default function UserDataProvider({ children }) {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      setUserData(null);
      setLoading(false);
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    setLoading(true);
    const result = await userDataService.getUserData(user.uid);

    if (result.success) {
      setUserData(result.data);
    } else {
      console.error("Failed to load user data:", result.error);
    }

    setLoading(false);
  };

  const updateCookies = async (amount) => {
    if (!user) return;

    const result = await userDataService.updateCookies(user.uid, amount);
    if (result.success) {
      setUserData((prev) => ({
        ...prev,
        cookies: prev.cookies + amount,
      }));
    }
    return result;
  };

  const updateExp = async (amount) => {
    if (!user) return;

    const result = await userDataService.updateExp(user.uid, amount);
    if (result.success) {
      setUserData((prev) => ({
        ...prev,
        exp: result.newExp,
        level: result.newLevel,
      }));
    }
    return result;
  };

  const giveRewards = async (rewards) => {
    if (!user) return;

    const result = await userDataService.giveRewards(user.uid, rewards);
    if (result.success) {
      setUserData((prev) => ({
        ...prev,
        exp: result.newExp,
        level: result.newLevel,
        cookies: result.newCookies,
      }));
    }
    return result;
  };

  const value = {
    userData,
    loading,
    updateCookies,
    updateExp,
    giveRewards,
    refreshUserData: loadUserData,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}
