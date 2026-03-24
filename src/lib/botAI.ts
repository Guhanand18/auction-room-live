import { TeamInfo, Player, Bid, PlayerCategory } from '@/types/auction';
import { getBidIncrement } from '@/data/players';

export type BotStrategy = 'aggressive' | 'balanced' | 'budget' | 'specialist';

export interface BotProfile {
  teamId: string;
  strategy: BotStrategy;
  specialistRole?: PlayerCategory; // for specialist bots
  temperament: number; // 0-1, higher = more willing to overbid
}

const STRATEGY_POOL: BotStrategy[] = ['aggressive', 'aggressive', 'balanced', 'balanced', 'balanced', 'budget', 'budget', 'specialist'];

export function assignBotProfile(teamId: string): BotProfile {
  const strategy = STRATEGY_POOL[Math.floor(Math.random() * STRATEGY_POOL.length)];
  const roles: PlayerCategory[] = ['Batters', 'Fast Bowlers', 'All-Rounders', 'Spinners', 'Wicket-Keepers'];
  return {
    teamId,
    strategy,
    specialistRole: strategy === 'specialist' ? roles[Math.floor(Math.random() * roles.length)] : undefined,
    temperament: 0.3 + Math.random() * 0.5, // 0.3 - 0.8
  };
}

// Assess what roles a team is missing
function getSquadNeeds(team: TeamInfo): { needsWK: boolean; needsBatters: boolean; needsBowlers: boolean; needsAllRounders: boolean; urgency: number } {
  const wkCount = team.squad.filter(p => p.role === 'WK-Batter').length;
  const batterCount = team.squad.filter(p => p.role === 'Batter').length;
  const bowlerCount = team.squad.filter(p => p.role === 'Fast Bowler' || p.role === 'Spin Bowler').length;
  const arCount = team.squad.filter(p => p.role === 'All-Rounder').length;
  const totalSquad = team.squad.length;

  // How urgently does the team need players? Higher = more desperate
  const slotsRemaining = 25 - totalSquad;
  const slotsNeeded = Math.max(0, 18 - totalSquad);
  const urgency = slotsNeeded > 10 ? 0.9 : slotsNeeded > 5 ? 0.7 : slotsNeeded > 0 ? 0.5 : 0.2;

  return {
    needsWK: wkCount < 2,
    needsBatters: batterCount < 4,
    needsBowlers: bowlerCount < 4,
    needsAllRounders: arCount < 2,
    urgency,
  };
}

function getPlayerRating(player: Player): number {
  // Higher base price = higher rating (simple heuristic)
  if (player.basePrice >= 200) return 0.95;
  if (player.basePrice >= 150) return 0.8;
  if (player.basePrice >= 100) return 0.65;
  if (player.basePrice >= 75) return 0.5;
  if (player.basePrice >= 50) return 0.35;
  return 0.2;
}

function doesTeamNeedRole(team: TeamInfo, player: Player): boolean {
  const needs = getSquadNeeds(team);
  switch (player.category) {
    case 'Wicket-Keepers': return needs.needsWK;
    case 'Batters': return needs.needsBatters;
    case 'Fast Bowlers':
    case 'Spinners': return needs.needsBowlers;
    case 'All-Rounders': return needs.needsAllRounders;
    default: return true;
  }
}

export function shouldBotBid(
  profile: BotProfile,
  team: TeamInfo,
  player: Player,
  currentBid: Bid | null,
  nextBidAmount: number
): { interested: boolean; maxCap: number } {
  const rating = getPlayerRating(player);
  const needs = getSquadNeeds(team);
  const needsRole = doesTeamNeedRole(team, player);

  // Base interest probability
  let interestProb = 0;
  let multiplierRange: [number, number] = [1.5, 2.0];

  switch (profile.strategy) {
    case 'aggressive':
      interestProb = rating > 0.7 ? 0.85 : rating > 0.5 ? 0.55 : 0.25;
      multiplierRange = [2.0, 3.5];
      // Aggressive bots love star players
      if (rating >= 0.9) interestProb = 0.95;
      break;

    case 'balanced':
      interestProb = needsRole ? 0.65 : 0.3;
      multiplierRange = [1.5, 2.5];
      // Balanced bots prioritize needs
      if (needsRole && rating > 0.5) interestProb = 0.8;
      break;

    case 'budget':
      interestProb = player.basePrice <= 100 ? 0.6 : player.basePrice <= 50 ? 0.75 : 0.15;
      multiplierRange = [1.2, 1.8];
      // Budget bots avoid expensive players
      if (player.basePrice >= 200) interestProb = 0.05;
      break;

    case 'specialist':
      if (player.category === profile.specialistRole) {
        interestProb = 0.85;
        multiplierRange = [2.0, 3.0];
      } else {
        interestProb = needsRole ? 0.3 : 0.1;
        multiplierRange = [1.2, 1.8];
      }
      break;
  }

  // Urgency modifier - more desperate teams bid more
  interestProb *= (0.7 + needs.urgency * 0.4);

  // If team already has 20+ players, reduce interest significantly
  if (team.squad.length >= 20) interestProb *= 0.3;
  if (team.squad.length >= 23) interestProb *= 0.1;

  // Purse pressure - if low on funds, be more conservative
  const purseRatio = team.purse / 12000;
  if (purseRatio < 0.2) interestProb *= 0.4;
  if (purseRatio < 0.1) interestProb *= 0.2;

  // WK is critical - if team has 0 WKs and this is a WK, boost interest
  if (player.category === 'Wicket-Keepers' && team.squad.filter(p => p.role === 'WK-Batter').length === 0 && team.squad.length > 5) {
    interestProb = Math.max(interestProb, 0.9);
  }

  // Calculate max cap
  const multiplier = multiplierRange[0] + Math.random() * (multiplierRange[1] - multiplierRange[0]);
  const maxCap = Math.round(player.basePrice * multiplier);

  // Bluff: 5% chance of one extra bid beyond cap
  const bluffing = Math.random() < 0.05;
  const effectiveCap = bluffing ? maxCap + getBidIncrement(maxCap) : maxCap;

  // Final check: is the next bid within our cap?
  const interested = Math.random() < Math.min(interestProb, 1) && nextBidAmount <= effectiveCap;

  return { interested, maxCap: effectiveCap };
}

export function getBotBidDelay(): number {
  return 2000 + Math.random() * 3000; // 2-5 seconds
}
