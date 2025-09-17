// /app/api/solana.ts

import { HELIUS_ENDPOINT, SPL_TOKEN_PROGRAM } from "../constants";

// Cache della lista token coingecko (locale al modulo)
let solanaTokenList: any[] = [];

export async function loadSolanaTokenListFromCoingecko() {
  if (solanaTokenList.length > 0) return solanaTokenList;
  const url = "https://api.coingecko.com/api/v3/coins/list?include_platform=true";
  const res = await fetch(url);
  const coins = await res.json();
  solanaTokenList = coins.filter((c: any) => c.platforms?.solana);
  return solanaTokenList;
}

export async function fetchSolanaStakeAccounts(address: string) {
  let stakeAccounts: any[] = [];
  try {
    const payload = {
      jsonrpc: "2.0",
      id: 1,
      method: "getProgramAccounts",
      params: [
        "Stake11111111111111111111111111111111111111",
        {
          encoding: "jsonParsed",
          filters: [ { memcmp: { offset: 44, bytes: address } } ]
        }
      ]
    };
    const res = await fetch(HELIUS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!data.result || !Array.isArray(data.result)) return { stakeAccounts: [] };
    data.result.forEach(function(ac: any) {
      if (ac.account && ac.account.data && ac.account.data.parsed) {
        let bal = ac.account.lamports / 1e9;
        let pubkey = ac.pubkey;
        if (bal > 0) {
          stakeAccounts.push({
            symbol: "SOL",
            name: "Stake " + pubkey.substr(0, 6) + "..." + pubkey.substr(-6),
            amount: bal,
            coingecko: "solana",
            mint: undefined,
          });
        }
      }
    });
  } catch {}
  return { stakeAccounts };
}

export async function fetchSolanaTokens(address: string) {
  const tokenMetaList = await loadSolanaTokenListFromCoingecko();
  let tokens: any[] = [];
  try {
    const body = {
      jsonrpc: "2.0",
      id: 1,
      method: "getBalance",
      params: [address]
    };
    const res = await fetch(HELIUS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (data && data.result && typeof data.result.value === "number") {
      tokens.push({
        symbol: "SOL",
        name: "Solana",
        amount: data.result.value / 1e9,
        coingecko: "solana",
        mint: undefined
      });
    }
  } catch {}
  try {
    const body = {
      jsonrpc: "2.0",
      id: 1,
      method: "getTokenAccountsByOwner",
      params: [
        address,
        { programId: SPL_TOKEN_PROGRAM },
        { encoding: "jsonParsed" }
      ]
    };
    const res = await fetch(HELIUS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (
      data &&
      data.result &&
      Array.isArray(data.result.value)
    ) {
      for (const item of data.result.value) {
        const acc = item.account?.data?.parsed?.info;
        if (!acc) continue;
        const mint = acc.mint;
        const amount = Number(acc.tokenAmount?.uiAmountString || acc.tokenAmount?.uiAmount || 0);
        if (isNaN(amount) || amount === 0) continue;
        const meta = tokenMetaList.find(x =>
          x.platforms?.solana?.toLowerCase() === mint.toLowerCase()
        );
        tokens.push({
          symbol: meta?.symbol?.toUpperCase() || mint.slice(0, 4) + '…' + mint.slice(-4),
          name: meta?.name || "SPL token",
          coingecko: meta?.id ?? "",
          mint,
          amount,
        });
      }
    }
  } catch {}
  const cgIds = tokens.filter(t => t.coingecko).map(t => t.coingecko);
  let prices: Record<string, number> = {};
  if(cgIds.length) {
    try {
      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${cgIds.join(",")}&vs_currencies=usd`;
      const pr = await fetch(url).then(res => res.json());
      Object.keys(pr).forEach(id => { prices[id] = pr[id]?.usd });
    } catch {}
  }
  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd`;
    const prSol = await fetch(url).then(res => res.json());
    if(prSol?.solana?.usd) prices["solana"] = prSol.solana.usd;
  } catch{}
  const tokensOut = tokens.map(t => ({
    ...t,
    price: t.coingecko && prices[t.coingecko]
      ? prices[t.coingecko]
      : t.symbol === "SOL" && prices.solana
      ? prices.solana : "",
    usd: ((t.coingecko && prices[t.coingecko])
        ? +(t.amount * prices[t.coingecko])
        : (t.symbol === "SOL" && prices["solana"])
        ? +(t.amount * prices["solana"])
        : "")
  }));
  return { tokens: tokensOut, solPrice: prices["solana"] || 0 };
}
