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
import { FullGlowButton } from 'components/Buttons'
import { useState, useEffect } from 'react'
import useWalletBalance from 'hooks/useWalletBalance'
import { getListings, getProfile } from 'components/FallenOrder/components/Tools/getUserProfile'
import { SuccessPopup } from '../components/FallenOrder/components/Popups/Success'
import { WrenchScrewdriverIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { hatchets, pickaxes } from 'components/Whitelists/FOTools'
import { BGRank1, BGRank2, BGRank3 } from 'components/Whitelists/FOBGs'
import { Rank1, Rank2, Rank3, Rank4, Rank5 } from 'components/Whitelists/FOChars'
import { skillPotions, kinshipPotions } from 'components/Whitelists/FOPotions'
import { BsPersonLinesFill, BsPersonSquare } from 'react-icons/bs'
import { PiSelectionBackground } from 'react-icons/pi'
import { CreateListing } from 'components/FallenOrder/components/CreateListing'
import { ListingCard } from 'components/FallenOrder/components/ListingCard'
import { MyListingCard } from 'components/FallenOrder/components/MyListingCard'
import CreateUserProfile from 'components/FallenOrder/components/CreateUserProfile'

export default function MyFO() {
  const gradientText = useColorModeValue(styles.textAnimatedGlowL, styles.textAnimatedGlowD)
  const allAccessories = [...hatchets, ...pickaxes, ...skillPotions, ...kinshipPotions]
  const allChars = [...Rank1, ...Rank2, ...Rank3, ...Rank4, ...Rank5]
  const allBGs = [...BGRank1, ...BGRank2, ...BGRank3]
  const { activeAddress, signTransactions } = useWallet()
  const [ authUser, setAuthUser ] = useState<any>(null)
  const { assetList } = useWalletBalance()
  const [popTitle, setPopTitle] = useState<any>('')
  const [ userProfile, setUserProfile ] = useState<any>(null)
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

  let fetchListingsCalled = false

  useEffect(() => {
    if (!fetchListingsCalled) {
      fetchProfile()
      fetchListings()
      fetchListingsCalled = true
    }
  }, [assetList])

  const fetchProfile = async () => {
    if (activeAddress) {        
      try {
        const profile = await getProfile(activeAddress)
        setUserProfile(profile || null)
        if (!profile) {
          onOpen1()
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
      }
    }
  }

  const fetchListings = async () => {
    if (typeof window !== 'undefined') {
      const storedAuthUser = localStorage.getItem('token_' + activeAddress)
      setAuthUser(storedAuthUser || null)
    }
    if (!listings && !fetchListingsCalled) {
      const allListings = await getListings()
      const myListings = allListings.filter((listing: any) => activeAddress === listing.wallet)
      setListings(allListings)
      console.log(allListings)
      setMyListings(myListings)
    }
  }

  function handleLogout() {
    localStorage.removeItem('token_' + activeAddress)
    setAuthUser(null)
  }

  async function handleLogin() {
    const token = await authenticate(activeAddress, signTransactions)
    setAuthUser(token)
  }
  
  return (
    <>
      <Head>
        <title>Fallen Order - Grand Exchange</title>
        <meta name="description" content="Developed by Angels Of Ares" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      {activeAddress ?
      <>
        {!authUser ?
            <>
                <Text my='24px' className={`${gradientText} responsive-font`}>Grand Exchange</Text>
                <Center m='24px'><FullGlowButton text='Log In!' onClick={handleLogin} /></Center>
            </>
        :
        <>
          {listings ?
            <>
              <HStack className='w-full p-8 absolute' justifyContent='space-between'>
                  {userProfile ?
                    <CreateListing />
                  :
                  <>
                    <FullGlowButton text='Create Profile' onClick={onOpen1} />
                    <CreateUserProfile isOpen={isOpen1} onClose={onClose1} />
                  </>
                  }
                  <FullGlowButton text='Log Out' onClick={handleLogout} />
              </HStack>
            </>
            : null}
            <MyBalances />
            <Text my='36px' className={`${gradientText} responsive-font`}>Grand Exchange</Text>
            
            {listings ?
              <>
                <Center px='36px' w='100%'>
                  <Tabs w='100%' maxW='900px' isFitted size='xs' variant='enclosed' borderColor={buttonText3}>
                    <TabList fontFamily="Orbitron" fontWeight='bold' textColor={buttonText4}>
                      <Tooltip py={1} px={2} placement='top' borderWidth='1px' borderRadius='lg' arrowShadowColor={buttonText5} borderColor={buttonText5} bgColor='black' textColor={buttonText4} fontSize='10px' textAlign='center' hasArrow label={'Characters'} aria-label='Tooltip'>
                        <Tab _focus={{boxShadow: 'none'}} _selected={{ borderColor: 'gray.700', borderWidth: '1px'}}>
                            <Icon p={1} boxSize='38px' as={BsPersonSquare} />
                        </Tab>
                      </Tooltip>
                      <Tooltip py={1} px={2} placement='top' borderWidth='1px' borderRadius='lg' arrowShadowColor={buttonText5} borderColor={buttonText5} bgColor='black' textColor={buttonText4} fontSize='10px' textAlign='center' hasArrow label={'Backgrounds'} aria-label='Tooltip'>
                        <Tab _focus={{boxShadow: 'none'}} _selected={{ borderColor: 'gray.700', borderWidth: '1px'}}>
                            <Icon p={0.5} boxSize='40px' as={PiSelectionBackground} />
                        </Tab>
                      </Tooltip>
                      <Tooltip py={1} px={2} placement='top' borderWidth='1px' borderRadius='lg' arrowShadowColor={buttonText5} borderColor={buttonText5} bgColor='black' textColor={buttonText4} fontSize='10px' textAlign='center' hasArrow label={'Accessories'} aria-label='Tooltip'>
                        <Tab _focus={{boxShadow: 'none'}} _selected={{ borderColor: 'gray.700', borderWidth: '1px'}}>
                            <Icon p={1} boxSize='36px' as={WrenchScrewdriverIcon} />
                        </Tab>
                      </Tooltip>
                      <Tooltip py={1} px={2} placement='top' borderWidth='1px' borderRadius='lg' arrowShadowColor={buttonText5} borderColor={buttonText5} bgColor='black' textColor={buttonText4} fontSize='10px' textAlign='center' hasArrow label={'My Listings'} aria-label='Tooltip'>
                        <Tab _focus={{boxShadow: 'none'}} _selected={{ borderColor: 'gray.700', borderWidth: '1px'}}>
                            <Icon p={1} boxSize='40px' as={BsPersonLinesFill} />
                        </Tab>
                      </Tooltip>
                    </TabList>
                    <TabPanels>
                      <TabPanel my={5} w='stretch'>
                        <p>
                          <Flex mb={4} w='full' flexDirection="row" flexWrap="wrap" gap='24px' justifyContent='center'>
                            {listings
                            .filter((listing: any) => allChars.includes(listing.assetID))
                            .map((listing: any, index: any) => (
                              <div key={index}>
                                <ListingCard listing_wallet={listing.wallet} listingID={listing.listingID} assetID={listing.assetID} price={listing.price} name={listing.assetName} image={listing.assetImage} expAccepted={listing.expAccepted}  />
                              </div>
                              ))}
                          </Flex>
                        </p>
                      </TabPanel>
                      
                      <TabPanel my={5} w='stretch'>
                        <p>
                        <Flex mb={4} w='full' flexDirection="row" flexWrap="wrap" gap='24px' justifyContent='center'>
                            {listings
                            .filter((listing: any) => allBGs.includes(listing.assetID))
                            .map((listing: any, index: any) => (
                              <div key={index}>
                                <ListingCard listing_wallet={listing.wallet} listingID={listing.listingID} assetID={listing.assetID} price={listing.price} name={listing.assetName} image={listing.assetImage} expAccepted={listing.expAccepted}  />
                              </div>
                              ))}
                          </Flex>
                        </p>
                      </TabPanel>
                      
                      <TabPanel my={5} w='stretch'>
                        <p>
                        <Flex mb={4} w='full' flexDirection="row" flexWrap="wrap" gap='24px' justifyContent='center'>
                            {listings
                            .filter((listing: any) => allAccessories.includes(listing.assetID))
                            .map((listing: any, index: any) => (
                              <div key={index}>
                                <ListingCard listing_wallet={listing.wallet} listingID={listing.listingID} assetID={listing.assetID} price={listing.price} name={listing.assetName} image={listing.assetImage} expAccepted={listing.expAccepted}  />
                              </div>
                              ))}
                          </Flex>
                        </p>
                      </TabPanel>

                      
                      <TabPanel my={5} w='stretch'>
                        <p>
                          {myListings.length > 0 ?
                            <Flex mb={4} w='full' flexDirection="row" flexWrap="wrap" gap='24px' justifyContent='center'>
                              {myListings
                              .map((listing: any, index: any) => (
                                <div key={index}>
                                  <MyListingCard listing_wallet={listing.wallet} listingID={listing.listingID} assetID={listing.assetID} price={listing.price} name={listing.assetName} image={listing.assetImage} expAccepted={listing.expAccepted}  />
                                </div>
                                ))}
                            </Flex>
                          :
                            <>
                              <Text mt={4} fontSize='14px' textAlign='center' textColor={buttonText5}>You Don&apos;t Have Any Listings!</Text>
                            </>
                          }
                        </p>
                      </TabPanel>

                    </TabPanels>
                  </Tabs>
                </Center>
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
