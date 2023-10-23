import { Text, useColorModeValue, Box, VStack, Progress, Flex } from '@chakra-ui/react'
import { FullGlowButton } from 'components/Buttons'
import React, { useState, useEffect } from 'react'
import useWalletBalance from 'hooks/useWalletBalance'
import { Rank1, Rank2, Rank3, Rank4, Rank5 } from '../Whitelists/FOChars'
import { algodClient } from 'lib/algodClient'
import { CharCard } from './components/CharCard'
import axios from 'axios'
import { rateLimiter } from 'lib/ratelimiter'

const ManageCharacter: React.FC = () => {
  const allFO = [...Rank1, ...Rank2, ...Rank3, ...Rank4, ...Rank5]
  const xLightColor = useColorModeValue('orange.100','cyan.100')
  const lightColor = useColorModeValue('orange.300','cyan.300')
  const [loading, setLoading] = useState<boolean>(true)
  const { assetList, boostBal } = useWalletBalance()
  
  const progress = useColorModeValue('linear(to-r, orange, red)', 'linear(to-r, purple.600, cyan)')
  const buttonText5 = useColorModeValue('yellow','cyan')

  const [charList, setCharList] = useState<any>([])

async function getKinship(asset_id: any): Promise<number> {
  const metadata_api = `https://mainnet-idx.algonode.cloud/v2/transactions?tx-type=acfg&asset-id=${asset_id}&address=CHARX2GZKNZZORNV2WROPUTSB5QBVRIC62QXXLABFCKA2QALEA3OHVIDYA`;

  try {
    const response = await axios.get(metadata_api);
    
    if (response.status === 200) {
      const data = response.data;
      const kinships: number[] = [];
      let counter = 0;

      while (data.transactions.length > counter) {
        const base64Data = data.transactions[counter].note
        const decodedData = atob(base64Data);
        const encoder = new TextEncoder();
        const encodedData = encoder.encode(decodedData).buffer
        kinships.push(
          JSON.parse(new TextDecoder('utf-8').decode(encodedData)).properties.Kinship || -1
        );
        counter++;
      }

      let flag_count = 1
      let kinship_found = false

      while (!kinship_found && flag_count < kinships.length) {
        if (kinships[flag_count - 1] !== kinships[flag_count] && kinships[flag_count] !== -1 && kinships[flag_count - 1] !== -1) {
          const confirmed_round = data.transactions[flag_count - 1]['confirmed-round']
          const blockInfo = `https://mainnet-idx.algonode.cloud/v2/blocks/${confirmed_round}`
          const blockResponse = await axios.get(blockInfo)
          
          if (blockResponse.status === 200) {
            const blockTimestamp = blockResponse.data.timestamp
            const currentTimestamp = Math.floor(Date.now() / 1000)
            return 86400 - (currentTimestamp - blockTimestamp)
          }
        }
        flag_count++
      }
    } else {
      console.log('Error fetching data from API')
    }
  } catch (error) {
    console.error(error)
  }
  return 0
}
  
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
        const assetInfo = await rateLimiter(
          () => algodClient.getAssetByID(singleAsset['asset-id']).do()
        )
        const assetImage = 'https://cloudflare-ipfs.com/ipfs/' + assetInfo.params.url.substring(7)
        const response = await axios.get(metadata_api)
        if (response.status === 200) {
          const data = response.data
          const note = data.transactions[0].note
          const metadata_decoded_asset = JSON.parse(Buffer.from(atob(note), 'utf-8').toString('utf-8'))
          let bg_image = '-'
          let bg_name = '-'
          if (metadata_decoded_asset.properties.Background && metadata_decoded_asset.properties.Background !== '-') {
            const bgInfo = await rateLimiter(
              () => algodClient.getAssetByID(metadata_decoded_asset.properties.Background).do()
            );
            bg_image = 'https://cloudflare-ipfs.com/ipfs/' + bgInfo.params.url.substring(7)
            bg_name = bgInfo.params['name']
          }
          const kinship_seconds = await getKinship(singleAsset['asset-id'])
          processedAssets.push([metadata_decoded_asset.properties, singleAsset['asset-id'], assetInfo.params['name'], assetInfo.params['unit-name'], assetImage, bg_image, bg_name, kinship_seconds])
        } else {
          console.log('Error fetching data from API for asset ID', singleAsset['asset-id'])
        }
      } catch (error) {
        console.error('Error:', error)
      }}
    return processedAssets
  }

  useEffect(() => {
    if (assetList) {
      if (assetList.length > 0) {
        setLoading(true)
        processAssetsInBatches()
      }
      if (assetList === -1) {
        setCharList([])
        setLoading(false)
      }
    }
    }, [assetList])

  return (
    <>
        <VStack w='90%'>
          {!loading ?
          <>
            {charList.length > 0 ?
              <>
                <Flex flexDirection="row" flexWrap="wrap" justifyContent='center'>
                  {charList.map((option: any, index: any) => (
                    <div key={index}>
                      <CharCard metadata={option[0]} asset_id={option[1]} name={option[2]} unitName={option[3]} image={option[4]} boostBal={boostBal === -1 ? 'Not Opted!' : boostBal} bg_image={option[5]} bg_name={option[6]} kin_sec={option[7]} />
                    </div>
                  ))}
                </Flex>
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
