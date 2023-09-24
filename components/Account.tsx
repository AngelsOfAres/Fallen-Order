import { ArrowTopRightOnSquareIcon, ClipboardIcon } from '@heroicons/react/20/solid'
import { useWallet } from '@txnlab/use-wallet'
import Image from 'next/image'
import Tooltip from 'components/Tooltip'
import useWalletBalance from 'hooks/useWalletBalance'
import { copyToClipboard } from 'utils/clipboard'
import { Box, HStack } from '@chakra-ui/react'

export default function Account() {
  const { activeAccount, providers } = useWallet()
  const shortaddress = activeAccount?.address.substring(0, 5) + "..." + activeAccount?.address.substring(activeAccount.address.length - 5)

  const { walletBalance, walletAvailableBalance } = useWalletBalance()
  console.log(walletBalance, walletAvailableBalance)
  
  const roundedBalance = walletBalance !== null ? parseFloat(walletBalance).toFixed(3) : '';
  const roundedAvBalance = walletAvailableBalance !== null ? parseFloat(walletAvailableBalance).toFixed(3) : '';

  const activeProvider = providers?.find(
    (provider) => provider.metadata.id === activeAccount?.providerId
  )

  if (!activeAccount) {
    return null
  }

  return (
    
      <Box
        m={6}
        w='400px'
        bg="black"
        borderRadius="8px"
        boxShadow="0 0 1px 1px rgba(255, 179, 0, 0.5) inset, 0 0 10px 5px rgba(255, 179, 0, 0.5)"
        transition="box-shadow 0.3s ease-in-out"
        _hover={{
          boxShadow: '0 0 2px 2px rgba(255, 179, 0, 0.8) inset, 0 0 20px 10px rgba(255, 179, 0, 0.8)',
        }}
      >
      <div className="p-5 sm:px-6">
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
                  {activeProvider.metadata.name}
                </>
              )}
              <h3 className="text-lg font-medium leading-6 text-white">Active Account</h3>
        </HStack>
      </div>
      <div className="border-t border-gray-500 px-5 py-2 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-500">
          <div className="py-3 sm:grid sm:grid-cols-5 sm:gap-4 sm:py-5 sm:px-6">
            <dt className="inline-flex items-center text-sm font-medium text-white">Name</dt>
            <dd className="text-white sm:col-span-4 truncate">{activeAccount.name}</dd>
          </div>
          <div className="py-3 sm:grid sm:grid-cols-5 sm:gap-4 sm:py-5 sm:px-6">
            <dt className="inline-flex items-center text-sm font-medium text-white">Address</dt>
            <dd className="text-white sm:col-span-4 flex items-center min-w-0">
              <span className="truncate">{shortaddress}</span>
              <div className="flex items-center flex-nowrap -my-1">
                <div className="inline-flex -space-x-px rounded-md shadow-sm ml-3 sm:ml-4">
                  <a
                    href={`https://algoexplorer.io/address/${activeAccount.address}`}
                    className="relative inline-flex items-center first:rounded-l-md last:rounded-r-md border border-gray-500 bg-black px-3.5 py-2.5 sm:px-2.5 sm:py-2 text-sm font-medium text-white hover:text-black hover:bg-gray-300 focus:z-20 outline-brand-500"
                    target="_blank"
                    rel="noreferrer"
                    id="view-on-algoexplorer"
                    data-tooltip-content="View on AlgoExplorer"
                  >
                    <span className="sr-only">View on AlgoExplorer</span>
                    <ArrowTopRightOnSquareIcon className="h-5 w-5" aria-hidden="true" />
                  </a>
                  <button
                    type="button"
                    className="relative inline-flex items-center first:rounded-l-md last:rounded-r-md border border-gray-500 bg-black px-3.5 py-2.5 sm:px-2.5 sm:py-2 text-sm font-medium text-white hover:text-black hover:bg-gray-300 focus:z-20 outline-brand-500"
                    data-clipboard-text={activeAccount.address}
                    data-clipboard-message="Address copied to clipboard"
                    onClick={copyToClipboard}
                    id="copy-address"
                    data-tooltip-content="Copy address"
                  >
                    <span className="sr-only">Copy address</span>
                    <ClipboardIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
              <Tooltip anchorId="view-on-algoexplorer" />
              <Tooltip anchorId="copy-address" />
            </dd>
          </div>
          <div className="py-3 sm:grid sm:grid-cols-5 sm:gap-4 sm:py-5 sm:px-6">
            <dt className="inline-flex items-center text-sm font-medium text-white">Balance</dt>
            <HStack className="inline-flex items-center text-white sm:col-span-4 truncate">
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
