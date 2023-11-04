import { Text, useColorModeValue, Box, VStack, Image, Progress, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, HStack, Center } from '@chakra-ui/react'
import { FullGlowButton } from 'components/Buttons'
import React, { useState, useEffect } from 'react'
import { algodClient, algodIndexer } from 'lib/algodClient'
import styles from '../../styles/glow.module.css'
import { getBVMShuffle1, getBVMShuffle2 } from 'api/backend'
import { useWallet } from '@txnlab/use-wallet'
import Connect from 'components/MainTools/Connect'
import algosdk from 'algosdk'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { getIpfsFromAddress } from './components/Tools/getIPFS'
import createGifFromImages from './components/Tools/makeGIF'

const TestShuffle: React.FC = () => {
  const { activeAddress, signTransactions } = useWallet()
  const xLightColor = useColorModeValue('orange.100','cyan.100')
  const lightColor = useColorModeValue('orange.300','cyan.300')
  const [loading, setLoading] = useState<boolean>(true)
  const [claiming, setClaiming] = useState<boolean>(false)
  const [av, setAv] = useState<any>([])
  const [avImgs, setAvImgs] = useState<any>(null)
  const [gifDataUrl, setGifDataUrl] = useState<string | null>(null)
  const [chosenNFT, setChosenNFT] = useState<any>(0)
  const [chosenImage, setChosenImage] = useState<any>('')
  const [chosenName, setChosenName] = useState<any>('')
  const [shuffleID, setShuffleID] = useState<any>('')
  const progress = useColorModeValue('linear(to-r, orange, red)', 'linear(to-r, purple.600, cyan)')
  const buttonText5 = useColorModeValue('yellow','cyan')
  const buttonText3 = useColorModeValue('orange.500', 'cyan.500')
  const buttonText4 = useColorModeValue('orange.100', 'cyan.100')
  const gradientText = useColorModeValue(styles.textAnimatedGlowL, styles.textAnimatedGlowD)
  const boxGlow = useColorModeValue(styles.boxGlowL, styles.boxGlowD)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const shuffle_cost = 0.1
  const shuffleEscrow = 'GCMHWUCQM75DQCEOV5UVEMR7Z2LYJERHLOKI355BNNNTCIHSASHAAFUO7I'
  const totalCount = 1000

  function pickFourRandomEntries(list: any) {
    if (list.length < 4) {
      throw new Error("List must contain at least 4 entries.")
    }
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]]
    }
    return list.slice(0, 4)
  }

  const shufflePayment = async (amt: any) => {
    try {
      if (!activeAddress) {
        throw new Error('Wallet Not Connected!')
      }
      const note = Uint8Array.from(`Fallen Order - SHUFFLE!\n\n${shuffleID}`.split("").map(x => x.charCodeAt(0)))
      const suggestedParams = await algodClient.getTransactionParams().do()
      suggestedParams.fee = 1000
      suggestedParams.flatFee = true
      const transaction = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: activeAddress,
        to: shuffleEscrow,
        amount: amt*1000000,
        suggestedParams,
        note
      })

      const encodedTransaction = algosdk.encodeUnsignedTransaction(transaction)

      toast.loading('Awaiting Signature...', { id: 'txn', duration: Infinity })

      const sTxn = await signTransactions([encodedTransaction])

      handleShuffle1(sTxn[0])
    } catch (error) {
      console.error(error)
      toast.error('Oops! Shuffle Payment Failed!', { id: 'txn' })
    }
  }
  
  async function getAvFO() {
    try{
        const shuffle_info = await algodIndexer.lookupAccountAssets(shuffleEscrow).do()
        let available_nfts = []
        for (const item of shuffle_info.assets) {
            const assetID = item['asset-id']
            if (item.amount > 0) {
                available_nfts.push(assetID)
            }
        }
        setAv(available_nfts)

        const randomFour = pickFourRandomEntries(available_nfts)
        let images: any = []
        for (const random  of randomFour) {
          const assetInfo = await algodIndexer.lookupAssetByID(random).do()
          const cid = getIpfsFromAddress(assetInfo.asset.params)
          if (cid) {
            const response = await fetch(`https://ipfs.algonode.xyz/ipfs/${cid}`)
            if (!response.ok) {
              throw new Error(`Failed to fetch data from IPFS: ${response.status} ${response.statusText}`)
            }
            if (assetInfo.asset.params.url.includes('template')) {
              const textData = await response.text()
              images.push('https://ipfs.algonode.xyz/ipfs/' + JSON.parse(textData).image.substring(7))
            } else {
              images.push('https://ipfs.algonode.xyz/ipfs/' + cid)
            }
          }
        }
        setAvImgs(images)
        const createGif = () => {
          createGifFromImages(images, (dataUrl) => {
            if (dataUrl) {
              setGifDataUrl(dataUrl)
            }
          })
        }
        createGif()

    } catch (error: any) {
        console.log(error.message)
    } finally {
      setLoading(false)
    }
  }

    async function handleSendNFT() {
      setClaiming(true)
        try{
            const data = await getBVMShuffle2(activeAddress, [chosenNFT, shuffleID])
            if (data && data.message && data.unsignedGroup) {
                console.log(data)
                let finalGroup = []
                for (const txn of data.unsignedGroup) {
                    finalGroup.push(new Uint8Array(Object.values(txn)))
                }
                try {
                  toast.loading(`Claiming NFT...`, { id: 'txn', duration: Infinity })

                  const signedTransactions = await signTransactions(finalGroup)

                  await algodClient.sendRawTransaction(signedTransactions).do()

                  onOpen()
                  getAvFO()
                  localStorage.removeItem("bvmshuffle")
            
                  toast.success(`Shuffle Claim Successful!`, {
                    id: 'txn',
                    duration: 5000
                  })
                } catch (error: any) {
                  console.log(error)
                }
            } else {
              console.log(data)
            }
        } catch (error: any) {
            console.log(error.message)
        } finally {
          setClaiming(false)
        }
    }

    async function handleClose() {
      setChosenNFT(0)
      setChosenName('')
      setChosenImage('')
      onClose()
  }

    async function handleShuffle1(stxn: any) {
      setClaiming(true)
      try{
          const data = await getBVMShuffle1(activeAddress, JSON.stringify(stxn))
          if (data && data.token && data.chosen_nft) {
              localStorage.setItem("bvmshuffle", data.token)
              const assetInfo = await algodIndexer.lookupAssetByID(data.chosen_nft).do()
              const cid = getIpfsFromAddress(assetInfo.asset.params)
              if (cid) {
                const response = await fetch(`https://ipfs.algonode.xyz/ipfs/${cid}`)
                if (!response.ok) {
                  throw new Error(`Failed to fetch data from IPFS: ${response.status} ${response.statusText}`)
                }
                if (assetInfo.asset.params.url.includes('template')) {
                    const textData = await response.text()
                    setChosenImage('https://ipfs.algonode.xyz/ipfs/' + JSON.parse(textData).image.substring(7))
                } else {
                    setChosenImage('https://ipfs.algonode.xyz/ipfs/' + cid)
                }
                setShuffleID(data.txId)
                setChosenNFT(data.chosen_nft)
                setChosenName(assetInfo.asset.params.name)
              }
          }
      } catch (error: any) {
          console.log(error.message)
      } finally {
        setClaiming(false)
      }
  }

    useEffect(() => {
      getAvFO()
    }, [loading, claiming, isOpen])

  return (
    <>
    <VStack w='90%'>
    {!loading ?
        <>
            {activeAddress ?
            <>
                {!chosenNFT ?
                <>
                  <HStack mt='24px'>
                      <Text textColor={lightColor} className='text-xl'>Available:</Text>
                      <Text textColor={xLightColor} className='text-xl whitespace-nowrap text-center'><strong className='text-2xl'>{av.length}</strong>/{totalCount}</Text>
                    </HStack>
                      <Image className={boxGlow} my='24px' boxSize='200px' borderRadius='12px' alt='Fallen Order - SHUFFLE!' src={gifDataUrl ? gifDataUrl : avImgs[0]} />
                    <Text mt='-12px' mb='12px' textColor={lightColor} className='text-lg'>Cost: <strong className='text-xl'>{shuffle_cost}A</strong></Text>
                    <FullGlowButton text={loading ? 'SHUFFLING...' : 'SHUFFLE!'} onClick={() => shufflePayment(shuffle_cost)} disabled={claiming} />
                </>
                :
                <>
                    <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    >
                        <Text mt='24px' textAlign='center' className={gradientText} fontSize='20px'>{chosenName}</Text>
                        <Image my='24px' className={boxGlow} boxSize='240px' borderRadius='16px' alt='Shuffled NFT' src={chosenImage} />
                        <Center><FullGlowButton text={claiming ? 'Claiming...' : 'CLAIM!'} onClick={handleSendNFT} disabled={claiming}/></Center>
                    </motion.div>
                </>
                }
            </>
            :
            <Connect />
            }
        </>
    :
    <>
        <Text mb={-4} textColor={xLightColor} align={'center'} className='pt-4 text-sm'>Loading Shuffle...</Text>
        <Box w='250px' my='24px'>
            <Progress size='xs' bgGradient={progress} colorScheme={buttonText5} isIndeterminate borderRadius='xl'/>
        </Box>
    </>
    }
    </VStack>

    <Modal scrollBehavior={'outside'} size='md' isCentered isOpen={isOpen} onClose={onClose}>
    <ModalOverlay backdropFilter='blur(10px)'/>
    <ModalContent m='auto' alignItems='center' bgColor='black' borderWidth='1.5px' borderColor={buttonText3} borderRadius='2xl'>
        <ModalHeader className={gradientText} textAlign='center' fontSize='24px' fontWeight='bold'>Congratulations!</ModalHeader>
        <ModalBody>
        <VStack m={2} alignItems='center' justifyContent='center' spacing='10px'>
            <Text fontSize='14px' textAlign='center' textColor={buttonText4}>You shuffled...</Text>
            <Text fontSize='20px' textAlign='center' className={gradientText}>{chosenName}</Text>
            <a href={'https://www.nftexplorer.app/asset/' + chosenNFT} target='_blank' rel='noreferrer'><Image className={boxGlow} mb='24px' boxSize='200px' borderRadius='16px' alt='Fallen Order' src={chosenImage} /></a>
            <a href='https://discord.gg/DPUutJfgzq' target='_blank' rel='noreferrer'><FullGlowButton text='Join Discord!' /></a>
            <FullGlowButton text='X' onClick={handleClose} />
        </VStack>
        </ModalBody>
    </ModalContent>
    </Modal>
  </>
  )
}

export default TestShuffle