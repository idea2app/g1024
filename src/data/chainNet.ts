import { DelphinusWeb3 } from 'web3subscriber/src/client';

export const chainNet = {
  chainId: 97,
  chainName: 'Binance Smart Chain Testnet',
  nativeCurrency: {
    name: 'Binance Chain Native Token',
    symbol: 'tBNB',
    decimals: 18,
  },
  rpcUrls: ['https://endpoints.omniatech.io/v1/bsc/testnet/public'],
  blockExplorerUrls: ['https://testnet.bscscan.com'],
};

export const switchNet = async (web3: DelphinusWeb3) => {
  const { chainName, nativeCurrency } = chainNet;
  await web3.switchNet(
    web3.web3Instance.utils.numberToHex(chainNet.chainId),
    chainName,
    chainNet.rpcUrls[0],
    nativeCurrency,
    chainNet.blockExplorerUrls[0],
  );
};
