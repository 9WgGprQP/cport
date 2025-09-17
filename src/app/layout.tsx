// /src/app/layout.tsx

import React from 'react';

export const metadata = {
  title: 'My Crypto Dashboard',
  description: 'Multi-chain cryptocurrency portfolio tracker'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body style={{ margin:0, background:"#111" }}>{children}</body>
    </html>
  );
}

