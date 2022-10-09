import React from "react";
import ReactDOM from "react-dom/client";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiConfig } from "wagmi";
import { BrowserRouter as Router } from "react-router-dom";
import { CssVarsProvider } from "@mui/joy/styles";

import "./index.css";
import { App } from "./App";
import { wagmiClient, chains } from "./config/wagmiClient";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <Router>
      <WagmiConfig client={wagmiClient}>
        <CssVarsProvider>
          <RainbowKitProvider chains={chains}>
            <App />
          </RainbowKitProvider>
        </CssVarsProvider>
      </WagmiConfig>
    </Router>
  </React.StrictMode>,
);
