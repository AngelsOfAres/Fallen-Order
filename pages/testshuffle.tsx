import Head from 'next/head'
import Navbar from 'components/Navbar'
import { Center, useColorModeValue, Text } from '@chakra-ui/react'
import styles2 from '../styles/glow.module.css'
import Footer from 'components/Footer'
import React from 'react'
import { useWallet } from '@txnlab/use-wallet'
import Connect from 'components/MainTools/Connect'
import TestShuffle from 'components/FallenOrder/TestShuffle'

export default function ShuffleBVM() {
  const gradientText = useColorModeValue(styles2.textAnimatedGlowL, styles2.textAnimatedGlowD)
  const { activeAddress } = useWallet()
  
  return (
    <>
      <Head>
        <title>Fallen Order - Test Shuffle!</title>
        <meta name="description" content="Developed by Angels Of Ares" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Text mt='36px' className={`${gradientText} responsive-font`}>TEST SHUFFLE!</Text>
        {activeAddress ? 
          <>
            <Center>
              <TestShuffle />
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
