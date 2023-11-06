import Head from 'next/head'
import Navbar from 'components/Navbar'
import { Center, useColorModeValue, Text } from '@chakra-ui/react'
import styles from '../styles/glow.module.css'
import Footer from 'components/Footer'
import React from 'react'
import { useWallet } from '@txnlab/use-wallet'
import Connect from 'components/MainTools/Connect'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

export default function TestPage() {
  const gradientText = useColorModeValue(styles.textAnimatedGlowL, styles.textAnimatedGlowD)
  const { activeAddress, signTransactions } = useWallet()
  const [ authUser, setAuthUser ] = useState<any>(null)
  
  return (
    <>
      <Head>
        <title>Fallen Order - Test Page</title>
        <meta name="description" content="Developed by Angels Of Ares" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      {activeAddress ?
      <>
        {!authUser ?
          <>
            <Text my='24px' className={`${gradientText} responsive-font`}>Test Page</Text>
          </>
        :
        <>
        </>
        }
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