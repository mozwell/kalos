import { observable, action, makeObservable, computed } from "mobx";
import { CardData } from "../components/Card";
import {
  fetchAllNFT,
  fetchAllOwners,
  fetchNFTByOwner,
  processOwnedNFTForAll,
  processOwnedNFT,
  isTwoAddressEqual,
} from "../utils";

class GlobalStore {
  constructor() {
    makeObservable(this);
  }

  @observable myAddress = "";

  @observable myBalance = 0;

  @observable private _artworkStruct: { [key: string]: CardData } = {};

  @observable isConnected = false;

  @action
  fetchArtworkList = async () => {
    const rawList = await fetchAllNFT();
    const processedList = processOwnedNFTForAll(rawList as any);
    this._artworkStruct = processedList.reduce((prev, current) => {
      prev[current.artworkId] = current;
      return prev;
    }, {} as { [key: string]: CardData });
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
    return Object.values(this._artworkStruct);
  }

  @computed
  get myArtworkList() {
    return this.artworkList.filter((artwork) =>
      isTwoAddressEqual(artwork.owner, this.myAddress),
    );
  }

  getArtwork = (id: string) => {
    return this.artworkList.find((artwork) => artwork.artworkId === id);
  };

  @action
  setTipBalance = (artworkId: string, balance: number) => {
    this._artworkStruct[artworkId].tipBalance = balance;
  };

  @action
  setOwner = (artworkId: string, owner: string) => {
    this._artworkStruct[artworkId].owner = owner;
  };
}

export { GlobalStore };
