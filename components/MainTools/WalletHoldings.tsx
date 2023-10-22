import { useState } from 'react'
import algodClient from 'lib/algodClient'
import { Box, useColorMode, useColorModeValue, Text, Switch, Button, Center, Progress, HStack, VStack, Input, Tooltip } from '@chakra-ui/react'
import styles from '../../styles/glow.module.css'
import { FullGlowButton } from '../Buttons'
import NfdLookup from '../NfdLookup'
import axios from 'axios'
import { copyToClipboard } from 'utils/clipboard'
import { ClipboardIcon } from '@heroicons/react/20/solid'
import { rateLimiter } from 'lib/ratelimiter'


export default function WalletHoldings() {
  const [addressToSearch, setAddressToSearch] = useState<string>('')
  const [searching, setSearching] = useState<boolean>(false)
  const [bal, setBal] = useState<boolean>(false)
  const [opted, setOpted] = useState<number>(1)
  const [assetIDs, setAssetIDs] = useState<any>([])
  const [searchComplete, setSearchComplete] = useState<boolean>(true)
  const [decimals, setDecimals] = useState<any>([])
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

  async function fetchAssets( assetIds: number[] ): Promise<any[]> {
    await Promise.all(
      assetIds.map( assetId => rateLimiter( async () => {
        try {
          const assetInfo = await algodClient.getAssetByID(assetId).do()
          decimals.push(assetInfo.params.decimals)
          console.log(decimals)
        }
        catch {}
      }))
    );
    return decimals
  }

  const getAssets = async () => {
    console.log(opted)
    const accountInfo = await algodClient.accountInformation(addressToSearch).do()
    const allAssets = accountInfo['assets']
    allAssets.map(async (asset: any) => {
      let assetId = asset['asset-id']
      if (asset['amount'] >= opted) {
        assetIDs.push(assetId)
      }
    })
    setAssetIDs(assetIDs)
    if (bal) {
        let finalAssetIDs = []
        await fetchAssets(assetIDs)
        for (let i = 0; i < assetIDs.length; i++) {
            const finBal = allAssets[i]['amount']*(10**decimals[i])
            const assetId = [allAssets[i]['asset-id'], finBal]
            finalAssetIDs.push(assetId)
        }
        setAssetIDs(finalAssetIDs)
    }
    setSearching(false)
  }
  

  function convertToText(allHolders: any) {
    const allHoldersArray = Array.from(allHolders)
    return allHoldersArray.join('\n')
  }

  function downloadTextFile() {
    const text = convertToText(assetIDs)
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
    getAssets()
  }

  const handleAddressChange = (e: any) => {
    setAddressToSearch(e)
  }


  const handleBal = () => {
    setBal(!bal)
  }

  const handleOpted = () => {
    setOpted(opted === 0 ? 1 : 0)
  }

  const toggleNewSearch = () => {
    setSearchComplete(true)
    setAssetIDs([])
    setDecimals([])
  }

  return (
    <Box className={boxGlow} p='6px' m='20px' minW='300px' maxW='480px' bg="black" borderRadius="20px">
      <div className="pt-5 sm:px-6 flex justify-center items-center">
        <Text className='hFont' textColor={medColor}>Wallet Holdings</Text>
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
        <Center mt={6} mx={4}>
          <HStack spacing='24px'>
          <Tooltip py={1} px={2} borderWidth='1px' borderRadius='lg' arrowShadowColor={iconColor1} borderColor={buttonText3} bgColor='black' textColor={buttonText4} fontSize='16px' fontFamily='Orbitron' textAlign='center' hasArrow label={'Include 0 balance assets in results'} aria-label='Tooltip'>
              <VStack mb={6} spacing='12px' w='fit-content'>
                  <Text textColor={lightColor} className='whitespace-nowrap'>Opted</Text>
                  <Switch defaultChecked={false} size='lg' colorScheme={baseColor} css={{"& .chakra-switch__thumb": {backgroundColor: "black" }}} onChange={handleOpted} />
              </VStack>
            </Tooltip>
            <Tooltip py={1} px={2} borderWidth='1px' borderRadius='lg' arrowShadowColor={iconColor1} borderColor={buttonText3} bgColor='black' textColor={buttonText4} fontSize='16px' fontFamily='Orbitron' textAlign='center' hasArrow label={'Include balances in results'} aria-label='Tooltip'>
              <VStack mb={6} spacing='12px' w='fit-content'>
                  <Text textColor={lightColor} className='whitespace-nowrap'>Balances</Text>
                  <Switch defaultChecked={false} size='lg' colorScheme={baseColor} css={{"& .chakra-switch__thumb": {backgroundColor: "black" }}} onChange={handleBal} />
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
            <Text textAlign='center' textColor={xLightColor} className='pt-4 text-sm'>This may take up to a minute...</Text>
            <Box w='150px' mt='12px' mb='36px'>
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
              data-clipboard-text={convertToText(assetIDs)}
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
     <Text mb={4} textAlign='center' textColor={xLightColor} className='pt-4' fontSize='16px'>Assets: <strong>{assetIDs.length}</strong></Text>
     </>
     }
     </>}
   </Box>
  )
}
