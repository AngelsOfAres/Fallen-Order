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

export default function TestPage() {
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