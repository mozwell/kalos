import { utils } from "ethers";

import { CURRENT_NETWORK_CONFIG } from "../config/ethereum";

// Since Ethereum address is case-insensitive, and representation of data sources differ, we should take a uniform approach to format it.
// Here we use Checksum Address provided by ethers.js
const formatAddress = (address: string) => {
  try {
    const result = utils.getAddress(address);
    return result;
  } catch (e) {
    return "Unknown";
  }
};

const isTwoAddressEqual = (a: string, b: string) => {
  return formatAddress(a) === formatAddress(b);
};

// the method checks addresses in checksum / all lowercase format
const isValidAddress = (address: string) => {
  return utils.isAddress(address);
};

const seeTxInfo = (txHash: string) => {
  const txInfoUrl = CURRENT_NETWORK_CONFIG.getTxInfoUrl(txHash);
  window.open(txInfoUrl);
};

export { formatAddress, isTwoAddressEqual, isValidAddress, seeTxInfo };
