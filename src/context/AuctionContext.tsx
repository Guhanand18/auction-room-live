import React, { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react';
import { GameState, GameAction, TeamInfo, Player, Bid, AuctionFeedEntry, PlayerCategory, GamePhase } from '@/types/auction';
import { createPlayerPool, getBidIncrement, formatPrice } from '@/data/players';
import { IPL_TEAMS, createTeam } from '@/data/teams';

const CATEGORY_ORDER: PlayerCategory[] = ['Batters', 'Wicket-Keepers', 'All-Rounders', 'Spinners', 'Fast Bowlers'];

function createFeedEntry(message: string, type: AuctionFeedEntry['type']): AuctionFeedEntry {
  return { id: `feed-${Date.now()}-${Math.random()}`, message, type, timestamp: Date.now() };
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function canTeamBid(team: TeamInfo, bidAmount: number, player: Player, currentBid: Bid | null): boolean {
  if (team.squad.length >= 25) return false;
  if (team.purse < bidAmount) return false;
  if (player.nationality === 'Overseas' && team.overseasCount >= 8) return false;
  if (currentBid && currentBid.teamId === team.id) return false;
  const remainingSlots = 18 - team.squad.length - 1;
  if (remainingSlots > 0) {
    const minNeeded = remainingSlots * 20;
    if (team.purse - bidAmount < minNeeded) return false;
  }
  return true;
}

function createInitialState(): GameState {
  return {
    roomId: '',
    phase: 'login',
    teams: IPL_TEAMS.map(t => createTeam(t, true)),
    playerPool: [],
    currentPlayer: null,
    currentBid: null,
    timer: 15,
    feed: [],
    currentCategory: 'All',
    categoryOrder: CATEGORY_ORDER,
    categoryIndex: 0,
    unsoldPlayers: [],
    miniAuctionTeams: [],
  };
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'JOIN_ROOM': {
      const { name, teamId } = action.payload;
      const teams = state.teams.map(t =>
        t.id === teamId ? { ...t, isBot: false, owner: name } : t
      );
      return {
        ...state,
        teams,
        phase: 'lobby',
        feed: [...state.feed, createFeedEntry(`${name} joined as ${teams.find(t => t.id === teamId)?.name}!`, 'system')],
      };
    }

    case 'START_AUCTION': {
      const pool = shuffleArray(createPlayerPool());
      const catPlayers = pool.filter(p => p.category === CATEGORY_ORDER[0]);
      const firstPlayer = catPlayers.length > 0 ? catPlayers[Math.floor(Math.random() * catPlayers.length)] : pool[0];

      const updatedPool = pool.map(p =>
        p.id === firstPlayer.id ? { ...p, status: 'current' as const } : p
      );

      return {
        ...state,
        phase: 'auction',
        playerPool: updatedPool,
        currentPlayer: { ...firstPlayer, status: 'current' },
        currentBid: null,
        timer: 15,
        categoryIndex: 0,
        currentCategory: CATEGORY_ORDER[0],
        feed: [
          createFeedEntry('🏏 The IPL Mega Auction has begun!', 'system'),
          createFeedEntry(`📢 Category: ${CATEGORY_ORDER[0]}`, 'system'),
          createFeedEntry(`🎤 ${firstPlayer.name} is up for auction! Base price: ${formatPrice(firstPlayer.basePrice)}`, 'announcement'),
        ],
      };
    }

    case 'PLACE_BID':
    case 'BOT_BID': {
      const { teamId } = action.payload;
      const team = state.teams.find(t => t.id === teamId);
      const player = state.currentPlayer;
      if (!team || !player) return state;

      const currentAmount = state.currentBid?.amount ?? player.basePrice;
      const newAmount = state.currentBid ? currentAmount + getBidIncrement(currentAmount) : player.basePrice;

      if (!canTeamBid(team, newAmount, player, state.currentBid)) return state;

      const newBid: Bid = { teamId, amount: newAmount, timestamp: Date.now() };
      return {
        ...state,
        currentBid: newBid,
        timer: 15,
        feed: [...state.feed, createFeedEntry(`💰 ${team.shortName} placed a bid of ${formatPrice(newAmount)}`, 'bid')],
      };
    }

    case 'TIMER_TICK':
      return { ...state, timer: Math.max(0, state.timer - 1) };

    case 'SELL_PLAYER': {
      const { currentPlayer, currentBid, teams, playerPool } = state;
      if (!currentPlayer || !currentBid) return state;

      const buyingTeam = teams.find(t => t.id === currentBid.teamId);
      if (!buyingTeam) return state;

      const soldPlayer: Player = { ...currentPlayer, status: 'sold', soldTo: currentBid.teamId, soldPrice: currentBid.amount };
      const updatedTeams = teams.map(t =>
        t.id === currentBid.teamId
          ? {
              ...t,
              purse: t.purse - currentBid.amount,
              squad: [...t.squad, soldPlayer],
              overseasCount: t.overseasCount + (currentPlayer.nationality === 'Overseas' ? 1 : 0),
            }
          : t
      );
      const updatedPool = playerPool.map(p => (p.id === currentPlayer.id ? soldPlayer : p));

      return {
        ...state,
        teams: updatedTeams,
        playerPool: updatedPool,
        currentPlayer: null,
        currentBid: null,
        feed: [...state.feed, createFeedEntry(`🔨 SOLD! ${currentPlayer.name} to ${buyingTeam.shortName} for ${formatPrice(currentBid.amount)}!`, 'sold')],
      };
    }

    case 'UNSOLD_PLAYER': {
      const { currentPlayer, playerPool, unsoldPlayers } = state;
      if (!currentPlayer) return state;

      const unsoldPlayer: Player = { ...currentPlayer, status: 'unsold' };
      const updatedPool = playerPool.map(p => (p.id === currentPlayer.id ? unsoldPlayer : p));

      return {
        ...state,
        playerPool: updatedPool,
        currentPlayer: null,
        currentBid: null,
        unsoldPlayers: [...unsoldPlayers, unsoldPlayer],
        feed: [...state.feed, createFeedEntry(`❌ ${currentPlayer.name} goes UNSOLD!`, 'unsold')],
      };
    }

    case 'NEXT_PLAYER': {
      let nextPlayer: Player | null = null;
      let newCategoryIndex = state.categoryIndex;
      const newFeed = [...state.feed];

      if (state.phase === 'mini-auction') {
        const available = state.unsoldPlayers.filter(p => p.status === 'upcoming' || p.status === 'unsold');
        nextPlayer = available.length > 0 ? available[Math.floor(Math.random() * available.length)] : null;
      } else {
        // Try current category
        const currentCat = CATEGORY_ORDER[state.categoryIndex];
        let available = state.playerPool.filter(p => p.category === currentCat && p.status === 'upcoming');
        if (available.length > 0) {
          nextPlayer = available[Math.floor(Math.random() * available.length)];
        } else {
          // Move to next categories
          for (let i = state.categoryIndex + 1; i < CATEGORY_ORDER.length; i++) {
            available = state.playerPool.filter(p => p.category === CATEGORY_ORDER[i] && p.status === 'upcoming');
            if (available.length > 0) {
              newCategoryIndex = i;
              nextPlayer = available[Math.floor(Math.random() * available.length)];
              newFeed.push(createFeedEntry(`📢 Category: ${CATEGORY_ORDER[i]}`, 'system'));
              break;
            }
          }
        }
      }

      // Check if main auction done → mini auction
      if (!nextPlayer && state.phase === 'auction') {
        const teamsNeedingPlayers = state.teams.filter(t => t.squad.length < 18);
        if (teamsNeedingPlayers.length > 0 && state.unsoldPlayers.length > 0) {
          const resetUnsold = state.unsoldPlayers.map(p => ({ ...p, status: 'upcoming' as const }));
          return {
            ...state,
            phase: 'mini-auction',
            unsoldPlayers: resetUnsold,
            currentPlayer: null,
            miniAuctionTeams: teamsNeedingPlayers.map(t => t.id),
            feed: [...newFeed, createFeedEntry('🔄 Mini-Auction Round begins! Unsold players return.', 'system')],
          };
        }
        return { ...state, phase: 'ended', currentPlayer: null, feed: [...newFeed, createFeedEntry('🏆 The IPL Auction is complete!', 'system')] };
      }

      if (!nextPlayer) {
        return { ...state, phase: 'ended', currentPlayer: null, feed: [...newFeed, createFeedEntry('🏆 The IPL Auction is complete!', 'system')] };
      }

      const updatedPool = state.playerPool.map(p => (p.id === nextPlayer!.id ? { ...p, status: 'current' as const } : p));
      const updatedUnsold = state.unsoldPlayers.map(p => (p.id === nextPlayer!.id ? { ...p, status: 'current' as const } : p));

      newFeed.push(createFeedEntry(`🎤 ${nextPlayer.name} is up for auction! Base price: ${formatPrice(nextPlayer.basePrice)}`, 'announcement'));

      return {
        ...state,
        playerPool: updatedPool,
        unsoldPlayers: updatedUnsold,
        currentPlayer: { ...nextPlayer, status: 'current' },
        currentBid: null,
        timer: 15,
        categoryIndex: newCategoryIndex,
        currentCategory: CATEGORY_ORDER[newCategoryIndex] || state.currentCategory,
        feed: newFeed,
      };
    }

    case 'SET_PHASE':
      return { ...state, phase: action.payload };

    case 'ADD_FEED':
      return { ...state, feed: [...state.feed, createFeedEntry(action.payload.message, action.payload.type)] };

    case 'RESET':
      return createInitialState();

    default:
      return state;
  }
}

interface AuctionContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  myTeamId: string | null;
  isHost: boolean;
  setMyTeamId: (id: string | null) => void;
  setIsHost: (v: boolean) => void;
  roomId: string;
  setRoomId: (id: string) => void;
}

