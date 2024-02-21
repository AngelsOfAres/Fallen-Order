import { useWallet } from '@txnlab/use-wallet'
import { useMemo, useEffect, useState, useCallback } from 'react'
import useWalletBalance from 'hooks/useWalletBalance'
import { convertAlgosToMicroalgos } from 'utils'
import { algodClient } from 'lib/algodClient'
import { useColorMode, useColorModeValue, Text, Input, Button, Center, Tooltip, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, useDisclosure } from '@chakra-ui/react'
import styles from '../../../styles/glow.module.css'
import { classNames } from 'utils'
import { Listbox } from '@headlessui/react'
import SelectMenu from 'components/SelectMenu'
import { FullGlowButton, IconGlowButton2 } from '../../Buttons'
import { rateLimiter } from 'lib/ratelimiter'
import { TbReportMoney } from 'react-icons/tb'
import toast from 'react-hot-toast'
import { sendThriftling } from 'api/backend'

export default function CreateThriftling() {
  const { activeAddress, signTransactions, sendTransactions } = useWallet()
  const [price, setPrice] = useState<string>('')
  const [assetID, setAssetID] = useState<number>(0)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [tokenBal, setTokenBal] = useState<number>(0)
  const [decimals, setDecimals] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const { colorMode } = useColorMode()
  const gradientText = useColorModeValue(styles.textAnimatedGlowL, styles.textAnimatedGlowD)
  const xLightColor = useColorModeValue('orange.100', 'cyan.100')
  const lightColor = useColorModeValue('orange.300', 'cyan.300')
  const medColor = useColorModeValue('orange.500', 'cyan.500')
  const buttonText5 = useColorModeValue('orange','cyan')
  const bgColor = colorMode === "light" ? "bg-orange-400" : "bg-cyan-500"
  const buttonText4 = useColorModeValue('orange.200','cyan.100')
  const buttonText3 = useColorModeValue('orange.500','cyan.500')
  const hoverBgColor = colorMode === "light" ? "hover:bg-orange-400" : "hover:bg-cyan-500"
  const textColor = colorMode === "light" ? "text-orange-900" : "text-cyan-900"

  const { accountInfo, assetList, walletAvailableBalance } = useWalletBalance()

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = e.target.value
    const regExp = /^\d+(?:\.\d{0,3})?$/gm
    if (amount !== '' && amount.match(regExp) === null) {
      return
    }
    setPrice(amount)
  }

  const hasSufficientBalance = useMemo(() => {
    const availableBalance = convertAlgosToMicroalgos(parseFloat(walletAvailableBalance || '0'))
    return availableBalance >= 1000000
  }, [walletAvailableBalance])

  async function handleSubmit() {
    setLoading(true)
    try{
        const data = await sendThriftling(activeAddress, assetID, price)
        if (data) {
            toast.loading('Awaiting Signature...', { id: 'txn', duration: Infinity })
            let finalGroup = []
            for (const txn of data.unsignedGroup) {
                finalGroup.push(new Uint8Array(Object.values(txn)))
            }
            try {
                const signedTransactions = await signTransactions(finalGroup)
                
                const waitRoundsToConfirm = 4
          
                const { id } = await sendTransactions(signedTransactions, waitRoundsToConfirm)
          
                toast.success(`Purchase Successful! Txn ID: ${id}`, {
                  id: 'txn',
                  duration: 5000
                })

            } catch (error: any){
                console.log(error)
            }
        }
    } catch (error) {
        toast.error(`Oops! Purchase failed. Please contact an admin if issue persists...`, { id: 'txn' })
    } finally {
        setLoading(false)
    }
  }

  const options = useMemo(() => [
    {
      value: 'Choose Donation',
      label: (
        <>
          <span className={`inline-flex items-center rounded ${bgColor} px-2.5 py-0.5 text-sm font-medium text-black mr-3`}>
            THRIFT
          </span>
        </>
      ),
      asset: 0,
    },
    ...(Array.isArray(assetList)
      ? assetList.map((asset: any) => ({
          value: asset['asset-id'],
          label: (
            <>
              <span className={`inline-flex items-center rounded ${bgColor} px-2.5 py-0.5 text-sm font-medium text-black mr-3`}>
                {asset['asset-id']}
              </span>
            </>
          ),
          asset
        }))
      : []
    ),
  ], [assetList, bgColor])
  

  const optionsPerPage = 120
  const [visibleOptions, setVisibleOptions] = useState<any[]>([])
  const [canLoadMore, setCanLoadMore] = useState(false)
  const [loadedOptionsCount, setLoadedOptionsCount] = useState(0)

  const loadMoreOptions = useCallback(async () => {
    setLoadedOptionsCount((prevCount) => prevCount + optionsPerPage)
    
    if (options.length > loadedOptionsCount) {
      const nextOptionsStartIndex = loadedOptionsCount;
      const nextOptionsEndIndex = nextOptionsStartIndex + optionsPerPage;
      let nextOptions = options.slice(nextOptionsStartIndex, nextOptionsEndIndex);
      
      const finalNextOptions: typeof nextOptions = [];
      const assetInfoPromises = nextOptions.map(async (option: any) => {
        try {
          const assetInfo = await rateLimiter(
            () => algodClient.getAssetByID(option.value).do()
          );
          finalNextOptions.push({
            value: assetInfo.params.name,
            label: (
              <>
                <span className={`inline-flex items-center rounded ${bgColor} px-2.5 py-0.5 text-sm font-medium text-black mr-3`}>
                  {option.value}
                </span>
              </>
            ),
            asset: option.value,
          });
        } catch (error: any) {
          if (error.response && error.response.data && error.response.data.message !== 'asset does not exist') {
          finalNextOptions.push({
            value: 'N/A',
            label: (
              <>
                <span className={`inline-flex items-center rounded ${bgColor} px-2.5 py-0.5 text-sm font-medium text-black mr-3`}>
                  {option.value}
                </span>
              </>
            ),
            asset: option.value,
          })
        }
        }
      })
      const batchedPromises = async () => {
        for (let i = 0; i < assetInfoPromises.length; i += 40) {
          const batch = assetInfoPromises.slice(i, i + 40)
          await Promise.all(batch)
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }
      }
      
      await batchedPromises()
      
      setVisibleOptions(finalNextOptions)
      setCanLoadMore(options.length > nextOptionsEndIndex)
    } else {
      setVisibleOptions(options)
      setCanLoadMore(false)
    }
  }, [options, loadedOptionsCount, bgColor])

  useEffect(() => {
    if (visibleOptions.length === 0 && options.length > 1 && loadedOptionsCount === 0) {
      loadMoreOptions()
    }
  }, [visibleOptions, options, loadedOptionsCount, loadMoreOptions])

  useEffect(() => {
    setVisibleOptions([])
    setLoadedOptionsCount(0)
  }, [activeAddress])

  
  const [selected, setSelected] = useState(options[0])

  async function handleSelectChange(value: any) {
    setSelected(value)
    setAssetID(value.asset)
    if (value.asset !== 0) {
      const assetInfo = await rateLimiter(
        () => algodClient.getAssetByID(value.asset).do()
      );
      const decimals = assetInfo.params.decimals
      setDecimals(decimals)
      try {
        const assets = accountInfo?.assets || []
        let assetAmount = 0

        for (const asset of assets) {
          if (asset['asset-id'] === value.asset) {
            assetAmount = asset.amount / (10 ** decimals)
            break
          }
        }
        setTokenBal(assetAmount)
      } catch (error) {
        console.error('Error fetching asset balance:', error)
      }
    }
  }

  if (!activeAddress) {
    return null
  }

  return (
    <>
        <Tooltip py={1} px={2} borderWidth='1px' borderRadius='lg' arrowShadowColor={buttonText5} borderColor={buttonText5} bgColor='black' textColor={buttonText4} fontSize='12px' fontFamily='Orbitron' textAlign='center' hasArrow label={'Create Thriftling'} aria-label='Tooltip'>
          <div><IconGlowButton2 icon={TbReportMoney} onClick={onOpen} /></div>
        </Tooltip>
        <Modal scrollBehavior={'outside'} size='xl' isCentered isOpen={isOpen} onClose={onClose}>
            <ModalOverlay backdropFilter='blur(10px)'/>
            <ModalContent m='auto' alignItems='center' bgColor='black' borderWidth='1.5px' borderColor={buttonText3} borderRadius='2xl'>
                <ModalHeader className={gradientText} textAlign='center' fontSize='20px' fontWeight='bold'>Create Thriftling</ModalHeader>
                <ModalBody>
                
                    <label
                        htmlFor="thriftling"
                        className="block text-sm whitespace-nowrap font-medium"
                    >
                        <Text textColor={lightColor}>Donation</Text>
                    </label>
                    <div className="mt-1 sm:col-span-4 pl-4">
                        <SelectMenu
                        selected={selected}
                        setSelected={(selected) => handleSelectChange(selected)}>
                        {visibleOptions.map((option: any, index: any) => (
                            <Listbox.Option
                            key={index}
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
                        {canLoadMore && (
                            <button
                            onClick={loadMoreOptions}
                            className={`${textColor} ${hoverBgColor} text-center w-full cursor-pointer select-none relative px-4 py-2`}
                            >
                            Load More...
                            </button>
                        )}
                        </SelectMenu>
                    </div>
                
                    <label htmlFor="amount" className="block text-sm whitespace-nowrap font-medium pt-4 pb-2">
                        <Text textColor={lightColor}>Price</Text>
                    </label>
                    <div className="flex rounded-md shadow-sm max-w-md pl-4">
                        <Input
                        type="text"
                        name="amount"
                        id="amount"
                        borderRightRadius={'0px'}
                        _hover={{ bgColor: 'black' }}
                        _focus={{ borderColor: medColor }}
                        textColor={xLightColor}
                        borderColor={medColor}
                        className={`block w-full rounded-none rounded-l-md bg-black sm:text-sm`}
                        value={price}
                        onChange={handleAmountChange}
                        placeholder="0.000"
                        />
                        <Button
                        _hover={{ bgColor: 'black', textColor: medColor }}
                        bgColor="black"
                        textColor={xLightColor}
                        borderWidth={1}
                        borderLeftRadius={'0px'}
                        borderColor={medColor}
                        type="button"
                        className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md px-4 py-2"
                        onClick={() => setPrice('')}
                        >
                        Clear
                        </Button>
                    </div>
                    {parseFloat(price) > 10 || parseFloat(price) < 0.1 ?
                        <Center my={8}><Text fontSize='23px' textColor={'red'}>Min 0.1A | Max 10A</Text></Center>
                    : 
                        <Center my={8}>
                            <FullGlowButton text="THRIFT!" onClick={handleSubmit}
                                disabled={
                                    loading ||
                                    tokenBal < 1 ||
                                    price === '' ||
                                    parseFloat(price) < 0.1 ||
                                    parseFloat(price) > 10 ||
                                    !hasSufficientBalance
                                } />
                        </Center>
                    }
                </ModalBody>
            </ModalContent>
        </Modal>
        </>
  )
}