import * as React from 'react'
import { Box, Modal, ModalBody, ModalHeader, ModalOverlay, ModalContent, Text, HStack, VStack, Center, useDisclosure, useColorModeValue, Input } from '@chakra-ui/react'
import styles from '../../../../styles/glow.module.css'
import { FullGlowButton } from 'components/Buttons'
import { useState } from 'react'
import { renameChar } from 'api/backend'
import { useWallet } from '@txnlab/use-wallet'
import { SuccessPopup } from '../Popups/Success'

export function Rename(props: any) {
    const { asset_id, name, unitName } = props
    const { activeAddress } = useWallet()
    const [newName, setNewName] = useState<any>(name)
    const [loading, setLoading] = useState<boolean>(false)
    const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure()
    const { isOpen: isSuccessOpen, onOpen: onSuccessOpen, onClose: onSuccessClose } = useDisclosure()
    const buttonText3 = useColorModeValue('orange.500','cyan.500')
    const buttonText4 = useColorModeValue('orange.200','cyan.100')
    const xLightColor = useColorModeValue('orange.100','cyan.100')
    const medColor = useColorModeValue('orange.500','cyan.500')
    const buttonText5 = useColorModeValue('yellow','cyan')
    const gradientText = useColorModeValue(styles.textAnimatedGlowL, styles.textAnimatedGlowD)

    async function handleRename() {
        setLoading(true)
        onConfirmClose()
        onSuccessOpen()
        await renameChar(asset_id, activeAddress, newName)
        .then((data: any) => {
        if (data && data.includes("Error")) {
            console.log(data)
            return
        }
        })
        .catch((error: any) => {
        console.error(error)
        })
        setLoading(false)
    }

    return (
        <Box m={4} alignContent='center'>
            <Input type="text" name="name" id="name" maxLength={36} mb={4} textAlign='center' _hover={{ bgColor: 'black' }} _focus={{ borderColor: medColor }}
                textColor={xLightColor} borderColor={medColor} borderRadius='lg' className={`block w-full bg-black sm:text-sm`} value={newName}
                onChange={(e) => setNewName(e.target.value)} placeholder="Insert Name!" />
            <Center><FullGlowButton text={loading? 'Renaming' : 'Rename'} onClick={onConfirmOpen} disabled={!newName || newName === null || newName.length === 0 || loading} /></Center>
            <Modal scrollBehavior={'outside'} size='xs' isCentered isOpen={isConfirmOpen} onClose={onConfirmClose}>
            <ModalOverlay backdropFilter='blur(10px)'/>
            <ModalContent m='auto' alignItems='center' bgColor='black' borderWidth='1.5px' borderColor={buttonText3} borderRadius='lg'>
                <ModalHeader className={gradientText} textAlign='center' fontSize='20px' fontWeight='bold'>Confirm Rename</ModalHeader>
                <ModalBody>
                <VStack m={1} alignItems='center' justifyContent='center' spacing='10px'>
                    <Text fontSize='14px' textAlign='center' textColor={buttonText4}>{unitName}&apos;s New Name:</Text>
                    <Text fontSize='18px' textAlign='center' textColor={buttonText5}>{newName}</Text>
                    <Text fontSize='14px' textAlign='center' textColor={buttonText4}>25 $EXP will be clawed back from your account</Text>
                    <HStack py={4}>
                        <FullGlowButton text='Confirm!' onClick={handleRename} />
                        <FullGlowButton text='X' onClick={onConfirmClose} />
                    </HStack>
                </VStack>
                </ModalBody>
            </ModalContent>
            </Modal>
            <SuccessPopup isOpen={isSuccessOpen} onClose={onSuccessClose} message={`${unitName} has been renamed to ${newName}!`} />
        </Box>
    )

}