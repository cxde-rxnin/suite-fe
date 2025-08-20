import { useEffect, useState } from 'react';
import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';

export function useValidSuiPaymentCoin(requiredAmount) {
  const currentAccount = useCurrentAccount();
  const client = useSuiClient();
  const [paymentCoinId, setPaymentCoinId] = useState(null);
  const [coinError, setCoinError] = useState('');

  useEffect(() => {
    async function fetchCoin() {
      if (!currentAccount?.address) return;
      const coins = await client.getCoins({ owner: currentAccount.address, coinType: '0x2::sui::SUI' });
      // Find a coin with enough balance
      const validCoin = coins.data.find(coin => Number(coin.balance) >= requiredAmount * 1e9);
      if (validCoin) {
        setPaymentCoinId(validCoin.coinObjectId);
        setCoinError('');
      } else {
        setPaymentCoinId(null);
        setCoinError('No SUI coin with sufficient balance found.');
      }
    }
    fetchCoin();
  }, [currentAccount, client, requiredAmount]);

  return { paymentCoinId, coinError };
}
