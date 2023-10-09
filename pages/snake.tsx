import Head from 'next/head'
import React from 'react'
import Navbar from 'components/Navbar'
import SnakeGame from 'components/Games/SnakeGame'
import { Box, Text, useColorModeValue } from '@chakra-ui/react'
import styles from '../styles/glow.module.css'

export default function snake() {
  const gradientText = useColorModeValue(styles.textAnimatedGlowL, styles.textAnimatedGlowD)

  return (
    <>
      <Head>
        <title>Fallen Order - Snake!</title>
        <meta name="description" content="Developed by Angels Of Ares" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Text textAlign='center' mt='60px' className={`${gradientText} responsive-font`}>Snake!</Text>
      <Box m={6}>
        <SnakeGame />
      </Box>
    </>
  )
}
