import * as React from 'react'
import { Box, Modal, ModalBody, ModalHeader, ModalOverlay, ModalContent, Text, HStack, VStack, Center, useDisclosure, useColorModeValue, Input } from '@chakra-ui/react'
import styles from '../../../../styles/glow.module.css'
import { FullGlowButton } from 'components/Buttons'
import { useState } from 'react'
import { statsChar } from 'api/backend'
import { useWallet } from '@txnlab/use-wallet'
import { SuccessPopup } from '../Popups/Success'

export function StatsManage(props: any) {
    const { asset_id, name, unitName, stats, points } = props
    const { activeAddress } = useWallet()
    const [newStats, setNewStats] = useState<any>(stats)
    const [popTitle, setPopTitle] = useState<any>('')
    const [popMessage, setPopMessage] = useState<any>('')
    const [loading, setLoading] = useState<boolean>(false)
    const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure()
    const { isOpen: isSuccessOpen, onOpen: onSuccessOpen, onClose: onSuccessClose } = useDisclosure()
    const buttonText3 = useColorModeValue('orange.500','cyan.500')
    const buttonText4 = useColorModeValue('orange.200','cyan.100')
    const xLightColor = useColorModeValue('orange.100','cyan.100')
    const medColor = useColorModeValue('orange.500','cyan.500')
    const buttonText5 = useColorModeValue('yellow','cyan')
    const gradientText = useColorModeValue(styles.textAnimatedGlowL, styles.textAnimatedGlowD)
    const availablePoints = points - newStats[0] - newStats[1] - newStats[2]
    const success_msg = `${name && name.length > 0 ? name : unitName}'s Stats Updated!`
    const fail_msg = `Stats Update Failed!`

    async function handleStats() {
        setLoading(true)
        onConfirmClose()
      
        try {
          const data = await statsChar(asset_id, activeAddress, newStats)

          if (data && data.includes("Error")) {
            console.log(data)
          } else {
            console.log(data)
            if (data) {
                setPopTitle('Success!')
                setPopMessage(success_msg)
            }
            else {
                setPopTitle('Woops!')
                setPopMessage(fail_msg)
            }
          }
        } catch (error) {
            setPopTitle('Woops!')
            setPopMessage(error)
        } finally {
          setLoading(false)
          onSuccessOpen()
        }
      }
      

    return (
        <VStack my={4} mx={8}>
            <Text textColor={buttonText3} fontSize='18px'>Available Points</Text>
            <Text mb='12px' textColor={buttonText5} fontSize='18px'>{isNaN(availablePoints) ? 0 : availablePoints}</Text>

            <HStack w='95%' justifyContent='space-between'>
                <Text textColor={buttonText4}>ATK</Text>
                <Input w='100px' type="number" name="attack" id="attack" max={36} textAlign='center' _hover={{ bgColor: 'black' }} _focus={{ borderColor: medColor }}
                    textColor={xLightColor} borderColor={medColor} borderRadius='lg' className={`block w-full bg-black sm:text-sm`} value={newStats[0]}
                    onChange={(e) => setNewStats([Math.min(parseInt(e.target.value), points - newStats[1] - newStats[2]), newStats[1], newStats[2]])} placeholder='0' />
            </HStack>
                
            <HStack w='95%' justifyContent='space-between'>
                <Text textColor={buttonText4}>DEF</Text>
                <Input w='100px' type="number" name="defense" id="defense" max={36} textAlign='center' _hover={{ bgColor: 'black' }} _focus={{ borderColor: medColor }}
                    textColor={xLightColor} borderColor={medColor} borderRadius='lg' className={`block w-full bg-black sm:text-sm`} value={newStats[1]}
                    onChange={(e) => setNewStats([newStats[0], Math.min(parseInt(e.target.value), points - newStats[0] - newStats[2]), newStats[2]])} placeholder='0' />
            </HStack>
                
            <HStack w='95%' justifyContent='space-between'>
                <Text textColor={buttonText4}>AP</Text>
                <Input w='100px' type="number" name="abilitypower" id="abilitypower" max={36} textAlign='center' _hover={{ bgColor: 'black' }} _focus={{ borderColor: medColor }}
                    textColor={xLightColor} borderColor={medColor} borderRadius='lg' className={`block w-full bg-black sm:text-sm`} value={newStats[2]}
                    onChange={(e) => setNewStats([newStats[0], newStats[1], Math.min(parseInt(e.target.value), points - newStats[0] - newStats[1])])} placeholder='0' />
            </HStack>

            <Center mt='20px'><FullGlowButton text={loading? 'Editing Stats...' : 'Edit Stats'} onClick={onConfirmOpen} disabled={!stats || stats.length === 0 || loading} /></Center>
            <Modal scrollBehavior={'outside'} size='md' isCentered isOpen={isConfirmOpen} onClose={onConfirmClose}>
            <ModalOverlay backdropFilter='blur(10px)'/>
            <ModalContent m='auto' alignItems='center' bgColor='black' borderWidth='1.5px' borderColor={buttonText3} borderRadius='2xl'>
                <ModalHeader className={gradientText} textAlign='center' fontSize='20px' fontWeight='bold'>Confirm Stats Change</ModalHeader>
                <ModalBody>
                <VStack m={1} alignItems='center' justifyContent='center' spacing='10px'>
                    <Text fontSize='14px' textAlign='center' textColor={buttonText4}>{unitName}&apos;s New Stats:</Text>
                    <Text fontSize='16px' textAlign='center' textColor={buttonText5}>ATK: {newStats[0]} | DEF: {newStats[1]} | AP: {newStats[2]}</Text>
                    <Text fontSize='14px' textAlign='center' textColor={buttonText4}>25 $EXP will be clawed back from your account</Text>
                    <HStack py={4}>
                        <FullGlowButton text='Confirm!' onClick={handleStats} />
                        <FullGlowButton text='X' onClick={onConfirmClose} />
                    </HStack>
                </VStack>
                </ModalBody>
            </ModalContent>
            </Modal>

            <SuccessPopup isOpen={isSuccessOpen} onClose={onSuccessClose} message={popMessage}  title={popTitle} />
        </VStack>
    )

}