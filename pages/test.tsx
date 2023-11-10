import Head from 'next/head'
import Navbar from 'components/Navbar'
import { Center, useColorModeValue, Text, Box, Container, Circle, Flex } from '@chakra-ui/react'
import styles from '../styles/glow.module.css'
import Footer from 'components/Footer'
import React, { useEffect, useState } from 'react'
import Connect from 'components/MainTools/Connect'
import { useWallet } from '@txnlab/use-wallet'


export default function TestPage() {
  const gradientText = useColorModeValue(styles.textAnimatedGlowL, styles.textAnimatedGlowD)
  const { activeAddress, signTransactions } = useWallet()
  const [ authUser, setAuthUser ] = useState<any>(null)
  const [ loading, setLoading ] = useState<boolean>(true)
  const buttonText5 = useColorModeValue('orange','cyan')
  const xLightColor = useColorModeValue('orange.100','cyan.100')
  const medColor = useColorModeValue('orange.500','cyan.500')

  let assetList: any = [
    { name: 'CHIPS', id: 388592191 },
    { name: 'DEFLY', id: 470842789 },
    { name: 'OPUL', id: 287867876 },
    { name: 'VEST', id: 700965019 },
    { name: 'GORA', id: 1138500612 },
    { name: 'DHARM', id: 818432243 },
    { name: 'COOP', id: 796425061 },
    { name: 'goMint', id: 441139422 },
    { name: 'VOTE', id: 452399768 },
    { name: 'AKITA', id: 523683256 },
    { name: 'EXP', id: 811721471 }
  ]

  useEffect(() => {
    async function fetchData() {
      for (const asset of assetList) {
        try {
          const response = await fetch(`https://free-api.vestige.fi/asset/${asset.id}/prices/simple/1D`)
    
          if (!response.ok) {
            throw new Error(`Request failed with status: ${response.status}`)
          }
    
          const data = await response.json()
          asset.price = data[data.length - 1].price
          const secondPrice = data[0].price
          asset.percentage = ((asset.price -  secondPrice) / secondPrice) * 100
          const normalizedValue = parseInt(((Math.abs(asset.percentage))*20).toString())
          asset.size = `${normalizedValue}`
        } catch (error) {
          asset.price = 0
          asset.percentage = 0
          asset.size = 12
        }
      }
      setLoading(false)
    }
    fetchData()
  }, [])
  
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