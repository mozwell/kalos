import React, { useEffect, useState, useMemo } from "react";
import styled from "@emotion/styled";
import { Typography, Divider, Button, CircularProgress } from "@mui/joy";
import { Outlet } from "react-router-dom";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListItemButton from "@mui/joy/ListItemButton";
import { Person, Apps, Create, Money } from "@mui/icons-material";
import { useAccount, useBalance, useNetwork } from "wagmi";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";

import { ConnectButton } from "../../components/ConnectButton";
import { CardList } from "../../components/CardList";
import { useGlobalStore } from "../../hooks";
import { hasStoredArtworkData } from "../../store";
import { toast } from "../../utils";
// @ts-ignore
import { ReactComponent as Logo } from "../../assets/logo.svg";

const Wallpaper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: 100% 100%;
  background-image: url("https://images.unsplash.com/photo-1495422964407-28c01bf82b0d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3270&q=80");
`;

const Overview = styled.div`
  width: 80vw;
  height: 90vh;
  inset: 64px;
  background: rgba(35, 120, 130, 0.4);
  backdrop-filter: blur(31px);
  border: 1px solid rgba(35, 120, 130, 0.3);
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

const StyledButton = styled(Button)`
  margin-top: 15px;
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const StyledLogo = styled(Logo)`
  margin-top: 25px;
  margin-bottom: 30px;
`;

const Home = observer(() => {
  const { address, isConnected } = useAccount();
  const { chain: currentChain } = useNetwork();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const { data: myBalance } = useBalance({
    addressOrName: address,
  });

  const {
    fetchArtworkList,
    artworkList,
    setMyAddress,
    setIsConnected,
    myArtworkList,
    setMyBalance,
  } = useGlobalStore();

  const currentArtworkList = useMemo(
    () => (currentTab === 0 ? artworkList : myArtworkList),
    [currentTab, artworkList, myArtworkList],
  );
  const isChainSupported = !Boolean(currentChain?.unsupported);

  useEffect(() => {
    if (!hasStoredArtworkData()) {
      setLoading(true);
    }
    fetchArtworkList().finally(() => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    // It would possibly be undefined, so we add a safe fallback here.
    setMyAddress(address || "");
  }, [address]);

  useEffect(() => {
    setIsConnected(isConnected);
  }, [isConnected]);

  useEffect(() => {
    setMyBalance(myBalance);
  }, [myBalance]);

  const goToFaucet = () => {
    window.open("https://goerlifaucet.com/");
  };

  const goToCreate = () => {
    if (!myBalance?.value.toNumber()) {
      toast("Before create, you should have balance in your account", {
        actionText: "Get some ETH",
        onAction: goToFaucet,
      });
      return;
    }
    navigate("create");
  };

  return (
    <Wallpaper>
      <Overview>
        <LeftRail>
          <StyledLogo />
          <Divider />
          <StyledList size="lg">
            <ListItem>
              <ListItemButton
                selected={currentTab === 0}
                onClick={() => setCurrentTab(0)}
              >
                <ListItemDecorator>
                  <Apps />
                </ListItemDecorator>
                All Artworks
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton
                selected={currentTab === 1}
                onClick={() => setCurrentTab(1)}
              >
                <ListItemDecorator>
                  <Person />
                </ListItemDecorator>
                My Artworks
              </ListItemButton>
            </ListItem>
          </StyledList>
          <Divider />
          <TotalCount level="body1">
            Total: {currentArtworkList.length}
          </TotalCount>
          <StyledDivider />
          <ConnectButton fullWidth />
          <StyledButton
            variant={"solid"}
            size={"lg"}
            startDecorator={<Money />}
            onClick={goToFaucet}
            fullWidth
          >
            Get some ETH
          </StyledButton>
          {isConnected && (
            <StyledButton
              variant={"solid"}
              size={"lg"}
              startDecorator={<Create />}
              onClick={goToCreate}
              fullWidth
            >
              Create My Artwork
            </StyledButton>
          )}
        </LeftRail>
        {loading ? (
          <LoadingWrapper>
            <CircularProgress size={"lg"}></CircularProgress>
          </LoadingWrapper>
        ) : (
          <CardList
            data={currentArtworkList}
            isConnected={isConnected}
            isChainSupported={isChainSupported}
          />
        )}
      </Overview>
      <Outlet />
    </Wallpaper>
  );
});

export { Home };
