import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { FullGlowButton, IconGlowButton } from '../Buttons'
import { Box, Center, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Progress, Text, Tooltip, HStack, useColorMode, useColorModeValue, Table, Thead, Th, Tbody, Td, Tr, Image, VStack, Spacer, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, useDisclosure } from '@chakra-ui/react'
import NfdLookup from '../NfdLookup'
import { algodClient } from 'lib/algodClient'
import styles2 from '../../styles/glow.module.css'
import { formatNumber } from 'utils/formatNumber'
import { rateLimiter } from 'lib/ratelimiter'
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import { MdAdd } from 'react-icons/md'
import { IoIosRemoveCircle } from 'react-icons/io'
import { RxCross2 } from 'react-icons/rx'
import { LuListX } from "react-icons/lu"

const PortfolioViewer: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const { colorMode } = useColorMode()
  const progress = useColorModeValue('linear(to-r, orange, red)', 'linear(to-r, purple.600, cyan)')
  const buttonText5 = useColorModeValue('orange', 'cyan')
  const xLightColor = useColorModeValue('orange.100', 'cyan.100')
  
  const borderColor = colorMode === "light" ? 'border-orange-500' : 'border-cyan-400'
  const bgColor = colorMode === "light" ? 'bg-orange-100' : 'bg-cyan-50'
  const focusBorderColor = colorMode === "light" ? 'focus:border-orange-500' : 'focus:border-cyan-400'
  const lightColor = useColorModeValue('orange.300', 'cyan.400')
  const medColor = useColorModeValue('orange.300', 'cyan.300')
  const baseColor = colorMode === "light" ? "orange" : "cyan"
  const buttonText3 = useColorModeValue('orange.500', 'cyan.500')
  const buttonText4 = useColorModeValue('orange.100', 'cyan.100')
  const iconColor1 = useColorModeValue('orange', 'cyan')
  const gradientText = useColorModeValue(styles2.textAnimatedGlowL, styles2.textAnimatedGlowD)
  const boxGlow = useColorModeValue(styles2.boxGlowL, styles2.boxGlowD)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [vestigeAssets, setVestigeAssets] = useState<any[]>([])
  const [allWallets, setAllWallets] = useState<string[]>([])
  const [allWalletInfo, setAllWalletInfo] = useState<any[]>([])
  const [combinedAssets, setCombinedAssets] = useState<Map<number, number>>(new Map())
  const [assetDecimals, setAssetDecimals] = useState<Map<number, number>>(new Map())
  const [blacklistedAssets, setBlacklistedAssets] = useState<Set<number>>(new Set())
  const [blacklistedAssetsDetails, setBlacklistedAssetsDetails] = useState<Map<number, any>>(new Map())

  const [error, setError] = useState<boolean>(false)
  const [walletInput, setWalletInput] = useState<string>('')
  const [addressExists, setAddressExists] = useState<boolean>(false)
  const [totalAlgo, setTotalAlgo] = useState<number>(0)
  const [totalMinAlgo, setTotalMinAlgo] = useState<number>(0)
  const [totalCreatedAssets, setTotalCreatedAssets] = useState<number>(0)
  const [totalHeldAssets, setTotalHeldAssets] = useState<number>(0)
  const [valueThreshold, setValueThreshold] = useState<number>(0.001)
  const [sortCriteria, setSortCriteria] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')

  useEffect(() => {
    const fetchVestigeAssets = async () => {
      try {
        setLoading(true)
        const response = await fetch('https://free-api.vestige.fi/assets/list')
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const result = await response.json()
        setVestigeAssets(result)
      } catch (error) {
        console.error('Failed to fetch vestige assets:', error)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchVestigeAssets()
  }, [])

  useEffect(() => {
    const fetchCachedWallets = async () => {
      const cachedWallets = localStorage.getItem('wallets')
      if (cachedWallets) {
        const wallets: string[] = JSON.parse(cachedWallets)
        setAllWallets(wallets)
  
        try {
          const walletInfoPromises = wallets.map(async (address) =>
            algodClient.accountInformation(address).do()
          )
          const walletsInfo = await Promise.all(walletInfoPromises)
          setAllWalletInfo(walletsInfo)
  
          const total = walletsInfo.reduce(
            (sum, wallet) => sum + (wallet.amount || 0),
            0
          )
          const totalMin = walletsInfo.reduce(
            (sum, wallet) => sum + (wallet['min-balance'] || 0),
            0
          )
          const totalCreated = walletsInfo.reduce(
            (sum, wallet) => sum + (wallet['total-created-assets'] || 0),
            0
          )
          const totalHeld = walletsInfo.reduce(
            (sum, wallet) => sum + (wallet['total-assets-opted-in'] || 0),
            0
          )
  
          setTotalAlgo(total / 1e6)
          setTotalMinAlgo(totalMin / 1e6)
          setTotalCreatedAssets(totalCreated)
          setTotalHeldAssets(totalHeld)
  
          const assetMap = new Map<number, number>()
          walletsInfo.forEach((wallet) => {
            wallet.assets?.forEach((asset: any) => {
              if (
                vestigeAssets &&
                vestigeAssets.find(
                  (vestige: any) => vestige.id === asset['asset-id']
                )
              ) {
                const currentAmount = assetMap.get(asset['asset-id']) || 0
                assetMap.set(
                  asset['asset-id'],
                  currentAmount + (asset.amount || 0)
                )
              }
            })
          })
          setCombinedAssets(assetMap)
        } catch (error) {
          console.error('Failed to load wallet information:', error)
        } finally {
          setLoading(false)
        }
      }
    }
  
    fetchCachedWallets()
  }, [vestigeAssets])

  useEffect(() => {
    const checkAddressExists = () => {
      const trimmedInput = walletInput.trim()
      setAddressExists(trimmedInput !== '' && allWallets.includes(trimmedInput))
    }
  
    checkAddressExists()
  }, [walletInput, allWallets])

  useEffect(() => {
    const fetchAssetDecimals = async () => {
      const decimalsMap = new Map<number, number>()
      for (const assetId of combinedAssets.keys()) {
        try {
          const assetInfo = await rateLimiter(
            () => algodClient.getAssetByID(assetId).do()
          )
          decimalsMap.set(assetId, assetInfo.params.decimals)
        } catch (error) {
          console.error(`Failed to fetch asset decimals for ID ${assetId}:`, error)
        }
      }
      setAssetDecimals(decimalsMap)
    }

    if (combinedAssets.size > 0) {
      fetchAssetDecimals()
    }
  }, [combinedAssets])

  const addWalletToCache = useCallback(async (walletInput: string) => {
    try {
      const cachedWallets = localStorage.getItem('wallets')
      const wallets: string[] = cachedWallets ? JSON.parse(cachedWallets) : []

      if (!wallets.includes(walletInput)) {
        const walletInfo = await rateLimiter(
          () => algodClient.accountInformation(walletInput).do()
        )

        if (walletInfo) {
          wallets.push(walletInput)
          setAllWallets(wallets)
          setAllWalletInfo((prevInfo: any) => [...prevInfo, walletInfo])
          localStorage.setItem('wallets', JSON.stringify(wallets))

          setTotalAlgo((prevTotal) => prevTotal + (walletInfo.amount || 0) / 1e6)
          setTotalMinAlgo((prevTotalMin) => prevTotalMin + (walletInfo['min-balance'] || 0) / 1e6)
          setTotalHeldAssets((prevTotalHeld) => prevTotalHeld + (walletInfo['total-assets-opted-in'] || 0))
          setTotalCreatedAssets((prevTotalHeld) => prevTotalHeld + (walletInfo['total-created-assets'] || 0))

          setCombinedAssets((prevAssets) => {
            const newAssetMap = new Map(prevAssets)
            walletInfo.assets?.forEach((asset: any) => {
              const currentAmount = newAssetMap.get(asset['asset-id']) || 0
              newAssetMap.set(asset['asset-id'], currentAmount + (asset.amount || 0))
            })
            return newAssetMap
          })
        }
      }
    } catch (error) {
      console.error('Failed to add wallet to cache:', error)
    }
  }, [])

  const removeWalletFromCache = useCallback((walletAddress: string) => {
    const cachedWallets = localStorage.getItem('wallets')
    const wallets: string[] = cachedWallets ? JSON.parse(cachedWallets) : []

    const updatedWallets = wallets.filter((address) => address !== walletAddress)
    localStorage.setItem('wallets', JSON.stringify(updatedWallets))

    const removedWalletInfo = allWalletInfo.find((wallet: any) => wallet.address === walletAddress)
    setAllWallets(updatedWallets)
    setAllWalletInfo((prevInfo: any) => prevInfo.filter((wallet: any) => wallet.address !== walletAddress))

    if (removedWalletInfo) {
      setTotalAlgo((prevTotal) => prevTotal - (removedWalletInfo.amount || 0) / 1e6)
      setTotalMinAlgo((prevTotalMin) => prevTotalMin - (removedWalletInfo['min-balance'] || 0) / 1e6)
      setTotalHeldAssets((prevTotalHeld) => prevTotalHeld - (removedWalletInfo['total-assets-opted-in'] || 0))
      setTotalCreatedAssets((prevTotalHeld) => prevTotalHeld - (removedWalletInfo['total-created-assets'] || 0))

      setCombinedAssets((prevAssets) => {
        const newAssetMap = new Map(prevAssets)
        removedWalletInfo.assets?.forEach((asset: any) => {
          const currentAmount = newAssetMap.get(asset['asset-id']) || 0
          newAssetMap.set(asset['asset-id'], currentAmount - (asset.amount || 0))
        })

        newAssetMap.forEach((amount, assetId) => {
          if (amount <= 0) newAssetMap.delete(assetId)
        })
        return newAssetMap
      })
    }
  }, [allWalletInfo])

  const handleAddOrRemoveWallet = () => {
    if (addressExists) {
      removeWalletFromCache(walletInput.trim())
    } else if (walletInput.trim() !== '') {
      addWalletToCache(walletInput.trim())
    }
    setWalletInput('')
  }

  const filteredAssets = useMemo(() => {
    return Array.from(combinedAssets.entries())
      .filter(([assetId, amount]) => amount >= valueThreshold && !blacklistedAssets.has(assetId))
      .map(([assetId, amount]) => {
        const vestigeAsset = vestigeAssets.find((asset: any) => asset.id === assetId)
        if (vestigeAsset) {
          const { name, ticker, price, change1h, change24h } = vestigeAsset
          const decimals = assetDecimals.get(assetId) || 0
          const balance = (amount / Math.pow(10, decimals))
          const value = balance * price
  
          if (value >= valueThreshold) {
            return {
              key: assetId,
              ticker,
              name,
              balance: balance,
              value: value,
              change1h,
              change24h,
              price
            }
          }
        }
        return null
      })
      .filter((asset: any) => asset !== null)
  }, [combinedAssets, vestigeAssets, assetDecimals, valueThreshold, blacklistedAssets])
  
  const sortedAssets = useMemo(() => {
    return filteredAssets.slice().sort((a: any, b: any) => {
      if (sortCriteria === 'name') {
        return sortDirection === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      } else if (sortCriteria === 'value') {
        return sortDirection === 'asc'
          ? a.value - b.value
          : b.value - a.value
      } else if (sortCriteria === 'balance') {
        return sortDirection === 'asc'
          ? a.balance - b.balance
          : b.balance - a.balance
      } else if (sortCriteria === 'change1h') {
        return sortDirection === 'asc'
          ? a.change1h - b.change1h
          : b.change1h - a.change1h
      } else if (sortCriteria === 'change24h') {
        return sortDirection === 'asc'
          ? a.change24h - b.change24h
          : b.change24h - a.change24h
      }
      return 0
    })
  }, [filteredAssets, sortCriteria, sortDirection])

  const handleSortChange = (criteria: any) => {
    if (sortCriteria === criteria) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortCriteria(criteria)
      setSortDirection('asc')
    }
  }

  const getSortIndicator = (criteria: any) => {
    if (sortCriteria === criteria) {
      return sortDirection === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />
    }
    return null
  }


  useEffect(() => {
    const loadBlacklistDetails = () => {
      const storedBlacklist = localStorage.getItem('blacklistedAssets')
      if (storedBlacklist) {
        setBlacklistedAssets(new Set(JSON.parse(storedBlacklist)))
      }
  
      const storedBlacklistDetails = localStorage.getItem('blacklistedAssetsDetails')
      if (storedBlacklistDetails) {
        const detailsMap = new Map<number, any>(JSON.parse(storedBlacklistDetails))
        setBlacklistedAssetsDetails(detailsMap)
      }
    }
    loadBlacklistDetails()
  }, [])
  

  const addToBlacklist = async (assetId: number) => {
    try {
      const assetDetails = await rateLimiter(
        () => algodClient.getAssetByID(assetId).do()
      )
      setBlacklistedAssetsDetails(prevDetails => {
        const updatedDetails = new Map(prevDetails)
        updatedDetails.set(assetId, assetDetails)
        localStorage.setItem('blacklistedAssetsDetails', JSON.stringify(Array.from(updatedDetails.entries())))
        return updatedDetails
      })
      setBlacklistedAssets(prevBlacklist => {
        const newBlacklist = new Set(prevBlacklist)
        newBlacklist.add(assetId)
        localStorage.setItem('blacklistedAssets', JSON.stringify(Array.from(newBlacklist)))
        return newBlacklist
      })
    } catch (error) {
      console.error(`Failed to fetch asset details for ID ${assetId}:`, error)
    }
  }
  
const removeFromBlacklist = (assetId: number) => {
  setBlacklistedAssets(prevBlacklist => {
    const newBlacklist = new Set(prevBlacklist)
    newBlacklist.delete(assetId)
    localStorage.setItem('blacklistedAssets', JSON.stringify(Array.from(newBlacklist)))
    return newBlacklist
  })

  setBlacklistedAssetsDetails(prevDetails => {
    const updatedDetails = new Map(prevDetails)
    updatedDetails.delete(assetId)
    localStorage.setItem('blacklistedAssetsDetails', JSON.stringify(Array.from(updatedDetails.entries())))
    return updatedDetails
  })
}



  return (
    <div className='mt-6'>
      <Text mt='20px' className={`${gradientText} responsive-font`}>Portfolio Master</Text>
      <Text textColor={xLightColor} align={'center'} className='py-4 text-md'>Wallet aggregator for degens with infinite wallets!</Text>
      <div className="flex flex-col items-center justify-center">
        <NfdLookup
          className={`text-black relative w-80 my-2 cursor-default rounded-md border ${borderColor} ${bgColor} text-center shadow-sm ${focusBorderColor} focus:outline-none focus:ring-1 sm:text-sm`}
          value={walletInput}
          onChange={(value) => setWalletInput(value)}
          placeholder={"Add Address/NFD"}
          ariaDescribedby="lookup-description"
        />
      </div>
      {loading ? (
        <>
          <Text textColor={xLightColor} align={'center'} className='pt-4 text-sm'>
            Please wait while I load your total holdings...
          </Text>
          <Center>
            <Box w='250px' my='24px'>
              <Progress size='xs' bgGradient={progress} colorScheme={buttonText5} isIndeterminate borderRadius='xl' />
            </Box>
          </Center>
        </>
      ) : (
        walletInput.trim().length > 0 && (
          <Center mb={4} mt={1}>
            <FullGlowButton
              fontsize='16px'
              text={addressExists ? 'Remove' : 'Add'}
              onClick={handleAddOrRemoveWallet}
              isLoading={loading}
            />
          </Center>
        )
      )}
      {error && (
        <Text textColor={'red'} align={'center'} className='pt-4 text-sm'>
          Oops! Address invalid or already exists!
        </Text>
      )}
      {!loading && allWalletInfo.length > 0 && (
        <>
          <div>
            <Text textColor={lightColor} align={'center'} className='pt-4 text-sm'>Addresses</Text>
            <ul>
              {allWalletInfo.map((wallet: any) => (
                <li key={wallet.address}>
                  <Center>
                    <Tooltip
                      py={1}
                      px={2}
                      borderWidth='1px'
                      borderRadius='lg'
                      arrowShadowColor={iconColor1}
                      borderColor={buttonText3}
                      bgColor='black'
                      textColor={buttonText4}
                      fontSize='16px'
                      fontFamily='Orbitron'
                      textAlign='center'
                      hasArrow
                      label={'Remove Address!'}
                      aria-label='Tooltip'
                    >
                      <Text
                        textColor={xLightColor}
                        _hover={{ textColor: 'red', cursor: 'pointer' }}
                        align={'center'}
                        className='pt-1 text-md'
                        onClick={() => removeWalletFromCache(wallet.address)}
                      >
                        {wallet.address.substring(0, 6)}...{wallet.address.substring(wallet.address.length - 6)}
                      </Text>
                    </Tooltip>
                  </Center>
                </li>
              ))}
            </ul>
          </div>

          <Center my={6}>
            <Box
              w="min-content"
            >
              <Accordion borderColor={buttonText3} allowToggle>
                <AccordionItem>
                  {({ isExpanded }) => (
                    <>
                      <AccordionButton>
                        <Center w="full">
                          <AccordionIcon color={medColor} />
                          <Text textColor={medColor} fontSize="md" mx={2}>
                            Stats
                          </Text>
                          <AccordionIcon color={medColor} />
                        </Center>
                      </AccordionButton>
                      <AccordionPanel pb={4}>
                        <HStack w="full" justifyContent="center" spacing="20px">
                          <Text textColor={buttonText3} align="center" className="text-xs">
                            Total
                            <HStack spacing='1px' justifyContent='center'>
                              <Text textColor={buttonText4} className="text-sm">{formatNumber(totalAlgo)}</Text>
                              <Image boxSize={{ base: '8px', sm: '8px', md: '9px', lg: '10px', xl: '12px' }} alt={'Algorand'} src={'/algologo.png'} />
                            </HStack>
                          </Text>
                          <Text textColor={buttonText3} align="center" className="text-xs">
                            Minimum
                            <HStack spacing='1px' justifyContent='center'>
                              <Text textColor={buttonText4} className="text-sm">{formatNumber(totalMinAlgo)}</Text>
                              <Image boxSize={{ base: '8px', sm: '8px', md: '9px', lg: '10px', xl: '12px' }} alt={'Algorand'} src={'/algologo.png'} />
                            </HStack>
                          </Text>
                          <Text textColor={buttonText3} align="center" className="text-xs">
                            Available
                            <HStack spacing='1px' justifyContent='center'>
                              <Text textColor={buttonText4} className="text-sm">{formatNumber(totalAlgo - totalMinAlgo)}</Text>
                              <Image boxSize={{ base: '8px', sm: '8px', md: '9px', lg: '10px', xl: '12px' }} alt={'Algorand'} src={'/algologo.png'} />
                            </HStack>
                          </Text>
                        </HStack>
                        <HStack mt={4} w="full" justifyContent="center" spacing="12px">
                          <Text textColor={buttonText3} align="center" className="text-xs">
                            Holding
                            <Text textColor={buttonText4} className="text-sm">{totalHeldAssets}</Text>
                          </Text>
                          <Text textColor={buttonText3} align="center" className="text-xs">
                            Created
                            <Text textColor={buttonText4} className="text-sm">{totalCreatedAssets}</Text>
                          </Text>
                        </HStack>
                      </AccordionPanel>
                    </>
                  )}
                </AccordionItem>
              </Accordion>
            </Box>
          </Center>

        <Text textColor={lightColor} align={'center'} className='py-3 text-sm'>Aggregated Holdings</Text>

        <Box mt={-10} ml='48px' mb={4}><IconGlowButton icon={LuListX} onClick={onOpen} /></Box>
          <Modal isCentered isOpen={isOpen} size={'lg'} onClose={onClose}>
            <ModalOverlay />
            <ModalContent alignItems='center' bgColor='black' borderWidth='1.5px' borderColor={buttonText3} borderRadius='lg'>
                <ModalHeader className={gradientText} fontFamily='Orbitron' fontSize='lg' fontWeight='bold'>Blacklist</ModalHeader>
                <ModalBody mb={4} w='330px'>
                  <VStack spacing={3} align='start'>
                    {blacklistedAssets.size > 0 ? (
                      Array.from(blacklistedAssets).map((assetId) => {
                        const assetDetails = blacklistedAssetsDetails.get(assetId)
                        return assetDetails ? (
                          <Box w='full' textAlign='center' key={assetId} m={3}>
                            <HStack w='full' spacing={4}>
                              <Tooltip
                                py={1}
                                px={2}
                                borderWidth='1px'
                                borderRadius='lg'
                                arrowShadowColor={iconColor1}
                                borderColor={buttonText3}
                                bgColor='black'
                                textColor={buttonText4}
                                fontSize='12px'
                                fontFamily='Orbitron'
                                textAlign='center'
                                hasArrow
                                label={'Remove'}
                                aria-label='Tooltip'
                              >
                                <div>
                                  <IconGlowButton 
                                    onClick={() => {
                                      if (blacklistedAssets.has(assetDetails.index)) {
                                        removeFromBlacklist(assetDetails.index)
                                      } else {
                                        addToBlacklist(assetDetails.index)
                                      }
                                    }} 
                                    icon={RxCross2} 
                                  />
                                </div>
                              </Tooltip>
                              
                              <Spacer />
          
                              
                              <Text textColor={xLightColor} className="text-md">
                                ${assetDetails.params['unit-name']} - {assetDetails.params.name.length > 16 ? assetDetails.params.name.substring(0, 16) + '...' : assetDetails.params.name} 
                              </Text>
                              
                              <Spacer />
                            </HStack>
                          </Box>
                        ) :
                          <IconGlowButton 
                            onClick={() => {
                              if (blacklistedAssets.has(assetDetails.index)) {
                                removeFromBlacklist(assetDetails.index)
                              } else {
                                addToBlacklist(assetDetails.index)
                              }
                            }} 
                            icon={RxCross2}
                          />
                        })
                    ) : (
                      <Text w='full' textAlign='center' textColor={xLightColor} className="text-sm">Token blacklist currently empty!</Text>
                    )}
                  </VStack>
                </ModalBody>
            </ModalContent>
          </Modal>

        <Center mb={6}>
          <Box w='95%' maxH='768px' p={3} borderWidth='1px' borderRadius='xl' borderColor={buttonText3} overflowY='scroll' className={boxGlow}>
            <Table variant='simple'>
              <Thead>
                <Tr>
                  <Th
                    textAlign='center'
                    textColor={sortCriteria === 'name' ? baseColor : lightColor}
                    _hover={{ cursor: 'pointer' }}
                    onClick={() => handleSortChange('name')}
                    fontSize={{ base: '3xs', sm: '2xs', md: 'sm', lg: 'md', xl: 'lg' }}
                    alignItems='center'
                    justifyContent='center'
                    whiteSpace='nowrap'
                    overflow='hidden'
                    textOverflow='ellipsis'
                    px={2}
                  >
                    {getSortIndicator('name')} Token {getSortIndicator('name')}
                  </Th>
                  <Th
                    textAlign='center'
                    textColor={sortCriteria === 'balance' ? baseColor : lightColor}
                    _hover={{ cursor: 'pointer' }}
                    onClick={() => handleSortChange('balance')}
                    fontSize={{ base: '3xs', sm: '2xs', md: 'sm', lg: 'md', xl: 'lg' }}
                    alignItems='center'
                    justifyContent='center'
                    whiteSpace='nowrap'
                    overflow='hidden'
                    textOverflow='ellipsis'
                    px={2}
                  >
                      {getSortIndicator('balance')} Balance {getSortIndicator('balance')}
                  </Th>
                  <Th
                    textAlign='center'
                    textColor={sortCriteria === 'value' ? baseColor : lightColor}
                    _hover={{ cursor: 'pointer' }}
                    onClick={() => handleSortChange('value')}
                    fontSize={{ base: '3xs', sm: '2xs', md: 'sm', lg: 'md', xl: 'lg' }}
                    alignItems='center'
                    justifyContent='center'
                    whiteSpace='nowrap'
                    overflow='hidden'
                    textOverflow='ellipsis'
                    px={2}
                  >
                    {getSortIndicator('value')} Value {getSortIndicator('value')}
                  </Th>
                  <Th
                    textAlign='center'
                    textColor={sortCriteria === 'change1h' ? baseColor : lightColor}
                    _hover={{ cursor: 'pointer' }}
                    onClick={() => handleSortChange('change1h')}
                    fontSize={{ base: '3xs', sm: '2xs', md: 'sm', lg: 'md', xl: 'lg' }}
                    alignItems='center'
                    justifyContent='center'
                    whiteSpace='nowrap'
                    overflow='hidden'
                    textOverflow='ellipsis'
                    px={2}
                  >
                    {getSortIndicator('change1h')} 1H {getSortIndicator('change1h')}
                  </Th>
                  <Th
                    textAlign='center'
                    textColor={sortCriteria === 'change24h' ? baseColor : lightColor}
                    _hover={{ cursor: 'pointer' }}
                    onClick={() => handleSortChange('change24h')}
                    fontSize={{ base: '3xs', sm: '2xs', md: 'sm', lg: 'md', xl: 'lg' }}
                    alignItems='center'
                    justifyContent='center'
                    whiteSpace='nowrap'
                    overflow='hidden'
                    textOverflow='ellipsis'
                    px={2}
                  >
                    {getSortIndicator('change24h')} 24H {getSortIndicator('change24h')}
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {sortedAssets.map((asset: any) => (
                  <Tr key={asset.key}>
                    <Td _hover={{ textColor: baseColor }} textAlign='center' textColor={buttonText4} fontSize={{ base: '2xs', sm: 'sm', md: 'md', lg: 'lg', xl: 'xl' }}>
                    <HStack w='full' spacing={4}>
                      <Tooltip
                        py={1}
                        px={2}
                        borderWidth='1px'
                        borderRadius='lg'
                        arrowShadowColor={iconColor1}
                        borderColor={buttonText3}
                        bgColor='black'
                        textColor={buttonText4}
                        fontSize='16px'
                        fontFamily='Orbitron'
                        textAlign='center'
                        hasArrow
                        label={'Blacklist Token'}
                        aria-label='Tooltip'
                      >
                        <div>
                          <IconGlowButton 
                            onClick={() => {
                              if (blacklistedAssets.has(asset.key)) {
                                removeFromBlacklist(asset.key)
                              } else {
                                addToBlacklist(asset.key)
                              }
                            }} 
                            icon={RxCross2} 
                          />
                        </div>
                      </Tooltip>
                      
                      <Spacer />
  
                      <a href={`https://allo.info/asset/${asset.key}`} target='_blank' rel='noreferrer'>
                        <VStack spacing='1px' align='center'>
                          <Text fontSize={{ base: '2xs', sm: 'sm', md: 'md', lg: 'lg', xl: 'xl' }} textAlign='center'>
                            ${asset.ticker}
                          </Text>
                          <Text fontSize={{ base: '2xs', sm: 'sm', md: 'md', lg: 'lg', xl: 'xl' }} textAlign='center'>
                            {asset.name.length > 16 ? asset.name.substring(0, 16) + '...' : asset.name}
                          </Text>
                        </VStack>
                      </a>
                      
                      <Spacer />
                    </HStack>
                    </Td>
                    <Td textAlign='center' textColor={buttonText4} fontSize={{ base: '2xs', sm: 'sm', md: 'md', lg: 'lg', xl: 'xl' }}>
                      {formatNumber(asset.balance)}
                    </Td>
                    <Td textAlign='center' textColor={buttonText4}>
                      <HStack spacing='1px' justifyContent='center'>
                          <Text fontSize={{ base: '2xs', sm: 'sm', md: 'md', lg: 'lg', xl: 'xl' }}>{formatNumber(asset.value)}</Text>
                          <Image boxSize={{ base: '6px', sm: '8px', md: '10px', lg: '14px', xl: '18px' }} alt={'Algorand'} src={'/algologo.png'} />
                      </HStack>
                    </Td>
                    <Td textAlign='center'>
                      <a href={`https://vestige.fi/asset/${asset.key}`} target='_blank' rel='noreferrer'>
                        {Math.abs(asset.change1h) <= 0.005 ? (
                          <Text _hover={{ textColor: baseColor }} textColor={buttonText4}>-</Text>
                        ) : (
                          <Text _hover={{ textColor: baseColor }} color={asset.change1h > 0 ? '#00FF00' : '#FF0000'} fontSize={{ base: '2xs', sm: 'sm', md: 'md', lg: 'lg', xl: 'xl' }}>
                            {asset.change1h.toFixed(2)}%
                          </Text>
                        )}
                      </a>
                    </Td>
                    <Td textAlign='center'>
                      <a href={`https://vestige.fi/asset/${asset.key}`} target='_blank' rel='noreferrer'>
                        {Math.abs(asset.change24h) <= 0.005 ? (
                          <Text _hover={{ textColor: baseColor }} textColor={buttonText4}>-</Text>
                        ) : (
                          <Text _hover={{ textColor: baseColor }} color={asset.change24h > 0 ? '#00FF00' : '#FF0000'} fontSize={{ base: '2xs', sm: 'sm', md: 'md', lg: 'lg', xl: 'xl' }}>
                            {asset.change24h.toFixed(2)}%
                          </Text>
                        )}
                      </a>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Center>
      </>
      )}
      
    </div>
  )
}

export default PortfolioViewer
