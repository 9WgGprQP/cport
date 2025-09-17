"use client";
import React, { useState, useRef } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, Select, MenuItem, Button, IconButton,
  Box, Backdrop, CircularProgress, Checkbox, Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import { BLOCKCHAIN_LIST } from "../constants";
import { fetchEvmTokens } from "../api/evm";
import { fetchSolanaTokens, fetchSolanaStakeAccounts } from "../api/solana";
import { fetchXrpTokensWithDebug } from "../api/xrp";
import { fetchNearTokens, fetchNearStaking } from "../api/near";
import { getTokenIcon, getTokenName } from "../utils/utils";
import { TokenData, WalletInput } from "../types";

const WalletTable: React.FC = () => {
  const [wallets, setWallets] = useState<WalletInput[]>([{ blockchain: "", address: "", checked: true }]);
  const [walletHoldings, setWalletHoldings] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const prevHoldings = useRef<TokenData[]>([]);

  async function loadHoldings(selectedWallets: typeof wallets) {
    const allHoldings: TokenData[] = [];
    for (const [idx, w] of selectedWallets.entries()) {
      if (!w.checked) continue;
      if (!w.blockchain || !w.address) continue;
      if (w.blockchain === "Ripple") {
        const out = await fetchXrpTokensWithDebug(w.address);
        out.tokens.forEach((t: any) => allHoldings.push({ ...t, walletIndex: idx }));
      } else if (w.blockchain === "Solana") {
        const out = await fetchSolanaTokens(w.address);
        out.tokens.forEach((t: any) => allHoldings.push({ ...t, walletIndex: idx }));
        const stakeOut = await fetchSolanaStakeAccounts(w.address);
        stakeOut.stakeAccounts.forEach((s: any) =>
          allHoldings.push({ ...s, price: out.solPrice, usd: s.amount * out.solPrice, walletIndex: idx })
        );
      } else if (w.blockchain === "NEAR") {
        // Prevedi qui le chiamate alle tue API/utility come discusso
        const tokens = await fetchNearTokens(w.address);
        tokens.forEach((t: any) => allHoldings.push({ ...t, walletIndex: idx }));
        // Esempio: puoi ciclare una lista di pool, qui uno solo per demo
        const stakingPools = ["meta-pool.near"];
        for (const pool of stakingPools) {
          const stakingList = await fetchNearStaking(w.address, pool);
          stakingList.forEach((t: any) => allHoldings.push({ ...t, walletIndex: idx }));
        }
      } else {
        const evmTokens = await fetchEvmTokens(w.address, w.blockchain);
        evmTokens.forEach((t: any) => allHoldings.push({ ...t, walletIndex: idx }));
      }
    }
    const prevMap = new Map();
    prevHoldings.current.forEach(t => {
      prevMap.set([t.symbol, t.mint, t.walletIndex].join("_"), t.amount);
    });
    const newHoldings = allHoldings.map(t => {
      const prevKey = [t.symbol, t.mint, t.walletIndex].join("_");
      const prevAmount = prevMap.get(prevKey);
      return {
        ...t,
        delta: (typeof prevAmount === "number" && Math.abs(prevAmount - t.amount) > 1e-8)
          ? t.amount - prevAmount
          : undefined
      }
    });
    setWalletHoldings(newHoldings);
    prevHoldings.current = allHoldings;
    setLastUpdated(new Date());
  }

  async function refreshAllWallets() {
    setLoading(true);
    await loadHoldings(wallets);
    setLoading(false);
  }
  function addWallet() {
    setWallets([...wallets, { blockchain: "", address: "", checked: true }]);
  }
  function updateWallet(idx: number, field: string, value: string) {
    setWallets(wallets.map((row, i) => i === idx ? { ...row, [field]: value } : row));
  }
  function updateWalletCheck(idx: number, checked: boolean) {
    const updated = wallets.map((row, i) => i === idx ? { ...row, checked } : row);
    setWallets(updated);
    setLoading(true);
    loadHoldings(updated).then(() => setLoading(false));
  }
  function deleteWallet(idx: number) {
    const updated = wallets.filter((_, i) => i !== idx);
    setWallets(updated);
    setLoading(true);
    loadHoldings(updated).then(() => setLoading(false));
  }
  function walletTotalUsd(idx: number) {
    const subtotal = walletHoldings
      .filter(t => t.walletIndex === idx)
      .reduce((sum, t) => sum + (t.usd ? Number(t.usd) : 0), 0);
    if (!subtotal || isNaN(subtotal)) return <span style={{color:"gray"}}>-</span>;
    return (
      <span style={{fontWeight:700, color:"#226fee", fontVariantNumeric:"tabular-nums", fontSize:"1em"}}>
        {subtotal.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})} USD
      </span>
    );
  }
  function coinIcon(row: any) {
    const iconUrl = getTokenIcon(row.symbol, row.coingecko);
    if (iconUrl) return <img src={iconUrl} alt={row.symbol} style={{width:22, height:22, marginRight:4, verticalAlign:"middle"}} />;
    return <span style={{width:22, height:22, display:"inline-block", marginRight:4, verticalAlign:"middle"}} />;
  }
  const totalUSD = walletHoldings.reduce((sum, t) => sum + (t.usd ? Number(t.usd) : 0), 0);

  return (
    <Box sx={{ mt: 2, p: 0, minHeight:'100vh', background: '#111', color:'#fafafa' }}>
      <TableContainer component={Paper} style={{margin:'auto', maxWidth:1100, marginBottom:18, marginTop:8}}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell style={{ width: 44, minWidth: 30, maxWidth: 54, fontWeight: 700 }}>View</TableCell>
              <TableCell style={{minWidth:120, width:190}}>Blockchain</TableCell>
              <TableCell>Address</TableCell>
              <TableCell align="right" style={{width:125, fontWeight:700}}>Wallet Value</TableCell>
              <TableCell align="center" style={{ width:60 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {wallets.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell style={{ width: 44, minWidth: 30, maxWidth: 54, paddingLeft:8, paddingRight:8, verticalAlign:"bottom" }}>
                  <Checkbox
                    checked={row.checked ?? true}
                    size="small"
                    sx={{ p: "2px" }}
                    onChange={e => updateWalletCheck(idx, e.target.checked)}
                  />
                </TableCell>
                <TableCell colSpan={2} style={{padding:0, background:"transparent"}}>
                  <Box sx={{
                    display:'flex',
                    alignItems: 'flex-end',
                    gap:2,
                  }}>
                    <Select
                      value={row.blockchain}
                      variant="standard"
                      onChange={e => updateWallet(idx, "blockchain", String(e.target.value))}
                      displayEmpty
                      style={{
                        minWidth: 120, fontWeight:500, fontSize:"1em",
                        paddingTop:0, paddingBottom:0, height: "32px", lineHeight:"1.2", marginLeft:2
                      }}
                      sx={{
                        padding:0, height: "32px", lineHeight:"1.0", alignItems:'flex-end'
                      }}
                      inputProps={{
                        style: { padding:0, height:32, minHeight:'unset', lineHeight:1.1, alignItems:"flex-end" },
                      }}
                    >
                      <MenuItem value="" style={{ fontSize: "0.96em" }}><em>Select</em></MenuItem>
                      {BLOCKCHAIN_LIST.map(bc =>
                        <MenuItem value={bc.value} key={bc.value}
                          style={{fontSize:"0.96em",height:26,lineHeight:"18px",padding:0}}>
                          {bc.label}
                        </MenuItem>
                      )}
                    </Select>
                    <TextField
                      value={row.address}
                      onChange={e => updateWallet(idx, "address", e.target.value)}
                      placeholder="Wallet address"
                      variant="standard"
                      size="small"
                      fullWidth
                      inputProps={{
                        style: {
                          fontSize: "0.97em",
                          padding: "4px 8px",
                          height: 32,
                          lineHeight: "1.1"
                        }
                      }}
                      sx={{ mt:0, mb:0, alignItems:"flex-end" }}
                    />
                  </Box>
                </TableCell>
                <TableCell align="right" style={{width:125, fontWeight:700, fontVariantNumeric:"tabular-nums", verticalAlign:"bottom"}}>
                  {walletTotalUsd(idx)}
                </TableCell>
                <TableCell align="center" style={{ width:52 }}>
                  <IconButton size="small" sx={{ p: "2px" }} onClick={() => deleteWallet(idx)} title="Delete">
                    <DeleteIcon style={{fontSize:20}}/>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={5} align="center" style={{paddingTop:8, paddingBottom:8}}>
                <Button variant="contained" size="small" sx={{minHeight:30, height:30}} onClick={addWallet}>ADD WALLET</Button>
                <Button onClick={refreshAllWallets} variant="contained" color="success" sx={{marginLeft: 2, minWidth:110, minHeight:30, height:30}}>
                  REFRESH ALL
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Backdrop open={loading}><CircularProgress color="inherit" /></Backdrop>
      <Box mt={2}>
        <TableContainer component={Paper} style={{margin:'auto', maxWidth:1200}}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Crypto</TableCell>
                <TableCell>Name</TableCell>
                <TableCell align="right">Qty</TableCell>
                <TableCell align="right">Price (USD)</TableCell>
                <TableCell align="right">Value (USD)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {walletHoldings.map((t, idx) => (
                <TableRow key={idx}>
                  <TableCell>{coinIcon(t)} {t.symbol}</TableCell>
                  <TableCell>
                    {t.name || getTokenName(t.symbol, t.blockchain || t.chain || "", t.name || t.symbol)}
                  </TableCell>
                  <TableCell align="right">
                    {Number(t.amount).toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
                    {typeof t.delta === "number" && Math.abs(t.delta) > 1e-8 && (
                      <div style={{ fontSize:"0.9em", fontWeight:500, color: t.delta > 0 ? "#14bb14" : "#e54545" }}>
                        {t.delta > 0 ? "+" : ""}{t.delta.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
                      </div>
                    )}
                  </TableCell>
                  <TableCell align="right">{t.price ? Number(t.price).toLocaleString(undefined, { minimumFractionDigits: 8, maximumFractionDigits: 8 }) : ''}</TableCell>
                  <TableCell align="right">{t.usd ? Number(t.usd).toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 }) : ''}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{
          width: "1200px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          mt: 2
        }}>
          <Typography variant="h6" color="#fafafa" fontWeight={700}>
            Total USD: {totalUSD.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}
          </Typography>
          {lastUpdated && (
            <Typography color="gray" fontSize={13} mt={0.5}>
              Last Update: {lastUpdated.toLocaleString()}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default WalletTable;


