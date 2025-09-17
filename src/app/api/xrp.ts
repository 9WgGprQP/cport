// Funzione da richiamare dal frontend
export async function fetchXrpTokensWithDebug(address: string): Promise<{tokens: any[]}> {
  const resp = await fetch(`/api/xrp_trustlines?address=${address}`);
  if (!resp.ok) return { tokens: [] };
  const data = await resp.json();

  const coingeckoXrpPrice = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ripple&vs_currencies=usd")
    .then(r=>r.json()).then(j=>j?.ripple?.usd ?? 0);

  // Token XRP nativo
  const tokens = [];
  if (typeof data.xrp === "number" && data.xrp > 0) {
    tokens.push({
      symbol: "XRP",
      name: "Ripple",
      amount: data.xrp,
      price: coingeckoXrpPrice,
      usd: data.xrp * coingeckoXrpPrice,
      blockchain: "Ripple"
    });
  }

  // Trustlines token
  for (const item of data.trustlines || []) {
    tokens.push({
      symbol: item.currency,
      name: item.currency,
      amount: Number(item.balance),
      contract: item.issuer,
      price: undefined,
      usd: undefined,
      blockchain: "Ripple"
    });
  }
  return { tokens };
}
