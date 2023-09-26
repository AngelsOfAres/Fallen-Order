import Head from 'next/head'
import React, { useState } from 'react'
import Navbar from 'components/Navbar'
import WalletTransactionSearch from 'components/WalletSearch'

export default function w2w() {
  return (
    <>
      <Head>
        <title>Fallen Order - Wallet 2 Wallet Search</title>
        <meta name="description" content="Developed by Angels Of Ares" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
        <WalletTransactionSearch />
    </>
  )
}
