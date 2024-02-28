import * as React from 'react'
import { Modal, ModalBody, ModalHeader, ModalFooter, Image as CImage, ModalOverlay, ModalContent, Text, Flex, useDisclosure, useColorModeValue, Center, VStack, Tooltip, HStack, Box, Progress } from '@chakra-ui/react'
import styles from '../../../../styles/glow.module.css'
import { FullGlowButton, IconGlowButton } from 'components/Buttons'
import { useWallet } from '@txnlab/use-wallet'
import useWalletBalance from 'hooks/useWalletBalance'
import { useState, useEffect, useCallback } from 'react'
import { rateLimiter } from 'lib/ratelimiter'
import { algodClient } from 'lib/algodClient'
import { kinshipPotions, skillPotions } from '../../../Whitelists/FOPotions'
import SelectMenu from 'components/SelectMenu'
import { Listbox } from '@headlessui/react'
import { classNames } from 'utils'
import { SuccessPopup } from './Success'
import Link from 'next/link'

export function AbsorbPop(props: any) {
    const { activeAddress } = useWallet()
    const { assetList } = useWalletBalance()
    const bgColor = useColorModeValue("bg-orange-400", "bg-cyan-500")
    const { kinship, asset_id, isOpen, onClose } = props
    const [loading, setLoading] = useState<any>(false)
    const [potionOptions, setPotionOptions] = useState<any>([])
    const [popTitle, setPopTitle] = useState<any>('')
    const [popMessage, setPopMessage] = useState<any>('')
    const { isOpen: isSuccessOpen, onOpen: onSuccessOpen, onClose: onSuccessClose } = useDisclosure()
    const [selectedPotion, setSelectedPotion] = useState({value: asset_id === 0 ? 'Select Potion' : asset_id, label: (
      <>
      </>
    ), asset_id: asset_id})

    
  const processAssets = useCallback(async (assets: any) => {
    const processedAssets = []
  
    for (const singleAsset of assets) {  
      try {
        const assetInfo = await rateLimiter(
          () => algodClient.getAssetByID(singleAsset['asset-id']).do()
        );
        const assetImage = 'https://gateway.ipfs.io/ipfs/' + assetInfo.params.url.substring(7)
        
        processedAssets.push([singleAsset['asset-id'], assetInfo.params['name'], assetInfo.params['unit-name'], assetImage])
      } catch (error) {
        console.error('Error:', error)
      }}

    setLoading(false)

    const potionOptions = processedAssets.map((asset: any) => ({
      value: asset[2],
      label: (
        <>
          <span className={`inline-flex items-center rounded ${bgColor} px-2.5 py-0.5 text-sm font-medium text-black mr-3`}>
            {asset[0]}
          </span>
        </>
      ),
      image: asset[3],
      asset_id: parseInt(asset[0])
    }))
    setPotionOptions(potionOptions)
    setSelectedPotion(potionOptions[0])
    return processedAssets
  }, [bgColor])

  useEffect(() => {
    if (assetList) {
      if (assetList.length > 0 && potionOptions.length < 1) {
        const allPotions = [...kinshipPotions, ...skillPotions]
        setLoading(true)
        const filteredAssetList = assetList.filter((item: any) => allPotions.includes(item['asset-id']))
        if (filteredAssetList.length > 0) {
          processAssets(filteredAssetList)
        }
        else {
          setLoading(false)
        }
      }
      if (assetList === -1) {
        setLoading(false)
      }
    }
    }, [assetList, potionOptions.length, processAssets])

    const { isOpen: isKinOpen, onOpen: onKinOpen, onClose: onKinClose } = useDisclosure()
    const { isOpen: isSkillOpen, onOpen: onSkillOpen, onClose: onSkillClose } = useDisclosure()
    const gradientText = useColorModeValue(styles.textAnimatedGlowL, styles.textAnimatedGlowD)
    const buttonText3 = useColorModeValue('orange.500','cyan.500')
    const buttonText4 = useColorModeValue('orange.200','cyan.100')
    const lightColor = useColorModeValue('orange.300','cyan.300')
  
    const progress = useColorModeValue('linear(to-r, orange, red)', 'linear(to-r, purple.600, cyan)')
    const buttonText5 = useColorModeValue('yellow','cyan')
    const iconColor1 = useColorModeValue('orange', 'cyan')

    async function handleSelectChangePotion(value: any) {
        setSelectedPotion(value)
      }

    return (
        <>
            <Modal scrollBehavior={'outside'} size='md' isCentered isOpen={isOpen} onClose={onClose}>
            <ModalOverlay backdropFilter='blur(10px)'/>
            <ModalContent m='auto' alignItems='center' bgColor='black' borderWidth='1.5px' borderColor={buttonText3} borderRadius='2xl'>
                <ModalHeader className={gradientText} textAlign='center' fontSize='20px' fontWeight='bold'>Character Absorb</ModalHeader>
                <ModalBody>
                    <Flex pt={4} flexDirection="row" flexWrap="wrap" justifyContent='center' gap='12px'>
                        <FullGlowButton text='Kinship' onClick={onKinOpen}/>

                        <Modal scrollBehavior={'outside'} size='md' isCentered isOpen={isKinOpen} onClose={onKinClose}>
                        <ModalOverlay backdropFilter='blur(10px)'/>
                        <ModalContent m='auto' alignItems='center' bgColor='black' borderWidth='1.5px' borderColor={buttonText3} borderRadius='2xl'>
                            <ModalHeader className={gradientText} textAlign='center' fontSize='20px' fontWeight='bold'>Absorb Kinship</ModalHeader>
                            <ModalBody>
                                <Flex pt={4} flexDirection="row" flexWrap="wrap" justifyContent='center' gap='12px'>
                                <Center>
                                <VStack>
                                {!loading ?
                                <>
                                {potionOptions.length > 0 ?
                                <>
                                    <div className="w-full py-2 px-5 lg:flex lg:flex-col lg:flex-1">
                                    <label
                                        htmlFor="amount"
                                        className="block text-sm whitespace-nowrap font-medium"
                                    >
                                        <Text textColor={lightColor}>Background</Text>
                                    </label>
                                    <div className="mt-1 sm:col-span-4">
                                        <SelectMenu
                                            selected={selectedPotion}
                                            setSelected={(selectedPotion) => handleSelectChangePotion(selectedPotion)}
                                        >
                                            {potionOptions
                                            .map((option: any) => (
                                            <Listbox.Option
                                                key={option.value}
                                                className={({ active }) =>
                                                classNames(
                                                    active ? `text-white ${bgColor}` : 'text-black',
                                                    `relative cursor-pointer select-none py-2 pl-3 pr-10`
                                                )
                                                }
                                                value={option}
                                            >
                                                <span className="text-sm">{option.label}</span>
                                                <span className="text-sm pl-2">{option.value}</span>
                                            </Listbox.Option>
                                            ))}
                                        </SelectMenu>
                                        </div>
                                    </div>
                                    <FullGlowButton text={loading ? 'Equipping...' : 'Equip!'} onClick={onSuccessOpen} disabled={loading || selectedPotion.asset_id === 0} />
                                    <Modal scrollBehavior={'outside'} size='xs' isCentered isOpen={isOpen} onClose={onClose}>
                                      <ModalOverlay backdropFilter='blur(10px)'/>
                                      <ModalContent m='auto' alignItems='center' bgColor='black' borderWidth='1.5px' borderColor={buttonText3} borderRadius='2xl'>
                                        <ModalHeader textAlign='center' className={gradientText} fontFamily='Orbitron' fontSize='20px' fontWeight='bold'>Confirm!</ModalHeader>
                                        <ModalBody>
                                        <VStack m={1} alignItems='center' justifyContent='center' fontFamily='Orbitron' spacing='24px'>
                                          <Text textAlign='center' textColor={buttonText4}><strong>{selectedPotion.value}</strong> will be equipped onto <strong>{asset_id}</strong></Text>
                                          <Text textAlign='center' textColor={buttonText4}>Cost: <strong>25 $EXP</strong><br />(Clawback)</Text>
                                          <HStack pb={3}>
                                              <FullGlowButton text='Confirm!' disabled={loading || selectedPotion.asset_id === 0} />
                                              <FullGlowButton text='X' ref={null} isLoading={null} onClick={onClose} />
                                          </HStack>
                                        </VStack>
                                        </ModalBody>
                                      </ModalContent>
                                    </Modal>
                                </>
                                :
                                <VStack my={4}>
                                  <Text textAlign='center' textColor={lightColor}>No Potions Found!</Text>
                                  <Link href='/ge'>
                                    <FullGlowButton text='Buy Potion!' />
                                  </Link>
                                  <Link href='/lab'>
                                    <FullGlowButton text='Craft Potion!' />
                                  </Link>
                                </VStack>
                                }
                                </>
                                :
                                <>
                                    <Text mb={-4} textColor={lightColor} align={'center'} className='pt-4 text-sm'>Loading User Profile...</Text>
                                    <Box w='250px' my='24px'>
                                        <Progress size='xs' bgGradient={progress} colorScheme={buttonText5} isIndeterminate borderRadius='xl'/>
                                    </Box>
                                </>
                                }
                                </VStack>
                            <SuccessPopup isOpen={isSuccessOpen} onClose={onSuccessClose} message={popMessage}  title={popTitle} />
                            </Center>
                                    <FullGlowButton text='Absorb!' onClick={onKinOpen}/>
                                    <FullGlowButton text='X' onClick={onKinClose}/>
                                </Flex>
                            </ModalBody>
                        </ModalContent>
                        </Modal>
                        
                        <FullGlowButton text='Skill' onClick={onSkillOpen}/>
                        <Modal scrollBehavior={'outside'} size='md' isCentered isOpen={isSkillOpen} onClose={onSkillClose}>
                        <ModalOverlay backdropFilter='blur(10px)'/>
                        <ModalContent m='auto' alignItems='center' bgColor='black' borderWidth='1.5px' borderColor={buttonText3} borderRadius='2xl'>
                            <ModalHeader className={gradientText} textAlign='center' fontSize='20px' fontWeight='bold'>Absorb Skill</ModalHeader>
                            <ModalBody>
                                <Flex pt={4} flexDirection="row" flexWrap="wrap" justifyContent='center' gap='12px'>
                                    <FullGlowButton text='Absorb!' />
                                    <FullGlowButton text='X' onClick={onSkillClose}/>
                                </Flex>
                            </ModalBody>
                        </ModalContent>
                        </Modal>
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