import Head from 'next/head'
import Navbar from 'components/Navbar'
import { Center, useColorModeValue, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, useDisclosure, HStack, Box, Tooltip, Flex, Icon, Tab, Tabs, TabList, TabPanels, TabPanel, Progress, Input, Button, useColorMode, NumberInput, NumberInputField, VStack, Image, ModalCloseButton } from '@chakra-ui/react'
import styles from '../styles/glow.module.css'
import Footer from 'components/Footer'
import { useWallet } from '@txnlab/use-wallet'
import algosdk from 'algosdk'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { algodClient } from 'lib/algodClient'
import { FullGlowButton, IconGlowButton, IconGlowButton2, IconGlowButtonMedium, IconGlowButtonSmall, IconGlowButtonTiny } from 'components/Buttons'
import { IoIosSettings, IoMdSettings } from 'react-icons/io'
import { convertAlgosToMicroalgos } from 'utils'
import { FaQuestion } from 'react-icons/fa'
import { MdOutlineQuestionMark } from 'react-icons/md'
import { CiBoxList } from 'react-icons/ci'

export default function Duster() {
  const { activeAddress, signTransactions, sendTransactions } = useWallet()
  const [currentIteration, setCurrentIteration] = useState(0)
  const [count, setCount] = useState<number>(0)
  const [algoamount, setAlgoamount] = useState<string>('')
  const [assetid, setAssetid] = useState<number>(0)
  const [maxCount, setMaxCount] = useState<number>(10000)
  const [invalid, setInvalid] = useState<string>('')
  const [dustWallet, setDustWallet] = useState<any>(null)
  const [balance, setBalance] = useState<number | null>(null)

  const assets = [
    "CHIPS - 388592191",
    "TINY - 2200000000",
    "PGOLD - 1237529510",
    "DEFLY - 470842789",
    "AKTA - 523683256",
    "VEST - 700965019",
    "DAFFIR - 1268830233",
    "COOP - 796425061",
    "NIKO - 1265975021",
    "GORA - 1138500612",
    "FINITE - 400593267",
    "PEPE - 1096015467",
    "ORA - 1284444444",
    "COMPX - 1732165149",
    "MOOJ - 2154668640",
    "COSG - 1065092715",
    "META - 712012773",
    "BARB - 1285225688",
    "ASASTATS - 393537671",
    "GAIN - 1748330503",
    "JAWS - 2155690250",
    "TDLD - 2176744157",
    "BASED - 2155688884",
    "A200 - 1682662165",
    "BUTTS - 753137719",
    "BOBO - 1775410837"
  ]
  const assetNames = assets.map(asset => {
    const parts = asset.split(' - ')
    return parts[0]
  })
  const assetIDs = assets.map(asset => {
    const parts = asset.split(' - ')
    return parts[1]
  })

  const gradientText = useColorModeValue(styles.textAnimatedGlowL, styles.textAnimatedGlowD)
  const buttonText3 = useColorModeValue('orange.500','cyan.500')
  const buttonText4 = useColorModeValue('orange.200','cyan.100')
  const buttonText5 = useColorModeValue('orange','cyan')
  const xLightColor = useColorModeValue('orange.100', 'cyan.100')
  const lightColor = useColorModeValue('orange.300', 'cyan.300')
  const medColor = useColorModeValue('orange.500', 'cyan.500')
  const progress = useColorModeValue('linear(to-r, orange, red)', 'linear(to-r, purple.600, cyan)')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isOpenFAQ, onOpen: onOpenFAQ, onClose: onCloseFAQ } = useDisclosure()
  const { isOpen: isOpenPresets, onOpen: onOpenPresets, onClose: onClosePresets } = useDisclosure()
  const [addFunds, setAddFunds] = useState<boolean>(false)
  const [dustInProgress, setDustInProgress] = useState<boolean>(false)
  const sleep = (ms: any) => new Promise(resolve => setTimeout(resolve, ms))

  useEffect(() => {
    const existingWallet = localStorage.getItem('dust_wallet')
    if (existingWallet) {
      const walletData = JSON.parse(existingWallet);
      setDustWallet(walletData)
    } else {
      const newWallet = algosdk.generateAccount()
      const mnemonic = algosdk.secretKeyToMnemonic(newWallet.sk)
      const walletData = {
        address: newWallet.addr,
        mnemonic,
        privateKey: Buffer.from(newWallet.sk).toString('base64'),
      }
  
      localStorage.setItem('dust_wallet', JSON.stringify(walletData))
      setDustWallet(walletData)
    }
  }, [])
  
  useEffect(() => {
    if (dustWallet && dustWallet.address) {
      fetchBalance(dustWallet.address)
    }
  }, [dustWallet])
  

  const fetchBalance = async (address: string) => {
    try {
      const accountInfo = await algodClient.accountInformation(address).do()
      setBalance((accountInfo.amount-accountInfo["min-balance"]) / 1e6)

      if ((accountInfo.amount-accountInfo["min-balance"]) < 200000) {
        setMaxCount(0)
      } else {
        setMaxCount(Math.floor((accountInfo.amount-accountInfo["min-balance"]) / 1e6 / 0.201))
      }

    } catch (error) {
      toast.error("Failed to Fetch Dust Wallet")
    }
  }

  const handleCopy = (text: string, success: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(success)
    }).catch((err) => {
      toast.error("Failed to Copy...")
    })
  }

  const handleFunding = async () => {
    try {
      if (!activeAddress) {
        throw new Error('Wallet Not Connected!')
      }

      const from = activeAddress
      const to = dustWallet ? dustWallet.address : null
      const amount = algoamount === '' ? 0 : convertAlgosToMicroalgos(parseFloat(algoamount))
      const note = Uint8Array.from("Funding added to Dust Wallet\n\nDuster - Angels Of Ares".split("").map(x => x.charCodeAt(0)))
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

      const signedTransactions = await signTransactions([encodedTransaction])

      algodClient.sendRawTransaction(signedTransactions).do()

      toast.success('Transaction sent successully!', {
        id: 'txn',
        duration: 5000
      })

      setTimeout(() => {
        fetchBalance(dustWallet.address)
      }, 5000)

    } catch (error) {
      console.error(error)
      toast.error('Oops! ALGO Funding Failed!', { id: 'txn' })
    }
  }

  
