import Head from 'next/head'
import { Box, Heading, VStack, HStack, Flex, Center, useColorModeValue, Text, Tabs, TabList, TabPanels, Tab, TabPanel,Divider, } from '@chakra-ui/react'
import Link from 'next/link'
import * as React from 'react'
import { FullGlowButton } from '../components/Buttons'
import Footer from 'components/Footer'
import Navbar from 'components/Navbar'
import styles from '../styles/glow.module.css'

export default function Guide() {
  const gradientText = useColorModeValue(styles.textAnimatedGlowL, styles.textAnimatedGlowD)
  const colorText2 = useColorModeValue('orange.500','cyan.500')
  const buttonText4 = useColorModeValue('orange.100','cyan.100')
  const divider = useColorModeValue('orange.500','cyan.400')

    return (
      <>
      <Head>
        <title>Fallen Order - The Order&apos;s Guide</title>
        <meta name="description" content="Developed by Angels Of Ares" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box w='stretch' h="60vh">
      <Navbar />
            <Flex m={4} alignItems='center' justifyContent='center'>
              <VStack maxWidth='768px' spacing='20px' w='100%'>
                <Center>
                <Heading textAlign='center' mt={4} mb={2} fontSize='29px' className={gradientText}>
                  The Order&apos;s Guide
                </Heading>
                </Center>
                <HStack m={4} w='90%' alignItems='flex-start' justifyContent='space-evenly'>
                  <Box w='full' maxWidth='160px' p={2} fontFamily='Orbitron'>
                    <Center><Text fontSize='14px' className={gradientText}>Step 1</Text></Center>
                    <Center><Divider w='50%' mt={0.5} borderColor={divider}/></Center>
                    <Center mt={2}><Text textAlign='center' fontSize='14px' color={buttonText4}>Join The Order!</Text></Center>
                    <Center mt={2}><Link href='/shuffle'><FullGlowButton fontsize='16px' text='Shuffle' /></Link></Center>
                    <Center mt={2}><Link href='/ge'><FullGlowButton fontsize='16px' text='Grand Exchange' /></Link></Center>
                  </Box>
                  <Box w='full' maxWidth='160px' p={2} fontFamily='Orbitron'>
                    <Center><Text fontSize='14px' className={gradientText}>Step 2</Text></Center>
                    <Center><Divider w='50%' mt={0.5} borderColor={divider}/></Center>
                    <Center mt={2}><Text textAlign='center' fontSize='14px' color={buttonText4}>Stake To Earn!<br />$ORDER/$EXP Daily Drops</Text></Center>
                  </Box>
                  <Box w='full' maxWidth='160px' p={2} fontFamily='Orbitron'>
                    <Center><Text fontSize='14px' className={gradientText}>Step 3</Text></Center>
                    <Center><Divider w='50%' mt={0.5} borderColor={divider}/></Center>
                    <Center mt={2}><Text textAlign='center' fontSize='14px' color={buttonText4}>Trade, Upgrade, Equip, Battle, and More!</Text></Center>
                    <Center mt={2}><a href="https://discord.com/invite/e5xFXAEnwG/" target='_blank' rel='noreferrer'><FullGlowButton text='Discord' /></a></Center>
                  </Box>
                </HStack>
                <Center>
                <Text mt={3} mb={2} fontSize='24px' className={gradientText}>
                  Deep Dive!
                </Text>
                </Center>
                <Tabs w='90%' isFitted size='xs' variant='enclosed' borderColor={colorText2}>
                  <TabList fontWeight='bold' className={gradientText}>
                    <Tab _focus={{boxShadow: 'none'}} _selected={{ borderColor: 'gray.700', borderWidth: '1px'}} fontSize='14px'>Staking</Tab>
                    {/* <Tab _focus={{boxShadow: 'none'}} _selected={{ borderColor: 'gray.700', borderWidth: '1px'}} fontSize='14px'>Raffles</Tab> */}
                    <Tab _focus={{boxShadow: 'none'}} _selected={{ borderColor: 'gray.700', borderWidth: '1px'}} fontSize='14px'>Order&apos;s Chest</Tab>
                    <Tab _focus={{boxShadow: 'none'}} _selected={{ borderColor: 'gray.700', borderWidth: '1px'}} fontSize='14px'>Assets</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel mt={1}>
                        <VStack my={5} textAlign='center' fontSize='14px' textColor={buttonText4} alignItems='center' justifyContent='center'>
                          <Text>Fallen Order NFTs can be staked on our app to earn rewards such as $ORDER & $EXP</Text>
                          <Text>Once an NFT is staked, users may freely list them on marketplaces and move them between wallets</Text>
                          <Text>Our staking app will continue to pay out a staked user until the NFT is staked by another user</Text>
                          <Text>This makes it convenient for users to simply stake their NFT and not have to worry about asset movements</Text>
                        </VStack>
                    </TabPanel>
                    {/* <TabPanel mt={1}>
                        <VStack my={5} textAlign='center' fontSize='14px' textColor={buttonText4} alignItems='center' justifyContent='center'>
                          <Text>Raffles are entered using $RAFFLE tickets. Tickets are purchased with $ORDER via Discord, or via our local shop with multiple other currencies</Text>
                          <Text>Purchasing using $ORDER involves zero blockchain interaction for the user. We utilize clawback to ensure a seamless user experience.</Text>
                          <Text>Our raffle app also functions in a similar manner. You simply click the Enter button and voila you are entered. We use clawback to finalize blockchain transactions on the backend.</Text>
                          <Text>Besides connecting your wallet and opting in for a prize in the case you win, users do not interact with the blockchain</Text>
                          <Text>A seamless user experience!</Text>
                        </VStack>
                    </TabPanel> */}
                    <TabPanel>
                        <VStack my={5} textAlign='center' fontSize='14px' textColor={buttonText4} alignItems='center' justifyContent='center'>
                          <Text>The Order&apos;s Chest represents our holder treasury.</Text>
                          <Text>It is controlled by Angels Of Ares management, however is maintained and operated by holders of the Order.</Text>
                        </VStack>
                        <Center mt={2}><Link href="https://chest.algo.xyz/"><FullGlowButton text='The Order&apos;s Chest' /></Link></Center>
                    </TabPanel>
                    <TabPanel>
                      <Tabs isFitted size='md' w='100%' py={2} variant='enclosed' borderColor={colorText2}>
                          <TabList fontWeight='bold' className={gradientText}>
                            <Tab py={0.5} _focus={{boxShadow: 'none'}} _selected={{ borderColor: 'gray.700', borderWidth: '1px'}} fontSize='12px'>$ORDER</Tab>
                            <Tab py={0.5} _focus={{boxShadow: 'none'}} _selected={{ borderColor: 'gray.700', borderWidth: '1px'}} fontSize='12px'>$EXP</Tab>
                            <Tab py={0.5} _focus={{boxShadow: 'none'}} _selected={{ borderColor: 'gray.700', borderWidth: '1px'}} fontSize='12px'>$BOOST</Tab>
                          </TabList>
                          <TabPanels>
                            <TabPanel mt={1}>
                              <VStack my={5} textAlign='center' fontSize='14px' textColor={buttonText4} alignItems='center' justifyContent='center'>
                                <Text>$ORDER is a utility and voting rights vehicle for the Fallen Order. It can only be accumulated by staking or participation in events.</Text>
                                <Text>This is a soulbound token, meaning it is forever attached to the receiver, and can not be freely traded on the open market, transferred normally, or have a liquidity pool. This ensures that early adopters maintain OG status, and no whale can purchase voting rights to overtake a long-term holder in power at any given time.</Text>
                                <Text>Despite its soulbound nature, $ORDER has usecases within the system itself, such as purchasing $RAFFLE tickets and trading with other users in Discord. More uses will be added as the ecosystem grows.</Text>
                              </VStack>
                            </TabPanel>
                            <TabPanel mt={1}>
                              <VStack my={5} textAlign='center' fontSize='14px' textColor={buttonText4} alignItems='center' justifyContent='center'>
                                <Text>$EXP is part of the on-chain leveling system. When a certain level&apos;s required experience is reached, the owner of the character may spend their $EXP to gain +1 Level applied to on-chain metadata.</Text>
                                <Text>Experience is gained primarily by participation in events. Liquidity pools exist, however will not be funded by the project. This task is left open to holders wishing to create a secondary market for trading, as well as determining its value.</Text>
                                <Text>Experience may be farmed to boost the level of one character, multiple characters, traded among players, or sold on the secondary market for a stream of revenue.</Text>
                                <Text>$EXP is also used across our ecosystem for gambling, betting, trading, and battling!</Text>
                              </VStack>
                            </TabPanel>
                            <TabPanel>
                              <VStack my={5} textAlign='center' fontSize='14px' textColor={buttonText4} alignItems='center' justifyContent='center'>
                                <Text>Stat Boosters are an on-chain NFT used to level up battle stats. Each use boosts one battle stat permanently by +1, by changing its on-chain metadata.</Text>
                                <Text>More details on $BOOST will be released as we approach its roll out.</Text>
                              </VStack>
                            </TabPanel>
                          </TabPanels>
                        </Tabs>
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

