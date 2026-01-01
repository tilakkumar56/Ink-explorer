export type BridgeEvent = {
  hash: string;
  blockNumber: string;
  timestamp: string;
  from: string;
  to: string;
  amount: string;
  token: string;
  source: 'Kraken' | 'Other OP Chain' | 'Unknown';
  isKraken: boolean;
};