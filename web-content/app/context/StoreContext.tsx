"use client";
import React, { createContext, useContext, useState } from "react";

type AppState = {
  cartItems: any[];
};

type AppContextType = {
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
};

export const AppCtx = createContext<AppContextType>({
  appState: {
    cartItems: [],
  },
  setAppState: () => {},
});

export const StoreContext: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [appState, setAppState] = useState<AppState>({
    cartItems: [],
  });

  return (
    <AppCtx.Provider value={{ appState, setAppState }}>
      {children}
    </AppCtx.Provider>
  );
};

export const AppProviderComponent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <StoreContext>{children}</StoreContext>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppCtx);
  if (context === undefined) {
    throw new Error("useAppContext must be used within a StoreContext");
  }
  return context;
};
