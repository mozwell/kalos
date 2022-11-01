import React, { useEffect, useState, useMemo, useCallback } from "react";
import { CircularProgress } from "@mui/joy";
import { Outlet } from "react-router-dom";
import ListItem from "@mui/joy/ListItem";
import FormControl from "@mui/joy/FormControl";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListItemButton from "@mui/joy/ListItemButton";
import { Person, Apps, Create, Money, Search } from "@mui/icons-material";
import { useAccount, useBalance, useNetwork } from "wagmi";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";

import { ConnectButton, CardList } from "../../components";
import { useGlobalStore } from "../../hooks";
import { hasStoredArtworkData } from "../../store";
import { toast } from "../../utils";
import {
  Wallpaper,
  Overview,
  LeftRail,
  StyledList,
  TotalCount,
  StyledDivider,
  StyledButton,
  LoadingWrapper,
  StyledLogo,
  StyledSearch,
  StyledRadio,
  StyledFormLabel,
  StyledRadioGroup,
} from "./styled";

const Home = observer(() => {
  const { address, isConnected } = useAccount();
  const { chain: currentChain } = useNetwork();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [isDescending, setIsDescending] = useState(true);
  const [loading, setLoading] = useState(false);
  const { data: myBalance } = useBalance({
    addressOrName: address,
  });

  const { fetchArtworkList, artworkList, myArtworkList } = useGlobalStore({
    myAddress: address || "",
    isConnected,
    myBalance: Number(myBalance?.formatted || 0),
  });

  const currentArtworkList = useMemo(() => {
    const currentList = currentTab === 0 ? artworkList : myArtworkList;
    return currentList
      .filter((item) =>
        item.title.toLowerCase().includes(keyword.toLowerCase()),
      )
      .sort((a, b) =>
        isDescending
          ? parseInt(b.artworkId) - parseInt(a.artworkId)
          : parseInt(a.artworkId) - parseInt(b.artworkId),
      );
  }, [currentTab, artworkList, myArtworkList, keyword, isDescending]);

  const isChainSupported = !Boolean(currentChain?.unsupported);

  useEffect(() => {
    if (!hasStoredArtworkData()) {
      setLoading(true);
    }
    fetchArtworkList().finally(() => {
      setLoading(false);
    });
  }, []);

  const goToFaucet = useCallback(() => {
    window.open("https://goerlifaucet.com/");
  }, []);

  const goToCreate = useCallback(() => {
    const formattedBalance = myBalance?.formatted;
    const convertedBalance = Number(formattedBalance);
    console.log(
      "goToCreate",
      "myBalance",
      myBalance,
      "convertedBalance",
      convertedBalance,
    );
    if (!convertedBalance) {
      toast("Before create, you should have balance in your account", {
        actionText: "Get some ETH",
        onAction: goToFaucet,
      });
      return;
    }
    navigate("create");
  }, [myBalance, goToFaucet, navigate]);

  const handleSortBy = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setIsDescending(e.target.value === "Descending"),
    [setIsDescending],
  );

  return (
    <Wallpaper>
      <Overview>
        <LeftRail>
          <StyledLogo />
          <StyledDivider />
          <StyledSearch
            variant={"solid"}
            placeholder="Search by title"
            fullWidth
            startDecorator={<Search />}
            onChange={(e) => setKeyword(e.target.value)}
          />
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
          <StyledDivider />
          <FormControl>
            <StyledFormLabel>Sort by ID</StyledFormLabel>
            <StyledRadioGroup
              row
              defaultValue="Descending"
              name="radio-buttons-group"
              sx={{ my: 1 }}
              value={isDescending ? "Descending" : "Ascending"}
              onChange={handleSortBy}
            >
              <StyledRadio
                variant="solid"
                value="Descending"
                label="Descending"
              />
              <StyledRadio
                variant="solid"
                value="Ascending"
                label="Ascending"
              />
            </StyledRadioGroup>
          </FormControl>
          <StyledDivider />
          <TotalCount level="body1">
            Total: {currentArtworkList.length}
          </TotalCount>
          <StyledDivider hasMarginBottom />
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
