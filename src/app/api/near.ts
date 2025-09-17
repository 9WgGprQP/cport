const NEAR_RPC = "https://rpc.mainnet.near.org";

// Get NEAR native balance
export async function fetchNearTokens(address: string) {
  const payload = {
    jsonrpc: "2.0",
    id: "a",
    method: "query",
    params: {
      request_type: "view_account",
      finality: "final",
      account_id: address
    }
  };
  const resp = await fetch(NEAR_RPC, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(payload)
  });
  if (!resp.ok) return [];
  const data = await resp.json();
  const amount = Number(data?.result?.amount ?? 0) / 1e24;
  const price = await fetchNearPriceUSD();
  return [{
    symbol: "NEAR",
    name: "NEAR",
    amount,
    price,
    usd: amount * price,
    blockchain: "NEAR"
  }];
}

async function fetchNearPriceUSD() {
  const resp = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=near&vs_currencies=usd");
  const json = await resp.json();
  return json?.near?.usd ?? 0;
}

// Staking generico su pool (funzione base, poolId es da sheet)
export async function fetchNearStaking(address: string, poolId: string) {
  const methodArgs = btoa(JSON.stringify({account_id: address}));
  const payload = {
    jsonrpc: "2.0",
    id: "staking",
    method: "query",
    params: {
      request_type: "call_function",
      finality: "final",
      account_id: poolId,
      method_name: "get_account_staked_balance",
      args_base64: methodArgs
    }
  };
  const resp = await fetch(NEAR_RPC, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(payload)
  });
  if (!resp.ok) return [];
  const data = await resp.json();
  if (!data?.result?.result) return [];
  const rawBytes = Buffer.from(data.result.result, "base64");
  const value = Number(new TextDecoder().decode(rawBytes)) / 1e24;
  if (value > 0) {
    const price = await fetchNearPriceUSD();
    return [{
      symbol: "stNEAR",
      name: `Staked NEAR on ${poolId}`,
      amount: value,
      price,
      usd: value * price,
      blockchain: "NEAR"
    }];
  }
  return [];
}
