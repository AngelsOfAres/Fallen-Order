import { useWallet } from '@txnlab/use-wallet'
import Head from 'next/head'
import Link from 'next/link'
import Account from 'components/Account'
import React, { useState } from 'react'
import Connect from 'components/Connect'
import Navbar from 'components/Navbar'
import Transact from 'components/Transact'
import { Center, useColorModeValue, SimpleGrid, Text, Box } from '@chakra-ui/react'
import { FullGlowButton } from 'components/Buttons'
import styles2 from '../styles/glow.module.css'
import Footer from 'components/Footer'
import AssetDestroy from 'components/AssetDestroy'
import AssetCreate from 'components/AssetCreate'
import Holders from 'components/Holders'

export default function Home() {
  const { isActive } = useWallet()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const gradientText = useColorModeValue(styles2.textAnimatedGlowL, styles2.textAnimatedGlowD)
  const xLightColor = useColorModeValue('orange.100','cyan.100')

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <Head>
        <title>The Abyssal Portal</title>
        <meta name="description" content="Developed by Angels Of Ares" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Text mt='20px' className={`${gradientText} responsive-font`}>Abyssal Portal</Text>
      <Text mb='24px' className='hText pt-2' textAlign='center' textColor={xLightColor}>Any donations sent to degenerate.algo are appreciated.<br />Thank you!</Text>
      <Center><FullGlowButton fontsize='16px' text={isActive? 'Wallet' : 'Connect!'} onClick={handleToggleMenu} /></Center>
      {isMenuOpen && (
        <Center my='24px'>
          <Connect />
        </Center>
      )}
      <Center  my='20px'><Link href='/w2w'><FullGlowButton fontsize='16px' text='W2W Search' /></Link></Center>
      <Center my='24px'>
        <SimpleGrid w='95%' minChildWidth='360px' spacing='24px' justifyItems='center'>
          {isActive ? (
            <>
              <Account />
              <Transact />
              <Holders />
              <AssetCreate />
              <AssetDestroy />
            </>
          ) : 
          <Holders />
          }
        </SimpleGrid>
      </Center>
      <Footer />
    </>
  )
}
