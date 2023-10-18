import { HStack, Text, useColorModeValue, Box, Center, VStack, Image as CImage, Progress, Tooltip, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, useDisclosure, Flex, SimpleGrid } from '@chakra-ui/react'
import { FullGlowButton } from 'components/Buttons'
import React, { useState, useEffect } from 'react'
import styles from '../../styles/glow.module.css'
import useWalletBalance from 'hooks/useWalletBalance'
import { Rank1, Rank2, Rank3, Rank4, Rank5 } from '../Whitelists/FOChars'
import algodClient from 'lib/algodClient'
import { useWallet } from '@txnlab/use-wallet'
import { CharCard } from './components/CharCard'
import axios from 'axios'

const ManageCharacter: React.FC = () => {
  const { activeAddress } = useWallet()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const allFO = [...Rank1, ...Rank2, ...Rank3, ...Rank4, ...Rank5]
  const xLightColor = useColorModeValue('orange.100','cyan.100')
  const lightColor = useColorModeValue('orange.300','cyan.300')
  const medColor = useColorModeValue('orange.500','cyan.500')
  const [txnID, setTxnID] = useState<any>('')
  const [equipping, setEquipping] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const boxGlow = useColorModeValue(styles.boxGlowL, styles.boxGlowD)
  const bgColor = useColorModeValue("bg-orange-400", "bg-cyan-500")
  const { assetList } = useWalletBalance()
  const gradientText = useColorModeValue(styles.textAnimatedGlowL, styles.textAnimatedGlowD)
  const [selectedFO, setSelectedFO] = useState({value: 'No Characters Found!', label: (
    <>
    </>
  ), image: '', asset_id: 0})
  
  const progress = useColorModeValue('linear(to-r, orange, red)', 'linear(to-r, purple.600, cyan)')
  const buttonText5 = useColorModeValue('yellow','cyan')
  const buttonText3 = useColorModeValue('orange.500', 'cyan.500')
  const buttonText4 = useColorModeValue('orange.100', 'cyan.100')
  const iconColor1 = useColorModeValue('orange', 'cyan')
  const bgCardOff = useColorModeValue('linear(60deg, whiteAlpha.300 10%, black 35%, black 65%, whiteAlpha.300 90%)','linear(60deg, whiteAlpha.300 10%, black 35%, black 65%, whiteAlpha.300 90%)')

  const [charList, setCharList] = useState<any>([])
  
  async function processAssetsInBatches(): Promise<any[]> {
    const foList = assetList.filter((item: any) => allFO.includes(item['asset-id']))
    const batches = []
    for (let i = 0; i < foList.length; i += 60) {
      const batch = foList.slice(i, i + 60)
      batches.push(batch)
    }
    const promises = batches.map(async (batch) => {
      return process_asset(batch)
    })  
    const results = await Promise.all(promises)
    setCharList(results.flat().reverse())
    setLoading(false)
    return results.flat().reverse()
  }
  
  async function process_asset(assets: any): Promise<any[]> {
    const processedAssets = []
  
    for (const singleAsset of assets) {
      const metadata_api = `https://mainnet-idx.algonode.cloud/v2/transactions?tx-type=acfg&asset-id=${singleAsset['asset-id']}&address=CHARX2GZKNZZORNV2WROPUTSB5QBVRIC62QXXLABFCKA2QALEA3OHVIDYA`
  
      try {
        const assetInfo = await algodClient.getAssetByID(singleAsset['asset-id']).do()
        const assetImage = 'https://cloudflare-ipfs.com/ipfs/' + assetInfo.params.url.substring(7)
        const response = await axios.get(metadata_api)  
        if (response.status === 200) {
          const data = response.data
          const note = data.transactions[0].note
          const metadata_decoded_asset = JSON.parse(Buffer.from(atob(note), 'utf-8').toString('utf-8'))
          processedAssets.push([metadata_decoded_asset.properties, singleAsset['asset-id'], assetInfo.params['name'], assetInfo.params['unit-name'], assetImage])
        } else {
          console.log('Error fetching data from API for asset ID', singleAsset['asset-id'])
        }
      } catch (error) {
        console.error('Error:', error)
      }}  
    return processedAssets
  }

  useEffect(() => {
    if (assetList  && assetList.length > 0) {
        processAssetsInBatches()
    }
    }, [assetList])

  return (
    <>
        <VStack w='90%'>
          {!loading ?
          <>
          {charList.length > 0 ?
          <>
            {charList
            .length > 0 ?
              <Flex flexDirection="row" flexWrap="wrap" justifyContent='center'>
                {charList
                .map((option: any) => (
                    <CharCard metadata={option[0]} asset_id={option[1]} name={option[2]} unitName={option[3]} image={option[4]} />
                ))}
              </Flex>
            : 
              <VStack my={4}>
                <Text textColor={lightColor}>No Characters Found!</Text>
                <a href='https://www.nftexplorer.app/sellers/fallen-order' target='_blank' rel='noreferrer'><FullGlowButton text='Join The Order!' /></a>
              </VStack>
            }
          </>
          : 
          <VStack my={4}>
            <Text textColor={lightColor}>Seems you do not own any characters...</Text>
            <a href='https://www.nftexplorer.app/sellers/fallen-order' target='_blank' rel='noreferrer'><FullGlowButton text='Join The Order!' /></a>
          </VStack>
          }
          </>
          :
          <>
            <Text mb={-4} textColor={xLightColor} align={'center'} className='pt-4 text-sm'>Loading User Profile...</Text>
            <Box w='250px' my='24px'>
                <Progress size='xs' bgGradient={progress} colorScheme={buttonText5} isIndeterminate borderRadius='xl'/>
            </Box>
          </>
          }
        </VStack>
  </>
  )
}

export default ManageCharacter
