import * as React from 'react'
import { Box, Container, Modal, ModalBody, ModalHeader, ModalFooter, ModalOverlay, ModalContent, Tooltip, Text, Link, Image, Button, Divider, Flex, HStack, VStack, Center, useDisclosure, useColorModeValue, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from '@chakra-ui/react'
import styles from '../../../styles/glow.module.css'
import { FullGlowButton } from 'components/Buttons'
import { RenameManage } from './ManageChar/Rename'
import { StatsManage } from './ManageChar/Stats'
import { AbilitiesManage } from './ManageChar/Abilities'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useWallet } from '@txnlab/use-wallet'
import { boostChar, levelChar } from 'api/backend'
import { SuccessPopup } from './Popups/Success'
import { wisdom_required, expCost, materialCost } from './Constants/levelup'
import { formatAssetBalance } from 'utils'
import { useEffect } from 'react'

export function CharCard(props: any) {
    const { activeAddress } = useWallet()
    const { metadata, asset_id, name, unitName, image, boostBal } = props
    const levelFull = metadata.Level.split('/')
    const level = parseInt(levelFull[0])
    const wisdom = parseInt(levelFull[1])
    const [LVLUp, setLVLUp] = useState<boolean>(false)
        
    useEffect(() => {
        if (wisdom >= wisdom_required[level + 1]) {
            setLVLUp(true)
        } else {
            setLVLUp(false)
        }
    }, [wisdom, level])

    const levelTooltip = LVLUp ? `Ready for LVL ${level + 1}, Master!` : `Wisdom to LVL ${(level+1)} = ${formatAssetBalance(wisdom, 0, true, true, 3)}/${formatAssetBalance(wisdom_required[level+1], 0 , true, true, 3)}`

    const { isOpen: isManageOpen, onOpen: onManageOpen, onClose: onManageClose } = useDisclosure()
    const { isOpen: isSuccessOpen, onOpen: onSuccessOpen, onClose: onSuccessClose } = useDisclosure()
    const { isOpen: isLevelConfirmOpen, onOpen: onLevelConfirmOpen, onClose: onLevelConfirmClose } = useDisclosure()
    const { isOpen: isBoostConfirmOpen, onOpen: onBoostConfirmOpen, onClose: onBoostConfirmClose } = useDisclosure()
    const { isOpen, onToggle } = useDisclosure()
    const boxGlow = useColorModeValue(styles.boxGlowL, styles.boxGlowD)
    const gradientText = useColorModeValue(styles.textAnimatedGlowL, styles.textAnimatedGlowD)
    const buttonText = useColorModeValue('linear(to-tr, red, yellow)', 'linear(to-tr, purple.600, cyan)')
    const buttonText3 = useColorModeValue('orange.500','cyan.500')
    const buttonText4 = useColorModeValue('orange.200','cyan.100')
    const bgCardOn = useColorModeValue('linear(60deg, whiteAlpha.300 3%, black 50%, whiteAlpha.300 97%)','linear(60deg, whiteAlpha.300 3%, black 50%, whiteAlpha.300 97%)')
    const bgCardOff = useColorModeValue('linear(60deg, whiteAlpha.300 10%, black 35%, black 65%, whiteAlpha.300 90%)','linear(60deg, whiteAlpha.300 10%, black 35%, black 65%, whiteAlpha.300 90%)')
    const buttonText5 = useColorModeValue('yellow','cyan')
    
    const [componentToRender, setComponentToRender] = useState<any>(null)
    
    const [loading, setLoading] = useState<boolean>(false)

    async function handleLevelUp() {
        setLoading(true)
        onLevelConfirmClose()
        await levelChar(asset_id, activeAddress)
        .then((data: any) => {
        if (data && data.includes("Error")) {
            console.log(data)
            return
        }
        })
        .catch((error: any) => {
        console.error(error)
        return
        })
        setLoading(false)
        onSuccessOpen()
    }

    async function handleBoost() {
        setLoading(true)
        onBoostConfirmClose()
        await boostChar(asset_id, activeAddress)
        .then((data: any) => {
        if (data && data.includes("Error")) {
            console.log(data)
            return
        }
        })
        .catch((error: any) => {
        console.error(error)
        return
        })
        setLoading(false)
        onSuccessOpen()
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
            <Flex m={3} textColor={buttonText3} fontFamily="Orbitron" alignItems='center' justifyContent='center'>
                <VStack mx={2} alignItems='center' spacing='2px'>
                <Text bgGradient={buttonText} bgClip='text' fontSize='12px'>LVL</Text>
                <Box textColor={buttonText4} width='100%' mx={2} py={1} px={1.5} borderColor={buttonText3} bgGradient={bgCardOff} borderWidth='1px' borderRadius='xl'>
                    <Center>
                        <Tooltip label={'Health Points'} aria-label='Tooltip'>
                            <Text fontSize='xs'>{level}/{formatAssetBalance(wisdom, 0, true, true, 3)}</Text>
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
                        <HStack className='whitespace-nowrap'>
                            <Text fontSize='10px' bgGradient={buttonText} bgClip='text'>Next Ritual:</Text>
                            <Text fontSize='9px' textColor={buttonText4}>23:54</Text>
                        </HStack>
                        </Center>
                    </Box>
                </VStack>
                <Divider p={1} h='60px' borderColor={buttonText3} orientation='vertical'/>
                <VStack>
                <FullGlowButton text='Edit' onClick={onManageOpen}/>
                <Link href={'/equip'} isExternal><FullGlowButton text='Equip' /></Link>
                <Modal scrollBehavior={'outside'} size='md' isCentered isOpen={isManageOpen} onClose={onManageClose}>
                  <ModalOverlay backdropFilter='blur(10px)'/>
                  <ModalContent m='auto' alignItems='center' bgColor='black' borderWidth='1.5px' borderColor={buttonText3} borderRadius='2xl'>
                    <ModalHeader className={gradientText} textAlign='center' fontSize='20px'>Edit Character</ModalHeader>
                    <ModalBody>
                      <Flex pb={4} alignSelf='center' justifyContent="center" flexDirection="row" flexWrap="wrap" gap='12px'>
                        <FullGlowButton text='Rename' onClick={() => setComponentToRender('rename')} disabled={componentToRender === 'rename'}/>
                        <FullGlowButton text='Stats'  onClick={() => setComponentToRender('stats')} disabled={componentToRender === 'stats'}/>
                        <FullGlowButton text='Abilities'  onClick={() => setComponentToRender('abilities')} disabled={componentToRender === 'abilities'}/>
                        <Tooltip py={1} px={2} borderWidth='1px' borderRadius='lg' arrowShadowColor={buttonText5} borderColor={buttonText3} bgColor='black' textColor={buttonText4} fontSize='16px' fontFamily='Orbitron' textAlign='center' hasArrow label={`Available Boosters: ${boostBal}`} aria-label='Tooltip'>                  
                            <div><FullGlowButton text={loading ? 'Boosting...' : 'Boost'} onClick={onBoostConfirmOpen}  disabled={boostBal <= 0 || boostBal === 'Not Opted!'}/></div>
                        </Tooltip>
                        <Tooltip py={1} px={2} borderWidth='1px' borderRadius='lg' arrowShadowColor={buttonText5} borderColor={buttonText3} bgColor='black' textColor={buttonText4} fontSize='16px' fontFamily='Orbitron' textAlign='center' hasArrow label={levelTooltip} aria-label='Tooltip'>                      
                        <motion.div
                            animate={{ scale: LVLUp ? [1, 1.1, 1] : 1 }}
                            transition={{
                              repeat: Infinity,
                              duration: 0.75,
                              ease: "linear",
                            }}
                        >
                            <FullGlowButton text={loading ? 'Leveling Up...' : 'Level Up'} onClick={onLevelConfirmOpen} disabled={!LVLUp} />
                        </motion.div>
                        </Tooltip>
                      </Flex>
                      {componentToRender === 'rename' && <RenameManage asset_id={asset_id} name={metadata.Name ? metadata.Name : name} unitName={unitName} />}
                      {componentToRender === 'stats' && <StatsManage asset_id={asset_id} name={metadata.Name ? metadata.Name : name} unitName={unitName} stats={[metadata.ATK, metadata.DEF, metadata.AP]} points={metadata.Points}/>}
                      {componentToRender === 'abilities' && <AbilitiesManage asset_id={asset_id} name={metadata.Name ? metadata.Name : name} unitName={unitName} abilities={[metadata['Ability 1'] ? metadata['Ability 1'] : '-', metadata['Ability 2'] ? metadata['Ability 2'] : '-', metadata['Ability 3'] ? metadata['Ability 3'] : '-', metadata['Ultimate'] ? metadata['Ultimate'] : '-']}/>}

                        <Modal scrollBehavior={'outside'} size='md' isCentered isOpen={isLevelConfirmOpen} onClose={onLevelConfirmClose}>
                        <ModalOverlay backdropFilter='blur(10px)'/>
                        <ModalContent m='auto' alignItems='center' bgColor='black' borderWidth='1.5px' borderColor={buttonText3} borderRadius='2xl'>
                            <ModalHeader className={gradientText} textAlign='center' fontSize='20px' fontWeight='bold'>Confirm Level Up</ModalHeader>
                            <ModalBody>
                            <VStack m={1} alignItems='center' justifyContent='center'>
                                <Text pb={4} fontSize='24px' textAlign='center' textColor={buttonText5}>New Level: {level + 1}</Text>
                                <Text fontSize='18px' textAlign='center' textColor={buttonText4}>Total Cost</Text>
                                <Text pb={4} fontSize='18px' textAlign='center' textColor={buttonText5}>{expCost[level]} $EXP | {materialCost[level]} Oak Logs | {materialCost[level]} Clay Ore</Text>
                                <Text fontSize='16px' textAlign='center' textColor={buttonText4}>Payment will be clawed back from your account</Text>
                                <HStack py={4}>
                                    <FullGlowButton text='Confirm!' onClick={handleLevelUp} />
                                    <FullGlowButton text='X' onClick={onLevelConfirmClose} />
                                </HStack>
                            </VStack>
                            </ModalBody>
                        </ModalContent>
                        </Modal>

                        <Modal scrollBehavior={'outside'} size='md' isCentered isOpen={isBoostConfirmOpen} onClose={onBoostConfirmClose}>
                        <ModalOverlay backdropFilter='blur(10px)'/>
                        <ModalContent m='auto' alignItems='center' bgColor='black' borderWidth='1.5px' borderColor={buttonText3} borderRadius='2xl'>
                            <ModalHeader className={gradientText} textAlign='center' fontSize='20px' fontWeight='bold'>Confirm Boost</ModalHeader>
                            <ModalBody>
                            <VStack m={1} alignItems='center' justifyContent='center'>
                                <Box mb={4} borderColor={buttonText3} borderWidth='1px' borderRadius='8px'>
                                    <Image borderRadius='9px' boxSize={24} onClick={onToggle} alt={'Stat Booster - $BOOST'} src={'https://ipfs.algonode.xyz/ipfs/bafybeibdnf2qn7a3w5ckxecv4svykpntufjkqh2zank6kx6mn2idik2nz4'} />
                                </Box>
                                <Text fontSize='16px' textAlign='center' textColor={buttonText4}>New Points</Text>
                                <Text pb={4} fontSize='20px' textAlign='center' textColor={buttonText5}>{parseInt(metadata.Points) + 50}</Text>
                                <Text fontSize='16px' textAlign='center' textColor={buttonText4}>1 Stat Booster $BOOST will be clawed back from your account</Text>
                                <HStack py={4}>
                                    <FullGlowButton text='Confirm!' onClick={handleBoost} />
                                    <FullGlowButton text='X' onClick={onBoostConfirmClose} />
                                </HStack>
                            </VStack>
                            </ModalBody>
                        </ModalContent>
                        </Modal>

                    </ModalBody>
                    <ModalFooter>
                        <FullGlowButton text='Cancel' onClick={onManageClose} disabled={false} />
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