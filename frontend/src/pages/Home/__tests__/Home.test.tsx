import React from "react";
import { render, screen } from "@testing-library/react";
import * as Wagmi from "wagmi";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";
import { GlobalStoreProvider } from "../../../store";

import { Home } from "..";

jest.mock("@rainbow-me/rainbowkit", () => ({
  ConnectButton: {
    Custom: jest.fn(),
  },
}));
jest.mock("nft.storage", () => ({
  NFTStorage: jest.fn(),
}));

describe("Home", () => {
  describe("Layout", () => {
    const spyOnCommon = () => {
      jest
        .spyOn(Wagmi, "useAccount")
        .mockReturnValue({ address: "0x012345", isConnected: true });
      jest
        .spyOn(Wagmi, "useBalance")
        .mockReturnValue({ data: { formatted: "0.1" } });
      jest.spyOn(Wagmi, "useNetwork").mockReturnValue({ chain: {} });
    };
    beforeEach(() => {
      spyOnCommon();
    });
    it("should render LeftRail correctly, with Logo, Search, Tabs, Sort, and Buttons", () => {
      render(
        <GlobalStoreProvider>
          <Router>
            <Home />
          </Router>
        </GlobalStoreProvider>,
      );
      const logo = screen.queryByText("logo.svg");
      expect(logo).toBeInTheDocument();
      const search = screen.queryByPlaceholderText("Search by title");
      expect(search).toBeInTheDocument();
      const allArtworkTab = screen.queryByText("All Artworks");
      expect(allArtworkTab).toBeInTheDocument();
      const myArtworkTab = screen.queryByText("My Artworks");
      expect(myArtworkTab).toBeInTheDocument();
      const sort = screen.queryByLabelText("Sort by ID");
      expect(sort).toBeInTheDocument();
      const getEthButton = screen.queryByText("Get some ETH");
      expect(getEthButton).toBeInTheDocument();
      const createButton = screen.queryByText("Create My Artwork");
      expect(createButton).toBeInTheDocument();
    });
    it("should render Gallery as spinner when loading artworks", () => {});
    it("should render Gallery as artwork list when finish loading artworks", () => {});
  });

  describe("effect", () => {
    it("should show loading spinner only when no active artwork data in local storage", () => {});
    it("should fetch artwork list when first render", () => {});
    it("should stop loading no matter the fetch is ended with success or failure", () => {});
  });

  describe("Search by title", () => {
    it("should set keyword as user inputs", () => {});
    it("should filter artwork list correctly according to the keyword", () => {});
  });

  describe("Switch Tab", () => {
    it("should set All artworks as default tab when user open the app", () => {});
    it("should switch tab correctly when click on the corresponding tab", () => {});
  });

  describe("Sort by ID", () => {
    it("should set descending as default sorting when user open the app", () => {});
    it("should sort artworks correctly when click on the corresponding radio", () => {});
  });

  describe("Total Count", () => {
    it("should reflect the correct count when switch tab", () => {});
    it("should reflect the correct count when search by title", () => {});
  });

  describe("Get some ETH", () => {
    it("should open the faucet URL when click on this button", () => {});
  });

  describe("Create My Artwork", () => {
    it("should not render when account is not connected", () => {});
    it("should make a toast when current user has zero balance", () => {});
    it("should navigate to Create page when current user has NO zero balance", () => {});
  });
});
