import Head from 'next/head'
import Navbar from 'components/Navbar'
import { Center, useColorModeValue, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, useDisclosure, HStack, Box, Tooltip, Flex, Icon, Tab, Tabs, TabList, TabPanels, TabPanel, Progress, Input, Button, useColorMode, NumberInput, NumberInputField, VStack, Image, ModalCloseButton, useBreakpointValue, Divider, Td, Tr, Th, Table, Thead, Tbody } from '@chakra-ui/react'
import styles from '../styles/glow.module.css'
import Footer from 'components/Footer'
import { useWallet } from '@txnlab/use-wallet'
import algosdk from 'algosdk'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { algodClient } from 'lib/algodClient'
import { FullGlowButton, IconGlowButton2, IconGlowButtonMedium } from 'components/Buttons'
import { IoIosAdd, IoIosRemove } from 'react-icons/io'
import { convertAlgosToMicroalgos } from 'utils'
import { MdOutlineQuestionMark } from 'react-icons/md'
import { GiBattleGear, GiFallingBomb, GiHealthPotion, GiPointySword } from 'react-icons/gi'
import axios from 'axios'
import { motion } from 'framer-motion'
import { GoPerson } from 'react-icons/go'
import Connect from 'components/MainTools/Connect'
import { GiStarsStack } from "react-icons/gi"
import { BsFillPersonFill } from 'react-icons/bs'
import { finalizeBossAction } from 'api/backend'
import getNFD from 'components/NfdLookup/singleNfdSearch'

export default function Thunderdome() {
  const { activeAddress, signTransactions } = useWallet()
  const [attackAmount, setAttackAmount] = useState<number>(1)
  const [playerData, setPlayerData] = useState<any>([])
  const [mostRecentData, setMostRecentData] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const gradientText = useColorModeValue(styles.textAnimatedGlowL, styles.textAnimatedGlowD)
  const boxGlow = useColorModeValue(styles.boxGlowL, styles.boxGlowD)
  const fullGlow = useColorModeValue(styles.fullglowL, styles.fullglowD)
  const baseTextColor = useColorModeValue('orange','cyan')
  const xLightTextColor = useColorModeValue('orange.200','cyan.100')
  const lightTextColor = useColorModeValue('orange.300', 'cyan.300')
  const medTextColor = useColorModeValue('orange.500','cyan.500')
  const { isOpen: isOpenPrizelist, onOpen: onOpenPrizelist, onClose: onClosePrizelist } = useDisclosure()
  const { isOpen: isOpenHowitworks, onOpen: onOpenHowitworks, onClose: onCloseHowitworks } = useDisclosure()
  const imageAlignment = useBreakpointValue<'center' | 'flex-start'>({ base: 'center', lg: 'flex-start' })
  const flexDirection = useBreakpointValue<'column' | 'row'>({ base: 'column', lg: 'row' })
  const imageSize = useBreakpointValue<'240px' | '280px'>({ base: '240px', lg: '280px' })
  const algoSize = useBreakpointValue({ base: '10px', sm: '10px', md: '12px', lg: '16px', xl: '18px' })

  
  const bossMain = "BOSSFBCUG777TNSORWK3ZSKVXGDMRU7JKKKXOB3JZ5P3W4GEAWOAZHRPWM"
  const bossHeal = "HEALLKLVWZ6SLBHPLKWMVJSY4SRPNF2YCLHAEDRBG4BL26LV6FTRDIAVQI"
  const bossTokenId = 2521620385
  const bossBaseHP = 25000
  const bossName = "Ares"
  const bossTotalBalance = 100000000
  const [bossCurrentHP, setBossCurrentHP] = useState<number>(bossBaseHP)
  const [currentPool, setCurrentPool] = useState<any>(0)
  const [optIn, setOptIn] = useState<boolean>(false)
  const sleep = (ms: any) => new Promise(resolve => setTimeout(resolve, ms))

  const hpPercentage = (bossCurrentHP/bossBaseHP) * 100

  let colorScheme = 'green'

  if (hpPercentage < 75) colorScheme = 'yellow'
  if (hpPercentage < 50) colorScheme = 'orange'
  if (hpPercentage < 25) colorScheme = 'red'


  let colorScheme2 = 'green.200'

  if (hpPercentage < 75) colorScheme2 = 'yellow.300'
  if (hpPercentage < 50) colorScheme2 = 'orange.300'
  if (hpPercentage < 25) colorScheme2 = 'red.400'

  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    checkOptIn()
    getBattleData()
    getMostRecentAttack()
  }, [activeAddress])

  useEffect(() => {
    const intervalId = setInterval(() => {
      getBattleData()
      getMostRecentAttack()
    }, 5000)
  
    return () => clearInterval(intervalId)
  }, [])

  const startUpdating = (increase: boolean) => {
    if (intervalRef.current) return

    intervalRef.current = setInterval(() => {
      setAttackAmount((prev) => {
        if (increase) {
          return prev < 95 ? prev + 5 : 100;
        } else {
          return prev > 5 ? prev - 5 : 1;
        }
      })
    }, 100)
  }

  const stopUpdating = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const handleMouseDown = (increase: boolean) => {
    startUpdating(increase)
  }

  const handleMouseUp = () => {
    stopUpdating()
  }

  const handleTouchStart = (increase: boolean) => {
    startUpdating(increase)
  }

  const handleTouchEnd = () => {
    stopUpdating()
  }

