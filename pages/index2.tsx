import Head from 'next/head'
import { Box, Button, VStack, HStack, Flex, Center, useColorModeValue, Text, Tabs, TabList, TabPanels, Tab, TabPanel,Divider, Image, } from '@chakra-ui/react'
import Link from 'next/link'
import * as React from 'react'
import { Carousel } from 'react-responsive-carousel'
import styles from '../styles/glow.module.css'
import Navbar from 'components/Navbar'
import Footer from 'components/Footer'
import { FullGlowButton } from 'components/Buttons'

export default function FOWelcome() {
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
        <title>Welcome to Fallen Order</title>
        <meta name="description" content="Developed by Angels Of Ares" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Box w='stretch' h="60vh">
            <Flex alignItems='center' justifyContent='space-between'>
              <VStack mt='36px' spacing='20px' w='100%'>

                <Text mb='24px' className={gradientText} fontSize={'32px'}>FALLEN ORDER</Text>

                <Center><Link href='/join'><FullGlowButton fontsize='36px' text='Join The Order' /></Link></Center>
                <Center><Link href='/home'><FullGlowButton fontsize='36px' text='Home Page' /></Link></Center>
                <Center><Link href='/onboard'><FullGlowButton fontsize='36px' text='Get Algorand Wallet' /></Link></Center>

            </VStack>
            </Flex>
            <Footer />
      </Box>
    </>
    );
  }

