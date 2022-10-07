import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import styled from "@emotion/styled";
import { Button } from "@mui/joy";
import { Profile } from "../components/Profile";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useContractRead,
  useContract,
  useSigner,
  useContractEvent,
} from "wagmi";
import Kalos from "../../artifacts/contracts/Kalos.sol/Kalos.json";
import { Interface } from "ethers/lib/utils";
import { NFTStorage, File } from "nft.storage";
// import { config as loadEnv } from "dotenv";
import { ethers } from "ethers";
import "@rainbow-me/rainbowkit/styles.css";

// Kalos contract address: 0xE68CcD48A70bDbA5549E24d7F347C73aC8652F83

// loadEnv();

const ColoredParagraph = styled.p`
  background-color: red;
  color: blue;
`;

const ColoredButton = styled(Button)`
  background-color: purple;
`;

const kalosAbi = new Interface(Kalos.abi);

const useKalos = () => {
  const { data: signerData } = useSigner();
  const contractInstance = useContract({
    addressOrName: "0xE68CcD48A70bDbA5549E24d7F347C73aC8652F83",
    contractInterface: kalosAbi,
    signerOrProvider: signerData,
  });
  // console.log("contractInstance", contractInstance);
  return contractInstance;
};

const useKalosEvent = (
  eventName: string,
  listener: ethers.ethers.providers.Listener,
) => {
  useContractEvent({
    addressOrName: "0xE68CcD48A70bDbA5549E24d7F347C73aC8652F83",
    contractInterface: kalosAbi,
    eventName,
    listener,
  });
};

const Home: NextPage = () => {
  const { address, connector, isConnected } = useAccount();
  const { data: ensAvatar } = useEnsAvatar({ addressOrName: address });
  const { data: ensName } = useEnsName({ address });
  const { connect, connectors, error, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();

  // const { data, isError, isLoading } = useContractRead({
  //   addressOrName: "0xE68CcD48A70bDbA5549E24d7F347C73aC8652F83",
  //   contractInterface: kalosAbi,
  //   functionName: "deployer",
  //   watch: true,
  // });
  const contractInstance = useKalos();

  const callContractMethod = async () => {
    // const { data, isError, isLoading } = useContractRead({
    //   addressOrName: "0xE68CcD48A70bDbA5549E24d7F347C73aC8652F83",
    //   contractInterface: KalosABI,
    //   functionName: "deployer",
    // });
    // console.log("data", data, isError, isLoading);
    const result = await contractInstance.deployer();
    const result2 = await contractInstance.totalArtworks();
    // const result3 = await contractInstance.tokenURI(3);
    const result4 = await contractInstance.totalActiveArtworks();
    const result5 = await contractInstance.tipBalances(1);
    console.log("===deployer===", result);
    console.log("===totalArtworks===", result2.toNumber());
    // console.log("===tokenURI===", result3);
    console.log("===totalActiveArtworks===", result4.toNumber());
    console.log("===tipBalances===", result5.toNumber());
  };

  const uploadNFT = async () => {
    console.log("process.env", process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY);
    const NFTStorageAPIKey = process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY;

    const array = ['<q id="a"><span id="b">hey!</span></q>'];
    const blob = new Blob(array, { type: "text/html" });
    const client = new NFTStorage({ token: NFTStorageAPIKey as string });
    const metadata = await client.store({
      image: blob,
      name: "Kalos",
      description: `this is my Kalos artwork, minted at ${new Date().toLocaleString()}`,
    });
    const metadataID = metadata.ipnft;
    const artworkData = metadata.data;

    console.log("NFT data stored!");
    console.log("Metadata", metadata);
    // window.open(`https://${artworkCID}.ipfs.nftstorage.link/metadata.json`);
    window.open(`https://ipfs.io/ipfs/${metadataID}/metadata.json`);
    return {
      metadataID,
      artworkData,
    };
  };

  const mintNFTMethod = async () => {
    const { metadataID, artworkData } = await uploadNFT();
    const result = await contractInstance.mint(metadataID, address);
    console.log("mint result", result);
  };

  const destroyNFTMethod = async () => {
    const result = await contractInstance.destroy(0);
    console.log("destroy result", result);
  };

  const transferNFTMethod = async () => {
    const result = await contractInstance.transfer(1, address);
    console.log("transfer result", result);
  };

  const tipMethod = async () => {
    const options = { value: ethers.utils.parseUnits("0.001", "ether") };
    const result = await contractInstance.tip(1, options);
    console.log("tip result", result);
  };

  const withdrawMethod = async () => {
    const result = await contractInstance["withdraw(uint256)"](1);
    console.log("withdraw result", result);
  };

  useKalosEvent("Mint", (event) => console.log("Mint:", event));
  useKalosEvent("Destroy", (event) => console.log("Destroy:", event));
  useKalosEvent("TransferArtwork", (event) =>
    console.log("TransferArtwork:", event),
  );
  useKalosEvent("Tip", (event) => console.log("Tip:", event));
  useKalosEvent("Withdraw", (event) => console.log("Withdraw:", event));

  if (isConnected) {
    // console.log("data", data, isError, isLoading);
    return (
      <div>
        <img src={ensAvatar} alt="ENS Avatar" />
        <div>{ensName ? `${ensName} (${address})` : address}</div>
        <div>Connected to {connector?.name}</div>
        <button onClick={disconnect}>Disconnect</button>
        <ColoredButton variant="solid" size="lg" onClick={callContractMethod}>
          Call Contract Method
        </ColoredButton>
        <ColoredButton variant="solid" size="lg" onClick={mintNFTMethod}>
          Mint
        </ColoredButton>
        <ColoredButton variant="solid" size="lg" onClick={destroyNFTMethod}>
          Destroy
        </ColoredButton>
        <ColoredButton variant="solid" size="lg" onClick={transferNFTMethod}>
          Transfer
        </ColoredButton>
        <ColoredButton variant="solid" size="lg" onClick={tipMethod}>
          Tip
        </ColoredButton>
        <ColoredButton variant="solid" size="lg" onClick={withdrawMethod}>
          Withdraw
        </ColoredButton>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ColoredParagraph>Mozwell Red Blue!!!</ColoredParagraph>
      {/* <Profile /> */}
      <ConnectButton
        showBalance={{
          smallScreen: false,
          largeScreen: true,
        }}
      />
    </div>
  );
};

export default Home;
