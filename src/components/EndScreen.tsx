import React, { useState } from 'react';
import { useAuction } from '@/context/AuctionContext';
import { formatPrice } from '@/data/players';
import SquadViewer from './SquadViewer';

export default function EndScreen() {
  const { state, dispatch, setMyTeamId, setIsHost } = useAuction();
  const [viewingTeam, setViewingTeam] = useState<string | null>(null);

  const sortedTeams = [...state.teams].sort((a, b) => b.squad.length - a.squad.length);
  const teamToView = state.teams.find(t => t.id === viewingTeam);

  const handleReset = () => {
    localStorage.removeItem('ipl-auction-user');
    setMyTeamId(null);
    setIsHost(false);
    dispatch({ type: 'RESET' });
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center py-6">
          <h1 className="text-4xl font-bold text-gold-gradient mb-2">🏆 Auction Complete!</h1>
          <p className="text-muted-foreground">Here's the final summary of all team squads</p>
        </div>

        <div className="grid gap-3">
          {sortedTeams.map(team => {
            const spent = 12000 - team.purse;
            return (
              <button
                key={team.id}
                onClick={() => setViewingTeam(team.id)}
                className="auction-card flex items-center justify-between hover:border-primary/40 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full shrink-0" style={{ backgroundColor: `hsl(${team.color})` }} />
                  <div>
                    <p className="font-bold">{team.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {team.isBot ? '[BOT]' : team.owner}
                    </p>
                  </div>
                </div>
                <div className="text-right space-y-0.5">
                  <p className="text-sm">
                    <span className="text-muted-foreground">Squad:</span>{' '}
                    <span className="font-bold">{team.squad.length}</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Spent:</span>{' '}
                    <span className="mono-numbers text-primary font-bold">{formatPrice(spent)}</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Remaining:</span>{' '}
                    <span className="mono-numbers text-accent font-bold">{formatPrice(team.purse)}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    OS: {team.overseasCount}/8
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-center pt-4">
          <button
            onClick={handleReset}
            className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity"
          >
            🔄 Play Again
          </button>
        </div>
      </div>

      {teamToView && (
        <SquadViewer team={teamToView} onClose={() => setViewingTeam(null)} />
      )}
    </div>
  );
}
