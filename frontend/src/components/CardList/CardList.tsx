import React from "react";
import styled from "@emotion/styled";
import { Typography } from "@mui/joy";

import { Card, CardData } from "../Card";
import { ConnectButton } from "../../components/ConnectButton";

type CardListProps = {
  data?: CardData[];
  isConnected?: boolean;
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

const EmptyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const CardList = (props: CardListProps) => {
  const { isConnected, data } = props;
  const isEmpty = !Boolean(data?.length);
  return (
    <_CardList>
      {isEmpty ? (
        <EmptyWrapper>
          <>
            <Typography
              sx={{ marginBottom: isConnected ? "0px" : "40px" }}
              level="h1"
            >
              {isConnected
                ? "No Artworks"
                : "Connect wallet to see your artworks"}
            </Typography>
            {!isConnected && <ConnectButton />}
          </>
        </EmptyWrapper>
      ) : (
        props.data?.map((dataItem, index) => <Card key={index} {...dataItem} />)
      )}
    </_CardList>
  );
};

export { CardList };