const AuctionContext = createContext<AuctionContextValue | null>(null);

export function AuctionProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);
  const [myTeamId, setMyTeamId] = React.useState<string | null>(null);
  const [isHost, setIsHost] = React.useState(false);
  const [roomId, setRoomId] = React.useState('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const botTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Timer logic
  useEffect(() => {
    if ((state.phase === 'auction' || state.phase === 'mini-auction') && state.currentPlayer) {
      timerRef.current = setInterval(() => {
        dispatch({ type: 'TIMER_TICK' });
      }, 1000);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [state.phase, state.currentPlayer?.id]);

  // Handle timer expiry
  useEffect(() => {
    if (state.timer === 0 && state.currentPlayer) {
      if (state.currentBid) {
        dispatch({ type: 'SELL_PLAYER' });
      } else {
        dispatch({ type: 'UNSOLD_PLAYER' });
      }
      setTimeout(() => {
        dispatch({ type: 'NEXT_PLAYER' });
      }, 1500);
    }
  }, [state.timer, state.currentPlayer, state.currentBid]);

  // Bot bidding logic
  useEffect(() => {
    if ((state.phase !== 'auction' && state.phase !== 'mini-auction') || !state.currentPlayer) return;
    if (state.timer <= 0) return;

    const botTeams = state.teams.filter(t => t.isBot);
    if (botTeams.length === 0) return;

    const player = state.currentPlayer;
    const currentAmount = state.currentBid?.amount ?? player.basePrice;
    const nextBidAmount = state.currentBid ? currentAmount + getBidIncrement(currentAmount) : player.basePrice;

    botTimerRef.current = setTimeout(() => {
      const interestedBots = botTeams.filter(bot => {
        if (!canTeamBid(bot, nextBidAmount, player, state.currentBid)) return false;
        const ceiling = player.basePrice * (1.5 + Math.random());
        if (nextBidAmount > ceiling) return false;
        return Math.random() < 0.4;
      });

      if (interestedBots.length > 0) {
        const bidder = interestedBots[Math.floor(Math.random() * interestedBots.length)];
        dispatch({ type: 'BOT_BID', payload: { teamId: bidder.id } });
      }
    }, 2000 + Math.random() * 3000);

    return () => {
      if (botTimerRef.current) clearTimeout(botTimerRef.current);
    };
  }, [state.phase, state.currentPlayer?.id, state.currentBid, state.timer]);

  return (
    <AuctionContext.Provider value={{ state, dispatch, myTeamId, isHost, setMyTeamId, setIsHost, roomId, setRoomId }}>
      {children}
    </AuctionContext.Provider>
  );
}

export function useAuction() {
  const ctx = useContext(AuctionContext);
  if (!ctx) throw new Error('useAuction must be used within AuctionProvider');
  return ctx;
}

export { canTeamBid };
