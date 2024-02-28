import Head from 'next/head'
import Navbar from 'components/Navbar'
import { Center, useColorModeValue, Text, HStack } from '@chakra-ui/react'
import styles2 from '../styles/glow.module.css'
import { useState, useEffect, useCallback } from 'react'
import React from 'react'
import { useWallet } from '@txnlab/use-wallet'
import Connect from 'components/MainTools/Connect'
import { FullGlowButton } from 'components/Buttons'
import { algodClient, algodIndexer } from 'lib/algodClient'
import algosdk from 'algosdk'
import toast from 'react-hot-toast'
import CraftModule from 'components/FallenOrder/components/Crafting'
import FusionModule from 'components/FallenOrder/components/Fusion'
import useWalletBalance from 'hooks/useWalletBalance'
import { Rank1, Rank2, Rank3, Rank4, Rank5 } from '../components/Whitelists/FOChars'
import { BGRank1, BGRank2, BGRank3 } from '../components/Whitelists/FOBGs'
import { hatchets, pickaxes } from '../components/Whitelists/FOTools'
import { kinshipPotions, skillPotions } from '../components/Whitelists/FOPotions'
import { rateLimiter } from 'lib/ratelimiter'
import axios from 'axios'
import MyBalancesTab from 'components/FallenOrder/components/MyBalancesTab'

export default function Laboratory() {
  const gradientText = useColorModeValue(styles2.textAnimatedGlowL, styles2.textAnimatedGlowD)
  const { activeAddress, signTransactions } = useWallet()
  const [ allInfo, setAllInfo ] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [type, setType] = useState<string>('')
  const { assetList } = useWalletBalance()

  const processAssetsInBatches = async () => {
    const allFO = [...Rank1, ...Rank2, ...Rank3, ...Rank4, ...Rank5]
    const foList = assetList.filter((item: any) => allFO.includes(item['asset-id']))
    const processedAssets = []
  
    for (let i = 0; i < foList.length; i += 20) {
      const batch = foList.slice(i, i + 20)
      const batchResults = await Promise.all(batch.map(process_asset_with_retry))
      processedAssets.push(...batchResults.filter(asset => asset !== null))
    }
  
    setAllInfo(processedAssets.reverse())
    setLoading(false)
    return processedAssets.reverse()
  };
  
  const process_asset_with_retry = async (singleAsset: any) => {
    const metadata_api = `https://mainnet-idx.algonode.cloud/v2/transactions?tx-type=acfg&asset-id=${singleAsset['asset-id']}&address=CHARX2GZKNZZORNV2WROPUTSB5QBVRIC62QXXLABFCKA2QALEA3OHVIDYA`;
    const MAX_RETRIES = 5
    let retries = 0
  
    while (retries < MAX_RETRIES) {
      try {
        const [assetInfo, response] = await Promise.all([
          rateLimiter(() => algodClient.getAssetByID(singleAsset['asset-id']).do()),
          axios.get(metadata_api)
        ]);
  
        if (response.status === 200) {
          const data = response.data;
          const note = data.transactions[0].note;
          const metadata_decoded_asset = JSON.parse(Buffer.from(atob(note), 'utf-8').toString('utf-8'));
          return [metadata_decoded_asset.properties, singleAsset['asset-id'], assetInfo.params['name'], assetInfo.params['unit-name'], 'https://gateway.ipfs.io/ipfs/' + assetInfo.params.url.substring(7)];
        } else {
          console.log('Error fetching data from API for asset ID', singleAsset['asset-id']);
          return null;
        }
      } catch (error: any) {
        if (error.response && error.response.status === 429) {
          const waitTime = 1000
          await new Promise(resolve => setTimeout(resolve, waitTime))
          retries++;
        } else {
          console.error('Error:', error)
          return null;
        }
      }
    }
  
    console.error('Max retries exceeded, giving up on asset ID', singleAsset['asset-id'])
    return null
  }
  
  const fetchAssets = async () => {
    if (activeAddress) {
      try {
        if (assetList.length > 0) {
          setLoading(true)
          await processAssetsInBatches()
        }
        if (assetList === -1) {
          setAllInfo([])
          setLoading(false)
        }
      } catch (error) {
        console.error("Error fetching assets:", error)
      }
    }
  }
  
  useEffect(() => {
    if (assetList) {
      fetchAssets()
    }
  }, [assetList])
  
  
  return (
    <>
      <Head>
        <title>Fallen Order - Laboratory</title>
        <meta name="description" content="Developed by Angels Of Ares" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Center mt={6}><MyBalancesTab /></Center>
      <Text mb='30px' className={`${gradientText} responsive-font`}>Laboratory</Text>
        {activeAddress && allInfo.length > 0 ? 
          <>
            <HStack w='full' justifyContent='center'>
              <FullGlowButton text='Craft' isLoading={loading} onClick={() => setType('Craft')}/>
              <FullGlowButton text='Fusion' isLoading={loading} onClick={() => setType('Fusion')} />
            </HStack>

            {type === 'Craft' && <CraftModule assets={allInfo} />}
            {type === 'Fusion' && <FusionModule assets={allInfo} />}

          </>
          :
          <>
            <Text my='40px' fontSize='18px' className={gradientText}>Connect Wallet</Text>
            <Center><Connect /></Center>
          </>
        }
    </>
  )
}
