import { NextRequest } from "next/server";

// Ottieni trustlines da xrpscan e saldo nativo XRP da xrpl cluster pubblico
async function getAccountBalance(address: string) {
  const url = "https://s1.ripple.com:51234/";
  const payload = {
    method: "account_info",
    params: [{ account: address, ledger_index: "validated" }]
  };
  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await resp.json();
  return Number(data.result?.account_data?.Balance ?? 0) / 1e6;
}

async function getAccountTrustlines(address: string) {
  const url = `https://api.xrpscan.com/api/v1/account/${address}/trustlines`;
  const resp = await fetch(url);
  return resp.ok ? await resp.json() : [];
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");
  if (!address) {
    return new Response(JSON.stringify({ error: "Missing address param" }), { status: 400 });
  }
  try {
    const [balance, trustlines] = await Promise.all([
      getAccountBalance(address),
      getAccountTrustlines(address),
    ]);
    return new Response(JSON.stringify({
      xrp: balance,
      trustlines
    }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