async function getMostRecentAttack() {
    const apiEndpoint = `https://mainnet-idx.algonode.cloud/v2/assets/${bossTokenId}/transactions?tx-type=axfer&currency-greater-than=0&address=${bossMain}`
  
    try {
      const response = await axios.get(apiEndpoint)
      
      if (response.data && response.data.transactions && response.data.transactions.length > 0) {
        const transactions = response.data.transactions
  
        const sortedTransactions = transactions.sort((a: any, b: any) => b.timestamp - a.timestamp)
  
        const mostRecentTransaction = sortedTransactions[0]
        const mostRecentAddress = mostRecentTransaction["asset-transfer-transaction"].receiver
        const nfd = await getNFD(mostRecentAddress)
        const mostRecentAmount = mostRecentTransaction["asset-transfer-transaction"].amount
        let mostRecentAction = "SLASH"

        if (mostRecentTransaction.note) {
            const note_decoded = atob(mostRecentTransaction.note).toLowerCase()

            if (note_decoded.includes("heal")) {
                mostRecentAction = "HEAL"
            } else if (note_decoded.includes("nuke")) {
                mostRecentAction = 'NUKE'
            }
        }
        
        setMostRecentData({
            address: mostRecentAddress,
            action: mostRecentAction,
            amount: mostRecentAmount,
            nfd: nfd
        })
  
      } else {
        return null
      }
    } catch (error) {
      console.error("Error fetching transaction data:", error)
      return null
    }
  }

async function checkOptIn() {
    try {
        if (!activeAddress) {
          throw new Error('Wallet Not Connected!')
        }
        await algodClient.accountAssetInformation(activeAddress, bossTokenId).do()
        setOptIn(true)
        console.log("User opted in!")
    } catch {
        setOptIn(false)
        console.log("User not opted in!")
    }
}

async function getDomainsForAddresses(filteredData: any[]) {
    const addressToNFDMap: { [key: string]: string } = {}

    const promises = filteredData.map(async (item) => {
        try {
            const nfd = await getNFD(item.address)
            addressToNFDMap[item.address] = nfd
        } catch (error: any) {
            console.error(`Error fetching NFD for address ${item.address}: ${error.message}`)
            addressToNFDMap[item.address] = 'Unknown'
        }
    })

    await Promise.all(promises)
    return addressToNFDMap
}

async function getBattleData() {
    try {
      const apiEndpoint = `https://mainnet-idx.algonode.cloud/v2/assets/${bossTokenId}/balances?currency-greater-than=0`
      const response = await axios.get(apiEndpoint)
  
      if (response.status === 200 && response.data['balances']) {
        const data = response.data['balances']
        const bossMainBalance = data.find((item: any) => item.address === bossMain)?.amount || 0
        const bossHealBalance = data.find((item: any) => item.address === bossHeal)?.amount || 0
        const filteredData = data
            .filter((item: any) => item.address !== bossMain && item.address !== bossHeal)
            .sort((a: any, b: any) => b.amount - a.amount)

        const addressToNFDMap = await getDomainsForAddresses(filteredData)

        const enrichedData = filteredData.map((item: any) => ({
            ...item,
            nfd: addressToNFDMap[item.address] || null
        }))

        setPlayerData(enrichedData)
        const totalDamage = bossTotalBalance - bossMainBalance - bossHealBalance*2
        setBossCurrentHP(bossBaseHP - totalDamage + bossHealBalance)
      }

      const accountInfo = await algodClient.accountInformation(bossMain).do()
      setCurrentPool((accountInfo.amount-accountInfo["min-balance"]-1000000) / 1e6)

    } catch (error: any) {
      console.error(`Error fetching asset holders for asset ID ${bossTokenId}: ${error.message}`)
      return []
    }
}

