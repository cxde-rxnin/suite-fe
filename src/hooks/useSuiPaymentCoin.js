import { useEffect, useState } from 'react';
import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';

export function useSuiPaymentCoin() {
  const currentAccount = useCurrentAccount();
  const client = useSuiClient();
  const [paymentCoinId, setPaymentCoinId] = useState(null);

  useEffect(() => {
    async function fetchCoin() {
      if (!currentAccount?.address) return;
      // Query for SUI coins owned by the user
      const coins = await client.getCoins({ owner: currentAccount.address, coinType: '0x2::sui::SUI' });
      if (coins.data.length > 0) {
        setPaymentCoinId(coins.data[0].coinObjectId);
      }
    }
    fetchCoin();
  }, [currentAccount, client]);

  return paymentCoinId;
}
