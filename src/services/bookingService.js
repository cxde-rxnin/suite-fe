import apiClient from '../api/axios';
import { Transaction } from '@mysten/sui/transactions';

export async function bookRoom({ 
  hotelId, 
  roomId, 
  arrivalDate, 
  departureDate, 
  paymentCoinId, 
  guestInfo, 
  guestAddress, 
  totalCost, 
  suiClient,
  signAndExecuteTransaction
}) {
  // Validate required parameters first
  if (!suiClient) {
    throw new Error('SuiClient not found. Make sure wallet is connected.');
  }
  
  if (!signAndExecuteTransaction) {
    throw new Error('Transaction signing function not available. Make sure wallet is connected.');
  }

  // Validate environment variables
  const packageId = import.meta.env.VITE_PACKAGE_ID;
  if (!packageId) {
    throw new Error('VITE_PACKAGE_ID environment variable is not set');
  }

  // Validate required IDs
  if (!hotelId || !roomId) {
    throw new Error('Hotel ID and Room ID are required');
  }

  if (!guestAddress) {
    throw new Error('Guest address is required');
  }

  console.log('Starting booking process with:', {
    hotelId,
    roomId,
    guestAddress,
    totalCost,
    packageId
  });

  // Automatic coin merging logic
  const coinsRes = await suiClient.getCoins({ 
    owner: guestAddress, 
    coinType: '0x2::sui::SUI' 
  });
  
  const coins = coinsRes.data;
  console.log('Available coins:', coins.map(c => ({ id: c.coinObjectId, balance: c.balance })));
  
  if (coins.length === 0) {
    throw new Error('No SUI coins found in wallet. Please add SUI to your wallet.');
  }
  
  const requiredAmountMist = Math.floor(totalCost * 1e9);
  console.log('Required amount (MIST):', requiredAmountMist);
  
  // Check total balance
  const totalBalance = coins.reduce((sum, coin) => sum + Number(coin.balance), 0);
  console.log('Total balance (MIST):', totalBalance);
  
  if (totalBalance < requiredAmountMist + 1e8) { // Add 0.1 SUI buffer for gas
    throw new Error(`Insufficient balance. Need ${(requiredAmountMist + 1e8) / 1e9} SUI, but only have ${totalBalance / 1e9} SUI`);
  }
  
  // Find the best coin for payment
  let selectedPaymentCoin = coins.find(coin => Number(coin.balance) >= requiredAmountMist);
  
  if (!selectedPaymentCoin) {
    // If no single coin has enough, merge first
    console.log('No single coin has enough, merging coins...');
    
    const sorted = coins.slice().sort((a, b) => Number(b.balance) - Number(a.balance));
    const targetCoin = sorted[0];
    const coinsToMerge = sorted.slice(1);
    
    if (coinsToMerge.length > 0) {
      const mergeTxb = new Transaction();
      
      mergeTxb.mergeCoins(
        mergeTxb.object(targetCoin.coinObjectId),
        coinsToMerge.map(coin => mergeTxb.object(coin.coinObjectId))
      );
      
      console.log('Executing merge transaction...');
      
      try {
        await new Promise((resolve, reject) => {
          signAndExecuteTransaction(
            { transaction: mergeTxb },
            {
              onSuccess: resolve,
              onError: reject,
            }
          );
        });
        
        // Wait and refetch
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const coinsAfter = await suiClient.getCoins({ 
          owner: guestAddress, 
          coinType: '0x2::sui::SUI' 
        });
        
        console.log('Coins after merge:', coinsAfter.data.map(c => ({ id: c.coinObjectId, balance: c.balance })));
        
        selectedPaymentCoin = coinsAfter.data.find(coin => Number(coin.balance) >= requiredAmountMist);
        
        if (!selectedPaymentCoin) {
          throw new Error('Merge failed or insufficient balance after merge.');
        }
      } catch (mergeError) {
        console.error('Merge failed:', mergeError);
        selectedPaymentCoin = coins.find(coin => Number(coin.balance) >= requiredAmountMist * 0.9);
        if (!selectedPaymentCoin) {
          throw new Error('Cannot find suitable payment coin and merge failed: ' + mergeError.message);
        }
      }
    }
  }
  
  if (!selectedPaymentCoin || !selectedPaymentCoin.coinObjectId) {
    throw new Error('No suitable payment coin found.');
  }
  
  // Use the selected coin's ID - don't rely on the passed paymentCoinId
  const finalPaymentCoinId = selectedPaymentCoin.coinObjectId;
  console.log('Selected payment coin:', { id: finalPaymentCoinId, balance: selectedPaymentCoin.balance });

  // Build Transaction for booking
  const txb = new Transaction();
  
  const startTs = Math.floor(new Date(arrivalDate).getTime() / 1000);
  const endTs = Math.floor(new Date(departureDate).getTime() / 1000);

  console.log('Building booking transaction with:', {
    roomId,
    hotelId,
    startTs,
    endTs,
    paymentCoinId: finalPaymentCoinId,
    totalCost,
    requiredAmountMist,
    packageId
  });

  // Additional validation before transaction building
  if (!finalPaymentCoinId || finalPaymentCoinId === 'undefined') {
    throw new Error('Payment coin ID is invalid');
  }

  if (!roomId || roomId === 'undefined') {
    throw new Error('Room ID is invalid');
  }

  if (!hotelId || hotelId === 'undefined') {
    throw new Error('Hotel ID is invalid');
  }

  // Check if we need to split the coin or use it directly
  let paymentCoin;
  const coinBalance = Number(selectedPaymentCoin.balance);
  
  if (coinBalance === requiredAmountMist) {
    // Perfect match - use the coin directly
    console.log('Using coin directly (perfect match)');
    paymentCoin = txb.object(finalPaymentCoinId);
  } else {
    // Need to split the coin
    console.log('Splitting coin for exact amount');
    const [splitCoin] = txb.splitCoins(
      txb.object(finalPaymentCoinId), 
      [txb.pure.u64(requiredAmountMist)]
    );
    paymentCoin = splitCoin;
    
    // Transfer the remainder back to sender to avoid the UnusedValueWithoutDrop error
    // The remainder is automatically kept in the original coin object
  }

  // Build the move call with proper error checking
  try {
    const moveCallResult = txb.moveCall({
      target: `${packageId}::hotel_booking::book_room`,
      arguments: [
        txb.object(roomId),
        txb.object(hotelId),
        txb.pure.u64(startTs),
        txb.pure.u64(endTs),
        paymentCoin,
        txb.object('0x0000000000000000000000000000000000000000000000000000000000000006'), // SUI_CLOCK_OBJECT_ID
      ],
    });
    
    // If the move call returns something, transfer it to the sender to avoid unused value errors
    // This depends on what your smart contract returns
    // Uncomment the next line if your smart contract returns a booking object or similar
    // txb.transferObjects([moveCallResult], txb.pure.address(guestAddress));
    
  } catch (buildError) {
    console.error('Transaction building failed:', buildError);
    console.log('Arguments used:', {
      target: `${packageId}::hotel_booking::book_room`,
      roomId,
      hotelId,
      startTs,
      endTs,
      finalPaymentCoinId,
      requiredAmountMist
    });
    throw new Error('Failed to build transaction: ' + buildError.message);
  }

  // Sign and execute with wallet
  try {
    console.log('Executing booking transaction...');
    
    const result = await new Promise((resolve, reject) => {
      signAndExecuteTransaction(
        { 
          transaction: txb
        },
        {
          onSuccess: (result) => {
            console.log('Booking transaction successful:', result);
            resolve(result);
          },
          onError: (error) => {
            console.error('Booking transaction failed:', error);
            reject(error);
          },
        }
      );
    });
    
    return result;
  } catch (err) {
    console.error('Transaction execution error:', err);
    throw new Error('Booking transaction failed: ' + (err?.message || err));
  }
}