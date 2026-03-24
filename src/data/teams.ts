import { TeamInfo } from '@/types/auction';

export const IPL_TEAMS: Omit<TeamInfo, 'purse' | 'squad' | 'overseasCount' | 'isBot' | 'owner'>[] = [
  { id: 'csk', name: 'Chennai Super Kings', shortName: 'CSK', color: '45 100% 50%' },
  { id: 'mi', name: 'Mumbai Indians', shortName: 'MI', color: '210 80% 50%' },
  { id: 'rcb', name: 'Royal Challengers Bengaluru', shortName: 'RCB', color: '0 75% 50%' },
  { id: 'kkr', name: 'Kolkata Knight Riders', shortName: 'KKR', color: '270 60% 45%' },
  { id: 'dc', name: 'Delhi Capitals', shortName: 'DC', color: '210 90% 45%' },
  { id: 'pbks', name: 'Punjab Kings', shortName: 'PBKS', color: '0 85% 55%' },
  { id: 'rr', name: 'Rajasthan Royals', shortName: 'RR', color: '320 70% 50%' },
  { id: 'srh', name: 'Sunrisers Hyderabad', shortName: 'SRH', color: '25 95% 55%' },
];

export function createTeam(teamData: typeof IPL_TEAMS[number], isBot: boolean, owner?: string): TeamInfo {
  return {
    ...teamData,
    purse: 12000, // 120 Cr in lakhs
    squad: [],
    overseasCount: 0,
    isBot,
    owner,
  };
}
