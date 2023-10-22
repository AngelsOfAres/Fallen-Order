import { useWallet } from '@txnlab/use-wallet'
import algosdk from 'algosdk'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import algodClient from 'lib/algodClient'
import { Box, useColorMode, useColorModeValue, Text, Input, Switch, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, HStack, Center, Tooltip, Textarea, VStack, Progress, Button } from '@chakra-ui/react'
import styles from '../../styles/glow.module.css'
import { FullGlowButton } from '../Buttons'
import { rateLimiter } from 'lib/ratelimiter'

export default function MassClawback() {
  const { activeAddress, signTransactions } = useWallet()
  const [assetID, setAssetID] = useState<number>(0)
  const [amount, setAmount] = useState<any>(0)
  const [addressList, setAddressList] = useState<any>([])
  const [seedphrase, setSeedphrase] = useState<string>('')
  const [to, setTo] = useState<string>('')
  const [status, setStatus] = useState<string>('Generating')
  const [loading, setLoading] = useState<boolean>(false)
  const boxGlow = useColorModeValue(styles.boxGlowL, styles.boxGlowD)
  const xLightColor = useColorModeValue('orange.100','cyan.100')
  const lightColor = useColorModeValue('orange.300','cyan.300')
  const medColor = useColorModeValue('orange.500','cyan.500')
  const progress = useColorModeValue('linear(to-r, orange, red)', 'linear(to-r, purple.600, cyan)')
  const buttonText5 = useColorModeValue('yellow','cyan')

  const from = activeAddress ? activeAddress : ""

  const massClawback = async () => {
    setLoading(true)
    const extractedAddresses = addressList.flatMap((line: any) => {
        const strings = line.split(/[, ]+/);
        return strings.filter((str: any) => str !== '')
      })
    setAddressList(extractedAddresses)
    try {
      if (!activeAddress) {
        throw new Error('Wallet Not Connected!')
      }
      const sign_key = seedphrase !== '' ? algosdk.mnemonicToSecretKey(seedphrase) : undefined
      const suggestedParams = await algodClient.getTransactionParams().do()
      suggestedParams.fee = 1000
      suggestedParams.flatFee = true
      const assetIndex = assetID
      const assetInfo = await rateLimiter(
        () => algodClient.getAssetByID(assetIndex).do()
      );
      const decimals = assetInfo.params.decimals
      const microAmount = amount*(10**decimals)
      const note = Uint8Array.from('Abyssal Portal - Mass Freeze Tool\n\nDeveloped by Angels Of Ares'.split("").map(x => x.charCodeAt(0)));
  
      const batchSize = 16
      const maxRetries = 5
      const delayBetweenRetries = 150
      
      const batchTransactions = []
      
        let retries = 0;
        let success = false;
        let batchResult = [];
      
        while (retries < maxRetries && !success) {
          try {
            batchResult = await Promise.all(
              addressList.map(async (address: any) => {
      
                return algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                from,
                to,
                suggestedParams,
                note,
                revocationTarget: address,
                amount: microAmount,
                assetIndex
                })
              })
            )
            success = true
          } catch (error: any) {
            if (error.response && error.response.status === 429) {
              retries++
              console.log(`Rate limited (429). Retrying attempt ${retries} in ${delayBetweenRetries} ms...`);
              await new Promise((resolve) => setTimeout(resolve, delayBetweenRetries));
            } else {
            }
          }
        }      
        if (!success) {
          throw new Error(`Failed to fetch asset data after ${maxRetries} retries.`);
        }      
        batchTransactions.push(...batchResult)
      
      let groupcount = 1
      const encodedBatches = []
  
      const numTransactions = batchTransactions.length
      const adjustedBatchSize = numTransactions < batchSize ? numTransactions : batchSize
  
      for (let i = 0; i < batchTransactions.length; i += adjustedBatchSize) {
        const batch: any[] = batchTransactions.slice(i, i + adjustedBatchSize)
        algosdk.assignGroupID(batch)
        const encodedBatch = batch.map(txn => algosdk.encodeUnsignedTransaction(txn))
        encodedBatches.push(encodedBatch)
      }
      for (let i = 0; i < encodedBatches.length; i += 4) {
        setStatus((status) => (status = 'Signing'))
        const batchToSign = encodedBatches.slice(i, i + 4)
        const flattenedBatchToSign = batchToSign.reduce((acc, curr) => [...acc, ...curr], [])
        let signedBatch
    
        if (sign_key) {
          signedBatch = []
          for (const txn of batchTransactions) {
            const signedTxn = await algosdk.signTransaction(txn, sign_key.sk)
            signedBatch.push(signedTxn.blob)
          }
        } else {
          toast.loading(`Awaiting Signature #${groupcount}...`, { id: 'txn', duration: Infinity })
          signedBatch = await signTransactions(flattenedBatchToSign)
        }
        groupcount++
        for (let j = 0; j < signedBatch.length; j += 16) {
          const groupToSend = signedBatch.slice(j, j + 16)
          await algodClient.sendRawTransaction(groupToSend).do()
        }
    }

      toast.success(`Clawback Successful! Total Addresses: ${addressList.length}`, {
        id: 'txn',
        duration: 5000
      })
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
      setStatus((status) => status = 'Generating')
      toast.error(`Oops! Mass Clawback failed. Please verify asset IDs and try again...`, { id: 'txn' })
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    massClawback()
  }

  return (
    <Box className={boxGlow} p='6px' m='20px' minW='300px' maxW='480px' bg="black" borderRadius="20px">
      <div className="pt-5 sm:px-6 relative">
        <Text className='hFont' textColor={medColor} textAlign="center">Mass Clawback</Text>
      </div>
      <div className="mx-5 pb-1 pt-3">
        <form onSubmit={handleSubmit}>            
          <Text textColor={lightColor} mb="1" fontWeight="semibold">
            Asset ID
          </Text>
          <div className="flex rounded-md shadow-sm max-w-md">
            <Input
              type="number"
              name="asset-id"
              id="asset-id"
              borderRightRadius={'0px'}
              _hover={{ bgColor: 'black' }}
              _focus={{ borderColor: medColor }}
              textColor={xLightColor}
              borderColor={medColor}
              className={`block w-full rounded-none rounded-l-md bg-black sm:text-sm`}
              value={assetID}
              onChange={(e) => setAssetID(parseInt(e.target.value))}
              placeholder="811721471"
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
              onClick={() => setAssetID(0)}
            >
              Clear
            </Button>
          </div>
          <Text textColor={lightColor} mb="1" fontWeight="semibold">
            Amount
          </Text>
          <div className="flex rounded-md shadow-sm max-w-md">
            <Input
              type="number"
              name="amount"
              id="amount"
              borderRightRadius={'0px'}
              _hover={{ bgColor: 'black' }}
              _focus={{ borderColor: medColor }}
              textColor={xLightColor}
              borderColor={medColor}
              className={`block w-full rounded-none rounded-l-md bg-black sm:text-sm`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
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
              onClick={() => setAmount(0)}
            >
              Clear
            </Button>
          </div>
          <Text textColor={lightColor} mt='4' mb="1" fontWeight="semibold">
            Clawback From
          </Text>
          <Textarea
            minH='120px'
            mb={4}
            value={addressList.join('\n')}
            onChange={(e) => setAddressList(e.target.value.split('\n'))}
            placeholder={`Enter Addresses\nAddress 1\nAddress 2\nAddress 3`}
            _hover={{bgColor: 'black'}}
            _focus={{borderColor: medColor}}
            textColor={xLightColor}
            borderColor={medColor}
          />
          <Text textColor={lightColor} mb="1" fontWeight="semibold">
            Clawback To
          </Text>
          <div className="flex rounded-md shadow-sm max-w-md">
            <Input
              mb={6}
              type="text"
              name="clawTo"
              id="clawTo"
              borderRightRadius={'0px'}
              _hover={{ bgColor: 'black' }}
              _focus={{ borderColor: medColor }}
              textColor={xLightColor}
              borderColor={medColor}
              className={`block w-full rounded-none rounded-l-md bg-black sm:text-sm`}
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="Enter Address"
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
              onClick={() => setTo('')}
            >
              Clear
            </Button>
          </div>
          <Text textColor={lightColor} mb="1" fontWeight="semibold">
            Seedphrase (OPTIONAL)
          </Text>
          <div className="flex rounded-md shadow-sm max-w-md">
            <Input
              type="text"
              name="seed"
              id="seed"
              borderRightRadius={'0px'}
              _hover={{ bgColor: 'black' }}
              _focus={{ borderColor: medColor }}
              textColor={xLightColor}
              borderColor={medColor}
              className={`block w-full rounded-none rounded-l-md bg-black sm:text-sm`}
              value={seedphrase}
              onChange={(e) => setSeedphrase((e.target.value).replace(/,/g, ''))}
              placeholder="camel ball insert adapt convey avoid"
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
              onClick={() => setSeedphrase('')}
            >
              Clear
            </Button>
          </div>
          {!loading ?
            <Center my={6}>
              <FullGlowButton text='Clawback!' disabled={addressList.length === 0 || addressList.includes('')} onClick={handleSubmit}/>
            </Center>
          : 
            <Center my={2}>
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
