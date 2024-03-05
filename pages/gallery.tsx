import Head from 'next/head'
import Navbar from 'components/Navbar'
import { Center, useColorModeValue, Text, Box, Flex, Textarea, useColorMode, Select, VStack, Image } from '@chakra-ui/react'
import styles from '../styles/glow.module.css'
import Footer from 'components/Footer'
import React, { useState, useEffect } from 'react'
import Connect from 'components/MainTools/Connect'
import { useRouter } from 'next/router'
import { useWallet } from '@txnlab/use-wallet'
import { algodClient, algodIndexer } from 'lib/algodClient'
import { AssetApproveCard } from 'components/MainTools/components/AssetApproveCard'
import { FullGlowButton } from 'components/Buttons'
import { copyToClipboard } from 'utils/clipboard'
import { ClipboardIcon } from '@heroicons/react/20/solid'
import algosdk from 'algosdk'
import toast from 'react-hot-toast'
import axios from 'axios'
import { rateLimiter } from 'lib/ratelimiter'
import { Rank1, Rank2, Rank3, Rank4, Rank5 } from '../components/Whitelists/FOChars'

export default function GalleryView() {
  const { colorMode } = useColorMode()
  const [loading, setLoading] = useState<boolean>(false)
  const borderColor = colorMode === "light" ? "border-orange-200" : "border-cyan-200"
  const textColor = colorMode === "light" ? "text-orange-200" : "text-cyan-200"
  const hoverBgColor = colorMode === "light" ? "hover:bg-orange-200" : "hover:bg-cyan-200"
  const gradientText = useColorModeValue(styles.textAnimatedGlowL, styles.textAnimatedGlowD)
  const boxGlow = useColorModeValue(styles.boxGlowL, styles.boxGlowD)
  const buttonText3 = useColorModeValue('orange.500','cyan.500')
  const buttonText4 = useColorModeValue('orange.200','cyan.100')
  const buttonText5 = useColorModeValue('orange','cyan')
  const xLightColor = useColorModeValue('orange.100','cyan.100')
  const mLightColor = useColorModeValue('orange.200','cyan.200')
  const LightColor = useColorModeValue('orange.300','cyan.300')
  const medColor = useColorModeValue('orange.500','cyan.500')
  const [assetData, setAssetData] = useState<any>({})
  const [newList, setNewList] = useState<any>([])
  const [type, setType] = useState<any>('Fallen Order')
  const [allInfo, setAllInfo] = useState<any>([])
  const foList = [...Rank1, ...Rank2, ...Rank3, ...Rank4, ...Rank5]

  const selectTypes: any = {
    1: 'Fallen Order',
    2: 'Rank 1',
    3: 'Rank 2',
    4: 'Rank 3',
    5: 'Rank 4',
    6: 'Rank 5',
    7: 'Fusion',
  }

  const processAssetsInBatches = async (assets: any) => {
    const processedAssets: any = [];
  
    for (let i = 0; i < assets.length; i += 10) {
      const batch = assets.slice(i, i + 10);
      const batchResults = await Promise.all(batch.map(process_asset_with_retry));
      processedAssets.push(...batchResults.filter(asset => asset !== null));
    }
  
    setLoading(false);
    setAllInfo((prevInfo: any) => [...prevInfo, ...processedAssets.reverse()]);
  };
  
  const process_asset_with_retry = async (singleAsset: any) => {
    const metadata_api = `https://mainnet-idx.algonode.cloud/v2/transactions?tx-type=acfg&asset-id=${singleAsset}&address=CHARX2GZKNZZORNV2WROPUTSB5QBVRIC62QXXLABFCKA2QALEA3OHVIDYA`;
    const MAX_RETRIES = 5
    let retries = 0
  
    while (retries < MAX_RETRIES) {
      try {
        const [assetInfo, response] = await Promise.all([
          rateLimiter(() => algodClient.getAssetByID(singleAsset).do()),
          axios.get(metadata_api)
        ]);
  
        if (response.status === 200) {
          const data = response.data;
          const note = data.transactions[0].note;
          const metadata_decoded_asset = JSON.parse(Buffer.from(atob(note), 'utf-8').toString('utf-8'));
          setAllInfo((allInfo: any) => [
            ...allInfo,
            [metadata_decoded_asset.properties, singleAsset, assetInfo.params['name'], assetInfo.params['unit-name'], 'https://gateway.ipfs.io/ipfs/' + assetInfo.params.url.substring(7)]
          ]);
          return [metadata_decoded_asset.properties, singleAsset, assetInfo.params['name'], assetInfo.params['unit-name'], 'https://gateway.ipfs.io/ipfs/' + assetInfo.params.url.substring(7)];
        } else {
          console.log('Error fetching data from API for asset ID', singleAsset);
          return null;
        }
      } catch (error: any) {
        if (error.response && error.response.status === 429) {
          const waitTime = 2000
          await new Promise(resolve => setTimeout(resolve, waitTime))
          retries++;
        } else {
          console.error('Error:', error)
          return null;
        }
      }
    }
  
    console.error('Max retries exceeded, giving up on asset ID', singleAsset)
    return null
  }
  
  const fetchAssets = async (assetList: any) => {
    try {
        setLoading(true)
        await processAssetsInBatches(assetList)
    } catch (error) {
      console.error("Error fetching assets:", error)
    }
  }
  
  useEffect(() => {
    if (type === 'Fallen Order') {
      fetchAssets(foList);
    } else if (type === 'Rank 1') {
      fetchAssets(Rank1);
    } else if (type === 'Rank 2') {
      fetchAssets(Rank2);
    } else if (type === 'Rank 3') {
      fetchAssets(Rank3);
    } else if (type === 'Rank 4') {
      fetchAssets(Rank4);
    } else if (type === 'Rank 5') {
      fetchAssets(Rank5);
    } else if (type === 'Fusion') {
      fetchAssets(foList);
    }
  }, [type, fetchAssets, foList]);

  return (
    <>
      <Head>
        <title>Fallen Order - Gallery</title>
        <meta name="description" content="Developed by Angels Of Ares" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
        <>
          <Text my='24px' className={`${gradientText} responsive-font`}>The Gallery</Text>
          <Center>
            <Select style={{ paddingBottom: '8px'}} w='300px' textAlign='center' iconColor={LightColor} textColor={xLightColor} cursor='pointer' _hover={{ borderColor: medColor }} borderColor={LightColor}
              borderWidth='1px' borderRadius='8px' onChange={(e) => setType(selectTypes[parseInt(e.target.value)])}>
                {Object.entries(selectTypes).map(([key, value]: any) => (
                    <option style={{ backgroundColor: 'black'}} key={key} value={key}>
                      {value}
                    </option>
                ))}
            </Select>
          </Center>

          {type == 'Fallen Order' ?
            <Center>
              <Flex px='48px' py='24px' w='full' flexDirection="row" flexWrap="wrap" gap='24px' justifyContent='center'>
                {allInfo
                .map((asset: any, index: any) => (
                  <VStack key={index} justifyContent='center'>
                    <Image
                      _hover={{ boxSize: '24' }}
                      className={boxGlow}
                      boxSize={'28'}
                      borderRadius='8px'
                      alt={asset[2]}
                      src={asset[4]}
                    />
                    <Text fontSize='12px' textColor={buttonText4}>
                      {asset[3]}
                    </Text>
                  </VStack>
                  ))}
              </Flex>
            </Center>
          : null}

          {type == 'Rank 1' ?
            <Center>

            </Center>
          : null}

          {type == 'Rank 2' ?
            <Center>

            </Center>
          : null}

          {type == 'Rank 3' ?
            <Center>

            </Center>
          : null}

          {type == 'Rank 4' ?
            <Center>

            </Center>
          : null}

          {type == 'Rank 5' ?
            <Center>

            </Center>
          : null}

          {type == 'Fusion' ?
            <Center>

            </Center>
          : null}

        </>
      <Footer />
    </>
  )
}
