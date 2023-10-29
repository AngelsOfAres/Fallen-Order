import * as React from 'react'
import { Box, Container, Modal, ModalBody, ModalHeader, ModalOverlay, ModalContent, Tooltip, Text, Image, HStack, VStack, useDisclosure, useColorModeValue, Icon, Switch, Input } from '@chakra-ui/react'
import styles from '../../../styles/glow.module.css'
import { FullGlowButton } from 'components/Buttons'
import { useState } from 'react'
import { useWallet } from '@txnlab/use-wallet'
import { finalizeAlgoPurchase, makeAlgoPurchase, makeExpPurchase, purchaseItem } from 'api/backend'
import { SuccessPopup } from './Popups/Success'
import toast from 'react-hot-toast'
import { BsFillPersonFill } from 'react-icons/bs'
import { algodClient } from 'lib/algodClient'
import algosdk from 'algosdk'

export function ListingCard(props: any) {
    const { activeAddress, sendTransactions, signTransactions } = useWallet()
    const { listing_wallet, listingID, assetID, price, name, image, expAccepted } = props
    const listing_wallet_short = listing_wallet.substring(0, 5) + '...' + listing_wallet.substring(listing_wallet.length - 5)
    const [payExp, setPayExp] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [popTitle, setPopTitle] = useState<any>('')
    const [popMessage, setPopMessage] = useState<any>('')
    const [royalty, setRoyalty] = useState<any>(0)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isSuccessOpen, onOpen: onSuccessOpen, onClose: onSuccessClose } = useDisclosure()
    const boxGlow = useColorModeValue(styles.boxGlowL, styles.boxGlowD)
    const gradientText = useColorModeValue(styles.textAnimatedGlowL, styles.textAnimatedGlowD)
    const buttonText3 = useColorModeValue('orange.500','cyan.500')
    const buttonText4 = useColorModeValue('orange.200','cyan.100')
    const bgCardOff = useColorModeValue('linear(60deg, whiteAlpha.300 10%, black 35%, black 65%, whiteAlpha.300 90%)','linear(60deg, whiteAlpha.300 10%, black 35%, black 65%, whiteAlpha.300 90%)')
    const buttonText5 = useColorModeValue('orange','cyan')
    const xLightColor = useColorModeValue('orange.100','cyan.100')
    const medColor = useColorModeValue('orange.500','cyan.500')

    const fee = (parseFloat(price)*0.01).toFixed(3).toString().replace(/\.?0+$/, '')
    const totalFee = payExp ? parseInt(price) : fee
    const totalPrice = payExp ? (((price*100)+royalty+totalFee)).toFixed(0) : ((parseFloat(price)+(parseFloat(price)*0.01)+royalty).toFixed(3).toString()).replace(/\.?0+$/, '')

    const sendOptIn = async () => {
        try {      
            if (!activeAddress) {
              throw new Error('Wallet Not Connected!')
            }
            const suggestedParams = await algodClient.getTransactionParams().do()
            suggestedParams.fee = 1000
            suggestedParams.flatFee = true
            const note = Uint8Array.from('Fallen Order - Grand Exchange\n\nSuccessfully Opted In!'.split("").map(x => x.charCodeAt(0)))
        
            const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                        from: activeAddress,
                        to: activeAddress,
                        amount: 0,
                        assetIndex: assetID,
                        suggestedParams,
                        note,
                        })
        
            const encodedTransaction = algosdk.encodeUnsignedTransaction(txn)
        
            const signedTransaction = await signTransactions([encodedTransaction])
        
            const { txID } = await algodClient.sendRawTransaction(signedTransaction).do()

            return txID

        } catch (error) {
          console.error(error)
          return null
        }
      }
    
    async function handlePurchase() {
        setLoading(true)
        onClose()
        if (activeAddress) {
            let opt = 0
            try {
                await algodClient.accountAssetInformation(activeAddress, assetID).do()
            } catch {
                opt = 1
            }
            if (!payExp) {
                try{
                    const data = await makeAlgoPurchase(activeAddress, [opt, listingID, listing_wallet, assetID, royalty])
                    if (data) {
                        toast.loading('Awaiting Signature...', { id: 'txn', duration: Infinity })
                        let finalGroup = []
                        for (const txn of data.unsignedGroup) {
                            finalGroup.push(new Uint8Array(Object.values(txn)))
                        }
                        console.log(finalGroup)
                        try {
                            const signedTransactions = await signTransactions(finalGroup)
                            console.log(signedTransactions)
                            
                            toast.loading(`Purchasing ${name}...`, { id: 'txn', duration: Infinity })

                            try{
                                const data2 = await finalizeAlgoPurchase(activeAddress, [data.token, signedTransactions])
                                if (data2 && data2.message) {
                                    toast.success(`Purchase Successful!`, {
                                    id: 'txn',
                                    duration: 5000
                                    })
                                    setPopTitle('Success')
                                    setPopMessage(`Purchased ${name}!`)
                                    onSuccessOpen()
                                    setLoading(false)
                                }
                            } catch (error) {
                                toast.error(`Oops! Purchase failed. Please contact an admin if issue persists...`, { id: 'txn' })
                                setLoading(false)
                                return
                            }
                        } catch (error: any){
                            console.log(error)
                        }
                    }
                } catch (error) {
                    toast.error(`Oops! Purchase failed. Please contact an admin if issue persists...`, { id: 'txn' })
                    setLoading(false)
                    return
                }
            }
            else {
                toast.loading(`Purchasing ${name}...`, { id: 'txn', duration: Infinity })
                
                if (opt === 1) {
                    const txID = await sendOptIn()
                    if (!txID) {
                        toast.error(`Oops! Purchase failed. Please contact an admin if issue persists...`, { id: 'txn' })
                        setLoading(false)
                        return
                    }
                }
                try{
                    const data2 = await makeExpPurchase(activeAddress, [listingID, listing_wallet, assetID, royalty])
                    if (data2 && data2.message) {
                        toast.success(`Purchase Successful!`, {
                        id: 'txn',
                        duration: 5000
                        })
                        setPopTitle('Success')
                        setPopMessage(`Purchased ${name}!`)
                        onSuccessOpen()
                        setLoading(false)
                        return
                    }
                } catch (error) {
                    toast.error(`Oops! Purchase failed. Please contact an admin if issue persists...`, { id: 'txn' })
                    setLoading(false)
                    return
                }
                toast.error(`Oops! Purchase failed. Please contact an admin if issue persists...`, { id: 'txn' })
                setPopTitle('Purchase Failed')
                setPopMessage(`Listing Unavailable!`)
                onSuccessOpen()
                setLoading(false)
            }
        }
    }
    
    return (
        <Box m={2} className={boxGlow} maxW='140px' bgGradient={bgCardOff} borderColor={buttonText3} borderWidth='1.5px' borderRadius='13px'>
            <Container pb={0} pt={0} pl={0} pr={0} centerContent>
                <Box borderBottomWidth='0.25px' borderColor={buttonText3} borderBottomRadius='xl'>
                    <Image objectFit='cover' w='140px' borderRadius='11.5px' borderBottomRadius='xl' alt={name} src={image} onClick={onOpen}/>
                </Box>
                <Box maxW='85%' textAlign='center' py={0.5} px={2} borderColor={buttonText3} borderTopWidth='0px' borderBottomWidth='0.5px' borderLeftWidth='0.5px' borderRightWidth='0.5px' borderBottomRadius='lg' borderTopRadius='xs'>
                    <Text className={gradientText} fontSize='10px'>{name}</Text>
                </Box>
            </Container>
            <Container pb={2} pt={0} pl={2} pr={2} centerContent>
                <Tooltip py={1} px={2} borderWidth='1px' borderRadius='lg' arrowShadowColor={buttonText5} borderColor={buttonText5} bgColor='black' textColor={buttonText4} fontSize='10px' fontFamily='Orbitron' textAlign='center' hasArrow label={'Listing Owner'} aria-label='Tooltip'>
                    <a href={'https://algoexplorer.io/address/' + listing_wallet} target='_blank' rel='noreferrer'>
                        <Text mt={2} textAlign='center' fontFamily='Orbitron' bgColor={buttonText5} bgClip='text' fontSize='11px'>
                            <Icon mr={1} boxSize='12px' color={buttonText3} as={BsFillPersonFill}/>
                            {listing_wallet_short}
                        </Text>
                    </a>
                </Tooltip>
                <HStack my={1} textAlign='center' fontFamily='Orbitron' textColor={buttonText4} spacing='3px'>
                    <Tooltip py={1} px={2} borderWidth='1px' borderRadius='lg' arrowShadowColor={buttonText5} borderColor={buttonText5} bgColor='black' textColor={buttonText5} fontSize='10px' fontFamily='Orbitron' textAlign='center' hasArrow label={'Total including Fees + Royalties'} aria-label='Tooltip'>
                        <Text className={gradientText} fontSize='16px'>{price.replace(/\.?0+$/, '')}</Text>
                    </Tooltip>
                    <Image boxSize='14px' alt={'Algorand'} src={'/algologo.png'} />
                </HStack>

                <Modal isCentered isOpen={isOpen} size={'xs'} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent alignItems='center' bgColor='black' borderWidth='1.5px' borderColor={buttonText3} borderRadius='lg'>
                        <ModalHeader className={gradientText} fontFamily='Orbitron' fontSize='lg' fontWeight='bold'>Confirm Purchase</ModalHeader>
                        <ModalBody mb={2} w='330px'>
                            <VStack textAlign='center' spacing='24px'>
                                {expAccepted === 1 ?
                                    <VStack w='fit-content' spacing='4px'>
                                        <Text textColor={buttonText5}>Pay With $EXP?</Text>
                                        <Switch defaultChecked={payExp} size='lg' colorScheme={buttonText5} css={{"& .chakra-switch__thumb": {backgroundColor: "black" }}}
                                            onChange={() => setPayExp(!payExp)} />
                                    </VStack>
                                : null}
                                <Text mb={-4} fontSize='14px' textAlign='center' textColor={buttonText5}>Royalty</Text>
                                <HStack>
                                    <Input
                                        type="number"
                                        name="royalty"
                                        id="royalty"
                                        textAlign='center'
                                        w='90px'
                                        fontSize='16px'
                                        _hover={{ bgColor: 'black' }}
                                        _focus={{ borderColor: medColor }}
                                        textColor={xLightColor}
                                        borderColor={medColor}
                                        className={`block w-full rounded-none rounded-l-md bg-black`}
                                        value={royalty}
                                        onChange={(e) => payExp ?  setRoyalty(parseInt(e.target.value)) : setRoyalty(parseFloat(e.target.value))}
                                        placeholder="0.00"
                                        />
                                    <Image boxSize={payExp ? '21px' : '16px'} alt={payExp ? 'Experience' : 'Algorand'} src={payExp ? '/exp.png' : '/algologo.png'} />
                                </HStack>
                                <HStack mb={-4} spacing='4px'>
                                <Text fontSize='14px' textAlign='center' textColor={buttonText4}>Fee:</Text>
                                    <Text fontSize='20px' textColor={buttonText5}>{totalFee}</Text>
                                    <Image boxSize={payExp ? '21px' : '16px'} alt={payExp ? 'Experience' : 'Algorand'} src={payExp ? '/exp.png' : '/algologo.png'} />
                                </HStack>
                                <HStack spacing='4px'>
                                    <Text mr={1} fontSize='14px' textColor={buttonText4}>Total:</Text>
                                    <Text fontSize='20px' textColor={buttonText5}>{totalPrice}</Text>
                                    <Image boxSize={payExp ? '21px' : '16px'} alt={payExp ? 'Experience' : 'Algorand'} src={payExp ? '/exp.png' : '/algologo.png'} />
                                </HStack>
                                <FullGlowButton ref={null} text='BUY!' onClick={handlePurchase} />
                                <HStack>
                                    <FullGlowButton ref={null} text='X' onClick={onClose} />
                                </HStack>
                            </VStack>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </Container>
        <SuccessPopup isOpen={isSuccessOpen} onClose={onSuccessClose} message={popMessage} title={popTitle} />
    </Box>
    )

}