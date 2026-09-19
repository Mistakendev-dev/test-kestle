export interface Game {
  id: string;
  name: string;
  short: string;
  genre: string;
  color: string;
  colorSoft: string;
  productCount: number;
}

export const games: Game[] = [
  { id: 'rust', name: 'Rust', short: 'RUST', genre: 'Survival', color: '#b7410e', colorSoft: 'rgba(183,65,14,0.25)', productCount: 6 },
  { id: 'cs2', name: 'Counter-Strike 2', short: 'CS2', genre: 'Tactical FPS', color: '#e8a33d', colorSoft: 'rgba(232,163,61,0.22)', productCount: 5 },
  { id: 'gta5', name: 'Grand Theft Auto V', short: 'GTA V', genre: 'Open World', color: '#3fae5a', colorSoft: 'rgba(63,174,90,0.22)', productCount: 4 },
  { id: 'cod', name: 'Call of Duty', short: 'COD', genre: 'FPS', color: '#8f9aa8', colorSoft: 'rgba(143,154,168,0.2)', productCount: 4 },
  { id: 'fortnite', name: 'Fortnite', short: 'FN', genre: 'Battle Royale', color: '#7c5cd6', colorSoft: 'rgba(124,92,214,0.22)', productCount: 4 },
  { id: 'apex', name: 'Apex Legends', short: 'APEX', genre: 'Battle Royale', color: '#d43d3d', colorSoft: 'rgba(212,61,61,0.22)', productCount: 3 },
  { id: 'r6', name: 'Rainbow Six Siege', short: 'R6', genre: 'Tactical FPS', color: '#4a90d9', colorSoft: 'rgba(74,144,217,0.22)', productCount: 3 },
  { id: 'valorant', name: 'Valorant', short: 'VAL', genre: 'Tactical FPS', color: '#ff4655', colorSoft: 'rgba(255,70,85,0.2)', productCount: 3 },
  { id: 'tarkov', name: 'Escape from Tarkov', short: 'EFT', genre: 'Extraction FPS', color: '#8a7a4a', colorSoft: 'rgba(138,122,74,0.25)', productCount: 3 },
  { id: 'pubg', name: 'PUBG', short: 'PUBG', genre: 'Battle Royale', color: '#e8a33d', colorSoft: 'rgba(232,163,61,0.2)', productCount: 2 },
  { id: 'rocketleague', name: 'Rocket League', short: 'RL', genre: 'Sports', color: '#3d8fe8', colorSoft: 'rgba(61,143,232,0.22)', productCount: 2 },
  { id: 'minecraft', name: 'Minecraft', short: 'MC', genre: 'Sandbox', color: '#5a9e3f', colorSoft: 'rgba(90,158,63,0.22)', productCount: 2 },
  { id: 'overwatch2', name: 'Overwatch 2', short: 'OW2', genre: 'Hero Shooter', color: '#e8853d', colorSoft: 'rgba(232,133,61,0.22)', productCount: 2 },
  { id: 'battlefield', name: 'Battlefield', short: 'BF', genre: 'FPS', color: '#4a6a8a', colorSoft: 'rgba(74,106,138,0.25)', productCount: 2 },
  { id: 'dayz', name: 'DayZ', short: 'DAYZ', genre: 'Survival', color: '#6a7a5a', colorSoft: 'rgba(106,122,90,0.25)', productCount: 2 },
];

export const getGame = (id: string) => games.find((g) => g.id === id);
