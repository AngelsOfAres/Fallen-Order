import Head from 'next/head'
import Navbar from 'components/Navbar'
import { Center, useColorModeValue, Text } from '@chakra-ui/react'
import styles2 from '../styles/glow.module.css'
import Footer from 'components/Footer'
import React from 'react'
import { useWallet } from '@txnlab/use-wallet'
import Connect from 'components/MainTools/Connect'
import Shuffle from 'components/FallenOrder/Shuffle'

export default function MainShuffle() {
  const gradientText = useColorModeValue(styles2.textAnimatedGlowL, styles2.textAnimatedGlowD)
  const { activeAddress } = useWallet()
  
  return (
    <>
      <Head>
        <title>Fallen Order Shuffle!</title>
        <meta name="description" content="Developed by Angels Of Ares" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Text mt='36px' className={`${gradientText} responsive-font`}>SHUFFLE</Text>
        {activeAddress ? 
          <>
            <Center>
              <Shuffle />
            </Center>
          </>
          :
          <>
            <Text my='40px' fontSize='18px' className={gradientText}>Connect Wallet</Text>
            <Center><Connect /></Center>
          </>
        }
      <Footer />
    </>
  )
}
