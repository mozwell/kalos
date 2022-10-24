import {
  observable,
  action,
  makeObservable,
  computed,
  runInAction,
} from "mobx";
import { makePersistable } from "mobx-persist-store";

import { CardData } from "../components/Card";
import {
  fetchAllNFT,
  fetchAllOwners,
  fetchNFTByOwner,
  processOwnedNFTForAll,
  processOwnedNFT,
  processNFT,
  isTwoAddressEqual,
  fetchSpecificNFT,
  fetchOwner,
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
  }

  @observable artworkStruct: { [key: string]: CardData } = {};

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
