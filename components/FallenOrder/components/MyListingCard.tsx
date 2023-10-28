import * as React from 'react'
import { Box, Modal, ModalBody, ModalHeader, ModalOverlay, ModalContent, Tooltip, Text, Image, HStack, VStack, useDisclosure, useColorModeValue, Switch, Input, ModalFooter, Center } from '@chakra-ui/react'
import styles from '../../../styles/glow.module.css'
import { FullGlowButton, IconGlowButton } from 'components/Buttons'
import { useState } from 'react'
import { useWallet } from '@txnlab/use-wallet'
import { updateListing } from 'api/backend'
import { SuccessPopup } from './Popups/Success'
import toast from 'react-hot-toast'
import { GiCycle } from 'react-icons/gi'
import { BsFillTrash3Fill } from 'react-icons/bs'

export function MyListingCard(props: any) {
    const { activeAddress } = useWallet()
    const { listing_wallet, listingID, assetID, price, name, image, expAccepted } = props
    const [acceptExp, setAcceptExp] = useState<boolean>(expAccepted)
    const [loading, setLoading] = useState<boolean>(false)
    const [popTitle, setPopTitle] = useState<any>('')
    const [popMessage, setPopMessage] = useState<any>('')
    const [newPrice, setNewPrice] = useState<any>(price)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isSuccessOpen, onOpen: onSuccessOpen, onClose: onSuccessClose } = useDisclosure()
    const { isOpen: isConfirmOpen1, onOpen: onConfirmOpen1, onClose: onConfirmClose1 } = useDisclosure()
    const { isOpen: isConfirmOpen2, onOpen: onConfirmOpen2, onClose: onConfirmClose2 } = useDisclosure()
    const boxGlow = useColorModeValue(styles.boxGlowL, styles.boxGlowD)
    const gradientText = useColorModeValue(styles.textAnimatedGlowL, styles.textAnimatedGlowD)
    const buttonText3 = useColorModeValue('orange.500','cyan.500')
    const buttonText4 = useColorModeValue('orange.200','cyan.100')
    const buttonText5 = useColorModeValue('orange','cyan')
    const xLightColor = useColorModeValue('orange.100','cyan.100')
    const medColor = useColorModeValue('orange.500','cyan.500')

    const handleUpdateListing = async (type: any) => {
        setLoading(true)
        onConfirmClose1()
        onConfirmClose2()
        try {
    
          toast.loading(type === 0 ? 'Updating Listing...' : 'Deleting Listing...', { id: 'txn', duration: Infinity })
    
          try{
              const data = await updateListing(activeAddress, [type, listingID, listing_wallet, assetID, newPrice, acceptExp ? 1 : 0])
              if (data && !data.message) {
                console.log(data)
                toast.error('Oops! Listing Update Failed!', { id: 'txn' })
                return
              }
          } catch (error: any) {
              console.log(error.message)
              toast.error('Oops! Listing Update Failed!', { id: 'txn' })
              return
          } finally {
              setLoading(false)
          }
        } catch (error) {
          console.error(error)
          toast.error('Oops! Listing Update Failed!', { id: 'txn' })
          return
        }
        toast.success(type === 0 ? `Listing Updated Successfully!`:  `Listing Deleted Successfully!`, {
          id: 'txn',
          duration: 5000
        })
        setPopTitle('Success')
        if (type === 0) {
            setPopMessage('Listing Updated Successfully!')
        } else {
            setPopMessage('Listing Deleted Successfully!')
        }
        onSuccessOpen()
        onClose()
      }

    return (
        <Box className={boxGlow} m={4} p={6} w='320px' justifyContent='center' bgGradient={buttonText4} borderColor={buttonText3} borderWidth='1px' borderRadius='3xl'>
            <HStack w='full'>
                <Box borderWidth='1px' borderColor={buttonText3} borderRadius='14px'>
                    <Image objectFit='cover' w='140px' borderRadius='13px' alt={name} src={image}/>
                </Box>
                <VStack mx={6} spacing='24px'>
                    <Text fontSize='18px' className={gradientText}>{name}</Text>
                    <HStack textAlign='center' fontFamily='Orbitron' textColor={buttonText4} spacing='3px'>
                        <Tooltip py={1} px={2} borderWidth='1px' borderRadius='xl' arrowShadowColor={buttonText5} borderColor={buttonText5} bgColor='black' textColor={buttonText4} fontSize='10px' fontFamily='Orbitron' textAlign='center' hasArrow label={'$EXP Price: ' + (price*100).toFixed(0)} aria-label='Tooltip'>
                            <Text textColor={buttonText4} fontSize='16px'>{price.replace(/\.?0+$/, '')}</Text>
                        </Tooltip>
                        <Image boxSize='12px' alt={'Algorand'} src={'/algologo.png'} />
                        <div className='ml-4'><IconGlowButton icon={GiCycle}  onClick={onOpen} disabled={loading} /></div>
                    </HStack>
                </VStack>

                <Modal isCentered isOpen={isOpen} size={'xs'} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent alignItems='center' bgColor='black' borderWidth='1.5px' borderColor={buttonText3} borderRadius='lg'>
                        <ModalHeader w='full' className={gradientText} fontSize='lg' fontWeight='bold'>
                            Update Listing
                        </ModalHeader>
                        <ModalBody w='full' mb={4}>
                            <VStack textAlign='center'>
                                <Text mb={2} className={gradientText}>{name}</Text>
                                <Text mb={-2} fontSize='12px' textAlign='center' textColor={buttonText5}>New Price</Text>
                                <HStack>
                                    <Input
                                        type="number"
                                        name="price"
                                        id="price"
                                        textAlign='center'
                                        w='110px'
                                        fontSize='16px'
                                        _hover={{ bgColor: 'black' }}
                                        _focus={{ borderColor: medColor }}
                                        textColor={xLightColor}
                                        borderColor={medColor}
                                        className={`rounded-l-md bg-black`}
                                        value={newPrice}
                                        onChange={(e) => setNewPrice(parseFloat(e.target.value))}
                                        placeholder="0.00"
                                        />
                                    <Image boxSize='20px' alt={'Algorand'} src={'/algologo.png'} />
                                </HStack>
                                <Tooltip py={1} px={2} borderWidth='1px' borderRadius='lg' arrowShadowColor={buttonText5} borderColor={buttonText3} bgColor='black' textColor={buttonText4} fontSize='12px' fontFamily='Orbitron' textAlign='center' hasArrow label={'$EXP Price: ' + (price*100).toFixed(0)} aria-label='Tooltip'>
                                    <VStack my={4} w='fit-content' spacing='4px'>
                                        <Text textColor={buttonText5}>Accept $EXP</Text>
                                        <Switch defaultChecked={expAccepted} size='lg' colorScheme={buttonText5} css={{"& .chakra-switch__thumb": {backgroundColor: "black" }}} onChange={() => setAcceptExp(!acceptExp)} />
                                    </VStack>
                                </Tooltip>
                                <HStack spacing='12px'>
                                    <FullGlowButton text={loading ? 'Updating...' : 'Update'} disabled={loading} onClick={onConfirmOpen1}/>

                                        <Modal scrollBehavior={'outside'} size='xs' isCentered isOpen={isConfirmOpen1} onClose={onConfirmClose1}>
                                        <ModalOverlay backdropFilter='blur(10px)'/>
                                        <ModalContent m='auto' alignItems='center' bgColor='black' borderWidth='1.5px' borderColor={buttonText3} borderRadius='2xl'>
                                            <ModalHeader className={gradientText} textAlign='center' fontSize='20px' fontWeight='bold'>Confirm Update</ModalHeader>
                                            <ModalBody>
                                                <Center mb={2}>
                                                    <HStack spacing='3px'>
                                                        <Text textAlign='center' textColor={buttonText5} fontSize='18px'>{newPrice}</Text>
                                                        <Image boxSize='15px' alt={'Algorand'} src={'/algologo.png'} />
                                                    </HStack>
                                                </Center>
                                                <Text textAlign='center' textColor={buttonText4} fontSize='14px'>*5 $EXP Update Fee*</Text>
                                            </ModalBody>
                                            <ModalFooter mb={2} gap={4}>
                                                <FullGlowButton text='Update!' onClick={() => handleUpdateListing(0)} />
                                                <FullGlowButton text='X' onClick={onConfirmClose1} />
                                            </ModalFooter>
                                        </ModalContent>
                                        </Modal>

                                    <Tooltip placement='top' py={1} px={2} borderWidth='1px' borderRadius='xl' arrowShadowColor={buttonText5} borderColor={buttonText5} bgColor='black' textColor={buttonText4} fontSize='10px' fontFamily='Orbitron' textAlign='center' hasArrow label={'Delete Listing'} aria-label='Tooltip'>
                                        <div><IconGlowButton icon={BsFillTrash3Fill}  onClick={onConfirmOpen2}/></div>
                                    </Tooltip>

                                        <Modal scrollBehavior={'outside'} size='xs' isCentered isOpen={isConfirmOpen2} onClose={onConfirmClose2}>
                                        <ModalOverlay backdropFilter='blur(10px)'/>
                                        <ModalContent m='auto' alignItems='center' bgColor='black' borderWidth='1.5px' borderColor={buttonText3} borderRadius='2xl'>
                                            <ModalHeader className={gradientText} textAlign='center' fontSize='20px' fontWeight='bold'>Confirm Delete</ModalHeader>
                                            <ModalBody>
                                                <Text textAlign='center' textColor={buttonText4} fontSize='18px'>Delete listing for {name}?</Text>
                                            </ModalBody>
                                            <ModalFooter mb={2} gap={4}>
                                                <FullGlowButton text='Delete!' onClick={() => handleUpdateListing(1)} />
                                                <FullGlowButton text='X' onClick={onConfirmClose2} />
                                            </ModalFooter>
                                        </ModalContent>
                                        </Modal>

                                </HStack>
                            </VStack>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </HStack>
        <SuccessPopup isOpen={isSuccessOpen} onClose={onSuccessClose} message={popMessage} title={popTitle} />
    </Box>
    )

}