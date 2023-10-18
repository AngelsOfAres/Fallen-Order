import Head from 'next/head'
import Navbar from 'components/Navbar'
import { Center, useColorModeValue, Text } from '@chakra-ui/react'
import styles2 from '../styles/glow.module.css'
import Footer from 'components/Footer'
import ManageCharacter from 'components/FallenOrder/ManageChar'
import React from 'react'
import { useWallet } from '@txnlab/use-wallet'
import Connect from 'components/MainTools/Connect'
import MyBalances from 'components/FallenOrder/components/MyBalances'

export default function Manage() {
  const gradientText = useColorModeValue(styles2.textAnimatedGlowL, styles2.textAnimatedGlowD)
  const { activeAddress } = useWallet()

  return (
    <>
      <Head>
        <title>Abyssal Portal - Fallen Order</title>
        <meta name="description" content="Developed by Angels Of Ares" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      {activeAddress ? 
        <>
          <MyBalances />
          <Text my='24px' className={`${gradientText} responsive-font`}>My Fallen Order</Text>
          <Center>
            <ManageCharacter />
          </Center>
        </>
        :
        <>
          <Text my='40px' className={`${gradientText} responsive-font`}>Connect Wallet</Text>
          <Center><Connect /></Center>
        </>
      }
      <Footer />
    </>
  )
}
