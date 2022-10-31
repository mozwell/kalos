import React from "react";
import { Button } from "@mui/joy";
import { ConnectButton as _ConnectButton } from "@rainbow-me/rainbowkit";
import { Login, AccountBalanceWallet, Dangerous } from "@mui/icons-material";

type ConnectButtonProps = {
  fullWidth?: boolean;
};

const ConnectButton = (props: ConnectButtonProps) => {
  const { fullWidth } = props;

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
            style={{ width: "250px" }}
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
                    fullWidth={fullWidth}
                  >
                    Connect Wallet
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button
                    startDecorator={<Dangerous />}
                    size={"lg"}
                    onClick={openChainModal}
                    fullWidth={fullWidth}
                  >
                    Wrong Network
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
