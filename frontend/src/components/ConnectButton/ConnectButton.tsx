import React from "react";
import styled from "@emotion/styled";
import { Button } from "@mui/joy";
import { ConnectButton as _ConnectButton } from "@rainbow-me/rainbowkit";
import { Login, AccountBalanceWallet } from "@mui/icons-material";

const ConnectButton = () => {
  return (
    <_ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    startDecorator={<Login />}
                    size={"lg"}
                    onClick={openConnectModal}
                  >
                    Connect Wallet
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button size={"lg"} onClick={openChainModal}>
                    Wrong network
                  </Button>
                );
              }

              return (
                <div style={{ width: "250px", display: "flex" }}>
                  {/* <Button
                    style={{ marginRight: "10px" }}
                    onClick={openChainModal}
                    size={"lg"}
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 12,
                          height: 12,
                          borderRadius: 999,
                          overflow: "hidden",
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            style={{ width: 12, height: 12 }}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </Button> */}

                  <Button
                    onClick={openAccountModal}
                    size={"lg"}
                    fullWidth
                    startDecorator={<AccountBalanceWallet />}
                  >
                    {account.displayName} ({account.displayBalance})
                  </Button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </_ConnectButton.Custom>
  );
};

export { ConnectButton };
