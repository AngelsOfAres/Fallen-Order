import { Center, useColorModeValue, Text, VStack, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, HStack, useDisclosure, Tooltip, Divider } from '@chakra-ui/react'
import styles2 from '../../../styles/glow.module.css'
import toast from 'react-hot-toast'
import useWalletBalance from 'hooks/useWalletBalance'
import { useState } from 'react'
import React from 'react'
import { useWallet } from '@txnlab/use-wallet'
import { FullGlowButton, IconGlowButton2 } from 'components/Buttons'
import { algodClient } from 'lib/algodClient'
import algosdk from 'algosdk'
import { GiWallet } from 'react-icons/gi'

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
  const assets = [811718424, 811721471, 815771120, 1064863037, 1167832686]

  const sendMassOptIn = async () => {
    setLoading(true)
    try {
      if (!activeAddress) {
        throw new Error('Wallet Not Connected!')
      }
  
      const suggestedParams = await algodClient.getTransactionParams().do()
      suggestedParams.fee = 1000
      suggestedParams.flatFee = true
      const note = Uint8Array.from('Fallen Order - General\n\nSuccessfully Opted In!'.split("").map(x => x.charCodeAt(0)))
      let group = []
      
      for (const asset of assets) {
        const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
          from: activeAddress,
          to: activeAddress,
          amount: 0,
          assetIndex: asset,
          suggestedParams,
          note,
        })
        group.push(txn)
      }
      algosdk.assignGroupID(group)

      const encodedBatch = group.map(txn => algosdk.encodeUnsignedTransaction(txn))

      toast.loading('Awaiting Signature...', { id: 'txn', duration: Infinity })

      const signedTransaction = await signTransactions([encodedBatch])

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

  const sendOptIn = async (asset_id: any) => {
    setLoading(true)
    try {
      if (!activeAddress) {
        throw new Error('Wallet Not Connected!')
      }
  
      const suggestedParams = await algodClient.getTransactionParams().do()
      suggestedParams.fee = 1000
      suggestedParams.flatFee = true
      const note = Uint8Array.from('Fallen Order - General\n\nSuccessfully Opted In!'.split("").map(x => x.charCodeAt(0)))
  
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
        <Tooltip py={1} px={2} borderWidth='1px' borderRadius='lg' arrowShadowColor={buttonText5} borderColor={buttonText5} bgColor='black' textColor={buttonText4} fontSize='12px' fontFamily='Orbitron' textAlign='center' hasArrow label={'My Balances'} aria-label='Tooltip'>
          <div><IconGlowButton2 icon={GiWallet} onClick={onOpen} /></div>
        </Tooltip>
        <Modal scrollBehavior={'outside'} size='sm' isCentered isOpen={isOpen} onClose={onClose}>
            <ModalOverlay backdropFilter='blur(10px)'/>
            <ModalContent className='whitespace-nowrap' p={6} m='auto' alignItems='center' bgColor='black' borderWidth='1.5px' borderColor={buttonText3} borderRadius='lg'>
                <ModalHeader className={gradientText} fontSize='24px' fontWeight='bold'>My Balances</ModalHeader>
                <ModalBody mt={6} w='inherit'>
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
                    {expBal === -1 || orderBal === -1 || boostBal === -1 || oakLogsBal === -1 || clayOreBal === -1 ?
                    <>
                      <Divider my='8px' w='75%' borderColor={buttonText5}/>
                      <FullGlowButton text={loading ? 'Opting In...' : 'Mass Opt In'} disabled={loading} onClick={() => sendMassOptIn()}/>
                    </>
                    : null}
                </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    </>
  )
}
