import { useWallet } from '@txnlab/use-wallet'
import Head from 'next/head'
import Link from 'next/link'
import Account from 'components/MainTools/Account'
import React, { useState } from 'react'
import Connect from 'components/MainTools/Connect'
import Navbar from 'components/Navbar'
import Transact from 'components/MainTools/Transact'
import { Center, useColorModeValue, Text } from '@chakra-ui/react'
import styles2 from '../styles/glow.module.css'
import Footer from 'components/Footer'
import EquipCharacter from 'components/FallenOrder/EquipChar'

export default function Equip() {
  const gradientText = useColorModeValue(styles2.textAnimatedGlowL, styles2.textAnimatedGlowD)

  return (
    <>
      <Head>
        <title>Abyssal Portal - Fallen Order</title>
        <meta name="description" content="Developed by Angels Of Ares" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Text my='48px' className={`${gradientText} responsive-font`}>Character Equip</Text>
      <Center>
        <EquipCharacter />
      </Center>
      <Footer />
    </>
  )
}