const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
}

const sendOptIn = async () => {
    try {
        if (!activeAddress) {
          throw new Error('Wallet Not Connected!')
        }
        const suggestedParams = await algodClient.getTransactionParams().do()
        suggestedParams.fee = 1000
        suggestedParams.flatFee = true
        const note = Uint8Array.from('Thunderdome - Boss Battle Lottery\n\nSuccessfully Opted In!'.split("").map(x => x.charCodeAt(0)))
    
        const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                    from: activeAddress,
                    to: activeAddress,
                    amount: 0,
                    assetIndex: bossTokenId,
                    suggestedParams,
                    note
                    })
    
        const encodedTransaction = algosdk.encodeUnsignedTransaction(txn)

        toast.loading('Awaiting Signature...', { id: 'txn', duration: Infinity })
    
        const signedTransaction = await signTransactions([encodedTransaction])
        
        toast.loading(`Preparing for battle...`, { id: 'txn', duration: Infinity })
    
        await algodClient.sendRawTransaction(signedTransaction).do()

        setTimeout(() => {
            checkOptIn()
            toast.success(`You are ready for battle!`, {
                id: 'txn',
                duration: 5000
                }) 
        }, 8000)

    } catch (error) {
      console.error(error)
      return null
    }
  }

async function handleAction(type: string) {
    setLoading(true)
    try {
        if (!activeAddress) {
            throw new Error('Wallet Not Connected!')
        }

        const from = activeAddress
        const to = bossMain
        let rawAmount
        
        if (type === "SLASH") {
            rawAmount = attackAmount * 0.01
        } else if (type === "HEAL") {
            rawAmount = 0.8
        } else {
            rawAmount = 1.33
        }

        const amount = convertAlgosToMicroalgos(rawAmount)

        const note = Uint8Array.from(`Boss Battle Action: ${type}\n\nThunderdome - Angels Of Ares`.split("").map(x => x.charCodeAt(0)))
        const suggestedParams = await algodClient.getTransactionParams().do()
        suggestedParams.fee = 1000
        suggestedParams.flatFee = true
        const transaction = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            from,
            to,
            amount,
            suggestedParams,
            note
        })

        const encodedTransaction = algosdk.encodeUnsignedTransaction(transaction)

        toast.loading('Awaiting Signature...', { id: 'txn', duration: Infinity })

        const signedTransaction = await signTransactions([encodedTransaction])
        const decodedTxn = JSON.stringify(signedTransaction[0])
        
        toast.loading(`Using ${type} on ${bossName}...`, { id: 'txn', duration: 8000 })

        try{
            const data = await finalizeBossAction(activeAddress, decodedTxn)
            if (data && data.message) {
                if (data.message === "reset") {
                    toast.error("This battle has ended and is currently being reset. Please refresh the page!")
                } else if (data.message === "action_successful") {
                    const chosenAmount = data.amount
                    if (type == "HEAL") {
                        toast.success(`GG! You healed ${bossName} for ${chosenAmount} HP!`, {
                            id: 'txn',
                            duration: 8000
                            })
                    } else if (type == "SLASH") {
                        toast.success(`GG! You dealt ${chosenAmount} DMG to ${bossName}!`, {
                            id: 'txn',
                            duration: 8000
                            })
                    } else {
                        toast.success(`GG! You NUKED ${bossName} for ${chosenAmount} DMG!`, {
                            id: 'txn',
                            duration: 8000
                            })
                    }
                }
            } else if (data && data.error) {
                if (data.type === "wallet" || data.type === "amount") {
                    toast.error("Something went wrong! Please contact admin if issue persists...")
                } else if (data.type === "knockout") {
                    toast.success(`${bossName.toUpperCase()} HAS FALLEN! YOU DEALT THE KNOCKOUT BLOW!`, {
                        id: 'txn',
                        duration: 10000
                        })
                    await sleep(3000)
                    toast.success(`Battlefield is currently being cleaned up for the next round...`, {
                        id: 'txn',
                        duration: 10000
                        })
                    
                } else if (data.type === "wallet" || data.type === "maxheal") {
                    toast.error("You can not heal boss at near max HP!")
                } else {
                    toast.error("Something went wrong! Please contact admin if issue persists..")
                }
            } else {
                toast.error("Something went wrong! Please contact admin if issue persists...")
            }
            setLoading(false)
        } catch (error) {
            toast.error(`Oops! Action failed. Please contact an admin if issue persists...`, { id: 'txn' })
            setLoading(false)
            return
        }
    } catch (error: any){
        toast.error(`Oops! Action failed. Please contact an admin if issue persists...`, { id: 'txn' })
        setLoading(false)
    }
}

  return (
    <>
        <Head>
            <title>Thunderdome - Boss Battle Lottery</title>
            <meta name="description" content="Boss Battle Gamified Lottery. Developed by Angels Of Ares" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Navbar />
        <Box p={4} w="full" position="absolute">
          <HStack spacing={2} justify="flex-end">
            <IconGlowButtonMedium icon={GiStarsStack} onClick={onOpenPrizelist} />
            <IconGlowButtonMedium icon={MdOutlineQuestionMark} onClick={onOpenHowitworks} />
          </HStack>
        </Box>
        
            <Modal scrollBehavior={'inside'} size='sm' isCentered isOpen={isOpenPrizelist} onClose={onClosePrizelist}>
                <ModalOverlay backdropFilter='blur(10px)'/>
                <ModalContent m='auto' alignItems='center' bgColor='black' borderWidth='1.5px' borderColor={medTextColor} borderRadius='2xl'>
                    <ModalHeader className={gradientText} textAlign='center' fontSize='20px' fontWeight='bold'>Pool Distribution</ModalHeader>
                    <ModalBody w='100%'>
                    <VStack w='full' spacing='6px'>
                        <Text fontSize="sm" textColor={xLightTextColor}>
                            1st - 15%
                        </Text>
                        <Text fontSize="sm" textColor={xLightTextColor}>
                            2nd - 12.5%
                        </Text>
                        <Text fontSize="sm" textColor={xLightTextColor}>
                            3rd - 7.5%
                        </Text>
                        <Text fontSize="sm" textColor={xLightTextColor}>
                            5 Random Winners - 10%/each
                        </Text>
                        <Text fontSize="sm" textColor={xLightTextColor}>
                            Rollover to Next Pool - 10%
                        </Text>
                        <Text fontSize="sm" textColor={xLightTextColor}>
                            Service Fee - 5%
                        </Text>
                    </VStack>
                    </ModalBody>
                    <HStack p={4}>
                        <FullGlowButton text='X' onClick={onClosePrizelist} />
                    </HStack>
                </ModalContent>
            </Modal>

            <Modal scrollBehavior={'inside'} size='lg' isCentered isOpen={isOpenHowitworks} onClose={onCloseHowitworks}>
                <ModalOverlay backdropFilter='blur(10px)'/>
                <ModalContent m='auto' alignItems='center' bgColor='black' borderWidth='1.5px' borderColor={medTextColor} borderRadius='2xl'>
                    <ModalHeader className={gradientText} textAlign='center' fontSize='20px' fontWeight='bold'>How It Works</ModalHeader>
                    <ModalBody w='100%'>
                    <VStack w='full' spacing='6px'>
                        <Text textAlign='center' fontSize="sm" textColor={xLightTextColor}>
                            This platform represents a gamified lottery in the form of a boss battle with inner mechanics
                            <br />
                            <br />
                            The boss is available publically for anyone to battle
                            <br />
                            <br />
                            Choose an action, and you will get tokens in your wallet representing your total points against the current boss
                            <br />
                            <br />
                            Players may choose to HEAL the boss to extend the length of the battle by replenishing the boss&apos;s HP
                            <br />
                            <br />
                            All battle stats and rankings are held on-chain and battle updates every 5sec globally for all players, creating a seamless client-side experience
                            <br />
                            <br />
                            At the end of each battle, the boss will automatically reset and handle reward distribution on the spot
                            <br />
                            <br />
                            Best of luck, let&apos;s kick some boss ass!
                        </Text>
                    </VStack>
                    </ModalBody>
                    <HStack p={4}>
                        <FullGlowButton text='X' onClick={onCloseHowitworks} />
                    </HStack>
                </ModalContent>
            </Modal>

        <Text mt='44px' className={`${gradientText} responsive-font`}>THUNDERDOME</Text>
        
            <HStack my={2} textAlign='center' fontFamily='Orbitron' textColor={xLightTextColor} spacing='3px' justifyContent='center'>
                <Text mr={1} fontSize="sm" textAlign="center" textColor={baseTextColor}>Prize Pool:</Text>
                <Text fontSize="lg" textColor={xLightTextColor}>{currentPool.toFixed(3)}</Text>
                <Image boxSize={algoSize} alt={'Algorand'} src={'/algologo.png'} />
            </HStack>

            {mostRecentData && bossCurrentHP !== bossBaseHP ?
                <Center my={2}> 
                    <Box cursor="default" px={2.5} py={1} textAlign='center' className={boxGlow} borderRadius='20px' background='black' borderColor={medTextColor}>
                        <Text mb={1} fontSize="2xs" textColor={baseTextColor}>
                            Most Recent Action
                        </Text>
                        <Text fontSize="lg" textColor={mostRecentData.action === "SLASH" ? 'red' : mostRecentData.action === "HEAL" ? 'lime' : 'yellow'}>
                            {mostRecentData.action === "SLASH" ? "⚔️ SLASH 🗡️" : mostRecentData.action === "HEAL" ? '💖 HEAL 🧪' : '💣 !NUKE! ☠️'}
                        </Text>
                        <HStack w='full' justifyContent='center' spacing='2px'>
                            <Icon boxSize={4} color={medTextColor} as={BsFillPersonFill}/>
                            <Text textAlign='center' fontSize="sm" textColor={xLightTextColor}>
                                {mostRecentData.nfd ? mostRecentData.nfd : mostRecentData.address?.substring(0, 5) + "..." + mostRecentData.address?.substring(mostRecentData.address?.length - 5)}
                            </Text>
                        </HStack>
                        <Text fontSize="sm" textColor={mostRecentData.action === "SLASH" ? 'red' : mostRecentData.action === "HEAL" ? 'lime' : 'yellow'}>
                            {mostRecentData.amount} {mostRecentData.action === "SLASH" ? "DMG" : mostRecentData.action === "HEAL" ? 'HP' : 'DMG'}
                        </Text>
                    </Box>
                </Center>
            : null}
            <Center>
                <Box p={4} w='fit-content'>
                    <Flex
                    direction={flexDirection}
                    align="center"
                    justify="center"
                    w="full"
                    >
                        <VStack mx={4}>
                            <Text mb={-4} textAlign='center' fontSize="sm" textColor={xLightTextColor}>
                                Ares, God of War
                            </Text>
                            <Box
                                flex="1"
                                display="flex"
                                justifyContent={imageAlignment}
                                px={6}
                                mb={-4}
                            >
                                <Image
                                src="/ares.png"
                                alt="Boss Battle"
                                boxSize={imageSize}
                                objectFit="cover"
                                />
                            </Box>
                            
                            <Box w="90%" px={4}>
                                <motion.div
                                    animate={{ scale: bossCurrentHP <= 0 ? 1 :  [1, 1.04, 1] }}
                                    transition={{
                                    repeat: Infinity,
                                    duration: 1.5,
                                    ease: "linear",
                                        }}>
                                        <Progress
                                        value={hpPercentage}
                                        colorScheme={colorScheme}
                                        size="sm"
                                        borderRadius="lg"
                                        isIndeterminate={false}
                                    />
                                    <Text fontSize="md" textAlign="center" textColor={colorScheme2}>
                                        {bossCurrentHP <= 0 ? "☠️" : null} {Math.max(bossCurrentHP, 0)} / {bossBaseHP} {bossCurrentHP <= 0 ? "☠️" : null}
                                    </Text>
                                </motion.div>
                            </Box>
                        </VStack>

                        {activeAddress ?
                        <>
                            {optIn ?
                            <>
                                <Box
                                    flex="2"
                                    display="flex"
                                    flexDirection="column"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <Divider mt={4} mb={1} w='200px' borderColor={medTextColor} />
                                    <Text fontSize="lg" textColor={baseTextColor}>Choose Ability</Text>

                                    <Divider mt={1} mb={4} w='200px' borderColor={medTextColor} />

                                    <HStack justifyContent="center" spacing='20px' alignItems="flex-start">
                                        
                                        <VStack justifyContent='flex-start' alignItems="center" spacing={2}>
                                            <Text mb={-3} fontSize="lg" textColor={'red'}>SLASH</Text>
                                            <Text fontSize="xs" textColor={'red'}>1-1.2x DMG</Text>
                                            <motion.div
                                                animate={{ scale: [1, 1.04, 1] }}
                                                transition={{
                                                repeat: Infinity,
                                                duration: 1.5,
                                                ease: "linear",
                                                    }}>
                                                <IconGlowButton2 icon={GiPointySword} onClick={() => handleAction("SLASH")} disabled={bossCurrentHP <= 0 || loading}/>
                                            </motion.div>
                                            <HStack w='95px' justifyContent="space-between">
                                                <Button 
                                                    p='1.5px' 
                                                    className={fullGlow} 
                                                    _hover={{ textColor: 'white' }} 
                                                    textColor='black' 
                                                    fontSize='11px' 
                                                    size='2xs' 
                                                    onClick={() => setAttackAmount(attackAmount - 1)}
                                                    isDisabled={attackAmount <= 1}
                                                    onMouseDown={() => handleMouseDown(false)}
                                                    onMouseUp={handleMouseUp}
                                                    onTouchStart={() => handleTouchStart(false)}
                                                    onTouchEnd={handleTouchEnd}
                                                >
                                                    <Icon boxSize={4} as={IoIosRemove} zIndex={1} />
                                                </Button>
                                                    <Text fontSize={'sm'} textColor={xLightTextColor}>{attackAmount}</Text>
                                                <Button 
                                                    p='1.5px' 
                                                    className={fullGlow}
                                                    _hover={{ textColor: 'white' }} 
                                                    textColor='black' 
                                                    fontSize='11px' 
                                                    size='2xs' 
                                                    onClick={() => setAttackAmount(attackAmount + 1)} 
                                                    isDisabled={attackAmount >= 100}
                                                    onMouseDown={() => handleMouseDown(true)}
                                                    onMouseUp={handleMouseUp}
                                                    onTouchStart={() => handleTouchStart(true)}
                                                    onTouchEnd={handleTouchEnd}
                                                >
                                                    <Icon boxSize={4} as={IoIosAdd} zIndex={1} />
                                                </Button>
                                            </HStack>
                                            
                                            <HStack mb={1} textAlign='center' fontFamily='Orbitron' textColor={xLightTextColor} spacing='3px' justifyContent='center'>
                                                <Text fontSize="md" textColor={xLightTextColor}>{(attackAmount*0.01).toFixed(2)}</Text>
                                                <Image boxSize={algoSize} alt={'Algorand'} src={'/algologo.png'} />
                                            </HStack>
                                            
                                        </VStack>

                                        <Divider p={1} h='100px' borderColor={medTextColor} orientation='vertical'/>

                                        <VStack justifyContent='flex-start' alignItems="center" spacing={2}>
                                            <Text fontSize="lg" textColor={'lime'}>HEAL</Text>
                                            <Text mt={-3} fontSize="xs" textColor={'lime'}>50-150 HP</Text>
                                            <motion.div
                                                animate={{ scale: [1, 1.04, 1] }}
                                                transition={{
                                                repeat: Infinity,
                                                duration: 1.5,
                                                ease: "linear",
                                                    }}>
                                                <IconGlowButton2 icon={GiHealthPotion}  onClick={() => handleAction("HEAL")} disabled={bossCurrentHP <= 0 || loading}/>
                                            </motion.div>
                                            <HStack my={1} textAlign='center' fontFamily='Orbitron' textColor={xLightTextColor} spacing='3px' justifyContent='center'>
                                                <Text fontSize="md" textColor={xLightTextColor}>0.8</Text>
                                                <Image boxSize={algoSize} alt={'Algorand'} src={'/algologo.png'} />
                                            </HStack>
                                        </VStack>

                                        <Divider p={1} h='100px' borderColor={medTextColor} orientation='vertical'/>

                                        <VStack justifyContent='flex-start' alignItems="center" spacing={2}>
                                            <Text fontSize="lg" textColor={'yellow'}>NUKE!</Text>
                                            <Text mt={-3} fontSize="xs" textColor={'yellow'}>100-200 DMG</Text>
                                            <motion.div
                                                animate={{ scale: [1, 1.04, 1] }}
                                                transition={{
                                                repeat: Infinity,
                                                duration: 1.5,
                                                ease: "linear",
                                                    }}>
                                                <IconGlowButton2 icon={GiFallingBomb}  onClick={() => handleAction("NUKE")} disabled={bossCurrentHP <= 0 || loading}/>
                                            </motion.div>
                                            <HStack my={1} textAlign='center' fontFamily='Orbitron' textColor={xLightTextColor} spacing='3px' justifyContent='center'>
                                                <Text fontSize="md" textColor={xLightTextColor}>1.33</Text>
                                                <Image boxSize={algoSize} alt={'Algorand'} src={'/algologo.png'} />
                                            </HStack>
                                        </VStack>
                                    </HStack>     
                                    
                                </Box>
                            </>
                            :
                            <>
                                <Center mt={8}><FullGlowButton fontsize='16px' text={'Join Battle!'} onClick={sendOptIn} /></Center>
                            </>
                            }
                            </>
                        :
                            <>
                                <VStack mt={8}>
                                    <Center><FullGlowButton fontsize='16px' text={'Connect To Play!'} onClick={handleToggleMenu} /></Center>
                                    {isMenuOpen && (
                                        <Center my='24px'>
                                            <Connect />
                                        </Center>
                                    )}
                                </VStack>
                            </>
                        }
                    </Flex>
                </Box>
            </Center>
            
            <Center><Divider mt={1} mb={4} w='80%' borderColor={medTextColor} /></Center>

            <Text className={`${gradientText} responsive-font`}>Leaderboard</Text>
            <Text textAlign='center' textColor={xLightTextColor} fontSize='lg'>Players: {playerData.length}</Text>

            <Center m={6}>
            <Box cursor="default" w='95%' maxH='600px' p={3} borderWidth='1px' borderRadius='xl' borderColor={medTextColor} overflowY='auto' className={boxGlow}>
                {playerData.length > 0 ? (
                    <Table variant='simple'>
                        <Thead>
                            <Tr>
                            <Th
                                textAlign='center'
                                textColor={lightTextColor}
                                fontSize={{ base: '3xs', sm: '2xs', md: 'sm', lg: 'md', xl: 'lg' }}
                                alignItems='center'
                                justifyContent='center'
                                whiteSpace='nowrap'
                                overflow='hidden'
                                textOverflow='ellipsis'
                                px={2}
                            >
                                <Icon boxSize={8} as={GoPerson} />
                            </Th>
                            <Th
                                textAlign='center'
                                textColor={lightTextColor}
                                fontSize={{ base: '3xs', sm: '2xs', md: 'sm', lg: 'md', xl: 'lg' }}
                                alignItems='center'
                                justifyContent='center'
                                whiteSpace='nowrap'
                                overflow='hidden'
                                textOverflow='ellipsis'
                                px={2}
                            >
                                <Icon boxSize={8} as={GiBattleGear} />
                            </Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {playerData.map((asset: any) => (
                            <Tr key={asset.address}>
                                <Td w='50%' textAlign='center' _hover={{textColor: baseTextColor}} textColor={xLightTextColor} fontSize={{ base: 'sm', sm: 'sm', md: 'md', lg: 'lg', xl: 'xl' }}>
                                    <a href={`https://allo.info/account/${asset.address}`} target='_blank' rel='noreferrer'>
                                        {asset.nfd ? asset.nfd.replace('.algo', '') : asset.address.substring(0, 5) + "..." + asset.address.substring(asset.address.length - 5)}
                                    </a>
                                </Td>
                                <Td w='50%' textAlign='center' textColor={xLightTextColor} fontSize={{ base: 'sm', sm: 'sm', md: 'md', lg: 'lg', xl: 'xl' }}>
                                    {asset.amount}
                                </Td>
                            </Tr>
                            ))}
                        </Tbody>
                    </Table>
                ) : 
                    <Text textAlign='center' fontSize="md" textColor={xLightTextColor}>
                        No Attacks Yet!
                        <br />
                        Ares: &quot;I can sense the fear in you...&quot;
                    </Text>
                }
            </Box>
            </Center>

        <Footer />
    </>
  )
}