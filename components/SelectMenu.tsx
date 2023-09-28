import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { Fragment, ReactNode } from 'react'
import { Box, useColorMode } from '@chakra-ui/react'

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
  const baseColor = colorMode === 'light' ? 'orange' : 'cyan'
  const lightColor = colorMode === 'light' ? 'orange-100' : 'cyan-50'
  const borderColor = colorMode === 'light' ? 'orange.500' : 'cyan.500'
  const renderOptions = () => {
    if (children) {
      return children
    }
    return options.map((option) => (
      <Listbox.Option key={option.value} value={option} />
    ))
  }

  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          <Box borderColor={borderColor} borderWidth='1.5px' className={`rounded-lg relative text-black mt-4`}>
            <Listbox.Button className={`relative w-full cursor-pointer rounded-md border-${baseColor} bg-${lightColor} py-2 pl-3 pr-10 text-left shadow-sm focus:border-${baseColor} focus:outline-none focus:ring-1 focus:ring-${baseColor} sm:text-sm`}>
              <span className={`block truncate`}>{selected.label}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon fill={'black'} className="h-5 w-5" aria-hidden="true" />
              </span>
            </Listbox.Button>
            <Transition show={open} as={Fragment} enter="transition ease-in duration-125" enterTo="opacity-100" enterFrom="opacity-0" leave="transition ease-in duration-125" leaveFrom="opacity-100" leaveTo="opacity-0">
              <Listbox.Options className={`absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-${lightColor} py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm`}>
                {renderOptions()}
              </Listbox.Options>
            </Transition>
          </Box>
        </>
      )}
    </Listbox>
  )
}