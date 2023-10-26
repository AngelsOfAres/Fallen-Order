import * as React from 'react'
import { Box, Container, Modal, ModalBody, ModalHeader, ModalFooter, ModalOverlay, ModalContent, Tooltip, Text, Link, Image, Button, Divider, Flex, HStack, VStack, Center, useDisclosure, useColorModeValue, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Icon } from '@chakra-ui/react'
import styles from '../../../styles/glow.module.css'
import { FullGlowButton, IconGlowButton } from 'components/Buttons'
import { RenameManage } from './ManageChar/Rename'
import { StatsManage } from './ManageChar/Stats'
import { AbilitiesManage } from './ManageChar/Abilities'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useWallet } from '@txnlab/use-wallet'
import { equipTool, manageChar, switchMain } from 'api/backend'
import { SuccessPopup } from './Popups/Success'
import { wisdom_required, expCost, materialCost } from './Constants/levelup'
import { formatAssetBalance } from 'utils'
import { useEffect } from 'react'
import EquipCharacter from './ManageChar/EquipChar'
import { formatDuration } from 'utils/formatTimer'
import { MdKeyboardDoubleArrowUp, MdOutlineStar } from 'react-icons/md'
import toast from 'react-hot-toast'
import { XMarkIcon } from '@heroicons/react/20/solid'

