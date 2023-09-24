import { Provider, PROVIDER_ID, useWallet } from '@txnlab/use-wallet'
import { Box, Button, Flex, Text, VStack, Image, HStack, StylesProvider } from '@chakra-ui/react'
import { CheckIcon, BoltIcon, SignalSlashIcon, SignalIcon } from '@heroicons/react/20/solid'
import { useMemo } from 'react'
import { Listbox } from '@headlessui/react'
import { MdNotInterested } from "react-icons/md"
import SelectMenu from 'components/SelectMenu'
import { classNames } from 'utils'
import styles from "../styles/text.module.css"

export default function Connect() {
  const { providers, activeAccount } = useWallet()

  const showSetActiveButtons = useMemo(() => {
    if (!providers) return false

    const areMultipleConnected = providers?.filter((provider) => provider.isConnected).length > 1
    const areNoneActive = !Object.values(providers).some((provider) => provider.isActive)

    return areMultipleConnected || areNoneActive
  }, [providers])

  const renderActions = (provider: Provider) => {
    const showSetActiveButton = showSetActiveButtons && provider.isConnected

    return (
      <div className="-mt-px flex divide-x divide-gray-200">
        {showSetActiveButton && (
          <div className="-ml-px flex w-0 flex-1">
            <button
              type="button"
              onClick={provider.setActiveProvider}
              className="relative inline-flex w-0 flex-1 items-center justify-center rounded-br-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500 disabled:opacity-50 disabled:text-gray-700 group"
              disabled={provider.isActive}
            >
              <BoltIcon
                className="h-5 w-5 text-yellow-400 group-disabled:text-gray-300"
                aria-hidden="true"
              />
              <span className="ml-3">Set Active</span>
            </button>
          </div>
        )}
      </div>
    )
  }

  const renderActiveAccount = (provider: Provider) => {
    if (
      !provider.isActive ||
      !activeAccount ||
      !provider.accounts.find((acct) => acct.address === activeAccount.address)
    ) {
      return null
    }

    if (provider.accounts.length > 1) {
      const options = provider.accounts.map((account) => ({
        value: account.address,
        label: (
          <>
            <span className="inline-flex items-center rounded bg-orange-400 px-2.5 py-0.5 text-sm font-medium text-black mr-3">
              {account.name}
            </span>
            <span className="text-sm">{activeAccount?.address.substring(0, 5) + "..." + activeAccount?.address.substring(activeAccount.address.length - 5)}</span>
          </>
        ),
        account
      }))

      const selected = options.find((option) => option.value === activeAccount.address) || options[0]
        return (
          <SelectMenu
            selected={selected}
            setSelected={(selected) => provider.setActiveAccount(selected.value)}
          >
            {options.map((option) => (
              <Listbox.Option
                key={option.value}
                className={({ active }) =>
                  classNames(
                    active ? 'text-black bg-orange-400' : 'text-black',
                    'relative cursor-default select-none py-2 pl-3 pr-10'
                  )
                }
                value={option}
              >
                {({ selected, active }) => (
                  <>
                    <span
                      className={classNames(
                        selected ? 'font-semibold' : 'font-normal',
                        'block truncate'
                      )}
                    >
                      <span
                        className={classNames(
                          selected && active
                            ? 'bg-orange-400 text-black'
                            : selected
                            ? 'bg-orange-400 text-black'
                            : active
                            ? 'bg-orange-400 text-black'
                            : 'bg-orange.300 text-orange-500',
                          'inline-flex items-center rounded px-2.5 py-0.5 text-sm font-medium mr-3'
                        )}
                      >
                        {option.account.name}
                      </span>
                      <span className="text-sm">{option.account.address.substring(0, 5) + "..." + option.account.address.substring(option.account.address.length - 5)}</span>
                    </span>
  
                    {selected ? (
                      <span
                        className={classNames(
                          active ? 'text-white' : 'text-sky-600',
                          'absolute inset-y-0 right-0 flex items-center pr-3'
                        )}
                      >
                        <CheckIcon color='orange' className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </SelectMenu>
        )
      }
      
    const account = provider.accounts[0]
    const shortaddress = account.address.substring(0, 5) + "..." + account.address.substring(account.address.length - 5)

    if (!account) {
      return null
    }

    return (
      <div
        className={classNames(
          !provider.isActive ? 'opacity-50 pointer-events-none' : '',
          'mt-1 flex items-center w-full rounded-md border-2 border-transparent py-2 sm:text-sm'
        )}
      >
          <span className="inline-flex items-center rounded bg-orange-400 px-2.5 py-0.5 text-sm font-medium text-gray-800 mr-3">
            {account.name}
          </span>
          <span className={styles.sText}>{shortaddress}</span>
      </div>
    )
  }


  const renderCard = (provider: Provider) => {
    return (
        <Box w='100%' key={provider.metadata.id} p={10}>
                {provider.isConnected ? (
                  <Button
                    type="button"
                    onClick={provider.disconnect}
                  >
                    <HStack alignItems="center" justifyContent="space-between">
                      <Image
                        width='25'
                        height='25'
                        borderRadius='4px'
                        src={provider.metadata.icon}
                        alt={provider.metadata.name}
                      />
                      <Text
                        mx={8}
                        fontSize="lg"
                        color="orange"
                      >
                        {provider.metadata.name}
                      </Text>
                    </HStack>
                  <MdNotInterested color='red' size={20}/>
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={provider.connect}
                  >
                    <HStack alignItems="center" justifyContent="space-between">
                      <Image
                        width='25'
                        height='25'
                        borderRadius='4px'
                        src={provider.metadata.icon}
                        alt={provider.metadata.name}
                      />
                      <Text
                        fontSize="lg"
                        color="white"
                      >
                        {provider.metadata.name}
                      </Text>
                    </HStack>
                  </Button>
                )}
                {renderActiveAccount(provider)}
        <div>{renderActions(provider)}</div>
        </Box>
    )
  }

  return (
    <Box
      bg="black"
      borderRadius="8px"
      boxShadow="0 0 1px 1px rgba(255, 179, 0, 0.5) inset, 0 0 10px 5px rgba(255, 179, 0, 0.5)"
      transition="box-shadow 0.3s ease-in-out"
      _hover={{
        boxShadow: '0 0 2px 2px rgba(255, 179, 0, 0.8) inset, 0 0 20px 10px rgba(255, 179, 0, 0.8)'
      }}
    >
    <VStack>
      <dl className="sm:divide-y sm:divide-gray-500">
      {providers?.map(renderCard)}
      </dl>
    </VStack>
    </Box>
  )
}
