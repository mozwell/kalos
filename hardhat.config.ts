import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { config as loadEnv } from 'dotenv';

loadEnv();

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [process.env.GOERLI_PRIVATE_KEY as string]
    },
  }
};

export default config;
