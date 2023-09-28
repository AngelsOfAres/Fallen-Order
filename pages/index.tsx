import { useWallet } from '@txnlab/use-wallet'
import Head from 'next/head'
import Link from 'next/link'
import Account from 'components/Account'
import React, { useState } from 'react'
import Connect from 'components/Connect'
import Navbar from 'components/Navbar'
import Transact from 'components/Transact'
import { Center, useColorModeValue, SimpleGrid, Text } from '@chakra-ui/react'
import { FullGlowButton } from 'components/Buttons'
import styles2 from '../styles/glow.module.css'
import Footer from 'components/Footer'

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
        <title>Fallen Order - Testing Grounds</title>
        <meta name="description" content="Developed by Angels Of Ares" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Text mt='20px' className={`${gradientText} responsive-font`}>Welcome to Algo Hour!</Text>
      <Text mb='24px' className='hText text-center pt-2' textColor={xLightColor}>Any donations sent to support.irl.algo are used to support the show.<br />Thank you!</Text>
      <Center><FullGlowButton fontsize='16px' text={isActive? 'Wallet' : 'Connect!'} onClick={handleToggleMenu} /></Center>
      {isMenuOpen && (
        <Center my='24px'>
          <Connect />
        </Center>
      )}
    <Center  my='20px'><Link href='/w2w'><FullGlowButton fontsize='16px' text='W2W Search' /></Link></Center>
    {isActive ? (
    <Center my='24px'>
      <SimpleGrid w='85%' minChildWidth='275px' spacing='16px' justifyItems='center'>
          <Account />
          <Transact />
      </SimpleGrid>
    </Center>
    ) : null}
    <Footer />
    </>
  )
}
