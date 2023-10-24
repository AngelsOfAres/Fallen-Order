import Head from 'next/head'
import Navbar from 'components/Navbar'
import { Center, useColorModeValue, Text, useDisclosure, Image, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, VStack, HStack, ModalFooter, Input, Box } from '@chakra-ui/react'
import styles from '../styles/glow.module.css'
import Footer from 'components/Footer'
import ManageCharacter from 'components/FallenOrder/ManageChar'
import React from 'react'
import { useWallet } from '@txnlab/use-wallet'
import Connect from 'components/MainTools/Connect'
import MyBalances from 'components/FallenOrder/components/MyBalances'
import { authenticate } from 'utils/auth'
import { FullGlowButton } from 'components/Buttons'
import { useState, useEffect } from 'react'
import useWalletBalance from 'hooks/useWalletBalance'
import getProfile from 'components/FallenOrder/components/Tools/getUserProfile'
import { algodClient } from 'lib/algodClient'
import algosdk from 'algosdk'
import toast from 'react-hot-toast'
import { createProfile, getDrip } from 'api/backend'
import { motion } from 'framer-motion'

export default function MyFO() {
  const gradientText = useColorModeValue(styles.textAnimatedGlowL, styles.textAnimatedGlowD)
  const boxGlow = useColorModeValue(styles.boxGlowL, styles.boxGlowD)
  const { activeAddress, signTransactions } = useWallet()
  const [ authUser, setAuthUser ] = useState<any>(null)
  const [ loading, setLoading ] = useState<boolean>(false)
  const [ userProfile, setUserProfile ] = useState<any>(null)
  const [ userID, setUserID ] = useState<any>(null)
  const { accountInfo, expBal } = useWalletBalance()
  const { isOpen: isOpen1, onOpen: onOpen1, onClose: onClose1 } = useDisclosure()
  const { isOpen: isOpen2, onOpen: onOpen2, onClose: onClose2 } = useDisclosure()
  const buttonText3 = useColorModeValue('orange.500','cyan.500')
  const buttonText4 = useColorModeValue('orange.200','cyan.100')
  const buttonText5 = useColorModeValue('yellow','cyan')
  const xLightColor = useColorModeValue('orange.100','cyan.100')
  const medColor = useColorModeValue('orange.500','cyan.500')

  const createUserProfile = async () => {
    setLoading(true)
    try {
      if (!activeAddress || !authUser) {
        throw new Error('Log In First Please!!')
      }

      toast.loading('Creating Profile...', { id: 'txn', duration: Infinity })

      try{
          const data = await createProfile(activeAddress, userID)
          if (data && data.includes("Error")) {
            toast.error('Oops! Profile Creation Failed!', { id: 'txn' })
            return
          }
      } catch (error: any) {
          console.log(error.message)
          toast.error('Oops! Profile Creation Failed!', { id: 'txn' })
          return
      } finally {
          setLoading(false)
      }
    } catch (error) {
      console.error(error)
      toast.error('Oops! Profile Creation Failed!', { id: 'txn' })
    }
    onClose1()
    toast.success(`Your Profile Has Been Created!`, {
      id: 'txn',
      duration: 5000
    })
    setTimeout(() => {
      fetchProfile()
      onOpen2()
    }, 5000)
  }

  const handleDrip = async () => {
    setLoading(true)
    try {
      if (!activeAddress || !authUser) {
        throw new Error('Log In First Please!!')
      }

      toast.loading('Claiming Drip...', { id: 'txn', duration: Infinity })

      try{
          const data = await getDrip(activeAddress)
          if (data && data.includes("Error")) {
            console.log(data)
          }
      } catch (error: any) {
          console.log(error.message)
          toast.error('Oops! Drip Failed!', { id: 'txn' })
          return
      } finally {
          setLoading(false)
      }
    } catch (error) {
      console.error(error)
      toast.error('Oops! Drip Failed!', { id: 'txn' })
    }
    toast.success(`Drip Successfully Claimed!`, {
      id: 'txn',
      duration: 5000
    })
    fetchProfile()
  }


  const fetchProfile = async () => {
    if (activeAddress && typeof window !== 'undefined') {        
      try {
        const profile = await getProfile(activeAddress)
        setUserProfile(profile || null)
        if (!profile) {
          onOpen1()
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
      }
      const storedAuthUser = localStorage.getItem('token_' + activeAddress)
      setAuthUser(storedAuthUser || null)  
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [accountInfo])
  

  function handleLogout() {
    localStorage.removeItem('token_' + activeAddress)
    setAuthUser(null)
  }

  async function handleLogin() {
    const token = await authenticate(activeAddress, signTransactions)
    setAuthUser(token)
  }

  const sendOptIn = async () => {
    setLoading(true)
    try {
      if (!activeAddress) {
        throw new Error('Wallet Not Connected!')
      }
  
      const suggestedParams = await algodClient.getTransactionParams().do()
      suggestedParams.fee = 1000
      suggestedParams.flatFee = true
      const note = Uint8Array.from('Abyssal Portal - Fallen Order\n\nSuccessfully Opted In!'.split("").map(x => x.charCodeAt(0)))
  
      const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                  from: activeAddress,
                  to: activeAddress,
                  amount: 0,
                  assetIndex: 811721471,
                  suggestedParams,
                  note,
                })

      const encodedTransaction = algosdk.encodeUnsignedTransaction(txn)

      toast.loading('Awaiting Signature...', { id: 'txn', duration: Infinity })

      const signedTransaction = await signTransactions([encodedTransaction])

      toast.loading('Sending transaction...', { id: 'txn', duration: Infinity })

      algodClient.sendRawTransaction(signedTransaction).do()

      console.log(`Successfully Opted In!`)

      toast.success(`Transaction Successful!`, {
        id: 'txn',
        duration: 5000
      })
      setLoading(false)
    } catch (error) {
      console.error(error)
      toast.error('Oops! Opt In Failed!', { id: 'txn' })
    }
  }
  
  return (
    <>
      <Head>
        <title>Abyssal Portal - Fallen Order</title>
        <meta name="description" content="Developed by Angels Of Ares" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      {activeAddress ?
      <>
        {!authUser ?
          <>
            <Text my='24px' className={`${gradientText} responsive-font`}>My Fallen Order</Text>
            <Center m='24px'><FullGlowButton text='Log In!' onClick={handleLogin} /></Center>
          </>
        :
        <>
            <VStack className='w-full p-6 absolute' alignItems='self-end'>
              <FullGlowButton text='Log Out' onClick={handleLogout} />
              
              <motion.div
                animate={{ scale: userProfile && userProfile.drip_timer === 0 ? [1, 1.07, 1] : 1 }}
                transition={{
                  repeat: Infinity,
                  duration: 0.75,
                  ease: "linear",
                }}>
                <FullGlowButton text='Profile' onClick={userProfile ? onOpen2 : onOpen1} />
              </motion.div>
            </VStack>
          <Text mt='56px' mb='24px' className={`${gradientText} responsive-font`}>My Fallen Order</Text>
          <MyBalances />
          <Center>
            <ManageCharacter />
          </Center>

          <Modal scrollBehavior={'outside'} size='md' isCentered isOpen={isOpen1} onClose={onClose1}>
          <ModalOverlay backdropFilter='blur(10px)'/>
          <ModalContent m='auto' alignItems='center' bgColor='black' borderWidth='1.5px' borderColor={buttonText3} borderRadius='2xl'>
              <ModalHeader className={gradientText} textAlign='center' fontSize='24px' fontWeight='bold'>Create New Profile!</ModalHeader>
              <ModalBody>
                <VStack mx={4} alignItems='center' justifyContent='center'>
                  <Text pb={4} fontSize='16px' textAlign='center' textColor={buttonText4}>This will create a new on chain user profile for your account.<br />Profiles are used to track your stats, timers, gameplay, and more.<br />They essentially act as our database, except it&apos;s on chain!</Text>
                  <Input type="text" name="userid" id="userid" maxLength={19} textAlign='center' _hover={{ bgColor: 'black' }} _focus={{ borderColor: medColor }}
                      textColor={xLightColor} borderColor={medColor} borderRadius='lg' className={`block w-full bg-black sm:text-sm`} value={userID}
                      onChange={(e) => setUserID(e.target.value)} placeholder="Discord User ID" />
                      <Text pb={4} fontSize='12px' textAlign='center' textColor={buttonText5}>*You may attach a Discord User ID later*</Text>
                  <FullGlowButton text='Let&apos;s Go!' onClick={createUserProfile} />
                </VStack>
              </ModalBody>
              <ModalFooter>
                  <FullGlowButton text='X' onClick={onClose1} />
              </ModalFooter>
          </ModalContent>
          </Modal>
          
          {userProfile ?
          <Modal scrollBehavior={'outside'} size='md' isCentered isOpen={isOpen2} onClose={onClose2}>
          <ModalOverlay backdropFilter='blur(10px)'/>
          <ModalContent m='auto' alignItems='center' bgColor='black' borderWidth='1.5px' borderColor={buttonText3} borderRadius='2xl'>
              <ModalHeader className={gradientText} textAlign='center' fontSize='24px' fontWeight='bold'>My Profile</ModalHeader>
              <ModalBody mx={4} w='full'>
                <VStack w='full' alignItems='center' justifyContent='space-between' spacing='12px'>
                  <HStack w='full' justifyContent='space-between'>
                      <Text fontSize='16px' textColor={buttonText4}>Main Character</Text>
                      {userProfile.main_character !== 0 ?
                      <>
                        <Text fontSize='20px' textColor={buttonText5}>{userProfile.mainData.Name ? userProfile.mainData.Name : userProfile.mainName}</Text>
                        <Image className={boxGlow} boxSize='48px' borderRadius='6px' alt='Main Character' src={userProfile.mainImage}/>
                      </>
                      : 
                        <FullGlowButton text='Assign' />
                      }
                  </HStack>
                  <HStack w='full' justifyContent='space-between'>
                      <Text fontSize='16px' textColor={buttonText4}>Equipped Tool</Text>
                      {userProfile.equipped_tool !== 0 ?
                      <>
                        <Box>
                          <Text ml='2px' mt='34px' position='absolute' fontSize='8px' textColor={buttonText5}>{userProfile.toolData.Uses}</Text>
                          <Image className={boxGlow} boxSize='48px' borderRadius='6px' alt='Equipped Tool' src={userProfile.toolImage}/>
                        </Box>
                      </>
                      : 
                        <FullGlowButton text='Equip' />
                      }
                  </HStack>
                  <HStack w='full' justifyContent='space-between'>
                      <Text fontSize='16px' textColor={buttonText4}>Boss Battles</Text>
                      <Text fontSize='20px' textColor={buttonText5}>{userProfile.boss_battles.split('/')[0]} | {userProfile.boss_battles.split('/')[1]}</Text>
                  </HStack>
                  <HStack w='full' justifyContent='space-between'>
                      <Text fontSize='16px' textColor={buttonText4}>Drip</Text>
                      {userProfile.drip_timer !== 0 ?
                      <>
                        <Text fontSize='20px' textColor={buttonText5}>{userProfile.time_remaining}</Text>
                      </>
                      :
                      <>
                        {expBal > -1 ?
                          <motion.div
                          animate={{ scale: [1, 1.07, 1] }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.75,
                            ease: "linear",
                          }}>
                            <FullGlowButton text={loading ? 'Dripping...' : 'DRIP!'} onClick={handleDrip} disabled={loading} />
                          </motion.div>
                          :
                          <FullGlowButton text={loading ? 'Opting...' : 'Opt In!'} onClick={sendOptIn} disabled={loading} />
                        }
                      </>
                      }
                  </HStack>
                  <HStack w='full' justifyContent='space-between'>
                      <Text fontSize='16px' textColor={buttonText4}>Total Drip</Text>
                      <Text fontSize='20px' textColor={buttonText5}>{userProfile.total_drip} $EXP</Text>
                  </HStack>
                  <HStack w='full' justifyContent='space-between'>
                      <Text fontSize='16px' textColor={buttonText4}>Kinship Subs</Text>
                      <HStack>
                        <Text fontSize='20px' textColor={buttonText5}>{userProfile.kinship_subs}</Text>
                        <FullGlowButton text='ADD' />
                      </HStack>
                  </HStack>
                </VStack>
              </ModalBody>
              <ModalFooter>
                  <FullGlowButton text='X' onClick={onClose2} />
              </ModalFooter>
          </ModalContent>
          </Modal> : null}
        </>
        }
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
