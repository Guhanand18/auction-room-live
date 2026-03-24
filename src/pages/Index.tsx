import React, { useState, useEffect } from 'react';
import { AuctionProvider, useAuction } from '@/context/AuctionContext';
import { IPL_TEAMS, createTeam } from '@/data/teams';
import LoginScreen from '@/components/LoginScreen';
import Lobby from '@/components/Lobby';
import AuctionRoom from '@/components/AuctionRoom';
import EndScreen from '@/components/EndScreen';

function GameRouter() {
  const { state } = useAuction();

  switch (state.phase) {
    case 'login':
      return <LoginScreen />;
    case 'lobby':
      return <Lobby />;
    case 'auction':
    case 'mini-auction':
      return <AuctionRoom />;
    case 'ended':
      return <EndScreen />;
    default:
      return <LoginScreen />;
  }
}

export default function Index() {
  return (
    <AuctionProvider>
      <GameRouter />
    </AuctionProvider>
  );
}
