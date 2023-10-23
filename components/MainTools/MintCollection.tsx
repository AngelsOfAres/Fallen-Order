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
import { algodClient } from 'lib/algodClient'
import algosdk from 'algosdk'
import { FullGlowButton } from '../Buttons'
import { CID } from "multiformats/cid"
import { Web3Storage } from 'web3.storage'


export default function MintCollection() {
  const axios = require('axios')
  const [apiKey, setApiKey] = useState<string>('')
  const [pro, setPro] = useState<boolean>(false)
  const { activeAddress, signTransactions } = useWallet()
  const [minting, setMinting] = useState<boolean>(false)
  const [CSVData, setCSVData] = useState<any>([])
  const [defaultFrozen, setDefaultFrozen] = useState<boolean>(false)
  const [leadingZeros, setLeadingZeros] = useState<boolean>(false)
  const [arc, setArc] = useState<string>('')
  const [externalURL, setExternalURL] = useState<string>('')
  const [desc, setDesc] = useState<string>('')
  const [seedphrase, setSeedphrase] = useState<string>('')
  const [startIndex, setStartIndex] = useState<number>(1)
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

  let reserve: any = ''

   const togglePro = () => {
    setPro(!pro)
  }
  
  async function readAndSaveCsvData(): Promise<string[][]> {
  return new Promise<string[][]>((resolve, reject) => {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = '.csv'

    fileInput.addEventListener('change', (event) => {
      const file = (event.target as HTMLInputElement).files?.[0]

      if (!file) {
        reject(new Error('No file selected.'))
        return
      }

      const reader = new FileReader()

      reader.onload = (e) => {
        const contents = e.target?.result as string
        const rows = contents.split('\n')
        const data: string[][] = []

        rows.forEach((row) => {
          row = row.replace(/^"|"$/g, '').replace(/\r/g, '')
          const fields = row.split(',')
          for (let i = 0; i < fields.length; i++) {
            fields[i] = fields[i].replace(/"/g, '')
          }
          data.push(fields)
        })
        resolve(data)
      }
      reader.onerror = (error) => {
        reject(error)
      }
      reader.readAsText(file)
    })

    fileInput.click()
  })
}

  async function handleCSV() {
  try {
    const csvData = await readAndSaveCsvData()
    setCSVData(csvData)
    console.log('CSV Data:', csvData)
  } catch (error) {
    console.error('Error reading CSV file:', error)
  }
}
const uploadMetadata = async (metadata: any) => {
  const client = new Web3Storage({ token: apiKey })

  let extractedCID = ''
  try {
    const files = [
      new File([JSON.stringify(metadata)], 'metadata.json', { type: 'application/json' })
    ]
    const cid = await client.put(files)

    const gatewayUrl = `https://${cid}.ipfs.nftstorage.link`
  
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
            extractedCID = match[1]
            console.log(match[1])
          }
        })
      }
    } catch (error: any) {
      console.error('Error fetching data:', error)
    }
  } catch (error) {
    console.error('Error uploading files to IPFS:', error)
  }
  return extractedCID
}

  
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
      const total = 1
      const decimals = 0
      const leading_digits = String(cidList.length).length
      let index = startIndex
      let note: any = ''
      let traitNames: any = []
      if (arc !== '') {
        traitNames = CSVData[0]
      }
  
      const batchSize = 16
      const batchTransactions = []

        for (let i = 1; i <= cidList.length; i++) {
          const paddedCounter = leadingZeros ? String(index++).padStart(leading_digits, '0') : index
          const assetName = `${rawAssetName}${paddedCounter}`
          const unitName = `${rawUnitName}${paddedCounter}`
          let assetURL = "ipfs://" + cidList[i-1]
          let mimeType: any = "image/png"

          const rowValues = CSVData[i]

          await axios.head(`https://${cidList[i-1]}.ipfs.nftstorage.link`)
            .then((response: any) => {
              if (response.headers['content-type']) {
                mimeType = response.headers['content-type']
              }
            })
            .catch()

          if (arc !== '') {
            let properties: any = {}
            for (let x = 0; x < traitNames.length; x++) {
              properties[traitNames[x]] = rowValues[x]
            }
            if (arc === '69'){
              const rawNote = {"standard": "arc69",
                      "description": desc,
                      "external_url": externalURL,
                      "mime_type": mimeType,
                      "properties": properties
                    }
              const enc = new TextEncoder()
              note = enc.encode(JSON.stringify(rawNote))
            }
            else {
              let metadataCID: any = ''
              const arc19URL = 'template-ipfs://{ipfscid:1:raw:reserve:sha2-256}'
              const rawNote = {"description": desc,
                      "image": assetURL,
                      "external_url": externalURL,
                      "mime_type": mimeType,
                      "properties": properties
                    }
              try {
                metadataCID = await uploadMetadata(rawNote)
              } catch (error) {
                console.error("error pinning metadata to IPFS", error)
                throw error
              }
              assetURL = arc19URL
              console.log(metadataCID)
              const decodedCID = CID.parse(metadataCID)
              reserve = algosdk.encodeAddress(
                Uint8Array.from(Buffer.from(decodedCID.multihash.digest))
              )
              console.log(reserve)
              const enc = new TextEncoder()
              note = enc.encode(JSON.stringify(rawNote))
            }
          }
          else {
            note = Uint8Array.from('Abyssal Portal - Collection Minting Tool\n\nDeveloped by Angels Of Ares'.split("").map(x => x.charCodeAt(0)))
          }

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
    setCidList([])
    setCidRaw('')
    reserve = ''
    setrawAssetName('')
    setrawUnitName('')
    setDesc('')
    setStartIndex(1)
    setArc('')
    setExternalURL('')
    setExternalURL('')
    setStatus((status) => status = 'Generating')
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
      <Tooltip py={3} px={5} borderWidth='1px' borderRadius='lg' arrowShadowColor={iconColor1} borderColor={buttonText3} bgColor='black' textColor={buttonText4} fontSize='16px' fontFamily='Orbitron' textAlign='center' hasArrow label={'You may use our collection upload tool to upload your files, and retreive the CID from it, or insert your own collection folder CID.'} aria-label='Tooltip'>
        <div className="flex p-4 rounded-md shadow-sm max-w-md">
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
          </div>
        </Tooltip>

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

          <HStack my={5} spacing='20px'>
              <Text textColor={lightColor}>Description</Text>
              <Input _hover={{bgColor: 'black'}} _focus={{borderColor: medColor}} textColor={xLightColor} borderColor={medColor}
                  className={`block w-full rounded-none rounded-l-md bg-black sm:text-sm`} type="text" onChange={(e) => setDesc(e.target.value)} placeholder='Custom description' />
          </HStack>

          <HStack my={5} spacing='20px'>
              <Text textColor={lightColor}>External URL</Text>
              <Input _hover={{bgColor: 'black'}} _focus={{borderColor: medColor}} textColor={xLightColor} borderColor={medColor}
                  className={`block w-full rounded-none rounded-l-md bg-black sm:text-sm`} type="text" onChange={(e) => setExternalURL(e.target.value)} placeholder='https://mint.me' />
          </HStack>
          <Center my={8}><FullGlowButton text='PRO' onClick={togglePro}/></Center>
          {pro ?
          <>
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
            
            <Center mt={-2}>
              <HStack spacing='36px'>
                <Tooltip py={3} px={5} borderWidth='1px' borderRadius='lg' arrowShadowColor={iconColor1} borderColor={buttonText3} bgColor='black' textColor={buttonText4} fontSize='16px' fontFamily='Orbitron' textAlign='center' hasArrow label={'If this is ENABLED, the assets will DEFAULT to FROZEN and may only be transferred using the CLAWBACK address!'} aria-label='Tooltip'>
                  <VStack my={5} spacing='20px' w='fit-content'>
                      <Text textColor={lightColor} className='whitespace-nowrap'>Default Frozen</Text>
                      <Switch defaultChecked={false} size='lg' colorScheme={baseColor} css={{"& .chakra-switch__thumb": {backgroundColor: "black" }}} onChange={() => setDefaultFrozen(!defaultFrozen)} />
                  </VStack>
                </Tooltip>
              
                <Tooltip py={3} px={5} borderWidth='1px' borderRadius='lg' arrowShadowColor={iconColor1} borderColor={buttonText3} bgColor='black' textColor={buttonText4} fontSize='16px' fontFamily='Orbitron' textAlign='center' hasArrow label={'If enabled name format will be 0001, 0002, 0003 based on collection size. If disabled name format will be 1, 2, 3.'} aria-label='Tooltip'>
                  <VStack my={5} spacing='20px' w='fit-content'>
                      <Text textColor={lightColor} className='whitespace-nowrap'>Leading Zeros</Text>
                      <Switch defaultChecked={false} size='lg' colorScheme={baseColor} css={{"& .chakra-switch__thumb": {backgroundColor: "black" }}} onChange={() => setLeadingZeros(!leadingZeros)} />
                  </VStack>
                </Tooltip>
              </HStack>
            </Center>

            <Center>
              <VStack pt='28px' pb='20px' spacing='36px'>
                  <FullGlowButton text={arc === '' ? 'Add Metadata' : 'Cancel Metadata'} onClick={() => setArc(arc !== '' ? '' : '69')} />
                  {arc !== '' ?
                  <>
                    <Tooltip py={3} px={5} borderWidth='1px' borderRadius='lg' arrowShadowColor={iconColor1} borderColor={buttonText3} bgColor='black' textColor={buttonText4} fontSize='16px' fontFamily='Orbitron' textAlign='center' hasArrow label={'Type of metadata. Use ARC69 for mutable traits only, and ARC19 for mutable traits AND image.'} aria-label='Tooltip'>
                      <HStack spacing='24px'>
                        <Text textColor={lightColor} fontSize='24px'>ARC69</Text>
                              <Switch defaultChecked={false} size='lg' css={{"& .chakra-switch__thumb": {backgroundColor: "black" }, "& .chakra-switch__track": {backgroundColor: baseColor }}} onChange={() => setArc(arc === '69' ? '19' : '69')} />
                        <Text textColor={lightColor} fontSize='24px'>ARC19</Text>
                      </HStack>
                    </Tooltip>
                    {arc === '19' ? 
                    <>
                      <HStack>
                        <Text textColor={lightColor} fontWeight="semibold" className='whitespace-nowrap'>
                          Api Key
                        </Text>
                        <div className="flex mx-4 rounded-md shadow-sm max-w-md">
                          <Input
                            type="text"
                            name="api-key"
                            id="api-key"
                            borderRightRadius={'0px'}
                            _hover={{ bgColor: 'black' }}
                            _focus={{ borderColor: medColor }}
                            textColor={xLightColor}
                            borderColor={medColor}
                            className={`block w-full rounded-none rounded-l-md bg-black sm:text-sm`}
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Web3.Storage API Token"
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
                            onClick={() => setApiKey('')}
                          >
                            Clear
                          </Button>
                        </div>
                      </HStack>
                      <Center mt={-4}>
                        <a href={`https://web3.storage/`} target='_blank' rel='noreferrer'>
                            <FullGlowButton text="Get API Key" />
                        </a>
                      </Center>
                    </> : null}
                    <HStack spacing='36px'>
                      <FullGlowButton text='Upload' onClick={handleCSV} />
                      <a href='https://docs.google.com/spreadsheets/d/1cL5eWTyuFr6R076vU2QEafXcCipDqgDwan48iQFXhys/edit?usp=sharing' target='_blank' rel='noreferrer'><FullGlowButton text='View Template' /></a>
                    </HStack>
                  </>
                  : null}
              </VStack>
            </Center>

            <Tooltip py={3} px={5} borderWidth='1px' borderRadius='lg' arrowShadowColor={iconColor1} borderColor={buttonText3} bgColor='black' textColor={buttonText4} fontSize='16px' fontFamily='Orbitron' textAlign='center' hasArrow label={'Index to begin minting from. Use this to continue minting when interrupted or minting in batches'} aria-label='Tooltip'>
              <HStack my={5} spacing='20px'>
                  <Text textColor={lightColor} className='whitespace-nowrap'>Start At</Text>
                  <Input
                    type="number"
                    name="start-index"
                    id="start-index"
                    _hover={{ bgColor: 'black' }}
                    _focus={{ borderColor: medColor }}
                    textColor={xLightColor}
                    borderColor={medColor}
                    className={`block rounded-none rounded-l-md bg-black sm:text-sm`}
                    value={startIndex}
                    onChange={(e) => setStartIndex(parseInt(e.target.value))}
                    placeholder="1"
                  />
              </HStack>
            </Tooltip>
          </> : null}

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