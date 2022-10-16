import { observable, action, makeObservable, computed } from "mobx";
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

class GlobalStore {
  constructor() {
    makeObservable(this);
    makePersistable(this, {
      name: "GlobalStore",
      properties: ["myAddress", "myBalance", "artworkStruct", "isConnected"],
    });
  }

  @observable myAddress = "";

  @observable myBalance = 0;

  @observable artworkStruct: { [key: string]: CardData } = {};

  @observable isConnected = false;

  @action
  fetchArtworkList = async () => {
    const rawList = await fetchAllNFT();
    const processedList = processOwnedNFTForAll(rawList as any);
    this.artworkStruct = processedList.reduce((prev, current) => {
      prev[current.artworkId] = current;
      return prev;
    }, {} as { [key: string]: CardData });
  };

  @action
  fetchArtwork = async (artworkId: number) => {
    const rawNFT = await fetchSpecificNFT(artworkId);
    if (rawNFT) {
      const processedNFT = processNFT(rawNFT);
      const ownerData = await fetchOwner(artworkId);
      const owner = ownerData?.owners?.[0] || "Unknown";
      this.artworkStruct[artworkId] = {
        ...processedNFT,
        owner,
        tipBalance: this.artworkStruct[artworkId]?.tipBalance || 0,
      };
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

  @action
  setMyAddress = (value: string) => {
    this.myAddress = value;
  };

  @action
  setMyBalance = (value: number) => {
    this.myBalance = value;
  };

  @action
  setIsConnected = (value: boolean) => {
    this.isConnected = value;
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

  // It just deletes artwork from localStorage, not from the network
  @action
  deleteArtwork = (artworkId: string) => {
    delete this.artworkStruct[artworkId];
  };
}

export { GlobalStore };
