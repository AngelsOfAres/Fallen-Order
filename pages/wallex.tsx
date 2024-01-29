import Head from 'next/head'
import React, { useState } from 'react'
import Navbar from 'components/Navbar'
import { CreateWalleX } from 'components/WalleX/CreateWalleX'
import { Box } from '@chakra-ui/react'

export default function wallex() {
  return (
    <>
      <Head>
        <title>Fallen Order - WalleX</title>
        <meta name="description" content="World's First Web3 Wallet Exchange. Built on Algorand.&NewLine;Developed by Angels Of Ares" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Box>
        <CreateWalleX />
      </Box>
    </>
  )
}
