import React from "react";
import styled from "@emotion/styled";
import { Typography } from "@mui/joy";

import { Card, CardData } from "../Card";

type CardListProps = {
  data?: CardData[];
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
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const CardList = (props: CardListProps) => {
  const isEmpty = !Boolean(props.data?.length);
  return (
    <_CardList>
      {isEmpty ? (
        <EmptyWrapper>
          <Typography level="h1">No Artworks</Typography>
        </EmptyWrapper>
      ) : (
        props.data?.map((dataItem, index) => <Card key={index} {...dataItem} />)
      )}
    </_CardList>
  );
};

export { CardList };
