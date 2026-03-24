import React, { useState } from 'react';
import { useAuction, canTeamBid } from '@/context/AuctionContext';
import { getBidIncrement, formatPrice } from '@/data/players';
import PlayerCard from './PlayerCard';
import TeamPanel from './TeamPanel';
import PlayerPool from './PlayerPool';
import AuctionFeed from './AuctionFeed';
import { PlayerCategory } from '@/types/auction';

export default function AuctionRoom() {
  const { state, dispatch, myTeamId, roomId } = useAuction();
  const [poolCategory, setPoolCategory] = useState<PlayerCategory | 'All'>('All');

  const myTeam = state.teams.find(t => t.id === myTeamId);
  const currentPlayer = state.currentPlayer;
  const leadingTeam = state.currentBid
    ? state.teams.find(t => t.id === state.currentBid!.teamId)
    : null;

  const canBid = (() => {
    if (!myTeam || !currentPlayer) return false;
    const currentAmount = state.currentBid?.amount ?? currentPlayer.basePrice;
    const nextBid = state.currentBid ? currentAmount + getBidIncrement(currentAmount) : currentPlayer.basePrice;
    return canTeamBid(myTeam, nextBid, currentPlayer, state.currentBid);
  })();

  const nextBidAmount = (() => {
    if (!currentPlayer) return 0;
    const currentAmount = state.currentBid?.amount ?? currentPlayer.basePrice;
    return state.currentBid ? currentAmount + getBidIncrement(currentAmount) : currentPlayer.basePrice;
  })();

  const isLeading = state.currentBid?.teamId === myTeamId;

  const handleBid = () => {
    if (!canBid || !myTeamId) return;
    dispatch({ type: 'PLACE_BID', payload: { teamId: myTeamId } });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-gold-gradient">🏏 IPL Auction</h1>
          {state.phase === 'mini-auction' && (
            <span className="text-xs px-2 py-0.5 rounded bg-sold-red/20 text-sold-red font-bold animate-pulse">MINI AUCTION</span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Category: <span className="text-foreground font-bold">{state.currentCategory}</span></span>
          <span>Room: <span className="mono-numbers text-primary">{state.roomId}</span></span>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Player Pool */}
        <div className="w-64 border-r border-border p-3 overflow-hidden">
          <PlayerPool
            players={state.playerPool}
            currentCategory={poolCategory}
            onCategoryChange={setPoolCategory}
          />
        </div>

        {/* Center: Current Player + Bid */}
        <div className="flex-1 flex flex-col p-4 overflow-hidden">
          <div className="flex-1 flex items-center justify-center">
            {currentPlayer ? (
              <div className="w-full max-w-sm">
                <PlayerCard
                  player={currentPlayer}
                  bidAmount={state.currentBid?.amount ?? null}
                  leadingTeam={leadingTeam?.shortName ?? null}
                  timer={state.timer}
                />

                {/* Bid button */}
                <div className="mt-4">
                  {isLeading ? (
                    <div className="w-full py-4 rounded-lg bg-accent/20 text-accent font-bold text-center text-lg">
                      ✅ You are leading!
                    </div>
                  ) : (
                    <button
                      onClick={handleBid}
                      disabled={!canBid}
                      className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
                        canBid
                          ? 'bg-accent text-accent-foreground hover:opacity-90 animate-pulse-gold'
                          : 'bg-muted text-muted-foreground cursor-not-allowed'
                      }`}
                    >
                      {canBid ? `BID ${formatPrice(nextBidAmount)}` : 'Cannot Bid'}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <p className="text-2xl mb-2">⏳</p>
                <p>Next player coming up...</p>
              </div>
            )}
          </div>

          {/* Feed at bottom */}
          <AuctionFeed feed={state.feed} />
        </div>

        {/* Right: Teams */}
        <div className="w-56 border-l border-border p-3 overflow-y-auto scrollbar-thin">
          <TeamPanel
            teams={state.teams}
            myTeamId={myTeamId}
            currentLeaderId={state.currentBid?.teamId}
          />
        </div>
      </div>
    </div>
  );
}