async function handleDusting() {

  for (let i = 0; i < count; i++) {
    try {
      const privateKey = Uint8Array.from(Buffer.from(dustWallet.privateKey, 'base64'))
      const newWallet = algosdk.generateAccount()
      const newAddress = newWallet.addr
      const suggestedParams = await algodClient.getTransactionParams().do()
      suggestedParams.fee = 1000
      suggestedParams.flatFee = true

      const txnAlgo = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: dustWallet.address,
        to: newAddress,
        amount: 0.201 * 1e6,
        suggestedParams
      })

      const txnOptIn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: newAddress,
        to: newAddress,
        amount: 0,
        assetIndex: assetid,
        suggestedParams
      })

      const txnAsset = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: dustWallet.address,
        to: newAddress,
        assetIndex: assetid,
        amount: 1,
        suggestedParams
      })

      const txnGroup = [txnAlgo, txnOptIn, txnAsset]
      algosdk.assignGroupID(txnGroup)
      
      let signedGroup = []

      const signedTxnAlgo = await algosdk.signTransaction(txnAlgo, privateKey)
      signedGroup.push(signedTxnAlgo.blob)

      const signedTxnOptIn = await algosdk.signTransaction(txnOptIn, newWallet.sk)
      signedGroup.push(signedTxnOptIn.blob)

      const signedTxnAsset = await algosdk.signTransaction(txnAsset, privateKey)
      signedGroup.push(signedTxnAsset.blob)

      await algodClient.sendRawTransaction(signedGroup).do()

      setCurrentIteration(i + 1)
      
    } catch (error: any) {
      console.error(`Error with iteration ${i + 1}:`, error)
      toast.error(`Error with iteration ${i + 1}: ${error.message}`)
    }
  }
  setDustInProgress(false)
  toast.success(`Dusting Successful! ${count} Holders Added to Asset ID #${assetid}`, {
    id: 'txn',
    duration: 10000
  })
  
  setTimeout(() => {
    fetchBalance(dustWallet.address)
  }, 5000)
}

