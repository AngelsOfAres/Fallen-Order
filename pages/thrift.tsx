import Head from 'next/head'
import Navbar from 'components/Navbar'
import { Center, useColorModeValue, Text, useDisclosure, HStack, Box, Tooltip, Flex, Icon, Tab, Tabs, TabList, TabPanels, TabPanel, Progress } from '@chakra-ui/react'
import styles from '../styles/glow.module.css'
import Footer from 'components/Footer'
import React from 'react'
import { useWallet } from '@txnlab/use-wallet'
import Connect from 'components/MainTools/Connect'
import MyBalances from 'components/FallenOrder/components/MyBalances'
import { FullGlowButton, IconGlowButton2 } from 'components/Buttons'
import { useState, useEffect, useRef, useCallback } from 'react'
import useWalletBalance from 'hooks/useWalletBalance'
import { getListings } from 'components/FallenOrder/components/Tools/getUserProfile'
import { SuccessPopup } from '../components/FallenOrder/components/Popups/Success'
import { WrenchScrewdriverIcon } from '@heroicons/react/20/solid'
import { BsPersonLinesFill, BsPersonSquare } from 'react-icons/bs'
import { PiSelectionBackground, PiUserCirclePlusFill } from 'react-icons/pi'
import CreateThriftling from 'components/FallenOrder/components/CreateThriftling'
import { ListingCard } from 'components/FallenOrder/components/ListingCard'
import CreateUserProfile from 'components/FallenOrder/components/CreateUserProfile'
import { TbPlugConnectedX } from 'react-icons/tb'
import { MdAssignmentAdd } from "react-icons/md"

export default function ThriftShop() {
  const gradientText = useColorModeValue(styles.textAnimatedGlowL, styles.textAnimatedGlowD)
  const { activeAddress, signTransactions } = useWallet()
  const { assetList } = useWalletBalance()
  const [popTitle, setPopTitle] = useState<any>('')
  const [ userProfile, setUserProfile ] = useState<any>(null)
  const [ loading, setLoading ] = useState<boolean>(true)
  const [popMessage, setPopMessage] = useState<any>('')
  const [listings, setListings] = useState<any>(null)
  const [myListings, setMyListings] = useState<any>([])
  const { isOpen: isSuccessOpen, onOpen: onSuccessOpen, onClose: onSuccessClose } = useDisclosure()
  const { isOpen: isOpen1, onOpen: onOpen1, onClose: onClose1 } = useDisclosure()
  const buttonText3 = useColorModeValue('orange.500','cyan.500')
  const buttonText4 = useColorModeValue('orange.200','cyan.100')
  const buttonText5 = useColorModeValue('orange','cyan')
  const xLightColor = useColorModeValue('orange.100','cyan.100')
  const progress = useColorModeValue('linear(to-r, orange, red)', 'linear(to-r, purple.600, cyan)')

  const fetchListingsRun = useRef(false)

  const fetchListings = useCallback(async () => {
    if (!listings) {
      const allListings = await getListings()
      const myListings = allListings.filter((listing: any) => activeAddress === listing.wallet)
      setListings(allListings)
      setMyListings(myListings)
      setLoading(false)
    }
  }, [activeAddress, listings])

  useEffect(() => {
    if (!fetchListingsRun.current) {
      fetchListings()
    }
  }, [assetList, fetchListings])

  async function addThriftling() {

  }
  
  return (
    <>
        <Head>
            <title>Fallen Order - Thrift Shop</title>
            <meta name="description" content="Developed by Angels Of Ares" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Navbar />
        <Text my='24px' className={`${gradientText} responsive-font`}>Thrift Shop</Text>
        {activeAddress ?
        <>
            {listings && !loading ?
              <>
              <Center><CreateThriftling /></Center>
                <Flex my={6} w='full' flexDirection="row" flexWrap="wrap" gap='24px' justifyContent='center'>
                  {listings
                  .map((listing: any, index: any) => (
                    <div key={index}>
                      <ListingCard listing_wallet={listing.wallet} listingID={listing.listingID} assetID={listing.assetID} price={listing.price} name={listing.assetName} image={listing.assetImage} expAccepted={listing.expAccepted}  />
                    </div>
                    ))}
                </Flex>
              </>
              :
                <>
                  <Text mb={-4} textColor={xLightColor} align={'center'} className='pt-4 text-sm'>Loading Listings...</Text>
                  <Center>
                    <Box w='250px' my='24px'>
                        <Progress size='xs' bgGradient={progress} colorScheme={buttonText5} isIndeterminate borderRadius='xl'/>
                    </Box>
                  </Center>
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
