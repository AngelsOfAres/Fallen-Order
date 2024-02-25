import Head from 'next/head'
import Navbar from 'components/Navbar'
import { Center, useColorModeValue, Text, Box, Flex, Textarea, useColorMode } from '@chakra-ui/react'
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

export default function ApproveAssets() {
  const { colorMode } = useColorMode()
  const { activeAddress, signTransactions } = useWallet()
  const [loading, setLoading] = useState<boolean>(false)
  const borderColor = colorMode === "light" ? "border-orange-200" : "border-cyan-200"
  const textColor = colorMode === "light" ? "text-orange-200" : "text-cyan-200"
  const hoverBgColor = colorMode === "light" ? "hover:bg-orange-200" : "hover:bg-cyan-200"
  const gradientText = useColorModeValue(styles.textAnimatedGlowL, styles.textAnimatedGlowD)
  const buttonText3 = useColorModeValue('orange.500','cyan.500')
  const buttonText4 = useColorModeValue('orange.200','cyan.100')
  const buttonText5 = useColorModeValue('orange','cyan')
  const xLightColor = useColorModeValue('orange.100','cyan.100')
  const mLightColor = useColorModeValue('orange.200','cyan.200')
  const medColor = useColorModeValue('orange.500','cyan.500')
  const [assetData, setAssetData] = useState<any>({})
  const [newList, setNewList] = useState<any>([])
  const router = useRouter()
  const idsString: any = router.query.ids || ''
  const [idsList, setIdsList] = useState<any>([])

  useEffect(() => {
    const parseIdsFromQuery = () => {
      const ids: any = idsString.split(' ').map((id: any) => id.trim())
      setIdsList(ids)
      setNewList(ids)
    }

    if (idsString !== '') {
      parseIdsFromQuery()
    }
  }, [idsString])

  useEffect(() => {
    if (idsList.length > 0) {
      const fetchAssetInfo = async (idsList: any) => {
        const assetDataNew: any = {}
        for (const id of idsList) {
          try {
            const assetInfo = await algodIndexer.lookupAssetByID(parseInt(id)).do()
            if (assetInfo) {
              const params = assetInfo.asset.params
              const { name, url, total: supply, decimals, 'unit-name': unitName } = params

              assetDataNew[id] = {
                name,
                url,
                supply,
                decimals,
                unitName
              }
            } else {
              console.log(`Asset with ID ${id} does not exist.`)
            }
          } catch (error) {
            console.error("Error fetching asset:", error)
          }
        }
        setAssetData(assetDataNew)
        setLoading(false)
      }
  
      fetchAssetInfo(idsList)
    }
  }, [idsList])

  
  const massOptTxns = async () => {
    setLoading(true)

    try {
      if (!activeAddress) {
        throw new Error('Wallet Not Connected!')
      }
  
      const suggestedParams = await algodClient.getTransactionParams().do()
      suggestedParams.fee = 1000
      suggestedParams.flatFee = true
      const amount = 0
      const note = Uint8Array.from('Abyssal Portal - Tools\n\nMass Asset Approval Successful!'.split("").map(x => x.charCodeAt(0)))
  
      const batchSize = 16
      const batchSize2 = 80
      const maxRetries = 5
      const delayBetweenRetries = 150
      
      const batchTransactions = []
      const totalAssets = idsList.length
      
      for (let i = 0; i < totalAssets; i += batchSize2) {
        const batchEndIndex = Math.min(i + batchSize2, totalAssets)
        const assetIDsBatch = idsList.slice(i, batchEndIndex)
      
        let retries = 0
        let success = false
        let batchResult = []
      
        while (retries < maxRetries && !success) {
          try {
            batchResult = await Promise.all(
              assetIDsBatch.map(async (assetID: any) => {
                const assetIndex = parseInt(assetID)
                console.log(assetIndex)
      
                return algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                  from: activeAddress,
                  to: activeAddress,
                  amount,
                  assetIndex,
                  suggestedParams,
                  note,
                })
              })
            )
      
            success = true
          } catch (error: any) {
            if (error.response && error.response.status === 429) {
              retries++;
              console.log(`Rate limited (429). Retrying attempt ${retries} in ${delayBetweenRetries} ms...`)
              await new Promise((resolve) => setTimeout(resolve, delayBetweenRetries))
            } else {
            }
          }
        }
      
        if (!success) {
          throw new Error(`Failed to fetch asset data after ${maxRetries} retries.`)
        }
      
        batchTransactions.push(...batchResult)
      
        if (i + batchSize2 < totalAssets) {
          await new Promise((resolve) => setTimeout(resolve, 750))
        }
      }
      
      let groupcount = 1
      const encodedBatches = []
  
      const numTransactions = batchTransactions.length
      const adjustedBatchSize = numTransactions < batchSize ? numTransactions : batchSize;
  
      for (let i = 0; i < batchTransactions.length; i += adjustedBatchSize) {
        const batch: any[] = batchTransactions.slice(i, i + adjustedBatchSize)
        algosdk.assignGroupID(batch)
        const encodedBatch = batch.map(txn => algosdk.encodeUnsignedTransaction(txn))
        encodedBatches.push(encodedBatch)
      }
      for (let i = 0; i < encodedBatches.length; i += 4) {
        toast.loading(`Awaiting Signature #${groupcount}...`, { id: 'txn', duration: Infinity })

        const batchToSign = encodedBatches.slice(i, i + 4)
        const flattenedBatchToSign = batchToSign.reduce((acc, curr) => [...acc, ...curr], [])
        const signedBatch = await signTransactions(flattenedBatchToSign)
        groupcount++
        
        for (let j = 0; j < signedBatch.length; j += 16) {
          const groupToSend = signedBatch.slice(j, j + 16)
          algodClient.sendRawTransaction(groupToSend).do()
        }
      }   

      toast.success(`Successfully Approved! Total Assets: ${idsList.length}`, {
        id: 'txn',
        duration: 5000
      })
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
      toast.error(`Oops! Mass asset approval failed. Please verify asset IDs and try again...`, { id: 'txn' })
    }
  }
  

  return (
    <>
      <Head>
        <title>Fallen Order - Approve Assets</title>
        <meta name="description" content="Developed by Angels Of Ares" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      {activeAddress ?
        <>
          <Text my='24px' className={`${gradientText} responsive-font`}>Asset Approval</Text>
          <Center>
            <Box position="relative">
              <Textarea
                css={`
                  /* Hide scrollbar display */
                  ::-webkit-scrollbar {
                    display: none;
                  }
                `}
                w='300px'
                zIndex={0}
                maxLength={250}
                minH='50px'
                fontSize='12px'
                paddingRight={0}
                value={newList.join(' ')}
                onChange={(e) => setNewList(e.target.value.split(' '))}
                placeholder={`Enter IDs Here!\n811721471 31566704 386192725`}
                _hover={{bgColor: 'black'}}
                _focus={{borderColor: medColor}}
                textColor={xLightColor}
                borderColor={medColor}
                borderRadius='8px'
              />
              <button
                style={{ zIndex: 2 }}
                type="button"
                className={`absolute top-1/2 transform -translate-y-1/2 right-2 inline-flex items-center rounded-md border ${borderColor} bg-black p-1.5 text-xs font-small ${textColor} hover:text-black ${hoverBgColor} focus:z-20`}
                data-clipboard-text={`https://fallenorder.xyz/approve?ids=${newList.join('+')}`}
                data-clipboard-message="Link Copied!"
                onClick={copyToClipboard}
                id="copy-link"
                data-tooltip-content="Copy Link"
              >
                <ClipboardIcon className="h-4 w-4" aria-hidden="true" />
              </button>
            </Box>
          </Center>

          {newList[0] !== '' ?
          <Center mt={8}><FullGlowButton text={!loading ? 'Approve All!' : 'Approving...'} onClick={massOptTxns} disabled={loading || idsString == ''}/></Center>
          : null}

          <Flex p={4} w='full' flexDirection="row" flexWrap="wrap" gap='24px' justifyContent='center'>
            {Object.entries(assetData).map(([id, data]: any) => (
              <AssetApproveCard key={id} assetID={parseInt(id)} name={data.name} supply={data.supply} decimals={data.decimals} unitName={data.unitName} />
            ))}
          </Flex>
        </>
      :
        <>
          <Text my='40px' className={`${gradientText} responsive-font`}>Connect Wallet</Text>
          <Center><Connect /></Center>
        </>
      }
      <Footer />
    </>
  )
}
