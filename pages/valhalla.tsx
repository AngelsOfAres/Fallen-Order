import Head from 'next/head'
import React, { useState } from 'react'
import Navbar from 'components/Navbar'
import { Box, Center, Text, VStack, useColorModeValue } from '@chakra-ui/react'
import styles from '../styles/glow.module.css'

export default function test() {
  const gradientText = useColorModeValue(styles.textAnimatedGlowL, styles.textAnimatedGlowD)

  return (
    <>
      <Head>
        <title>Valhalla</title>
        <meta name="description" content="A Literal Valhalla..." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Center>
        <VStack className={gradientText} m={4} w='80%' maxWidth='800px' alignItems='center' textAlign='center' justifyContent='center'>
          <Text fontSize={'28px'}>WELCOME TO VALHALLA!</Text>
          <Text fontSize={'24px'}>Thanks. Come Again...</Text>
        </VStack>
      </Center>
    </>
  )
}
