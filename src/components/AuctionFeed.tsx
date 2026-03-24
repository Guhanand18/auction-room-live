import React, { useRef, useEffect } from 'react';
import { AuctionFeedEntry } from '@/types/auction';

interface Props {
  feed: AuctionFeedEntry[];
}

const typeColors: Record<AuctionFeedEntry['type'], string> = {
  announcement: 'text-primary',
  bid: 'text-foreground',
  sold: 'text-accent',
  unsold: 'text-sold-red',
  system: 'text-muted-foreground',
};

export default function AuctionFeed({ feed }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [feed.length]);

  return (
    <div className="auction-card h-48 overflow-y-auto scrollbar-thin">
      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 sticky top-0 bg-card py-1">
        Live Commentary
      </h3>
      <div className="space-y-1">
        {feed.slice(-50).map(entry => (
          <p key={entry.id} className={`text-xs ${typeColors[entry.type]} animate-slide-up`}>
            {entry.message}
          </p>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
