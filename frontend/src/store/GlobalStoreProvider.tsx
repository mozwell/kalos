import React, { useState, useMemo } from "react";
import { createContext } from "react";

import {
  GlobalStore,
  GlobalStoreProps,
  GlobalStoreDefaultProps,
} from "./GlobalStore";
import { useStore } from "../hooks";

const GlobalStoreContext = createContext(Object.create(null));

const GlobalStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [storeProps, setStoreProps] = useState<GlobalStoreProps>(
    GlobalStoreDefaultProps,
  );
  const globalStoreInstance = useStore(GlobalStore, storeProps);
  const value = useMemo(
    () => ({
      store: globalStoreInstance,
      setStoreProps,
    }),
    [globalStoreInstance, setStoreProps],
  );

  return (
    <GlobalStoreContext.Provider value={value}>
      {children}
    </GlobalStoreContext.Provider>
  );
};

export { GlobalStoreContext, GlobalStoreProvider };
