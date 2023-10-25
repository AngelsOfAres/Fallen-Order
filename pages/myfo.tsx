import Head from 'next/head'
import Navbar from 'components/Navbar'
import { Center, useColorModeValue, Text, useDisclosure, Image, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, VStack, HStack, ModalFooter, Input, Box, Tooltip, Flex } from '@chakra-ui/react'
import styles from '../styles/glow.module.css'
import Footer from 'components/Footer'
import ManageCharacter from 'components/FallenOrder/ManageChar'
import React from 'react'
import { useWallet } from '@txnlab/use-wallet'
import Connect from 'components/MainTools/Connect'
import MyBalances from 'components/FallenOrder/components/MyBalances'
import { authenticate } from 'utils/auth'
import { FullGlowButton, IconGlowButton } from 'components/Buttons'
import { useState, useEffect } from 'react'
import useWalletBalance from 'hooks/useWalletBalance'
import getProfile from 'components/FallenOrder/components/Tools/getUserProfile'
import { algodClient, algodIndexer } from 'lib/algodClient'
import algosdk from 'algosdk'
import { SuccessPopup } from '../components/FallenOrder/components/Popups/Success'
import toast from 'react-hot-toast'
import { createProfile, equipTool, getDrip } from 'api/backend'
import { motion } from 'framer-motion'
import { MdOutlineAdd } from 'react-icons/md'
import { WrenchScrewdriverIcon } from '@heroicons/react/20/solid'
import { hatchets, pickaxes, woodenHatchetImg, ironPickaxeImg } from 'components/Whitelists/FOTools'

