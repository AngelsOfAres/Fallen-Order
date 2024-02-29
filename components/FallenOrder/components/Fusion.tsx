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
    const gradientText = useColorModeValue(styles.textAnimatedGlowL, styles.textAnimatedGlowD)
    const boxGlow = useColorModeValue(styles.boxGlowL, styles.boxGlowD)

    const { activeAddress } = useWallet()
    const [selectedChar1, setSelectedChar1] = useState<any>(null)
    const [selectedChar2, setSelectedChar2] = useState<any>(null)

    const handleCharacterSelection = (asset: any) => {

      const isSameRank = (asset1: any, asset2: any) => {
        return asset1[0].Rank === asset2[0].Rank
      }

      if (selectedChar1 === asset) {
        setSelectedChar1(null)
      } else if (selectedChar2 === asset) {
          setSelectedChar2(null)
      } else if (!selectedChar1) {
          setSelectedChar1(asset)
      } else if (!selectedChar2 && isSameRank(selectedChar1, asset)) {
          setSelectedChar2(asset)
      }
  }

    console.log(selectedChar1, selectedChar2)

    return (
      <>
      {!loading ?                      
        <>
            {assets.length > 0 ?
            <>
                <Text mt={12} textColor={buttonText4} textAlign='center' fontSize='16px'>Total Characters: {filteredAssets.length}</Text>
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
                                <Text textColor={buttonText4} fontSize='10px'>LVL | Wisdom</Text>
                                <Text mt={-2} textColor={buttonText4} fontSize='10px'>{selectedChar1[0]['Level'].split('/')[0]} | {selectedChar1[0]['Level'].split('/')[1]}</Text>
                                <Text textColor={buttonText4} fontSize='10px'>Kinship: {selectedChar1[0]['Kinship']}</Text>
                                  <Divider w='75%' mt={0.5} borderColor={buttonText3}/>
                                <Text textColor={buttonText4} fontSize='10px'>ATK | AP | DEF | POINTS</Text>
                                <Text mt={-2} textColor={buttonText4} fontSize='10px'>{selectedChar1[0]['ATK']} | {selectedChar1[0]['DEF']} | {selectedChar1[0]['AP']} | {selectedChar1[0]['Points']}</Text>
                                  <Divider w='75%' mt={0.5} borderColor={buttonText3}/>
                                <Text textColor={buttonText4} fontSize='10px'>Skills</Text>
                                <Text mt={-2} textColor={buttonText4} fontSize='10px'>WC {selectedChar1[0]['Woodcutting'] ? selectedChar1[0]['Woodcutting'] : 0}</Text>
                                <Text mt={-2} textColor={buttonText4} fontSize='10px'>MNG {selectedChar1[0]['Mining'] ? selectedChar1[0]['Mining'] : 0}</Text>
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
                                <Text textColor={buttonText4} fontSize='10px'>LVL | Wisdom</Text>
                                <Text mt={-2} textColor={buttonText4} fontSize='10px'>{selectedChar2[0]['Level'].split('/')[0]} | {selectedChar2[0]['Level'].split('/')[1]}</Text>
                                <Text textColor={buttonText4} fontSize='10px'>Kinship: {selectedChar2[0]['Kinship']}</Text>
                                  <Divider w='75%' mt={0.5} borderColor={buttonText3}/>
                                <Text textColor={buttonText4} fontSize='10px'>ATK | AP | DEF | POINTS</Text>
                                <Text mt={-2} textColor={buttonText4} fontSize='10px'>{selectedChar2[0]['ATK']} | {selectedChar2[0]['DEF']} | {selectedChar2[0]['AP']} | {selectedChar2[0]['Points']}</Text>
                                  <Divider w='75%' mt={0.5} borderColor={buttonText3}/>
                                <Text textColor={buttonText4} fontSize='10px'>Skills</Text>
                                <Text mt={-2} textColor={buttonText4} fontSize='10px'>WC {selectedChar2[0]['Woodcutting'] ? selectedChar2[0]['Woodcutting'] : 0}</Text>
                                <Text mt={-2} textColor={buttonText4} fontSize='10px'>MNG {selectedChar2[0]['Mining'] ? selectedChar2[0]['Mining'] : 0}</Text>
                              </VStack>
                            </Box>
                          </VStack> : null}

                      </HStack>

                      {selectedChar1 && selectedChar2 ?
                      <>
                        <Text mt={2} textColor={buttonText4} textAlign='center' fontSize='16px'>Fusion Character</Text>
                        <VStack>
                          <Box m={2} p={2} className={boxGlow} bgGradient={bgCardOff} borderColor={buttonText3} borderWidth='1.5px'
                            borderRadius='13px'>
                            <VStack>
                              <Text textColor={buttonText4} fontSize='10px'>LVL | Wisdom</Text>
                              <Text mt={-2} textColor={buttonText4} fontSize='10px'>{parseInt(selectedChar1[0]['Level'].split('/')[1])+parseInt(selectedChar2[0]['Level'].split('/')[1])}</Text>
                              <Text textColor={buttonText4} fontSize='10px'>Kinship: {selectedChar1[0]['Kinship'] + selectedChar2[0]['Kinship']}</Text>
                                <Divider w='75%' mt={0.5} borderColor={buttonText3}/>
                              <Text textColor={buttonText4} fontSize='10px'>ATK | AP | DEF | POINTS</Text>
                              <Text mt={-2} textColor={buttonText4} fontSize='10px'>{selectedChar1[0]['ATK'] + selectedChar2[0]['ATK']} | {selectedChar1[0]['DEF'] + selectedChar2[0]['DEF']} | {selectedChar1[0]['AP'] + selectedChar2[0]['AP']} | {selectedChar1[0]['Points'] + selectedChar2[0]['Points']}</Text>
                                <Divider w='75%' mt={0.5} borderColor={buttonText3}/>
                              <Text textColor={buttonText4} fontSize='10px'>Skills</Text>
                              <Text mt={-2} textColor={buttonText4} fontSize='10px'>WC {selectedChar2[0]['Woodcutting'] ? selectedChar2[0]['Woodcutting'] : 0}</Text>
                              <Text mt={-2} textColor={buttonText4} fontSize='10px'>MNG {selectedChar2[0]['Mining'] ? selectedChar2[0]['Mining'] : 0}</Text>
                            </VStack>
                          </Box>
                        </VStack>
                      </>
                      : null}
                    </Box>
                  </Center>
                : null}

                  <Flex px='48px' py='24px' w='full' flexDirection="row" flexWrap="wrap" gap='24px' justifyContent='center'>
                  {filteredAssets
                  .map((asset: any, index: any) => (
                          <VStack key={index} justifyContent='center' onClick={() => handleCharacterSelection(asset)}>
                            <Image
                              _hover={{ boxSize: '24' }}
                              className={boxGlow}
                              boxSize={selectedChar1 === asset || selectedChar2 === asset ? '24' : '20'}
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

