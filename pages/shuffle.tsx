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
import { authenticate } from 'utils/auth'
import { FullGlowButton } from 'components/Buttons'
import { useState, useEffect } from 'react'
import Shuffle from 'components/FallenOrder/Shuffle'

export default function MyFO() {
  const gradientText = useColorModeValue(styles2.textAnimatedGlowL, styles2.textAnimatedGlowD)
  const { activeAddress, signTransactions } = useWallet()
  const [ authUser, setAuthUser ] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedAuthUser = localStorage.getItem('token')
      setAuthUser(storedAuthUser || null)
    }
  }, [])

  function handleLogout() {
    localStorage.removeItem('token')
    setAuthUser(null)
  }

  async function handleLogin() {
    const token = await authenticate(activeAddress, signTransactions)
    setAuthUser(token)
  }
  
  return (
    <>
      <Head>
        <title>Fallen Order Shuffle!</title>
        <meta name="description" content="Developed by Angels Of Ares" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Text my='24px' className={`${gradientText} responsive-font`}>SHUFFLE!</Text>
        {activeAddress ? 
          <>
            <Center>
              <Shuffle />
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
