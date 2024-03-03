import { Text, useColorModeValue, Box, VStack, Image, Progress, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, HStack, Center, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Tooltip } from '@chakra-ui/react'
import { FullGlowButton, IconGlowButton2 } from 'components/Buttons'
import React, { useState, useEffect, useCallback } from 'react'
import { algodClient, algodIndexer } from 'lib/algodClient'
import styles from '../../styles/glow.module.css'
import { getShuffle1, getShuffle2 } from 'api/backend'
import { useWallet } from '@txnlab/use-wallet'
import Connect from 'components/MainTools/Connect'
import algosdk from 'algosdk'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Rank1, Rank2, Rank3, Rank4, Rank5 } from '../Whitelists/FOChars'
import { getIpfsFromAddress } from './components/Tools/getIPFS'
import createGifFromImages from './components/Tools/makeGIF'
import { GiRollingDices } from 'react-icons/gi'

const Shuffle: React.FC = () => {
  const { activeAddress, signTransactions } = useWallet()
  const xLightColor = useColorModeValue('orange.100','cyan.100')
  const lightColor = useColorModeValue('orange.300','cyan.300')
  const [loading, setLoading] = useState<boolean>(true)
  const [claiming, setClaiming] = useState<boolean>(false)
  const [av, setAv] = useState<any>([])
  const [avFO, setAvFO] = useState<any>([])
  const [avImgs, setAvImgs] = useState<any>(null)
  const [amount, setAmount] = useState<number>(1)
  const [gifDataUrl, setGifDataUrl] = useState<string | null>(null)
  const [chosenNFT, setChosenNFT] = useState<any>(null)
  const [chosenImage, setChosenImage] = useState<any>(null)
  const [chosenName, setChosenName] = useState<any>(null)
  const [shuffleID, setShuffleID] = useState<any>('')
  const progress = useColorModeValue('linear(to-r, orange, red)', 'linear(to-r, purple.600, cyan)')
  const buttonText5 = useColorModeValue('yellow','cyan')
  const buttonText3 = useColorModeValue('orange.500', 'cyan.500')
  const buttonText4 = useColorModeValue('orange.100', 'cyan.100')
  const gradientText = useColorModeValue(styles.textAnimatedGlowL, styles.textAnimatedGlowD)
  const boxGlow = useColorModeValue(styles.boxGlowL, styles.boxGlowD)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const shuffle_cost = 300
  const shuffleEscrow = 'GOT2KEIKQHXVTS5WMIWVCTC4K5HPAYSX6D5FTK5QOEOSVDUYJLHEVYYMYE'
  const claimToken = localStorage.getItem("shuffle")

  const pickFourRandomEntries = useCallback((list: any) => {
    if (list.length < 4) {
      throw new Error("List must contain at least 4 entries.")
    }
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]]
    }
    return list.slice(0, 4)
  }, [])

  const shufflePayment = async () => {
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
        amount: shuffle_cost*1000000*amount,
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
  
  const getAvFO = useCallback(async () => {
    try{
        const shuffle_info = await algodIndexer.lookupAccountAssets(shuffleEscrow).do()
        let available_nfts = []
        let ranks: any = [[], [], [], [], []]
        for (const item of shuffle_info.assets) {
            const assetID = item['asset-id']
            if (item.amount > 0) {
                available_nfts.push(assetID)

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
                if (Rank5.includes(assetID)) {
                    ranks[4].push(assetID)
                }
            }
        }
        setAv(available_nfts)
        setAvFO([ranks[0], ranks[1], ranks[2], ranks[3], ranks[4]])

        const randomFour = pickFourRandomEntries(available_nfts)
        let images: any = []
        for (const random  of randomFour) {
          const assetInfo = await algodIndexer.lookupAssetByID(random).do()
          const cid = getIpfsFromAddress(assetInfo.asset.params)
          if (cid) {
            const response = await fetch(`https://gateway.ipfs.io/ipfs/${cid}`)
            if (!response.ok) {
              throw new Error(`Failed to fetch data from IPFS: ${response.status} ${response.statusText}`)
            }
            if (assetInfo.asset.params.url.includes('template')) {
              const textData = await response.text()
              images.push('https://gateway.ipfs.io/ipfs/' + JSON.parse(textData).image.substring(7))
            } else {
              images.push('https://gateway.ipfs.io/ipfs/' + cid)
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
  }, [setAv, setAvFO, setLoading, pickFourRandomEntries])


    async function handleSendNFT() {
      setClaiming(true)
        try{
            toast.loading(`Claiming NFT...`, { id: 'txn', duration: Infinity })
            const data = await getShuffle2(activeAddress)
            if (data && data.message && data.unsignedGroup) {
                console.log(data)
                let finalGroup = []
                for (const txn of data.unsignedGroup) {
                    finalGroup.push(new Uint8Array(Object.values(txn)))
                }

                const signedTransactions = await signTransactions(finalGroup)

                try {
                  await algodClient.sendRawTransaction(signedTransactions).do()
                  onOpen()
                  getAvFO()
                  localStorage.removeItem("shuffle")
            
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
          const data = await getShuffle1(activeAddress, JSON.stringify(stxn), amount)
          if (data && data.token && data.chosen_nfts) {
              localStorage.setItem("shuffle", data.token)
              let images: any = []
              let names: any = ''
              for (const choice of data.chosen_nfts) {
                const assetInfo = await algodIndexer.lookupAssetByID(choice).do()
                const cid = getIpfsFromAddress(assetInfo.asset.params)
                if (cid) {
                  const response = await fetch(`https://gateway.ipfs.io/ipfs/${cid}`)
                  if (!response.ok) {
                    throw new Error(`Failed to fetch data from IPFS: ${response.status} ${response.statusText}`)
                  }
                  if (assetInfo.asset.params.url.includes('template')) {
                      const textData = await response.text()
                      images.push('https://gateway.ipfs.io/ipfs/' + JSON.parse(textData).image.substring(7))
                  } else {
                      images.push('https://gateway.ipfs.io/ipfs/' + cid)
                  }
                }
                names += assetInfo.asset.params.name + '\n'
              }
              setShuffleID(data.txId)
              setChosenNFT(data.chosen_nfts)

              const creatChosenGif = () => {
                createGifFromImages(images, (dataUrl) => {
                  if (dataUrl) {
                    setChosenImage(dataUrl)
                  }
                })
              }
              creatChosenGif()

              setChosenName(names)
          }
      } catch (error: any) {
          console.log(error.message)
      } finally {
        setClaiming(false)
      }
  }

  const clearToken = async () => {
    localStorage.removeItem("shuffle")
    location.reload()
  }

  useEffect(() => {
    getAvFO()
  }, [loading, claiming, isOpen, getAvFO])

  return (
    <>
    <VStack w='90%'>
    {!loading ?
        <>
            {activeAddress ?
            <>
            {claimToken && !chosenNFT ?
              <>
                <Text mt='24px' textAlign='center' textColor={buttonText4} fontSize='20px'>Seems You Missed Something...</Text>
                <Text mb='24px' textAlign='center' textColor={buttonText4} fontSize='20px'>Click To Claim!</Text>
                <Center><FullGlowButton text={claiming ? 'Claiming...' : 'CLAIM!'} onClick={handleSendNFT} disabled={claiming}/></Center>
                <Text mt='60px' textAlign='center' textColor={buttonText4} fontSize='20px'>Click below to clear and return to shuffle. ONLY use this if you have already claimed your assets!</Text>
                <Center my='12px'><FullGlowButton text={'CLEAR'} onClick={clearToken} /></Center>
              </>
            :
              <>
                {!chosenNFT ?
                <>
                  <HStack mt='24px'>
                      <Text textColor={lightColor} className='text-xl'>Available:</Text>
                      <Text textColor={xLightColor} className='text-xl whitespace-nowrap text-center'><strong className='text-2xl'>{av.length}</strong></Text>
                    </HStack>
                    <Text textColor={xLightColor} className='text-lg whitespace-nowrap text-center'>R1: <strong className='text-xl'>{avFO[0].length}</strong> | R2: <strong className='text-xl'>{avFO[1].length}</strong> | R3: <strong className='text-xl'>{avFO[2].length}</strong> | R4: <strong className='text-xl'>{avFO[3].length}</strong> | R5: <strong className='text-xl'>{avFO[4].length}</strong></Text>
                      <Image className={boxGlow} my='24px' boxSize='200px' borderRadius='12px' alt='Fallen Order - SHUFFLE!' src={gifDataUrl ? gifDataUrl : avImgs[0]} />
                    <Text mt='-12px' mb='12px' textColor={lightColor} className='text-lg'>Cost: <strong className='text-xl'>{shuffle_cost}A</strong></Text>
                    <HStack mb={5} spacing='12px'>
                      <NumberInput textAlign='center' w='75px' min={0} max={6} value={amount} onChange={(valueString) => setAmount(parseInt(valueString))} isInvalid={amount <= 0 || amount > 6}>
                      <NumberInputField _hover={{ bgColor: 'black' }} _focus={{ borderColor: buttonText3 }} textColor={xLightColor} borderColor={buttonText3} className={`block rounded-none rounded-l-md bg-black sm:text-sm`}/>
                      <NumberInputStepper>
                          <NumberIncrementStepper _hover={{ textColor: buttonText3 }} textColor={lightColor} borderColor={buttonText3}/>
                          <NumberDecrementStepper _hover={{ textColor: buttonText3 }} textColor={lightColor} borderColor={buttonText3}/>
                      </NumberInputStepper>
                      </NumberInput>
                      <Tooltip py={1} px={2} borderWidth='1px' borderRadius='lg' arrowShadowColor={buttonText5} borderColor={buttonText3} bgColor='black' textColor={buttonText4} fontSize='16px' fontFamily='Orbitron' textAlign='center' hasArrow label={`${amount}X SHUFFLE!`} aria-label='Tooltip'>
                        <div><IconGlowButton2 icon={GiRollingDices} onClick={() => shufflePayment()} disabled={claiming} /></div>
                      </Tooltip>
                    </HStack>
                </>
                :
                <>
                    <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    >
                        <Text mt='24px' textAlign='center' className={gradientText} fontSize='20px'>{chosenName}</Text>
                        <Center><Image my='24px' className={boxGlow} boxSize='240px' borderRadius='16px' alt='Shuffled NFTs' src={chosenImage} /></Center>
                        <Center><FullGlowButton text={claiming ? 'Claiming...' : 'CLAIM!'} onClick={handleSendNFT} disabled={claiming}/></Center>
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
        <ModalHeader className={gradientText} textAlign='center' fontSize='24px' fontWeight='bold'>Congratulations!</ModalHeader>
        <ModalBody>
        <VStack m={2} alignItems='center' justifyContent='center' spacing='10px'>
          {!chosenImage ?
            <>
              <Text fontSize='14px' textAlign='center' textColor={buttonText4}>You shuffled...</Text>
              <Text fontSize='20px' textAlign='center' className={gradientText}>{chosenName}</Text>
              <a href={'https://www.nftexplorer.app/asset/' + chosenNFT} target='_blank' rel='noreferrer'><Image className={boxGlow} mb='24px' boxSize='200px' borderRadius='16px' alt='Fallen Order' src={chosenImage} /></a>
              <a href='https://discord.gg/DPUutJfgzq' target='_blank' rel='noreferrer'><FullGlowButton text='Join Discord!' /></a>
              <FullGlowButton text='X' onClick={handleClose} />
            </>
            :
            <>
              <Text fontSize='14px' textAlign='center' textColor={buttonText4}>Shuffle Claimed</Text>
              <a href={'https://www.nftexplorer.app/asset/' + chosenNFT} target='_blank' rel='noreferrer'><Image className={boxGlow} mb='24px' boxSize='200px' borderRadius='16px' alt='Fallen Order' src={chosenImage} /></a>
              <a href='https://discord.gg/DPUutJfgzq' target='_blank' rel='noreferrer'><FullGlowButton text='Join Discord!' /></a>
              <FullGlowButton text='X' onClick={handleClose} />
            </>
          }
        </VStack>
        </ModalBody>
    </ModalContent>
    </Modal>
  </>
  )
}

export default Shuffle