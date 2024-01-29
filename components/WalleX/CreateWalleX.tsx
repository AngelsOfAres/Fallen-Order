import * as React from 'react'
import { Modal, ModalBody, ModalHeader, ModalFooter, ModalOverlay, ModalContent, Text, Flex, useDisclosure, useColorModeValue, Textarea, Input, Button, Tooltip, Box } from '@chakra-ui/react'
import styles from '../../styles/glow.module.css'
import { useState } from 'react'
import { FullGlowButton, IconGlowButton2 } from 'components/Buttons'
import { useWallet } from '@txnlab/use-wallet'
import { GiWallet } from 'react-icons/gi'

export function CreateWalleX() {
    const { activeAddress } = useWallet()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [assetList, setAssetList] = useState<any>([])
    const [algoAmount, setAlgoAmount] = useState<any>([])
    const totalAmount = parseFloat(algoAmount) + assetList.length*0.1 + 1

    const gradientText = useColorModeValue(styles.textAnimatedGlowL, styles.textAnimatedGlowD)
    const buttonText3 = useColorModeValue('orange.500','cyan.500')
    const buttonText4 = useColorModeValue('orange.200','cyan.100')
    const buttonText5 = useColorModeValue('orange','cyan')
    const xLightColor = useColorModeValue('orange.100','cyan.100')
    const lightColor = useColorModeValue('orange.300','cyan.300')
    const medColor = useColorModeValue('orange.500','cyan.500')

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const amount = e.target.value
        const regExp = /^\d+(?:\.\d{0,6})?$/gm
        if (amount !== '' && amount.match(regExp) === null) {
          return
        }
        setAlgoAmount(amount)
      }

    return (
        <>
            <Tooltip py={1} px={2} borderWidth='1px' borderRadius='lg' arrowShadowColor={buttonText5} borderColor={buttonText5} bgColor='black' textColor={buttonText4} fontSize='12px' fontFamily='Orbitron' textAlign='center' hasArrow label={'Create New Wallet'} aria-label='Tooltip'>
                <Box w='fit-content' m={6}><IconGlowButton2 icon={GiWallet} onClick={onOpen} /></Box>
            </Tooltip>
            <Modal scrollBehavior={'outside'} size='md' isCentered isOpen={isOpen} onClose={onClose}>
            <ModalOverlay backdropFilter='blur(10px)'/>
            <ModalContent m='auto' alignItems='center' bgColor='black' borderWidth='1.5px' borderColor={buttonText3} borderRadius='2xl'>
                <ModalHeader className={gradientText} textAlign='center' fontSize='24px' fontWeight='bold'>Create WalleX</ModalHeader>
                <ModalBody>
                    <Text fontSize='16px' textAlign='center' textColor={buttonText4}>Create a new wallet and load it with assets all in one go!<br />Simply choose how much $ALGO to add and the asset IDs you want to preload the wallet with.<br />Fees: 1A/Wallet</Text>
                    <Flex pt={4} flexDirection="row" flexWrap="wrap" justifyContent='center' gap='12px'>
                        <Text mb={-2} fontSize='14px' textAlign='center' className={gradientText}>$ALGO</Text>
                        <div className="mt-1 sm:col-span-4 pl-4 sm:mt-0">
                            <div className="flex rounded-md shadow-sm max-w-md">
                                <Input type="text" name="amount" id="amount" borderRightRadius={'0px'} _hover={{ bgColor: 'black' }} _focus={{ borderColor: medColor }}
                                    textColor={xLightColor} borderColor={medColor} className={`block w-full rounded-none rounded-l-md bg-black sm:text-sm`} value={algoAmount}
                                    onChange={handleAmountChange} placeholder="0.000"
                                />
                                <Button _hover={{ bgColor: 'black', textColor: medColor }} bgColor="black" textColor={xLightColor} borderWidth={1} borderLeftRadius={'0px'} borderColor={medColor}
                                    type="button" className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md px-4 py-2"onClick={() => setAlgoAmount('')}
                                >
                                Clear
                                </Button>
                            </div>
                        </div>

                        <Text mb={-2} fontSize='14px' textAlign='center' className={gradientText}>Assets</Text>
                        <Textarea
                            minH='120px'
                            mb={4}
                            value={assetList.join('\n')}
                            onChange={(e) => setAssetList(e.target.value.split('\n'))}
                            placeholder={`Enter Asset IDs\nID #1\nID#2\nID#3`}
                            _hover={{bgColor: 'black'}}
                            _focus={{borderColor: medColor}}
                            textColor={xLightColor}
                            borderColor={medColor}
                        />

                        <Text fontSize='16px' textAlign='center' className={gradientText}>Total: </Text>
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