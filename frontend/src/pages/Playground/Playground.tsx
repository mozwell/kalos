import React, { useState } from "react";
import styled from "@emotion/styled";
import { Button, Slider } from "@mui/joy";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from "wagmi";
import { ethers } from "ethers";
import "@rainbow-me/rainbowkit/styles.css";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useKalos, useKalosEvent } from "../../hooks";
import {
  uploadNFT,
  fetchSpecificNFT,
  fetchAllNFT,
  fetchNFTByOwner,
  fillInTemplate,
} from "../../utils";
import { Frame } from "../../components/Frame/Frame";
import templates from "../../config/artworkTemplates.json";
import { colord } from "colord";
import { HexAlphaColorPicker } from "react-colorful";

const firstTemplate = templates.templates[0];

const ColoredButton = styled(Button)``;

const Home = () => {
  console.log("colord", colord("#ffffff00").toHex());
  console.log("colord", colord("rgba(192, 192, 192, 0.9)").toHex());
  const location = useLocation();
  const { address, connector, isConnected } = useAccount();
  const { data: ensAvatar } = useEnsAvatar({ addressOrName: address });
  const { data: ensName } = useEnsName({ address });
  const { connect, connectors, error, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();

  const contractInstance = useKalos();

  const callContractMethod = async () => {
    const result = await contractInstance.deployer();
    const result2 = await contractInstance.totalArtworks();
    // const result3 = await contractInstance.tokenURI(3);
    const result4 = await contractInstance.totalActiveArtworks();
    console.log("===deployer===", result);
    console.log("===totalArtworks===", result2.toNumber());
    // console.log("===tokenURI===", result3);
    console.log("===totalActiveArtworks===", result4.toNumber());
    // console.log("===tipBalances===", result5.toNumber());
  };

  const uploadNFTMethod = async () => {
    return await uploadNFT({
      name: "Kalos",
      description: `this is my Kalos artwork, minted at ${new Date().toLocaleString()}`,
      properties: {
        content: "123",
        author: "mozwell",
        createdTime: Date.now(),
      },
    });
  };

  const mintNFTMethod = async () => {
    const { metadataID, artworkData } = await uploadNFTMethod();
    const artworkUri = `ipfs://${metadataID}/metadata.json`;
    console.log("artworkUri", artworkUri, "artworkData", artworkData);
    const result = await contractInstance.mint(artworkUri, address);
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

  const logEvents = async () => {
    console.log("contractInstance.filters", contractInstance.filters);
    const eventFilter = contractInstance.filters.Mint();
    const events = await contractInstance.queryFilter(eventFilter);
    console.log("events", events);
  };

  const fetchNFT = async () => {
    const result = await fetchSpecificNFT(0);
    console.log("fetchSpecificNFT", result);
    const result2 = await fetchAllNFT();
    console.log("fetchAllNFT", result2);
    const result3 = await fetchNFTByOwner(address!);
    console.log("fetchNFTByOwner", result3);
  };

  useKalosEvent("Mint", (event) => console.log("Mint:", event));
  useKalosEvent("Destroy", (event) => console.log("Destroy:", event));
  useKalosEvent("TransferArtwork", (event) =>
    console.log("TransferArtwork:", event),
  );
  useKalosEvent("Tip", (event) => console.log("Tip:", event));
  useKalosEvent("Withdraw", (event) => console.log("Withdraw:", event));

  const [template, setTemplate] = useState("");
  const [pxValue, setPxValue] = useState(firstTemplate.defaultArgs["px"][0]);
  const [colorValue, setColorValue] = useState(
    firstTemplate.defaultArgs["color"][0],
  );

  const handleMakeTemplateChange = (event: any, value: number) => {
    const currentArgs = { ...firstTemplate.defaultArgs };
    currentArgs["px"][0] = value;
    setPxValue(value);
    const processedTemplate = fillInTemplate(
      firstTemplate.content,
      currentArgs,
    );
    setTemplate(processedTemplate);
  };

  const handleMakeColorChange = (value: string) => {
    const currentArgs = { ...firstTemplate.defaultArgs };
    currentArgs["color"][0] = value;
    setColorValue(value);
    const processedTemplate = fillInTemplate(
      firstTemplate.content,
      currentArgs,
    );
    setTemplate(processedTemplate);
  };

  if (isConnected) {
    // console.log("data", data, isError, isLoading);
    return (
      <div>
        <img src={ensAvatar || undefined} alt="ENS Avatar" />
        <div>{ensName ? `${ensName} (${address})` : address}</div>
        <div>Connected to {connector?.name}</div>
        <button onClick={disconnect as any}>Disconnect</button>
        <ColoredButton
          color="primary"
          variant="solid"
          size="lg"
          onClick={callContractMethod}
        >
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
        <ColoredButton variant="solid" size="lg" onClick={logEvents}>
          Log Events
        </ColoredButton>
        <ColoredButton variant="solid" size="lg" onClick={fetchNFT}>
          fetchNFT
        </ColoredButton>
        <Frame content={template} />
        <Slider
          value={pxValue}
          step={1}
          min={1}
          max={200}
          valueLabelDisplay="auto"
          onChange={handleMakeTemplateChange as any}
        />
        <HexAlphaColorPicker
          color={colorValue}
          onChange={handleMakeColorChange}
        />
        ;
        <Link to="modal/hello123">
          <ColoredButton variant="solid" size="lg">
            Open Modal
          </ColoredButton>
        </Link>
        <Outlet />
      </div>
    );
  }

  return (
    <div>
      <head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <ConnectButton
        showBalance={{
          smallScreen: false,
          largeScreen: true,
        }}
      />
    </div>
  );
};

export { Home };
