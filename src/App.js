import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { Header } from "./components/Header";
import { Bridge } from "./components/Bridge";
import { Faucet } from "./components/Faucet";
import { Spinner } from "./components/layout/Spinner";
import { ThemeProvider } from "./state/ThemeContext";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { arbitrumGoerli, bscTestnet, scrollSepolia } from "./utils";
import "bootstrap/dist/css/bootstrap.min.css";

const { chains, publicClient } = configureChains(
  [arbitrumGoerli, bscTestnet, scrollSepolia],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "LayerSync Bridge",
  projectId: "edbf784c063273310e8f2089d04b1224",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export const App = () => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <ThemeProvider>
          <Suspense fallback={<Spinner />}>
            <Header />
            <Routes>
              <Route path="/" element={<Bridge />} />
              <Route path="/bridge" element={<Bridge />} />
              <Route path="/faucet" element={<Faucet />} />
              <Route path="*" element={<Navigate replace to="/" />} />
            </Routes>
          </Suspense>
        </ThemeProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};
