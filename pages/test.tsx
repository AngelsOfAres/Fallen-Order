import Head from 'next/head'
import React, { useState } from 'react'
import Navbar from 'components/Navbar'
import { Box } from '@chakra-ui/react'

export default function test() {
  return (
    <>
      <Head>
        <title>Fallen Order - Test</title>
        <meta name="description" content="Developed by Angels Of Ares" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Box>
      </Box>
    </>
  )
}
