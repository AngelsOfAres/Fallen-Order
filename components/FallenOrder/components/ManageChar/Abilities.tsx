import * as React from 'react'
import { Modal, ModalBody, ModalHeader, ModalOverlay, ModalContent, Text, HStack, VStack, Center, useDisclosure, useColorModeValue, Select, useColorMode, Box } from '@chakra-ui/react'
import styles from '../../../../styles/glow.module.css'
import { FullGlowButton } from 'components/Buttons'
import { useState } from 'react'
import { statsChar } from 'api/backend'
import { useWallet } from '@txnlab/use-wallet'
import { SuccessPopup } from '../Popups/Success'

export function AbilitiesChar(props: any) {
    const { asset_id, name, unitName, abilities } = props
    const { activeAddress } = useWallet()
    const [newAbilities, setNewAbilities] = useState<any>(abilities)
    const [loading, setLoading] = useState<boolean>(false)
    const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure()
    const { isOpen: isSuccessOpen, onOpen: onSuccessOpen, onClose: onSuccessClose } = useDisclosure()
    const buttonText3 = useColorModeValue('orange.500','cyan.500')
    const buttonText4 = useColorModeValue('orange.200','cyan.100')
    const xLightColor = useColorModeValue('orange.100','cyan.100')
    const LightColor = useColorModeValue('orange.300','cyan.300')
    const medColor = useColorModeValue('orange.500','cyan.500')
    const buttonText5 = useColorModeValue('yellow','cyan')
    const gradientText = useColorModeValue(styles.textAnimatedGlowL, styles.textAnimatedGlowD)

    const basic_options: any = {
        1: 'Fury',
        2: 'Slash',
        3: 'Purify',
        4: 'Retribution',
        5: 'Fireball',
        6: 'Arcane Nova',
    }

    const ultimate_options: any = {
        1: 'Molten Rage',
        2: 'Death Blow',
        3: 'Pestilence',
        4: 'Divine Aura'
    }

    const selectedAbilities: any = {
        1: newAbilities[0],
        2: newAbilities[1],
        3: newAbilities[2],
        4: newAbilities[3]
      }
    
    const availableBasicOptions: any = Object.fromEntries(
        Object.entries(basic_options).filter(
            ([key, value]) => !Object.values(selectedAbilities).includes(value)
        )
      )

    const availableUltimateOptions: any = Object.fromEntries(
        Object.entries(ultimate_options).filter(
            ([key, value]) => !Object.values(selectedAbilities).includes(value)
        )
      )

    async function handleAbilities() {
        setLoading(true)
        onConfirmClose()
        await statsChar(asset_id, activeAddress, newAbilities)
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
        onSuccessOpen()
    }

    return (
        <VStack m={4} spacing='12px'>
                <Text mb={-2} textColor={buttonText5}>Basic Abilities</Text>

                <Select iconColor={LightColor} textColor={xLightColor} cursor='pointer' _hover={{ borderColor: medColor }} borderColor={LightColor} borderWidth='1px' onChange={(e) => setNewAbilities([basic_options[parseInt(e.target.value)], newAbilities[1], newAbilities[2], newAbilities[3]])} placeholder={newAbilities[0] === '-' ? 'Choose Ability 1' : newAbilities[0]}>
                    {Object.entries(availableBasicOptions).map(([key, value]: any) => (
                        <option style={{ backgroundColor: 'black' }} key={key} value={key}>
                        {value}
                        </option>
                    ))}
                </Select>
                
                <Select iconColor={LightColor} textColor={xLightColor} cursor='pointer' _hover={{ borderColor: medColor }} borderColor={LightColor} borderWidth='1px' onChange={(e) => setNewAbilities([newAbilities[0], basic_options[parseInt(e.target.value)], newAbilities[2], newAbilities[3]])} placeholder={newAbilities[1] === '-' ? 'Choose Ability 2' : newAbilities[1]}>
                    {Object.entries(availableBasicOptions).map(([key, value]: any) => (
                        <option style={{ backgroundColor: 'black'}} key={key} value={key}>
                        {value}
                        </option>
                    ))}
                </Select>
                
                <Select iconColor={LightColor} textColor={xLightColor} cursor='pointer' _hover={{ borderColor: medColor }} borderColor={LightColor} borderWidth='1px' onChange={(e) => setNewAbilities([newAbilities[0], newAbilities[1], basic_options[parseInt(e.target.value)], newAbilities[3]])} placeholder={newAbilities[2] === '-' ? 'Choose Ability 3' : newAbilities[2]}>
                    {Object.entries(availableBasicOptions).map(([key, value]: any) => (
                        <option style={{ backgroundColor: 'black' }} key={key} value={key}>
                        {value}
                        </option>
                    ))}
                </Select>

            <VStack mt='12px' w='100%' spacing='0px'>
                <Text textColor={buttonText5}>Ultimate</Text>
                <Select iconColor={LightColor} textColor={xLightColor} cursor='pointer' _hover={{ borderColor: medColor }} borderColor={LightColor} borderWidth='1px' onChange={(e) => setNewAbilities([newAbilities[0], newAbilities[1], newAbilities[2], ultimate_options[parseInt(e.target.value)]])} placeholder={newAbilities[3] === '-' ? 'Choose Ultimate' : newAbilities[3]}>
                    {Object.entries(availableUltimateOptions).map(([key, value]: any) => (
                        <option style={{ backgroundColor: 'black' }} key={key} value={key}>
                        {value}
                        </option>
                    ))}
                </Select>
            </VStack>

            <Center mt='20px'><FullGlowButton text={loading? 'Editing Abilities...' : 'Edit Abilities'} onClick={onConfirmOpen} disabled={newAbilities[0] === '-' || newAbilities[1] === '-' || newAbilities[2] === '-' || newAbilities[3] === '-' || loading} /></Center>
            <Modal scrollBehavior={'outside'} size='xs' isCentered isOpen={isConfirmOpen} onClose={onConfirmClose}>
            <ModalOverlay backdropFilter='blur(10px)'/>
            <ModalContent m='auto' alignItems='center' bgColor='black' borderWidth='1.5px' borderColor={buttonText3} borderRadius='lg'>
                <ModalHeader className={gradientText} textAlign='center' fontSize='20px' fontWeight='bold'>Confirm Stats Change</ModalHeader>
                <ModalBody>
                <VStack m={1} alignItems='center' justifyContent='center' spacing='10px'>
                    <Text fontSize='14px' textAlign='center' textColor={buttonText4}>{unitName}&apos;s New Abilities:</Text>
                    <Text fontSize='18px' textAlign='center' textColor={buttonText5}>Basic: {newAbilities[0]} | {newAbilities[1]} | {newAbilities[2]}</Text>
                    <Text fontSize='18px' textAlign='center' textColor={buttonText5}>Ultimate: {newAbilities[3]}</Text>
                    <Text fontSize='14px' textAlign='center' textColor={buttonText4}>25 $EXP will be clawed back from your account</Text>
                    <HStack py={4}>
                        <FullGlowButton text='Confirm!' onClick={handleAbilities} />
                        <FullGlowButton text='X' onClick={onConfirmClose} />
                    </HStack>
                </VStack>
                </ModalBody>
            </ModalContent>
            </Modal>

            <SuccessPopup isOpen={isSuccessOpen} onClose={onSuccessClose} message={`${name && name.length > 0 ? name : unitName}'s Abilities Updated!`} />
        </VStack>
    )

}