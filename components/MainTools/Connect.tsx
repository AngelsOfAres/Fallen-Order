import { Provider, PROVIDER_ID, useWallet } from '@txnlab/use-wallet'
import { Box, Button, useColorModeValue, Text, VStack, Image, useColorMode, HStack } from '@chakra-ui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { Listbox,Transition } from '@headlessui/react'
import { MdNotInterested } from "react-icons/md"
import { Fragment } from 'react'
import { classNames } from 'utils'
import styles2 from '../../styles/glow.module.css'

export default function Connect() {
  const { providers, activeAccount } = useWallet()
  const { colorMode } = useColorMode();
  const gradientText = useColorModeValue(styles2.textAnimatedGlowL, styles2.textAnimatedGlowD)
  const boxGlow = useColorModeValue(styles2.boxGlowL, styles2.boxGlowD)
  const text100 = useColorModeValue('orange.100', 'cyan.100')
  const text400 = useColorModeValue('orange.400', 'cyan.400')

  const menuBG = colorMode === "light" ? "bg-orange-400" : "bg-cyan-500"
  const textColor = colorMode === "light" ? "text-orange-400" : "text-cyan-500"
  const borderBaseColor = colorMode === 'light' ? 'border-orange-300' : 'border-cyan-300'
  const ringBaseColor = colorMode === 'light' ? 'ring-orange-300' : 'ring-cyan-300'
  const bgColor = colorMode === 'light' ? 'bg-orange-100' : 'bg-cyan-50'
  const borderColor = colorMode === 'light' ? 'orange.500' : 'cyan.500'

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
            <span>{activeAccount?.address.substring(0, 5) + "..." + activeAccount?.address.substring(activeAccount.address.length - 5)}</span>
          </>
        ),
        account
      }))

      const selected = options.find((option) => option.value === activeAccount.address) || options[0]
        return (
          <Listbox value={selected} onChange={(selected) => provider.setActiveAccount(selected.value)}>
            {({ open }) => (
              <>
                <Box borderColor={borderColor} borderWidth='1.5px' className={`rounded-lg relative text-black mt-4`}>
                  <Listbox.Button className={`relative w-full cursor-pointer rounded-md ${borderBaseColor} ${bgColor} py-2 pl-3 pr-10 text-left shadow-sm focus:${borderBaseColor} focus:outline-none focus:ring-1 focus:${ringBaseColor} sm:text-sm`}>
                    <span className={`block truncate`}>{selected.label}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon fill={'black'} className="h-5 w-5" aria-hidden="true" />
                    </span>
                  </Listbox.Button>
                  <Transition show={open} as={Fragment} enter="transition ease-in duration-125" enterTo="opacity-100" enterFrom="opacity-0" leave="transition ease-in duration-125" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <Listbox.Options className={`absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md ${bgColor} py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm`}>
            {options.map((option) => (
              <Listbox.Option key={option.value} className={({ active }) => classNames(
                    active ? `text-white ${menuBG}` : 'text-black',
                    `relative cursor-pointer select-none py-2 pl-3 pr-10`
                  )
                }
                value={option}>
                {({ selected, active }) => (
                  <>
                    <span className={classNames(
                        selected ? 'font-semibold' : 'font-normal',
                        'block truncate'
                      )}>
                      <span className="text-sm">{option.account.address.substring(0, 5) + "..." + option.account.address.substring(option.account.address.length - 5)}</span>
                    </span>
                    {selected ? (
                      <span className={classNames(
                          active ? 'text-black' : `${textColor}`,
                          'absolute inset-y-0 right-0 flex items-center pr-3'
                        )}>
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
            </Listbox.Options>
          </Transition>
        </Box>
      </>
    )}
  </Listbox>
        )
      }
  }

  const renderCard = (provider: Provider) => {
    return (
        <Box w='100%' key={provider.metadata.id} p={8}>
            <Button mb={4} type="button" bgColor='black' _hover={{bgColor: 'black'}} onClick={provider.isConnected ? provider.disconnect : provider.connect}>
                <Image width='50px' height='50px' borderRadius='10px' src={provider.metadata.icon} alt={provider.metadata.name} />
                <Text mx={8} fontSize="20px" textColor={text100} _hover={{textColor: text400}}>
                  {provider.metadata.name}
                </Text>
                {provider.isConnected ? 
                  <MdNotInterested color='red' size={32}/> : null}
            </Button>
          {renderActiveAccount(provider)}
        </Box>
    )
  }

  return (
    <Box className={boxGlow} bg="black" borderRadius="20px">
      <VStack>
        <dl className={`sm:divide-y`}>
        {providers?.map(renderCard)}
        </dl>
      </VStack>
    </Box>
  )
}
