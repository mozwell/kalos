import React from "react";

import { Home } from "..";

describe("Home", () => {
  describe("Layout", () => {
    it("should render LeftRail correctly, with Logo, Search, Tabs, Sort, and Buttons", () => {});
    it("should render Gallery as spinner when loading artworks", () => {});
    it("should render Gallery as artwork list when finish loading artworks", () => {});
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
  describe("Total Count", () => {});
  describe("Get some ETH", () => {});
  describe("Create My Artwork", () => {});
});
