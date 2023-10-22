import { useWallet } from '@txnlab/use-wallet'
import algosdk from 'algosdk'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import algodClient from 'lib/algodClient'
import { Box, useColorMode, useColorModeValue, Text, Input, Switch, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, HStack, Center, Tooltip, Textarea, VStack, Progress } from '@chakra-ui/react'
import styles from '../../styles/glow.module.css'
import { FullGlowButton } from '../Buttons'
import { rateLimiter } from 'lib/ratelimiter'

export default function MassOpt() {
  const { activeAddress, signTransactions } = useWallet()
  const [assetIDs, setAssetIDs] = useState<any>([])
  const [optType, setOptType] = useState<string>('in')
  const [status, setStatus] = useState<string>('Generating')
  const [loading, setLoading] = useState<boolean>(false)
  const { colorMode } = useColorMode()
  const boxGlow = useColorModeValue(styles.boxGlowL, styles.boxGlowD)
  const xLightColor = useColorModeValue('orange.100','cyan.100')
  const lightColor = useColorModeValue('orange.300','cyan.300')
  const medColor = useColorModeValue('orange.500','cyan.500')
  const baseColor = colorMode === "light" ? "orange" : "cyan"
  const progress = useColorModeValue('linear(to-r, orange, red)', 'linear(to-r, purple.600, cyan)')
  const buttonText5 = useColorModeValue('yellow','cyan')

  const from = activeAddress ? activeAddress : ""
  const to =  from

  const massOptTxns = async () => {
    setLoading(true)
    const extractedNumbers = assetIDs.flatMap((line: any) => {
      const numbers = line.split(/[, ]+/);
      return numbers.filter((num: any) => num !== ''); // Remove empty strings
    })
    setAssetIDs(extractedNumbers)
    try {
      if (!activeAddress) {
        throw new Error('Wallet Not Connected!');
      }
  
      const suggestedParams = await algodClient.getTransactionParams().do();
      suggestedParams.fee = 1000;
      suggestedParams.flatFee = true;
      const amount = 0;
      const note = Uint8Array.from('Abyssal Portal - Mass Opt Tools\n\nDeveloped by Angels Of Ares'.split("").map(x => x.charCodeAt(0)));
  
      const batchSize = 16
      const batchSize2 = 80
      const maxRetries = 5
      const delayBetweenRetries = 150
      
      const batchTransactions = []
      const totalAssets = extractedNumbers.length;
      
      for (let i = 0; i < totalAssets; i += batchSize2) {
        const batchEndIndex = Math.min(i + batchSize2, totalAssets);
        const assetIDsBatch = extractedNumbers.slice(i, batchEndIndex);
      
        let retries = 0;
        let success = false;
        let batchResult = [];
      
        while (retries < maxRetries && !success) {
          try {
            batchResult = await Promise.all(
              assetIDsBatch.map(async (assetID: any) => {
                const assetInfo = await rateLimiter(
                  () => algodClient.getAssetByID(assetID).do()
                );
                const assetCreator = assetInfo.params.creator;
                const assetIndex = parseInt(assetID);
                const closeRemainderTo = optType === 'in' ? undefined : assetCreator;
      
                return algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                  from,
                  to,
                  amount,
                  assetIndex,
                  suggestedParams,
                  closeRemainderTo,
                  note,
                });
              })
            );
      
            success = true;
          } catch (error: any) {
            if (error.response && error.response.status === 429) {
              retries++;
              console.log(`Rate limited (429). Retrying attempt ${retries} in ${delayBetweenRetries} ms...`);
              await new Promise((resolve) => setTimeout(resolve, delayBetweenRetries));
            } else {
            }
          }
        }
      
        if (!success) {
          throw new Error(`Failed to fetch asset data after ${maxRetries} retries.`);
        }
      
        batchTransactions.push(...batchResult);
      
        if (i + batchSize2 < totalAssets) {
          await new Promise((resolve) => setTimeout(resolve, 750));
        }
      }
      
      let groupcount = 1
      const encodedBatches = []
  
      const numTransactions = batchTransactions.length;
      const adjustedBatchSize = numTransactions < batchSize ? numTransactions : batchSize;
  
      for (let i = 0; i < batchTransactions.length; i += adjustedBatchSize) {
        const batch: any[] = batchTransactions.slice(i, i + adjustedBatchSize)
        algosdk.assignGroupID(batch)
        const encodedBatch = batch.map(txn => algosdk.encodeUnsignedTransaction(txn))
        encodedBatches.push(encodedBatch)
      }
      for (let i = 0; i < encodedBatches.length; i += 4) {
        toast.loading(`Awaiting Signature #${groupcount}...`, { id: 'txn', duration: Infinity })
        setStatus((status) => status = 'Signing')
        const batchToSign = encodedBatches.slice(i, i + 4)
        const flattenedBatchToSign = batchToSign.reduce((acc, curr) => [...acc, ...curr], [])
        const signedBatch = await signTransactions(flattenedBatchToSign)
        groupcount++
        
        for (let j = 0; j < signedBatch.length; j += 16) {
          const groupToSend = signedBatch.slice(j, j + 16)
          algodClient.sendRawTransaction(groupToSend).do()
        }
      }   

      toast.success(`Successfully Opted! Total Assets: ${extractedNumbers.length}`, {
        id: 'txn',
        duration: 5000
      })
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
      setStatus((status) => status = 'Generating')
      toast.error(`Oops! Mass opt ${optType} failed. Please verify asset IDs and try again...`, { id: 'txn' });
    }
  };
  

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    massOptTxns()
  }

  return (
    <Box className={boxGlow} p='6px' m='20px' minW='300px' maxW='480px' bg="black" borderRadius="20px">
      <div className="pt-5 sm:px-6 relative">
        <Text className='hFont' textColor={medColor} textAlign="center">Mass Opt</Text>
      </div>
      <div className="mx-5 pb-1 pt-3">
        <Center>
          <VStack mb={6} spacing='12px' w='fit-content'>
              <Text textColor={lightColor} className='whitespace-nowrap'>{optType === 'in'? 'Opt In' : 'Opt Out'}</Text>
              <Switch defaultChecked={true} size='lg' colorScheme={baseColor} css={{"& .chakra-switch__thumb": {backgroundColor: "black" }}} onChange={() => setOptType(optType === 'in' ? 'out' : 'in')} />
          </VStack>
        </Center>
        <form onSubmit={handleSubmit}>
          <Text textColor={lightColor} mb="1" fontWeight="semibold">
            Asset IDs
          </Text>
          <Textarea
            minH='85px'
            mb={6}
            value={assetIDs.join('\n')}
            onChange={(e) => setAssetIDs(e.target.value.split('\n'))}
            placeholder={`Enter IDs Here\nAsset ID 1\nAsset ID 2\nAsset ID 3`}
            _hover={{bgColor: 'black'}}
            _focus={{borderColor: medColor}}
            textColor={xLightColor}
            borderColor={medColor}
          />
          {!loading ?
            <Center my={4}>
              <FullGlowButton text={optType === 'in'? 'Opt In' : 'Opt Out'} disabled={assetIDs.length === 0 || assetIDs.includes('')} onClick={handleSubmit}/>
            </Center>
          : 
            <Center>
              <VStack pb={4}>
                <Text textAlign='center' textColor={xLightColor} className='pt-4 text-lg'>{status} Txns...</Text>
                <Box w='150px' mt='12px' mb='10px'>
                    <Progress size='xs' bgGradient={progress} colorScheme={buttonText5} isIndeterminate borderRadius='xl'/>
                </Box>
              </VStack>
            </Center>
          }
        </form>
      </div>
    </Box>
  );
  
}
