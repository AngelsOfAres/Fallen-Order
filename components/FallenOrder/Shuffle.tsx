import { Text, useColorModeValue, Box, VStack, Image, Flex, Progress, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, HStack, ModalFooter, Center } from '@chakra-ui/react'
import { FullGlowButton } from 'components/Buttons'
import React, { useState, useEffect } from 'react'
import { algodClient, algodIndexer } from 'lib/algodClient'
import styles from '../../styles/glow.module.css'
import { getShuffle1, getShuffle2 } from 'api/backend'
import { useWallet } from '@txnlab/use-wallet'
import Connect from 'components/MainTools/Connect'
import { Rank1, Rank2, Rank3, Rank4 } from '../Whitelists/FOChars'
import algosdk from 'algosdk'
import toast from 'react-hot-toast'
import { motion, useAnimation } from 'framer-motion'


const Shuffle: React.FC = () => {
  const { activeAddress, signTransactions, sendTransactions } = useWallet()
  const xLightColor = useColorModeValue('orange.100','cyan.100')
  const lightColor = useColorModeValue('orange.300','cyan.300')
  const [loading, setLoading] = useState<boolean>(true)
  const [claiming, setClaiming] = useState<boolean>(false)
  const [avFO, setAvFO] = useState<any>([])
  const [chosenFO, setChosenFO] = useState<any>(0)
  const [chosenFOImage, setChosenFOImage] = useState<any>('')
  const [charInfo, setCharInfo] = useState<any>([])
  const [shuffleID, setShuffleID] = useState<any>('')
  const [FOList, setFOList] = useState<any>([])
  const [FOImages, setFOImages] = useState<any>([])
  const progress = useColorModeValue('linear(to-r, orange, red)', 'linear(to-r, purple.600, cyan)')
  const buttonText5 = useColorModeValue('yellow','cyan')
  const buttonText3 = useColorModeValue('orange.500', 'cyan.500')
  const buttonText4 = useColorModeValue('orange.100', 'cyan.100')
  const gradientText = useColorModeValue(styles.textAnimatedGlowL, styles.textAnimatedGlowD)
  const boxGlow = useColorModeValue(styles.boxGlowL, styles.boxGlowD)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const shuffle_cost = 250
  const reshuffle_cost = 50

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
        to: 'CHARX2GZKNZZORNV2WROPUTSB5QBVRIC62QXXLABFCKA2QALEA3OHVIDYA',
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
                  assetIndex: chosenFO,
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
      
      localStorage.removeItem("shuffle")
      localStorage.removeItem("reshuffle")

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
            const shuffle_info = await algodIndexer.lookupAccountAssets('GOT2KEIKQHXVTS5WMIWVCTC4K5HPAYSX6D5FTK5QOEOSVDUYJLHEVYYMYE').do()
            let ranks: any = [[], [], [], []]
            for (const item of shuffle_info.assets) {
                const assetID = item['asset-id']
                if (item.amount > 0) {
                    if (Rank1.includes(assetID)) {
                        ranks[0].push(assetID)
                    }
                    if (Rank2.includes(assetID)) {
                        ranks[1].push(assetID)
                    }
                    if (Rank3.includes(assetID)) {
                        ranks[2].push(assetID)
                    }
                    if (Rank4.includes(assetID)) {
                        ranks[3].push(assetID)
                    }
                }
            }
            setAvFO([ranks[0], ranks[1], ranks[2], ranks[3]])
        } catch (error: any) {
            console.log(error.message)
        } finally {
            setLoading(false)
        }
    }

    async function handleSendNFT() {
        try{
            const data = await getShuffle2([activeAddress, chosenFO, shuffleID])
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
                const data = await getShuffle1([activeAddress, id])
                if (data && data.includes("Error")) {
                    console.log(data)
                } else {
                    localStorage.setItem("shuffle", data.token)
                    setFOList(data.chosen_fo)
                    let images = []
                    for (const fo in data.chosen_fo) {
                        const foInfo = await algodClient.getAssetByID(parseInt(fo)).do()
                        images.push('https://cloudflare-ipfs.com/ipfs/' + foInfo.params.url.substring(7))
                    }
                    setFOImages(images)
                }
            } catch (error: any) {
                console.log(error.message)
            } finally {
                setLoading(false)
            }
        }

    async function handleReshuffle(id: any) {
        setFOList([])
        setFOImages([])
        try{
            const data = await getShuffle1([activeAddress, id, shuffleID])
            if (data && data.includes("Error")) {
                console.log(data)
            } else {
                setFOList(data.chosen_fo)
                let images = []
                for (const fo in data.chosen_fo) {
                    const foInfo = await algodClient.getAssetByID(parseInt(fo)).do()
                    images.push('https://cloudflare-ipfs.com/ipfs/' + foInfo.params.url.substring(7))
                }
                setFOImages(images)
            }
        } catch (error: any) {
            console.log(error.message)
        } finally {
            setLoading(false)
        }
    }

    async function fetchChar (index: any) {
        try {
            const foInfo = await algodClient.getAssetByID(FOList[index]).do()
            setCharInfo([foInfo.params['unit-name'], 'https://cloudflare-ipfs.com/ipfs/' + foInfo.params.url.substring(7)])
        } catch (error: any) {
            console.log(error.message)
        }
    }

    const controls = useAnimation()

    const handleSelect = (index: any) => {
        controls.start({ opacity: 0, scale: 0 })
        setTimeout(() => {
            if (index === 999) {
                setChosenFO(0)
                setChosenFOImage('')
            } else {
                setChosenFO(FOList[index])
                setChosenFOImage(FOImages[index])
                fetchChar(FOList[index])
            }
            controls.start({ opacity: 1, scale: 1 })
        }, 300)
    }

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
                {FOList.length === 0 ?
                <>
                    <Text mt='24px' textColor={lightColor} className='text-2xl'>Available:</Text>
                    <Text textColor={xLightColor} className='text-lg whitespace-nowrap text-center'>R1: <strong className='text-xl'>{avFO[0].length}</strong> | R2: <strong className='text-xl'>{avFO[1].length}</strong> | R3: <strong className='text-xl'>{avFO[2].length}</strong> | R4: <strong className='text-xl'>{avFO[3].length}</strong></Text>
                    <Image my='24px' boxSize='200px' borderRadius='10px' alt='Fallen Order - SHUFFLE!' src='/shuffleChars.gif' />
                    <Text mt='-24px' mb='12px' textColor={lightColor} className='text-lg'>Cost: <strong className='text-xl'>{shuffle_cost}A</strong></Text>
                    <FullGlowButton text='SHUFFLE!' onClick={() => shufflePayment(shuffle_cost)} />
                </>
                :
                <>
                    {chosenFO === 0 ?
                    <>
                        <Text my='24px' textColor={lightColor} className='text-2xl'>Pick A Character</Text>
                    <motion.div
                      initial={{ opacity: 1, scale: 1 }}
                      animate={controls}
                      transition={{ duration: 0.3 }}
                    >
                        <Flex mb='24px' flexDirection="row" flexWrap="wrap" justifyContent='center' gap='24px'>
                            <Image className={boxGlow} boxSize='120px' borderRadius='12px' alt='Character 1' src={FOImages[0]} onClick={() => handleSelect(0)}/>
                            <Image className={boxGlow} boxSize='120px' borderRadius='12px' alt='Character 2' src={FOImages[1]} onClick={() => handleSelect(1)}/>
                        </Flex>
                        <Flex my='24px' flexDirection="row" flexWrap="wrap" justifyContent='center' gap='24px'>
                            <Image className={boxGlow} boxSize='120px' borderRadius='12px' alt='Character 3' src={FOImages[2]} onClick={() => handleSelect(2)}/>
                            <Image className={boxGlow} boxSize='120px' borderRadius='12px' alt='Character 4' src={FOImages[3]} onClick={() => handleSelect(3)}/>
                        </Flex>
                        <Text my='12px' textAlign='center' textColor={lightColor} className='text-lg'>Select Character or RESHUFFLE!</Text>
                        <Center><FullGlowButton text='RESHUFFLE! (50A)' onClick={() => handleReshuffle(reshuffle_cost)} /></Center>
                    </motion.div>
                    </>
                    :
                    <>
                        <Text my='24px' textColor={lightColor} className='text-2xl'>Click Character To Deselect...</Text>
                        <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={controls}
                        transition={{ duration: 0.3 }}
                        >
                            <Image mb='24px' className={boxGlow} boxSize='240px' borderRadius='16px' alt='Selected Character' src={chosenFOImage} onClick={() => handleSelect(999)}/>
                            <Center><FullGlowButton text={claiming? 'Claiming...' : 'CLAIM!'} onClick={handleClaim} /></Center>
                        </motion.div>
                    </>
                    }
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
            <Text fontSize='14px' textAlign='center' textColor={buttonText4}>Welcome to the Fallen Order!</Text>
            <Text fontSize='14px' textAlign='center' textColor={buttonText4}>You shuffled {charInfo[0]}!</Text>
            <Image my='24px' boxSize='200px' borderRadius='16px' alt='Fallen Order' src={charInfo[1]} />
            <a href='https://discord.gg/DPUutJfgzq' target='_blank' rel='noreferrer'><FullGlowButton text='Join Discord!' /></a>
            <FullGlowButton text='X' onClick={onClose} />
        </VStack>
        </ModalBody>
    </ModalContent>
    </Modal>
  </>
  )
}

export default Shuffle
