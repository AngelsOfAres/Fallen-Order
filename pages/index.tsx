import { useWallet } from '@txnlab/use-wallet'
import Head from 'next/head'
import Link from 'next/link'
import Account from 'components/MainTools/Account'
import React, { useState } from 'react'
import Connect from 'components/MainTools/Connect'
import Navbar from 'components/Navbar'
import Transact from 'components/MainTools/Transact'
import { Center, useColorModeValue, SimpleGrid, Text, Box, HStack } from '@chakra-ui/react'
import { FullGlowButton } from 'components/Buttons'
import styles2 from '../styles/glow.module.css'
import Footer from 'components/Footer'
import AssetDestroy from 'components/MainTools/AssetDestroy'
import AssetCreate from 'components/MainTools/AssetCreate'
import Holders from 'components/MainTools/Holders'
import MassOpt from 'components/MainTools/MassOpt'
import MassSend from 'components/MainTools/MassSend'
import WalletHoldings from 'components/MainTools/WalletHoldings'
import MassFreeze from 'components/MainTools/MassFreeze'
import UploadCollection from 'components/MainTools/UploadCollection'
import MintCollection from 'components/MainTools/MintCollection'
import MassNFDSearch from 'components/MainTools/MassNFDSearch'
import MassClawback from 'components/MainTools/MassClawback'

export default function Home() {
  const { isActive } = useWallet()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const gradientText = useColorModeValue(styles2.textAnimatedGlowL, styles2.textAnimatedGlowD)
  const xLightColor = useColorModeValue('orange.100','cyan.100')
  const lightColor = useColorModeValue('orange.200','cyan.200')

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
      <Text mb='24px' className='hText pt-2' textAlign='center' textColor={xLightColor}>Any donations sent to degenerate.algo are appreciated<br />Thank you!</Text>
      <Text mb='36px' className='sText pt-2' textAlign='center' textColor={lightColor}>
        Note:<br />This website is fully open sourced<br />
        <a href='https://github.com/AngelsOfAres/Abyssal-Portal' target='_blank' rel='noreferrer'>
          Click to view source code
        </a>
      </Text>
      <Center><FullGlowButton fontsize='16px' text={isActive? 'Wallet' : 'Connect!'} onClick={handleToggleMenu} /></Center>
      {isMenuOpen && (
        <Center my='24px'>
          <Connect />
        </Center>
      )}
      <Center my={4}>
        <HStack spacing='20px'>
        <Link href='/onboard'><FullGlowButton fontsize='16px' text='Onboard Center' /></Link>
          <Link href='/w2w'><FullGlowButton fontsize='16px' text='W2W Search' /></Link>
        </HStack>
      </Center>
      <Center my='48px'>
        <SimpleGrid w='95%' minChildWidth='360px' spacing='24px' justifyItems='center'>
          {isActive ? (
            <>
              <Account />
              <Transact />
              <MassSend />
              <MassOpt />
              <MassNFDSearch />
              <WalletHoldings />
              <Holders />
              <MassFreeze />
              <MassClawback />
              <AssetCreate />
              <AssetDestroy />
              <UploadCollection />
              <MintCollection />
            </>
          ) : 
          <>
            <MassNFDSearch />
            <WalletHoldings />
            <Holders />
            <MassFreeze />
            <MassClawback />
            <UploadCollection />
            <MintCollection />
          </>
          }
        </SimpleGrid>
      </Center>
      <Footer />
    </>
  )
}