export function CharCard(props: any) {
    const { activeAddress } = useWallet()
    const { metadata, asset_id, name, unitName, image, boostBal, bg_image, bg_name, kin_sec, userProfile } = props
    const levelFull = metadata.Level.split('/')
    const level = parseInt(levelFull[0])
    const wisdom = parseInt(levelFull[1])
    const [LVLUp, setLVLUp] = useState<boolean>(false)
    const [popTitle, setPopTitle] = useState<any>('')
    const [popMessage, setPopMessage] = useState<any>('')
    const success_msg_kin = `Kinship Ritual Successful!`
    const fail_msg_kin = `Kinship Ritual Failed!`
    const success_msg_lvl = `${unitName} has been level up to LVL ${level+1}!`
    const fail_msg_lvl = `Level Up Failed!`
    const success_msg_boost = `50 Points have been added to ${unitName}!`
    const fail_msg_boost = `Points Boost Failed!`
        
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
    const { isOpen: isEquipOpen, onOpen: onEquipOpen, onClose: onEquipClose } = useDisclosure()
    const { isOpen: isMainOpen, onOpen: onMainOpen, onClose: onMainClose } = useDisclosure()
    const { isOpen, onToggle } = useDisclosure()
    const boxGlow = useColorModeValue(styles.boxGlowL, styles.boxGlowD)
    const gradientText = useColorModeValue(styles.textAnimatedGlowL, styles.textAnimatedGlowD)
    const buttonText3 = useColorModeValue('orange.500','cyan.500')
    const buttonText4 = useColorModeValue('orange.200','cyan.100')
    const bgCardOn = useColorModeValue('linear(60deg, whiteAlpha.300 3%, black 50%, whiteAlpha.300 97%)','linear(60deg, whiteAlpha.300 3%, black 50%, whiteAlpha.300 97%)')
    const bgCardOff = useColorModeValue('linear(60deg, whiteAlpha.300 10%, black 35%, black 65%, whiteAlpha.300 90%)','linear(60deg, whiteAlpha.300 10%, black 35%, black 65%, whiteAlpha.300 90%)')
    const buttonText5 = useColorModeValue('orange','cyan')
  
    const [componentToRender, setComponentToRender] = useState<any>(null)
    
    const [loading, setLoading] = useState<boolean>(false)

    async function handleLevelUp() {
        setLoading(true)
        onLevelConfirmClose()

        try{
            const data = await manageChar(activeAddress, ['level', asset_id])
            if (data && data.includes("Error")) {
                setPopTitle('Woops!')
                setPopMessage(fail_msg_lvl)
            console.log(data)
            } else {
            console.log(data)
            if (data) {
                setPopTitle('Success!')
                setPopMessage(success_msg_lvl)
            }
            else {
                setPopTitle('Woops!')
                setPopMessage(fail_msg_lvl)
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

    async function handleBoost() {
        setLoading(true)
        onBoostConfirmClose()

        try{
            const data = await manageChar(activeAddress, ['boost', asset_id])
            if (data && data.includes("Error")) {
                setPopTitle('Woops!')
                setPopMessage(fail_msg_boost)
            console.log(data)
            } else {
            console.log(data)
            if (data) {
                setPopTitle('Success!')
                setPopMessage(success_msg_boost)
            }
            else {
                setPopTitle('Woops!')
                setPopMessage(fail_msg_boost)
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

    async function handleKinship() {
        setLoading(true)
        try{
            const data = await manageChar(activeAddress, ['kinship', asset_id])
            if (data && data.includes("Error")) {
                setPopTitle('Woops!')
                setPopMessage(fail_msg_kin)
                console.log(data)
            } else {
                console.log(data)
                if (data) {
                    setPopTitle('Success!')
                    setPopMessage(success_msg_kin)
                }
                else {
                    setPopTitle('Woops!')
                    setPopMessage(fail_msg_kin)
                }
            }
        } catch (error: any) {
            setPopTitle('Woops!')
            setPopMessage(error.message)
        } finally {
            setLoading(false)
            onSuccessOpen()
        }
    }

    const handleMainSelect = async (type: any) => {
        setLoading(true)
        onMainClose()
        try {
          if (!activeAddress) {
            throw new Error('Log In First Please!!')
          }
    
          toast.loading('Assigning Main Character...', { id: 'txn', duration: Infinity })
    
          try{
              const data = await switchMain(activeAddress, [type, asset_id])
              if (data && data.includes("Error")) {
                console.log(data)
                toast.error('Oops! Main Character Assign Failed!', { id: 'txn' })
                return
              }
          } catch (error: any) {
              console.log(error.message)
              toast.error('Oops! Main Character Assign Failed!', { id: 'txn' })
              return
          } finally {
              setLoading(false)
          }
        } catch (error) {
          console.error(error)
          toast.error('Oops! Main Character Assign Failed!', { id: 'txn' })
          return
        }
        toast.success(`Main Character Assigned!`, {
          id: 'txn',
          duration: 5000
        })
        setPopTitle('Success')
        setPopMessage('Main Character Assigned!')
        onSuccessOpen()
      }

    return (
        <Box w={isOpen ? 'auto' : '100px'} h={isOpen ? 'auto' : '100px'} className={boxGlow} bgGradient={bgCardOn} borderColor={buttonText3} m={4} borderWidth='2px' borderRadius='16px'>
            <Container pb={0} pt={0} pl={0} pr={0} centerContent>
                {bg_image !== '-' ? <Image position='absolute' zIndex={1} mt={isOpen ? '24px' : '-1px'} w={isOpen ? '150px' : '99px'} borderRadius='15.5px' alt={bg_name} src={bg_image} /> : null}
                <Image position={isOpen ? undefined : 'absolute'} zIndex={2} mt={isOpen ? '24px' : '-1px'} w={isOpen ? '150px' : '99px'} onClick={onToggle} borderRadius='15.5px' alt={unitName} src={image} />
                {isOpen ?
                <Box mt={-0.3} position="relative" py={0.5} px={2} bgGradient={bgCardOn} borderColor={buttonText3} borderTopWidth='0px' borderBottomWidth='0.5px' borderLeftWidth='0.5px' borderRightWidth='0.5px' borderBottomRadius='xl' borderTopRadius='sm'>
                    <Text className={gradientText} fontSize='12px'>{metadata.Name ? metadata.Name : unitName}</Text>
                </Box> : null}
            </Container>
            {isOpen ?
            <>
                {userProfile ?
                    <Tooltip ml={4} py={1} px={2} borderWidth='1px' borderRadius='lg' arrowShadowColor={buttonText5} borderColor={buttonText3} bgColor='black' textColor={buttonText4} fontSize='12px' fontFamily='Orbitron' textAlign='center' hasArrow label={userProfile.main_character === asset_id ? 'Remove Main' : 'Assign Main!'} aria-label='Tooltip'>
                        <div className='absolute pl-4 pt--50'><IconGlowButton icon={userProfile.main_character === asset_id ? XMarkIcon : MdOutlineStar} onClick={() => userProfile.main_character === asset_id ? handleMainSelect('remove') : onMainOpen()} disabled={loading} /></div>
                    </Tooltip>
                : null}
                <Modal scrollBehavior={'outside'} size='md' isCentered isOpen={isMainOpen} onClose={onMainClose}>
                <ModalOverlay backdropFilter='blur(10px)'/>
                <ModalContent m='auto' alignItems='center' bgColor='black' borderWidth='1.5px' borderColor={buttonText3} borderRadius='2xl'>
                    <ModalHeader className={gradientText} textAlign='center' fontSize='20px' fontWeight='bold'>Assign Main Character</ModalHeader>
                    <ModalBody>
                        <Text textAlign='center' textColor={buttonText4} fontSize='12px'>5 $EXP will be clawed back from your account</Text>
                    </ModalBody>
                    <ModalFooter mb={2}>
                        <FullGlowButton text='Confirm!' onClick={() => handleMainSelect('add')} />
                    </ModalFooter>
                </ModalContent>
                </Modal>
            <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, height: '100px', width: '100px' }}
              animate={{ opacity: 1, height: 'auto', width: 'auto' }}
              exit={{ opacity: 0, height: '100px', width: '100px' }}
              transition={{ duration: 0.2 }}
            >
            <Flex mt={6} mx={3} textColor={buttonText3} fontFamily="Orbitron" alignItems='center' justifyContent='center'>
                <VStack mx={2} alignItems='center' spacing='2px'>                    
                    <HStack spacing='0px'>
                        {LVLUp ?
                        <motion.div
                        initial={{ y: 0 }}
                        animate={{ y: -6, opacity: 0 }}
                        transition={{
                            repeat: Infinity,
                            duration: 1,
                            ease: 'easeInOut',
                        }}>
                            <Icon as={MdKeyboardDoubleArrowUp} textColor='white' />
                        </motion.div> : null}
                        <Text className={gradientText} fontSize='12px'>LVL</Text>
                    </HStack>
                <Box textColor={buttonText4} width='100%' mx={2} py={1} px={1.5} borderColor={buttonText3} bgGradient={bgCardOff} borderWidth='1px' borderRadius='xl'>
                    <Center>
                        <Tooltip py={1} px={2} borderWidth='1px' borderRadius='lg' arrowShadowColor={buttonText5} borderColor={buttonText3} bgColor='black' textColor={buttonText4} fontSize='12px' fontFamily='Orbitron' textAlign='center' hasArrow label={'Level | Wisdom'} aria-label='Tooltip'>
                            <Text fontSize='xs'>{level} | {formatAssetBalance(wisdom, 0, true, true, 3)}</Text>
                        </Tooltip>
                    </Center>
                </Box>
                </VStack>
                <VStack mx={2} alignItems='center' spacing='2px'>
                <Text className={gradientText} fontSize='12px'>HP</Text>
                <Box textColor={buttonText4} width='100%' mx={2} py={1} px={1.5} borderColor={buttonText3} bgGradient={bgCardOff} borderWidth='1px' borderRadius='xl'>
                    <Center>
                        <Tooltip py={1} px={2} borderWidth='1px' borderRadius='lg' arrowShadowColor={buttonText5} borderColor={buttonText3} bgColor='black' textColor={buttonText4} fontSize='12px' fontFamily='Orbitron' textAlign='center' hasArrow label={'Health Points'} aria-label='Tooltip'>
                            <Text fontSize='xs'>{metadata.HP}</Text>
                        </Tooltip>
                    </Center>
                </Box>
                </VStack>
                </Flex>
                <Flex mt={2} mx={2} textColor={buttonText3} fontFamily="Orbitron" alignItems='center' justifyContent='center'>
                    <VStack mx={2} alignItems='center' spacing='2px'>
                    <Text className={gradientText} fontSize='12px'>ATK</Text>
                    <Box textColor={buttonText4} width='100%' mx={2} py={1} px={1.5} borderColor={buttonText3} bgGradient={bgCardOff} borderWidth='1px' borderRadius='xl'>
                        <Center>
                            <Tooltip py={1} px={2} borderWidth='1px' borderRadius='lg' arrowShadowColor={buttonText5} borderColor={buttonText3} bgColor='black' textColor={buttonText4} fontSize='12px' fontFamily='Orbitron' textAlign='center' hasArrow label={'Attack'} aria-label='Tooltip'>
                                <Text fontSize='xs'>{metadata.ATK}</Text>
                            </Tooltip>
                        </Center>
                    </Box>
                    </VStack>
                    <VStack mx={2} alignItems='center' spacing='2px'>
                    <Text className={gradientText} fontSize='12px'>DEF</Text>
                    <Box textColor={buttonText4} width='100%' mx={2} py={1} px={1.5} borderColor={buttonText3} bgGradient={bgCardOff} borderWidth='1px' borderRadius='xl'>
                        <Center>
                            <Tooltip py={1} px={2} borderWidth='1px' borderRadius='lg' arrowShadowColor={buttonText5} borderColor={buttonText3} bgColor='black' textColor={buttonText4} fontSize='12px' fontFamily='Orbitron' textAlign='center' hasArrow label={'Defense'} aria-label='Tooltip'>
                                <Text fontSize='xs'>{metadata.DEF}</Text>
                            </Tooltip>
                        </Center>
                    </Box>
                    </VStack>
                    <VStack mx={2} alignItems='center' spacing='2px'>
                    <Text className={gradientText} fontSize='12px'> AP </Text>
                    <Box textColor={buttonText4} width='100%' mx={2} py={1} px={1.5} borderColor={buttonText3} bgGradient={bgCardOff} borderWidth='1px' borderRadius='xl'>
                        <Center>
                            <Tooltip py={1} px={2} borderWidth='1px' borderRadius='lg' arrowShadowColor={buttonText5} borderColor={buttonText3} bgColor='black' textColor={buttonText4} fontSize='12px' fontFamily='Orbitron' textAlign='center' hasArrow label={'Ability Power'} aria-label='Tooltip'>
                                <Text fontSize='xs'>{metadata.AP}</Text>
                            </Tooltip>
                        </Center>
                    </Box>
                    </VStack>
                    <VStack mx={2} alignItems='center' spacing='2px'>
                    <Text className={gradientText} fontSize='12px'>Points</Text>
                    <Box textColor={buttonText4} width='100%' mx={2} py={1} px={1.5} borderColor={buttonText3} bgGradient={bgCardOff} borderWidth='1px' borderRadius='xl'>
                        <Center>
                            <Tooltip py={1} px={2} borderWidth='1px' borderRadius='lg' arrowShadowColor={buttonText5} borderColor={buttonText3} bgColor='black' textColor={buttonText4} fontSize='12px' fontFamily='Orbitron' textAlign='center' hasArrow label={'Battle Points'} aria-label='Tooltip'>
                                <Text fontSize='xs'>{metadata.Points}</Text>
                            </Tooltip>
                        </Center>
                    </Box>
                    </VStack>
                </Flex>
                <Box p={4} alignItems='center' justifyContent='space-between'>
                <HStack alignItems='center' justifyContent='center' spacing='10px'>
                <VStack>
                    <Text fontSize='14px' className={gradientText}>Kinship</Text>
                `   <HStack w='inherit' justifyContent='center'>
                        {!loading ?
                        <Box textColor={buttonText4} p={2} borderColor={buttonText3} bgGradient={bgCardOff} borderWidth='1px' borderRadius='lg'>
                            <Center minW='20px'>
                                <Tooltip py={1} px={2} borderWidth='1px' borderRadius='lg' arrowShadowColor={buttonText5} borderColor={buttonText3} bgColor='black' textColor={buttonText4} fontSize='12px' fontFamily='Orbitron' textAlign='center' hasArrow label={'Kinship'} aria-label='Tooltip'>
                                    <Text fontSize='12px'>{metadata.Kinship}</Text>
                                </Tooltip>
                            </Center>
                        </Box> : null}
                        {kin_sec === 0 ?
                        <motion.div
                            animate={{ scale: [1, 1.07, 1] }}
                            transition={{
                              repeat: Infinity,
                              duration: 0.75,
                              ease: "linear",
                            }}>
                            <FullGlowButton text={loading ? 'Casting' : 'Cast!'} onClick={handleKinship} disabled={loading} />
                        </motion.div>
                        : null}
                    </HStack>
                    <Box pb={1}>
                            {kin_sec !== 0 ?
                            <>
                            <HStack className='whitespace-nowrap'>
                                <Text fontSize='10px' textColor={buttonText5}>Next Ritual:</Text>
                                <Text fontSize='12px' textColor={buttonText4}>{formatDuration(kin_sec)}</Text>
                            </HStack>
                            </>
                            : 
                            <>
                                <Text fontSize='12px' textColor={buttonText5}>Ready!</Text>
                            </>
                            }
                    </Box>
                </VStack>
                <Divider p={1} h='60px' borderColor={buttonText3} orientation='vertical'/>
                <VStack>
                <FullGlowButton text='Edit' onClick={onManageOpen}/>
                <FullGlowButton text='Equip' onClick={onEquipOpen} />

                <Modal scrollBehavior={'outside'} size='md' isCentered isOpen={isEquipOpen} onClose={onEquipClose}>
                <ModalOverlay backdropFilter='blur(10px)'/>
                <ModalContent m='auto' alignItems='center' bgColor='black' borderWidth='1.5px' borderColor={buttonText3} borderRadius='2xl'>
                    <ModalHeader className={gradientText} textAlign='center' fontSize='20px' fontWeight='bold'>Equip/Dequip</ModalHeader>
                    <ModalBody>
                        <EquipCharacter char_name={metadata.Name ? metadata.Name : name} char_id={asset_id} char_image={image} bg_id={metadata.Background ? metadata.Background : 0} bg_image={bg_image} bg_name={bg_name} />
                    </ModalBody>
                    <ModalFooter>
                        <FullGlowButton text='X' onClick={onEquipClose} />
                    </ModalFooter>
                </ModalContent>
                </Modal>

                <Modal scrollBehavior={'outside'} size='md' isCentered isOpen={isManageOpen} onClose={onManageClose}>
                  <ModalOverlay backdropFilter='blur(10px)'/>
                  <ModalContent m='auto' alignItems='center' bgColor='black' borderWidth='1.5px' borderColor={buttonText3} borderRadius='2xl'>
                    <ModalHeader className={gradientText} textAlign='center' fontSize='20px'>Edit Character</ModalHeader>
                    <ModalBody>
                      <Flex pb={4} alignSelf='center' justifyContent="center" flexDirection="row" flexWrap="wrap" gap='12px'>
                        <FullGlowButton text='Rename' onClick={() => setComponentToRender('rename')} disabled={componentToRender === 'rename'}/>
                        <FullGlowButton text='Stats'  onClick={() => setComponentToRender('stats')} disabled={componentToRender === 'stats'}/>
                        <FullGlowButton text='Abilities'  onClick={() => setComponentToRender('abilities')} disabled={componentToRender === 'abilities'}/>
                        <Tooltip py={1} px={2} borderWidth='1px' borderRadius='lg' arrowShadowColor={buttonText5} borderColor={buttonText3} bgColor='black' textColor={buttonText4} fontSize='12px' fontFamily='Orbitron' textAlign='center' hasArrow label={`Available Boosters: ${boostBal}`} aria-label='Tooltip'>                  
                            <div><FullGlowButton text={loading ? 'Boosting...' : 'Boost'} onClick={onBoostConfirmOpen}  disabled={boostBal <= 0 || boostBal === 'Not Opted!'}/></div>
                        </Tooltip>
                        <Tooltip py={1} px={2} borderWidth='1px' borderRadius='lg' arrowShadowColor={buttonText5} borderColor={buttonText3} bgColor='black' textColor={buttonText4} fontSize='12px' fontFamily='Orbitron' textAlign='center' hasArrow label={levelTooltip} aria-label='Tooltip'>                      
                        <motion.div
                            animate={{ scale: LVLUp ? [1, 1.07, 1] : 1 }}
                            transition={{
                              repeat: Infinity,
                              duration: 0.75,
                              ease: "linear",
                            }}>
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
        <SuccessPopup isOpen={isSuccessOpen} onClose={onSuccessClose} message={popMessage} title={popTitle} />
        </Box>
    )

}