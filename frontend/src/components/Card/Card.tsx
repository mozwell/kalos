import React from "react";
import styled from "@emotion/styled";
import {
  AspectRatio,
  Avatar,
  Box,
  Card as _Card,
  Typography,
  Button,
} from "@mui/joy";
import { useNavigate, Link } from "react-router-dom";

import { Frame } from "../Frame";

export type CardData = {
  artworkId: string;
  title: string;
  desc: string;
  createdTime: number;
  author: string;
  content: string;
};

const StyledCard = styled(_Card)`
  background: rgba(198, 99, 61, 0.45);
  backdrop-filter: blur(32px);
  border: 1px solid rgba(198, 99, 61, 0.225);
  width: 345px;
  height: 360px;
  margin: 10px;
  :hover {
    cursor: pointer;
    transform: translateY(-5px);
    transition: transform 0.3s, background-color 0.3s;
    background: rgba(198, 99, 61, 0.75);
  }
`;

const EllipsisTypography = styled(Typography)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Card = (props: CardData) => {
  const {
    artworkId,
    title = "No title",
    desc = "No description",
    createdTime = "Unknown created time",
    author = "Unknown author",
    content,
  } = props;

  const navigate = useNavigate();
  const goToDetail = () => navigate(`detail/${artworkId}`, { state: props });

  return (
    <StyledCard variant="outlined" onClick={goToDetail}>
      <EllipsisTypography level="h1" fontSize="md" sx={{ mb: 0.5 }}>
        {title}
      </EllipsisTypography>
      <EllipsisTypography level="body2">{desc}</EllipsisTypography>
      <AspectRatio minHeight="200px" maxHeight="300px" sx={{ my: 2 }}>
        <Frame content={content}></Frame>
      </AspectRatio>
      <Box sx={{ display: "flex" }}>
        <div>
          <Typography level="body2">Author: {author}</Typography>
          <Typography level="body3" sx={{ marginTop: "5px" }}>
            Created Time: {new Date(createdTime).toLocaleString()}
          </Typography>
          {/* <Typography fontSize="md" fontWeight="md">
            $2,900
          </Typography> */}
        </div>
      </Box>
    </StyledCard>
  );
};

export { Card };
