import {
  observable,
  action,
  makeObservable,
  computed,
  runInAction,
} from "mobx";
import { makePersistable } from "mobx-persist-store";

import { CardData } from "../components";
import {
  fetchAllNFT,
  processOwnedNFTForAll,
  processNFT,
  isTwoAddressEqual,
  fetchSpecificNFT,
  fetchOwner,
  isLocalEnv,
} from "../utils";
import { BaseStore } from "./BaseStore";

type GlobalStoreProps = {
  myAddress: string;
  isConnected: boolean;
  myBalance: number;
};

const GlobalStoreDefaultProps = {
  myAddress: "",
  isConnected: false,
  myBalance: 0,
};

class GlobalStore extends BaseStore<GlobalStoreProps> {
  constructor(props: GlobalStoreProps) {
    super(props);
    makeObservable(this);
    makePersistable(this, {
      name: "GlobalStore",
      properties: ["props", "artworkStruct"],
    });
    // set setDebugMode as global variable, so devs could toggle debug mode via DevTools;
    if (isLocalEnv()) {
      window.setDebugMode = this.setDebugMode;
    }
  }

  @observable private _debugMode = false;

  @observable artworkStruct: { [key: string]: CardData } = {};

  @computed
  get debugModeEnabled() {
    return this._debugMode;
  }

  @computed
  get myAddress() {
    return this.props.myAddress;
  }

  @computed
  get myBalance() {
    return this.props.myBalance;
  }

  @computed
  get isConnected() {
    return this.props.isConnected;
  }

  @action
  private setDebugMode = (val: boolean) => {
    if (typeof val !== "boolean") {
      throw new Error("please pass true / false to set debug mode!");
    }
    this._debugMode = val;
    console.log(`Now debug mode is ${val ? "enabled" : "disabled"}`);
  };

  @action
  fetchArtworkList = async () => {
    const rawList = await fetchAllNFT();
    const processedList = processOwnedNFTForAll(rawList as any);
    runInAction(() => {
      this.artworkStruct = processedList.reduce((prev, current) => {
        const cachedArtwork = this.artworkStruct[current.artworkId];
        // We use cached artwork if the fetched one has metadata error;
        prev[current.artworkId] =
          cachedArtwork && current.metadataError ? cachedArtwork : current;
        return prev;
      }, {} as { [key: string]: CardData });
    });
  };

  @action
  fetchArtwork = async (artworkId: number) => {
    const rawNFT = await fetchSpecificNFT(artworkId);
    // We only override artwork when metadata is correct
    if (rawNFT && !rawNFT.metadataError) {
      const processedNFT = processNFT(rawNFT);
      const ownerData = await fetchOwner(artworkId);
      const owner = ownerData?.owners?.[0] || "Unknown";
      runInAction(() => {
        this.artworkStruct[artworkId] = {
          ...processedNFT,
          owner,
          tipBalance: this.artworkStruct[artworkId]?.tipBalance || 0,
        };
      });
      console.log(
        "fetchArtwork",
        "artworkId",
        artworkId,
        "processedNFT",
        processedNFT,
        "owner",
        owner,
        "this._artworkStruct",
        this.artworkStruct,
      );
    }
  };

  @computed
  get artworkList() {
    return Object.values(this.artworkStruct);
  }

  @computed
  get myArtworkList() {
    return this.artworkList.filter((artwork) =>
      isTwoAddressEqual(artwork.owner, this.myAddress),
    );
  }

  @action
  setTipBalance = (artworkId: string, balance: number) => {
    this.artworkStruct[artworkId] = {
      ...this.artworkStruct[artworkId],
      tipBalance: balance,
    };
  };

  @action
  setOwner = (artworkId: string, owner: string) => {
    this.artworkStruct[artworkId] = {
      ...this.artworkStruct[artworkId],
      owner,
    };
  };

  @action
  addArtwork = (artworkId: string, data: CardData) => {
    if (this.artworkStruct[artworkId]) {
      return;
    }
    this.artworkStruct[artworkId] = data;
  };

  // It just deletes artwork from localStorage, not from the network
  @action
  deleteArtwork = (artworkId: string) => {
    delete this.artworkStruct[artworkId];
  };
}

export { GlobalStore, GlobalStoreDefaultProps };
export type { GlobalStoreProps };
