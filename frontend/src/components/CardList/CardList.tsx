import React from "react";
import styled from "@emotion/styled";
import { Typography } from "@mui/joy";

import { Card, CardData } from "../Card";
import { ConnectButton } from "../../components/ConnectButton";

type CardListProps = {
  data?: CardData[];
  isConnected?: boolean;
  isChainSupported: boolean;
};

const _CardList = styled.div`
  background: transparent;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: baseline;
  padding: 20px;
  width: calc(100% - 220px);
  height: calc(100% - 40px);
  overflow: scroll;
`;

const FallbackWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const CardList = (props: CardListProps) => {
  const { isConnected, data, isChainSupported } = props;
  const isEmpty = !Boolean(data?.length);

  const fallbackConfig = !isConnected
    ? { text: "Connect wallet to see your artworks", button: <ConnectButton /> }
    : !isChainSupported
    ? {
        text: "Switch network to Goerli to see artworks",
        button: <ConnectButton />,
      }
    : { text: "No Artworks", button: null };

  return (
    <_CardList>
      {isEmpty || !isChainSupported ? (
        <FallbackWrapper>
          <>
            <Typography
              sx={{
                marginBottom: isConnected && isChainSupported ? "0px" : "40px",
              }}
              level="h1"
            >
              {fallbackConfig.text}
            </Typography>
            {fallbackConfig.button}
          </>
        </FallbackWrapper>
      ) : (
        props.data?.map((dataItem, index) => <Card key={index} {...dataItem} />)
      )}
    </_CardList>
  );
};

export { CardList };
