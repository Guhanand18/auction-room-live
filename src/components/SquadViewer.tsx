import React from 'react';
import { TeamInfo } from '@/types/auction';
import { formatPrice } from '@/data/players';

interface Props {
  team: TeamInfo;
  onClose: () => void;
}

export default function SquadViewer({ team, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="auction-card max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full" style={{ backgroundColor: `hsl(${team.color})` }} />
            <h2 className="text-lg font-bold">{team.name}</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xl">✕</button>
        </div>

        <div className="flex gap-4 text-sm text-muted-foreground mb-3">
          <span>Purse: <span className="text-primary mono-numbers font-bold">{formatPrice(team.purse)}</span></span>
          <span>Squad: {team.squad.length}/25</span>
          <span>Overseas: {team.overseasCount}/8</span>
        </div>

        <div className="overflow-y-auto scrollbar-thin flex-1">
          {team.squad.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No players yet</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground text-xs border-b border-border">
                  <th className="text-left py-2">Player</th>
                  <th className="text-left py-2">Role</th>
                  <th className="text-center py-2">Type</th>
                  <th className="text-right py-2">Price</th>
                </tr>
              </thead>
              <tbody>
                {team.squad.map(player => (
                  <tr key={player.id} className="border-b border-border/50">
                    <td className="py-2 font-medium">{player.name}</td>
                    <td className="py-2 text-muted-foreground">{player.role}</td>
                    <td className="py-2 text-center">
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        player.nationality === 'Overseas' ? 'bg-bid-blue/20 text-bid-blue' : 'bg-accent/20 text-accent'
                      }`}>
                        {player.nationality === 'Overseas' ? 'OS' : 'IND'}
                      </span>
                    </td>
                    <td className="py-2 text-right mono-numbers text-primary">{formatPrice(player.soldPrice || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
