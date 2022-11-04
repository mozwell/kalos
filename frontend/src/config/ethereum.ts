import { chain } from "wagmi";
import { Network } from "alchemy-sdk";

const MAINNET_CONFIG = {
  name: "Ethereum Mainnet",
  wagmiChain: chain.mainnet,
  faucet: "https://ethereum-faucet.org/",
  getTxInfoUrl: (txHash: string) => `https://etherscan.io/tx/${txHash}`,
  alchemySDKNetwork: Network.ETH_MAINNET,
};

const GOERLI_CONFIG = {
  name: "Goerli Testnet",
  wagmiChain: chain.goerli,
  faucet: "https://goerlifaucet.com/",
  getTxInfoUrl: (txHash: string) => `https://goerli.etherscan.io/tx/${txHash}`,
  alchemySDKNetwork: Network.ETH_GOERLI,
};

// We will make a shift to mainnet once the project passes tests on Goerli.
const CURRENT_NETWORK_CONFIG = GOERLI_CONFIG;

export { CURRENT_NETWORK_CONFIG };
