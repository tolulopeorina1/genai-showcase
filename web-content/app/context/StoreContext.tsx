"use client";
import React, { createContext, useContext, useState } from "react";

type AppState = {
  forms: {
    inputPrompt: string;
    inputChange: (value: string) => void;
  };
  cartItems: any[];
};

type AppContextType = {
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
};

export const AppCtx = createContext<AppContextType | undefined>(undefined);

export const StoreContext: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [appState, setAppState] = useState<AppState>({
    cartItems: [],
    forms: {
      inputPrompt: "",
      inputChange: (value: string) => {
        setAppState((prevState) => ({
          ...prevState,
          forms: {
            ...prevState.forms,
            inputPrompt: value,
          },
        }));
      },
    },
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
  if (!context) {
    throw new Error("useAppContext must be used within a StoreContext");
  }
  return context;
};
