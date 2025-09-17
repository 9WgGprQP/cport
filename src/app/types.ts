// /app/types.ts

// Tipo per token restituito dalle varie funzioni API e usato nella tabella
export interface TokenData {
  symbol: string;
  name: string;
  coingecko: string;
  amount: number;
  mint?: string;
  price?: number | string;
  usd?: number | string;
  error?: boolean;
  walletIndex?: number;
  delta?: number;
}

// Tipo wallet inserito nella lista
export interface WalletInput {
  blockchain: string;
  address: string;
  checked?: boolean;
}

// Mappa reti EVM
export interface EvmNetworkConfig {
  chainId: number;
  label: string;
  coingecko: string;
}

// TRACKED_TOKENS
export interface TrackedToken {
  symbol: string;
  decimals: number;
  contract: string;
  coingecko: string;
}
