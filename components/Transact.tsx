import { ExclamationCircleIcon } from '@heroicons/react/20/solid'
import { useWallet } from '@txnlab/use-wallet'
import algosdk from 'algosdk'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import NfdLookup from 'components/NfdLookup'
import useWalletBalance from 'hooks/useWalletBalance'
import { convertAlgosToMicroalgos } from 'utils'
import algodClient from 'lib/algodClient'
import { Box, Center, Select, Text } from '@chakra-ui/react'
import styles from '../styles/glow.module.css'
import { classNames } from 'utils'
import { Listbox } from '@headlessui/react'
import SelectMenu from 'components/SelectMenu'
import { CheckIcon } from '@heroicons/react/20/solid'

export default function Transact() {
  const { activeAddress, signTransactions, sendTransactions } = useWallet()

  const [algoAmount, setAlgoAmount] = useState<string>('')
  const [assetID, setAssetID] = useState<number>(0)
  const [tokenBal, setTokenBal] = useState<number>(0)
  const [decimals, setDecimals] = useState<number>(0)
  const [receiver, setReceiver] = useState<string>('U2NCG2KFXHBYGOD5ZTJWPAR7Z4QV7WUHYE3RG3SL2T7OMMWGPLFBIKIBQY')

  const { accountInfo, assetList, walletAvailableBalance } = useWalletBalance()

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = e.target.value
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
    if (assetID == 0 && hasSufficientBalance && isValidRecipient) {
      return null
    }

    if (assetID != 0 && tokenBal >= parseFloat(algoAmount) && isValidRecipient) {
      return null
    }
    let message

    if (assetID != 0) {
    message = tokenBal < parseFloat(algoAmount) ? 'Insufficient balance' : null
    }
    else {
    message = !hasSufficientBalance ? 'Insufficient balance' : null
    }

    return (
      <>
      {message ? (
        <>
          <ExclamationCircleIcon className="mr-1.5 h-5 w-5 text-red-500" aria-hidden="true" />
          {message}
        </>
      ) : null}
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
      const note = Uint8Array.from('Donation Received!'.split("").map(x => x.charCodeAt(0)))
      const suggestedParams = await algodClient.getTransactionParams().do()

      const transaction = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from,
        to,
        amount,
        suggestedParams,
        note
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

  const sendASATransaction = async () => {
    try {
      if (!activeAddress) {
        throw new Error('Wallet Not Connected!')
      }

      const from = activeAddress
      const to = receiver === '' ? activeAddress : receiver
      const assetIndex = assetID
      const amount = parseFloat(algoAmount)*(10**decimals)
      const note = Uint8Array.from('Donation Received!'.split("").map(x => x.charCodeAt(0)))
      const suggestedParams = await algodClient.getTransactionParams().do()
      const transaction = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from,
        to,
        suggestedParams,
        note,
        amount,
        assetIndex
      })

      const encodedTransaction = algosdk.encodeUnsignedTransaction(transaction)

      toast.loading('Waiting for user to sign...', { id: 'txn', duration: Infinity })

      const signedTransactions = await signTransactions([encodedTransaction])

      toast.loading('Sending transaction...', { id: 'txn', duration: Infinity })

      const waitRoundsToConfirm = 4

      const { id } = await sendTransactions(signedTransactions, waitRoundsToConfirm)

      console.log(`Successfully sent transaction. Transaction ID: ${id}`)

      toast.success(`Transaction Successful! Txn ID: ${id}`, {
        id: 'txn',
        duration: 5000
      })
    } catch (error) {
      console.error(error)
      toast.error('Transaction Failed! Please confirm decimals and balance!', { id: 'txn' })
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (assetID != 0){
      sendASATransaction()
    } 
    else {
      sendTransaction()

    }
  }

  interface Asset {
    'asset-id': number;
  }
  const options = [
    {
      value: 0,
      label: 'ALGO',
      asset: 0,
    },
    ...(assetList ? assetList.map((asset: Asset) => ({
      value: asset['asset-id'],
      label: (
        <>
          <span className="inline-flex items-center rounded bg-orange-400 px-2.5 py-0.5 text-sm font-medium text-black mr-3">
            {asset['asset-id']}
          </span>
        </>
      ),
      asset
    })) : [])
  ];
  
  const [selected, setSelected] = useState(options[0])

  async function handleSelectChange(value: any) {
    setSelected(value)
    setAssetID(value.value)
    if (value.value !== 0) {
      const assetInfo = await algodClient.getAssetByID(value.value).do()
      const decimals = assetInfo.params.decimals
      setDecimals(decimals)
      try {
        const assets = accountInfo?.assets || [];
        let assetAmount = 0;
  
        for (const asset of assets) {
          if (asset['asset-id'] === value.value) {
            assetAmount = asset.amount/(10**decimals);
            break;
          }
        }
        setTokenBal(assetAmount);
      } catch (error) {
        console.error('Error fetching asset balance:', error);
      }
  }
}
  
  
  if (!activeAddress) {
    return null
  }
  
  return (
    <Box m='20px' w='400px' bg="black" borderRadius="8px" boxShadow="0 0 1px 1px rgba(255, 179, 0, 0.5) inset, 0 0 10px 5px rgba(255, 179, 0, 0.5)" 
      transition="box-shadow 0.3s ease-in-out"
      _hover={{
        boxShadow: '0 0 2px 2px rgba(255, 179, 0, 0.8) inset, 0 0 20px 10px rgba(255, 179, 0, 0.8)',
      }}>
      <div className="p-5 sm:px-6 flex justify-center items-center">
        <h3 className="text-lg font-medium leading-6 text-orange-200">Donate</h3>
      </div>   
      <div className="mt-1 sm:col-span-4 sm:mt-0">
        <div className="flex pl-5 pb-2 rounded-md shadow-sm max-w-md text-orange-200">Receiver: support.irl.algo</div>
      </div>
      <>
      <div className="border-t border-orange-100 p-5 sm:p-0 lg:flex lg:flex-col lg:flex-1">
      <div className="mx-5 py-2">
      <SelectMenu selected={selected} setSelected={(selected) => handleSelectChange(selected)}>
        {options.map((option) => (
          <Listbox.Option key={option.value} className={({ active }) =>
          classNames(
            active ? 'text-orange-500 bg-black' : 'text-black',
            'relative cursor-default select-none py-2 pl-3 pr-10'
          )
        } value={option}>
            {({ selected, active }) => (
              <div
                className={classNames(
                  active ? 'text-orange-500 bg-black' : 'text-black',
                  'relative select-none px-1 py-2'
                )}
              >
                <div
                  className={classNames(
                    selected ? 'font-semibold' : 'font-normal',
                    'block truncate'
                  )}
                >
                <span className="text-sm">{option.label}</span>
                  <span
                    className={classNames(
                      selected && active
                        ? 'bg-orange-400 text-black'
                        : selected
                        ? 'bg-orange-400 text-black'
                        : active
                        ? 'bg-black text-orange-500'
                        : 'bg-orange.300',
                      'inline-flex items-center rounded px-2.5 py-0.5 text-sm font-medium mr-3'
                    )}
                  >
                    {option.value}
                  </span>
                </div>
                {selected ? (
                  <span
                    className={classNames(
                      active ? 'text-black' : 'text-orange-500',
                      'absolute inset-y-0 right-0 flex items-center pr-3'
                    )}
                  >
                    <CheckIcon color="orange" className="h-5 w-5" aria-hidden="true" />
                  </span>
                ) : null}
              </div>
            )}
          </Listbox.Option>
        ))}
      </SelectMenu>
      </div>
      </div>
      </>
      <div className="border-t border-orange-100 p-5 sm:p-0 lg:flex lg:flex-col lg:flex-1">
        <form onSubmit={handleSubmit} className="sm:divide-y sm:divide-orange-100 lg:flex lg:flex-col lg:flex-1">
          <div className="space-y-2 sm:space-y-0 sm:grid sm:grid-cols-5 sm:gap-4 sm:py-5 sm:px-6">
            <label htmlFor="amount" className="block text-sm font-medium text-orange-200 sm:mt-px sm:pt-2">Amount</label>
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
                    placeholder="0.000"
                  />
                </div>
                <button type="button" className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-orange-300 bg-black px-4 py-2 text-sm font-medium text-orange-400 hover:bg-black focus:border-orange-300 focus:outline-none focus:ring-1 focus:ring-orange-500" onClick={() => setAlgoAmount('')}>
                  Clear
                </button>
              </div>
            </div>
          </div>
          <div className="pt-5 sm:py-5 sm:px-6 lg:flex lg:flex-col lg:flex-1 lg:justify-center">
            <div className="flex items-center justify-between">
              <p className="flex items-center text-sm text-red-600">{renderValidationMessage()}</p>
              <button type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-orange-500 py-2 px-4 text-sm font-medium text-black shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:bg-orange-500"
                disabled={!activeAddress || !isValidRecipient || assetID != 0 ? tokenBal < parseFloat(algoAmount) : !hasSufficientBalance}>
                Donate!
              </button>
            </div>
          </div>
        </form>
      </div>
    </Box>
  )
}
