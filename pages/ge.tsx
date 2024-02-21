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
import { getListings, getProfile } from 'components/FallenOrder/components/Tools/getUserProfile'
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

export default function GrandExchange() {
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

  const fetchListingsRun = useRef(false)

  const fetchProfile = useCallback(async () => {
    if (activeAddress) {        
      fetchListingsRun.current = true
      try {
        const profile = await getProfile(activeAddress)
        setUserProfile(profile || null)
      } catch (error) {
        console.error("Error fetching profile:", error)
      }
    }
  }, [activeAddress])

  const fetchListings = useCallback(async () => {
    if (typeof window !== 'undefined') {
      const storedAuthUser = localStorage.getItem('token_' + activeAddress)
      setAuthUser(storedAuthUser || null)
    }
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
      fetchProfile()
      fetchListings()
    }
  }, [assetList, authUser, fetchListings, fetchProfile])

  function handleLogout() {
    localStorage.removeItem('token_' + activeAddress)
    setAuthUser(null)
  }

  async function handleLogin() {
    const token = await authenticate(activeAddress, signTransactions)
    setAuthUser(token)
  }

  const handleFilterChange = async (e: any) => {
    setFilterText(e.target.value.toLowerCase())
  }

  console.log(listings, filterText, filterOn)
  
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
            <div style={{ margin: 12, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <Tooltip py={1} px={2} borderWidth='1px' borderRadius='lg' arrowShadowColor={buttonText5} borderColor={buttonText5} bgColor='black' textColor={buttonText4} fontSize='12px' fontFamily='Orbitron' textAlign='center' hasArrow label={'Log Out'} aria-label='Tooltip'>
                <div><IconGlowButton2 icon={TbPlugConnectedX} onClick={handleLogout} /></div>
              </Tooltip>
            </div>
            <div style={{ marginTop: '-40px' }}><MyBalancesTab /></div>
            </>
            : null}
            <Text mt={!listings ? '36px' : '0px'} mb='24px' className={`${gradientText} responsive-font`}>Grand Exchange</Text>
            
            {listings && !loading ?
              <>
                <Center>
                  <HStack pb={6} pr={8} w='100%' maxW='1200px' justifyContent='flex-end'>

                    {filterOn ?
                    <Input borderColor={buttonText3} borderRadius='lg' textAlign='center' textColor={buttonText4} fontSize='12px' fontFamily="Orbitron"
                      size='sm' placeholder={'Filter by Wallet/Name/ID'} w='250px' onChange={(e) => handleFilterChange(e)} />
                    : null}
                    <IconGlowButton icon={filterOn ? RxCross2 : IoMdSearch} onClick={() => setFilterOn(!filterOn)} />

                    <IconGlowButton icon={priceSort ? LiaRandomSolid : HiSortDescending} onClick={() => setPriceSort(!priceSort)} />
                    <Image ml={4} boxSize={'22px'} alt={'Experience Token'} src={'/exp.png'} />

                    <Switch ml={-1} defaultChecked={expAccepted} onChange={() => setExpAccepted(!expAccepted)} size='md' colorScheme={buttonText5} css={{"& .chakra-switch__thumb": {backgroundColor: "black" }}} />
                  </HStack>
                </Center>
                <Center px='24px' w='100%'>
                  <Tabs w='100%' maxW='1200px' isFitted size='xs' variant='enclosed' borderColor={buttonText3}>
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
                          <Flex mb={4} w='full' flexDirection="row" flexWrap="wrap" gap='24px' justifyContent='center'>
                            {listings
                            .filter((listing: any) => 
                            allChars.includes(listing.assetID) &&
                            (expAccepted ? listing.expAccepted == 1 : true) &&
                            (filterOn ? 
                              (listing.wallet.toLowerCase().includes(filterText) || 
                               listing.assetFullname.toLowerCase().includes(filterText) || 
                               listing.assetID.toString().includes(filterText)) 
                              : true)
                            )
                            .sort((a: any, b: any) => priceSort ? a.price - b.price : Math.random() - 0.5)
                            .map((listing: any, index: any) => (
                              <div key={index}>
                                <ListingCard listing_wallet={listing.wallet} listingID={listing.listingID} assetID={listing.assetID} price={listing.price} name={listing.assetName} image={listing.assetImage} expAccepted={listing.expAccepted}  />
                              </div>
                              ))}
                          </Flex>
                      </TabPanel>
                      
                      <TabPanel my={5} w='stretch'>
                        <Flex mb={4} w='full' flexDirection="row" flexWrap="wrap" gap='24px' justifyContent='center'>
                            {listings
                            .filter((listing: any) => 
                            allBGs.includes(listing.assetID) &&
                            (expAccepted ? listing.expAccepted == 1 : true) &&
                            (filterOn ? 
                              (listing.wallet.toLowerCase().includes(filterText) || 
                               listing.assetFullname.toLowerCase().includes(filterText) || 
                               listing.assetID.toString().includes(filterText)) 
                              : true)
                            )
                            .sort((a: any, b: any) => priceSort ? a.price - b.price : Math.random() - 0.5)
                            .map((listing: any, index: any) => (
                              <div key={index}>
                                <ListingCard listing_wallet={listing.wallet} listingID={listing.listingID} assetID={listing.assetID} price={listing.price} name={listing.assetName} image={listing.assetImage} expAccepted={listing.expAccepted}  />
                              </div>
                              ))}
                          </Flex>
                      </TabPanel>
                      
                      <TabPanel my={5} w='stretch'>
                        <Flex mb={4} w='full' flexDirection="row" flexWrap="wrap" gap='24px' justifyContent='center'>
                            {listings
                            .filter((listing: any) => 
                            allAccessories.includes(listing.assetID) &&
                            (expAccepted ? listing.expAccepted == 1 : true) &&
                            (filterOn ? 
                              (listing.wallet.toLowerCase().includes(filterText) || 
                               listing.assetFullname.toLowerCase().includes(filterText) || 
                               listing.assetID.toString().includes(filterText)) 
                              : true)
                            )
                            .sort((a: any, b: any) => priceSort ? a.price - b.price : Math.random() - 0.5)
                            .map((listing: any, index: any) => (
                              <div key={index}>
                                <ListingCard listing_wallet={listing.wallet} listingID={listing.listingID} assetID={listing.assetID} price={listing.price} name={listing.assetName} image={listing.assetImage} expAccepted={listing.expAccepted}  />
                              </div>
                              ))}
                          </Flex>
                      </TabPanel>

                      
                      <TabPanel my={5} w='stretch'>
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
                            {userProfile ?
                              <>
                                <Text my={4} fontSize='14px' textAlign='center' textColor={buttonText5}>You Don&apos;t Have Any Listings!</Text>
                                <Center><CreateListing /></Center>
                              </>
                            :
                            <>
                              <Tooltip py={1} px={2} borderWidth='1px' borderRadius='lg' arrowShadowColor={buttonText5} borderColor={buttonText5} bgColor='black' textColor={buttonText4} fontSize='12px' fontFamily='Orbitron' textAlign='center' hasArrow label={'Create Profile!'} aria-label='Tooltip'>
                                  <div><IconGlowButton2 icon={PiUserCirclePlusFill} onClick={onOpen1} /></div>
                              </Tooltip>
                              <CreateUserProfile isOpen={isOpen1} onClose={onClose1} />
                            </>
                            }
                          </>
                          }
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
