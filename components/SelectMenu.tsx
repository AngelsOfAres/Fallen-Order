import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { Fragment, ReactNode } from 'react'
import { Box, HStack, useColorMode } from '@chakra-ui/react'

interface SelectMenuOption {
  value: string
  label: string | ReactNode
}

interface SelectMenuInterface<T extends SelectMenuOption> {
  label?: string
  selected: T
  setSelected: (selected: T) => void
}

type SelectMenuProps<T extends SelectMenuOption> = (
  | {
      options: Array<T>
      children?: never
    }
  | {
      options?: never
      children: ReactNode
    }
) &
  SelectMenuInterface<T>

export default function SelectMenu<T extends SelectMenuOption>({
  label,
  options = [],
  selected,
  setSelected,
  children
}: SelectMenuProps<T>) {
  const { colorMode } = useColorMode()
  const borderBaseColor = colorMode === 'light' ? 'border-orange-300' : 'border-cyan-300'
  const ringBaseColor = colorMode === 'light' ? 'ring-orange-300' : 'ring-cyan-300'
  const bgColor = colorMode === 'light' ? 'bg-orange-100' : 'bg-cyan-50'
  const borderColor = colorMode === 'light' ? 'orange.500' : 'cyan.500'
  const renderOptions = () => {
    if (children) {
      return children
    }
  }

  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          <Box borderColor={borderColor} borderWidth='1.5px' className={`rounded-lg relative text-black mt-4`}>
            <Listbox.Button className={`relative w-full cursor-pointer rounded-md ${borderBaseColor} ${bgColor} py-2 pl-3 pr-10 text-left shadow-sm focus:${borderBaseColor} focus:outline-none focus:ring-1 focus:${ringBaseColor} sm:text-sm`}>
              <HStack>
              <span className={`block truncate`}>{selected.label}</span>
              <span className={`inline-flex items-center rounded ${bgColor} px-2.5 py-0.5 text-sm font-medium text-black mr-3`}>
                {parseInt(selected.value) === 0 ? 'Algorand' :  selected.value}
              </span>
              </HStack>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon fill={'black'} className="h-5 w-5" aria-hidden="true" />
              </span>
            </Listbox.Button>
            <Transition show={open} as={Fragment} enter="transition ease-in duration-125" enterTo="opacity-100" enterFrom="opacity-0" leave="transition ease-in duration-125" leaveFrom="opacity-100" leaveTo="opacity-0">
              <Listbox.Options className={`absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md ${bgColor} py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm`}>
                {renderOptions()}
              </Listbox.Options>
            </Transition>
          </Box>
        </>
      )}
    </Listbox>
  )
}