const checkIfOptedIn = async (address: string, assetId: number): Promise<boolean> => {
  try {
    const accountInfo = await algodClient.accountInformation(address).do()
    const isOptedIn = accountInfo.assets.some((asset: { 'asset-id': number }) => asset['asset-id'] === assetId)

    return isOptedIn
  } catch (error) {
    return false
  }
}

const sendDustFunding = async () => {
  setDustInProgress(true)
  try {
    if (!activeAddress) {
      throw new Error('Wallet Not Connected!')
    }
    const suggestedParams = await algodClient.getTransactionParams().do()

    const isOptedIn = await checkIfOptedIn(dustWallet.address, assetid)

    const privateKey = Uint8Array.from(Buffer.from(dustWallet.privateKey, 'base64'))

    if (!isOptedIn) {
      const txnOptIn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: dustWallet.address,
        to: dustWallet.address,
        amount: 0,
        assetIndex: assetid,
        suggestedParams
      })
      const signedTxnOptIn = algosdk.signTransaction(txnOptIn, privateKey)
      await algodClient.sendRawTransaction(signedTxnOptIn.blob).do()
    }

    const accountInfo = await algodClient.accountInformation(dustWallet.address).do()
      
    const asset = accountInfo.assets.find((asset: any) => asset['asset-id'] === assetid)
    const av_balance = asset.amount

      const from = activeAddress
      const to = dustWallet.address
      const note = Uint8Array.from(('Dust tokens added to Dust Wallet\n\nDuster - Angels Of Ares').split("").map(x => x.charCodeAt(0)))
      suggestedParams.fee = 1000
      suggestedParams.flatFee = true
      
      const txnAlgo = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: activeAddress,
        to: "ANGEL3CMT7TEXSBJR3DCTJTZCQFOF6FJB6PDKU4IOAMTNPXGR7XUYKOU5Y",
        amount: count * 0.024 * 1e6,
        suggestedParams
      })
      const txnGroup = [txnAlgo]

      if (av_balance < count) {
        const transaction = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
          from,
          to,
          suggestedParams,
          note,
          amount: count-av_balance,
          assetIndex: assetid
        })
        txnGroup.push(transaction)
      }

    algosdk.assignGroupID(txnGroup)

    const encodedBatch = txnGroup.map((txn: any) => algosdk.encodeUnsignedTransaction(txn))

    toast.loading('Awaiting Signature...', { id: 'txn', duration: Infinity })

    const signedTransactions = await signTransactions(encodedBatch)

    await sendTransactions(signedTransactions, 0)

    toast.success(`Dust tokens sent! Initiating Dusting...`, {
      id: 'txn',
      duration: 5000
    })

    const handleDustingWithDelay = async () => {
      await sleep(5000)
      handleDusting()
    }

    handleDustingWithDelay()

  } catch (error) {
    console.error(error)
    toast.error('Oops! Dusting Failed...', { id: 'txn' })
  }
}
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = e.target.value
    const regExp = /^\d+(?:\.\d{0,6})?$/gm
    if (amount !== '' && amount.match(regExp) === null) {
      return
    }
    setAlgoamount(amount)
  }

  return (
    <>
        <Head>
            <title>Duster - Holder Count Booster</title>
            <meta name="description" content="Developed by Angels Of Ares" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Navbar />
        <Box p={4} w="full" position="absolute">
          <HStack spacing={2} justify="flex-end">
            <IconGlowButtonMedium icon={CiBoxList} onClick={onOpenPresets} />
            <IconGlowButtonMedium icon={MdOutlineQuestionMark} onClick={onOpenFAQ} />
          </HStack>
        </Box>

        <Modal scrollBehavior={'inside'} size='xl' isCentered isOpen={isOpenPresets} onClose={onClosePresets}>
            <ModalOverlay backdropFilter='blur(10px)'/>
            <ModalContent m='auto' alignItems='center' bgColor='black' borderWidth='1.5px' borderColor={buttonText3} borderRadius='2xl'>
                <ModalHeader className={gradientText} textAlign='center' fontSize='20px' fontWeight='bold'>Preset Assets</ModalHeader>
                <ModalBody w='100%'>
                  <VStack m={1} alignItems='center' textAlign='center' justifyContent='center' spacing='10px'>
                    <Text pb={4} fontSize="14px" textColor={buttonText4}>
                      {assets.map((asset: any, index: any) => (
                        <Box p={1.5} _hover={{textColor: buttonText5}} key={index} 
                          cursor="pointer" 
                          onClick={() => handleCopy(assetIDs[index], `${assetNames[index]} Asset ID Copied!`)}>
                          {asset}
                          <br />
                        </Box>
                      ))}
                    </Text>
                  </VStack>
                </ModalBody>
                <HStack p={4}>
                    <FullGlowButton text='X' onClick={onClosePresets} />
                </HStack>
              </ModalContent>
          </Modal>

          <Modal scrollBehavior={'outside'} size='xl' isCentered isOpen={isOpenFAQ} onClose={onCloseFAQ}>
            <ModalOverlay backdropFilter='blur(10px)'/>
            <ModalContent m='auto' alignItems='center' bgColor='black' borderWidth='1.5px' borderColor={buttonText3} borderRadius='2xl'>
                <ModalHeader className={gradientText} textAlign='center' fontSize='20px' fontWeight='bold'>How It Works</ModalHeader>
                <ModalBody>
                  <VStack m={1} alignItems='center' textAlign='center' justifyContent='center' spacing='10px'>
                      <Text pb={4} fontSize='14px' textColor={buttonText4}>
                        This tool allows you to efficiently add holders to any Algorand asset
                        <br />
                        <br />
                        Each user has a unique dusting wallet created for them, stored locally on their browser&apos;s storage, with seedphrase accessible for manual functionality
                        <br />
                        <br />
                        You may connect your personal wallet to fund the dusting wallet, or copy the address for manual sending
                        <br />
                        <br />
                        To begin dusting, simply choose how many holders to add, the asset ID to add them to, and dust away!
                      </Text>

                      <Text pb={4} fontSize='14px' textColor={buttonText4}>
                        0.201A min balance is required to create each new wallet and opt them into the asset
                        <br />
                        <br />
                        1 Holder = 0.201 + 0.024 = 0.225A
                        <br />
                        This service charges a 0.024A/Holder fee
                        <br />
                        <br />
                        Samples:
                        <br />
                        +100 Holders = 22.5A
                        <br />
                        +2000 Holders = 450A
                        <br />
                        +10000 Holders = 2250A
                      </Text>

                      <HStack pb={4}>
                          <FullGlowButton text='X' onClick={onCloseFAQ} />
                      </HStack>
                  </VStack>
                </ModalBody>
              </ModalContent>
          </Modal>

          <Text mt='24px' className={`${gradientText} responsive-font`}>Duster</Text>
          
          {!dustInProgress ?
          <>
            <Text my='6px' fontSize={{ base: 'xs', sm: 'xs', md: 'sm', lg: 'md', xl: 'lg' }} textAlign='center' textColor={buttonText4}>Your friendly hodler count booster!</Text>
          
            <Center mt={6}>
              <VStack>
              <Text fontSize={'sm'} textColor={buttonText5}>
                Your Dust Wallet
              </Text>
                {dustWallet ? (
                  <>
                    <HStack>
                      <Tooltip py={1} px={2} borderWidth='1px' borderRadius='lg' arrowShadowColor={buttonText5} borderColor={buttonText5} bgColor='black' textColor={buttonText4} fontSize='10px' fontFamily='Orbitron' textAlign='center' hasArrow label={`Copy Address`} aria-label='Tooltip'>
                      <Text 
                          fontSize={'sm'} 
                          textColor={buttonText4}
                          cursor="pointer" 
                          onClick={() => handleCopy(dustWallet ? dustWallet.address : '', "Dusting Address Copied!")}
                        >
                          {dustWallet.address.substring(0, 5) + '...' + dustWallet.address.substring(dustWallet.address.length - 5)}
                        </Text>
                      </Tooltip>
                      <Tooltip py={1} px={2} borderWidth='1px' borderRadius='lg' arrowShadowColor={buttonText5} borderColor={buttonText5} bgColor='black' textColor={buttonText4} fontSize='10px' fontFamily='Orbitron' textAlign='center' hasArrow label={`Manage Dusting Wallet`} aria-label='Tooltip'>
                        <div><IconGlowButtonSmall icon={IoMdSettings} onClick={onOpen} /></div>
                      </Tooltip>
                    </HStack>
                  </>
                ) : null}
              </VStack>
            </Center>

            <Modal scrollBehavior={'outside'} size='md' isCentered isOpen={isOpen} onClose={onClose}>
            <ModalOverlay backdropFilter='blur(10px)'/>
            <ModalContent m='auto' alignItems='center' bgColor='black' borderWidth='1.5px' borderColor={buttonText3} borderRadius='2xl'>
                <ModalHeader className={gradientText} textAlign='center' fontSize='24px' fontWeight='bold'>Your Dust Wallet</ModalHeader>
                <ModalBody>
                  <Tooltip py={1} px={2} borderWidth='1px' borderRadius='lg' arrowShadowColor={buttonText5} borderColor={buttonText5} bgColor='black' textColor={buttonText4} fontSize='10px' fontFamily='Orbitron' textAlign='center' hasArrow label={`Copy Address`} aria-label='Tooltip'>
                    <Text
                        align='center'
                        fontSize={'lg'} 
                        textColor={buttonText5}
                        cursor="pointer" 
                        onClick={() => handleCopy(dustWallet ? dustWallet.address : '', "Dusting Address Copied!")}
                      >
                        {dustWallet?.address.substring(0, 5) + '...' + dustWallet?.address.substring(dustWallet?.address.length - 5)}
                      </Text>
                    </Tooltip>
                    <HStack my={1} textAlign='center' fontFamily='Orbitron' textColor={buttonText4} spacing='3px' justifyContent='center'>
                      <Text textColor={buttonText4} fontSize="lg">
                        Balance: {balance ? balance : "0"}
                      </Text>
                      <Image boxSize='16px' alt={'Algorand'} src={'/algologo.png'} />
                    </HStack>
                    <HStack my={4} textAlign='center' fontFamily='Orbitron' textColor={buttonText4} spacing='12px'>
                      {activeAddress ? 
                        <FullGlowButton text='Add Funds' onClick={() => setAddFunds(!addFunds)} />
                      : null}
                      <Box onClick={() => handleCopy(dustWallet ? dustWallet.mnemonic : '', "Seedphrase Copied!")}>
                        <FullGlowButton text='Copy Seed' />
                      </Box>
                    </HStack>
                    {addFunds ?
                      <>
                        <HStack justifyContent='center'>
                          <Text textColor={buttonText4} fontSize="xl">
                            Amount of
                          </Text>
                          <Image boxSize='16px' alt={'Algorand'} src={'/algologo.png'} />
                          <Text textColor={buttonText4} fontSize="xl">to Add
                          </Text>
                        </HStack>
                        <HStack mt={2} mb={4} justifyContent='center'>
                          <Input
                            type="text"
                            name="algoamount"
                            id="algoamount"
                            w='120px'
                            textAlign='center'
                            _hover={{ bgColor: 'black' }}
                            _focus={{ borderColor: medColor }}
                            textColor={xLightColor}
                            borderColor={medColor}
                            className={`block w-full rounded-none rounded-l-md bg-black sm:text-sm`}
                            value={algoamount}
                            onChange={handleAmountChange}
                            placeholder="1.0"
                          />
                          <FullGlowButton text='Add!' onClick={handleFunding} />
                        </HStack>
                      </>
                    : null}
                </ModalBody>
            </ModalContent>
            </Modal>

            <Text mb='2px' mt='24px' fontSize={'sm'} textAlign='center' textColor={buttonText5}>
              Holders to Add
            </Text>
            <Center>
              <Input
                type="number"
                name="count"
                id="count"
                w='110px'
                textAlign='center'
                _hover={{ bgColor: 'black' }}
                _focus={{ borderColor: medColor }}
                textColor={xLightColor}
                borderColor={medColor}
                className={`block w-full rounded-none rounded-l-md bg-black sm:text-sm`}
                value={count}
                onInput={(e) => {
                  const target = e.target as HTMLInputElement
                  let value = parseInt(target.value) || 0
                  if (value < 1) {
                    value = 1
                    setInvalid('Minimum Count is 1!')
                  }
                  if (value > 10000) {
                    value = 10000
                    setInvalid('Maximum Count is 10000!')
                  }
                  setCount(value)
                  setTimeout(() => {
                    setInvalid('')
                  }, 5000)
                }}
              />
            </Center>

            {invalid !== '' ?
              <Text my='6px' fontSize={'sm'} textAlign='center' textColor={'red'}>
                {invalid}
              </Text>
            : null}

            <Text mb='2px' mt='16px' fontSize={'sm'} textAlign='center' textColor={buttonText5}>
              Asset ID
            </Text>
            <Center>
            <Input
                type="number"
                name="assetid"
                id="assetid"
                textAlign='center'
                w='200px'
                _hover={{ bgColor: 'black' }}
                _focus={{ borderColor: medColor }}
                textColor={xLightColor}
                borderColor={medColor}
                className={`block w-full rounded-none rounded-l-md bg-black sm:text-sm`}
                value={assetid}
                onChange={(e) => setAssetid(parseInt(e.target.value))}
                placeholder="0"
              />
            </Center>{count > maxCount && balance ?
              <Text mt='10px' fontSize={'sm'} textAlign='center' textColor={'red'}>
                Please add more funds!
                <br />
                Dusting Units Available: {maxCount}
              </Text>
            : null}
            <Center my={4}>
              <FullGlowButton text='Dust!' onClick={sendDustFunding} disabled={!assetid || assetid == 0 || assetid < 1000000 || count > maxCount}/>
            </Center>
            
          </>
          :
            <VStack mt={6} justifyContent='center'>
              <Text my='6px' fontSize={{ base: 'xs', sm: 'xs', md: 'sm', lg: 'md', xl: 'lg' }} textAlign='center' textColor={buttonText4}>
                Dusting In Progress!
              </Text>
              <Box w='280px'>
                <Progress size='xs' bgGradient={progress} colorScheme={buttonText5} isIndeterminate borderRadius='xl'/>
              </Box>
              <Text fontSize={{ base: 'xs', sm: 'xs', md: 'sm', lg: 'md', xl: 'lg' }} textAlign='center' textColor={buttonText4}>
                {currentIteration}/{count}
              </Text>
            </VStack>
        }
        <Footer />
    </>
  )
}
