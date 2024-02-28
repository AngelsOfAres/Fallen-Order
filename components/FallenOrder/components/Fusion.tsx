import { Box, VStack, HStack, useColorModeValue, Text, Textarea, Tooltip, useBreakpointValue, Image, Flex, Progress, } from '@chakra-ui/react'
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
                <Text mt={12} textColor={buttonText4} textAlign='center' fontSize='16px'>Total Characters: {filteredAssets.length}</Text><Text m={6} textColor={buttonText4} textAlign='center' fontSize='16px'>
                  {selectedChar1 && selectedChar1[2]} {selectedChar2 && selectedChar2[2]}
                </Text>
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

