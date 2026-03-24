import React from 'react';
import { useAuction } from '@/context/AuctionContext';
import { createPlayerPool } from '@/data/players';

export default function Lobby() {
  const { state, dispatch, myTeamId, isHost } = useAuction();

  const humanCount = state.teams.filter(t => !t.isBot).length;

  const handleStart = () => {
    dispatch({ type: 'START_AUCTION' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="auction-card max-w-lg w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gold-gradient mb-1">Auction Lobby</h1>
          <p className="text-muted-foreground text-sm">
            Room: <span className="mono-numbers text-primary font-bold tracking-widest">{state.roomId}</span>
          </p>
          <p className="text-muted-foreground text-xs mt-1">Share this code with friends to join!</p>
        </div>

        <div className="space-y-2">
          {state.teams.map(team => (
            <div
              key={team.id}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                team.id === myTeamId
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-secondary'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-4 h-4 rounded-full shrink-0"
                  style={{ backgroundColor: `hsl(${team.color})` }}
                />
                <span className="font-bold text-sm">{team.shortName}</span>
                <span className="text-muted-foreground text-xs">{team.name}</span>
              </div>
              <div>
                {team.isBot ? (
                  <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">[BOT]</span>
                ) : (
                  <span className="text-xs px-2 py-1 rounded bg-accent/20 text-accent font-semibold">
                    {team.owner}
                    {team.id === myTeamId && ' (You)'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center space-y-3">
          <p className="text-sm text-muted-foreground">
            {humanCount} player{humanCount !== 1 ? 's' : ''} joined · {8 - humanCount} bot{8 - humanCount !== 1 ? 's' : ''}
          </p>
          {isHost ? (
            <button
              onClick={handleStart}
              className="w-full py-4 rounded-lg bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-opacity animate-pulse-gold"
            >
              🏏 Start Auction
            </button>
          ) : (
            <p className="text-muted-foreground text-sm italic">Waiting for host to start the auction...</p>
          )}
        </div>
      </div>
    </div>
  );
}
