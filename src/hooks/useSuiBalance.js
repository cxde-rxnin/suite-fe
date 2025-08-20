import { useEffect, useState } from 'react';
import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';

export function useSuiBalance() {
  const currentAccount = useCurrentAccount();
  const client = useSuiClient();
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    async function fetchBalance() {
      if (!currentAccount?.address) return;
      const coins = await client.getCoins({ owner: currentAccount.address, coinType: '0x2::sui::SUI' });
      const total = coins.data.reduce((sum, coin) => sum + Number(coin.balance), 0);
      setBalance(total / 1e9); // SUI uses 9 decimals
    }
    fetchBalance();
  }, [currentAccount, client]);

  return balance;
}
