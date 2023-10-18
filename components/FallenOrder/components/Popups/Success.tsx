import * as React from 'react'
import { Modal, ModalBody, ModalHeader, ModalOverlay, ModalContent, Text, HStack, VStack, useDisclosure, useColorModeValue } from '@chakra-ui/react'
import styles from '../../../../styles/glow.module.css'
import { FullGlowButton } from 'components/Buttons'

export function SuccessPopup(props: any) {
    const { message, isOpen, onClose } = props
    const buttonText3 = useColorModeValue('orange.500','cyan.500')
    const buttonText4 = useColorModeValue('orange.200','cyan.100')
    const gradientText = useColorModeValue(styles.textAnimatedGlowL, styles.textAnimatedGlowD)

    return (
            <Modal scrollBehavior={'outside'} size='md' isCentered isOpen={isOpen} onClose={onClose}>
                <ModalOverlay backdropFilter='blur(10px)'/>
                <ModalContent m='auto' alignItems='center' bgColor='black' borderWidth='1.5px' borderColor={buttonText3} borderRadius='lg'>
                    <ModalHeader className={gradientText} textAlign='center' fontSize='20px' fontWeight='bold'>Success!</ModalHeader>
                    <ModalBody>
                    <VStack m={1} alignItems='center' justifyContent='center' spacing='10px'>
                        <Text fontSize='14px' textAlign='center' textColor={buttonText4}>{message}</Text>
                        <HStack py={4}>
                            <FullGlowButton text='X' onClick={onClose} />
                        </HStack>
                    </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
    )

}