"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CurrentUser } from "@/types";

interface UserContextType {
  currentUser: CurrentUser | null;
  setCurrentUser: (user: CurrentUser | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<CurrentUser | null>(null);

  // On first load, restore user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setCurrentUserState(JSON.parse(stored));
    }
  }, []);

  const setCurrentUser = (user: CurrentUser | null) => {
    setCurrentUserState(user);
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  };

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
}
