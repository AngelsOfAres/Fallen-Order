import { ExclamationCircleIcon } from '@heroicons/react/20/solid'
import { useWallet } from '@txnlab/use-wallet'
import algosdk from 'algosdk'
import { useMemo, useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import useWalletBalance from 'hooks/useWalletBalance'
import { convertAlgosToMicroalgos } from 'utils'
import { algodClient } from 'lib/algodClient'
import { Box, useColorMode, useColorModeValue, Text, Input, Button, Center } from '@chakra-ui/react'
import styles from '../../styles/glow.module.css'
import { classNames } from 'utils'
import { Listbox } from '@headlessui/react'
import SelectMenu from 'components/SelectMenu'
import { FullGlowButton } from '../Buttons'
import NfdLookup from '../NfdLookup/NfdLookup'
import { rateLimiter } from 'lib/ratelimiter'

export default function Transact() {
  const { activeAddress, signTransactions, sendTransactions } = useWallet()
  const [algoAmount, setAlgoAmount] = useState<string>('')
  const [assetID, setAssetID] = useState<number>(0)
  const [tokenBal, setTokenBal] = useState<number>(0)
  const [decimals, setDecimals] = useState<number>(0)
  const [customNote, setCustomNote] = useState<string>('')
  const { colorMode } = useColorMode()
  const [receiver, setReceiver] = useState<string>('ANGEL3CMT7TEXSBJR3DCTJTZCQFOF6FJB6PDKU4IOAMTNPXGR7XUYKOU5Y')
  const boxGlow = useColorModeValue(styles.boxGlowL, styles.boxGlowD)
  const xLightColor = useColorModeValue('orange.100', 'cyan.100')
  const lightColor = useColorModeValue('orange.300', 'cyan.300')
  const medColor = useColorModeValue('orange.500', 'cyan.500')
  const bgColor = colorMode === "light" ? "bg-orange-400" : "bg-cyan-500"
  const hoverBgColor = colorMode === "light" ? "hover:bg-orange-400" : "hover:bg-cyan-500"
  const textColor = colorMode === "light" ? "text-orange-900" : "text-cyan-900"
  const borderColor = colorMode === "light" ? 'border-orange-500' : 'border-cyan-400'
  const bgColorLight = colorMode === "light" ? 'bg-orange-100' : 'bg-cyan-50'
  const focusBorderColor = colorMode === "light" ? 'focus:border-orange-500' : 'focus:border-cyan-400'

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
    const regExp = /^[a-zA-Z0-9_!"#$%&'()*+,-./:<=>?@[\]^_`{|}~\s]+$/

    if (note !== '' && note.match(regExp) === null) {
      return
    }
    setCustomNote(note)
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
    if (assetID === 0 && hasSufficientBalance && isValidRecipient) {
      return null
    }

    if (assetID !== 0 && tokenBal >= parseFloat(algoAmount) && isValidRecipient) {
      return null
    }
    let message

    if (assetID !== 0) {
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
      suggestedParams.fee = 1000
      suggestedParams.flatFee = true
      const transaction = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from,
        to,
        amount,
        suggestedParams,
        note
      })

      const encodedTransaction = algosdk.encodeUnsignedTransaction(transaction)

      toast.loading('Awaiting Signature...', { id: 'txn', duration: Infinity })

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
      toast.error('Oops! $ALGO Donation Failed!', { id: 'txn' })
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
      const amount = parseFloat(algoAmount) * (10 ** decimals)
      const note = Uint8Array.from((customNote + '\n\nAbyssal Portal - Mass Send Tool\n\nDeveloped by Angels Of Ares\n\norder.algo.xyz').split("").map(x => x.charCodeAt(0)))
      const suggestedParams = await algodClient.getTransactionParams().do()
      suggestedParams.fee = 1000
      suggestedParams.flatFee = true
      const transaction = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from,
        to,
        suggestedParams,
        note,
        amount,
        assetIndex
      })

      const encodedTransaction = algosdk.encodeUnsignedTransaction(transaction)

      toast.loading('Awaiting Signature...', { id: 'txn', duration: Infinity })

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
      toast.error('Oops! Token Donation Failed!', { id: 'txn' })
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (assetID !== 0) {
      sendASATransaction()
    }
    else {
      sendTransaction()
    }
  }
  const options = useMemo(() => [
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
    ...(Array.isArray(assetList)
      ? assetList.map((asset: any) => ({
          value: asset['asset-id'],
          label: (
            <>
              <span className={`inline-flex items-center rounded ${bgColor} px-2.5 py-0.5 text-sm font-medium text-black mr-3`}>
                {asset['asset-id']}
              </span>
            </>
          ),
          asset
        }))
      : []
    ),
  ], [assetList, bgColor])
  

  const optionsPerPage = 120
  const [visibleOptions, setVisibleOptions] = useState<any[]>([])
  const [canLoadMore, setCanLoadMore] = useState(false)
  const [loadedOptionsCount, setLoadedOptionsCount] = useState(0)

  const loadMoreOptions = useCallback(async () => {
    setLoadedOptionsCount((prevCount) => prevCount + optionsPerPage)
    
    if (options.length > loadedOptionsCount) {
      const nextOptionsStartIndex = loadedOptionsCount;
      const nextOptionsEndIndex = nextOptionsStartIndex + optionsPerPage;
      let nextOptions = options.slice(nextOptionsStartIndex, nextOptionsEndIndex);
      
      const finalNextOptions: typeof nextOptions = [];
      const assetInfoPromises = nextOptions.map(async (option: any) => {
        try {
          const assetInfo = await rateLimiter(
            () => algodClient.getAssetByID(option.value).do()
          );
          finalNextOptions.push({
            value: assetInfo.params.name,
            label: (
              <>
                <span className={`inline-flex items-center rounded ${bgColor} px-2.5 py-0.5 text-sm font-medium text-black mr-3`}>
                  {option.value}
                </span>
              </>
            ),
            asset: option.value,
          });
        } catch (error: any) {
          if (error.response && error.response.data && error.response.data.message !== 'asset does not exist') {
          finalNextOptions.push({
            value: 'N/A',
            label: (
              <>
                <span className={`inline-flex items-center rounded ${bgColor} px-2.5 py-0.5 text-sm font-medium text-black mr-3`}>
                  {option.value}
                </span>
              </>
            ),
            asset: option.value,
          })
        }
        }
      })
      const batchedPromises = async () => {
        for (let i = 0; i < assetInfoPromises.length; i += 40) {
          const batch = assetInfoPromises.slice(i, i + 40)
          await Promise.all(batch)
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }
      }
      
      await batchedPromises()
      
      setVisibleOptions(finalNextOptions)
      setCanLoadMore(options.length > nextOptionsEndIndex)
    } else {
      setVisibleOptions(options)
      setCanLoadMore(false)
    }
  }, [options, loadedOptionsCount, bgColor])

  useEffect(() => {
    if (visibleOptions.length === 0 && options.length > 1 && loadedOptionsCount === 0) {
      loadMoreOptions();
    }
  }, [visibleOptions, options, loadedOptionsCount, loadMoreOptions])

  useEffect(() => {
    setVisibleOptions([])
    setLoadedOptionsCount(0)
  }, [activeAddress])

  
  const [selected, setSelected] = useState(options[0])

  async function handleSelectChange(value: any) {
    setSelected(value)
    setAssetID(value.asset)
    if (value.asset !== 0) {
      const assetInfo = await rateLimiter(
        () => algodClient.getAssetByID(value.asset).do()
      );
      const decimals = assetInfo.params.decimals
      setDecimals(decimals)
      try {
        const assets = accountInfo?.assets || []
        let assetAmount = 0

        for (const asset of assets) {
          if (asset['asset-id'] === value.asset) {
            assetAmount = asset.amount / (10 ** decimals)
            break
          }
        }
        setTokenBal(assetAmount)
      } catch (error) {
        console.error('Error fetching asset balance:', error)
      }
    }
  }

  if (!activeAddress) {
    return null
  }

  return (
    <Box className={boxGlow} p='6px' m='20px' minW='300px' maxW='480px' bg="black" borderRadius="20px">
    <div className="p-5 sm:px-6 flex justify-center items-center">
      <Text className="hFont" textColor={medColor}>
        Simple Send
      </Text>
    </div>
  
    <div className="px-5 flex flex-col flex-1">
      <label
        htmlFor="amount"
        className="block text-sm pr-2 pt-4 whitespace-nowrap font-medium"
      >
        <Text textColor={lightColor}>Receiver</Text>
      </label>
      <div className="mt-1 sm:col-span-4 pl-4 sm:mt-0">
          <NfdLookup
            className={`text-black w-full relative my-2 cursor-default rounded-md border ${borderColor} ${bgColorLight} text-center shadow-sm ${focusBorderColor} focus:outline-none focus:ring-1 sm:text-sm`}
            value={receiver}
            onChange={setReceiver}
            placeholder={"Enter Address/NFD"}
            ariaDescribedby="receiver"
          />
      </div>
    </div>
  
    <div className="py-2 px-5 lg:flex lg:flex-col lg:flex-1">
      <label
        htmlFor="amount"
        className="block text-sm whitespace-nowrap font-medium sm:mt-px sm:pt-2"
      >
        <Text textColor={lightColor}>Asset</Text>
      </label>
      <div className="mt-1 sm:col-span-4 pl-4">
        <SelectMenu
          selected={selected}
          setSelected={(selected) => handleSelectChange(selected)}
        >
          {visibleOptions.map((option: any) => (
            <Listbox.Option
              key={option.value}
              className={({ active }) =>
                classNames(
                  active ? `text-white ${bgColor}` : 'text-black',
                  `relative cursor-pointer select-none py-2 pl-3 pr-10`
                )
              }
              value={option}
            >
              <span className="text-sm">{option.label}</span>
              <span className="text-sm pl-2">{option.value}</span>
            </Listbox.Option>
          ))}
          {canLoadMore && (
            <button
              onClick={loadMoreOptions}
              className={`${textColor} ${hoverBgColor} text-center w-full cursor-pointer select-none relative px-4 py-2`}
            >
              Load More...
            </button>
          )}
        </SelectMenu>
      </div>
    </div>
  
    <div className="py-2 px-5 lg:flex lg:flex-col lg:flex-1">
      <form
        onSubmit={handleSubmit}
        className="lg:flex lg:flex-col lg:flex-1"
      >
        <label
          htmlFor="amount"
          className="block text-sm whitespace-nowrap font-medium pt-1 pb-2"
        >
          <Text textColor={lightColor}>Amount</Text>
        </label>
        <div className="mt-1 sm:col-span-4 pl-4 sm:mt-0">
          <div className="flex rounded-md shadow-sm max-w-md">
            <Input
              type="text"
              name="amount"
              id="amount"
              borderRightRadius={'0px'}
              _hover={{ bgColor: 'black' }}
              _focus={{ borderColor: medColor }}
              textColor={xLightColor}
              borderColor={medColor}
              className={`block w-full rounded-none rounded-l-md bg-black sm:text-sm`}
              value={algoAmount}
              onChange={handleAmountChange}
              placeholder="0.000"
            />
            <Button
              _hover={{ bgColor: 'black', textColor: medColor }}
              bgColor="black"
              textColor={xLightColor}
              borderWidth={1}
              borderLeftRadius={'0px'}
              borderColor={medColor}
              type="button"
              className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md px-4 py-2"
              onClick={() => setAlgoAmount('')}
            >
              Clear
            </Button>
          </div>
        </div>
  
        <label
          htmlFor="amount"
          className="block text-sm whitespace-nowrap font-medium pt-3 pb-2"
        >
          <Text textColor={lightColor}>Note</Text>
        </label>
        <div className="mt-1 sm:col-span-4 pl-4 sm:mt-0">
          <div className="flex rounded-md shadow-sm max-w-md">
            <div className="relative flex max-w-1 flex-grow items-stretch focus-within:z-10">
              <Input
                type="text"
                name="note"
                id="note"
                _hover={{ bgColor: 'black' }}
                _focus={{ borderColor: medColor }}
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
  
        <div className="p-5 sm:py-5 lg:flex lg:flex-col lg:flex-1">
          <div className="flex items-center justify-between">
            <p className="flex items-center text-sm text-red-600">
              {renderValidationMessage()}
            </p>
            <FullGlowButton
              text="Send!"
              onClick={handleSubmit}
              disabled={
                !activeAddress ||
                !isValidRecipient ||
                (assetID !== 0
                  ? parseFloat(algoAmount) <= 0 || tokenBal < parseFloat(algoAmount)
                  : algoAmount === '' || parseFloat(algoAmount) <= 0 || !hasSufficientBalance)
              }
            />
          </div>
        </div>
      </form>
    </div>
  </Box>
  
  )
}