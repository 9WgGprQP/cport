// /app/constants.ts

// =========== PERSONALIZZAZIONE ICON TOKEN ============
export const CUSTOM_ICON_MAP: Record<string, string> = {
  // ESEMPI — LA TUA LISTA COMPLETA, MODIFICA/AGGIUNGI PURE
  "aArbUSDT": "https://assets.coingecko.com/coins/images/325/standard/Tether.png",
  "aArbWETH": "https://assets.coingecko.com/coins/images/2518/standard/weth.png",
  "USDT": "https://assets.coingecko.com/coins/images/325/standard/Tether.png",
  "ETH": "https://assets.coingecko.com/coins/images/279/standard/ethereum.png",
  "SOL": "https://assets.coingecko.com/coins/images/4128/standard/solana.png",
  "ROCKY": "https://assets.coingecko.com/coins/images/33482/standard/ROCKY.png",
  "PYTH": "https://assets.coingecko.com/coins/images/31924/standard/pyth.png",
  "GOAT": "https://assets.coingecko.com/coins/images/50717/standard/GOAT_LOGO_NEW.jpg",
  "BOME": "https://assets.coingecko.com/coins/images/36071/standard/bome.png",
  "GNON": "https://assets.coingecko.com/coins/images/50869/standard/gnon_logo_official.jpg",
  "SHEGEN": "https://assets.coingecko.com/coins/images/50958/standard/shegen.jpg?1729588520",
  "ACT": "https://assets.coingecko.com/coins/images/50984/standard/ai_prophecy.jpg?1729653897",
  "WIF": "https://assets.coingecko.com/coins/images/33566/standard/dogwifhat.jpg?1702499428",
  "NINJA": "https://assets.coingecko.com/coins/images/35469/standard/shinobi.png?1708758662",
  "MEW": "https://assets.coingecko.com/coins/images/36440/standard/MEW.png?1711442286",
  "HNT": "https://assets.coingecko.com/coins/images/4284/standard/helium_logo_use.png?1748092589",
  "BONK": "https://assets.coingecko.com/coins/images/28600/standard/bonk.jpg?1696527587",
  "SLERF": "https://assets.coingecko.com/coins/images/36178/standard/slerf.jpeg?1710753228",
  "FOREST": "https://assets.coingecko.com/coins/images/50993/standard/Screenshot_2024-10-22_at_2.46.54%E2%80%AFAM.png?1729672855",
  "$MYRO": "https://assets.coingecko.com/coins/images/32878/standard/MYRO_200x200.png?1699709942",
  "FARTCOIN": "https://assets.coingecko.com/coins/images/50891/standard/fart.jpg?1729503972",
  "FLAVIA": "https://assets.coingecko.com/coins/images/50986/standard/flavia.jpg?1729665270",
  "SHOGGOTH": "https://assets.coingecko.com/coins/images/50982/standard/shoggoth.jpg?1729652318",
  "RENDER": "https://assets.coingecko.com/coins/images/11636/standard/rndr.png?1696511529",
  "MAIL": "https://assets.coingecko.com/coins/images/36467/standard/IMG_8604.jpeg?1711517635",
  "WHY": "https://assets.coingecko.com/coins/images/36482/standard/imresizer-1710511720486.jpg"
  // ...altro da aggiungere come vuoi...
};
// ======================================================

// --- Nomi custom se vuoi fare mapping simbolo/blockchain a nome custom (opzionale) ---
export const CUSTOM_NAME_MAP: Record<string, Record<string, string>> = {
  Arbitrum: {
    "ETH": "Ethereum",
    "aArbUSDT": "USDT Staked on Arbitrum",
    "aArbWETH": "WETH Staked on Arbitrum"
  },
  Ethereum: {
    ETH: "Ethereum"
  },
  Solana: {
    "SOL": "Solana"
  }
  // ...aggiorna/estendi pure!
};

export const ETHERSCAN_API_KEY = "N8QX6GZZY77YTHR4W73VU8J32B2JKEHPNW";
export const HELIUS_API_KEY = "37a08c03-45a5-4b1c-a436-42555b60cd41";
export const HELIUS_ENDPOINT = `https://rpc.helius.xyz/?api-key=${HELIUS_API_KEY}`;
export const SPL_TOKEN_PROGRAM = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";

export const CHAIN_ICONS: Record<string, string> = {
  "Solana": "https://assets.coingecko.com/coins/images/4128/standard/solana.png",
  "Ethereum": "https://assets.coingecko.com/coins/images/279/standard/ethereum.png",
  "Polygon": "https://assets.coingecko.com/coins/images/4713/standard/polygon.png",
  "SmartChain": "https://assets.coingecko.com/coins/images/825/standard/bnb.png",
  "Arbitrum": "https://assets.coingecko.com/coins/images/16547/standard/arbitrum.png",
  "Optimism": "https://assets.coingecko.com/coins/images/25244/standard/Optimism.png",
  "Base": "https://assets.coingecko.com/coins/images/31404/standard/base.png",
  "Ripple": "https://assets.coingecko.com/coins/images/44/standard/xrp-symbol-white-128.png"
};

export const EVM_NETWORKS = {
  Ethereum:  { chainId: 1,     label: "Ethereum",   coingecko: 'ethereum' },
  Polygon:   { chainId: 137,   label: "Polygon",    coingecko: 'matic-network' },
  SmartChain:{ chainId: 56,    label: "SmartChain", coingecko: 'binancecoin' },
  Arbitrum:  { chainId: 42161, label: "Arbitrum",   coingecko: 'ethereum' },
  Optimism:  { chainId: 10,    label: "Optimism",   coingecko: 'ethereum' },
  Base:      { chainId: 8453,  label: "Base",       coingecko: 'ethereum' }
};

export const BLOCKCHAIN_LIST = [
  ...Object.keys(EVM_NETWORKS).map(x => ({ value: x, label: EVM_NETWORKS[x].label })),
  { value: "Solana", label: "Solana (Helius)" },
  { value: "Ripple", label: "Ripple (XRP)" },
  { label: "NEAR", value: "NEAR" }
];

export const TRACKED_TOKENS = {
  Ethereum: [
    { symbol: 'ETH', decimals: 18, contract: '', coingecko: 'ethereum' },
    { symbol: 'USDC', decimals: 6, contract: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', coingecko: 'usd-coin' }
  ],
  Polygon: [
    { symbol: 'MATIC', decimals: 18, contract: '', coingecko: 'matic-network' },
    { symbol: 'USDC', decimals: 6, contract: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', coingecko: 'usd-coin' }
  ],
  SmartChain: [
    { symbol: 'BNB', decimals: 18, contract: '', coingecko: 'binancecoin' }
  ],
  Arbitrum: [
    { symbol: 'ETH', decimals: 18, contract: '', coingecko: 'ethereum' },
    { symbol: 'aArbUSDT', decimals: 6, contract: '0x6ab707aca953edaefbc4fd23ba73294241490620', coingecko: 'tether' },
    { symbol: 'aArbWETH', decimals: 18, contract: '0xe50fa9b3c56ffb159cb0fca61f5c9d750e8128c8', coingecko: 'ethereum' }
  ],
  Optimism: [
    { symbol: 'ETH', decimals: 18, contract: '', coingecko: 'ethereum' }
  ],
  Base: [
    { symbol: 'ETH', decimals: 18, contract: '', coingecko: 'ethereum' }
  ]
}; // <--- questa graffa e punto e virgola sono fondamentali!

