import { Box, VStack, HStack, useColorModeValue, Text, Textarea, Tooltip, useBreakpointValue, Image, Flex, Progress, Center, Container, Divider, } from '@chakra-ui/react'
import * as React from 'react'
import styles from '../../../styles/glow.module.css'
import { useState, useEffect, useCallback } from 'react'
import { FullGlowButton, IconGlowButton } from 'components/Buttons'
import { RiSendPlaneFill } from 'react-icons/ri'
import { useWallet } from '@txnlab/use-wallet'
import toast from 'react-hot-toast'
import { TfiMoreAlt } from 'react-icons/tfi'
import useWalletBalance from 'hooks/useWalletBalance'
import { Rank1, Rank2, Rank3, Rank4, Rank5 } from '../../Whitelists/FOChars'
import { GiFireShrine } from 'react-icons/gi'

export default function FusionModule(props: any) {
    const { assets } = props
    console.log(assets)
    const allFO = [...Rank1, ...Rank2, ...Rank3, ...Rank4, ...Rank5]
    const filteredAssets = assets.filter((asset: any) => allFO.includes(asset[1]))
    const buttonText3 = useColorModeValue('orange.500','cyan.500')
    const buttonText4 = useColorModeValue('orange.200','cyan.100')
    const xLightColor = useColorModeValue('orange.100','cyan.100')
    const lightColor = useColorModeValue('orange.300','cyan.300')
    const mLightColor = useColorModeValue('orange.200','cyan.200')
    const medColor = useColorModeValue('orange.500','cyan.500')
    const buttonText5 = useColorModeValue('orange','cyan')
    const bgCardOn = useColorModeValue('linear(60deg, whiteAlpha.300 3%, black 50%, whiteAlpha.300 97%)','linear(60deg, whiteAlpha.300 3%, black 50%, whiteAlpha.300 97%)')
    const bgCardOff = useColorModeValue('linear(60deg, whiteAlpha.300 10%, black 35%, black 65%, whiteAlpha.300 90%)','linear(60deg, whiteAlpha.300 10%, black 35%, black 65%, whiteAlpha.300 90%)')
    const progress = useColorModeValue('linear(to-r, orange, red)', 'linear(to-r, purple.600, cyan)')
    const fontSize1 = useBreakpointValue({ base: '6px', sm: '8px', md: '9px', lg: '10px', xl: '11px' })
    const fontSize2 = useBreakpointValue({ base: '8px', sm: '9px', md: '10px', lg: '11px', xl: '12px' })
    const [loading, setLoading] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const gradientText = useColorModeValue(styles.textAnimatedGlowL, styles.textAnimatedGlowD)
    const boxGlow = useColorModeValue(styles.boxGlowL, styles.boxGlowD)

    const errorMessages = {
      Rank: 'Woops...You may only fuse 2 characters of the same Rank!'
    }

    const { activeAddress } = useWallet()
    const [selectedChar1, setSelectedChar1] = useState<any>(null)
    const [selectedChar2, setSelectedChar2] = useState<any>(null)

    const selectedWC1 = selectedChar1 && selectedChar1[0]['Woodcutting'] ? parseInt(selectedChar1[0]['Woodcutting'].split('/')[1]) : 0
    const selectedMNG1 = selectedChar1 && selectedChar1[0]['Mining'] ? parseInt(selectedChar1[0]['Mining'].split('/')[1]) : 0
    const selectedWC2 = selectedChar2 && selectedChar2[0]['Woodcutting'] ? parseInt(selectedChar2[0]['Woodcutting'].split('/')[1]) : 0
    const selectedMNG2 = selectedChar2 && selectedChar2[0]['Mining'] ? parseInt(selectedChar2[0]['Mining'].split('/')[1]) : 0

    const skillExpLadder = [
      83, 257, 533, 921, 1433, 2083, 2884, 3853, 5007,
      6365, 7947, 9775, 11872, 14262, 16979, 20047, 23497, 27365, 31695,
      36536, 41945, 47973, 54684, 62150, 70466, 79728, 90090, 101333, 113442,
      126510, 140629, 155896, 172410, 190283, 209640, 230615, 253351, 277998,
      304722, 333706, 365049, 398948, 435613, 475249, 518072, 564302, 614170,
      667914, 725779
    ]

    const fusedWC = (selectedWC1 + selectedWC2)/2
    const fusedMNG = (selectedMNG1 + selectedMNG2)/2
    
    let fusedWCLVL = 0
    let fusedMNGLVL = 0

    for (let i = 0; i < skillExpLadder.length; i++) {
      if (fusedWC >= skillExpLadder[i]) {
        fusedWCLVL = i+1
      } else {
        break
      }
    }

    for (let i = 0; i < skillExpLadder.length; i++) {
      if (fusedMNG >= skillExpLadder[i]) {
        fusedMNGLVL = i+1
      } else {
        break
      }
    }

    const expLadder = [20750, 64250, 133250, 230250, 358250, 520750,
      721000, 963250, 1251750, 1591250, 1986750, 2443750,
      2968000, 3565500, 4244750, 5011750, 5874250, 6841250,
      7923750, 9134000, 10486250, 11993250, 13671000, 15537500,
      17616500, 19918000, 22482000, 25333250, 28592500, 32089250,
      35948250, 40199000, 44864750, 49971750, 55547250, 61619750,
      68218750, 75374500, 83117750, 91480000, 100486500, 110318250,
      120970250, 132474250, 144862750, 158169500, 172429250, 187678500,
      203954500, 221294500]

    const fusedRank = selectedChar1 ? parseInt(selectedChar1[0]['Rank'])+1 : 0
  
    const orderCost = fusedRank == 2 ? 50 : fusedRank == 3 ? 250 : 1000
    const expCost = fusedRank == 2 ? 5000 : fusedRank == 3 ? 25000 : 50000
    const matCost = fusedRank == 2 ? 50 : fusedRank == 3 ? 125 : 300

    const fusedWisdom = selectedChar1 && selectedChar2 ? (parseInt(selectedChar1[0]['Level'].split('/')[1])+parseInt(selectedChar2[0]['Level'].split('/')[1]))/2 : 0
    let fusedLVL = 0

    for (let i = 0; i < expLadder.length; i++) {
      if (fusedWisdom >= expLadder[i]) {
        fusedLVL = i+1
      } else {
        break
        
      }
    }

    const rankTypes: any = {
      1: 'Angel',
      2: 'Celestial',
      3: 'Ethereal',
      4: 'Empyreal',
      5: 'Immortal'
    }

    const handleCharacterSelection = (asset: any) => {

      const isSameRank = (asset1: any, asset2: any) => {
        const sameRank = asset1[0].Rank === asset2[0].Rank
        if (!sameRank) {
          setErrorMessage(errorMessages.Rank)
        } else {
          setErrorMessage('')
        }
        return sameRank
      }

      if (selectedChar1 === asset) {
        setSelectedChar1(null)
        setErrorMessage('')
      } else if (selectedChar2 === asset) {
          setSelectedChar2(null)
          setErrorMessage('')
      } else if (!selectedChar1) {
          setSelectedChar1(asset)
          setErrorMessage('')
      } else if (!selectedChar2 && isSameRank(selectedChar1, asset)) {
          setSelectedChar2(asset)
          setErrorMessage('')
      }
  }

    return (
      <>
      {!loading ?                      
        <>
            {assets.length > 0 ?
            <>
                {selectedChar1 || selectedChar2 ?
                  <Center>
                    <Box m={6} p={4} className={boxGlow} bgGradient={bgCardOff} borderColor={buttonText3} borderWidth='1.5px'
                      borderRadius='13px'>
                      <Text textColor={buttonText4} textAlign='center' fontSize='16px'>Chosen Characters</Text>
                      <HStack mt={4} alignItems='center' justifyContent='center' spacing='24px'>

                        {selectedChar1 ?
                          <VStack>
                            <Container centerContent>
                              <Image className={boxGlow} boxSize='120px' borderRadius='12px' alt={selectedChar1[2]} src={selectedChar1[4]} />
                              <Box mt={-0.3} position="relative" py={0.5} px={2} bgGradient={bgCardOn} borderColor={buttonText3} borderTopWidth='0px' borderBottomWidth='0.5px' borderLeftWidth='0.5px' borderRightWidth='0.5px' borderBottomRadius='xl' borderTopRadius='sm'>
                                <Text className={gradientText} fontSize='12px'>{selectedChar1[3]}</Text>
                              </Box>
                            </Container>
                            <Box m={2} p={2} className={boxGlow} bgGradient={bgCardOff} borderColor={buttonText3} borderWidth='1.5px'
                            borderRadius='13px'>
                              <VStack>
                                <Text textColor={buttonText4} fontSize='10px'>LVL | Wisdom | Kinship</Text>
                                <Text mt={-2} textColor={buttonText5} fontSize='10px'>{selectedChar1[0]['Level'].split('/')[0]} | {selectedChar1[0]['Level'].split('/')[1]} | {selectedChar1[0]['Kinship']}</Text>
                                <Text textColor={buttonText4} fontSize='10px'>ATK | AP | DEF | POINTS</Text>
                                <Text mt={-2} textColor={buttonText5} fontSize='10px'>{selectedChar1[0]['ATK']} | {selectedChar1[0]['DEF']} | {selectedChar1[0]['AP']} | {selectedChar1[0]['Points']}</Text>
                                  <Divider w='75%' mt={0.5} borderColor={buttonText3}/>
                                <Text textColor={buttonText4} fontSize='10px'>Skills</Text>
                                <Text mt={-2} textColor={buttonText5} fontSize='10px'>WC {selectedChar1[0]['Woodcutting'] ? selectedChar1[0]['Woodcutting'] : 0}</Text>
                                <Text mt={-2} textColor={buttonText5} fontSize='10px'>MNG {selectedChar1[0]['Mining'] ? selectedChar1[0]['Mining'] : 0}</Text>
                              </VStack>
                            </Box>
                          </VStack> : null}
                        
                        {selectedChar2 ?
                          <VStack>
                            <Container centerContent>
                              <Image className={boxGlow} boxSize='120px' borderRadius='12px' alt={selectedChar2[2]} src={selectedChar2[4]} />
                              <Box mt={-0.3} position="relative" py={0.5} px={2} bgGradient={bgCardOn} borderColor={buttonText3} borderTopWidth='0px' borderBottomWidth='0.5px' borderLeftWidth='0.5px' borderRightWidth='0.5px' borderBottomRadius='xl' borderTopRadius='sm'>
                                <Text className={gradientText} fontSize='12px'>{selectedChar2[3]}</Text>
                              </Box>
                            </Container>
                            <Box m={2} p={2} className={boxGlow} bgGradient={bgCardOff} borderColor={buttonText3} borderWidth='1.5px'
                              borderRadius='13px'>
                              <VStack>
                                <Text textColor={buttonText4} fontSize='10px'>LVL | Wisdom | Kinship</Text>
                                <Text mt={-2} textColor={buttonText5} fontSize='10px'>{selectedChar2[0]['Level'].split('/')[0]} | {selectedChar2[0]['Level'].split('/')[1]} | {selectedChar2[0]['Kinship']}</Text>
                                <Text textColor={buttonText4} fontSize='10px'>ATK | AP | DEF | POINTS</Text>
                                <Text mt={-2} textColor={buttonText5} fontSize='10px'>{selectedChar2[0]['ATK']} | {selectedChar2[0]['DEF']} | {selectedChar2[0]['AP']} | {selectedChar2[0]['Points']}</Text>
                                  <Divider w='75%' mt={0.5} borderColor={buttonText3}/>
                                <Text textColor={buttonText4} fontSize='10px'>Skills</Text>
                                <Text mt={-2} textColor={buttonText5} fontSize='10px'>WC {selectedChar2[0]['Woodcutting'] ? selectedChar2[0]['Woodcutting'] : 0}</Text>
                                <Text mt={-2} textColor={buttonText5} fontSize='10px'>MNG {selectedChar2[0]['Mining'] ? selectedChar2[0]['Mining'] : 0}</Text>
                              </VStack>
                            </Box>
                          </VStack> : null}

                      </HStack>

                      {selectedChar1 && selectedChar2 ?
                      <>
                        <Text mt={2} textColor={buttonText4} textAlign='center' fontSize='16px'>Fusion Stats</Text>
                        <VStack>
                          <Box m={4} p={2} className={boxGlow} bgGradient={bgCardOff} borderColor={buttonText3} borderWidth='1.5px'
                            borderRadius='13px'>
                            <VStack>

                              <Text textColor={buttonText5} fontSize='10px'>R{fusedRank} - {rankTypes[fusedRank]}</Text>
                              <Text textColor={buttonText4} fontSize='10px'>LVL | Wisdom | Kinship</Text>
                              <Text mt={-2} textColor={buttonText5} fontSize='10px'>{fusedLVL} | {fusedWisdom} | {selectedChar1[0]['Kinship'] + selectedChar2[0]['Kinship']}</Text>
                                <Divider w='75%' borderColor={buttonText3}/>
                              <Text textColor={buttonText4} fontSize='10px'>ATK | AP | DEF | POINTS</Text>
                              <Text mt={-2} textColor={buttonText5} fontSize='10px'>{(selectedChar1[0]['ATK'] + selectedChar2[0]['ATK'])/2} | {(selectedChar1[0]['DEF'] + selectedChar2[0]['DEF'])/2} | {(selectedChar1[0]['AP'] + selectedChar2[0]['AP'])/2} | {(selectedChar1[0]['Points'] + selectedChar2[0]['Points'])/2}</Text>
                                <Divider w='75%' borderColor={buttonText3}/>
                              <Text textColor={buttonText4} fontSize='10px'>Skills</Text>
                              <Text mt={-2} textColor={buttonText5} fontSize='10px'>WC {fusedWCLVL} | {fusedWC}</Text>
                              <Text mt={-2} textColor={buttonText5} fontSize='10px'>MNG {fusedMNGLVL} | {fusedMNG}</Text>
                              
                            </VStack>
                          </Box>

                          <Text p={2} textAlign='center' textColor={buttonText4} fontSize='14px'>This fusion will grant you a randomly chosen Rank {fusedRank} character...</Text>
                          
                          <Text textColor={buttonText4} fontSize='10px'>Total Cost</Text>
                          <HStack mb={4} textAlign='center' fontFamily='Orbitron' fontSize='12px' textColor={buttonText5} spacing='16px'>
                            <Tooltip py={1} px={2} borderWidth='1px' borderRadius='lg' arrowShadowColor={buttonText5} borderColor={buttonText5}
                            bgColor='black' textColor={buttonText4} fontSize='12px' fontFamily='Orbitron' textAlign='center' hasArrow
                            label={'$EXP'} aria-label='Tooltip'>
                                <HStack cursor='pointer'>
                                <Text>{expCost}</Text>
                                <Image boxSize='16px' alt='$EXP Cost' src='exp.png' />
                                </HStack>
                            </Tooltip>

                            <Tooltip py={1} px={2} borderWidth='1px' borderRadius='lg' arrowShadowColor={buttonText5} borderColor={buttonText5}
                            bgColor='black' textColor={buttonText4} fontSize='12px' fontFamily='Orbitron' textAlign='center' hasArrow
                            label={'$ORDER'} aria-label='Tooltip'>
                                <HStack>
                                <Text>{orderCost}</Text>
                                <Image boxSize='16px' alt='$ORDER Cost' src='fallenlogo.png' />
                                </HStack>
                            </Tooltip>

                            <Tooltip py={1} px={2} borderWidth='1px' borderRadius='lg' arrowShadowColor={buttonText5} borderColor={buttonText5}
                            bgColor='black' textColor={buttonText4} fontSize='12px' fontFamily='Orbitron' textAlign='center' hasArrow
                            label={'Oak Logs'} aria-label='Tooltip'>
                                <HStack>
                                <Text>{matCost}</Text>
                                <Image boxSize='16px' alt='Oak Logs Cost' src='oaklogs.png' />
                                </HStack>
                            </Tooltip>

                            <Tooltip py={1} px={2} borderWidth='1px' borderRadius='lg' arrowShadowColor={buttonText5} borderColor={buttonText5}
                            bgColor='black' textColor={buttonText4} fontSize='12px' fontFamily='Orbitron' textAlign='center' hasArrow
                            label={'Clay Ore'} aria-label='Tooltip'>
                                <HStack>
                                <Text>{matCost}</Text>
                                <Image boxSize='16px' alt='Clay Ore Cost' src='clayore.png' />
                                </HStack>
                            </Tooltip>
                            
                        </HStack>
                          <Tooltip py={1} px={2} borderWidth='1px' borderRadius='lg' arrowShadowColor={buttonText5} borderColor={buttonText5}
                            bgColor='black' textColor={buttonText4} fontSize='18px' fontFamily='Orbitron' textAlign='center' hasArrow
                            label={'CAST FUSION!'} aria-label='Tooltip'>
                            <div>
                              <IconGlowButton icon={GiFireShrine} />
                            </div>
                          </Tooltip>
                        </VStack>
                      </>
                      : null}
                    </Box>
                  </Center>
                : null}
                
                {errorMessage !== '' ?
                  <Text mt={4} textColor={'red'} textAlign='center' fontSize='16px'>{errorMessage}</Text>
                  : null}

                <Text mt={8} textColor={buttonText4} textAlign='center' fontSize='16px'>Total Characters: {filteredAssets.length}</Text>

                  <Flex px='48px' py='24px' w='full' flexDirection="row" flexWrap="wrap" gap='24px' justifyContent='center'>
                  {filteredAssets
                  .map((asset: any, index: any) => (
                          <VStack key={index} justifyContent='center' onClick={() => handleCharacterSelection(asset)}>
                            <Image
                              _hover={{ boxSize: '24' }}
                              className={boxGlow}
                              boxSize={selectedChar1 === asset || selectedChar2 === asset ? '28' : '20'}
                              borderRadius='8px'
                              alt={asset[2]}
                              src={asset[4]}
                            />
                            <Text fontSize='12px' textColor={buttonText4}>
                              {asset[3]}
                            </Text>
                          </VStack>
                      ))}
                  </Flex>
            </>
            : 
            <VStack my={4}>
                <Text textAlign='center' textColor={lightColor}>Seems you do not own any Fallen Order assets!</Text>
                <a href='https://www.nftexplorer.app/sellers/fallen-order' target='_blank' rel='noreferrer'>
                    <FullGlowButton text='Join The Order!' />
                </a>
            </VStack>
            }
        </>
        :
        <>
            <Text mb={-4} textColor={xLightColor} align={'center'} className='pt-4 text-sm'>Loading Inventory...</Text>
            <Box w='250px' my='24px'>
                <Progress size='xs' bgGradient={progress} colorScheme={buttonText5} isIndeterminate borderRadius='xl'/>
            </Box>
        </>
        }
    </>
    )
  }

