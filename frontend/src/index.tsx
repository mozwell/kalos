import React from "react";
import ReactDOM from "react-dom/client";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { WagmiConfig } from "wagmi";
import { BrowserRouter as Router } from "react-router-dom";
import { CssVarsProvider } from "@mui/joy/styles";

import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import "@rainbow-me/rainbowkit/styles.css";

import { App } from "./App";
import { wagmiClient, chains } from "./config/wagmiClient";
import { ToastContainer } from "./utils/toast";
import { GlobalStoreProvider } from "./store";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <React.StrictMode>
    <GlobalStoreProvider>
      <Router>
        <WagmiConfig client={wagmiClient}>
          <CssVarsProvider>
            <RainbowKitProvider chains={chains} theme={darkTheme()}>
              <App />
              <ToastContainer />
            </RainbowKitProvider>
          </CssVarsProvider>
        </WagmiConfig>
      </Router>
    </GlobalStoreProvider>
  </React.StrictMode>,
);
