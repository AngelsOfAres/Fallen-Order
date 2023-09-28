import { Provider, PROVIDER_ID, useWallet } from '@txnlab/use-wallet'
import { Box, Button, useColorModeValue, Text, VStack, Image, HStack, useColorMode } from '@chakra-ui/react'
import { CheckIcon, BoltIcon } from '@heroicons/react/20/solid'
import { useMemo } from 'react'
import { Listbox } from '@headlessui/react'
import { MdNotInterested } from "react-icons/md"
import SelectMenu from 'components/SelectMenu'
import { classNames } from 'utils'
import styles from "../styles/text.module.css"
import styles2 from '../styles/glow.module.css'

export default function Connect() {
  const { providers, activeAccount } = useWallet()
  const { colorMode } = useColorMode();
  const gradientText = useColorModeValue(styles2.textAnimatedGlowL, styles2.textAnimatedGlowD)
  const boxGlow = useColorModeValue(styles2.boxGlowL, styles2.boxGlowD)
  const text100 = useColorModeValue('orange.100', 'cyan.100')
  const text400 = useColorModeValue('orange.400', 'cyan.400')
  const lightColor = "orange-100"
  const darkColor = "cyan-50"
  const lightColor2 = "orange-400"
  const darkColor2 = "cyan-500"

  const colorModeLight = colorMode === "light" ? lightColor : darkColor;
  const colorModeLight2 = colorMode === "light" ? lightColor2 : darkColor2;
  const colorModeLightPlain = colorMode === "light" ? "orange" : "cyan";

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
          <SelectMenu selected={selected} setSelected={(selected) => provider.setActiveAccount(selected.value)}>
            {options.map((option) => (
              <Listbox.Option key={option.value} className={({ active }) => classNames(
                    active ? `text-white bg-${colorModeLight2}` : 'text-black',
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
                          active ? 'text-black' : `text-${colorModeLight2}`,
                          'absolute inset-y-0 right-0 flex items-center pr-3'
                        )}>
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </SelectMenu>
        )
      }
  }

  const renderCard = (provider: Provider) => {
    return (
        <Box w='100%' key={provider.metadata.id} p={8}>
            <Button type="button" bgColor='black' _hover={{bgColor: 'black'}} onClick={provider.isConnected ? provider.disconnect : provider.connect}>
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
