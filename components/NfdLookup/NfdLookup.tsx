import { Combobox, Transition } from '@headlessui/react'
import Image from 'next/image'
import { Fragment, useMemo, useState } from 'react'
import useNfdSearch, { nfdSearchByPrefix } from './NfdLookup.hooks'
import { NfdRecordThumbnail } from './NfdLookup.types'
import Tooltip from 'components/Tooltip'
import useDebounce from 'hooks/useDebounce'
import { classNames, isValidName } from 'utils'
import { useColorMode } from "@chakra-ui/react"

interface NfdLookupProps {
  value: string
  onChange: (string: string) => void
  className?: string
  placeholder?: string
  exclude?: string | string[]
  limit?: number
  ariaDescribedby?: string
}

export default function NfdLookup({
  value,
  onChange,
  className = '',
  placeholder,
  exclude,
  limit = 10,
  ariaDescribedby
}: NfdLookupProps) {
  const { colorMode } = useColorMode()
  const bgColor1 = colorMode === "light" ? 'bg-orange-500' : 'bg-cyan-500'
  const bgColor2 = colorMode === "light" ? 'bg-orange-100' : 'bg-cyan-50'
  const borderColor = colorMode === "light" ? 'border-orange-500' : 'border-cyan-500'

  const debouncedQuery = useDebounce(value, 500)

  const trimExtension = (name: string) => {
    return name.replace(/\.\w+$|\./gm, '')
  }

  const enableQuery = useMemo(
    () =>
      trimExtension(debouncedQuery).length > 0 &&
      trimExtension(debouncedQuery).length <= 27 &&
      debouncedQuery === value &&
      debouncedQuery.match(/^[a-zA-Z0-9\.]+$/gm) !== null,
    [debouncedQuery, value]
  )

  const prefix = isValidName(debouncedQuery)
    ? debouncedQuery.toLowerCase()
    : trimExtension(debouncedQuery).toLowerCase()

  const { data, isInitialLoading, error } = useNfdSearch({
    params: {
      prefix,
      limit
    },
    options: {
      enabled: enableQuery
    }
  })

  const showOptions = enableQuery && !isInitialLoading

  const [nfdMatch, setNfdMatch] = useState<NfdRecordThumbnail | null>(null)

  const handleComboBoxChange = (value: string) => {
    const match = data?.find((nfd) => nfd.depositAccount === value)

    if (match) {
      setNfdMatch(match)
    }

    onChange(value)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (nfdMatch) {
      setNfdMatch(null)
    }

    onChange(event.target.value)
  }

  const fetchExactMatch = async (query: string) => {
    const prefix = trimExtension(query).toLowerCase()

    const results = await nfdSearchByPrefix({ prefix, limit })

    return results[0]
  }

  const handleBlur = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value

    if (!isValidName(inputValue)) {
      return
    }

    try {
      const result =
        data?.find((nfd) => nfd.name === inputValue) || (await fetchExactMatch(inputValue))

      const resultAddress = result.depositAccount

      if (!resultAddress) {
        return
      }

      if (exclude) {
        const isExcluded = Array.isArray(exclude)
          ? exclude.includes(resultAddress)
          : resultAddress === exclude

        if (isExcluded) {
          return
        }
      }

      onChange(resultAddress)
    } catch (err) {
      console.error(err)
    }
  }

  const renderOptions = () => {
    const filterData = (result: NfdRecordThumbnail) => {
      const resultAddress = result.depositAccount

      if (!resultAddress) {
        return false
      }

      if (exclude) {
        if (Array.isArray(exclude)) {
          return !exclude.includes(resultAddress)
        }

        return resultAddress !== exclude
      }

      return true
    }

    const suggestions = data?.filter(filterData) || []

    if (error) {
      return (
        <div className="cursor-default select-none relative py-2 px-4 text-gray-600">
          <span className="text-red-500">Error:</span> {error.message}
        </div>
      )
    }

    if (suggestions.length === 0) {
      return (
        <div className="cursor-default select-none relative py-2 px-4 text-gray-600">
          No matches found!
        </div>
      )
    }

    return suggestions.map((suggestion) => (
      <Combobox.Option key={suggestion.name} value={suggestion.depositAccount} as={Fragment}>
        {({ active }) => (
          <li
            onClick={() => setNfdMatch(suggestion)}
            className={classNames(
              active || suggestion.name === value
                ? `text-white ${bgColor1}`
                : `text-black ${bgColor2}`,
              'cursor-default select-none py-2 px-4 truncate'
            )}
          >            
            <span className="font-medium">{suggestion.name}</span>
            {suggestion.depositAccount && (
              <span
                className={classNames(active ? 'text-white' : 'text-black',
                  'ml-4'
                )}
              >
                {suggestion.depositAccount.substring(0, 5) + "..." + suggestion.depositAccount.substring(suggestion.depositAccount.length - 5)}
              </span>
            )}
          </li>
        )}
      </Combobox.Option>
    ))
  }

  return (
    <Combobox value={value} onChange={handleComboBoxChange}>
    <div className="relative">
          <Combobox.Input
            className={classNames(nfdMatch ? 'pr-12' : '', className)}
            onChange={handleInputChange}
            onBlur={handleBlur}
            autoComplete="new-password"
            spellCheck="false"
            placeholder={placeholder}
            aria-describedby={ariaDescribedby}
          />
          {nfdMatch && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-2.5">
              <a
                href={`https://app.nf.domains/name/${nfdMatch.name}`}
                target="_blank"
                id="nfd-badge"
                className={`relative rounded-full overflow-hidden h-7 w-7 focus:outline-none group border ${borderColor}`}
                rel="noreferrer"
              >
                <Image src="/nfd.svg" alt="NFD" width={400} height={400} />
              </a>
              <Tooltip anchorId="nfd-badge" content={nfdMatch.name} />
            </div>
          )}
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          {showOptions ? (
            <Combobox.Options className={`absolute w-full z-10 overflow-auto text-base border ${borderColor} ${bgColor2} rounded-md shadow-lg focus:outline-none sm:text-sm`}>
              {renderOptions()}
            </Combobox.Options>
          ) : (
            <div />
          )}
        </Transition>
      </div>
    </Combobox>
  )
}
