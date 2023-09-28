import { ExclamationCircleIcon } from '@heroicons/react/20/solid'
import { useWallet } from '@txnlab/use-wallet'
import algosdk from 'algosdk'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import useWalletBalance from 'hooks/useWalletBalance'
import { convertAlgosToMicroalgos } from 'utils'
import algodClient from 'lib/algodClient'
import { Box, useColorMode, useColorModeValue, Text, Input, Button } from '@chakra-ui/react'
import styles from '../styles/glow.module.css'
import { classNames } from 'utils'
import { Listbox } from '@headlessui/react'
import SelectMenu from 'components/SelectMenu'
import { FullGlowButton } from './Buttons'

export default function Transact() {
  const { activeAddress, signTransactions, sendTransactions } = useWallet()
  const [algoAmount, setAlgoAmount] = useState<string>('')
  const [assetID, setAssetID] = useState<number>(0)
  const [tokenBal, setTokenBal] = useState<number>(0)
  const [decimals, setDecimals] = useState<number>(0)
  const [customNote, setCusstomNote] = useState<string>('')
  const { colorMode } = useColorMode();
  const [receiver, setReceiver] = useState<string>('U2NCG2KFXHBYGOD5ZTJWPAR7Z4QV7WUHYE3RG3SL2T7OMMWGPLFBIKIBQY')
  const boxGlow = useColorModeValue(styles.boxGlowL, styles.boxGlowD)  
  const xLightColor = useColorModeValue('orange.100','cyan.100')
  const lightColor = useColorModeValue('orange.300','cyan.300')
  const medColor = useColorModeValue('orange.500','cyan.500')
  const bgColor = colorMode === "light" ? "bg-orange-400" : "bg-cyan-500";

  const { accountInfo, assetList, walletAvailableBalance } = useWalletBalance()

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = e.target.value
    const regExp = /^\d+(?:\.\d{0,6})?$/gm
    if (amount !== '' && amount.match(regExp) === null) {
      return
    }
    setAlgoAmount(amount)
  }

  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const note = e.target.value
    const regExp = /^[a-zA-Z0-9_!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~\s]+$/

    if (note !== '' && note.match(regExp) === null) {
      return
    }
    setCusstomNote(note)
    console.log(note)
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
    message = !hasSufficientBalance ? 'Insufficient Balance!' : null
    }

    return (
      <>
      {message ? (
        <>
          <ExclamationCircleIcon className="mr-1.5 h-8 w-8 text-red-500" aria-hidden="true" />
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
      const note = Uint8Array.from(customNote.split("").map(x => x.charCodeAt(0)))
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
      const note = Uint8Array.from(customNote.split("").map(x => x.charCodeAt(0)))
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
      label: (
        <>
          <span className={`inline-flex items-center rounded ${bgColor} px-2.5 py-0.5 text-sm font-medium text-black mr-3`}>
            ALGO
          </span>
        </>
      ),
      asset: 0,
    },
    ...(assetList ? assetList.map((asset: Asset) => ({
      value: asset['asset-id'],
      label: (
        <>
          <span className={`inline-flex items-center rounded ${bgColor} px-2.5 py-0.5 text-sm font-medium text-black mr-3`}>
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
    <Box className={boxGlow} m='20px' minW='275px' maxW='600px' bg="black" borderRadius="20px">
      <div className="p-5 sm:px-6 flex justify-center items-center">
        <Text className='hFont' textColor={lightColor}>Donate</Text>
      </div>   
      <div className="pl-5 sm:col-span-4 sm:mt-0">
        <Text textColor={xLightColor}>Receiver: support.irl.algo</Text>
      </div>
      <>
      <div className="mx-5 py-1">
      <SelectMenu selected={selected} setSelected={(selected) => handleSelectChange(selected)}>
        {options.map((option) => (
          <Listbox.Option key={option.value} className={({ active }) => classNames(
            active ? `text-white ${bgColor}` : 'text-black',
            `relative cursor-pointer select-none py-2 pl-3 pr-10`
          )
        }
        value={option}>
                <span className="text-sm">{option.label}</span>
                  <span className='text-sm pl-2'>
                    {option.value}
                  </span>
          </Listbox.Option>
        ))}
      </SelectMenu>
      </div>
      </>
      <div className="p-5 sm:p-0 lg:flex lg:flex-col lg:flex-1">
        <form onSubmit={handleSubmit} className="lg:flex lg:flex-col lg:flex-1">
          <div className="space-y-2 sm:space-y-0 sm:grid sm:grid-cols-5 sm:gap-4 sm:py-5 sm:px-6">
            <label htmlFor="amount" className="block text-sm whitespace-nowrap font-medium sm:mt-px sm:pt-2"><Text textColor={xLightColor}>Amount</Text></label>
            <div className="mt-1 sm:col-span-4 pl-4 sm:mt-0">
              <div className="flex rounded-md shadow-sm max-w-md">
                <div className="relative flex max-w-1 flex-grow items-stretch focus-within:z-10">
                  <Input
                    type="text"
                    name="amount"
                    id="amount"
                    borderRightRadius={'0px'}
                    _hover={{bgColor: 'black'}}
                    _focus={{borderColor: medColor}}
                    textColor={xLightColor}
                    borderColor={medColor}
                    className={`block w-full rounded-none rounded-l-md bg-black sm:text-sm`}
                    value={algoAmount}
                    onChange={handleAmountChange}
                    placeholder="0.000"
                  />
                </div>
                <Button _hover={{bgColor: 'black', textColor: medColor}} bgColor='black' textColor={xLightColor} borderWidth={1} borderLeftRadius={'0px'} borderColor={medColor} type="button" className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md px-4 py-2" onClick={() => setAlgoAmount('')}>
                  Clear
                </Button>
              </div>
            </div>
          </div>
          <div className="space-y-2 sm:space-y-0 sm:grid sm:grid-cols-5 sm:gap-4 sm:py-5 sm:px-6">
            <label htmlFor="amount" className="block text-sm whitespace-nowrap font-medium sm:mt-px sm:pt-2"><Text textColor={xLightColor}>Note</Text></label>
            <div className="mt-1 sm:col-span-4 pl-4 sm:mt-0">
              <div className="flex rounded-md shadow-sm max-w-md">
                <div className="relative flex max-w-1 flex-grow items-stretch focus-within:z-10">
                  <Input
                    type="text"
                    name="note"
                    id="note"
                    _hover={{bgColor: 'black'}}
                    _focus={{borderColor: medColor}}
                    textColor={xLightColor}
                    borderColor={medColor}
                    className={`block w-full rounded-none rounded-l-md bg-black sm:text-sm`}
                    value={customNote}
                    onChange={handleNoteChange}
                    placeholder="Custom Note Here"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="pt-5 sm:py-5 sm:px-6 lg:flex lg:flex-col lg:flex-1 lg:justify-center">
            <div className="flex items-center justify-between">
              <p className="flex items-center text-sm text-red-600">{renderValidationMessage()}</p>
              <FullGlowButton text='Donate!' onClick={handleSubmit} disabled={!activeAddress || !isValidRecipient || assetID != 0 ? tokenBal < parseFloat(algoAmount) : !hasSufficientBalance}/>
            </div>
          </div>
        </form>
      </div>
    </Box>
  )
}
