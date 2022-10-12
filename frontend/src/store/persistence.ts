import { configurePersistable } from "mobx-persist-store";

configurePersistable(
  {
    storage: window.localStorage,
    expireIn: 86400000, // One day in milliseconds
    removeOnExpiration: true,
    stringify: true,
    debugMode: false,
  },
  { fireImmediately: false },
);

// A workaround to check whether artwork data has been saved by mobx-persist-store
const hasStoredArtworkData = () => {
  const globalStoreStr = localStorage.getItem("GlobalStore");
  const globalStoreObj = JSON.parse(globalStoreStr || "{}");
  const artworkStruct = globalStoreObj._artworkStruct || {};
  return Object.keys(artworkStruct).length > 0;
};

export { hasStoredArtworkData };
