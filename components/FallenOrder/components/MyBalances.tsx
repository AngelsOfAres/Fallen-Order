import { Center, useColorModeValue, Text, VStack, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, HStack, useDisclosure } from '@chakra-ui/react'
import styles2 from '../../../styles/glow.module.css'
import toast from 'react-hot-toast'
import useWalletBalance from 'hooks/useWalletBalance'
import { useState } from 'react'
import React from 'react'
import { useWallet } from '@txnlab/use-wallet'
import { FullGlowButton } from 'components/Buttons'
import { algodClient } from 'lib/algodClient'
import algosdk from 'algosdk'

export default function MyBalances() {
  const gradientText = useColorModeValue(styles2.textAnimatedGlowL, styles2.textAnimatedGlowD)
  const { expBal, orderBal, boostBal, oakLogsBal, clayOreBal } = useWalletBalance()
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signTransactions } = useWallet()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const buttonText3 = useColorModeValue('orange.500','cyan.500')
  const buttonText4 = useColorModeValue('orange.200','cyan.100')
  const buttonText5 = useColorModeValue('orange','cyan')
  const orderBalOpt = orderBal !== -1 ? orderBal : <FullGlowButton text={loading ? 'Opting In...' : 'Opt In'} disabled={loading} onClick={() => sendOptIn(811718424)}/>
  const expBalOpt = expBal !== -1 ? expBal : <FullGlowButton text={loading ? 'Opting In...' : 'Opt In'} disabled={loading} onClick={() => sendOptIn(811721471)} />
  const boostBalOpt = boostBal !== -1 ? boostBal : <FullGlowButton text={loading ? 'Opting In...' : 'Opt In'} disabled={loading} onClick={() => sendOptIn(815771120)} />
  const oakLogsBalOpt = oakLogsBal !== -1 ? oakLogsBal : <FullGlowButton text={loading ? 'Opting In...' : 'Opt In'} disabled={loading} onClick={() => sendOptIn(1064863037)} />
  const clayOreBalOpt = clayOreBal !== -1 ? clayOreBal : <FullGlowButton text={loading ? 'Opting In...' : 'Opt In'} disabled={loading} onClick={() => sendOptIn(1167832686)} />

  const sendOptIn = async (asset_id: any) => {
    setLoading(true)
    try {
      if (!activeAddress) {
        throw new Error('Wallet Not Connected!')
      }
  
      const suggestedParams = await algodClient.getTransactionParams().do()
      suggestedParams.fee = 1000
      suggestedParams.flatFee = true
      const note = Uint8Array.from('Abyssal Portal - Fallen Order\n\nSuccessfully Opted In!'.split("").map(x => x.charCodeAt(0)))
  
      const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                  from: activeAddress,
                  to: activeAddress,
                  amount: 0,
                  assetIndex: asset_id,
                  suggestedParams,
                  note,
                })

      const encodedTransaction = algosdk.encodeUnsignedTransaction(txn)

      toast.loading('Awaiting Signature...', { id: 'txn', duration: Infinity })

      const signedTransaction = await signTransactions([encodedTransaction])

      toast.loading('Sending transaction...', { id: 'txn', duration: Infinity })

      algodClient.sendRawTransaction(signedTransaction).do()

      console.log(`Successfully Opted In!`)

      toast.success(`Transaction Successful!`, {
        id: 'txn',
        duration: 5000
      })
      setLoading(false)
    } catch (error) {
      console.error(error)
      toast.error('Oops! Opt In Failed!', { id: 'txn' })
    }
  }

  return (
    <>
        <Center m={8}><FullGlowButton text='My Balances' onClick={onOpen} /></Center>
        <Modal scrollBehavior={'outside'} size='sm' isCentered isOpen={isOpen} onClose={onClose}>
            <ModalOverlay backdropFilter='blur(10px)'/>
            <ModalContent className='whitespace-nowrap' p={6} m='auto' alignItems='center' bgColor='black' borderWidth='1.5px' borderColor={buttonText3} borderRadius='lg'>
                <ModalHeader className={gradientText} fontSize='24px' fontWeight='bold'>My Balances</ModalHeader>
                <ModalBody m={6} w='inherit'>
                <VStack spacing='24px'>
                    <HStack w='full' justifyContent='space-between'>
                        <Text fontSize='16px' textColor={buttonText4}>$ORDER</Text>
                        <Text fontSize='20px' textColor={buttonText5}>{orderBalOpt}</Text>
                    </HStack>
                    <HStack w='full' justifyContent='space-between'>
                        <Text fontSize='16px' textColor={buttonText4}>$EXP</Text>
                        <Text fontSize='20px' textColor={buttonText5}>{expBalOpt}</Text>
                    </HStack>
                    <HStack w='full' justifyContent='space-between'>
                        <Text fontSize='16px' textColor={buttonText4}>$BOOST</Text>
                        <Text fontSize='20px' textColor={buttonText5}>{boostBalOpt}</Text>
                    </HStack>
                    <HStack w='full' justifyContent='space-between'>
                        <Text fontSize='16px' textColor={buttonText4}>Oak Logs</Text>
                        <Text fontSize='20px' textColor={buttonText5}>{oakLogsBalOpt}</Text>
                    </HStack>
                    <HStack w='full' justifyContent='space-between'>
                        <Text fontSize='16px' textColor={buttonText4}>Clay Ore</Text>
                        <Text fontSize='20px' textColor={buttonText5}>{clayOreBalOpt}</Text>
                    </HStack>
                </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    </>
  )
}