export default function MyFO() {
  const gradientText = useColorModeValue(styles.textAnimatedGlowL, styles.textAnimatedGlowD)
  const boxGlow = useColorModeValue(styles.boxGlowL, styles.boxGlowD)
  const allTools = [...hatchets, ...pickaxes]
  const { activeAddress, signTransactions } = useWallet()
  const [ authUser, setAuthUser ] = useState<any>(null)
  const [ loading, setLoading ] = useState<boolean>(false)
  const [ userProfile, setUserProfile ] = useState<any>(null)
  const [ userID, setUserID ] = useState<any>(null)
  const { accountInfo, expBal, assetList } = useWalletBalance()
  const [popTitle, setPopTitle] = useState<any>('')
  const [popMessage, setPopMessage] = useState<any>('')
  const [tool, setTool] = useState<any>(null)
  const [toolList, setToolList] = useState<any>([])
  const { isOpen: isOpen1, onOpen: onOpen1, onClose: onClose1 } = useDisclosure()
  const { isOpen: isOpen2, onOpen: onOpen2, onClose: onClose2 } = useDisclosure()
  const { isOpen: isOpen3, onOpen: onOpen3, onClose: onClose3 } = useDisclosure()
  const { isOpen: isSuccessOpen, onOpen: onSuccessOpen, onClose: onSuccessClose } = useDisclosure()
  const buttonText3 = useColorModeValue('orange.500','cyan.500')
  const buttonText4 = useColorModeValue('orange.200','cyan.100')
  const buttonText5 = useColorModeValue('orange','cyan')
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

  useEffect(() => {
    if (assetList && assetList.length > 0) {
      const availableTools = assetList
        .filter((item: any) => allTools.includes(item['asset-id']))
        .map((item: any) => item['asset-id'])
        .map(async (id: any) => {
          const assetInfo = await algodIndexer.lookupAssetByID(id).do()
          return assetInfo
        })

      Promise.all(availableTools)
        .then((results) => {
          setToolList(results)
          console.log(results)
        })
        .catch((error) => {
          console.error('An error occurred:', error)
        })
    }
  }, [assetList])
  

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

  
    const handleEquipTool = async () => {
        setLoading(true)
        try {
            if (!activeAddress) {
            throw new Error('Log In First Please!!')
            }

            toast.loading('Equipping Tool...', { id: 'txn', duration: Infinity })

            try{
                const data = await equipTool(activeAddress, tool.asset.index)
                if (data && data.includes("Error")) {
                console.log(data)
                toast.error('Oops! Tool Equip Failed!', { id: 'txn' })
                return
                }
            } catch (error: any) {
                console.log(error.message)
                toast.error('Oops! Tool Equip Failed!', { id: 'txn' })
                return
            } finally {
                setLoading(false)
            }
        } catch (error) {
            console.error(error)
            toast.error('Oops! Tool Equip Failed!', { id: 'txn' })
            return
        }
        toast.success(`Tool Equipped Successfully!`, {
            id: 'txn',
            duration: 5000
        })
        setPopTitle('Success')
        setPopMessage('New Tool Equipped!')
        onSuccessOpen()
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
          <Modal scrollBehavior={'outside'} size='xl' isCentered isOpen={isOpen2} onClose={onClose2}>
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
                      <Text fontSize='20px' textColor={buttonText5}>-</Text>
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
                      <>
                        {toolList.length === 0 ?
                          <>
                            <a href='https://www.nftexplorer.app/sellers/fallen-order-accessories'><FullGlowButton text='Get Tools!' /></a>
                          </>
                        : 
                          <>
                            <Tooltip ml={6} py={1} px={2} borderWidth='1px' borderRadius='lg' arrowShadowColor={buttonText5} borderColor={buttonText3} bgColor='black' textColor={buttonText4} fontSize='12px' fontFamily='Orbitron' textAlign='center' hasArrow label={'Equip Tool!'} aria-label='Tooltip'>
                              <IconGlowButton icon={WrenchScrewdriverIcon} onClick={onOpen3} />
                            </Tooltip>

                            <Modal scrollBehavior={'outside'} size='md' isCentered isOpen={isOpen3} onClose={onClose3}>
                            <ModalOverlay backdropFilter='blur(10px)'/>
                            <ModalContent m='auto' alignItems='center' bgColor='black' borderWidth='1.5px' borderColor={buttonText3} borderRadius='2xl'>
                              <ModalHeader className={gradientText} textAlign='center' fontSize='24px' fontWeight='bold'>Equip Tool</ModalHeader>
                              <ModalBody px={4} w='full'>
                                <VStack w='full' alignItems='center' justifyContent='center'>
                                  <Text pb={6} fontSize='16px' textAlign='center' textColor={buttonText4}>Current: {userProfile.toolName ? userProfile.toolName : '-'}</Text>
                                  <Flex mb={4} w='full' flexDirection="row" flexWrap="wrap" gap='24px' justifyContent='center'>
                                    {toolList.map((asset: any, index: any) => (
                                        <VStack key={index} justifyContent='center'>
                                          <Image className={boxGlow} boxSize={tool && tool === asset ? '24' : '20'} borderRadius='8px' alt={asset.asset.params.name}
                                            src={'https://cloudflare-ipfs.com/ipfs/' + asset.asset.params.url.substring(7)}
                                            onClick={() => setTool(asset)}
                                          />
                                          <Text fontSize='12px' textColor={buttonText4}>
                                          {asset.asset.params['unit-name']}
                                          </Text>
                                        </VStack>
                                      ))}
                                  </Flex>
                                  {tool ? <Text mb={2} fontSize='12px' textColor={buttonText5}>Selected: <strong>{tool.asset.params.name}</strong></Text> : null}
                                  <FullGlowButton text={loading ? 'Equipping...' : 'Equip!'} onClick={handleEquipTool} disabled={!tool} />
                                </VStack>
                              </ModalBody>
                              <ModalFooter>
                                  <FullGlowButton text='X' onClick={onClose3} />
                              </ModalFooter>
                            </ModalContent>
                            </Modal>
                          </>
                        }
                      </>
                      }
                  </HStack>
                  <HStack w='full' justifyContent='space-between'>
                      <Text fontSize='16px' textColor={buttonText4}>Boss Battles</Text>
                      <Text fontSize='20px' textColor={buttonText5}>{userProfile.boss_battles.split('/')[0]} | {userProfile.boss_battles.split('/')[1]}</Text>
                  </HStack>
                  <HStack w='full' justifyContent='space-between'>
                      <Text fontSize='16px' textColor={buttonText4}>Drip</Text>
                      {userProfile.time_remaining ?
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
                        <IconGlowButton icon={MdOutlineAdd} />
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
      <SuccessPopup isOpen={isSuccessOpen} onClose={onSuccessClose} message={popMessage} title={popTitle} />
      <Footer />
    </>
  )
}
