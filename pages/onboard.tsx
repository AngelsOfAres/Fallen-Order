import Head from 'next/head'
import {
  Box,
  Button,
  Heading,
  VStack,
  HStack,
  Flex,
  Center,
  Image,
  useColorModeValue,
  Text,
  Divider,
  keyframes
} from '@chakra-ui/react'
import Link from 'next/link'
import * as React from 'react'
import Navbar from 'components/Navbar'
import { motion } from 'framer-motion'
import styles from '../styles/glow.module.css'
import Footer from 'components/Footer'
import { FullGlowButton } from 'components/Buttons'

export default function Onboard() {
  const introText = "Algorand is a carbon negative, pure proof of stake blockchain which solves the trilemma of decentralization, scalability, and security. Transactions on Algorand cost 0.001A and are finalized in 3.4sec. Both of these variables are static and do not change."
  const walletWarningText = "*Ensure you NEVER share your 25-word seed phrase with anyone! Do not store or screenshot it on any device. Write it down on a piece of paper and store it securely*"
  const buttonText = useColorModeValue('linear(to-tr, red, yellow)', 'linear(to-tr, purple.600, cyan)')
  const buttonText3 = useColorModeValue('orange.500','cyan.500')
  const buttonText4 = useColorModeValue('orange.100','cyan.100')
  const buttonText5 = useColorModeValue('orange.300','cyan.300')
  const gradientText = useColorModeValue(styles.textAnimatedGlowL, styles.textAnimatedGlowD)
  
    const animationKeyframes2 = keyframes`
        0% { transform: scale(1.04)}
        25% { transform: scale(1)}
        50% { transform: scale(1.04)}
        75% { transform: scale(1)}
        100% { transform: scale(1.04)}
        `
  
    const animation2 = `${animationKeyframes2} 3s ease-in-out infinite`

    return (
      <>
      <Head>
        <title>Get Onboarded To Algorand!</title>
        <meta name="description" content="Developed by Angels Of Ares" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Box w='stretch' h="100%">
            <Text textAlign='center' my='60px' className={`${gradientText} responsive-font`}>Onboarding Center</Text>
            <Center>
            <VStack w='80%' alignItems='center' spacing='36px'>
              <Text fontSize='24px' className={gradientText}>
                1 - Intro
              </Text>
              <Text textAlign='center' fontWeight='hairline' fontSize='20px' textColor={buttonText4}>
                {introText}
              </Text>
              <Divider w='30%' minW='240px' borderColor={buttonText3} />
              <Text fontSize='24px' className={gradientText}>
                2 - Wallets
              </Text>
              <HStack w='90%' maxW='600px' spacing='60px' justifyContent='center'>
                <VStack alignItems='center' spacing='36px'>
                  <Text textAlign='center' fontFamily="Orbitron" fontSize='20px' textColor={buttonText4}>
                    Pera
                  </Text>
                  <Box as={motion.div} animation={animation2} boxSize='28'><Link href="https://perawallet.app/" passHref><Image src="/Pera Logo.png" alt="Pera Wallet"></Image></Link></Box>
                </VStack>
                <VStack alignItems='center'>
                <Text textAlign='center' fontFamily="Orbitron" fontSize='20px' textColor={buttonText4}>
                  Defly
                </Text>
                <Box as={motion.div} animation={animation2} boxSize='28'><Link href="https://defly.app/" passHref><Image src="/Defly Logo.png" alt="Defly Wallet" borderRadius='2xl'></Image></Link></Box>
                </VStack>
                <VStack alignItems='center'>
                <Text textAlign='center' fontFamily="Orbitron" fontSize='20px' textColor={buttonText4}>
                  Daffi
                </Text>
                <Box as={motion.div} animation={animation2} boxSize='28'><Link href="https://www.daffione.com/" passHref><Image src="/Daffi Logo.png" alt="Daffi Wallet" borderRadius='2xl'></Image></Link></Box>
                </VStack>
              </HStack>
              <Text textAlign='center' fontWeight='hairline' fontSize='16px' textColor={buttonText4}>
                {walletWarningText}
              </Text>
              <Divider w='30%' minW='240px' borderColor={buttonText3} />
              <Text className="hFont" textColor={buttonText3}>
                3 - Charts/Aggregators
              </Text>
              <VStack h='stretch' alignItems='center' justifyContent='space-between'>
                    <Box as={motion.div} animation={animation2} boxSize='24'>
                      <Text mb={1} textAlign='center' fontFamily="Orbitron" fontSize='14px' textColor={buttonText5}>Vestige</Text>
                      <Link href="https://vestige.fi/" passHref><Image src="/Vestige Logo.png" alt="Vestige" borderRadius='2xl'></Image></Link>
                    </Box>
              </VStack>
              <Divider w='30%' minW='240px' borderColor={buttonText3} />
              <Text fontSize='24px' className={gradientText}>
                4 - DeFi
              </Text>
              <VStack alignItems='center' justifyContent='space-between' spacing='36px'>
                  <Text mb={4} textAlign='center' fontFamily="Orbitron" fontSize='16px' textColor={buttonText4}>
                    Below are examples of the top projects leading the Algorand DeFi space:
                  </Text>
                  <HStack py='40px' spacing='60px'>
                    <Box as={motion.div} animation={animation2} boxSize='24'>
                      <Text mb={1} textAlign='center' fontFamily="Orbitron" fontSize='14px' textColor={buttonText5}>Tinyman</Text>
                      <Link href="https://tinyman.org/?utm_source=AngelofAres-Onboarder&utm_medium=utm" passHref><Image src="/Tinyman Logo.png" alt="Tinyman" borderRadius='2xl'></Image></Link>
                    </Box>
                    <Box as={motion.div} animation={animation2} boxSize='24'>
                      <Text mb={1} textAlign='center' fontFamily="Orbitron" fontSize='14px' textColor={buttonText5}>Humble DeFi</Text>
                      <Link href="https://www.humble.sh/" passHref><Image src="/Humble Logo.png" alt="Humble DeFi" borderRadius='2xl'></Image></Link>
                    </Box>
                  </HStack>
                  <HStack py='40px' spacing='60px'>
                  <Box as={motion.div} animation={animation2} boxSize='24'>
                    <Text mb={1} textAlign='center' fontFamily="Orbitron" fontSize='14px' textColor={buttonText5}>Folks Finance</Text>
                    <Link href="https://folks.finance/" passHref><Image src="/Folks Logo.png" alt="Folks Finance" borderRadius='2xl'></Image></Link>
                  </Box>
                  <Box as={motion.div} animation={animation2} boxSize='24'>
                    <Text mb={1} textAlign='center' fontFamily="Orbitron" fontSize='14px' textColor={buttonText5}>XBacked</Text>
                    <Link href="https://www.xbacked.io/" passHref><Image src="/XBacked Logo.png" alt="XBacked" borderRadius='2xl'></Image></Link>
                  </Box>
                  </HStack>
              </VStack>
              <Divider w='30%' minW='240px' borderColor={buttonText3} />
              <Text fontSize='24px' className={gradientText}>
                5 - NFTs
              </Text>
              <VStack h='stretch' alignItems='center' justifyContent='space-between' spacing='36px'>
                  <Text textAlign='center' fontFamily="Orbitron" fontSize='16px'  textColor={buttonText4}>
                    Analytics/Data
                  </Text>
                  <HStack p={2} spacing='36px'>
                    <Box as={motion.div} animation={animation2} boxSize='28'>
                      <Text mb={1} textAlign='center' fontFamily="Orbitron" fontSize='14px' textColor={buttonText5}>NFTExplorer</Text>
                      <Link href="https://nftexplorer.app/" passHref><Image src="/NFTExplorer Logo.png" alt="NFTExplorer" borderRadius='2xl'></Image></Link>
                    </Box>
                    <Box as={motion.div} animation={animation2} boxSize='28'>
                      <Text mb={1} textAlign='center' fontFamily="Orbitron" fontSize='14px' textColor={buttonText5}>Asalytic</Text>
                      <Link href="https://www.asalytic.app/" passHref><Image src="/Asalytic Logo.png" alt="Asalytic" borderRadius='2xl'></Image></Link>
                    </Box>
                    <Box as={motion.div} animation={animation2} boxSize='28'>
                      <Text mb={1} textAlign='center' fontFamily="Orbitron" fontSize='14px' textColor={buttonText5}>Gator Finance</Text>
                      <Link href="https://algogator.finance/" passHref><Image src="/Gator Logo.png" alt="AlgoGator" borderRadius='2xl'></Image></Link>
                    </Box>
                  </HStack>
                  <Text pt={8} textAlign='center' fontFamily="Orbitron" fontSize='16px' textColor={buttonText4}>
                    Marketplaces
                  </Text>
                  <HStack p={2} spacing='36px'>
                    <Box as={motion.div} animation={animation2} boxSize='24'>
                      <Text mb={1} textAlign='center' fontFamily="Orbitron" fontSize='14px' textColor={buttonText5}>ALGOxNFT</Text>
                      <Link href="https://algoxnft.com/" passHref><Image src="/ALGOxNFT Logo.png" alt="ALGOxNFT" borderRadius='2xl'></Image></Link>
                    </Box>
                    <Box as={motion.div} animation={animation2} boxSize='24'>
                      <Text mb={1} textAlign='center' fontFamily="Orbitron" fontSize='14px' textColor={buttonText5}>AlgoGems</Text>
                      <Link href="https://www.algogems.io/" passHref><Image src="/AlgoGems Logo.png" alt="AlgoGems" borderRadius='2xl'></Image></Link>
                    </Box>
                  </HStack>
              </VStack>
              <Divider w='30%' minW='240px' borderColor={buttonText3} />
              <Text fontSize='24px' className={gradientText}>
                6 - Tooling
              </Text>
              <VStack h='stretch' alignItems='center' justifyContent='space-between' spacing='36px'>
                  <Text textAlign='center' fontFamily="Orbitron" fontSize='16px' textColor={buttonText4}>
                    Wallet & asset management tools for users and creators. Both examples below are fully open sourced!
                  </Text>
                  <HStack p={2} spacing='60px'>
                    <Box as={motion.div} animation={animation2} boxSize='28'>
                      <Text mb={1} textAlign='center' fontFamily="Orbitron" fontSize='14px' textColor={buttonText5}>Evil Tools</Text>
                      <Link href="https://evil-tools.thurstober.com/" passHref><Image src="/Eviltools Logo.png" alt="Evil Tools - Thurstober" borderRadius='2xl'></Image></Link>
                    </Box>
                    <Box as={motion.div} animation={animation2} boxSize='28'>
                      <Text mb={1} textAlign='center' fontFamily="Orbitron" fontSize='14px' textColor={buttonText5}>Abyssal Portal</Text>
                      <Link href="https://order.algo.xyz/" passHref><Image src="/fallenlogo.png" alt="Abyssal Portal - Angels Of Ares" borderRadius='2xl'></Image></Link>
                    </Box>
                  </HStack>
              </VStack>
              <Divider w='30%' minW='240px' borderColor={buttonText3} />
              <Text fontSize='24px' className={gradientText}>
                7 - P2P Trading
              </Text>
              <VStack h='stretch' alignItems='center' justifyContent='space-between' spacing='36px'>
                  <Text textAlign='center' fontFamily="Orbitron" fontSize='16px' textColor={buttonText4}>
                    Always use secure tools to conduct trades with other users off marketplaces
                  </Text>
                  <Text textAlign='center' fontFamily="Orbitron" fontSize='16px' textColor={buttonText4}>
                    The apps below help ensure a trustless swap 
                  </Text>
                  <HStack p={2} spacing='36px'>
                    <Box as={motion.div} animation={animation2} boxSize='24'>
                      <Text mb={1} textAlign='center' fontFamily="Orbitron" fontSize='14px' textColor={buttonText5}>Swapper</Text>
                      <Link href="https://app.swapper.tools/" passHref><Image src="/Swapper Logo.png" alt="Swapper" borderRadius='2xl'></Image></Link>
                    </Box>
                    <Box as={motion.div} animation={animation2} boxSize='24'>
                      <Text mb={1} textAlign='center' fontFamily="Orbitron" fontSize='14px' textColor={buttonText5}>Atomixwap</Text>
                      <Link href="https://atomixwap.xyz/" passHref><Image src="/Atomixwap Logo.png" alt="Atomixwap" borderRadius='2xl'></Image></Link>
                    </Box>
                  </HStack>
              </VStack>
              <Divider w='30%' minW='240px' borderColor={buttonText3} />
              <Text fontSize='24px' className={gradientText}>
                8 - Develop/Build
              </Text>
              <VStack h='stretch' alignItems='center' justifyContent='space-between' spacing='36px'>
                  <Text textAlign='center' fontFamily="Orbitron" fontSize='16px' textColor={buttonText4}>
                    Everything you need to build efficiently on Algorand
                  </Text>
                  <HStack p={2} spacing='36px'>
                    <Box as={motion.div} animation={animation2} boxSize='24'>
                      <Text mb={1} textAlign='center' fontFamily="Orbitron" fontSize='14px' textColor={buttonText5}>Dev Portal</Text>
                      <Link href="https://developer.algorand.org/" passHref><Image p='4' src="/algologo.png" alt="Algorand Official" borderRadius='2xl'></Image></Link>
                    </Box>
                    <Box as={motion.div} animation={animation2} boxSize='24'>
                      <Text mb={1} textAlign='center' fontFamily="Orbitron" fontSize='14px' textColor={buttonText5}>Reach Lang</Text>
                      <Link href="https://docs.reach.sh/" passHref><Image src="/Reach Logo.png" alt="Reach Lang" borderRadius='2xl'></Image></Link>
                    </Box>
                  </HStack>
              </VStack>
              <Divider w='30%' minW='240px' borderColor={buttonText3} />
              <Text fontSize='24px' className={gradientText}>
                FREE NFT!
              </Text>
              <VStack h='stretch' alignItems='center' justifyContent='space-between' spacing='36px' textColor={buttonText5}>
                  <Text textAlign='center' fontFamily="Orbitron" fontSize='16px' textColor={buttonText4}>
                    Ready to get your first NFT?
                  </Text>
                  <Text textAlign='center' fontFamily="Orbitron" fontSize='16px' textColor={buttonText4}>
                    Join our Discord to claim our &quot;Medal Of Algorand&quot;, a symbolic NFT we give out to newcomers as a gift!
                  </Text>
                    <Box as={motion.div} animation={animation2} boxSize='48'>
                      <Link href="https://explorer.perawallet.app/assets/626636356/" passHref><Image src="/MoA Logo.png" alt="Algorand Official" borderRadius='lg'></Image></Link>
                    </Box>
                    <Center m={4}><Link href="https://discord.com/invite/e5xFXAEnwG/"><FullGlowButton text='Discord' /></Link></Center>
              </VStack>
            </VStack>
            </Center>
      </Box>
      <Footer />
    </>
    )
  }