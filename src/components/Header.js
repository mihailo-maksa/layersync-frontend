import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Link } from "react-router-dom";
import layerSync from "../assets/layerSync.png";

export const Header = () => {
  return (
    <div className="header">
      <div className="header-logo-container">
        <img src={layerSync} alt="LayerSync" className="header-logo" />{" "}
        <Link to="/" className="header-logo-text">
          LayerSync Bridge
        </Link>
      </div>
      <div className="header-connect">
        <ConnectButton />
      </div>
    </div>
  );
};
