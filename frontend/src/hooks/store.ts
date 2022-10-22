import { useContext, useEffect, useState } from "react";
import { observable } from "mobx";

import { GlobalStoreContext, BaseStore } from "../store";

const useObservableProps = <P extends Record<string, unknown>>(props: P) => {
  const [observableProps] = useState(() => observable(props));

  useEffect(() => {
    Object.assign(observableProps, props);
  }, [observableProps, props]);

  return observableProps;
};

const useStore = <S extends BaseStore<P>, P extends Record<string, unknown>>(
  Store: new (props: P) => S,
  props: P,
) => {
  const observableProps = useObservableProps<P>(props);
  const [storeInstance] = useState(() => new Store(observableProps));
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
