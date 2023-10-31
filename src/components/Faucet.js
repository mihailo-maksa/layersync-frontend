import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import layerSync from "../assets/layerSync.png";
import { useAccount, useNetwork } from "wagmi";
import {
  getLSBalance,
  mintTokens,
  networkConfig,
  addNetwork,
  addLSToWallet,
} from "../utils";

export const Faucet = () => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();

  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    const main = async () => {
      try {
        const lsBalance = await getLSBalance(chain.network, address);
        setBalance(lsBalance);
      } catch (error) {
        console.error(error);
      }
    };

    main();
  }, [address, chain]);

  const handleChangeAmount = (e) => {
    setAmount(e.target.value);
  };

  const mint = async () => {
    setAmount(0);
    await mintTokens(chain.network, address, amount);
  };

  return (
    <div className="faucet-container">
      <h2 className="faucet-title mt-4 mb-5">LayerSync Faucet</h2>

      <div className="faucet-ls">
        <span className="faucet-label">LS Balance</span>
        <div>
          <span className={"faucet-ls-balance"}>
            <img src={layerSync} alt="LayerSync" className="faucet-ls-logo" />
            {balance}
          </span>
          <Button
            className="add-to-wallet-button"
            variant="primary"
            as="input"
            type="button"
            value={isConnected ? "Add to Wallet" : "Connect Wallet"}
            disabled={!isConnected}
            onClick={() => addLSToWallet(chain.network)}
          />
        </div>
      </div>

      <div className="faucet-ls">
        <Form.Control
          className="mt-3 mb-3"
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={handleChangeAmount}
        />
        <Button
          className="mint-button"
          variant="primary"
          as="input"
          type="button"
          value={isConnected ? "Mint" : "Connect Wallet"}
          disabled={!isConnected}
          onClick={mint}
        />
      </div>
      <div className="faucet-ls">
        <p>
          Get Testnet Tokens:{" "}
          <a
            href={networkConfig.arbitrum.faucetLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            Goerli ETH
          </a>{" "}
          |{" "}
          <a
            href={networkConfig.scroll.faucetLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Sepolia ETH
          </a>{" "}
          |{" "}
          <a
            href={networkConfig.bsc.faucetLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Testnet BNB
          </a>
        </p>
      </div>
      <div className="faucet-ls">
        <p>
          Bridge Testnet ETH to:{" "}
          <a
            href={networkConfig.arbitrum.bridgeLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Arbitrum Goerli
          </a>{" "}
          |{" "}
          <a
            href={networkConfig.scroll.bridgeLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Scroll Sepolia
          </a>
        </p>
      </div>
      <div className="faucet-ls">
        <p>
          Add Networks:{" "}
          <span
            className="text-primary underline bold pointer"
            onClick={() => addNetwork("arbitrum")}
          >
            Arbitrum Goerli
          </span>{" "}
          |{" "}
          <span
            className="text-primary underline bold pointer"
            onClick={() => addNetwork("scroll")}
          >
            Scroll Sepolia
          </span>{" "}
          |{" "}
          <span
            className="text-primary underline bold pointer"
            onClick={() => addNetwork("bsc")}
          >
            BSC Testnet
          </span>
        </p>
      </div>
    </div>
  );
};
