import { Text, useColorModeValue, Box, VStack, Image, Flex, Progress, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, HStack, ModalFooter, Center } from '@chakra-ui/react'
import { FullGlowButton } from 'components/Buttons'
import React, { useState, useEffect } from 'react'
import { algodClient, algodIndexer } from 'lib/algodClient'
import styles from '../../styles/glow.module.css'
import { getBVMShuffle1, getBVMShuffle2, getShuffle1, getShuffle2 } from 'api/backend'
import { useWallet } from '@txnlab/use-wallet'
import Connect from 'components/MainTools/Connect'
import algosdk from 'algosdk'
import toast from 'react-hot-toast'
import { motion, useAnimation } from 'framer-motion'
import { CID } from 'multiformats/cid'

const BVMShuffle: React.FC = () => {
  const { activeAddress, signTransactions, sendTransactions } = useWallet()
  const xLightColor = useColorModeValue('orange.100','cyan.100')
  const lightColor = useColorModeValue('orange.300','cyan.300')
  const [loading, setLoading] = useState<boolean>(true)
  const [claiming, setClaiming] = useState<boolean>(false)
  const [av, setAv] = useState<any>([])
  const [avImgs, setAvImgs] = useState<any>([])
  const [chosenNFT, setChosenNFT] = useState<any>(0)
  const [chosenImage, setChosenImage] = useState<any>('')
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

      const signedTransactions = await signTransactions([encodedTransaction])

      toast.loading('Sending transaction...', { id: 'txn', duration: Infinity })

      const waitRoundsToConfirm = 4

      const { id } = await sendTransactions(signedTransactions, waitRoundsToConfirm)

      console.log(`Shuffle Successful! TX ID: ${id}`)
      handleShuffle1(id)
      setShuffleID(id)
      toast.success('Shuffle Successful!', {
        id: 'txn',
        duration: 5000
      })
    } catch (error) {
      console.error(error)
      toast.error('Oops! Shuffle Payment Failed!', { id: 'txn' })
    }
  }

  const handleClaim = async () => {
    setClaiming(true)
    try {
      if (!activeAddress) {
        throw new Error('Wallet Not Connected!')
      }
  
      const suggestedParams = await algodClient.getTransactionParams().do()
      suggestedParams.fee = 1000
      suggestedParams.flatFee = true
      const note = Uint8Array.from('Fallen Order - SHUFFLE!\n\nSuccessfully Opted In!'.split("").map(x => x.charCodeAt(0)))
  
      const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                  from: activeAddress,
                  to: activeAddress,
                  amount: 0,
                  assetIndex: chosenNFT,
                  suggestedParams,
                  note,
                })

      const encodedTransaction = algosdk.encodeUnsignedTransaction(txn)

      toast.loading('Awaiting Signature...', { id: 'txn', duration: Infinity })

      const signedTransaction = await signTransactions([encodedTransaction])

      toast.loading('Claiming Shuffle...', { id: 'txn', duration: Infinity })

      algodClient.sendRawTransaction(signedTransaction).do()

      await handleSendNFT()

      onOpen()
      
      localStorage.removeItem("bvmshuffle")

      setClaiming(false)

      console.log(`Successfully Claimed!`)

      toast.success(`Shuffle Claim Successful!`, {
        id: 'txn',
        duration: 5000
      })

    } catch (error) {
      console.error(error)
      toast.error('Oops! Opt In Failed!', { id: 'txn' })
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
            for (const random  of randomFour) {
              const assetInfo = await algodIndexer.lookupAssetByID(random).do()
              console.log(assetInfo)

              const multihashBuffer = algosdk.decodeAddress(assetInfo.asset.params.reserve).publicKey
            }
            
        } catch (error: any) {
            console.log(error.message)
        } finally {
            setLoading(false)
        }
    }

    async function handleSendNFT() {
        try{
            const data = await getBVMShuffle2([activeAddress, chosenNFT, shuffleID], activeAddress)
            if (data && data.includes("Error")) {
                console.log(data)
            }
        } catch (error: any) {
            console.log(error.message)
        } finally {
            setLoading(false)
        }
    }

    async function handleShuffle1(id: any) {
            try{
                const data = await getBVMShuffle1(activeAddress, id)
                console.log(data)
                if (data && data.token && data.chosen_nft) {
                    localStorage.setItem("bvmshuffle", data.token)
                    setChosenNFT(data.chosen_nft)
                    const nftInfo = await algodClient.getAssetByID(data.chosen_nft).do()
                    setChosenImage('https://cloudflare-ipfs.com/ipfs/' + nftInfo.params.url.substring(7))
                }
            } catch (error: any) {
                console.log(error.message)
            } finally {
                setLoading(false)
            }
        }

    const controls = useAnimation()

    useEffect(() => {
        getAvFO()
        }, [loading])

  return (
    <>
    <VStack w='90%'>
    {!loading ?
        <>
            {activeAddress ?
            <>
                {!chosenNFT ?
                <>
                    <Text mt='24px' textColor={lightColor} className='text-2xl'>Available:</Text>
                    <Text textColor={xLightColor} className='text-lg whitespace-nowrap text-center'><strong className='text-xl'>{av.length}</strong>/{totalCount}</Text>
                    <Image className={boxGlow} my='24px' boxSize='200px' borderRadius='12px' alt='Fallen Order - SHUFFLE!' src='/shuffleChars.gif' />
                    <Text mt='-24px' mb='12px' textColor={lightColor} className='text-lg'>Cost: <strong className='text-xl'>{shuffle_cost}A</strong></Text>
                    <FullGlowButton text='SHUFFLE!' onClick={() => shufflePayment(shuffle_cost)} />
                </>
                :
                <>
                    <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={controls}
                    transition={{ duration: 0.3 }}
                    >
                        <Image mb='24px' className={boxGlow} boxSize='240px' borderRadius='16px' alt='Shuffled NFT' src={chosenImage} />
                        <Center><FullGlowButton text={claiming? 'Claiming...' : 'CLAIM!'} onClick={handleClaim} /></Center>
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
        <ModalHeader className={gradientText} textAlign='center' fontSize='20px' fontWeight='bold'>Congratulations</ModalHeader>
        <ModalBody>
        <VStack m={1} alignItems='center' justifyContent='center' spacing='10px'>
            <Text fontSize='14px' textAlign='center' textColor={buttonText4}>You shuffled {chosenNFT}!</Text>
            <Image my='24px' boxSize='200px' borderRadius='16px' alt='Fallen Order' src={chosenImage} />
            <a href='https://discord.gg/DPUutJfgzq' target='_blank' rel='noreferrer'><FullGlowButton text='Join Discord!' /></a>
            <FullGlowButton text='X' onClick={onClose} />
        </VStack>
        </ModalBody>
    </ModalContent>
    </Modal>
  </>
  )
}

export default BVMShuffle
