import * as React from 'react'
import { Modal, ModalBody, ModalHeader, ModalOverlay, ModalContent, Text, HStack, VStack, useDisclosure, useColorModeValue, NumberInput, NumberInputField, Image, Input, Switch, Tooltip, ModalFooter, Center } from '@chakra-ui/react'
import styles from '../../../../styles/glow.module.css'
import { FullGlowButton } from 'components/Buttons'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { SuccessPopup } from './Success'
import { createListing } from 'api/backend'

export function ListingPopup(props: any) {
    const { wallet, assetID, assetName, assetImage, isOpen, onClose, mainClose } = props
    const [ loading, setLoading ] = useState<boolean>(false)
    const [ price, setPrice ] = useState<any>(null)
    const [ acceptExp, setAcceptExp ] = useState<boolean>(false)
    const [popTitle, setPopTitle] = useState<any>('')
    const [popMessage, setPopMessage] = useState<any>('')
    const { isOpen: isSuccessOpen, onOpen: onSuccessOpen, onClose: onSuccessClose } = useDisclosure()
    const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure()
    const buttonText3 = useColorModeValue('orange.500','cyan.500')
    const buttonText4 = useColorModeValue('orange.200','cyan.100')
    const buttonText5 = useColorModeValue('orange','cyan')
    const xLightColor = useColorModeValue('orange.100','cyan.100')
    const medColor = useColorModeValue('orange.500','cyan.500')
    const gradientText = useColorModeValue(styles.textAnimatedGlowL, styles.textAnimatedGlowD)
    const boxGlow = useColorModeValue(styles.boxGlowL, styles.boxGlowD)
    
    const handleListing = async () => {
        setLoading(true)
        onConfirmClose()
        try {
    
          toast.loading('Creating Listing...', { id: 'txn', duration: Infinity })
    
          try{
              const data = await createListing(wallet, [assetID, price, acceptExp ? 1 : 0])
              if (data && !data.message) {
                console.log(data)
                toast.error('Oops! Listing Creation Failed!', { id: 'txn' })
                return
              }
          } catch (error: any) {
              console.log(error.message)
              toast.error('Oops! Listing Creation Failed!', { id: 'txn' })
              return
          } finally {
              setLoading(false)
          }
        } catch (error) {
          console.error(error)
          toast.error('Oops! Listing Creation Failed!', { id: 'txn' })
          return
        }
        toast.success(`Listing Created Successfully!`, {
          id: 'txn',
          duration: 5000
        })
        setPopTitle('Success')
        setPopMessage('Listing Created Successfully!')
        onSuccessOpen()
        onClose()
        mainClose()
      }

    return (
        <>
            <Modal scrollBehavior={'outside'} size='md' isCentered isOpen={isOpen} onClose={onClose}>
                <ModalOverlay backdropFilter='blur(10px)'/>
                <ModalContent m='auto' alignItems='center' bgColor='black' borderWidth='1.5px' borderColor={buttonText3} borderRadius='2xl'>
                    <ModalHeader className={gradientText} textAlign='center' fontSize='20px' fontWeight='bold'>Create Listing!</ModalHeader>
                    <ModalBody>
                    <VStack m={1} alignItems='center' justifyContent='center' spacing='12px'>
                        <Image className={boxGlow} boxSize='60px' borderRadius='6px' alt={assetName} src={assetImage} />
                        <Text fontSize='16px' textAlign='center' className={gradientText}>{assetName}</Text>
                        <VStack mb={4}>
                            <Text mb={-1} fontSize='14px' textAlign='center' textColor={buttonText5}>Price</Text>
                            <HStack>
                                <Input
                                    type="number"
                                    name="price"
                                    id="price"
                                    textAlign='center'
                                    w='120px'
                                    fontSize='16px'
                                    _hover={{ bgColor: 'black' }}
                                    _focus={{ borderColor: medColor }}
                                    textColor={xLightColor}
                                    borderColor={medColor}
                                    className={`block w-full rounded-none rounded-l-md bg-black`}
                                    value={price}
                                    onChange={(e) => setPrice(parseFloat(e.target.value))}
                                    placeholder="0.00"
                                    />
                                <Image boxSize='20px' alt={'Algorand'} src={'/algologo.png'} />
                            </HStack>
                                                
                            <Tooltip py={1} px={2} borderWidth='1px' borderRadius='lg' arrowShadowColor={buttonText5} borderColor={buttonText3} bgColor='black' textColor={buttonText4} fontSize='12px' fontFamily='Orbitron' textAlign='center' hasArrow label={'$EXP Price: ' + (price*100).toFixed(0)} aria-label='Tooltip'>
                                <VStack mt={4} w='fit-content' spacing='4px'>
                                    <Text textColor={buttonText5}>Accept $EXP</Text>
                                    <Switch size='lg' colorScheme={buttonText5} css={{"& .chakra-switch__thumb": {backgroundColor: "black" }}} onChange={() => setAcceptExp(!acceptExp)} />
                                </VStack>
                            </Tooltip>
                        </VStack>
                        <FullGlowButton text={loading ? 'Listing...' : 'List!'} onClick={onConfirmOpen} disabled={loading || isNaN(price) || price === '0.00' || !price} />

                            <Modal scrollBehavior={'outside'} size='md' isCentered isOpen={isConfirmOpen} onClose={onConfirmClose}>
                            <ModalOverlay backdropFilter='blur(10px)'/>
                            <ModalContent m='auto' alignItems='center' bgColor='black' borderWidth='1.5px' borderColor={buttonText3} borderRadius='2xl'>
                                <ModalHeader className={gradientText} textAlign='center' fontSize='20px' fontWeight='bold'>Confirm Listing!</ModalHeader>
                                <ModalBody>
                                    <Center mb={2}>
                                        <HStack>
                                            <Text textAlign='center' textColor={buttonText5} fontSize='18px'>{price}</Text>
                                            <Image boxSize='16px' alt={'Algorand'} src={'/algologo.png'} />
                                        </HStack>
                                    </Center>
                                    <Text textAlign='center' textColor={buttonText4} fontSize='14px'>*10 $EXP Listing Fee*</Text>
                                </ModalBody>
                                <ModalFooter mb={2} gap={4}>
                                    <FullGlowButton text='Confirm!' onClick={handleListing} />
                                    <FullGlowButton text='X' onClick={onConfirmClose} />
                                </ModalFooter>
                            </ModalContent>
                            </Modal>
                    </VStack>
                    </ModalBody>
                    <ModalFooter mb={2} gap={4}>
                        <FullGlowButton text='X' onClick={onClose} />
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <SuccessPopup isOpen={isSuccessOpen} onClose={onSuccessClose} message={popMessage} title={popTitle} />
        </>
    )

}