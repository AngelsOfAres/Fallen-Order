import * as React from 'react'
import { Modal, ModalBody, ModalHeader, ModalOverlay, ModalContent, Text, HStack, VStack, useDisclosure, useColorModeValue, NumberInput, NumberInputField, Image, Flex, Box, Progress } from '@chakra-ui/react'
import styles from '../../../styles/glow.module.css'
import { FullGlowButton, IconGlowButton, IconGlowButton2 } from 'components/Buttons'
import { useState, useEffect } from 'react'
import useWalletBalance from 'hooks/useWalletBalance'
import { useWallet } from '@txnlab/use-wallet'
import { Rank1, Rank2, Rank3, Rank4, Rank5 } from '../../Whitelists/FOChars'
import { BGRank1, BGRank2, BGRank3 } from '../../Whitelists/FOBGs'
import { hatchets, pickaxes } from '../../Whitelists/FOTools'
import { kinshipPotions, skillPotions } from '../../Whitelists/FOPotions'
import { algodIndexer } from 'lib/algodClient'
import { ListingPopup } from './Popups/ListingPop'
import { TbReportMoney } from 'react-icons/tb'

export function CreateListing() {
    const allFOAssets = [...Rank1, ...Rank2, ...Rank3, ...Rank4, ...Rank5, ...BGRank1, ...BGRank2, ...BGRank3, ...kinshipPotions, ...skillPotions, ...hatchets, ...pickaxes]
    const [ allInfo, setAllInfo ] = useState<any>(null)
    const [ loading, setLoading ] = useState<boolean>(true)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [openPopupIndex, setOpenPopupIndex] = useState(-1)
    const buttonText3 = useColorModeValue('orange.500','cyan.500')
    const buttonText4 = useColorModeValue('orange.200','cyan.100')
    const buttonText5 = useColorModeValue('orange','cyan')
    const xLightColor = useColorModeValue('orange.100','cyan.100')
    const lightColor = useColorModeValue('orange.300','cyan.300')
    const progress = useColorModeValue('linear(to-r, orange, red)', 'linear(to-r, purple.600, cyan)')
    const gradientText = useColorModeValue(styles.textAnimatedGlowL, styles.textAnimatedGlowD)
    const boxGlow = useColorModeValue(styles.boxGlowL, styles.boxGlowD)
    const { assetList } = useWalletBalance()
    const { activeAddress } = useWallet()

    useEffect(() => {
        if (assetList && assetList.length > 0) {
          const FOInfo = assetList
            .filter((item: any) => allFOAssets.includes(item['asset-id']))
            .map((item: any) => item['asset-id'])
            .map(async (id: any) => {
              const assetInfo = await algodIndexer.lookupAssetByID(id).do()
              return assetInfo
            })
    
          Promise.all(FOInfo)
            .then((results) => {
              setAllInfo(results.reverse())
              setLoading(false)
            })
            .catch((error) => {
              console.error('An error occurred:', error)
              setLoading(false)
            })
        }
      }, [assetList, allFOAssets])

      const openListingPopup = (index: any) => {
        setOpenPopupIndex(index)
      }
    
      const closeListingPopup = () => {
        setOpenPopupIndex(-1)
      }

    return (
      <>
        <IconGlowButton2 icon={TbReportMoney} onClick={onOpen} />
        <Modal scrollBehavior={'outside'} size='xl' isCentered isOpen={isOpen} onClose={onClose}>
            <ModalOverlay backdropFilter='blur(10px)'/>
            <ModalContent m='auto' alignItems='center' bgColor='black' borderWidth='1.5px' borderColor={buttonText3} borderRadius='2xl'>
                <ModalHeader className={gradientText} textAlign='center' fontSize='20px' fontWeight='bold'>Create Listing</ModalHeader>
                <ModalBody>
                <VStack m={1} alignItems='center' justifyContent='center' spacing='10px'>
                  {!loading ?                      
                    <>
                      {allInfo && allInfo.length > 0 ?
                        <>
                          <Flex mb={4} w='full' flexDirection="row" flexWrap="wrap" gap='24px' justifyContent='center'>
                            {allInfo.map((asset: any, index: any) => (
                                  <VStack key={index} justifyContent='center'>
                                    <Image _hover={{ boxSize: '24' }} className={boxGlow} boxSize='20' borderRadius='8px' alt={asset.asset.params.name}
                                      src={'https://cloudflare-ipfs.com/ipfs/' + asset.asset.params.url.substring(7)} onClick={() => openListingPopup(index)} />
                                    <Text fontSize='12px' textColor={buttonText4}>
                                    {asset.asset.params['unit-name']}
                                    </Text>
                                    <ListingPopup
                                      wallet={activeAddress}
                                      assetID={asset.asset.index}
                                      assetName={asset.asset.params.name}
                                      assetImage={'https://cloudflare-ipfs.com/ipfs/' + asset.asset.params.url.substring(7)}
                                      isOpen={openPopupIndex === index}
                                      onClose={closeListingPopup}
                                      mainClose={onClose} />
                                  </VStack>
                              ))}
                          </Flex>
                        </>
                        : 
                        <VStack my={4}>
                            <Text textAlign='center' textColor={lightColor}>Seems you do not own any Fallen Order assets!</Text>
                            <a href='https://www.nftexplorer.app/sellers/fallen-order' target='_blank' rel='noreferrer'><FullGlowButton text='Join The Order!' /></a>
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
                    <HStack pb={4}>
                        <FullGlowButton text='X' onClick={onClose} />
                    </HStack>
                </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
      </>
    )

}