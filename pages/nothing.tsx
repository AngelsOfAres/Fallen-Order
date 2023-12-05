import Head from 'next/head'
import Navbar from 'components/Navbar'
import { Center, useColorModeValue, Text } from '@chakra-ui/react'
import styles2 from '../styles/glow.module.css'
import { useState } from 'react'
import React from 'react'
import { useWallet } from '@txnlab/use-wallet'
import Connect from 'components/MainTools/Connect'
import { FullGlowButton } from 'components/Buttons'
import { algodClient } from 'lib/algodClient'
import algosdk from 'algosdk'
import toast from 'react-hot-toast'
import { enterNothing } from 'api/backend'

export default function YouGetNothing() {
  const gradientText = useColorModeValue(styles2.textAnimatedGlowL, styles2.textAnimatedGlowD)
  const { activeAddress, signTransactions } = useWallet()
  const [loading, setLoading] = useState<boolean>(false)
  const [step1, setStep1] = useState<boolean>(false)

  const airdropWallet = 'PQV5LGKD4WXL6RRU24X5NZBRI5L67OAO4KO77JNRLWCNM4XS2SIAUPJ7LM'
  const airdropCost = 10
  const airdropAssetID = 1263107590

  const sendNothing = async () => {
    setLoading(true)
    try {
        if (!activeAddress) {
            throw new Error('Wallet Not Connected!')
        }
  
        const suggestedParams = await algodClient.getTransactionParams().do()
        suggestedParams.fee = 1000
        suggestedParams.flatFee = true
        const note = Uint8Array.from('Successfully Entered Nothing!\n\nYou may or may not receive nothing...'.split("").map(x => x.charCodeAt(0)))
        let group = []

        const optTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
            from: activeAddress,
            to: activeAddress,
            amount: 0,
            assetIndex: airdropAssetID,
            suggestedParams,
            note
            })
        group.push(optTxn)

        const payTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            from: activeAddress,
            to: airdropWallet,
            amount: airdropCost * 1000000,
            suggestedParams,
            note
            })
        group.push(payTxn)

        algosdk.assignGroupID(group)
        const encodedBatch = group.map(txn => algosdk.encodeUnsignedTransaction(txn))

        toast.loading('Awaiting Signature...', { id: 'txn', duration: Infinity })

        const signedTransaction = await signTransactions([encodedBatch])

        toast.loading('Entering Nothing...', { id: 'txn', duration: Infinity })

        const { txId } = await algodClient.sendRawTransaction(signedTransaction).do()

        toast.success(`Congrats! You Got Nothing!`, {
            id: 'txn',
            duration: 5000
        })

        await enterNothing(activeAddress, txId)

    } catch (error) {
      console.error(error)
      toast.error('Oops! Entry Failed!', { id: 'txn' })
    } finally {
        setLoading(false)
    }
  }
  
  return (
    <>
      <Head>
        <title>YOU GET ABSOLUTELY NOTHING</title>
        <meta name="description" content="Proceed with caution. You will receive absolutely nothing in return." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Text my='60px' className={`${gradientText} responsive-font`}>Nothing to see here...</Text>
      {/* <Text my='10px' fontSize='14px' className={gradientText}>ONE entry per wallet. You will get nothing</Text>
        {activeAddress ? 
          <>
            {!step1 ?
                <Center>
                    <FullGlowButton text='I WANT NOTHING' isLoading={loading} onClick={() => setStep1(!step1)} disabled={loading} />
                </Center>
            :
                <Center>
                    <FullGlowButton text='I WILL PAY 10A TO GET NOTHING' isLoading={loading} disabled={loading} />
                </Center>
            }
          </>
          :
          <>
            <Text my='40px' fontSize='18px' className={gradientText}>Connect Wallet</Text>
            <Center><Connect /></Center>
          </>
        }
        <Text my='60px' fontSize='14px' className={gradientText}>*This app will opt you into a random asset and will charge you 10A while giving you absolutely nothing*</Text> */}
    </>
  )
}
