import Head from 'next/head'
import Navbar from 'components/Navbar'
import { Center, useColorModeValue, Text, Box, Container, Circle, Flex } from '@chakra-ui/react'
import styles from '../styles/glow.module.css'
import Footer from 'components/Footer'
import React, { useEffect, useState } from 'react'
import Connect from 'components/MainTools/Connect'
import { useWallet } from '@txnlab/use-wallet'
import { FullGlowButton } from 'components/Buttons'


export default function TestPage() {
  const gradientText = useColorModeValue(styles.textAnimatedGlowL, styles.textAnimatedGlowD)
  const { activeAddress, signTransactions } = useWallet()
  const [ authUser, setAuthUser ] = useState<any>(null)
  const [ loading, setLoading ] = useState<boolean>(false)
  const buttonText5 = useColorModeValue('orange','cyan')
  const xLightColor = useColorModeValue('orange.100','cyan.100')
  const medColor = useColorModeValue('orange.500','cyan.500')
  
  return (
    <>
      <Head>
        <title>Fallen Order - Test Page</title>
        <meta name="description" content="Developed by Angels Of Ares" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      {activeAddress ?
      <>
        {!authUser ?
          <>
            <Text my='24px' className={`${gradientText} responsive-font`}>Test Page</Text>
            {!loading ?
            <>
            </> : null}
          </>
        :
        <>
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