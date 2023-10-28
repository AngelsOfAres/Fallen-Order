import { useWallet } from '@txnlab/use-wallet'
import algosdk from 'algosdk'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { algodClient } from 'lib/algodClient'
import { Box, useColorMode, useColorModeValue, Text, Input, Switch, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, HStack, Center, Tooltip, Textarea, VStack, Progress, filter } from '@chakra-ui/react'
import styles from '../../styles/glow.module.css'
import { FullGlowButton } from '../Buttons'
import axios from 'axios'
import { rateLimiter } from 'lib/ratelimiter'

export default function MassSend() {
  const { activeAddress, signTransactions } = useWallet()
  const [assetIDs, setAssetIDs] = useState<any>([])
  const [addressList, setAddressList] = useState<any>([])
  const [rawAmounts, setRawAmounts] = useState<any>([])
  const [status, setStatus] = useState<string>('Generating')
  const [customNote, setCustomNote] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [counter, setCounter] = useState<number>(0)
  const boxGlow = useColorModeValue(styles.boxGlowL, styles.boxGlowD)
  const xLightColor = useColorModeValue('orange.100','cyan.100')
  const lightColor = useColorModeValue('orange.300','cyan.300')
  const medColor = useColorModeValue('orange.500','cyan.500')
  const progress = useColorModeValue('linear(to-r, orange, red)', 'linear(to-r, purple.600, cyan)')
  const buttonText5 = useColorModeValue('yellow','cyan')

  const from = activeAddress ? activeAddress : ""

  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const note = e.target.value
    const regExp = /^[a-zA-Z0-9_!"#$%&'()*+,-./:<=>?@[\]^_`{|}~\s]+$/

    if (note !== '' && note.match(regExp) === null) {
      return
    }
    setCustomNote(note)
  }
  
    async function getOptedIn() {
        for (const id of assetIDs) {
            const apiEndpoint = `https://mainnet-idx.algonode.cloud/v2/assets/${id}/balances?currency-greater-than=0`
            const response = await axios.get(apiEndpoint)

            if (response.data['balances'].length > 0) {
            const data = response.data['balances']
            const filteredAddressList = addressList.filter((address: any) =>
                data.some((data: any) => data.address === address)
            )
            setAddressList(filteredAddressList)
            }
        }
    }

  const massSend = async () => {
    setLoading(true)
    const extractedNumbers = assetIDs.flatMap((line: any) => {
      const numbers = line.split(/[, ]+/);
      return numbers.filter((num: any) => num !== '')
    })
    setAssetIDs(extractedNumbers)
    const extractedAddresses = addressList.flatMap((line: any) => {
        const strings = line.split(/[, ]+/);
        return strings.filter((str: any) => str !== '')
      })
    setAddressList(extractedAddresses)
    await getOptedIn()
    const extractedAmounts = rawAmounts.flatMap((line: any) => {
        const am = line.split(/[, ]+/);
        return am.filter((a: any) => a !== '')
      })
    setRawAmounts(extractedAmounts)
    try {
      if (!activeAddress) {
        throw new Error('Wallet Not Connected!')
      }
  
      const suggestedParams = await algodClient.getTransactionParams().do()
      suggestedParams.fee = 1000
      suggestedParams.flatFee = true
      const note = Uint8Array.from((customNote + '\n\nAbyssal Portal - Mass Send Tool\n\nDeveloped by Angels Of Ares').split("").map(x => x.charCodeAt(0)));
  
      const batchSize = 16
      const batchSize2 = 80
      const maxRetries = 5
      const delayBetweenRetries = 150
      
      const batchTransactions = []
      const totalAssets = extractedNumbers.length
      let index = 0
      
      for (const address of addressList) {
        const to = address
        for (let i = 0; i < totalAssets; i += batchSize2) {
            const batchEndIndex = Math.min(i + batchSize2, totalAssets)
            const assetIDsBatch = extractedNumbers.slice(i, batchEndIndex)
        
            let retries = 0
            let success = false
            let batchResult = []
        
            while (retries < maxRetries && !success) {
                try {
                    batchResult = await Promise.all(
                    assetIDsBatch.map(async (assetID: any, index: any) => {
                        const assetInfo = await rateLimiter(
                          () => algodClient.getAssetByID(assetID).do()
                        );
                        const decimals = assetInfo.params.decimals
                        setCounter((counter) => counter+1)
                        const amount = (parseFloat(rawAmounts[index]))*(10**decimals)
                        const assetIndex = parseInt(assetID)

                        return algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                        from,
                        to,
                        amount,
                        assetIndex,
                        suggestedParams,
                        note,
                        })
                    }))
                    success = true
                } catch (error: any) {
                    if (error.response && error.response.status === 429) {
                    retries++
                    await new Promise((resolve) => setTimeout(resolve, delayBetweenRetries))}
                }
            }
        
            if (!success) {
                throw new Error(`Failed to fetch asset data after ${maxRetries} retries.`)
            }
        
            batchTransactions.push(...batchResult)
        
            if (i + batchSize2 < totalAssets) {
            await new Promise((resolve) => setTimeout(resolve, 750))
            }
        }
        index++
        }
    const filteredTransactions = batchTransactions.filter((transaction: any) => transaction !== null && transaction !== undefined)
      
      let groupcount = 1
      const encodedBatches = []
  
      const numTransactions = filteredTransactions.length
      const adjustedBatchSize = numTransactions < batchSize ? numTransactions : batchSize
  
      for (let i = 0; i < filteredTransactions.length; i += adjustedBatchSize) {
        const batch: any[] = filteredTransactions.slice(i, i + adjustedBatchSize)
        algosdk.assignGroupID(batch)
        const encodedBatch = batch.map(txn => algosdk.encodeUnsignedTransaction(txn))
        encodedBatches.push(encodedBatch)
      }
      for (let i = 0; i < encodedBatches.length; i += 4) {
        toast.loading(`Awaiting Signature #${groupcount}...`, { id: 'txn', duration: Infinity })
        setStatus((status) => status = 'Signing')
        const batchToSign = encodedBatches.slice(i, i + 4)
        const flattenedBatchToSign = batchToSign.reduce((acc, curr) => [...acc, ...curr], [])
        console.log(flattenedBatchToSign)
        const signedBatch = await signTransactions(flattenedBatchToSign)
        groupcount++
        
        for (let j = 0; j < signedBatch.length; j += 16) {
          const groupToSend = signedBatch.slice(j, j + 16)
          algodClient.sendRawTransaction(groupToSend).do()
        }
      }   

      toast.success(`Successfully sent ${assetIDs.length} assets to ${filteredTransactions.length} accounts!}`, {
        id: 'txn',
        duration: 5000
      })
      setLoading(false)
      setCounter(0)
      setStatus((status) => status = 'Generating')
    } catch (error) {
      console.error(error)
      setLoading(false)
      setCounter(0)
      setStatus((status) => status = 'Generating')
      toast.error(`Oops! Mass send failed. Please verify addresses/IDs and try again...`, { id: 'txn' })
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    massSend()
  }

  return (
    <Box className={boxGlow} p='6px' m='20px' minW='300px' maxW='480px' bg="black" borderRadius="20px">
      <div className="pt-5 sm:px-6 relative">
        <Text className='hFont' textColor={medColor} textAlign="center">Mass Send</Text>
      </div>
      <div className="mx-5 pb-1 pt-3">
        <form onSubmit={handleSubmit}>
          <Text textColor={lightColor} mb="1" fontWeight="semibold">
            Addresses
          </Text>
          <Textarea
            minH='85px'
            mb={4}
            value={addressList.join('\n')}
            onChange={(e) => setAddressList(e.target.value.split('\n'))}
            placeholder={`Enter Wallets Here\nWallet 1\nWallet 2\nWallet 3`}
            _hover={{bgColor: 'black'}}
            _focus={{borderColor: medColor}}
            textColor={xLightColor}
            borderColor={medColor}
          />
          <Text textColor={lightColor} mb="1" fontWeight="semibold">
            Asset IDs
          </Text>
          <Textarea
            minH='85px'
            mb={4}
            value={assetIDs.join('\n')}
            onChange={(e) => setAssetIDs(e.target.value.split('\n'))}
            placeholder={`Enter IDs Here\nAsset ID 1\nAsset ID 2\nAsset ID 3`}
            _hover={{bgColor: 'black'}}
            _focus={{borderColor: medColor}}
            textColor={xLightColor}
            borderColor={medColor}
          />
          <Text textColor={lightColor} mb="1" fontWeight="semibold">
            Amounts
          </Text>
          <Textarea
            minH='85px'
            mb={4}
            value={rawAmounts.join('\n')}
            onChange={(e) => setRawAmounts(e.target.value.split('\n'))}
            placeholder={`3.5 12 100 0.15 25`}
            _hover={{bgColor: 'black'}}
            _focus={{borderColor: medColor}}
            textColor={xLightColor}
            borderColor={medColor}
          />
          <Text textColor={lightColor} mb="1" fontWeight="semibold">
            Note
          </Text>
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
          {!loading ?
            <Center my={6}>
              <FullGlowButton text='Send' disabled={assetIDs.length === 0 || assetIDs.includes('') || addressList.length === 0 || addressList.includes('')} onClick={handleSubmit}/>
            </Center>
          : 
            <Center mt={2}>
              <VStack>
                <Text textAlign='center' textColor={xLightColor} className='pt-4 text-lg'>{status} Txns...</Text>
                <Box w='150px'>
                    <Progress size='xs' bgGradient={progress} colorScheme={buttonText5} isIndeterminate borderRadius='xl'/>
                </Box>
                <Text mb={4} textAlign='center' textColor={xLightColor} className='pt-4' fontSize='12px'>Total Txns: <strong>{counter}</strong></Text>
              </VStack>
            </Center>
          }
        </form>
      </div>
    </Box>
  );
  
}
