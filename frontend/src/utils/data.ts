import {
  NftContractNftsResponse,
  OwnedNftsResponse,
  OwnedNft,
  GetOwnersForContractResponse,
  Nft,
} from "alchemy-sdk";

import { ZERO_ADDRESS } from "./constants";

// To convert raw data from Alchemy SDK to our standard data schema
const _convertNFTDataSchema = (nft: Nft) => ({
  artworkId: nft.tokenId,
  title: nft.title,
  desc: nft.description,
  createdTime: nft.rawMetadata?.properties?.createdTime,
  author: nft.rawMetadata?.properties?.author,
  content: nft.rawMetadata?.properties?.content,
  metadataError: nft.metadataError,
});

const processNFT = (response: Nft) => _convertNFTDataSchema(response);

const processAllNFT = (response: NftContractNftsResponse) => {
  return (response.nfts as OwnedNft[]).map(processNFT);
};

const processOwnedNFT = (response: OwnedNftsResponse) => {
  return response.ownedNfts.map(processNFT);
};

const processOwnedNFTForAll = (response: OwnedNftsResponse[]) => {
  console.log("processOwnedNFTForAll", "response", response);
  const [validOwnerList, ...nftSetList] = response;
  const mergedNFTList = nftSetList.reduce((prev, current, index) => {
    // add owner prop to each NFT
    const processedCurrentOwnedNfts = current.ownedNfts.map((nft) => ({
      ...nft,
      owner: (validOwnerList as any)[index],
    }));
    return [...prev, ...processedCurrentOwnedNfts];
  }, [] as OwnedNft[]);
  console.log("processOwnedNFTForAll", "mergedNFTList", mergedNFTList);
  mergedNFTList.sort((a, b) => Number(a.tokenId) - Number(b.tokenId));
  return mergedNFTList.map((nft: Nft) => {
    return {
      ...processNFT(nft),
      owner: (nft as any).owner,
    };
  });
};

const processAllOwners = (response: GetOwnersForContractResponse) => {
  const { owners: ownerList } = response;
  return ownerList.filter((owner) => owner !== ZERO_ADDRESS);
};

export {
  processNFT,
  processAllNFT,
  processOwnedNFT,
  processOwnedNFTForAll,
  processAllOwners,
};
