import { useContext, useState } from "react";

import { GlobalStoreContext } from "../store";

const useStore = (Store: any) => {
  const [storeInstance] = useState(() => new Store());
  return storeInstance;
};

const useGlobalStore = () => {
  const store = useContext(GlobalStoreContext);
  if (!store) {
    // this is especially useful in TypeScript so you don't need to be checking for null all the time
    throw new Error("useStore must be used within a StoreProvider.");
  }
  return store;
};

export { useGlobalStore, useStore };
