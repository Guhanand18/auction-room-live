import React, { useState, useEffect } from 'react';
import { useAuction } from '@/context/AuctionContext';
import { IPL_TEAMS, createTeam } from '@/data/teams';

export default function LoginScreen() {
  const { state, dispatch, setMyTeamId, setIsHost, initRoom } = useAuction();
  const [name, setName] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [roomId, setRoomId] = useState('');
  const [mode, setMode] = useState<'choose' | 'create' | 'join'>('choose');
  const [currentRoomId, setCurrentRoomId] = useState('');

  // Restore from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ipl-auction-user');
    if (saved) {
      const data = JSON.parse(saved);
      setName(data.name || '');
    }
  }, []);

  const takenTeams = state.teams.filter(t => !t.isBot).map(t => t.id);

  const handleCreateRoom = () => {
    const rid = Math.random().toString(36).substring(2, 8).toUpperCase();
    setCurrentRoomId(rid);
    setMode('create');
  };

  const handleJoinRoom = () => {
    if (!roomId.trim()) return;
    setCurrentRoomId(roomId.trim().toUpperCase());
    setMode('join');
  };

  const handleEnter = () => {
    if (!name.trim() || !selectedTeam) return;

    // Initialize teams if not already done
    if (state.teams.length === 0) {
      const teams = IPL_TEAMS.map(t => createTeam(t, true));
      // We'll handle this through a special init
    }

    localStorage.setItem('ipl-auction-user', JSON.stringify({ name: name.trim(), teamId: selectedTeam, roomId: currentRoomId }));
    setMyTeamId(selectedTeam);
    
    if (mode === 'create') {
      setIsHost(true);
    }

    dispatch({ type: 'JOIN_ROOM', payload: { name: name.trim(), teamId: selectedTeam } });
  };

  if (mode === 'choose') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="auction-card max-w-md w-full text-center space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-gold-gradient mb-2">🏏 IPL Auction</h1>
            <p className="text-muted-foreground text-sm">Simulator</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleCreateRoom}
              className="w-full py-4 rounded-lg bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-opacity"
            >
              Create Room
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or</span>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Room ID"
                value={roomId}
                onChange={e => setRoomId(e.target.value.toUpperCase())}
                maxLength={6}
                className="flex-1 rounded-lg bg-secondary px-4 py-3 text-foreground placeholder:text-muted-foreground text-center mono-numbers tracking-widest uppercase"
              />
              <button
                onClick={handleJoinRoom}
                disabled={!roomId.trim()}
                className="px-6 py-3 rounded-lg bg-accent text-accent-foreground font-bold hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                Join
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="auction-card max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gold-gradient mb-1">🏏 IPL Auction</h1>
          <p className="text-muted-foreground text-sm">
            Room: <span className="mono-numbers text-primary font-bold tracking-widest">{currentRoomId}</span>
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Your Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={20}
              className="w-full rounded-lg bg-secondary px-4 py-3 text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1">Select Your Team</label>
            <div className="grid grid-cols-2 gap-2">
              {IPL_TEAMS.map(team => {
                const taken = takenTeams.includes(team.id);
                const selected = selectedTeam === team.id;
                return (
                  <button
                    key={team.id}
                    onClick={() => !taken && setSelectedTeam(team.id)}
                    disabled={taken}
                    className={`p-3 rounded-lg text-sm font-bold transition-all border ${
                      selected
                        ? 'border-primary bg-primary/20 text-primary'
                        : taken
                        ? 'border-border bg-muted/30 text-muted-foreground opacity-40 cursor-not-allowed'
                        : 'border-border bg-secondary hover:border-primary/50 text-secondary-foreground'
                    }`}
                  >
                    <span
                      className="inline-block w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: `hsl(${team.color})` }}
                    />
                    {team.shortName}
                    {taken && ' (Taken)'}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleEnter}
            disabled={!name.trim() || !selectedTeam}
            className="w-full py-4 rounded-lg bg-accent text-accent-foreground font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            Enter Lobby →
          </button>
        </div>
      </div>
    </div>
  );
}
