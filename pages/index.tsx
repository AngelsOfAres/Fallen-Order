import { useWallet } from '@txnlab/use-wallet'
import Head from 'next/head'
import Link from 'next/link'
import Account from 'components/Account'
import React, { useState } from 'react'
import Connect from 'components/Connect'
import Navbar from 'components/Navbar'
import Transact from 'components/Transact'
import { Box, Center, Grid, GridItem, SimpleGrid, Text } from '@chakra-ui/react'
import styles from "../styles/text.module.css"
import { FullGlowButton } from 'components/Buttons'
import WalletTransactionSearch from 'components/WalletSearch'

export default function Home() {
  const { isReady, isActive } = useWallet()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <Head>
        <title>Fallen Order - Testing Grounds</title>
        <meta name="description" content="Developed by Angels Of Ares" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Text mt='20px' className={styles.hText}>Welcome to Algo Hour!</Text>
      <Text mb='24px' className={styles.sText} textColor='white'>Any donations sent to support.irl.algo are used to support the show. Thank you!</Text>
      <Center><FullGlowButton fontsize='16px' text={isActive? 'Wallet' : 'Connect!'} onClick={handleToggleMenu} /></Center>
      {isMenuOpen && (
        <Center my='24px'>
          <Connect />
        </Center>
      )}
    <Center  my='12px'><Link href='/w2w'><FullGlowButton fontsize='16px' text='W2W Search' /></Link></Center>
    {isActive ? (
    <Center my='24px'>
      <SimpleGrid w='85%' minChildWidth='500px' spacing='16px' justifyItems='center'>
          <Account />
          <Transact />
      </SimpleGrid>
    </Center>
    ) : null}
    </>
  )
}
