'use client';

import { useEffect, useState } from 'react';
import { BridgeEvent } from '@/lib/types';
import { ArrowRightLeft, ShieldCheck, Globe } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function Dashboard() {
  const [events, setEvents] = useState<BridgeEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events')
      .then((res) => res.json())
      .then((data) => {
        setEvents(data.events || []);
        setLoading(false);
      });
  }, []);

  const krakenVolume = events
    .filter((e) => e.isKraken)
    .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

  const otherVolume = events
    .filter((e) => !e.isKraken)
    .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

  const totalVolume = krakenVolume + otherVolume;
  const krakenPercentage = totalVolume > 0 ? (krakenVolume / totalVolume) * 100 : 0;

  if (loading) return <div className="p-10 text-center text-zinc-400">Scanning Ink Bridge...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Ink-dex
          </h1>
          <p className="text-zinc-400 mt-2">Bridge Event Explorer: Kraken vs. The World</p>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 rounded-lg border border-purple-500/20">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span className="text-zinc-300">Kraken Volume</span>
            <span className="font-mono font-bold text-white">{krakenVolume.toFixed(4)} ETH</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 rounded-lg border border-zinc-800">
            <Globe className="w-4 h-4 text-blue-400" />
            <span className="text-zinc-300">Global Volume</span>
            <span className="font-mono font-bold text-white">{otherVolume.toFixed(4)} ETH</span>
          </div>
        </div>
      </header>

      <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
        <h3 className="text-zinc-400 text-sm mb-4 uppercase tracking-wider">Bridge Source Distribution</h3>
        <div className="h-8 w-full bg-zinc-800 rounded-full overflow-hidden flex">
          <div 
            style={{ width: `${krakenPercentage}%` }} 
            className="h-full bg-purple-600 flex items-center justify-center text-xs font-bold text-white transition-all duration-500"
          >
            {krakenPercentage.toFixed(1)}%
          </div>
          <div className="flex-1 bg-blue-900/40 flex items-center justify-center text-xs font-bold text-zinc-400">
            {(100 - krakenPercentage).toFixed(1)}%
          </div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-zinc-500 font-mono">
          <span>KRAKEN EXCHANGE</span>
          <span>OTHER OP STACK CHAINS</span>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-black">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-900/80 text-zinc-400">
            <tr>
              <th className="px-6 py-4 font-medium">Tx Hash</th>
              <th className="px-6 py-4 font-medium">Time</th>
              <th className="px-6 py-4 font-medium">From</th>
              <th className="px-6 py-4 font-medium">Source</th>
              <th className="px-6 py-4 font-medium text-right">Amount (ETH)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {events.map((event) => (
              <tr key={event.hash} className="hover:bg-zinc-900/30 transition-colors">
                <td className="px-6 py-4 font-mono text-purple-400">
                  <a href={`https://etherscan.io/tx/${event.hash}`} target="_blank" rel="noreferrer" className="hover:underline">
                    {event.hash.slice(0, 8)}...{event.hash.slice(-6)}
                  </a>
                </td>
                <td className="px-6 py-4 text-zinc-300">
                  {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                </td>
                <td className="px-6 py-4 font-mono text-zinc-500">
                  {event.from.slice(0, 6)}...{event.from.slice(-4)}
                </td>
                <td className="px-6 py-4">
                  {event.isKraken ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      <ShieldCheck className="w-3 h-3" /> Kraken
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      <Globe className="w-3 h-3" /> External
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right font-mono text-white">
                  {parseFloat(event.amount).toFixed(4)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}