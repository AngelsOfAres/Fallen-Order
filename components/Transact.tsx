import { ExclamationCircleIcon } from '@heroicons/react/20/solid'
import { useWallet } from '@txnlab/use-wallet'
import algosdk from 'algosdk'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import NfdLookup from 'components/NfdLookup'
import useWalletBalance from 'hooks/useWalletBalance'
import { convertAlgosToMicroalgos } from 'utils'
import algodClient from 'lib/algodClient'
import { Box } from '@chakra-ui/react'

export default function Transact() {
  const { activeAddress, signTransactions, sendTransactions } = useWallet()

  const [algoAmount, setAlgoAmount] = useState<string>('')
  const [receiver, setReceiver] = useState<string>('U2NCG2KFXHBYGOD5ZTJWPAR7Z4QV7WUHYE3RG3SL2T7OMMWGPLFBIKIBQY')

  const { walletAvailableBalance } = useWalletBalance()

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = e.target.value

    // matches integers or floats up to 6 decimal places
    const regExp = /^\d+(?:\.\d{0,6})?$/gm

    if (amount !== '' && amount.match(regExp) === null) {
      return
    }

    setAlgoAmount(amount)
  }

  const hasSufficientBalance = useMemo(() => {
    const sendAmount = algoAmount === '' ? 0 : convertAlgosToMicroalgos(parseFloat(algoAmount))
    const availableBalance = convertAlgosToMicroalgos(parseFloat(walletAvailableBalance || '0'))

    const txnCost = sendAmount + 1000

    return availableBalance >= txnCost
  }, [algoAmount, walletAvailableBalance])

  const isValidRecipient = useMemo(() => {
    if (receiver === '') {
      return true
    }

    return algosdk.isValidAddress(receiver)
  }, [receiver])

  const renderValidationMessage = () => {
    if (hasSufficientBalance && isValidRecipient) {
      return null
    }

    const message = !hasSufficientBalance ? 'Insufficient balance' : 'Invalid recipient'

    return (
      <>
        <ExclamationCircleIcon className="mr-1.5 h-5 w-5 text-red-500" aria-hidden="true" />
        {message}
      </>
    )
  }

  const sendTransaction = async () => {
    try {
      if (!activeAddress) {
        throw new Error('Wallet Not Connected!')
      }

      const from = activeAddress
      const to = receiver === '' ? activeAddress : receiver
      const amount = algoAmount === '' ? 0 : convertAlgosToMicroalgos(parseFloat(algoAmount))

      const suggestedParams = await algodClient.getTransactionParams().do()

      const transaction = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from,
        to,
        amount,
        suggestedParams
      })

      const encodedTransaction = algosdk.encodeUnsignedTransaction(transaction)

      toast.loading('Waiting for user to sign...', { id: 'txn', duration: Infinity })

      const signedTransactions = await signTransactions([encodedTransaction])

      toast.loading('Sending transaction...', { id: 'txn', duration: Infinity })

      const waitRoundsToConfirm = 4

      const { id } = await sendTransactions(signedTransactions, waitRoundsToConfirm)

      console.log(`Successfully sent transaction. Transaction ID: ${id}`)

      toast.success('Transaction successful!', {
        id: 'txn',
        duration: 5000
      })
    } catch (error) {
      console.error(error)
      toast.error('Transaction failed', { id: 'txn' })
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    sendTransaction()
  }

  if (!activeAddress) {
    return null
  }

  return (
    <Box
      m='20px'
      w='400px'
      bg="black"
      borderRadius="8px"
      boxShadow="0 0 1px 1px rgba(255, 179, 0, 0.5) inset, 0 0 10px 5px rgba(255, 179, 0, 0.5)"
      transition="box-shadow 0.3s ease-in-out"
      _hover={{
        boxShadow: '0 0 2px 2px rgba(255, 179, 0, 0.8) inset, 0 0 20px 10px rgba(255, 179, 0, 0.8)',
      }}
    >
      <div className="p-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-orange-200">Donate</h3>
      </div>
      
      <div className="mt-1 sm:col-span-4 sm:mt-0">
              <div className="flex pl-6 pb-2 rounded-md shadow-sm max-w-md text-orange-200">
                  Receiver: support.irl.algo
              </div>
            </div>
      <div className="border-t border-orange-100 p-5 sm:p-0 lg:flex lg:flex-col lg:flex-1">
        <form
          onSubmit={handleSubmit}
          className="sm:divide-y sm:divide-orange-100 lg:flex lg:flex-col lg:flex-1"
        >
          <div className="space-y-2 sm:space-y-0 sm:grid sm:grid-cols-5 sm:gap-4 sm:py-5 sm:px-6">
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-orange-200 sm:mt-px sm:pt-2"
            >
              Amount
            </label>
            <div className="mt-1 sm:col-span-4 sm:mt-0">
              <div className="flex rounded-md shadow-sm max-w-md">
                <div className="relative flex flex-grow items-stretch focus-within:z-10">
                  <input
                    type="text"
                    name="amount"
                    id="amount"
                    className="block w-full rounded-none rounded-l-md border-orange-300 text-orange-200 bg-black focus:border-orange-300 focus:ring-orange-400 sm:text-sm"
                    value={algoAmount}
                    onChange={handleAmountChange}
                    placeholder="0.000 ALGO"
                  />
                </div>
                <button
                  type="button"
                  className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-orange-300 bg-black px-4 py-2 text-sm font-medium text-orange-400 hover:bg-black focus:border-orange-300 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  onClick={() => setAlgoAmount('')}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          <div className="pt-5 sm:py-5 sm:px-6 lg:flex lg:flex-col lg:flex-1 lg:justify-center">
            <div className="flex items-center justify-between">
              <p className="flex items-center text-sm text-red-600">{renderValidationMessage()}</p>
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-orange-500 py-2 px-4 text-sm font-medium text-black shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:bg-orange-500"
                disabled={!activeAddress || !hasSufficientBalance || !isValidRecipient}
              >
                Donate!
              </button>
            </div>
          </div>
        </form>
      </div>
    </Box>
  )
}
