import React from "react";
import { createContext } from "react";

import { GlobalStore } from "./GlobalStore";

// Make sure that global store is a singleton
let globalStore: GlobalStore;

const GlobalStoreContext = createContext(Object.create(null));

const GlobalStoreProvider = ({ children }: { children: React.ReactNode }) => {
  if (!globalStore) {
    globalStore = new GlobalStore();
  }
  return (
    <GlobalStoreContext.Provider value={globalStore}>
      {children}
    </GlobalStoreContext.Provider>
  );
};

export { GlobalStoreContext, GlobalStoreProvider };
