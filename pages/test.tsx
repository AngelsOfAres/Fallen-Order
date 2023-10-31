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
import StarCollectingGame from 'components/FallenOrder/components/Games/game1'

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
        <title>Fallen Order - Test Page</title>
        <meta name="description" content="Developed by Angels Of Ares" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      {activeAddress ?
      <>
        {!authUser ?
          <>
            <Text my='24px' className={`${gradientText} responsive-font`}>Test Page</Text>
            <Center m='24px'><FullGlowButton text='Log In!' onClick={handleLogin} /></Center>
          </>
        :
        <>
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