import { Player, PlayerCategory, PlayerRole } from '@/types/auction';

interface PlayerTemplate {
  name: string;
  role: PlayerRole;
  category: PlayerCategory;
  nationality: 'Indian' | 'Overseas';
  basePrice: number; // lakhs
}

const playerTemplates: PlayerTemplate[] = [
  // === BATTERS ===
  { name: 'Virat Kohli', role: 'Batter', category: 'Batters', nationality: 'Indian', basePrice: 200 },
  { name: 'Rohit Sharma', role: 'Batter', category: 'Batters', nationality: 'Indian', basePrice: 200 },
  { name: 'Shubman Gill', role: 'Batter', category: 'Batters', nationality: 'Indian', basePrice: 200 },
  { name: 'Suryakumar Yadav', role: 'Batter', category: 'Batters', nationality: 'Indian', basePrice: 200 },
  { name: 'KL Rahul', role: 'Batter', category: 'Batters', nationality: 'Indian', basePrice: 200 },
  { name: 'Shreyas Iyer', role: 'Batter', category: 'Batters', nationality: 'Indian', basePrice: 200 },
  { name: 'Devdutt Padikkal', role: 'Batter', category: 'Batters', nationality: 'Indian', basePrice: 100 },
  { name: 'Ruturaj Gaikwad', role: 'Batter', category: 'Batters', nationality: 'Indian', basePrice: 200 },
  { name: 'Yashasvi Jaiswal', role: 'Batter', category: 'Batters', nationality: 'Indian', basePrice: 200 },
  { name: 'Prithvi Shaw', role: 'Batter', category: 'Batters', nationality: 'Indian', basePrice: 75 },
  { name: 'Tilak Varma', role: 'Batter', category: 'Batters', nationality: 'Indian', basePrice: 100 },
  { name: 'Rinku Singh', role: 'Batter', category: 'Batters', nationality: 'Indian', basePrice: 100 },
  { name: 'Abhishek Sharma', role: 'Batter', category: 'Batters', nationality: 'Indian', basePrice: 100 },
  { name: 'David Warner', role: 'Batter', category: 'Batters', nationality: 'Overseas', basePrice: 200 },
  { name: 'Faf du Plessis', role: 'Batter', category: 'Batters', nationality: 'Overseas', basePrice: 200 },
  { name: 'Travis Head', role: 'Batter', category: 'Batters', nationality: 'Overseas', basePrice: 200 },
  { name: 'Kane Williamson', role: 'Batter', category: 'Batters', nationality: 'Overseas', basePrice: 200 },
  { name: 'Jos Buttler', role: 'Batter', category: 'Batters', nationality: 'Overseas', basePrice: 200 },
  { name: 'Steve Smith', role: 'Batter', category: 'Batters', nationality: 'Overseas', basePrice: 200 },
  { name: 'Quinton de Kock', role: 'Batter', category: 'Batters', nationality: 'Overseas', basePrice: 200 },
  { name: 'Phil Salt', role: 'Batter', category: 'Batters', nationality: 'Overseas', basePrice: 200 },
  
  // === WICKET-KEEPERS ===
  { name: 'Rishabh Pant', role: 'WK-Batter', category: 'Wicket-Keepers', nationality: 'Indian', basePrice: 200 },
  { name: 'Ishan Kishan', role: 'WK-Batter', category: 'Wicket-Keepers', nationality: 'Indian', basePrice: 200 },
  { name: 'Sanju Samson', role: 'WK-Batter', category: 'Wicket-Keepers', nationality: 'Indian', basePrice: 200 },
  { name: 'Dinesh Karthik', role: 'WK-Batter', category: 'Wicket-Keepers', nationality: 'Indian', basePrice: 100 },
  { name: 'KS Bharat', role: 'WK-Batter', category: 'Wicket-Keepers', nationality: 'Indian', basePrice: 30 },
  { name: 'Jitesh Sharma', role: 'WK-Batter', category: 'Wicket-Keepers', nationality: 'Indian', basePrice: 50 },
  { name: 'Dhruv Jurel', role: 'WK-Batter', category: 'Wicket-Keepers', nationality: 'Indian', basePrice: 50 },
  { name: 'N Jagadeesan', role: 'WK-Batter', category: 'Wicket-Keepers', nationality: 'Indian', basePrice: 30 },
  { name: 'Heinrich Klaasen', role: 'WK-Batter', category: 'Wicket-Keepers', nationality: 'Overseas', basePrice: 200 },
  { name: 'Jonny Bairstow', role: 'WK-Batter', category: 'Wicket-Keepers', nationality: 'Overseas', basePrice: 150 },

  // === ALL-ROUNDERS ===
  { name: 'Hardik Pandya', role: 'All-Rounder', category: 'All-Rounders', nationality: 'Indian', basePrice: 200 },
  { name: 'Ravindra Jadeja', role: 'All-Rounder', category: 'All-Rounders', nationality: 'Indian', basePrice: 200 },
  { name: 'Axar Patel', role: 'All-Rounder', category: 'All-Rounders', nationality: 'Indian', basePrice: 150 },
  { name: 'Shardul Thakur', role: 'All-Rounder', category: 'All-Rounders', nationality: 'Indian', basePrice: 100 },
  { name: 'Venkatesh Iyer', role: 'All-Rounder', category: 'All-Rounders', nationality: 'Indian', basePrice: 100 },
  { name: 'Vijay Shankar', role: 'All-Rounder', category: 'All-Rounders', nationality: 'Indian', basePrice: 50 },
  { name: 'Washington Sundar', role: 'All-Rounder', category: 'All-Rounders', nationality: 'Indian', basePrice: 100 },
  { name: 'Shahbaz Ahmed', role: 'All-Rounder', category: 'All-Rounders', nationality: 'Indian', basePrice: 50 },
  { name: 'Ben Stokes', role: 'All-Rounder', category: 'All-Rounders', nationality: 'Overseas', basePrice: 200 },
  { name: 'Glenn Maxwell', role: 'All-Rounder', category: 'All-Rounders', nationality: 'Overseas', basePrice: 200 },
  { name: 'Marcus Stoinis', role: 'All-Rounder', category: 'All-Rounders', nationality: 'Overseas', basePrice: 150 },
  { name: 'Sam Curran', role: 'All-Rounder', category: 'All-Rounders', nationality: 'Overseas', basePrice: 200 },
  { name: 'Cameron Green', role: 'All-Rounder', category: 'All-Rounders', nationality: 'Overseas', basePrice: 175 },
  { name: 'Mitchell Marsh', role: 'All-Rounder', category: 'All-Rounders', nationality: 'Overseas', basePrice: 150 },
  { name: 'Moeen Ali', role: 'All-Rounder', category: 'All-Rounders', nationality: 'Overseas', basePrice: 100 },
  { name: 'Andre Russell', role: 'All-Rounder', category: 'All-Rounders', nationality: 'Overseas', basePrice: 200 },

  // === SPINNERS ===
  { name: 'Yuzvendra Chahal', role: 'Spin Bowler', category: 'Spinners', nationality: 'Indian', basePrice: 200 },
  { name: 'Kuldeep Yadav', role: 'Spin Bowler', category: 'Spinners', nationality: 'Indian', basePrice: 200 },
  { name: 'R Ashwin', role: 'Spin Bowler', category: 'Spinners', nationality: 'Indian', basePrice: 200 },
  { name: 'Varun Chakravarthy', role: 'Spin Bowler', category: 'Spinners', nationality: 'Indian', basePrice: 100 },
  { name: 'Rahul Chahar', role: 'Spin Bowler', category: 'Spinners', nationality: 'Indian', basePrice: 75 },
  { name: 'Ravi Bishnoi', role: 'Spin Bowler', category: 'Spinners', nationality: 'Indian', basePrice: 100 },
  { name: 'Piyush Chawla', role: 'Spin Bowler', category: 'Spinners', nationality: 'Indian', basePrice: 50 },
  { name: 'Rashid Khan', role: 'Spin Bowler', category: 'Spinners', nationality: 'Overseas', basePrice: 200 },
  { name: 'Adam Zampa', role: 'Spin Bowler', category: 'Spinners', nationality: 'Overseas', basePrice: 150 },
  { name: 'Sunil Narine', role: 'Spin Bowler', category: 'Spinners', nationality: 'Overseas', basePrice: 200 },
  { name: 'Wanindu Hasaranga', role: 'Spin Bowler', category: 'Spinners', nationality: 'Overseas', basePrice: 150 },

  // === FAST BOWLERS ===
  { name: 'Jasprit Bumrah', role: 'Fast Bowler', category: 'Fast Bowlers', nationality: 'Indian', basePrice: 200 },
  { name: 'Mohammed Shami', role: 'Fast Bowler', category: 'Fast Bowlers', nationality: 'Indian', basePrice: 200 },
  { name: 'Mohammed Siraj', role: 'Fast Bowler', category: 'Fast Bowlers', nationality: 'Indian', basePrice: 200 },
  { name: 'Arshdeep Singh', role: 'Fast Bowler', category: 'Fast Bowlers', nationality: 'Indian', basePrice: 150 },
  { name: 'Deepak Chahar', role: 'Fast Bowler', category: 'Fast Bowlers', nationality: 'Indian', basePrice: 100 },
  { name: 'Prasidh Krishna', role: 'Fast Bowler', category: 'Fast Bowlers', nationality: 'Indian', basePrice: 100 },
  { name: 'Mukesh Kumar', role: 'Fast Bowler', category: 'Fast Bowlers', nationality: 'Indian', basePrice: 75 },
  { name: 'Umran Malik', role: 'Fast Bowler', category: 'Fast Bowlers', nationality: 'Indian', basePrice: 75 },
  { name: 'Avesh Khan', role: 'Fast Bowler', category: 'Fast Bowlers', nationality: 'Indian', basePrice: 75 },
  { name: 'Tushar Deshpande', role: 'Fast Bowler', category: 'Fast Bowlers', nationality: 'Indian', basePrice: 50 },
  { name: 'Sandeep Sharma', role: 'Fast Bowler', category: 'Fast Bowlers', nationality: 'Indian', basePrice: 50 },
  { name: 'Pat Cummins', role: 'Fast Bowler', category: 'Fast Bowlers', nationality: 'Overseas', basePrice: 200 },
  { name: 'Mitchell Starc', role: 'Fast Bowler', category: 'Fast Bowlers', nationality: 'Overseas', basePrice: 200 },
  { name: 'Trent Boult', role: 'Fast Bowler', category: 'Fast Bowlers', nationality: 'Overseas', basePrice: 200 },
  { name: 'Kagiso Rabada', role: 'Fast Bowler', category: 'Fast Bowlers', nationality: 'Overseas', basePrice: 200 },
  { name: 'Anrich Nortje', role: 'Fast Bowler', category: 'Fast Bowlers', nationality: 'Overseas', basePrice: 150 },
  { name: 'Josh Hazlewood', role: 'Fast Bowler', category: 'Fast Bowlers', nationality: 'Overseas', basePrice: 150 },
  { name: 'Mark Wood', role: 'Fast Bowler', category: 'Fast Bowlers', nationality: 'Overseas', basePrice: 150 },
  { name: 'Lockie Ferguson', role: 'Fast Bowler', category: 'Fast Bowlers', nationality: 'Overseas', basePrice: 150 },

  // Extra filler players for squad building
  ...generateFillerPlayers(),
];

