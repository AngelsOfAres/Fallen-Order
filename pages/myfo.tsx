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
import useWalletBalance from 'hooks/useWalletBalance'

export default function MyFO() {
  const gradientText = useColorModeValue(styles2.textAnimatedGlowL, styles2.textAnimatedGlowD)
  const { activeAddress, signTransactions } = useWallet()
  const [ authUser, setAuthUser ] = useState<any>(null)
  
  const { accountInfo } = useWalletBalance()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedAuthUser = localStorage.getItem('token_' + activeAddress);
      setAuthUser(storedAuthUser || null);
    }
  }, [])
  

  function handleLogout() {
    localStorage.removeItem('token_' + activeAddress)
    setAuthUser(null);
  }

  async function handleLogin() {
    const token = await authenticate(activeAddress, signTransactions)
    setAuthUser(token)
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedAuthUser = localStorage.getItem('token_' + activeAddress)
      setAuthUser(storedAuthUser || null)
    }
  }, [accountInfo])
  
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
      {!authUser ?
        <>
          <Text my='24px' className={`${gradientText} responsive-font`}>My Fallen Order</Text>
          <Center m='24px'><FullGlowButton text='Log In!' onClick={handleLogin} /></Center>
        </>
      :
      <>
        <div className='w-full p-6 absolute' style={{textAlignLast: 'right'}}>
          <FullGlowButton text='Log Out' onClick={handleLogout} />
        </div>
        <Text mt='56px' mb='24px' className={`${gradientText} responsive-font`}>My Fallen Order</Text>
        <MyBalances />
        <Center>
          <ManageCharacter />
        </Center>
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
