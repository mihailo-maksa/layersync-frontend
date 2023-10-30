import { ethers } from "ethers";

export const layerSyncAddresses = {
  arbitrum: "0xb75D178dc790b498322086Ed3Ad035A4B2a7448a",
  bsc: "0x250661E6A9D755E062c36851f90223e4CEB93035",
  scroll: "0x8aB4db3D33c64c3456F040E6B7347A427cCe6360",
};

export const layersyncAbi = [
  "function balanceOf(address _account) external view returns (uint256)",
  "function sendFrom(address _from, uint16 _dstChainId, bytes _toAddress, uint256 _amount, address _refundAddress, address _zroPaymentAddress, bytes _adapterParams) external payable",
  "function estimateSendFee(uint16 _dstChainId, bytes calldata _toAddress, uint256 _amount, bool _useZro, bytes calldata _adapterParams) external view returns (uint256 nativeFee, uint256 zroFee)",
  "function mint(address _account, uint256 _amount) external",
];

export const networkConfig = {
  arbitrum: {
    name: "Arbitrum Goerli",
    chainId: 421613,
    lzChainId: 1000,
    faucetLink: "https://goerlifaucet.com",
    bridgeLink: "https://bridge.arbitrum.io/?l2ChainId=421613",
    nativeToken: "ETH",
    rpcUrl: "https://arbitrum-goerli.publicnode.com",
  },
  bsc: {
    name: "BSC Testnet",
    chainId: 97,
    lzChainId: 1001,
    faucetLink: "https://testnet.bnbchain.org/faucet-smart",
    bridgeLink: null,
    nativeToken: "BNB",
    rpcUrl: "https://bsc-testnet.publicnode.com",
  },
  scroll: {
    name: "Scroll Sepolia",
    chainId: 534351,
    lzChainId: 1002,
    faucetLink: "https://sepoliafaucet.com",
    bridgeLink: "https://sepolia.scroll.io/bridge",
    nativeToken: "ETH",
    rpcUrl: "https://sepolia-rpc.scroll.io",
  },
};

export const supportedChains = ["arbitrum", "bsc", "scroll"];

export const supportedChainIds = [421613, 97, 534351];

export const getProvider = (chain) => {
  if (!supportedChains.includes(chain)) {
    throw new Error(`Chain ${chain} is not supported.`);
  }

  const provider = new ethers.providers.JsonRpcProvider(
    networkConfig[chain].rpcUrl
  );
  return provider;
};

export const getWeb3Signer = async () => {
  if (!window.ethereum) {
    throw new Error("No web3 provider found.");
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner().connectUnchecked();
  return signer;
};

export const getLSContract = async (chain) => {
  if (!supportedChains.includes(chain)) {
    throw new Error(`Chain ${chain} is not supported.`);
  }

  const provider = getProvider(chain);
  return new ethers.Contract(layerSyncAddresses[chain], layersyncAbi, provider);
};

export const getLSBalance = async (chain, address) => {
  const lsContract = await getLSContract(chain);
  const balanceRaw = await lsContract.balanceOf(address);
  return ethers.utils.formatEther(balanceRaw.toString());
};

export const getLayerZeroFee = async (srcChain, dstChain, address, amount) => {
  const lsContract = await getLSContract(srcChain);

  const lzFees = await lsContract.estimateSendFee(
    networkConfig[dstChain].lzChainId,
    address.toLowerCase(),
    ethers.utils.parseEther(amount.toString()),
    false,
    "0x"
  );
  const nativeFee = ethers.utils.formatEther(lzFees[0].toString());

  return nativeFee;
};

//
export const mintTokens = async (chain, address, amount) => {
  if (!supportedChains.includes(chain)) {
    throw new Error(`Chain ${chain} is not supported.`);
  }

  const web3Signer = await getWeb3Signer();

  const lsContract = new ethers.Contract(
    layerSyncAddresses[chain],
    layersyncAbi,
    web3Signer
  );

  const tx = await lsContract.mint(
    address,
    ethers.utils.parseEther(amount.toString())
  );
  await tx.wait(1);
  console.log("minted");
};

//  "function sendFrom(address _from, uint16 _dstChainId, bytes _toAddress, uint256 _amount, address _refundAddress, address _zroPaymentAddress, bytes _adapterParams) external payable",
export const bridgeTokens = async (address, srcChain, dstChain, amount) => {
  if (
    !supportedChains.includes(srcChain) ||
    !supportedChains.includes(dstChain)
  ) {
    throw new Error(`Chain ${dstChain} is not supported.`);
  }

  if (srcChain === dstChain) {
    throw new Error(`Source and destination chains must be different.`);
  }

  const web3Signer = await getWeb3Signer();

  const lsContract = new ethers.Contract(
    layerSyncAddresses[dstChain],
    layersyncAbi,
    web3Signer
  );

  const nativeFee = await getLayerZeroFee(srcChain, dstChain, address, amount);

  const tx = await lsContract.sendFrom(
    address,
    networkConfig[srcChain].lzChainId,
    address.toLowerCase(),
    ethers.utils.parseEther(amount.toString()),
    address.toLowerCase(),
    ethers.constants.AddressZero,
    "0x",
    {
      value: ethers.utils.parseEther(nativeFee.toString()),
    }
  );
  await tx.wait(1);
  console.log("bridged");
};
