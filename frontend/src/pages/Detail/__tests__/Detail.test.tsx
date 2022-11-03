import React from "react";

import { Detail } from "..";

describe("Detail", () => {
  describe("Layout", () => {
    it("should render artwork frame on the left side", () => {});
    it("should render title, desc, author, owner, created time and tip balance on the right side", () => {});
    it("should render tip, withdraw, transfer, destroy button on the bottom when account is connected", () => {});
    it("should render connect button on the bottom when account is NOT connected", () => {});
  });

  describe("effect", () => {
    it("should fetch the specific artwork data when first render", () => {});
    it("should watch the tipBalances changes and make corresponding reactions", () => {});
    it("should watch the ownerOf changes and make corresponding reactions", () => {});
  });

  describe("tip", () => {
    it("should only show tip button when user has balance", () => {});
    it("should open tip dialog when clicks on the button", () => {});
  });

  describe("withdraw", () => {
    it("should only show withdraw button when user is the owner of artwork and it has tip balance", () => {});
    it("should open withdraw dialog when clicks on the button", () => {});
  });

  describe("transfer", () => {
    it("should only show transfer button when user is the owner of artwork", () => {});
    it("should open transfer dialog when clicks on the button", () => {});
  });

  describe("destroy", () => {
    it("should only show destroy button when user is the owner of artwork", () => {});
    it("should open destroy dialog when clicks on the button", () => {});
  });
});
