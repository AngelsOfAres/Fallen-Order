import * as React from 'react'
import { Modal, ModalBody, ModalHeader, ModalFooter, ModalOverlay, ModalContent, Text, Flex, useDisclosure, useColorModeValue } from '@chakra-ui/react'
import styles from '../../../../styles/glow.module.css'
import { FullGlowButton, IconGlowButton } from 'components/Buttons'
import { useWallet } from '@txnlab/use-wallet'

export function AbsorbPop(props: any) {
    const { activeAddress } = useWallet()
    const { kinship, asset_id, isOpen, onClose } = props

    const { isOpen: isKinOpen, onOpen: onKinOpen, onClose: onKinClose } = useDisclosure()
    const { isOpen: isSkillOpen, onOpen: onSkillOpen, onClose: onSkillClose } = useDisclosure()
    const gradientText = useColorModeValue(styles.textAnimatedGlowL, styles.textAnimatedGlowD)
    const buttonText3 = useColorModeValue('orange.500','cyan.500')
    const buttonText4 = useColorModeValue('orange.200','cyan.100')

    return (
        <>

            <Modal scrollBehavior={'outside'} size='md' isCentered isOpen={isOpen} onClose={onClose}>
            <ModalOverlay backdropFilter='blur(10px)'/>
            <ModalContent m='auto' alignItems='center' bgColor='black' borderWidth='1.5px' borderColor={buttonText3} borderRadius='2xl'>
                <ModalHeader className={gradientText} textAlign='center' fontSize='20px' fontWeight='bold'>Character Absorb</ModalHeader>
                <ModalBody>
                    <Flex pt={4} flexDirection="row" flexWrap="wrap" justifyContent='center' gap='12px'>
                        {/* <FullGlowButton text='Wisdom' onClick={onAbsorbClose}/> */}
                        <FullGlowButton text='Kinship' onClick={onKinOpen}/>
                        <FullGlowButton text='Skill' onClick={onSkillOpen}/>
                    </Flex>
                </ModalBody>
                <ModalFooter mb={2}>
                    <FullGlowButton text='X' onClick={onClose}/>
                </ModalFooter>
            </ModalContent>
            </Modal>
        </>
    )
}