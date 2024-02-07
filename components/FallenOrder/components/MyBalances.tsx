import { Center, useColorModeValue, Text, VStack, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, HStack, useDisclosure, Tooltip, Divider, Switch, Input, Image, ModalFooter } from '@chakra-ui/react'
import styles2 from '../../../styles/glow.module.css'
import toast from 'react-hot-toast'
import useWalletBalance from 'hooks/useWalletBalance'
import { useState } from 'react'
import React from 'react'
import { useWallet } from '@txnlab/use-wallet'
import { FullGlowButton, IconGlowButton, IconGlowButton2 } from 'components/Buttons'
import { algodClient } from 'lib/algodClient'
import algosdk from 'algosdk'
import { GiWallet } from 'react-icons/gi'
import { convertAlgosToMicroalgos } from 'utils'
import { BsCurrencyDollar } from 'react-icons/bs'
import { swapALGOtoEXP, swapORDERtoEXP } from 'api/backend'

export default function MyBalances() {
  const gradientText = useColorModeValue(styles2.textAnimatedGlowL, styles2.textAnimatedGlowD)
  const { expBal, orderBal, boostBal, oakLogsBal, clayOreBal, walletAvailableBalance } = useWalletBalance()
  const [loading, setLoading] = useState<boolean>(false)
  const [payOrder, setPayOrder] = useState<boolean>(false)
  const [amount, setAmount] = useState<number>(0)
  const totalPrice = payOrder ? Math.floor(amount/10) : Number((amount*0.0101).toFixed(4))
  const finalExp = payOrder ? totalPrice*10 : amount
  const totalLogo = payOrder ? <Image boxSize={'18px'} alt={'ORDER Token'} src={'/fallenlogo.png'} /> : <Image boxSize={'14px'} alt={'Algorand'} src={'/algologo.png'} />
  const { activeAddress, signTransactions } = useWallet()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isBuyExpOpen, onOpen: onBuyExpOpen, onClose: onBuyExpClose } = useDisclosure()
  const { isOpen: isExpConfirmOpen, onOpen: onExpConfirmOpen, onClose: onExpConfirmClose } = useDisclosure()
  const buttonText3 = useColorModeValue('orange.500','cyan.500')
  const buttonText4 = useColorModeValue('orange.200','cyan.100')
  const buttonText5 = useColorModeValue('orange','cyan')
  const orderBalOpt = orderBal !== -1 ? orderBal : <FullGlowButton text={loading ? 'Opting In...' : 'Opt In'} disabled={loading} onClick={() => sendOptIn(811718424)}/>
  const expBalOpt = expBal !== -1 ? expBal : <FullGlowButton text={loading ? 'Opting In...' : 'Opt In'} disabled={loading} onClick={() => sendOptIn(811721471)} />
  const boostBalOpt = boostBal !== -1 ? boostBal : <FullGlowButton text={loading ? 'Opting In...' : 'Opt In'} disabled={loading} onClick={() => sendOptIn(815771120)} />
  const oakLogsBalOpt = oakLogsBal !== -1 ? oakLogsBal : <FullGlowButton text={loading ? 'Opting In...' : 'Opt In'} disabled={loading} onClick={() => sendOptIn(1064863037)} />
  const clayOreBalOpt = clayOreBal !== -1 ? clayOreBal : <FullGlowButton text={loading ? 'Opting In...' : 'Opt In'} disabled={loading} onClick={() => sendOptIn(1167832686)} />
  const assets = [811718424, 811721471, 815771120, 1064863037, 1167832686]
  const xLightColor = useColorModeValue('orange.100','cyan.100')
  const medColor = useColorModeValue('orange.500','cyan.500')

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

  const handlePurchase = async () => {
    setLoading(true)
    onExpConfirmClose()
    try {
      if (!activeAddress) {
        throw new Error('Wallet Not Connected!')
      }
      
      if (payOrder) {
        toast.loading('Swapping $ORDER to $EXP...', { id: 'txn', duration: Infinity })

        try{
            const data = await swapORDERtoEXP(activeAddress, finalExp)
            if (data && data.message) {
              toast.success(`$EXP Swap Successful!`, {
                id: 'txn',
                duration: 5000
              })
              return
            }
        } catch (error: any) {
            console.log(error.message)
            toast.error('Oops! $EXP Swap Failed!', { id: 'txn' })
            return
        } finally {
            setLoading(false)
        }
      } else {  
        
        const data = await swapALGOtoEXP(activeAddress, amount)
        if (data) {
            let finalGroup = []
            for (const txn of data.unsignedGroup) {
                finalGroup.push(new Uint8Array(Object.values(txn)))
            }
            const signedTransactions = await signTransactions(finalGroup)
            toast.loading('Awaiting Signature...', { id: 'txn', duration: Infinity })

            await algodClient.sendRawTransaction(signedTransactions).do()
            toast.loading('Swapping $ALGO to $EXP...', { id: 'txn', duration: Infinity })

            toast.success(`$EXP Swap Successful!`, {
              id: 'txn',
              duration: 5000
            })
            return
          }
        }
    } catch (error) {
      console.error(error)
      toast.error('Oops! $EXP Swap Failed!', { id: 'txn' })
    } finally {    
      setLoading(false)
      onBuyExpClose()
    }
  }
  console.log(amount)
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
                        <Text fontSize='16px' textColor={buttonText4}>$ALGO</Text>
                        <Text fontSize='20px' textColor={buttonText5}>{walletAvailableBalance ? parseFloat(walletAvailableBalance).toFixed(4).replace(/\.?0+$/, '') : '0.00'}</Text>
                    </HStack>
                    <HStack w='full' justifyContent='space-between'>
                        <Text fontSize='16px' textColor={buttonText4}>$ORDER</Text>
                        <Text fontSize='20px' textColor={buttonText5}>{orderBalOpt}</Text>
                    </HStack>
                    <HStack w='full' justifyContent='space-between'>
                        <HStack spacing='16px'>
                          <Text fontSize='16px' textColor={buttonText4}>$EXP</Text>
                          {expBal === -1 || orderBal === -1 ? null :
                          <>
                            <Tooltip py={1} px={2} borderWidth='1px' borderRadius='lg' arrowShadowColor={buttonText5} borderColor={buttonText5} bgColor='black' textColor={buttonText4} fontSize='12px' fontFamily='Orbitron' textAlign='center' hasArrow label={'Buy $EXP!'} aria-label='Tooltip'>
                              <div><IconGlowButton icon={BsCurrencyDollar} disabled={loading} onClick={onBuyExpOpen}/></div>
                            </Tooltip>

                            <Modal scrollBehavior={'outside'} size='sm' isCentered isOpen={isBuyExpOpen} onClose={onBuyExpClose}>
                              <ModalOverlay backdropFilter='blur(10px)'/>
                              <ModalContent className='whitespace-nowrap' p={2} m='auto' alignItems='center' bgColor='black' borderWidth='1.5px' borderColor={buttonText3} borderRadius='lg'>
                                  <ModalHeader className={gradientText} fontSize='24px' fontWeight='bold'>Buy $EXP</ModalHeader>
                                  <ModalBody w='inherit'>
                                    <VStack w='100%' spacing='8px'>
                                    <Text textColor={buttonText5}>Purchase Currency</Text>
                                    <HStack>
                                      <Image boxSize={'10px'} alt={'Algorand'} src={'/algologo.png'} />
                                      <Text textColor={buttonText4}>$ALGO</Text>
                                      <Switch defaultChecked={payOrder} onChange={() => setPayOrder(!payOrder)} size='md' colorScheme={buttonText5} css={{"& .chakra-switch__thumb": {backgroundColor: "black" }, "& .chakra-switch__track": {backgroundColor: buttonText5 }}} />
                                      <Text textColor={buttonText4}>$ORDER</Text>
                                      <Image boxSize={'14px'} alt={'ORDER Token'} src={'/fallenlogo.png'} />
                                    </HStack>
                                    <HStack mt={6}>
                                      <Center>
                                      <Input
                                        type="number"
                                        name="price"
                                        id="price"
                                        min={100}
                                        textAlign='center'
                                        w='40%'
                                        fontSize='16px'
                                        _hover={{ bgColor: 'black' }}
                                        _focus={{ borderColor: medColor }}
                                        textColor={xLightColor}
                                        borderColor={medColor}
                                        className={`block w-full rounded-none rounded-l-md bg-black`}
                                        value={amount}
                                        onChange={(e) => setAmount(parseInt(e.target.value))}
                                        placeholder="0"
                                        />
                                        <Image mx={2} boxSize={'28px'} alt={'Experience Token'} src={'/exp.png'} />
                                        </Center>
                                      </HStack>
                                    </VStack>
                                    <Center>
                                      <HStack mt={4} spacing='4px'>
                                        <Text fontSize='14px' textColor={buttonText4}>Total:</Text>
                                        <Text fontSize='20px' textColor={buttonText5}>{isNaN(totalPrice) ? 0 : totalPrice}</Text>
                                        {totalLogo}
                                      </HStack>
                                    </Center>
                                      {payOrder ?
                                        (orderBal < totalPrice ? <Text mt={2} textAlign='center' fontSize='14px' textColor={'red'}>Low $ORDER Balance!</Text> : null)
                                      : 
                                        (walletAvailableBalance ? parseFloat(walletAvailableBalance) < totalPrice ? <Text mt={2} textAlign='center' fontSize='14px' textColor={'red'}>Low $ALGO Balance!</Text> : null : null)
                                      }
                                  </ModalBody>
                                  <ModalFooter mb={2} gap={4}>
                                      <FullGlowButton text='X' onClick={onBuyExpClose} />
                                      <FullGlowButton text='SWAP!' onClick={onExpConfirmOpen} disabled={amount < 10 || (payOrder ? orderBal < totalPrice : walletAvailableBalance ? parseFloat(walletAvailableBalance) < totalPrice : true)} />
                                        <Modal scrollBehavior={'outside'} size='sm' isCentered isOpen={isExpConfirmOpen} onClose={onExpConfirmClose}>
                                        <ModalOverlay backdropFilter='blur(10px)'/>
                                        <ModalContent m='auto' alignItems='center' bgColor='black' borderWidth='1.5px' borderColor={buttonText3} borderRadius='2xl'>
                                            <ModalHeader className={gradientText} textAlign='center' fontSize='20px' fontWeight='bold'>Confirm Swap!</ModalHeader>
                                            <ModalBody>
                                                <VStack mb={2}>
                                                    <Text textAlign='center' textColor={buttonText5} fontSize='18px'>Swapping {finalExp} $EXP</Text> 
                                                    <HStack spacing='4px'>
                                                      <Text textAlign='center' textColor={buttonText4} fontSize='18px'>Total:</Text>
                                                      <Text textAlign='center' textColor={buttonText5} fontSize='18px'>{totalPrice}</Text>
                                                      {payOrder ? <Image boxSize={'16px'} alt={'ORDER Token'} src={'/fallenlogo.png'} /> : <Image boxSize={'14px'} alt={'Algorand'} src={'/algologo.png'} />}
                                                    </HStack>
                                                </VStack>
                                                {!payOrder ? 
                                                  <Text textAlign='center' textColor={buttonText3} fontSize='14px'>*1% Swap Fee*</Text>
                                                : 
                                                  <Text textAlign='center' textColor={buttonText3} fontSize='14px'>*No Swap Fee*</Text>
                                                }
                                            </ModalBody>
                                            <ModalFooter mb={2} gap={4}>
                                                <FullGlowButton text='X' onClick={onExpConfirmClose} />
                                                <FullGlowButton text='Confirm!' onClick={handlePurchase} disabled={loading} />
                                            </ModalFooter>
                                        </ModalContent>
                                        </Modal>
                                  </ModalFooter>
                              </ModalContent>
                            </Modal>
                          </>
                          }

                        </HStack>
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
