import { useWallet } from '@txnlab/use-wallet'
import algosdk from 'algosdk'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { algodClient } from 'lib/algodClient'
import { Box, useColorMode, useColorModeValue, Text, Input, Switch, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, HStack, Center, Tooltip } from '@chakra-ui/react'
import styles from '../../styles/glow.module.css'
import { FullGlowButton } from '../Buttons'

export default function AssetCreate() {
  const { activeAddress, signTransactions, sendTransactions } = useWallet()
  const [decimals, setDecimals] = useState<number>(0)
  const [supply, setSupply] = useState<number>(0)
  const [assetID, setAssetID] = useState<number>(0)
  const [unitName, setUnitName] = useState<string>('')
  const [assetName, setAssetName] = useState<string>('')
  const [manager, setManager] = useState<string>('')
  const [reserve, setReserve] = useState<string>('')
  const [assetURL, setAssetURL] = useState<string>('')
  const [rawNote, setRawNote] = useState<string>('')
  const [freeze, setFreeze] = useState<string>('')
  const [clawback, setClawback] = useState<string>('')
  const [defaultFrozen, setDefaultFrozen] = useState<boolean>(false)
  const [pro, setPro] = useState<boolean>(false)
  const { colorMode } = useColorMode();
  const boxGlow = useColorModeValue(styles.boxGlowL, styles.boxGlowD)
  const xLightColor = useColorModeValue('orange.100','cyan.100')
  const lightColor = useColorModeValue('orange.300','cyan.300')
  const medColor = useColorModeValue('orange.500','cyan.500')
  const baseColor = colorMode === "light" ? "orange" : "cyan"
  
  const buttonText3 = useColorModeValue('orange.500','cyan.500')
  const buttonText4 = useColorModeValue('orange.100','cyan.100')
  const iconColor1 = useColorModeValue('orange','cyan')

  const from = activeAddress ? activeAddress : ""
  const note = Uint8Array.from(rawNote.split("").map(x => x.charCodeAt(0)))

  useEffect(() => {
    if (activeAddress) {
      setManager(activeAddress)
      setReserve(activeAddress)
      setFreeze(activeAddress)
      setClawback(activeAddress)
    }
  }, [activeAddress, unitName])

  const handleDefaultFrozenToggle = () => {
    setDefaultFrozen(!defaultFrozen);
  };
  
  const togglePro = () => {
    setPro(!pro);
  };


  const sendAssetCreate = async () => {
    try {
      if (!activeAddress) {
        throw new Error('Wallet Not Connected!')
      }

      const suggestedParams = await algodClient.getTransactionParams().do()
      const total = supply*(10**decimals)
      suggestedParams.fee = 1000
      suggestedParams.flatFee = true
      const transaction = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
        from,
        total,
        decimals,
        suggestedParams,
        freeze,
        clawback,
        unitName,
        assetURL,
        assetName,
        defaultFrozen,
        manager,
        reserve,
        note
      });
      

      const encodedTransaction = algosdk.encodeUnsignedTransaction(transaction)

      toast.loading('Awaiting Signature...', { id: 'txn', duration: Infinity })

      const signedTransactions = await signTransactions([encodedTransaction])

      toast.loading('Creating Asset...', { id: 'txn', duration: Infinity })

      const waitRoundsToConfirm = 4

      const { id } = await sendTransactions(signedTransactions, waitRoundsToConfirm)

      
      let assetID: any = null
      let txinfo = await algodClient.pendingTransactionInformation(id).do()
      assetID = txinfo["asset-index"]
      setAssetID(assetID)

      toast.success('Asset Successfully Created!', {
        id: 'txn',
        duration: 5000
      })
    } catch (error) {
      console.error(error)
      toast.error(' Oops! Asset Creation Failed! Total MicroUnits Must Be Under 2^64-1! MicroUnits = Supply*(10^Decimals)', { id: 'txn' })
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setPro(false)
    e.preventDefault()
    sendAssetCreate()
  }

  return (
    <Box className={boxGlow} m='20px' minW='300px' maxW='480px' bg="black" borderRadius="20px">
      <div className="pt-5 sm:px-6 relative">
        <Text className='hFont' textColor={medColor} textAlign="center">Create Asset</Text>
      </div>
      <div className="mx-5 pb-1 pt-3">
        
        <HStack my={5} spacing='20px'>
            <Text textColor={lightColor}>Name</Text>
            <Input maxLength={32} _hover={{bgColor: 'black'}} _focus={{borderColor: medColor}} textColor={xLightColor} borderColor={medColor}
                className={`block w-full rounded-none rounded-l-md bg-black sm:text-sm`} type="text" value={assetName} onChange={(e) => setAssetName(e.target.value)} placeholder="We All Gonna Make It!" />
        </HStack>
        
        <HStack my={5} spacing='20px'>
            <Text textColor={lightColor} className='whitespace-nowrap'>Unit Name</Text>
            <Input maxLength={8} _hover={{bgColor: 'black'}} _focus={{borderColor: medColor}} textColor={xLightColor} borderColor={medColor}
                className={`block w-full rounded-none rounded-l-md bg-black sm:text-sm`} type="text" value={unitName} onChange={(e) => setUnitName(e.target.value)} placeholder="WAGMI" />
        </HStack>

        <HStack my={5} spacing='20px'>
            <Text textColor={lightColor}>Supply</Text>
            <Input max="10000000" _hover={{bgColor: 'black'}} _focus={{borderColor: medColor}} textColor={xLightColor} borderColor={medColor}
                className={`block w-full rounded-none rounded-l-md bg-black sm:text-sm`} type="number" value={supply} onChange={(e) => setSupply(parseInt(e.target.value))} placeholder="1000000" />
        </HStack>
        
        <HStack my={5} spacing='20px'>
            <Text textColor={lightColor}>Decimals</Text>
            <NumberInput w='100px' min={0} max={18} value={decimals} onChange={(valueString) => setDecimals(parseInt(valueString))} isInvalid={decimals < 0 || decimals > 18}>
            <NumberInputField _hover={{ bgColor: 'black' }} _focus={{ borderColor: medColor }} textColor={xLightColor} borderColor={medColor} className={`block rounded-none rounded-l-md bg-black sm:text-sm`}/>
            <NumberInputStepper>
                <NumberIncrementStepper _hover={{ textColor: medColor }} textColor={lightColor} borderColor={medColor}/>
                <NumberDecrementStepper _hover={{ textColor: medColor }} textColor={lightColor} borderColor={medColor}/>
            </NumberInputStepper>
            </NumberInput>
            <Box ml={4}><FullGlowButton text='PRO' onClick={togglePro}/></Box>
        </HStack>
        {pro ?
        <>
        <HStack my={5} spacing='20px'>
            <Text textColor={lightColor}>Manager</Text>
            <Input _hover={{bgColor: 'black'}} _focus={{borderColor: medColor}} textColor={xLightColor} borderColor={medColor}
                className={`block w-full rounded-none rounded-l-md bg-black sm:text-sm`} type="text" defaultValue={from} onChange={(e) => setManager(e.target.value)} />
        </HStack>

        
        <HStack my={5} spacing='20px'>
            <Text textColor={lightColor}>Reserve</Text>
            <Input _hover={{bgColor: 'black'}} _focus={{borderColor: medColor}} textColor={xLightColor} borderColor={medColor}
                className={`block w-full rounded-none rounded-l-md bg-black sm:text-sm`} type="text" defaultValue={from} onChange={(e) => setReserve(e.target.value)} placeholder='Reserve Address' />
        </HStack>

        
        <Tooltip py={1} px={2} borderWidth='1px' borderRadius='lg' arrowShadowColor={iconColor1} borderColor={buttonText3} bgColor='black' textColor={buttonText4} fontSize='16px' fontFamily='Orbitron' textAlign='center' hasArrow label={'Insert address here to enable FREEZE'} aria-label='Tooltip'>
          <HStack my={5} spacing='20px'>
              <Text textColor={lightColor}>Freeze</Text>
              <Input _hover={{bgColor: 'black'}} _focus={{borderColor: medColor}} textColor={xLightColor} borderColor={medColor}
                  className={`block w-full rounded-none rounded-l-md bg-black sm:text-sm`} type="text" defaultValue={from} onChange={(e) => setFreeze(e.target.value)} placeholder='Freeze Address' />
          </HStack>
        </Tooltip>

        
        <Tooltip py={1} px={2} borderWidth='1px' borderRadius='lg' arrowShadowColor={iconColor1} borderColor={buttonText3} bgColor='black' textColor={buttonText4} fontSize='16px' fontFamily='Orbitron' textAlign='center' hasArrow label={'Insert address here to enable CLAWBACK'} aria-label='Tooltip'>
          <HStack my={5} spacing='20px'>
              <Text textColor={lightColor}>Clawback</Text>
              <Input _hover={{bgColor: 'black'}} _focus={{borderColor: medColor}} textColor={xLightColor} borderColor={medColor}
                  className={`block w-full rounded-none rounded-l-md bg-black sm:text-sm`} type="text" defaultValue={from} onChange={(e) => setClawback(e.target.value)} placeholder='Clawback Address' />
          </HStack>
        </Tooltip>

        <HStack my={5} spacing='20px'>
            <Text textColor={lightColor}>URL</Text>
            <Input _hover={{bgColor: 'black'}} _focus={{borderColor: medColor}} textColor={xLightColor} borderColor={medColor}
                className={`block w-full rounded-none rounded-l-md bg-black sm:text-sm`} type="text" value={assetURL} onChange={(e) => setAssetURL(e.target.value)} placeholder="External URL" />
        </HStack>
        
        
        <HStack my={5} spacing='20px'>
            <Text textColor={lightColor}>Note</Text>
            <Input _hover={{bgColor: 'black'}} _focus={{borderColor: medColor}} textColor={xLightColor} borderColor={medColor}
                className={`block w-full rounded-none rounded-l-md bg-black sm:text-sm`} type="text" value={rawNote} onChange={(e) => setRawNote(e.target.value)} placeholder="Creation Note" />
        </HStack>

        <Center>
          <Tooltip py={1} px={2} borderWidth='1px' borderRadius='lg' arrowShadowColor={iconColor1} borderColor={buttonText3} bgColor='black' textColor={buttonText4} fontSize='16px' fontFamily='Orbitron' textAlign='center' hasArrow label={'If this is ENABLED, the asset will DEFAULT to FROZEN and may only be transferred using the CLAWBACK address!'} aria-label='Tooltip'>
            <HStack my={5} spacing='20px' w='fit-content'>
                <Text textColor={lightColor} className='whitespace-nowrap'>Default Frozen</Text>
                <Switch defaultChecked={false} size='lg' colorScheme={baseColor} css={{"& .chakra-switch__thumb": {backgroundColor: "black" }}} onChange={handleDefaultFrozenToggle} />
            </HStack>
          </Tooltip>
        </Center>
        </> : null}
        <Center my={6}><FullGlowButton text='Create!' onClick={handleSubmit} disabled={unitName === '' || assetName === '' || supply === 0}/></Center>
        {assetID !== 0 ?
        <>
         <Text mb={2} textAlign='center' fontSize='28px' textColor={xLightColor}>Success!</Text>
         <Center mb={6}><a href={`https:/algoexplorer.io/asset/${assetID}`} target='_blank' rel='noreferrer'><FullGlowButton text='View Asset!' /></a></Center>
        </> : null}
      </div>
    </Box>
  )
}
