import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import layerSync from "../assets/layerSync.png";
import { bridgeTokens, getLSBalance, getLayerZeroFee } from "../utils";
import { useAccount, useNetwork } from "wagmi";

// TODO:
// Implement dark mode in practice
// Add Bridge and Faucet links to Header
// Bridge.js and Faucet.js error toasts: cannot bridge 0 tokens, invalid number of tokens (negative, null, NaN, 1e10), insufficient funds
// Handle errors in utils.js as toasts as well, including rejected transactions
// Add toasts for sent and confirmed transactions, and for added network or LS token to wallet
// Convert to TypeScript

export const Bridge = () => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();

  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [fee, setFee] = useState(0);
  const [targetChain, setTargetChain] = useState(
    chain.network === "arbitrum" ? "bsc" : "arbitrum"
  );

  useEffect(() => {
    const main = async () => {
      try {
        const lsBalance = await getLSBalance(chain.network, address);
        setBalance(lsBalance);

        const fee = await getLayerZeroFee(
          chain.network,
          targetChain,
          address,
          amount
        );
        setFee(fee);
      } catch (error) {
        console.error(error);
      }
    };

    main();
  }, [chain.network, targetChain, amount, address]);

  const handleChangeAmount = (e) => {
    setAmount(e.target.value);
  };

  const handleChangeTargetChain = (e) => {
    setTargetChain(e.target.value);
  };

  const bridge = async () => {
    setAmount(0);
    console.log({
      address,
      chain: chain.network,
      targetChain,
      amount,
    });
    await bridgeTokens(address, chain.network, targetChain, amount);
  };

  return (
    <div className="bridge-container">
      <h2 className="bridge-title mt-4">LayerSync Omnichain Bridge</h2>
      <div className="bridge-description mt-3 mb-2">
        <p>
          LayerSync is a demo application utilizing LayerZero's Omnichain
          Fungible Token (OFT) standard to connect multiple EVM chains'
          testnets: Arbitrum Goerli, BSC Testnet and Scroll Sepolia.
        </p>
        <p>
          This bridge allows you to bridge your LayerSync (LS) tokens. To get LS
          tokens, please mint them using our <Link to="/faucet">faucet</Link>.
          To get testnet ETH or BNB, please use the links found{" "}
          <Link to="/faucet">here</Link>.
        </p>
      </div>
      <Form className="bridge-form">
        <Form.Group className="mb-3 mt-4">
          <div className="bridge-ls">
            <Form.Label className="bridge-label">Bridge LS</Form.Label>
            <span>
              <img src={layerSync} alt="LayerSync" className="bridge-ls-logo" />
              {balance}
            </span>
          </div>
          <Form.Control
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={handleChangeAmount}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="bridge-label">Send to</Form.Label>
          <Form.Select>
            <option
              value="arbitrum"
              selected={targetChain === "arbitrum"}
              disabled={chain.network === "arbitrum"}
              onChange={handleChangeTargetChain}
            >
              Arbitrum Goerli
            </option>
            <option
              value="bsc"
              selected={targetChain === "bsc"}
              disabled={chain.network === "bsc"}
              onChange={handleChangeTargetChain}
            >
              BSC Testnet
            </option>
            <option
              value="scroll"
              selected={targetChain === "scroll"}
              disabled={chain.network === "scroll"}
              onChange={handleChangeTargetChain}
            >
              Scroll Sepolia
            </option>
          </Form.Select>
        </Form.Group>

        <div className="bridge-fee-container">
          <span className="text-muted bridge-label">Fee</span>
          <span>
            {Math.round(fee * 100000) / 100000}{" "}
            {chain.network === "bsc" ? "BNB" : "ETH"}
          </span>
        </div>

        <Button
          className="bridge-button"
          variant="primary"
          as="input"
          type="button"
          value={isConnected ? "Bridge LS" : "Connect Wallet"}
          disabled={!isConnected}
          onClick={bridge}
        />
      </Form>
    </div>
  );
};
