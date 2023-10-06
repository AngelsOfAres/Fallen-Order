import { useState } from 'react'
import {
  Box,
  Text,
  Input,
  Tooltip,
  HStack,
  Center,
  Switch,
  Button,
  useColorMode,
  useColorModeValue,
  VStack,
  Progress
} from '@chakra-ui/react'
import styles from '../../styles/glow.module.css'
import toast from 'react-hot-toast'
import { useWallet } from '@txnlab/use-wallet'
import algodClient from 'lib/algodClient'
import algosdk from 'algosdk'
import { FullGlowButton } from '../Buttons'

export default function MintCollection() {
  const { activeAddress, signTransactions } = useWallet()
  const [minting, setMinting] = useState<boolean>(false)
  const [defaultFrozen, setDefaultFrozen] = useState<boolean>(false)
  const [seedphrase, setSeedphrase] = useState<string>('')
  const [rawAssetName, setrawAssetName] = useState<string>('')
  const [rawUnitName, setrawUnitName] = useState<string>('')
  const [freeze, setFreeze] = useState<any>(undefined)
  const [clawback, setClawback] = useState<any>(undefined)
  const [status, setStatus] = useState<string>('Generating')
  const [cidRaw, setCidRaw] = useState<any>('')
  const [cidList, setCidList] = useState<any>([])
  const [searchComplete, setSearchComplete] = useState<boolean>(true)
  const { colorMode } = useColorMode()
  const boxGlow = useColorModeValue(styles.boxGlowL, styles.boxGlowD)
  const xLightColor = useColorModeValue('orange.100', 'cyan.100')
  const lightColor = useColorModeValue('orange.300', 'cyan.300')
  const medColor = useColorModeValue('orange.500', 'cyan.500')
  const progress = useColorModeValue('linear(to-r, orange, red)', 'linear(to-r, purple.600, cyan)')
  const buttonText5 = useColorModeValue('yellow', 'cyan')

  const baseColor = colorMode === 'light' ? 'orange' : 'cyan'

  const buttonText3 = useColorModeValue('orange.500', 'cyan.500')
  const buttonText4 = useColorModeValue('orange.100', 'cyan.100')
  const iconColor1 = useColorModeValue('orange', 'cyan')
  
  
  const getCIDs = async () => {
    const gatewayUrl = `https://${cidRaw}.ipfs.nftstorage.link`
  
    try {
      const response = await fetch(gatewayUrl)
      if (response) {
        const data = await response.text()
        const cheerio = require('cheerio')
        const $ = cheerio.load(data)
        const fileRows = $('table tr:has(.ipfs-hash)')
    
        fileRows.each((index: any, row: any) => {
          const cidLink = $(row).find('.ipfs-hash')
          const href = cidLink.attr('href')
          const regex = /\/ipfs\/([a-zA-Z0-9]+)/
          const match = regex.exec(href)
          if (match && match[1]) {
            const extractedCID = match[1]
            cidList.push(extractedCID)
          }
        })
        return 0
      } else {
        return undefined
      }
    } catch (error: any) {
      console.error('Error fetching data:', error)
    }
  }

  const mintCollection = async () => {
    setMinting(true)
    if (defaultFrozen && (freeze === '' || clawback === '')) {
      if (freeze === '') {
        setFreeze(activeAddress ? activeAddress : undefined)
      }
      if (clawback === '') {
        setClawback(activeAddress ? activeAddress : undefined)
      }
    }
    const CIDs = await getCIDs()
    if (CIDs === undefined){
      toast.error(`Input seems incorrect! Please review...`, { id: 'txn', duration: Infinity })
      setMinting(false)
      return
    }
    try {
      if (!activeAddress) {
        throw new Error('Wallet Not Connected!')
      }
      const sign_key = seedphrase !== '' ? algosdk.mnemonicToSecretKey(seedphrase) : undefined
      const suggestedParams = await algodClient.getTransactionParams().do()
      suggestedParams.fee = 1000
      suggestedParams.flatFee = true
      const from = activeAddress
      const manager = activeAddress
      const reserve = activeAddress
      const total = 1
      const decimals = 0
      console.log(freeze, clawback)
      const note = Uint8Array.from('Abyssal Portal - Collection Minting Tool\n\nDeveloped by Angels Of Ares'.split("").map(x => x.charCodeAt(0)))
  
      const batchSize = 16
      
      const batchTransactions = []

        console.log(cidList.length)

        for (let i = 1; i <= cidList.length; i++) {
          const assetName = `${rawAssetName}${i}`
          const unitName = `${rawUnitName}${i}`
          const assetURL = "ipfs://" + cidList[i-1]

          const tx = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
            from,
            assetURL,
            assetName,
            unitName,
            total,
            decimals,
            manager,
            reserve,
            freeze,
            clawback,
            defaultFrozen,
            suggestedParams,
            note
          })
          batchTransactions.push(tx)
        }
      
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
      toast.success(`Collection Minted Successfully! Total Minted: ${cidList.length}`, {
        id: 'txn',
        duration: 5000
      })
      setMinting(false)
    } catch (error) {
      console.error(error)
      setMinting(false)
      setCidList([])
      setStatus((status) => status = 'Generating')
      setSearchComplete(true)
      toast.error(`Oops! Minting failed. Please verify input and try again...`, { id: 'txn' })
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSearchComplete(false)
    mintCollection()
  }

  const toggleNewSearch = () => {
    setSearchComplete(true)
  }

  return (
    <Box className={boxGlow} p="6px" m="20px" minW="300px" maxW="480px" bg="black" borderRadius="20px">
      <div className="pt-5 sm:px-6 flex justify-center items-center">
        <Text className="hFont" textColor={medColor}>
            Mint Collection
        </Text>
      </div>
          <Text px='4' textColor={lightColor} mt={4} mb={-2} fontWeight="semibold">
            IPFS CID
          </Text>
      <div className="flex p-4 rounded-md shadow-sm max-w-md">
          <Tooltip py={3} px={5} borderWidth='1px' borderRadius='lg' arrowShadowColor={iconColor1} borderColor={buttonText3} bgColor='black' textColor={buttonText4} fontSize='16px' fontFamily='Orbitron' textAlign='center' hasArrow label={'You may use our collection upload tool to upload your files, and retreive the CID from it, or insert your own collection folder CID.'} aria-label='Tooltip'>
            <>
          <Input
            type="text"
            name="cid"
            id="cid"
            borderRightRadius={'0px'}
            _hover={{ bgColor: 'black' }}
            _focus={{ borderColor: medColor }}
            textColor={xLightColor}
            borderColor={medColor}
            className={`block w-full rounded-none rounded-l-md bg-black sm:text-sm`}
            value={cidRaw}
            onChange={(e) => setCidRaw(e.target.value)}
            placeholder="Collection CID"
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
            onClick={() => setCidRaw('')}
          >
            Clear
          </Button>
          </>
          </Tooltip>
        </div>

        <div className="mx-5 pb-1">
          <HStack my={5} spacing='20px'>
              <Text textColor={lightColor}>Name</Text>
              <Input maxLength={32} _hover={{bgColor: 'black'}} _focus={{borderColor: medColor}} textColor={xLightColor} borderColor={medColor}
                  className={`block w-full rounded-none rounded-l-md bg-black sm:text-sm`} type="text" value={rawAssetName} onChange={(e) => setrawAssetName(e.target.value)} placeholder="Fallen Order #" />
          </HStack>

          <HStack my={5} spacing='20px'>
              <Text textColor={lightColor} className='whitespace-nowrap'>Unit Name</Text>
              <Input maxLength={8} _hover={{bgColor: 'black'}} _focus={{borderColor: medColor}} textColor={xLightColor} borderColor={medColor}
                  className={`block w-full rounded-none rounded-l-md bg-black sm:text-sm`} type="text" value={rawUnitName} onChange={(e) => setrawUnitName(e.target.value)} placeholder="FO" />
          </HStack>

          <Tooltip py={3} px={5} borderWidth='1px' borderRadius='lg' arrowShadowColor={iconColor1} borderColor={buttonText3} bgColor='black' textColor={buttonText4} fontSize='16px' fontFamily='Orbitron' textAlign='center' hasArrow label={'Insert address here to enable FREEZE'} aria-label='Tooltip'>
            <HStack my={5} spacing='20px'>
                <Text textColor={lightColor}>Freeze</Text>
                <Input _hover={{bgColor: 'black'}} _focus={{borderColor: medColor}} textColor={xLightColor} borderColor={medColor}
                    className={`block w-full rounded-none rounded-l-md bg-black sm:text-sm`} type="text" onChange={(e) => setFreeze(e.target.value)} placeholder='Freeze Address' />
            </HStack>
          </Tooltip>

          
          <Tooltip py={3} px={5} borderWidth='1px' borderRadius='lg' arrowShadowColor={iconColor1} borderColor={buttonText3} bgColor='black' textColor={buttonText4} fontSize='16px' fontFamily='Orbitron' textAlign='center' hasArrow label={'Insert address here to enable CLAWBACK'} aria-label='Tooltip'>
            <HStack my={5} spacing='20px'>
                <Text textColor={lightColor}>Clawback</Text>
                <Input _hover={{bgColor: 'black'}} _focus={{borderColor: medColor}} textColor={xLightColor} borderColor={medColor}
                    className={`block w-full rounded-none rounded-l-md bg-black sm:text-sm`} type="text" onChange={(e) => setClawback(e.target.value)} placeholder='Clawback Address' />
            </HStack>
          </Tooltip>

          <Center>
            <Tooltip py={3} px={5} borderWidth='1px' borderRadius='lg' arrowShadowColor={iconColor1} borderColor={buttonText3} bgColor='black' textColor={buttonText4} fontSize='16px' fontFamily='Orbitron' textAlign='center' hasArrow label={'If this is ENABLED, the assets will DEFAULT to FROZEN and may only be transferred using the CLAWBACK address!'} aria-label='Tooltip'>
              <HStack my={5} spacing='20px' w='fit-content'>
                  <Text textColor={lightColor} className='whitespace-nowrap'>Default Frozen</Text>
                  <Switch defaultChecked={false} size='lg' colorScheme={baseColor} css={{"& .chakra-switch__thumb": {backgroundColor: "black" }}} onChange={() => setDefaultFrozen(!defaultFrozen)} />
              </HStack>
            </Tooltip>
          </Center>

          <Text textColor={lightColor} mt='2' mb="1" fontWeight="semibold">
            Seedphrase (OPTIONAL)
          </Text>
          <div className="flex pb-4 rounded-md shadow-sm max-w-md">
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
          
          {searchComplete ?
            <Center my={4}><FullGlowButton text='MINT!' onClick={handleSubmit} disabled={rawUnitName === '' || rawAssetName === '' || cidRaw === ''}/></Center>
          :
          <>
          {minting ?
            <Center mt={2}>
              <VStack>
                <Text textAlign='center' textColor={xLightColor} className='pt-4 text-lg'>{status} Txns...</Text>
                <Box w='150px'>
                    <Progress size='xs' bgGradient={progress} colorScheme={buttonText5} isIndeterminate borderRadius='xl'/>
                </Box>
                <Text mb={4} textAlign='center' textColor={xLightColor} className='pt-4' fontSize='12px'>Total NFTs: <strong>{cidList.length}</strong></Text>
              </VStack>
            </Center>
          : 
            <Center my="24px">
              <VStack>
              <Text textAlign='center' textColor={xLightColor} fontSize='16px'>Mint Successful!</Text>
              <Text mb={2} textAlign='center' textColor={xLightColor} fontSize='14px'>Total NFTs: <strong>{cidList.length}</strong></Text>
                  <FullGlowButton text="Mint More!" onClick={toggleNewSearch} />
                  <a className='pt-2' href={`https://www.nftexplorer.app/collection?creator=${activeAddress}`} target='_blank' rel='noreferrer'>
                      <FullGlowButton text="View Collection!" />
                  </a>
              </VStack>
            </Center>}
          </>
          }
        </div>
    </Box>
  )
}