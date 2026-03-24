import React from 'react';
import { Player, PlayerCategory } from '@/types/auction';
import { formatPrice } from '@/data/players';

interface Props {
  players: Player[];
  currentCategory: PlayerCategory | 'All';
  onCategoryChange: (cat: PlayerCategory | 'All') => void;
}

const categories: (PlayerCategory | 'All')[] = ['All', 'Batters', 'Wicket-Keepers', 'All-Rounders', 'Spinners', 'Fast Bowlers'];

const statusStyle: Record<string, string> = {
  upcoming: 'text-muted-foreground',
  current: 'text-primary font-bold',
  sold: 'text-accent',
  unsold: 'text-sold-red',
};

const statusLabel: Record<string, string> = {
  upcoming: '',
  current: '🔴 LIVE',
  sold: '✅ SOLD',
  unsold: '❌',
};

export default function PlayerPool({ players, currentCategory, onCategoryChange }: Props) {
  const filtered = currentCategory === 'All' ? players : players.filter(p => p.category === currentCategory);

  return (
    <div className="flex flex-col min-h-0 h-full">
      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Player Pool</h3>
      
      {/* Category tabs */}
      <div className="flex gap-1 mb-2 overflow-x-auto pb-1 scrollbar-thin">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`text-[10px] px-2 py-1 rounded whitespace-nowrap transition-colors ${
              currentCategory === cat
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="overflow-y-auto scrollbar-thin flex-1 min-h-0 space-y-0.5">
        {filtered.map(player => (
          <div
            key={player.id}
            className={`flex items-center justify-between py-1.5 px-2 rounded text-xs ${
              player.status === 'current' ? 'bg-primary/10 border border-primary/30' : ''
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className={`shrink-0 ${statusStyle[player.status]}`}>
                {player.name}
              </span>
              {player.nationality === 'Overseas' && (
                <span className="text-[9px] px-1 py-0 rounded bg-bid-blue/20 text-bid-blue shrink-0">OS</span>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {player.status === 'sold' && player.soldPrice && (
                <span className="mono-numbers text-accent text-[10px]">{formatPrice(player.soldPrice)}</span>
              )}
              {statusLabel[player.status] && (
                <span className={`text-[10px] ${statusStyle[player.status]}`}>{statusLabel[player.status]}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
