import { ExclamationCircleIcon } from '@heroicons/react/20/solid'
import { useWallet } from '@txnlab/use-wallet'
import algosdk from 'algosdk'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import useWalletBalance from 'hooks/useWalletBalance'
import { convertAlgosToMicroalgos } from 'utils'
import algodClient from 'lib/algodClient'
import { Box, useColorMode, useColorModeValue, Text, Input, Button, Center } from '@chakra-ui/react'
import styles from '../styles/glow.module.css'
import { classNames } from 'utils'
import { Listbox } from '@headlessui/react'
import SelectMenu from 'components/SelectMenu'
import { FullGlowButton } from './Buttons'

export default function AssetDestroy() {
  const { activeAddress, signTransactions, sendTransactions } = useWallet()
  const [assetID, setAssetID] = useState<number>(0)
  const { colorMode } = useColorMode();
  const boxGlow = useColorModeValue(styles.boxGlowL, styles.boxGlowD)  
  const xLightColor = useColorModeValue('orange.100','cyan.100')
  const lightColor = useColorModeValue('orange.300','cyan.300')
  const medColor = useColorModeValue('orange.500','cyan.500')
  const bgColor = colorMode === "light" ? "bg-orange-400" : "bg-cyan-500";
  const hoverBgColor = colorMode === "light" ? "hover:bg-orange-400" : "hover:bg-cyan-500";
  const textColor = colorMode === "light" ? "text-orange-900" : "text-cyan-900";

  const { accountInfo, createdAssets } = useWalletBalance()

  const sendAssetDestroy = async () => {
    try {
      if (!activeAddress) {
        throw new Error('Wallet Not Connected!')
      }

      const from = activeAddress
      const assetIndex = assetID
      const suggestedParams = await algodClient.getTransactionParams().do()
      const transaction = algosdk.makeAssetDestroyTxnWithSuggestedParamsFromObject({
        from,
        assetIndex,
        suggestedParams,
      })

      const encodedTransaction = algosdk.encodeUnsignedTransaction(transaction)

      toast.loading('Awaiting Signature...', { id: 'txn', duration: Infinity })

      const signedTransactions = await signTransactions([encodedTransaction])

      toast.loading('Destroying Asset...', { id: 'txn', duration: Infinity })

      const waitRoundsToConfirm = 4

      const { id } = await sendTransactions(signedTransactions, waitRoundsToConfirm)

      toast.success('Asset Successfully Destroyed!', {
        id: 'txn',
        duration: 5000
      })
    } catch (error) {
      console.error(error)
      toast.error('Oops! Asset Destruction Failed!', { id: 'txn' })
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    sendAssetDestroy()
  }

  const options = [
    {
      value: '',
      label: (
        <>
          <span className={`inline-flex items-center rounded ${bgColor} px-2.5 py-0.5 text-sm font-medium text-black mr-3`}>
            Select Asset To Destroy
          </span>
        </>
      ),
      asset: 0,
    },
    ...(createdAssets ? createdAssets.map((asset: any) => ({
      value: asset['index'],
      label: (
        <>
          <span className={`inline-flex items-center rounded ${bgColor} px-2.5 py-0.5 text-sm font-medium text-black mr-3`}>
            {asset['index']}
          </span>
        </>
      ),
      asset
    })) : [])
  ]
  
  const optionsPerPage = 200
  const [visibleOptions, setVisibleOptions] = useState(options.slice(0, optionsPerPage));
  const [canLoadMore, setCanLoadMore] = useState(options.length > optionsPerPage);
  const [loadedOptionsCount, setLoadedOptionsCount] = useState(0)
  const [filterText, setFilterText] = useState('')

  const handleFilterChange = (e: any) => {
    setFilterText(e.target.value);
  };

  useEffect(() => {
    if (options.length > loadedOptionsCount) {
      const nextOptionsStartIndex = loadedOptionsCount;
      const nextOptionsEndIndex = nextOptionsStartIndex + optionsPerPage;
      let nextOptions = options.slice(nextOptionsStartIndex, nextOptionsEndIndex);

      if (filterText.trim() !== '') {
        nextOptions = nextOptions.filter((option) =>
          option.value.toString().includes(filterText)
        );
      }

      setVisibleOptions(nextOptions);
      setCanLoadMore(options.length > nextOptionsEndIndex);
    } else {
      let nextOptions = options;
      
      if (filterText.trim() !== '') {
        nextOptions = nextOptions.filter((option) =>
          option.value.toString().includes(filterText)
        );
      }

      setVisibleOptions(nextOptions);
      setCanLoadMore(false);
    }
  }, [options, loadedOptionsCount, filterText])
  


    const loadMoreOptions = () => {
    const currentVisibleCount = visibleOptions.length;
    const nextOptions = options.slice(currentVisibleCount, currentVisibleCount + optionsPerPage);
    setVisibleOptions(nextOptions)
    setCanLoadMore(currentVisibleCount + optionsPerPage < options.length)
    setLoadedOptionsCount((prevCount) => prevCount + optionsPerPage)
    };
 

  const [selected, setSelected] = useState(options[0])

  async function handleSelectChange(value: any) {
    setSelected(value)
    if (value.value !== ''){
        setAssetID(value.value)
    }
    else {
        setAssetID(0)
    }
    }

  if (!activeAddress) {
    return null
  }
  
  return (
    <Box className={boxGlow} m='20px' minW='275px' maxW='420px' bg="black" borderRadius="20px">
      <div className="pt-5 sm:px-6 flex justify-center items-center">
        <Text className='hFont' textColor={medColor}>Destroy Asset</Text>
      </div>
      <>
      <div className="mx-5 pb-1 pt-3">
      <Input
        type="text"
        name="filter"
        id="filter"
        _hover={{bgColor: 'black'}}
        _focus={{borderColor: medColor}}
        textColor={xLightColor}
        borderColor={medColor}
        className={`block w-full rounded-none rounded-l-md bg-black sm:text-sm`}
        value={filterText}
        onChange={handleFilterChange}
        placeholder="Filter by Asset ID"
        />
      <SelectMenu selected={selected} setSelected={(selected) => handleSelectChange(selected)}>
        {options.length > 0 ?
        <>
        {visibleOptions.map((option) => (
          <Listbox.Option key={option.value} className={({ active }) => classNames(
            active ? `text-white ${bgColor}` : 'text-black',
            `relative cursor-pointer select-none py-2 pl-3 pr-10`
          )
        }
        value={option}>
                <span className="text-sm">{option.label}</span>
                  <span className='text-sm pl-2'>
                    {option.value}
                  </span>
          </Listbox.Option>
        ))}
        </>
        : null}
        {canLoadMore && (
        <button onClick={loadMoreOptions} className={`${textColor} ${hoverBgColor} text-center w-full cursor-pointer select-none relative px-4 py-2`}>
            Load More...
        </button>
        )}
      </SelectMenu>
      </div>
      </>
      <div className="pt-5 pb-8 sm:p-0 lg:flex lg:flex-col lg:flex-1">
        <form onSubmit={handleSubmit} className="lg:flex lg:flex-col lg:flex-1">
          <div className="sm:py-5 sm:px-6 lg:flex lg:flex-col lg:flex-1 lg:justify-center">
            <Center>
              <FullGlowButton text='Destroy!' onClick={handleSubmit} disabled={assetID === 0 ? true : false}/>
            </Center>
            {assetID !== 0 ?
            <div className="pt-3 text-center sm:col-span-4 sm:mt-0">
                <Text textColor={'red'}>*WARNING*<br />This will DESTROY the asset from the blockchain permanently!</Text>
            </div> : null}
          </div>
        </form>
      </div>
    </Box>
  )
}
