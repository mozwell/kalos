import {
  NftContractNftsResponse,
  OwnedNftsResponse,
  OwnedNft,
} from "alchemy-sdk";

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
  const mergedNFTList = response.reduce((prev, current) => {
    return [...current.ownedNfts];
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
    };
  });
};

export { processAllNFT, processOwnedNFT, processOwnedNFTForAll };
