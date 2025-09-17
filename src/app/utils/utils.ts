// /app/utils/utils.ts

import { CUSTOM_ICON_MAP, CUSTOM_NAME_MAP } from "../constants";

// Ritorna URL icona token. Prima CUSTOM_ICON_MAP, poi fallback coingecko.
export function getTokenIcon(symbol: string, coingecko: string) {
  if (CUSTOM_ICON_MAP[symbol]) {
    // Se url completa, la ritorna pura. Altrimenti la tratta come id coingecko.
    if (/^https?:\/\//.test(CUSTOM_ICON_MAP[symbol])) return CUSTOM_ICON_MAP[symbol];
    return `https://assets.coingecko.com/coins/images/${CUSTOM_ICON_MAP[symbol]}/standard/${symbol}.png`;
  }
  if (coingecko) return `https://assets.coingecko.com/coins/images/${coingecko}/standard/unknown.png`;
  return undefined;
}

// Ritorna nome custom token. Prima mappa custom, poi fallback.
export function getTokenName(symbol: string, chain: string, fallback: string) {
  return CUSTOM_NAME_MAP[chain]?.[symbol] || fallback || symbol;
}
