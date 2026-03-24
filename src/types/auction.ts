export type PlayerRole = 'Batter' | 'WK-Batter' | 'All-Rounder' | 'Spin Bowler' | 'Fast Bowler';
export type PlayerCategory = 'Batters' | 'Wicket-Keepers' | 'All-Rounders' | 'Spinners' | 'Fast Bowlers';
export type PlayerStatus = 'upcoming' | 'sold' | 'unsold' | 'current';
export type Nationality = 'Indian' | 'Overseas';

export interface Player {
  id: string;
  name: string;
  role: PlayerRole;
  category: PlayerCategory;
  nationality: Nationality;
  basePrice: number; // in lakhs
  status: PlayerStatus;
  soldTo?: string; // team id
  soldPrice?: number; // in lakhs
}

export interface TeamInfo {
  id: string;
  name: string;
  shortName: string;
  color: string; // HSL string for team accent
  purse: number; // in lakhs (12000 = 120 Cr)
  squad: Player[];
  overseasCount: number;
  isBot: boolean;
  owner?: string; // player name
}

export interface Bid {
  teamId: string;
  amount: number; // in lakhs
  timestamp: number;
}

export interface AuctionFeedEntry {
  id: string;
  message: string;
  type: 'announcement' | 'bid' | 'sold' | 'unsold' | 'system';
  timestamp: number;
}

export type GamePhase = 'login' | 'lobby' | 'auction' | 'mini-auction' | 'ended';

export interface GameState {
  roomId: string;
  phase: GamePhase;
  teams: TeamInfo[];
  playerPool: Player[];
  currentPlayer: Player | null;
  currentBid: Bid | null;
  timer: number;
  feed: AuctionFeedEntry[];
  currentCategory: PlayerCategory | 'All';
  categoryOrder: PlayerCategory[];
  categoryIndex: number;
  unsoldPlayers: Player[];
  miniAuctionTeams: string[];
}

export type GameAction =
  | { type: 'JOIN_ROOM'; payload: { name: string; teamId: string } }
  | { type: 'START_AUCTION' }
  | { type: 'NEXT_PLAYER' }
  | { type: 'PLACE_BID'; payload: { teamId: string } }
  | { type: 'TIMER_TICK' }
  | { type: 'SELL_PLAYER' }
  | { type: 'UNSOLD_PLAYER' }
  | { type: 'SET_PHASE'; payload: GamePhase }
  | { type: 'BOT_BID'; payload: { teamId: string } }
  | { type: 'ADD_FEED'; payload: { message: string; type: AuctionFeedEntry['type'] } }
  | { type: 'RESET' };
