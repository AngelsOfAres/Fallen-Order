import Head from 'next/head'
import Navbar from 'components/Navbar'
import { Center, useColorModeValue, Text, useDisclosure, Image, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, VStack, HStack, ModalFooter, Input, Box, Tooltip, Flex, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Progress } from '@chakra-ui/react'
import styles from '../styles/glow.module.css'
import Footer from 'components/Footer'
import ManageCharacter from 'components/FallenOrder/ManageChar'
import React from 'react'
import { useWallet } from '@txnlab/use-wallet'
import Connect from 'components/MainTools/Connect'
import MyBalances from 'components/FallenOrder/components/MyBalances'
import { authenticate } from 'utils/auth'
import { FullGlowButton, IconGlowButton, IconGlowButton2 } from 'components/Buttons'
import { useState, useEffect } from 'react'
import useWalletBalance from 'hooks/useWalletBalance'
import { getProfile } from 'components/FallenOrder/components/Tools/getUserProfile'
import { algodClient, algodIndexer } from 'lib/algodClient'
import algosdk from 'algosdk'
import { SuccessPopup } from '../components/FallenOrder/components/Popups/Success'
import toast from 'react-hot-toast'
import { equipTool, getDrip, subKinship, unfreezeAsset } from 'api/backend'
import { motion } from 'framer-motion'
import { MdOutlineAdd } from 'react-icons/md'
import { CgProfile } from 'react-icons/cg'
import { TbPlugConnectedX } from 'react-icons/tb'
import { WrenchScrewdriverIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { hatchets, pickaxes } from 'components/Whitelists/FOTools'
import { Rank1, Rank2, Rank3, Rank4, Rank5 } from 'components/Whitelists/FOChars'
import { BGRank1, BGRank2, BGRank3 } from 'components/Whitelists/FOBGs'
import { skillPotions, kinshipPotions } from 'components/Whitelists/FOPotions'
import CreateUserProfile from 'components/FallenOrder/components/CreateUserProfile'
import { CreateListing } from 'components/FallenOrder/components/CreateListing'
import { combineImages } from 'components/FallenOrder/components/Tools/combineImages'
import Link from 'next/link'
import { BsShop } from 'react-icons/bs'
import { GiMeltingIceCube } from 'react-icons/gi'
import { PiUserCirclePlusFill } from 'react-icons/pi'

export default function MyFO() {
  const gradientText = useColorModeValue(styles.textAnimatedGlowL, styles.textAnimatedGlowD)
  const boxGlow = useColorModeValue(styles.boxGlowL, styles.boxGlowD)
  const allTools = [...hatchets, ...pickaxes]
  const allFOAssets = [...allTools, ...Rank1, ...Rank2, ...Rank3, ...Rank4, ...Rank5, ...BGRank1, ...BGRank2, ...BGRank3, ...skillPotions, ...kinshipPotions]
  const { activeAddress, signTransactions } = useWallet()
  const [ authUser, setAuthUser ] = useState<any>(null)
  const [ loading, setLoading ] = useState<boolean>(true)
  const [ userProfile, setUserProfile ] = useState<any>(null)
  const [finalImage, setFinalImage] = useState<any>(null)
  const [ frozen, setFrozen ] = useState<any>([])
  const { expBal, assetList } = useWalletBalance()
  const [popTitle, setPopTitle] = useState<any>('')
  const [popMessage, setPopMessage] = useState<any>('')
  const [tool, setTool] = useState<any>(null)
  const [subCount, setSubCount] = useState<number>(1)
  const [toolList, setToolList] = useState<any>([])
  const { isOpen: isOpen1, onOpen: onOpen1, onClose: onClose1 } = useDisclosure()
  const { isOpen: isOpen2, onOpen: onOpen2, onClose: onClose2 } = useDisclosure()
  const { isOpen: isOpen3, onOpen: onOpen3, onClose: onClose3 } = useDisclosure()
  const { isOpen: isOpen4, onOpen: onOpen4, onClose: onClose4 } = useDisclosure()
  const { isOpen: isOpenFrozen, onOpen: onOpenFrozen, onClose: onCloseFrozen } = useDisclosure()
  const { isOpen: isOpenFrozenPopup, onOpen: onOpenFrozenPopup, onClose: onCloseFrozenPopup } = useDisclosure()
  const { isOpen: isSuccessOpen, onOpen: onSuccessOpen, onClose: onSuccessClose } = useDisclosure()
  const buttonText3 = useColorModeValue('orange.500','cyan.500')
  const buttonText4 = useColorModeValue('orange.200','cyan.100')
  const buttonText5 = useColorModeValue('orange','cyan')
  const xLightColor = useColorModeValue('orange.100','cyan.100')
  const medColor = useColorModeValue('orange.500','cyan.500')
  const lightColor = useColorModeValue('orange.300','cyan.300')

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
    setTimeout(() => {
      fetchProfile()
    }, 3000)
  }

  const handleUnfreezeAsset = async (assetID: any) => {
    setLoading(true)
    if (!activeAddress || !authUser) {
      throw new Error('Log In First Please!!')
    }

    toast.loading('Melting Item...', { id: 'txn', duration: Infinity })

    try{
        const data = await unfreezeAsset(activeAddress, assetID)
        if (data && data.message) {
          toast.success(`Item Successfully Melted!`, {
            id: 'txn',
            duration: 5000
          })
          setPopTitle('Success')
          setPopMessage(`Item Melted (Unfrozen)!`)
          onSuccessOpen()
          return
        }
    } catch (error) {
        toast.error(`Oops! Purchase failed. Please contact an admin if issue persists...`, { id: 'txn' })
        return
    } finally {
      setLoading(false)
      onCloseFrozenPopup()
    }
  }

  const getFinalImage = async (img1: any, img2: any) => {
    try {
        combineImages(img1, img2)
        .then((finalImageDataURL) => {
            setFinalImage(finalImageDataURL)
        })
        .catch((error) => {
            console.error('Error:', error)
        })
    } catch (error) {
        console.error('Error combining images:', error)
    }
  }

  const fetchProfile = async () => {
    const storedAuthUser = localStorage.getItem('token_' + activeAddress)
    setAuthUser(storedAuthUser || null)
    if (activeAddress && typeof window !== 'undefined') {        
      try {
        const profile = await getProfile(activeAddress)
        setUserProfile(profile || null)
        if (!profile) {
          onOpen1()
        } else {
          setFinalImage(profile.mainImage)
          getFinalImage(profile.mainImage, profile.bgImage)
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
      }
    }
  }

  useEffect(() => {
    if (assetList && assetList.length > 0) {
      fetchProfile()
      const fetchAssetInfo = async (assetIds: any) => {
        try {
          const assetInfoPromises = assetIds.map(async (id: any) => {
            return await algodIndexer.lookupAssetByID(id).do()
          })
      
          const assetInfo = await Promise.all(assetInfoPromises)
          return assetInfo
        } catch (error) {
          console.error('An error occurred:', error)
          throw error
        }
      }
      
      const availableTools = assetList
        .filter((item: any) => allTools.includes(item['asset-id']))
        .map((item: any) => item['asset-id'])
      
      const allFrozen = assetList
        .filter((item: any) => allFOAssets.includes(item['asset-id']) && item['is-frozen'])
        .map((item: any) => item['asset-id'])
      
      Promise.all([fetchAssetInfo(availableTools), fetchAssetInfo(allFrozen)])
        .then(([availableToolsInfo, allFrozenInfo]) => {
          setToolList(availableToolsInfo)
          setFrozen(allFrozenInfo.reverse())
          setLoading(false)
        })
        .catch((error) => {
          console.error('An error occurred:', error)
          setLoading(false)
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

  
    const handleEquipTool = async (type: any) => {
        setLoading(true)
        try {
            if (!activeAddress) {
            throw new Error('Log In First Please!!')
            }

            toast.loading('Equipping Tool...', { id: 'txn', duration: Infinity })

            try{
                const data = await equipTool(activeAddress, [type, tool.asset.index])
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
        if (type === 'equip') {
          setPopMessage('New Tool Equipped!')
        } else {
          setPopMessage('Tool Dequipped and Unfrozen!')
        }
        setPopTitle('Success')
        onSuccessOpen()
        setTimeout(() => {
          fetchProfile()
        }, 3000)
    }

    const handleKinshipSub = async () => {
      setLoading(true)
      try {
          if (!activeAddress) {
          throw new Error('Log In First Please!!')
          }

          toast.loading('Adding To Kinship Subscription...', { id: 'txn', duration: Infinity })

          try{
              const data = await subKinship(activeAddress, subCount)
              if (data && data.includes("Error")) {
              console.log(data)
              toast.error('Oops! Kinship Subscription Failed!', { id: 'txn' })
              return
              }
          } catch (error: any) {
              console.log(error.message)
              toast.error('Oops! Kinship Subscription Failed!', { id: 'txn' })
              return
          } finally {
              setLoading(false)
          }
      } catch (error) {
          console.error(error)
          toast.error('Oops! Kinship Subscription Failed!', { id: 'txn' })
          return
      }
      toast.success(`Kinship Subscription Successful!`, {
          id: 'txn',
          duration: 5000
      })
      setPopMessage('Kinship Subscription Added!')
      setPopTitle('Success')
      onClose4()
      onSuccessOpen()
      setTimeout(() => {
        fetchProfile()
      }, 3000)
  }
  
  return (
    <>
      <Head>
        <title>Fallen Order - My FO</title>
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
            <Flex pt={6} flexDirection="row" flexWrap="wrap" justifyContent='center' gap='16px'>

              <Tooltip py={1} px={2} borderWidth='1px' borderRadius='lg' arrowShadowColor={buttonText5} borderColor={buttonText5} bgColor='black' textColor={buttonText4} fontSize='12px' fontFamily='Orbitron' textAlign='center' hasArrow label={userProfile ? 'My Profile' : 'Create Profile!'} aria-label='Tooltip'>
                <motion.div
                  animate={{ scale: userProfile && userProfile.drip_timer === 0 ? [1, 1.07, 1] : 1 }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.75,
                    ease: "linear",
                  }}>
                  <IconGlowButton2 icon={userProfile ? CgProfile : PiUserCirclePlusFill} onClick={userProfile ? onOpen2 : onOpen1} />
                </motion.div>
              </Tooltip>
              
              {frozen.length > 0 ? 
                <Tooltip py={1} px={2} borderWidth='1px' borderRadius='lg' arrowShadowColor={buttonText5} borderColor={buttonText5} bgColor='black' textColor={buttonText4} fontSize='12px' fontFamily='Orbitron' textAlign='center' hasArrow label={'Melt Items'} aria-label='Tooltip'>
                  <div><IconGlowButton2 icon={GiMeltingIceCube} onClick={onOpenFrozen} /></div>
                </Tooltip>
                : null}

              <Tooltip py={1} px={2} borderWidth='1px' borderRadius='lg' arrowShadowColor={buttonText5} borderColor={buttonText5} bgColor='black' textColor={buttonText4} fontSize='12px' fontFamily='Orbitron' textAlign='center' hasArrow label={'Grand Exchange'} aria-label='Tooltip'>
                <Link href={'/ge'} target='_blank' rel='noreferrer'><IconGlowButton2 icon={BsShop} /></Link>
              </Tooltip>
              <Tooltip py={1} px={2} borderWidth='1px' borderRadius='lg' arrowShadowColor={buttonText5} borderColor={buttonText5} bgColor='black' textColor={buttonText4} fontSize='12px' fontFamily='Orbitron' textAlign='center' hasArrow label={'Create Listing'} aria-label='Tooltip'>
                <div><CreateListing /></div>
              </Tooltip>
              
              <MyBalances />

              <Tooltip py={1} px={2} borderWidth='1px' borderRadius='lg' arrowShadowColor={buttonText5} borderColor={buttonText5} bgColor='black' textColor={buttonText4} fontSize='12px' fontFamily='Orbitron' textAlign='center' hasArrow label={'Log Out'} aria-label='Tooltip'>
                <div><IconGlowButton2 icon={TbPlugConnectedX} onClick={handleLogout} /></div>
              </Tooltip>

            </Flex>
          <Text my='24px' className={`${gradientText} responsive-font`}>My Fallen Order</Text>
          <Center>
            <ManageCharacter />
          </Center>
          <CreateUserProfile isOpen={isOpen1} onClose={onClose1} />

          <Modal scrollBehavior={'outside'} size='xl' isCentered isOpen={isOpenFrozen} onClose={onCloseFrozen}>
            <ModalOverlay backdropFilter='blur(10px)'/>
            <ModalContent m='auto' alignItems='center' bgColor='black' borderWidth='1.5px' borderColor={buttonText3} borderRadius='2xl'>
                <ModalHeader className={gradientText} textAlign='center' fontSize='20px' fontWeight='bold'>Melt Item</ModalHeader>
                <ModalBody>
                  <VStack m={1} alignItems='center' justifyContent='center' spacing='10px'>
                      <Flex mb={4} w='full' flexDirection="row" flexWrap="wrap" gap='24px' justifyContent='center'>
                        {frozen.map((asset: any, index: any) => (
                              <VStack key={index} justifyContent='center'>
                                <Image _hover={{ boxSize: '24' }} className={boxGlow} boxSize='20' borderRadius='8px' alt={asset.asset.params.name}
                                  src={'https://cloudflare-ipfs.com/ipfs/' + asset.asset.params.url.substring(7)} onClick={onOpenFrozenPopup} />
                                <Text fontSize='12px' textColor={buttonText4}>
                                {asset.asset.params['unit-name']}
                                </Text>

                                <Modal scrollBehavior={'outside'} size='md' isCentered isOpen={isOpenFrozenPopup} onClose={onCloseFrozenPopup}>
                                <ModalOverlay backdropFilter='blur(10px)'/>
                                <ModalContent m='auto' alignItems='center' bgColor='black' borderWidth='1.5px' borderColor={buttonText3} borderRadius='2xl'>
                                    <ModalHeader className={gradientText} textAlign='center' fontSize='24px' fontWeight='bold'>Confirm Melt!</ModalHeader>
                                    <ModalBody>
                                      <VStack mx={4} alignItems='center' justifyContent='center'>
                                        <Text pb={4} fontSize='16px' textAlign='center' textColor={buttonText4}>This will unfreeze the asset from your account.<br />Be aware that any listings and equips involving this asset will be cleared.</Text>
                                        <FullGlowButton text={loading ? 'Melting...' : 'Melt!'} onClick={() => handleUnfreezeAsset(asset.asset.index)} disabled={loading} />
                                      </VStack>
                                    </ModalBody>
                                    <ModalFooter>
                                        <FullGlowButton text='X' onClick={onCloseFrozenPopup} />
                                    </ModalFooter>
                                </ModalContent>
                                </Modal>
                              </VStack>
                          ))}
                      </Flex>
                      <HStack pb={4}>
                          <FullGlowButton text='X' onClick={onCloseFrozen} />
                      </HStack>
                  </VStack>
                </ModalBody>
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
                        <Image className={boxGlow} boxSize='48px' borderRadius='6px' alt='Main Character' src={finalImage} />
                      </>
                      : 
                      <Text fontSize='20px' textColor={buttonText5}>-</Text>
                      }
                  </HStack>
                  <HStack w='full' justifyContent='space-between'>
                      <Text fontSize='16px' textColor={buttonText4}>Equipped Tool</Text>
                      {userProfile.equipped_tool !== 0 ?
                      <>
                        <Text fontSize='20px' textColor={buttonText5}>{userProfile.toolName}</Text>
                        <Box>
                          <Text ml='2px' mt='34px' position='absolute' fontSize='8px' textColor={buttonText5}>{userProfile.toolData.Uses}</Text>
                          <Image className={boxGlow} boxSize='48px' borderRadius='6px' alt='Equipped Tool' src={userProfile.toolImage} onClick={onOpen3} />
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
                          </>
                        }
                      </>
                      }

                      <Modal scrollBehavior={'outside'} size='md' isCentered isOpen={isOpen3} onClose={onClose3}>
                      <ModalOverlay backdropFilter='blur(10px)'/>
                      <ModalContent m='auto' alignItems='center' bgColor='black' borderWidth='1.5px' borderColor={buttonText3} borderRadius='2xl'>
                        <ModalHeader className={gradientText} textAlign='center' fontSize='24px' fontWeight='bold'>Equip Tool</ModalHeader>
                        <ModalBody px={4} w='full'>
                          <VStack w='full' alignItems='center' justifyContent='center'>
                            <HStack pb={6} spacing='12px'>
                              <Text fontSize='16px' textAlign='center' textColor={buttonText4}>Current: {userProfile.toolName ? userProfile.toolName : '-'}</Text>
                              {userProfile.equipped_tool !== 0 ? <IconGlowButton icon={XMarkIcon} onClick={() => handleEquipTool('dequip')} /> : null}
                            </HStack>
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
                            {tool ? 
                              <>
                                {userProfile.equipped_tool === tool.asset.index ?
                                  <Text textAlign='center' mb={2} fontSize='16px' textColor={'red'}>Already Equipped!</Text>
                                :
                                  <Text textAlign='center' mb={2} fontSize='12px' textColor={buttonText5}>Selected: <strong>{tool.asset.params.name}</strong><br />Equipping will clawback 5 $EXP from your account</Text>
                                }
                                <FullGlowButton text={loading ? 'Equipping...' : 'Equip!'} onClick={() => handleEquipTool('equip')} disabled={!tool || loading || userProfile.equipped_tool === tool.asset.index} />
                              </>
                            : null}
                          </VStack>
                        </ModalBody>
                        <ModalFooter>
                            <FullGlowButton text='X' onClick={onClose3} />
                        </ModalFooter>
                      </ModalContent>
                      </Modal>
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
                        {expBal !== -1 ?
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
                      <HStack spacing='12px'>
                        <Text fontSize='20px' textColor={buttonText5}>{userProfile.kinship_subs}</Text>
                        <IconGlowButton icon={MdOutlineAdd} onClick={onOpen4} />

                          <Modal scrollBehavior={'outside'} size='md' isCentered isOpen={isOpen4} onClose={onClose4}>
                          <ModalOverlay backdropFilter='blur(10px)'/>
                          <ModalContent m='auto' alignItems='center' bgColor='black' borderWidth='1.5px' borderColor={buttonText3} borderRadius='2xl'>
                              <ModalHeader className={gradientText} textAlign='center' fontSize='24px' fontWeight='bold'>Auto Kinship</ModalHeader>
                              <ModalBody>
                                <VStack mx={4} alignItems='center' justifyContent='center'>
                                  <Text pb={4} fontSize='16px' textAlign='center' textColor={buttonText4}>Subscribe to Auto-Kinship to guarantee your characters&apos; Kinship is received on time daily!</Text>
                                  <HStack>
                                    <Text py={4} fontSize='16px' textAlign='center' textColor={buttonText5}>Units</Text>
                                    <NumberInput w='80px' min={0} max={10000} value={isNaN(subCount) ? 0 : subCount} onChange={(valueString) => setSubCount(parseInt(valueString))} isInvalid={subCount < 0 || subCount > 10000}>
                                    <NumberInputField textAlign='center' _hover={{ bgColor: 'black' }} _focus={{ borderColor: medColor }} textColor={xLightColor} borderColor={medColor} className={`block rounded-none rounded-l-md bg-black sm:text-sm`}/>
                                    <NumberInputStepper>
                                        <NumberIncrementStepper _hover={{ textColor: medColor }} textColor={lightColor} borderColor={medColor}/>
                                        <NumberDecrementStepper _hover={{ textColor: medColor }} textColor={lightColor} borderColor={medColor}/>
                                    </NumberInputStepper>
                                    </NumberInput>
                                  </HStack>
                                  <HStack>
                                    <Text py={4} fontSize='16px' textAlign='center' textColor={buttonText5}>Total Cost:</Text>
                                    <Text py={4} fontSize='16px' textAlign='center' textColor={buttonText4}>{isNaN(subCount*5) ? 0 : subCount*5} $EXP</Text>
                                  </HStack>
                                  <FullGlowButton text='Subscribe!' onClick={handleKinshipSub} disabled={loading || subCount === 0 || isNaN(subCount)} />
                                </VStack>
                              </ModalBody>
                              <ModalFooter>
                                  <FullGlowButton text='X' onClick={onClose4} />
                              </ModalFooter>
                          </ModalContent>
                          </Modal>
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