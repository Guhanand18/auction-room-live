import React from 'react';
import { Player } from '@/types/auction';
import { formatPrice } from '@/data/players';

interface Props {
  player: Player;
  bidAmount: number | null;
  leadingTeam: string | null;
  timer: number;
}

export default function PlayerCard({ player, bidAmount, leadingTeam, timer }: Props) {
  const roleEmoji: Record<string, string> = {
    'Batter': '🏏',
    'WK-Batter': '🧤',
    'All-Rounder': '⭐',
    'Spin Bowler': '🌀',
    'Fast Bowler': '💨',
  };

  return (
    <div className="auction-card text-center space-y-4 animate-slide-up">
      {/* Player avatar placeholder */}
      <div className="w-24 h-24 mx-auto rounded-full bg-secondary border-2 border-primary/30 flex items-center justify-center text-4xl">
        {roleEmoji[player.role] || '🏏'}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gold-gradient">{player.name}</h2>
        <div className="flex items-center justify-center gap-2 mt-1">
          <span className="text-xs px-2 py-0.5 rounded bg-secondary text-secondary-foreground">{player.role}</span>
          <span className={`text-xs px-2 py-0.5 rounded ${
            player.nationality === 'Overseas' ? 'bg-bid-blue/20 text-bid-blue' : 'bg-accent/20 text-accent'
          }`}>
            {player.nationality}
          </span>
        </div>
        <p className="text-muted-foreground text-sm mt-1">Base: {formatPrice(player.basePrice)}</p>
      </div>

      {/* Current bid */}
      <div className="bg-secondary rounded-lg p-4">
        {bidAmount ? (
          <>
            <p className="text-3xl font-bold mono-numbers text-primary">{formatPrice(bidAmount)}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Leading: <span className="text-foreground font-bold">{leadingTeam}</span>
            </p>
          </>
        ) : (
          <p className="text-xl text-muted-foreground">No bids yet</p>
        )}
      </div>

      {/* Timer */}
      <div className="space-y-1">
        <div className="h-2 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-linear"
            style={{
              width: `${(timer / 15) * 100}%`,
              backgroundColor: timer <= 3 ? 'hsl(var(--sold-red))' : timer <= 7 ? 'hsl(var(--primary))' : 'hsl(var(--cricket-green))',
            }}
          />
        </div>
        <p className={`text-sm mono-numbers font-bold ${timer <= 3 ? 'text-sold-red' : 'text-muted-foreground'}`}>
          {timer}s
        </p>
      </div>
    </div>
  );
}
