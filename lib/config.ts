import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

export const INK_L1_BRIDGE_ADDRESS = '0x88FF1e5b602916615391F55854588EFcBB7663f0';

export const KRAKEN_HOT_WALLETS = [
  '0x267be1c1d684f78cb4f6a176c4911b741e4ffdc0',
  '0x0a869d79a7052c7f1b55a8ebabea3420f0d1e13c', 
];

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

export const L1_STANDARD_BRIDGE_ABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'from', type: 'address' },
      { indexed: true, name: 'to', type: 'address' },
      { indexed: false, name: 'amount', type: 'uint256' },
      { indexed: false, name: 'extraData', type: 'bytes' },
    ],
    name: 'ETHDepositInitiated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'l1Token', type: 'address' },
      { indexed: true, name: 'l2Token', type: 'address' },
      { indexed: true, name: 'from', type: 'address' },
      { indexed: false, name: 'to', type: 'address' },
      { indexed: false, name: 'amount', type: 'uint256' },
      { indexed: false, name: 'extraData', type: 'bytes' },
    ],
    name: 'ERC20DepositInitiated',
    type: 'event',
  },
] as const;