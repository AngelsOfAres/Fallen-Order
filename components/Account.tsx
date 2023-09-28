import { ArrowTopRightOnSquareIcon, ClipboardIcon } from '@heroicons/react/20/solid'
import { useWallet } from '@txnlab/use-wallet'
import Image from 'next/image'
import Tooltip from 'components/Tooltip'
import useWalletBalance from 'hooks/useWalletBalance'
import { copyToClipboard } from 'utils/clipboard'
import { Box, HStack, Text, useColorModeValue, useColorMode } from '@chakra-ui/react'
import styles from '../styles/glow.module.css'

export default function Account() {
  const { colorMode } = useColorMode()
  const { activeAccount, providers } = useWallet()
  const shortaddress = activeAccount?.address.substring(0, 5) + "..." + activeAccount?.address.substring(activeAccount.address.length - 5)

  const { walletBalance, walletAvailableBalance } = useWalletBalance()
  
  const roundedBalance = walletBalance !== null ? parseFloat(walletBalance).toFixed(3) : ''
  const roundedAvBalance = walletAvailableBalance !== null ? parseFloat(walletAvailableBalance).toFixed(3) : ''
  const boxGlow = useColorModeValue(styles.boxGlowL, styles.boxGlowD)
  const lightColor = useColorModeValue('orange.300','cyan.300')
  const borderColor = colorMode === "light" ? "border-orange-200" : "border-cyan-200"
  const bgColor = colorMode === "light" ? "bg-orange-200" : "bg-cyan-200"
  const textColor = colorMode === "light" ? "text-orange-200" : "text-cyan-200"
  const hoverBgColor = colorMode === "light" ? "hover:bg-orange-200" : "hover:bg-cyan-200"

  const activeProvider = providers?.find(
    (provider) => provider.metadata.id === activeAccount?.providerId
  )

  if (!activeAccount) {
    return null
  }

  return (
      <Box
        className={boxGlow}
        m='20px'
        minW='275px'
        maxW='420px'
        bg="black"
        borderRadius="20px"
      >
      <div className="p-5 sm:px-6 flex justify-center items-center">
        <HStack>
              {activeProvider && (
                <>
                  <Image
                    width={40}
                    height={40}
                    alt={activeProvider.metadata.name}
                    src={activeProvider.metadata.icon}
                    className="h-8 w-8 mr-3 my-1 sm:-my-2 flex-shrink-0 rounded-full bg-white"
                  />
                </>
              )}
              <Text className='hFont' textColor={lightColor}>Active Account</Text>
        </HStack>
      </div>
      <div className="px-5 py-2 sm:p-0">
        <dl>
          <div className="py-3 sm:grid sm:grid-cols-5 sm:gap-4 sm:py-5 sm:px-6">
            <dt className="inline-flex items-center text-sm"><Text textColor={lightColor}>Name</Text></dt>
            <dd className="text-white sm:col-span-4 pl-6 truncate">{activeAccount.name}</dd>
          </div>
          <div className="py-3 sm:grid sm:grid-cols-5 sm:gap-4 sm:py-5 sm:px-6">
            <dt className="inline-flex items-center text-sm"><Text textColor={lightColor}>Address</Text></dt>
            <dd className="text-white sm:col-span-4 pl-6 flex items-center min-w-0">
              <span className="truncate">{shortaddress}</span>
              <div className="flex items-center flex-nowrap -my-1">
                <div className="inline-flex -space-x-px rounded-md shadow-sm ml-3 sm:ml-4">
                  <a
                    href={`https://algoexplorer.io/address/${activeAccount.address}`}
                    className={`relative inline-flex items-center first:rounded-l-md last:rounded-r-md border ${borderColor} bg-black px-3.5 py-2.5 sm:px-2.5 sm:py-2 text-sm font-medium ${textColor} hover:text-black ${hoverBgColor} focus:z-20`}
                    target="_blank"
                    rel="noreferrer"
                    id="view-on-algoexplorer"
                    data-tooltip-content="AlgoExplorer"
                  >
                    <ArrowTopRightOnSquareIcon className="h-5 w-5" aria-hidden="true" />
                  </a>
                  <button
                    type="button"
                    className={`relative inline-flex items-center first:rounded-l-md last:rounded-r-md border ${borderColor} bg-black px-3.5 py-2.5 sm:px-2.5 sm:py-2 text-sm font-medium ${textColor} hover:text-black ${hoverBgColor} focus:z-20`}
                    data-clipboard-text={activeAccount.address}
                    data-clipboard-message="Address Copied!"
                    onClick={copyToClipboard}
                    id="copy-address"
                    data-tooltip-content="Copy Address"
                  >
                    <ClipboardIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
              <Tooltip anchorId="view-on-algoexplorer" />
              <Tooltip anchorId="copy-address" />
            </dd>
          </div>
          <div className="py-3 sm:grid sm:grid-cols-5 sm:gap-4 sm:py-5 sm:px-6">
            <dt className="inline-flex items-center text-sm"><Text textColor={lightColor}>Balance</Text></dt>
            <HStack className="inline-flex items-center pl-6 text-white sm:col-span-4 truncate">
              <strong id='max-balance' data-tooltip-content="Available Balance" className="block font-semibold">{roundedAvBalance}A</strong>
              {walletAvailableBalance !== walletBalance && (
                <>
                  <span id="available-balance" data-tooltip-content="Total Balance" className="block text-gray-400">
                    ({roundedBalance}A)
                  </span>
                  <Tooltip anchorId="available-balance" />
                  <Tooltip anchorId="max-balance" />
                </>
              )}
            </HStack>
          </div>
        </dl>
      </div>
    </Box>
  )
}
