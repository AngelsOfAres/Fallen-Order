import algosdk from 'algosdk'
import { getAuth } from 'api/backend'
import { algodClient } from 'lib/algodClient'

export const authenticate = async (activeAddress: any, signTransactions: any) => {

    async function handleAuthToken(decSTxn: any) {
        try{
            const data = await getAuth(decSTxn)
            if (data.token) {
              return data.token
            } else {
              return null
            }
        } catch (error) {
            return null
        }
    }
    const sp = await algodClient.getTransactionParams().do()
    sp.fee = 0
    sp.flatFee = true
    sp.firstRound = 1
    sp.lastRound = 2
    const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: activeAddress,
      to: activeAddress,
      amount: 0,
      suggestedParams: sp,
      note: Uint8Array.from('Fallen Order'.split("").map(x => x.charCodeAt(0)))
    })

    const encodedTxn = algosdk.encodeUnsignedTransaction(txn)
    const sTxn = await signTransactions([encodedTxn])
    
    const decodedTxnString = JSON.stringify(sTxn[0])

    const token = await handleAuthToken(decodedTxnString)
    if (token) {
      localStorage.setItem('token_' + activeAddress, token)
      return token
    }
    else {
      return null
    }
  }
