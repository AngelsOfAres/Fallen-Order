import * as React from 'react'
import { Box, Container, Modal, ModalBody, ModalHeader, ModalFooter, ModalOverlay, ModalContent, Tooltip, Text, Link, Image, Button, Divider, Flex, HStack, VStack, Center, useDisclosure, useColorModeValue, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from '@chakra-ui/react'
import styles from '../../../styles/glow.module.css'
import { FullGlowButton } from 'components/Buttons'
import { Rename } from './ManageChar/Rename'
import { StatsChar } from './ManageChar/Stats'
import { AbilitiesChar } from './ManageChar/Abilities'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useWallet } from '@txnlab/use-wallet'
import { levelChar } from 'api/backend'
import { SuccessPopup } from './Popups/Success'

export function CharCard(props: any) {
    const { activeAddress } = useWallet()
    const { metadata, asset_id, name, unitName, image } = props
    const levelFull = metadata.Level.split('/')
    const level = parseInt(levelFull[0])
    const wisdom = parseInt(levelFull[1])
    const [LVLUp, setLVLUp] = useState<boolean>(false)

    const scaleVariants = {
        initial: { scale: 1 },
        scaled: { scale: 1.2 },
      }

    const materialCost = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150]
    const expCost = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000, 13000, 14000, 15000, 16000, 17000, 18000, 19000, 20000, 21000, 22000, 23000, 24000, 25000]
    const wisdom_required = [0, 20750, 64250, 133250, 230250, 358250, 520750,
        721000, 963250, 1251750, 1591250, 1986750, 2443750,
        2968000, 3565500, 4244750, 5011750, 5874250, 6841250,
        7923750, 9134000, 10486250, 11993250, 13671000, 15537500,
        17616500, 19918000, 22482000, 25333250, 28592500, 32089250,
        35948250, 40199000, 44864750, 49971750, 55547250, 61619750,
        68218750, 75374500, 83117750, 91480000, 100486500, 110318250,
        120970250, 132474250, 144862750, 158169500, 172429250, 187678500,
        203954500, 221294500]
    
        
    if (wisdom >= wisdom_required[level+1]) {
        setLVLUp(true)
    }

    const { isOpen: isLevelOpen, onOpen: onLevelOpen, onClose: onLevelClose } = useDisclosure()
    const { isOpen: isSuccessOpen, onOpen: onSuccessOpen, onClose: onSuccessClose } = useDisclosure()
    const { isOpen, onToggle } = useDisclosure()
    const boxGlow = useColorModeValue(styles.boxGlowL, styles.boxGlowD)
    const gradientText = useColorModeValue(styles.textAnimatedGlowL, styles.textAnimatedGlowD)
    const buttonText = useColorModeValue('linear(to-tr, red, yellow)', 'linear(to-tr, purple.600, cyan)')
    const colorText3 = useColorModeValue('orange.200','cyan.100')
    const buttonText3 = useColorModeValue('orange.500','cyan.500')
    const buttonText4 = useColorModeValue('orange.200','cyan.100')
    const colorText = useColorModeValue('linear(to-tr, red, yellow)', 'linear(to-tr, purple.600, cyan)')
    const bgCardOn = useColorModeValue('linear(60deg, whiteAlpha.300 3%, black 50%, whiteAlpha.300 97%)','linear(60deg, whiteAlpha.300 3%, black 50%, whiteAlpha.300 97%)')
    const bgCardOff = useColorModeValue('linear(60deg, whiteAlpha.300 10%, black 35%, black 65%, whiteAlpha.300 90%)','linear(60deg, whiteAlpha.300 10%, black 35%, black 65%, whiteAlpha.300 90%)')
    const buttonText5 = useColorModeValue('yellow','cyan')
    
    const [componentToRender, setComponentToRender] = useState<any>(null)
    
    const [loading, setLoading] = useState<boolean>(false)
    const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure()

    async function handleLevelUp() {
        setLoading(true)
        onConfirmClose()
        await levelChar(asset_id, activeAddress)
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
        <Box w={isOpen ? 'auto' : '100px'} h={isOpen ? 'auto' : '100px'} className={boxGlow} bgGradient={bgCardOn} borderColor={buttonText3} m={4} borderWidth='1.5px' borderRadius='16px'>
            <Container pb={0} pt={0} pl={0} pr={0} centerContent>
                <Image zIndex={1} mt={isOpen ? '24px' : 0} w='inherit' maxW='150px' onClick={onToggle} borderRadius='14.5px' alt={unitName} src={image} />
                {isOpen ?
                <Box mt={-0.3} position="relative" py={0.5} px={2} bgGradient={bgCardOn} borderColor={buttonText3} borderTopWidth='0px' borderBottomWidth='0.5px' borderLeftWidth='0.5px' borderRightWidth='0.5px' borderBottomRadius='xl' borderTopRadius='sm'>
                    <Text bgGradient={buttonText} bgClip='text' fontSize='12px'>{unitName}</Text>
                </Box> : null}
            </Container>
            {isOpen ?
            <>
            <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, height: '100px', width: '100px' }}
              animate={{ opacity: 1, height: 'auto', width: 'auto' }}
              exit={{ opacity: 0, height: '100px', width: '100px' }}
              transition={{ duration: 0.2 }}
            >
            <Flex my={3} textColor={buttonText3} fontFamily="Orbitron" alignItems='center' justifyContent='center'>
                <VStack mx={2} alignItems='center' spacing='2px'>
                <Text bgGradient={buttonText} bgClip='text' fontSize='12px'>LVL</Text>
                <Box textColor={buttonText4} width='100%' mx={2} py={1} px={1.5} borderColor={buttonText3} bgGradient={bgCardOff} borderWidth='1px' borderRadius='xl'>
                    <Center>
                        <Tooltip label={'Health Points'} aria-label='Tooltip'>
                            <Text fontSize='xs'>{level}</Text>
                        </Tooltip>
                    </Center>
                </Box>
                </VStack>
                <VStack mx={2} alignItems='center' spacing='2px'>
                <Text bgGradient={buttonText} bgClip='text' fontSize='12px'>HP</Text>
                <Box textColor={buttonText4} width='100%' mx={2} py={1} px={1.5} borderColor={buttonText3} bgGradient={bgCardOff} borderWidth='1px' borderRadius='xl'>
                    <Center>
                        <Tooltip label={'Health Points'} aria-label='Tooltip'>
                            <Text fontSize='xs'>{metadata.HP}</Text>
                        </Tooltip>
                    </Center>
                </Box>
                </VStack>
                <VStack mx={2} alignItems='center' spacing='2px'>
                <Text bgGradient={buttonText} bgClip='text' fontSize='12px'>Points</Text>
                <Box textColor={buttonText4} width='100%' mx={2} py={1} px={1.5} borderColor={buttonText3} bgGradient={bgCardOff} borderWidth='1px' borderRadius='xl'>
                    <Center>
                        <Tooltip label={'Ability Power'} aria-label='Tooltip'>
                            <Text fontSize='xs'>{metadata.Points}</Text>
                        </Tooltip>
                    </Center>
                </Box>
                </VStack>
                </Flex>
                <Flex textColor={buttonText3} fontFamily="Orbitron" alignItems='center' justifyContent='center'>
                    <VStack mx={2} alignItems='center' spacing='2px'>
                    <Text bgGradient={buttonText} bgClip='text' fontSize='12px'>ATK</Text>
                    <Box textColor={buttonText4} width='100%' mx={2} py={1} px={1.5} borderColor={buttonText3} bgGradient={bgCardOff} borderWidth='1px' borderRadius='xl'>
                        <Center>
                            <Tooltip label={'Attack'} aria-label='Tooltip'>
                                <Text fontSize='xs'>{metadata.ATK}</Text>
                            </Tooltip>
                        </Center>
                    </Box>
                    </VStack>
                    <VStack mx={2} alignItems='center' spacing='2px'>
                    <Text bgGradient={buttonText} bgClip='text' fontSize='12px'>DEF</Text>
                    <Box textColor={buttonText4} width='100%' mx={2} py={1} px={1.5} borderColor={buttonText3} bgGradient={bgCardOff} borderWidth='1px' borderRadius='xl'>
                        <Center>
                            <Tooltip label={'Defense'} aria-label='Tooltip'>
                                <Text fontSize='xs'>{metadata.DEF}</Text>
                            </Tooltip>
                        </Center>
                    </Box>
                    </VStack>
                    <VStack mx={2} alignItems='center' spacing='2px'>
                    <Text bgGradient={buttonText} bgClip='text' fontSize='12px'> AP </Text>
                    <Box textColor={buttonText4} width='100%' mx={2} py={1} px={1.5} borderColor={buttonText3} bgGradient={bgCardOff} borderWidth='1px' borderRadius='xl'>
                        <Center>
                            <Tooltip label={'Ability Power'} aria-label='Tooltip'>
                                <Text fontSize='xs'>{metadata.AP}</Text>
                            </Tooltip>
                        </Center>
                    </Box>
                    </VStack>
                </Flex>
                <Box p={4} alignItems='center' justifyContent='space-between'>
                <HStack alignItems='center' justifyContent='center' spacing='10px'>
                <VStack>
                    <Text fontSize='14px' bgGradient={buttonText} bgClip='text'>Kinship</Text>
                `   <HStack w='inherit' justifyContent='center'>
                        <Box textColor={buttonText4} p={2} borderColor={buttonText3} bgGradient={bgCardOff} borderWidth='1px' borderRadius='lg'>
                            <Center>
                                <Tooltip hasArrow label={'Kinship'} aria-label='Tooltip'>
                                    <Text fontSize='12px'>{metadata.Kinship}</Text>
                                </Tooltip>
                            </Center>
                        </Box>
                        <FullGlowButton text='Cast!' />
                    </HStack>
                    <Box pb={1}>
                        <Center>
                        <HStack>
                            <Text fontSize='10px' bgGradient={buttonText} bgClip='text'>Next Ritual:</Text>
                            <Text fontSize='9px' textColor={buttonText4}>23:54</Text>
                        </HStack>
                        </Center>
                    </Box>
                </VStack>
                <Divider p={1} h='60px' borderColor={buttonText3} orientation='vertical'/>
                <VStack>
                <FullGlowButton text='Edit' onClick={onLevelOpen}/>
                <Link href={'/equip'} isExternal><FullGlowButton text='Equip' /></Link>
                <Modal scrollBehavior={'outside'} size='xs' isCentered isOpen={isLevelOpen} onClose={onLevelClose}>
                  <ModalOverlay backdropFilter='blur(10px)'/>
                  <ModalContent m='auto' alignItems='center' bgColor='black' borderWidth='1.5px' borderColor={buttonText3} borderRadius='lg'>
                    <ModalHeader bgGradient={colorText} bgClip='text' textAlign='center' fontSize='18px' fontWeight='bold'>Edit Character</ModalHeader>
                    <ModalBody>
                      <Flex pb={4} alignSelf='center' justifyContent="center" flexDirection="row" flexWrap="wrap" gap='12px'>
                        <FullGlowButton text='Rename' onClick={() => setComponentToRender('rename')} disabled={componentToRender === 'rename'}/>
                        <FullGlowButton text='Stats'  onClick={() => setComponentToRender('stats')} disabled={componentToRender === 'stats'}/>
                        <FullGlowButton text='Abilities'  onClick={() => setComponentToRender('abilities')} disabled={componentToRender === 'abilities'}/>
                        <FullGlowButton text='Boost'  onClick={() => setComponentToRender('rename')} disabled={componentToRender === 'rename'}/>
                        
                        <motion.div
                            animate={{ scale: LVLUp ? [1, 1.1, 1] : 1 }}
                            transition={{
                              repeat: Infinity,
                              duration: 2,
                              ease: "linear",
                            }}
                        >
                        <FullGlowButton text='Level Up'  onClick={onConfirmOpen} disabled={!LVLUp} />
                        </motion.div>
                      </Flex>
                      {componentToRender === 'rename' && <Rename asset_id={asset_id} name={metadata.Name ? metadata.Name : name} unitName={unitName} />}
                      {componentToRender === 'stats' && <StatsChar asset_id={asset_id} name={metadata.Name ? metadata.Name : name} unitName={unitName} stats={[metadata.ATK, metadata.DEF, metadata.AP]} points={metadata.Points}/>}
                      {componentToRender === 'abilities' && <AbilitiesChar asset_id={asset_id} name={metadata.Name ? metadata.Name : name} unitName={unitName} abilities={[metadata['Ability 1'] ? metadata['Ability 1'] : '-', metadata['Ability 2'] ? metadata['Ability 2'] : '-', metadata['Ability 3'] ? metadata['Ability 3'] : '-', metadata['Ultimate'] ? metadata['Ultimate'] : '-']}/>}
                      <Box mt={6}>
                        <Modal scrollBehavior={'outside'} size='xs' isCentered isOpen={isConfirmOpen} onClose={onConfirmClose}>
                        <ModalOverlay backdropFilter='blur(10px)'/>
                        <ModalContent m='auto' alignItems='center' bgColor='black' borderWidth='1.5px' borderColor={buttonText3} borderRadius='lg'>
                            <ModalHeader className={gradientText} textAlign='center' fontSize='20px' fontWeight='bold'>Confirm Level Up</ModalHeader>
                            <ModalBody>
                            <VStack m={1} alignItems='center' justifyContent='center'>
                                <Text pb={4} fontSize='24px' textAlign='center' textColor={buttonText5}>New Level: {level + 1}</Text>
                                <Text fontSize='18px' textAlign='center' textColor={buttonText4}>Total Cost</Text>
                                <Text pb={4} fontSize='18px' textAlign='center' textColor={buttonText5}>{expCost[level]} $EXP | {materialCost[level]} Oak Logs | {materialCost[level]} Clay Ore</Text>
                                <Text fontSize='16px' textAlign='center' textColor={buttonText4}>Payment will be clawed back from your account</Text>
                                <HStack py={4}>
                                    <FullGlowButton text='Confirm!' onClick={handleLevelUp} />
                                    <FullGlowButton text='X' onClick={onConfirmClose} />
                                </HStack>
                            </VStack>
                            </ModalBody>
                        </ModalContent>
                        </Modal>
                        </Box>
                    </ModalBody>
                    <ModalFooter>
                        <FullGlowButton text='Cancel' onClick={onLevelClose} disabled={false} />
                    </ModalFooter>
                  </ModalContent>
                </Modal>
                </VStack>
                </HStack>
                </Box>
        </motion.div>
        </AnimatePresence>
        </> : null}
        <SuccessPopup isOpen={isSuccessOpen} onClose={onSuccessClose} message={`${unitName} has been level up to LVL ${level+1}!`} />
        </Box>
    )

}