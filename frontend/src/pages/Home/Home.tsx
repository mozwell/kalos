import React from "react";
import styled from "@emotion/styled";
import { Typography } from "@mui/joy";
import { Outlet } from "react-router-dom";

import { CardList } from "../../components/CardList";

import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListItemButton from "@mui/joy/ListItemButton";
import { Person, Apps } from "@mui/icons-material";

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
`;

const StyledList = styled(List)`
  width: 250px;
`;

const Home = () => {
  return (
    <Wallpaper>
      <Overview>
        <LeftRail>
          <Typography level="h2">Kalos</Typography>
          <StyledList>
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
          <Typography level="body1">Artworks Num: 45</Typography>
        </LeftRail>
        <CardList
          data={
            [
              1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 1, 2, 3, 4, 5, 6, 7, 8,
              9, 10, 11, 12, 13,
            ] as any
          }
        />
      </Overview>
      <Outlet />
    </Wallpaper>
  );
};

export { Home };
