import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@mysten/dapp-kit/dist/index.css';


const { networkConfig } = {
  networkConfig: {
    devnet: { url: getFullnodeUrl('devnet') },
    testnet: { url: getFullnodeUrl('testnet') },
  },
};
const queryClient = new QueryClient();
const client = new SuiClient({ url: getFullnodeUrl('devnet') });


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="devnet">
        <WalletProvider autoConnect>
          <App />
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);