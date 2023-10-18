import Head from 'next/head'
import Navbar from 'components/Navbar'
import { Center, useColorModeValue, Text, VStack, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, HStack, useDisclosure } from '@chakra-ui/react'
import styles2 from '../styles/glow.module.css'
import Footer from 'components/Footer'
import useWalletBalance from 'hooks/useWalletBalance'
import ManageCharacter from 'components/FallenOrder/ManageChar'
import React from 'react'
import { useWallet } from '@txnlab/use-wallet'
import Connect from 'components/MainTools/Connect'
import { FullGlowButton } from 'components/Buttons'

export default function Manage() {
  const gradientText = useColorModeValue(styles2.textAnimatedGlowL, styles2.textAnimatedGlowD)
  const { expBal, orderBal, boostBal, oakLogsBal, clayOreBal } = useWalletBalance()
  const { activeAddress } = useWallet()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const buttonText3 = useColorModeValue('orange.500','cyan.500')
  const buttonText4 = useColorModeValue('orange.200','cyan.100')
  const buttonText5 = useColorModeValue('yellow','cyan')
  const orderBalOpt = orderBal !== -1 ? orderBal : <a href='https://explorer.perawallet.app/assets/811718424' target='_blank' rel='noreferrer'><FullGlowButton text='Opt In' /></a>
  const expBalOpt = expBal !== -1 ? expBal : <a href='https://explorer.perawallet.app/assets/811721471' target='_blank' rel='noreferrer'><FullGlowButton text='Opt In' /></a>
  const boostBalOpt = boostBal !== -1 ? boostBal : <a href='https://explorer.perawallet.app/assets/815771120' target='_blank' rel='noreferrer'><FullGlowButton text='Opt In' /></a>
  const oakLogsBalOpt = oakLogsBal !== -1 ? oakLogsBal : <a href='https://explorer.perawallet.app/assets/1064863037' target='_blank' rel='noreferrer'><FullGlowButton text='Opt In' /></a>
  const clayOreBalOpt = clayOreBal !== -1 ? clayOreBal : <a href='https://explorer.perawallet.app/assets/1167832686' target='_blank' rel='noreferrer'><FullGlowButton text='Opt In' /></a>

  return (
    <>
      <Head>
        <title>Abyssal Portal - Fallen Order</title>
        <meta name="description" content="Developed by Angels Of Ares" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      {activeAddress ? 
        <>
            <Center m={8}><FullGlowButton text='My Balances' onClick={onOpen} /></Center>
            <Modal scrollBehavior={'outside'} size='sm' isCentered isOpen={isOpen} onClose={onClose}>
              <ModalOverlay backdropFilter='blur(10px)'/>
              <ModalContent className='whitespace-nowrap' p={6} m='auto' alignItems='center' bgColor='black' borderWidth='1.5px' borderColor={buttonText3} borderRadius='lg'>
                  <ModalHeader className={gradientText} fontSize='20px' fontWeight='bold'>My Balances</ModalHeader>
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
                          <Text fontSize='20px' textColor={buttonText4}>{clayOreBalOpt}</Text>
                      </HStack>
                    </VStack>
                  </ModalBody>
              </ModalContent>
            </Modal>
          <Text my='24px' className={`${gradientText} responsive-font`}>My Fallen Order</Text>
          <Center>
            <ManageCharacter />
          </Center>
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
