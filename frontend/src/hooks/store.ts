import { useContext, useEffect, useState } from "react";
import { observable, runInAction } from "mobx";

import {
  GlobalStoreContext,
  BaseStore,
  GlobalStore,
  GlobalStoreProps,
} from "../store";

const useObservableProps = <P extends Record<string, unknown>>(props: P) => {
  const [observableProps] = useState(() => observable(props));

  useEffect(() => {
    // changing (observed) observable values without using an action is not allowed in MobX
    runInAction(() => {
      Object.assign(observableProps, props);
    });
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

const useGlobalStore = (storeProps?: GlobalStoreProps) => {
  const { store, setStoreProps } = useContext<{
    store: GlobalStore;
    setStoreProps: (storeProps: GlobalStoreProps) => void;
  }>(GlobalStoreContext);
  if (!store) {
    // this is especially useful in TypeScript so you don't need to be checking for null all the time
    throw new Error("useStore must be used within a StoreProvider.");
  }
  useEffect(() => {
    if (storeProps) {
      setStoreProps(storeProps);
    }
  }, [storeProps]);

  return store;
};

export { useGlobalStore, useStore };
