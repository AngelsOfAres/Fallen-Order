import Head from 'next/head'
import Navbar from 'components/Navbar'
import { Center, useColorModeValue, Text, useDisclosure, Image, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, VStack, HStack, ModalFooter, Input, Box, Tooltip, Flex, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, SimpleGrid, Icon, Tab, Tabs, TabList, TabPanels, TabPanel, Progress, Switch } from '@chakra-ui/react'
import styles from '../styles/glow.module.css'
import Footer from 'components/Footer'
import React from 'react'
import { useWallet } from '@txnlab/use-wallet'
import Connect from 'components/MainTools/Connect'
import MyBalances from 'components/FallenOrder/components/MyBalances'
import { authenticate } from 'utils/auth'
import { FullGlowButton, IconGlowButton, IconGlowButton2 } from 'components/Buttons'
import { useState, useEffect, useRef, useCallback } from 'react'
import useWalletBalance from 'hooks/useWalletBalance'
import { getProfile } from 'components/FallenOrder/components/Tools/getUserProfile'
import { SuccessPopup } from '../components/FallenOrder/components/Popups/Success'
import { WrenchScrewdriverIcon } from '@heroicons/react/20/solid'
import { hatchets, pickaxes } from 'components/Whitelists/FOTools'
import { BGRank1, BGRank2, BGRank3 } from 'components/Whitelists/FOBGs'
import { Rank1, Rank2, Rank3, Rank4, Rank5 } from 'components/Whitelists/FOChars'
import { skillPotions, kinshipPotions } from 'components/Whitelists/FOPotions'
import { BsPersonLinesFill, BsPersonSquare } from 'react-icons/bs'
import { PiSelectionBackground, PiUserCirclePlusFill } from 'react-icons/pi'
import { CreateListing } from 'components/FallenOrder/components/CreateListing'
import { ListingCard } from 'components/FallenOrder/components/ListingCard'
import { MyListingCard } from 'components/FallenOrder/components/MyListingCard'
import CreateUserProfile from 'components/FallenOrder/components/CreateUserProfile'
import { TbPlugConnectedX } from 'react-icons/tb'
import MyBalancesTab from 'components/FallenOrder/components/MyBalancesTab'
import { HiSortDescending } from "react-icons/hi"
import { LiaRandomSolid } from "react-icons/lia"
import { IoMdSearch } from "react-icons/io"
import { RxCross2 } from "react-icons/rx"
import { getAngelListings } from 'api/backend'
import PortfolioViewer from 'components/MainTools/PortfolioMaster'

export default function PortfolioMasterPage() {
  const gradientText = useColorModeValue(styles.textAnimatedGlowL, styles.textAnimatedGlowD)
  const allAccessories = [...hatchets, ...pickaxes, ...skillPotions, ...kinshipPotions]
  const allChars = [...Rank1, ...Rank2, ...Rank3, ...Rank4, ...Rank5]
  const allBGs = [...BGRank1, ...BGRank2, ...BGRank3]
  const { activeAddress, signTransactions } = useWallet()
  const [ authUser, setAuthUser ] = useState<any>(null)
  const { assetList } = useWalletBalance()
  const [popTitle, setPopTitle] = useState<any>('')
  const [ userProfile, setUserProfile ] = useState<any>(null)
  const [ loading, setLoading ] = useState<boolean>(true)
  const [ priceSort, setPriceSort ] = useState<boolean>(true)
  const [ expAccepted, setExpAccepted ] = useState<boolean>(false)
  const [popMessage, setPopMessage] = useState<any>('')
  const [filterText, setFilterText] = useState<any>('')
  const [filterOn, setFilterOn] = useState<any>(false)
  const [listings, setListings] = useState<any>(null)
  const [myListings, setMyListings] = useState<any>([])
  const { isOpen: isSuccessOpen, onOpen: onSuccessOpen, onClose: onSuccessClose } = useDisclosure()
  const { isOpen: isOpen1, onOpen: onOpen1, onClose: onClose1 } = useDisclosure()
  const buttonText3 = useColorModeValue('orange.500','cyan.500')
  const buttonText4 = useColorModeValue('orange.200','cyan.100')
  const buttonText5 = useColorModeValue('orange','cyan')
  const xLightColor = useColorModeValue('orange.100','cyan.100')
  const progress = useColorModeValue('linear(to-r, orange, red)', 'linear(to-r, purple.600, cyan)')

  function handleLogout() {
    localStorage.removeItem('token_' + activeAddress)
    setAuthUser(null)
  }

  return (
    <>
      <Head>
        <title>Portfolio Master</title>
        <meta name="description" content="View holdings of multiple wallets efficiently" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <PortfolioViewer />
      <Footer />
    </>
  )
}
