import { configurePersistable } from "mobx-persist-store";

export default configurePersistable(
  {
    storage: window.localStorage,
    expireIn: 86400000, // One day in milliseconds
    removeOnExpiration: true,
    stringify: true,
    debugMode: true,
  },
  { delay: 200, fireImmediately: false },
);
