import {
  NftContractNftsResponse,
  OwnedNftsResponse,
  OwnedNft,
  GetOwnersForContractResponse,
} from "alchemy-sdk";

import { ZERO_ADDRESS } from "./constants";

const processAllNFT = (response: NftContractNftsResponse) => {
  return response.nfts.map((nft) => {
    return {
      artworkId: nft.tokenId,
      title: nft.title,
      desc: nft.description,
      createdTime: nft.rawMetadata?.properties?.createdTime,
      author: nft.rawMetadata?.properties?.author,
      content: nft.rawMetadata?.properties?.content,
    };
  });
};

const processOwnedNFT = (response: OwnedNftsResponse) => {
  return response.ownedNfts.map((nft) => {
    return {
      artworkId: nft.tokenId,
      title: nft.title,
      desc: nft.description,
      createdTime: nft.rawMetadata?.properties?.createdTime,
      author: nft.rawMetadata?.properties?.author,
      content: nft.rawMetadata?.properties?.content,
    };
  });
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
  return mergedNFTList.map((nft) => {
    return {
      artworkId: nft.tokenId,
      title: nft.title,
      desc: nft.description,
      createdTime: nft.rawMetadata?.properties?.createdTime,
      author: nft.rawMetadata?.properties?.author,
      content: nft.rawMetadata?.properties?.content,
      owner: (nft as any).owner,
    };
  });
};

const processAllOwners = (response: GetOwnersForContractResponse) => {
  const { owners: ownerList } = response;
  return ownerList.filter((owner) => owner !== ZERO_ADDRESS);
};

export {
  processAllNFT,
  processOwnedNFT,
  processOwnedNFTForAll,
  processAllOwners,
};
