import React, { useState } from 'react';
import { TeamInfo } from '@/types/auction';
import { formatPrice } from '@/data/players';
import SquadViewer from './SquadViewer';

interface Props {
  teams: TeamInfo[];
  myTeamId: string | null;
  currentLeaderId?: string;
}

export default function TeamPanel({ teams, myTeamId, currentLeaderId }: Props) {
  const [viewingTeam, setViewingTeam] = useState<string | null>(null);
  const teamToView = teams.find(t => t.id === viewingTeam);

  return (
    <>
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Teams</h3>
        {teams.map(team => (
          <button
            key={team.id}
            onClick={() => setViewingTeam(team.id)}
            className={`w-full p-2.5 rounded-lg border text-left transition-all hover:border-primary/40 ${
              team.id === currentLeaderId
                ? 'border-primary bg-primary/10'
                : team.id === myTeamId
                ? 'border-accent/50 bg-accent/5'
                : 'border-border bg-secondary'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: `hsl(${team.color})` }}
                />
                <span className="font-bold text-xs">{team.shortName}</span>
                {team.isBot && <span className="text-[10px] text-muted-foreground">[BOT]</span>}
                {team.id === myTeamId && <span className="text-[10px] text-accent">YOU</span>}
              </div>
              <span className="mono-numbers text-xs text-primary">{formatPrice(team.purse)}</span>
            </div>
            <div className="flex gap-2 mt-1 text-[10px] text-muted-foreground">
              <span>Squad: {team.squad.length}/25</span>
              <span>OS: {team.overseasCount}/8</span>
            </div>
          </button>
        ))}
      </div>

      {teamToView && (
        <SquadViewer team={teamToView} onClose={() => setViewingTeam(null)} />
      )}
    </>
  );
}
