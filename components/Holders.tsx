import { useState } from 'react'
import algodClient from 'lib/algodClient'
import { Box, useColorMode, useColorModeValue, Text, Switch, Button, Center, Progress, HStack, VStack, Input, Tooltip } from '@chakra-ui/react'
import styles from '../styles/glow.module.css'
import { FullGlowButton } from './Buttons'
import NfdLookup from './NfdLookup'
import axios from 'axios'
import { copyToClipboard } from 'utils/clipboard'
import { ClipboardIcon } from '@heroicons/react/20/solid'

export default function Holders() {
  const [addressToSearch, setAddressToSearch] = useState<string>('')
  const [searching, setSearching] = useState<boolean>(false)
  const [searchComplete, setSearchComplete] = useState<boolean>(true)
  const [opted, setOpted] = useState<boolean>(false)
  const [paperhands, setPaperhands] = useState<boolean>(false)
  const [minBal, setMinBal] = useState<number>(0)
  const [holderCount, setHolderCount] = useState<number>(0)
  const [assetCounter, setAssetCounter] = useState<number>(0)
  const [assetIDs, setAssetIDs] = useState<any>([])
  const [allHolders, setAllHolders] = useState<any>([])
  const { colorMode } = useColorMode()
  const boxGlow = useColorModeValue(styles.boxGlowL, styles.boxGlowD)  
  const xLightColor = useColorModeValue('orange.100','cyan.100')
  const lightColor = useColorModeValue('orange.300','cyan.300')
  const medColor = useColorModeValue('orange.500','cyan.500')
  const bgColor = colorMode === "light" ? "bg-orange-400" : "bg-cyan-500"
  const hoverBgColor = colorMode === "light" ? "hover:bg-orange-400" : "hover:bg-cyan-500"
  const textColor = colorMode === "light" ? "text-orange-200" : "text-cyan-200"
  const progress = useColorModeValue('linear(to-r, orange, red)', 'linear(to-r, purple.600, cyan)')
  const buttonText5 = useColorModeValue('yellow','cyan')
  
  const baseColorDash = colorMode === "light" ? 'orange-500' : 'cyan-500'
  const borderColor = colorMode === "light" ? 'border-orange-500' : 'border-cyan-400'
  const bgColorLight = colorMode === "light" ? 'bg-orange-100' : 'bg-cyan-50'
  const focusBorderColor = colorMode === "light" ? 'focus:border-orange-500' : 'focus:border-cyan-400'
  const gradientText = useColorModeValue(styles.textAnimatedGlowL, styles.textAnimatedGlowD)
  const baseColor = colorMode === "light" ? "orange" : "cyan"

  
  const buttonText3 = useColorModeValue('orange.500','cyan.500')
  const buttonText4 = useColorModeValue('orange.100','cyan.100')
  const iconColor1 = useColorModeValue('orange','cyan')
  
  const holders = new Set()

  const getAssets = async () => {
    const accountInfo = await algodClient.accountInformation(addressToSearch).do()
    const createdAssets = accountInfo['created-assets']
    createdAssets.map(async (asset: any) => {
      const assetId = asset['index']
      assetIDs.push(assetId)
    })
    setAssetIDs(assetIDs)
  }
  
  function sleep(ms: any) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  
  const MAX_RETRY_COUNT = 5

  async function processItemWithDelay(item: any) {
  const accountInfo = await algodClient.accountInformation(item['address']).do();
  const balanceMicroAlgos = accountInfo.amount;
  if (balanceMicroAlgos > minBal) {
    if (!holders.has(item['address'])) {
      setHolderCount((holderCount) => holderCount + 1);
    }
    holders.add(item['address']);
  }
}

async function getAssetHolders(assetId: number, retryCount = 0): Promise<any[]> {
  try {
    const apiEndpoint = `https://mainnet-idx.algonode.cloud/v2/assets/${assetId}/balances${!opted ? `?currency-greater-than=${minBal}` : ''}`
    const response = await axios.get(apiEndpoint);

    if (response.status === 429) {
      if (retryCount < MAX_RETRY_COUNT) {
        const retryDelay = 3000;
        await sleep(retryDelay);
        return getAssetHolders(assetId, retryCount + 1);
      } else {
        throw new Error(`Max retry count reached for asset ID ${assetId}`);
      }
    }

    if (response.data['balances'].length > 0) {
  const data = response.data['balances']
  const maxBatchSize = 25
  for (let i = 0; i < data.length; i += maxBatchSize) {
    const batch = data.slice(i, i + maxBatchSize)
    await Promise.all(batch.map(async (item: any) => {
      await processItemWithDelay(item);
    }));
  }
}
    return Array.from(holders);
  } catch (error: any) {
    throw new Error(`Error fetching asset holders for asset ID ${assetId}: ${error.message}`);
  }
}
const MAX_CONCURRENT_REQUESTS = 20

async function processAssetQueue(assetQueue: any, allHolders: any, assetCounter: any) {
  while (assetQueue.length > 0) {
    const assetId = assetQueue.pop();
    const holders = await getAssetHolders(assetId);
    for (const holder of holders) {
      allHolders.add(holder);
    }
    assetCounter((count: any) => count + 1);
  }
}

async function getHoldersForMultipleAssets(assetIds: any) {
  const allHolders = new Set()
  const assetQueue = [...assetIds]
  const concurrencyPromises = Array.from({ length: MAX_CONCURRENT_REQUESTS }, () =>
    processAssetQueue(assetQueue, allHolders, setAssetCounter)
  )

  await Promise.all(concurrencyPromises);

  setSearching(false)
  setSearchComplete(false)
  setAllHolders(allHolders)
}

  function convertToText(allHolders: any) {
    const allHoldersArray = Array.from(allHolders)
    return allHoldersArray.join('\n')
  }

  function downloadTextFile() {
    const text = convertToText(allHolders)
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Holders_Of_${addressToSearch.substring(0, 5) + "..." + addressToSearch.substring(addressToSearch.length - 5)}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSearchComplete(false)
    setSearching(true)
    await getAssets()
    getHoldersForMultipleAssets(assetIDs)
  }

  const handleAddressChange = (e: any) => {
    setAddressToSearch(e)
  }

  const handleOpted = () => {
    setOpted(!opted)
  }

  const handlePaperhands = () => {
    setPaperhands(!paperhands)
  }

  const handleMinBal = () => {
    if (minBal === 0){
      setMinBal(1000000)
    }
    else {
      setMinBal(0)
    }
  }

  const toggleNewSearch = () => {
    setSearchComplete(true)
    setAllHolders([])
    setAssetIDs([])
    setAssetCounter(0)
    setHolderCount(0)
  }

  return (
    <Box className={boxGlow} p='6px' m='20px' minW='300px' maxW='480px' bg="black" borderRadius="20px">
      <div className="pt-5 sm:px-6 flex justify-center items-center">
        <Text className='hFont' textColor={medColor}>Holders</Text>
      </div>
        <div className="mt-1 sm:col-span-4 px-4 sm:mt-0">
          <NfdLookup
            className={`text-black w-full my-2 cursor-default rounded-md border ${borderColor} ${bgColorLight} text-center shadow-sm ${focusBorderColor} focus:outline-none focus:ring-1 sm:text-sm`}
            value={addressToSearch}
            onChange={handleAddressChange}
            placeholder={"Enter Address/NFD"}
            ariaDescribedby="lookup-description"
          />
        </div>
        <Center mx={4}>
          <HStack spacing='24px'>
            <Tooltip py={1} px={2} borderWidth='1px' borderRadius='lg' arrowShadowColor={iconColor1} borderColor={buttonText3} bgColor='black' textColor={buttonText4} fontSize='10px' fontFamily='Orbitron' textAlign='center' hasArrow label={'Include 0 balance wallets'} aria-label='Tooltip'>
              <VStack mb={6} spacing='12px' w='fit-content'>
                  <Text textColor={lightColor} className='whitespace-nowrap'>Opt Ins</Text>
                  <Switch defaultChecked={false} size='lg' colorScheme={baseColor} css={{"& .chakra-switch__thumb": {backgroundColor: "black" }}} onChange={handleOpted} />
              </VStack>
            </Tooltip>
            <Tooltip py={1} px={2} borderWidth='1px' borderRadius='lg' arrowShadowColor={iconColor1} borderColor={buttonText3} bgColor='black' textColor={buttonText4} fontSize='10px' fontFamily='Orbitron' textAlign='center' hasArrow label={'Include wallets that ever interacted with an asset historically'} aria-label='Tooltip'>
              <VStack mb={6} spacing='12px' w='fit-content'>
                  <Text textColor={lightColor} className='whitespace-nowrap'>Paperhands</Text>
                  <Switch defaultChecked={false} size='lg' colorScheme={baseColor} css={{"& .chakra-switch__thumb": {backgroundColor: "black" }}} onChange={handlePaperhands} />
              </VStack>
            </Tooltip>
            <Tooltip py={1} px={2} borderWidth='1px' borderRadius='lg' arrowShadowColor={iconColor1} borderColor={buttonText3} bgColor='black' textColor={buttonText4} fontSize='10px' fontFamily='Orbitron' textAlign='center' hasArrow label={'Include wallets with less than 1 $ALGO balance'} aria-label='Tooltip'>
              <VStack mb={6} spacing='12px' w='fit-content'>
                  <Text textColor={lightColor} className='whitespace-nowrap'>Escrows</Text>
                  <Switch defaultChecked={false} size='lg' colorScheme={baseColor} css={{"& .chakra-switch__thumb": {backgroundColor: "black" }}} onChange={handleMinBal} />
              </VStack>
            </Tooltip>
          </HStack>
      </Center>
      {searchComplete ?
        <form onSubmit={handleSubmit} className="lg:flex lg:flex-col lg:flex-1">
            <Center mb='26px'>
              <FullGlowButton text='Search!' onClick={handleSubmit} disabled={addressToSearch === '' || addressToSearch.length !== 58 ? true : false}/>
            </Center>
        </form>
      : 
      <>
      {searching ?
        <Center>
          <VStack>
            <Text textAlign='center' textColor={xLightColor} className='pt-4 text-sm'>This may take a few minutes...</Text>
            <Box w='150px' mt='12px' mb='10px'>
                <Progress size='xs' bgGradient={progress} colorScheme={buttonText5} isIndeterminate borderRadius='xl'/>
            </Box>
          </VStack>
        </Center>
       :
       <>
       <Center mb='16px'>
           <FullGlowButton text='New Search' onClick={toggleNewSearch}/>
       </Center>
        <Center>
       <HStack my='12px'>
          <FullGlowButton text='Download!' onClick={downloadTextFile}/>
          <div className="rounded-md shadow-sm ml-3 sm:ml-4">
            <button
              type="button"
              className={`relative inline-flex items-center first:rounded-l-md last:rounded-r-md border ${borderColor} bg-black px-3.5 py-2.5 sm:px-2.5 sm:py-2 text-sm font-medium ${textColor} hover:text-black ${hoverBgColor} focus:z-20`}
              data-clipboard-text={convertToText(allHolders)}
              data-clipboard-message="Holders List Copied!"
              onClick={copyToClipboard}
              id="copy-holders"
              data-tooltip-content="Copy Holders List"
            >
            <ClipboardIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
       </HStack>
      </Center>
     </>
     }
     <Text mb={8} textAlign='center' textColor={xLightColor} className='pt-4' fontSize='12px'>Assets: <strong>{assetCounter}/{assetIDs.length}</strong> | Holders: <strong>{holderCount}</strong></Text>
     </>}
   </Box>
  )
}
