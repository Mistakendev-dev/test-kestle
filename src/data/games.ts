import { products } from './products';

/**
 * Games are the products now — this is a projection of the catalogue kept so
 * artwork, colour and lookup code has a stable shape to read from.
 */
export interface Game {
  id: string;
  name: string;
  short: string;
  genre: string;
  color: string;
  colorSoft: string;
  variantCount: number;
}

export const games: Game[] = products.map((p) => ({
  id: p.id,
  name: p.name,
  short: p.short,
  genre: p.genre,
  color: p.color,
  colorSoft: p.colorSoft,
  variantCount: p.variantCount,
}));

export const getGame = (id: string) => games.find((g) => g.id === id);
