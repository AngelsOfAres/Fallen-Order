import Head from 'next/head'
import { Box, Button, VStack, HStack, Flex, Center, useColorModeValue, Text, Tabs, TabList, TabPanels, Tab, TabPanel,Divider, Image, } from '@chakra-ui/react'
import Link from 'next/link'
import * as React from 'react'
import { Carousel } from 'react-responsive-carousel'
import styles from '../styles/glow.module.css'
import Navbar from 'components/Navbar'
import Footer from 'components/Footer'
import { FullGlowButton } from 'components/Buttons'

export default function Home() {
  const colorText2 = useColorModeValue('orange.500','cyan.500')
  const buttonText3 = useColorModeValue('orange.500','cyan.500')
  const buttonText4 = useColorModeValue('orange.100','cyan.100')
  const divider = useColorModeValue('orange.500','cyan.400')
  const bodyText2a = 'Fallen Order is an onchain RPG'
  const bodyText2b = 'Get a character and start your journey with The Order!'
  const bodyText2c = 'Equip your character with various equipment, adjust your stats, swap abilities, complete quests for soulbound achievements and rewards, battle bosses and PvP for glory in The Thunderdome, grind your skills in The Wilderness, level up and much more.'
  const bodyText4 = "Form endless variations of characters with equippable backgrounds and wearables."
  const bodyText5 = 'Each character has a unique set of traits such as Level, Kinship, Woodcutting, Mining, Battle Stats, and more.'
  const bodyText5a = 'Most character traits are dynamic and constantly change as players upgrade or adjust their characters in-game'
  const bodyText5b = 'Build your character up to the top ranks of The Order!'
  const kinshipText1 = 'Kinship describes the relationship between master and character'
  const kinshipText2 = 'Higher kinship means the character is well taken care of over time'
  const kinshipText3 = 'Players may interact with a character once every 24 hours to gain +1 kinship applied to on-chain metadata'
  const kinshipText4 = 'Kinship may be Absorbed using Kinship Potions to freely trade or use on other characters'
  const head1 ='The Fallen Order are divine pixelated beings.'
  const head2 = 'Civil war has torn them into factions of Light and Dark.'
  const head3 = 'However, their fury could not be contained within their sacred realm...'
  const head4 = 'The Fallen have arrived...bringing their chaos to Algorand!'
  const gradientText = useColorModeValue(styles.textAnimatedGlowL, styles.textAnimatedGlowD)
  const boxGlow = useColorModeValue(styles.boxGlowL, styles.boxGlowD)

    return (
      <>
      <Head>
        <title>Fallen Order - Home</title>
        <meta name="description" content="Developed by Angels Of Ares" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Box w='stretch' h="60vh">
            <Flex alignItems='center' justifyContent='space-between'>
              <VStack mt={2} spacing='20px' w='100%'>
              <Center>
              <VStack w='100%' overflow='hidden' borderRadius='xl'> 
                    <Text mb={-2} fontSize='8px' textColor={buttonText4}>Ads:</Text>
                    <Box minW='350px' w='25%'>
                        <Carousel showThumbs={false} showIndicators={false} showArrows={false} showStatus={false} infiniteLoop autoPlay emulateTouch interval={5000} swipeScrollTolerance={3}>
                          <Box p={2} px={5}>
                              <a href='https://fallenorder.xyz/' target='_blank' rel='noreferrer'><Image borderTopRadius='xl' borderBottomRadius='xl' alt='Fallen Order' src='fallenad1.png' /></a>
                          </Box>
                          <Box p={6} py={2}>
                              <a href='https://algoxnft.com/shuffle/1385' target='_blank' rel='noreferrer'><Image borderTopRadius='xl' borderBottomRadius='xl' alt='Join The Pards! - AlgoPard' src='algopardad1.png' /></a>
                          </Box>
                          <Box p={2} px={5}>
                              <a href='https://angelsofares.xyz/ghost' target='_blank' rel='noreferrer'><Image borderTopRadius='xl' borderBottomRadius='xl' alt='Ghosts Of Algo' src='ghost.png' /></a>
                          </Box>
                          <Box p={2} px={5}>
                              <a href='https://www.algoleagues.com/' target='_blank' rel='noreferrer'><Image borderTopRadius='xl' borderBottomRadius='xl' alt='AlgoLeagues' src='alcad.png' /></a>
                          </Box>
                        </Carousel>
                    </Box>
                    </VStack>
                </Center>

                <VStack className={gradientText} m={4} w='80%' maxWidth='800px' alignItems='center' textAlign='center' justifyContent='center'>
                  <Text fontSize={'20px'}>{head1}</Text>
                  <Text fontSize={'20px'}>{head2}</Text>
                  <Text fontSize={'20px'}>{head3}</Text>
                  <Text fontSize={'20px'}>{head4}</Text>
                </VStack>

                <Flex maxW='800px' pt={4} flexDirection="row" flexWrap="wrap" justifyContent='center' gap='12px'>
                    <Link href='/myfo'><FullGlowButton fontsize='16px' text='MY FO' /></Link>
                    <Link href='/shuffle'><FullGlowButton fontsize='16px' text='SHUFFLE' /></Link>
                    <Link href='/shuffle'><FullGlowButton fontsize='16px' text='GRAND EXCHANGE' /></Link>
                    <a href="https://www.nftexplorer.app/collection/fallen-order" rel='noreferrer' target='_blank'><FullGlowButton text='COLLECTION' /></a>
                    <Link href='/guide'><FullGlowButton text='GUIDE' /></Link>
                </Flex>
                <Flex maxW='800px' pb={4} flexDirection="row" flexWrap="wrap" justifyContent='center' gap='12px'>
                    <Link href='/onboard'><FullGlowButton fontsize='16px' text='ONBOARD' /></Link>
                    <Link href='/tools'><FullGlowButton fontsize='16px' text='TOOLS' /></Link>
                    <Link href='/w2w'><FullGlowButton fontsize='16px' text='W2W SEARCH' /></Link>
                </Flex>

                <Divider w='60%' maxWidth='350px' borderColor={divider}/>
                  <VStack className='responsive-text'  w='80%' maxW='800px' p={2}>
                    <Center><Text fontSize='20px' className={gradientText}>Unique Utility</Text></Center>
                      <Divider w='5%' minW='80px' my={0.5} borderColor={divider}/>
                    <Center><Text align='center' color={buttonText4}>{bodyText2a}</Text></Center>
                    <Center><Text align='center' color={buttonText4}>{bodyText2b}</Text></Center>
                    <Center><Text align='center' color={buttonText4}>{bodyText2c}</Text></Center>
                  </VStack>
                  <VStack className='responsive-text' w='80%' maxW='800px' p={2}>
                    <Center><Text fontSize='20px' className={gradientText}>Unique NFTs</Text></Center>
                      <Divider w='5%' minW='80px' my={0.5} borderColor={divider}/>
                    <Center><Text align='center' color={buttonText4}>{bodyText4}</Text></Center>
                    <Center><Text align='center' color={buttonText4}>{bodyText5}</Text></Center>
                    <Center><Text align='center' color={buttonText4}>{bodyText5a}</Text></Center>
                    <Center><Text align='center' color={buttonText4}>{bodyText5b}</Text></Center>
                  </VStack>
                <Divider w='60%' maxWidth='350px' borderColor={divider}/>
                <Center><Box my={2} fontSize={'24px'} className={gradientText}>Collection Overview</Box></Center>
                <Tabs isFitted size='md' w='95%' maxWidth='768px' variant='enclosed' borderColor={colorText2}>
                  <TabList fontWeight='bold' className={gradientText}>
                    <Tab py={0.5} _focus={{boxShadow: 'none'}} fontSize={'12px'}>Supply</Tab>
                    <Tab py={0.5} _focus={{boxShadow: 'none'}} fontSize={'12px'}>Traits</Tab>
                    <Tab py={0.5} _focus={{boxShadow: 'none'}} fontSize={'12px'}>Assets</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel mt={1}>
                      <HStack my={5} justifyContent='space-evenly'>
                          <VStack fontSize={'12px'} fontWeight='bold' alignItems='center'>
                            <Text className={gradientText} my={2} fontSize='12px'>Rank</Text>
                            <Text textColor={buttonText4}>Immortals</Text>
                            <Text textColor={buttonText4}>Empyreals</Text>
                            <Text textColor={buttonText4}>Ethereals</Text>
                            <Text textColor={buttonText4}>Celestials</Text>
                            <Text textColor={buttonText4}>Angels</Text>
                          </VStack>
                          <VStack fontSize={'12px'} alignItems='center'>
                            <Text className={gradientText} my={2} fontSize='12px'>Editions</Text>
                            <Text textColor={buttonText4}>1</Text>
                            <Text textColor={buttonText4}>2</Text>
                            <Text textColor={buttonText4}>3</Text>
                            <Text textColor={buttonText4}>4</Text>
                            <Text textColor={buttonText4}>5</Text>
                          </VStack>
                          <VStack fontSize={'12px'} textColor={buttonText4} alignItems='center'>
                            <Text className={gradientText} my={2} fontSize='12px'>Total</Text>
                            <Text textColor={buttonText4}> 16</Text>
                            <Text textColor={buttonText4}> 64</Text>
                            <Text textColor={buttonText4}> 216</Text>
                            <Text textColor={buttonText4}> 768</Text>
                            <Text textColor={buttonText4}> 3240</Text>
                          </VStack>
                        </HStack>
                        <Center m={3} fontSize={'20px'} className={gradientText}>Total = 4304</Center>
                    </TabPanel>
                    <TabPanel>
                        <Tabs isFitted size='md' w='100%' py={2} variant='enclosed' borderColor={colorText2}>
                          <TabList fontWeight='bold' className={gradientText}>
                            <Tab py={0.5} _focus={{boxShadow: 'none'}} fontSize={'12px'}>Faction</Tab>
                            <Tab py={0.5} _focus={{boxShadow: 'none'}} fontSize={'12px'}>Ranks</Tab>
                            <Tab py={0.5} _focus={{boxShadow: 'none'}} fontSize={'12px'}>Stats</Tab>
                            <Tab py={0.5} _focus={{boxShadow: 'none'}} fontSize={'12px'}>Kinship</Tab>
                          </TabList>
                          <TabPanels>
                            <TabPanel mt={1}>
                                <Center my={5} textAlign='center' fontWeight='bold' fontSize={'14px'} className={gradientText}>LIGHT & DARK</Center>
                                <Center textAlign='center' fontWeight='bold' fontSize='9px' textColor={buttonText4}>The frame surrounding each NFT represents the faction it belongs to.</Center>
                                <VStack mt={4} spacing='20px' w='100%'>
                                  <Center>
                                  <Box className={boxGlow} mx={6} borderRadius='lg' boxSize={32} bgColor={buttonText4} borderColor={buttonText3} borderWidth='0.5px'>
                                    <Image borderRadius='lg' borderColor={buttonText3} borderWidth='0.5px' src="/Wframe.png" alt="Light Faction Frame"></Image>
                                  </Box>
                                  <Box className={boxGlow} mx={6} borderRadius='lg' boxSize={32} bgColor={buttonText4} borderColor={buttonText3} borderWidth='0.5px'>
                                    <Image borderRadius='lg' borderWidth='0.5px' src="/Bframe.png" alt="Dark Faction Frame"></Image>
                                  </Box>
                                  </Center>
                                </VStack>
                            </TabPanel>
                            <TabPanel mt={1}>
                              <HStack my={4} alignItems='center' justifyContent='space-evenly'>
                              <VStack fontSize='10px' fontWeight='bold' textColor={buttonText4} alignItems='center'>
                                <Text className={gradientText} mb={2} fontSize='14px'>#</Text>
                                <Text>5</Text>
                                <Text>4</Text>
                                <Text>3</Text>
                                <Text>2</Text>
                                <Text>1</Text>
                              </VStack>
                              <VStack fontSize='10px' fontWeight='bold' textColor={buttonText4} alignItems='center' spacing='5px'>
                                <Text className={gradientText} mb={1} fontSize='14px'>Gems</Text>
                                <Image src="/rank5.png" alt="Rank 5 - Immortal"></Image>
                                <Image src="/rank4.png" alt="Rank 4 - Empyreal"></Image>
                                <Image src="/rank3.png" alt="Rank 3 - Ethereal"></Image>
                                <Image src="/rank2.png" alt="Rank 2 - Celestial"></Image>
                                <Image src="/rank1.png" alt="Rank 1 - Angel"></Image>
                              </VStack>
                              <VStack fontSize='10px' textColor={buttonText4} alignItems='center'>
                                <Text className={gradientText} mb={2} fontSize='14px'>Name</Text>
                                <Text>Immortal</Text>
                                <Text>Empyreal</Text>
                                <Text>Ethereal</Text>
                                <Text>Celestial</Text>
                                <Text>Angel</Text>
                              </VStack>
                            </HStack>
                            </TabPanel>
                            <TabPanel>
                                <Center textAlign='center' my={5} fontSize={'14px'} className={gradientText}>
                                <Text>Each character has four battle stats:</Text>
                                </Center>
                                <HStack my={6} fontSize={'16px'} textColor={buttonText4} alignItems='center' justifyContent='space-evenly'>
                                  <Box className={boxGlow} borderWidth='0.5px' borderRadius='lg' borderColor={buttonText3} p={2}><Text>HP</Text></Box>
                                  <Box className={boxGlow} borderWidth='0.5px' borderRadius='lg' borderColor={buttonText3} p={2}><Text>ATK</Text></Box>
                                  <Box className={boxGlow} borderWidth='0.5px' borderRadius='lg' borderColor={buttonText3} p={2}><Text>DEF</Text></Box>
                                  <Box className={boxGlow} borderWidth='0.5px' borderRadius='lg' borderColor={buttonText3} p={2}><Text>AP</Text></Box>
                                </HStack>
                                <Center textAlign='center' mt={8} mb={5} fontSize={'14px'} className={gradientText}>
                                <Text>As well as various other stats:</Text>
                                </Center>
                                <HStack my={6} fontSize={'16px'} textColor={buttonText4} alignItems='center' justifyContent='space-evenly'>
                                  <Box className={boxGlow} borderWidth='0.5px' borderRadius='lg' borderColor={buttonText3} p={2}><Text>Rank</Text></Box>
                                  <Box className={boxGlow} borderWidth='0.5px' borderRadius='lg' borderColor={buttonText3} p={2}><Text>LVL</Text></Box>
                                  <Box className={boxGlow} borderWidth='0.5px' borderRadius='lg' borderColor={buttonText3} p={2}><Text>Kinship</Text></Box>
                                  <Box className={boxGlow} borderWidth='0.5px' borderRadius='lg' borderColor={buttonText3} p={2}><Text>Skill*</Text></Box>
                                </HStack>
                                <Center textAlign='center' my={6} fontSize={'12px'} textColor={buttonText4}>
                                  *Each Skill is reflected as its own trait. For example, Woodcutting and Mining.
                                </Center>
                            </TabPanel>
                            <TabPanel>
                              <Center textAlign='center' my={3} mt={5} textColor={buttonText4}>
                                <Text fontSize={'12px'}>{kinshipText1}</Text>
                              </Center>
                              <Center textAlign='center' my={3} mt={5} textColor={buttonText4}>
                                <Text fontSize={'12px'}>{kinshipText2}</Text>
                              </Center>
                              <Center textAlign='center' my={3} mt={5} textColor={buttonText4}>
                                <Text fontSize={'12px'}>{kinshipText3}</Text>
                              </Center>
                              <Center textAlign='center' my={3} mt={5} textColor={buttonText4}>
                                <Text fontSize={'12px'}>{kinshipText4}</Text>
                              </Center>
                            </TabPanel>
                          </TabPanels>
                        </Tabs>
                        </TabPanel>
                        <TabPanel>
                            <VStack w='stretch'>
                            <HStack w='stretch' mt={5} mb={2} fontSize={'14px'} className={gradientText} alignItems='center' justifyContent='space-between'>
                            <Text fontSize='14px'>Asset</Text>
                            <Text fontSize='14px'>Description:</Text>
                            </HStack>
                            <HStack w='stretch' textAlign='right' my={4} fontSize={'12px'} textColor={buttonText4} alignItems='center' justifyContent='space-between'>
                            <Box mx={1} textAlign='left' w='30%'><Link href='https://explorer.perawallet.app/assets/811718424/'>$ORDER</Link></Box>
                            <Text fontSize='9px'>Voting vehicle for holders of Fallen Order, various uses within the ecosystem. Soulbound token.</Text>
                            </HStack>
                            <HStack w='stretch' textAlign='right' my={4} fontSize={'12px'} textColor={buttonText4} alignItems='center' justifyContent='space-between'>
                            <Box mx={1} textAlign='left' w='30%'><Link href='https://explorer.perawallet.app/assets/811721471'>$EXP</Link></Box>
                            <Text fontSize='9px'>Experience token used for leveling characters, betting, and battling. Freely traded on the open market.</Text>
                            </HStack>
                            <HStack w='stretch' textAlign='right' my={4} fontSize={'12px'} textColor={buttonText4} alignItems='center' justifyContent='space-between'>
                            <Box mx={1} textAlign='left' w='30%'><Link href='https://explorer.perawallet.app/assets/815766197'>$RAFFLE</Link></Box>
                            <Text fontSize='9px'>Raffle Tickets. Used to enter raffles for various prizes. Freely traded on the open market.</Text>
                            </HStack>
                            <HStack w='stretch' textAlign='right' my={4} fontSize={'12px'} textColor={buttonText4} alignItems='center' justifyContent='space-between'>
                            <Box mx={1} textAlign='left' w='30%'><Link href='https://explorer.perawallet.app/assets/815771120'>$BOOST</Link></Box>
                            <Text fontSize='9px'>Stat Booster. Used to boost any battle stat by +1. Freely traded on the open market.</Text>
                            </HStack>
                            </VStack>
                        </TabPanel>
                      </TabPanels>
                    </Tabs>
              </VStack>
            </Flex>
            <Footer />
      </Box>
    </>
    );
  }

