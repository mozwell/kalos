import React from "react";
import { createContext } from "react";

import { GlobalStore } from "./GlobalStore";
import { useStore } from "../hooks";

const GlobalStoreContext = createContext(Object.create(null));

const GlobalStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const globalStoreInstance = useStore(GlobalStore, {});

  return (
    <GlobalStoreContext.Provider value={globalStoreInstance}>
      {children}
    </GlobalStoreContext.Provider>
  );
};

export { GlobalStoreContext, GlobalStoreProvider };
