import { NextResponse } from 'next/server';
import { parseAbiItem, formatEther } from 'viem';
import { publicClient, INK_L1_BRIDGE_ADDRESS, L1_STANDARD_BRIDGE_ABI, KRAKEN_HOT_WALLETS } from '@/lib/config';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const currentBlock = await publicClient.getBlockNumber();
    const fromBlock = currentBlock - 1000n; 

    const ethLogs = await publicClient.getLogs({
      address: INK_L1_BRIDGE_ADDRESS,
      event: parseAbiItem('event ETHDepositInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)'),
      fromBlock,
      toBlock: currentBlock,
    });

    const erc20Logs = await publicClient.getLogs({
      address: INK_L1_BRIDGE_ADDRESS,
      event: parseAbiItem('event ERC20DepositInitiated(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)'),
      fromBlock,
      toBlock: currentBlock,
    });

    const allLogs = [...ethLogs, ...erc20Logs].sort((a, b) => 
      Number(b.blockNumber) - Number(a.blockNumber)
    );

    const events = await Promise.all(
      allLogs.map(async (log) => {
        const block = await publicClient.getBlock({ blockNumber: log.blockNumber });
        const isEth = log.eventName === 'ETHDepositInitiated';
        
        // @ts-ignore
        const fromAddr = log.args.from?.toLowerCase() || '';
        // @ts-ignore
        const amount = log.args.amount || 0n;
        
        const isKraken = KRAKEN_HOT_WALLETS.includes(fromAddr);

        return {
          hash: log.transactionHash,
          blockNumber: log.blockNumber.toString(),
          timestamp: new Date(Number(block.timestamp) * 1000).toISOString(),
          from: fromAddr,
          // @ts-ignore
          to: log.args.to,
          amount: formatEther(amount),
          token: isEth ? 'ETH' : 'ERC20',
          source: isKraken ? 'Kraken' : 'Other',
          isKraken,
        };
      })
    );

    return NextResponse.json({ events });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}