import Head from 'next/head'
import React from 'react'
import Navbar from 'components/Navbar'
import { Center, useColorModeValue, Text } from '@chakra-ui/react'
import styles2 from '../styles/glow.module.css'
import Footer from 'components/Footer'
import EquipCharacter from 'components/FallenOrder/EquipChar'
import useWalletBalance from 'hooks/useWalletBalance'

export default function Equip() {
  const gradientText = useColorModeValue(styles2.textAnimatedGlowL, styles2.textAnimatedGlowD)
  const { expBal } = useWalletBalance()

  return (
    <>
      <Head>
        <title>Abyssal Portal - Fallen Order</title>
        <meta name="description" content="Developed by Angels Of Ares" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      {expBal !== -1 ?
        <Text mt='24px' textAlign='center' className={gradientText} fontFamily='Orbitron' fontSize='20px'>Balance: {expBal} $EXP</Text>
      : null}
      <Text my='24px' className={`${gradientText} responsive-font`}>Character Equip</Text>
      <Center>
        <EquipCharacter />
      </Center>
      <Footer />
    </>
  )
}
