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
  title: string;
  desc: string;
  createdTime: number;
  author: string;
  content: string;
};

const mockContent =
  "background-image: radial-gradient(closest-side, transparent 0%, transparent 75%, rgb(182, 204, 102) 76%, rgb(182, 204, 102) 85%, rgb(237, 255, 219) 86%, rgb(237, 255, 219) 94%, rgb(255, 255, 255) 95%, rgb(255, 255, 255) 103%, rgb(217, 230, 167) 104%, rgb(217, 230, 167) 112%, rgb(121, 139, 60) 113%, rgb(121, 139, 60) 121%, rgb(255, 255, 255) 122%, rgb(255, 255, 255) 130%, rgb(224, 234, 215) 131%, rgb(224, 234, 215) 140%), radial-gradient(closest-side, transparent 0%, transparent 75%, rgb(182, 204, 102) 76%, rgb(182, 204, 102) 85%, rgb(237, 255, 219) 86%, rgb(237, 255, 219) 94%, rgb(255, 255, 255) 95%, rgb(255, 255, 255) 103%, rgb(217, 230, 167) 104%, rgb(217, 230, 167) 112%, rgb(121, 139, 60) 113%, rgb(121, 139, 60) 121%, rgb(255, 255, 255) 122%, rgb(255, 255, 255) 130%, rgb(224, 234, 215) 131%, rgb(224, 234, 215) 140%); background-size: 110px 110px; background-color: rgb(200, 211, 167); background-position: 0px 0px, 55px 55px; --darkreader-inline-bgimage:radial-gradient(closest-side, rgba(13, 13, 13, 0) 0%, rgba(13, 13, 13, 0) 75%, #5d652d 76%, #5d652d 85%, #374e0f 86%, #374e0f 94%, #232425 95%, #232425 103%, #464b20 104%, #464b20 112%, #66713a 113%, #66713a 121%, #232425 122%, #232425 130%, #384028 131%, #384028 140%), radial-gradient(closest-side, rgba(13, 13, 13, 0) 0%, rgba(13, 13, 13, 0) 75%, #5d652d 76%, #5d652d 85%, #374e0f 86%, #374e0f 94%, #232425 95%, #232425 103%, #464b20 104%, #464b20 112%, #66713a 113%, #66713a 121%, #232425 122%, #232425 130%, #384028 131%, #384028 140%); --darkreader-inline-bgcolor:#43482b;";

const StyledCard = styled(_Card)`
  background: rgba(198, 99, 61, 0.45);
  backdrop-filter: blur(32px);
  border: 1px solid rgba(198, 99, 61, 0.225);
  width: 320px;
  margin: 10px;
  :hover {
    cursor: pointer;
    transform: translateY(-5px);
    transition: transform 0.3s, background-color 0.3s;
    background: rgba(198, 99, 61, 0.75);
  }
`;

const Card = () => {
  const navigate = useNavigate();
  const goToDetail = () => navigate("detail/1234567");

  return (
    <StyledCard variant="outlined" onClick={goToDetail}>
      <Typography level="h1" fontSize="md" sx={{ mb: 0.5 }}>
        Fantasic Baby
      </Typography>
      <Typography level="body2">
        this is my desc. this is my desc. this is my desc. this is my desc. this
        is my desc.
      </Typography>
      <AspectRatio minHeight="200px" maxHeight="300px" sx={{ my: 2 }}>
        <Frame content={mockContent}></Frame>
      </AspectRatio>
      <Box sx={{ display: "flex" }}>
        <div>
          <Typography level="body2">Author: XXX</Typography>
          <Typography level="body3">Created Time: 2015/11/22</Typography>
          {/* <Typography fontSize="md" fontWeight="md">
            $2,900
          </Typography> */}
        </div>
      </Box>
    </StyledCard>
  );
};

export { Card };
