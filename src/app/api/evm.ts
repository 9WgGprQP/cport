// /app/api/evm.ts

import { EVM_NETWORKS, TRACKED_TOKENS, ETHERSCAN_API_KEY } from "../constants";

// Funzione principale: fetchEvmTokens(address: string, network: string)
// Restituisce array di oggetti con: symbol, amount, mint, coingecko, error (facoltativo), price, usd

export async function fetchEvmTokens(address: string, network: string) {
  const net = EVM_NETWORKS[network];
  const tokens = TRACKED_TOKENS[network] || [];
  if (!net || !tokens.length || !address) return [];
  const results: any[] = [];
  for (const tkn of tokens) {
    try {
      let val = 0;
      let apiUrl = '';
      if (!tkn.contract) {
        apiUrl = `https://api.etherscan.io/v2/api?module=account&action=balance&address=${address}&chainid=${net.chainId}&apikey=${ETHERSCAN_API_KEY}`;
      } else {
        apiUrl = `https://api.etherscan.io/v2/api?module=account&action=tokenbalance&contractaddress=${tkn.contract}&address=${address}&chainid=${net.chainId}&apikey=${ETHERSCAN_API_KEY}`;
      }
      const r = await fetch(apiUrl);
      const result = await r.json();
      if (!isNaN(Number(result.result))) val = Number(result.result) / Math.pow(10, tkn.decimals);
      else val = NaN;
      results.push({ ...tkn, amount: val, mint: undefined });
    } catch (e) {
      results.push({ ...tkn, amount: NaN, error: true, mint: undefined });
    }
  }
  const ids = results.map(t => t.coingecko).filter((id, i, a) => !!id && a.indexOf(id) === i);
  let prices: Record<string, number> = {};
  if (ids.length) {
    try {
      let url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(",")}&vs_currencies=usd`;
      const pr = await fetch(url).then(res => res.json());
      ids.forEach(id => { if (pr[id]) prices[id] = pr[id].usd; });
    } catch {}
  }
  return results.map(t => ({
    ...t,
    price: prices[t.coingecko] ?? "",
    usd: (prices[t.coingecko]) ? +(t.amount * prices[t.coingecko]) : "",
    error: t.error || false
  }));
}
