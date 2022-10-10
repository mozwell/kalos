import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Typography, Divider, Button } from "@mui/joy";
import { Outlet } from "react-router-dom";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListItemButton from "@mui/joy/ListItemButton";
import { Person, Apps, Create } from "@mui/icons-material";
import { useAccount } from "wagmi";
import { useNavigate, Link } from "react-router-dom";

import { ConnectButton } from "../../components/ConnectButton";
import { CardList } from "../../components/CardList";
import {
  fetchAllNFT,
  fetchAllOwners,
  fetchNFTByOwner,
  processOwnedNFTForAll,
  processOwnedNFT,
} from "../../utils";

const Wallpaper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: 100% 100%;
  background-image: url("https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjMxMDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjUyODE4OTg&ixlib=rb-1.2.1&q=80&w=1080");
`;

const Overview = styled.div`
  width: 80vw;
  height: 90vh;
  inset: 64px;
  background: rgba(65, 150, 160, 0.4);
  backdrop-filter: blur(31px);
  border: 1px solid rgba(65, 150, 160, 0.3);
  border-radius: 16px;
  padding: 20px;
  display: flex;
`;

const LeftRail = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  height: fit-content;
`;

const StyledList = styled(List)`
  width: 250px;
`;

const TotalCount = styled(Typography)`
  margin-top: 15px;
  margin-bottom: 15px;
`;

const StyledDivider = styled(Divider)`
  margin-bottom: 15px;
`;

const CreateButton = styled(Button)`
  margin-top: 15px;
`;

const Home = () => {
  const { address, connector, isConnected } = useAccount();
  const navigate = useNavigate();
  const goToCreate = () => navigate("create");

  const [listData, setListData] = useState<any>([]);

  useEffect(() => {
    // get all nfts
    fetchAllNFT().then((data) => {
      const processedData = processOwnedNFTForAll(data as any);
      setListData(processedData);
    });
    // get all owners
    // fetchAllOwners().then((data) => {
    //   console.log("data", data);
    // });
    // get my nfts
    // if (address) {
    //   fetchNFTByOwner(address).then((data) => {
    //     const processedData = processOwnedNFT(data as any);
    //     setListData([
    //       ...processedData,
    //       ...processedData,
    //       ...processedData,
    //       ...processedData,
    //       ...processedData,
    //     ]);
    //   });
    // }
  }, []);

  return (
    <Wallpaper>
      <Overview>
        <LeftRail>
          <Typography level="h2">Kalos</Typography>
          <StyledList size="lg">
            <ListItem>
              <ListItemButton selected>
                <ListItemDecorator>
                  <Apps />
                </ListItemDecorator>
                All Artworks
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton>
                <ListItemDecorator>
                  <Person />
                </ListItemDecorator>
                My Artworks
              </ListItemButton>
            </ListItem>
          </StyledList>
          <Divider />
          <TotalCount level="body1">Total: 45</TotalCount>
          <StyledDivider />
          <ConnectButton />
          {isConnected && (
            <CreateButton
              variant={"solid"}
              size={"lg"}
              startDecorator={<Create />}
              onClick={goToCreate}
            >
              Create My Artwork
            </CreateButton>
          )}
        </LeftRail>
        <CardList data={listData} />
      </Overview>
      <Outlet />
    </Wallpaper>
  );
};

export { Home };