function generateFillerPlayers(): PlayerTemplate[] {
  const fillers: PlayerTemplate[] = [];
  const indianBatters = ['Sarfaraz Khan', 'Rajat Patidar', 'Rahul Tripathi', 'Manish Pandey', 'Mayank Agarwal', 'Nitish Rana', 'Deepak Hooda'];
  const indianBowlers = ['Khaleel Ahmed', 'Navdeep Saini', 'T Natarajan', 'Jaydev Unadkat', 'Mohit Sharma', 'Umesh Yadav', 'Ishant Sharma', 'Bhuvneshwar Kumar'];
  const indianSpinners = ['Amit Mishra', 'Krunal Pandya', 'R Sai Kishore', 'Maheesh Theekshana'];
  const indianAR = ['Nitish Reddy', 'Shivam Dube', 'Ramandeep Singh', 'Anuj Rawat'];
  const indianWK = ['Wriddhiman Saha', 'Sheldon Jackson'];
  const overseasBat = ['Aiden Markram', 'Devon Conway', 'Will Jacks', 'Liam Livingstone', 'Rilee Rossouw', 'Harry Brook'];
  const overseasBowl = ['Mustafizur Rahman', 'Alzarri Joseph', 'Gerald Coetzee', 'Matheesha Pathirana', 'Spencer Johnson', 'Reece Topley'];
  const overseasAR = ['Rachin Ravindra', 'Daryl Mitchell', 'Tristan Stubbs', 'Marco Jansen'];
  const overseasSpin = ['Tabraiz Shamsi', 'Akeal Hosein', 'Shadab Khan'];

  indianBatters.forEach(n => fillers.push({ name: n, role: 'Batter', category: 'Batters', nationality: 'Indian', basePrice: randomPrice(30, 100) }));
  indianBowlers.forEach(n => fillers.push({ name: n, role: 'Fast Bowler', category: 'Fast Bowlers', nationality: 'Indian', basePrice: randomPrice(30, 100) }));
  indianSpinners.forEach(n => fillers.push({ name: n, role: 'Spin Bowler', category: 'Spinners', nationality: 'Indian', basePrice: randomPrice(30, 75) }));
  indianAR.forEach(n => fillers.push({ name: n, role: 'All-Rounder', category: 'All-Rounders', nationality: 'Indian', basePrice: randomPrice(30, 75) }));
  indianWK.forEach(n => fillers.push({ name: n, role: 'WK-Batter', category: 'Wicket-Keepers', nationality: 'Indian', basePrice: randomPrice(30, 50) }));
  overseasBat.forEach(n => fillers.push({ name: n, role: 'Batter', category: 'Batters', nationality: 'Overseas', basePrice: randomPrice(50, 150) }));
  overseasBowl.forEach(n => fillers.push({ name: n, role: 'Fast Bowler', category: 'Fast Bowlers', nationality: 'Overseas', basePrice: randomPrice(50, 150) }));
  overseasAR.forEach(n => fillers.push({ name: n, role: 'All-Rounder', category: 'All-Rounders', nationality: 'Overseas', basePrice: randomPrice(50, 125) }));
  overseasSpin.forEach(n => fillers.push({ name: n, role: 'Spin Bowler', category: 'Spinners', nationality: 'Overseas', basePrice: randomPrice(50, 100) }));

  return fillers;
}

function randomPrice(min: number, max: number): number {
  const prices = [20, 30, 40, 50, 75, 100, 125, 150, 175, 200];
  const valid = prices.filter(p => p >= min && p <= max);
  return valid[Math.floor(Math.random() * valid.length)] || 50;
}

export function createPlayerPool(): Player[] {
  return playerTemplates.map((p, i) => ({
    id: `player-${i}`,
    name: p.name,
    role: p.role,
    category: p.category,
    nationality: p.nationality,
    basePrice: p.basePrice,
    status: 'upcoming' as const,
  }));
}

export function formatPrice(lakhs: number): string {
  if (lakhs >= 100) {
    const cr = lakhs / 100;
    return `₹${cr % 1 === 0 ? cr : cr.toFixed(2)} Cr`;
  }
  return `₹${lakhs} L`;
}

export function getBidIncrement(currentBid: number): number {
  if (currentBid < 100) return 10; // below 1 Cr → +10L
  if (currentBid <= 500) return 20; // 1-5 Cr → +20L
  return 50; // above 5 Cr → +50L
}
