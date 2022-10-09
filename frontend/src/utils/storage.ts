import { NFTStorage } from "nft.storage";
import { Network, Alchemy } from "alchemy-sdk";

import contractInfo from "../config/contractInfo.json";

type UPLOAD_NFT_CONFIG = {
  name: string;
  description: string;
  properties: {
    content: string;
    createdTime: number;
    author: string;
  };
};

const KALOS_ADDRESS = contractInfo.address;

const NFT_STORAGE_API_KEY = process.env.REACT_APP_NFT_STORAGE_API_KEY || "";
const nftStorageClient = new NFTStorage({ token: NFT_STORAGE_API_KEY });

const ALCHEMY_SDK_SETTINGS = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_GOERLI,
};
const alchemyClient = new Alchemy(ALCHEMY_SDK_SETTINGS);

const uploadNFT = async (config: UPLOAD_NFT_CONFIG) => {
  // Image is a required field in nft.storage, here we create an empty blob as a work-around.
  const blob = new Blob([]);
  // const array = ['<q id="a"><span id="b">hey!</span></q>'];
  // const blob = new Blob([], { type: "text/html" });
  const mergedConfig = { ...config, image: blob };
  const metadata = await nftStorageClient.store(mergedConfig);

  return {
    metadataID: metadata.ipnft,
    artworkData: metadata.data,
  };
};

const fetchSpecificNFT = async (artworkId: number) => {
  return await alchemyClient.nft.getNftMetadata(KALOS_ADDRESS, artworkId);
};

const fetchAllNFT = async () => {
  return await alchemyClient.nft.getNftsForContract(KALOS_ADDRESS);
};

const fetchNFTByOwner = async (ownerAddress: string) => {
  return await alchemyClient.nft.getNftsForOwner(ownerAddress, {
    contractAddresses: [KALOS_ADDRESS],
  });
};

const refreshAllNFT = async () => {
  return await alchemyClient.nft.refreshContract(KALOS_ADDRESS);
};

const refreshSpecificNFT = async (artworkId: number) => {
  return await alchemyClient.nft.refreshNftMetadata(KALOS_ADDRESS, artworkId);
};

export {
  uploadNFT,
  fetchSpecificNFT,
  fetchAllNFT,
  fetchNFTByOwner,
  refreshAllNFT,
  refreshSpecificNFT,
};
