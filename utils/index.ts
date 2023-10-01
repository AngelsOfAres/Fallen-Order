import { convertMicroalgosToAlgos } from './convert'

export * from './convert'
export * from './nfd'
import Big from 'big.js'


export type RoundingMode = 'roundDown' | 'roundUp' | 'roundHalfUp' | 'roundHalfEven'

export const convertFromBaseUnits = (
  amount: number,
  decimals = 0,
  rm: RoundingMode = 'roundDown'
) => {
  if (decimals === 0) return amount
  const divisor = new Big(10).pow(decimals)
  const baseUnits = new Big(amount).round(decimals, Big[rm])
  return baseUnits.div(divisor).toNumber()
}

export const formatWithPrecision = (num: number, precision: number) => {
  let scaledNum = num
  let suffix = ''
  if (num >= 1e12) {
    suffix = 'T'
    scaledNum = num / 1e12
  } else if (num >= 1e9) {
    suffix = 'B'
    scaledNum = num / 1e9
  } else if (num >= 1e6) {
    suffix = 'M'
    scaledNum = num / 1e6
  } else if (num >= 1e3) {
    suffix = 'K'
    scaledNum = num / 1e3
  }
  return scaledNum.toFixed(precision) + suffix
}

export const formatAssetBalance = (
  amount: number,
  decimals: number,
  baseUnits = false,
  trim = true,
  maxLength?: number
) => {
  const formatted = baseUnits
    ? convertFromBaseUnits(amount, decimals).toFixed(decimals)
    : new Big(amount).toFixed(decimals)

  const parts = formatted.split('.')

  if (trim && parts.length === 2) {
    parts[1] = parts[1].replace(/\.?0+$/, '')
  }

  if (maxLength && parts.join('.').length > maxLength) {
    return formatWithPrecision(parseFloat(formatted), 3)
  }

  // Format number with commas, but don't affect decimal places
  parts[0] = new Intl.NumberFormat().format(parseFloat(parts[0]))

  if (parts[1] === '') {
    return parts[0]
  }

  return parts.join('.')
}

export const classNames = (...classes: Array<string>) => {
  return classes.filter(Boolean).join(' ')
}

export const formatNumber = (number: number, options?: Intl.NumberFormatOptions | undefined) => {
  return new Intl.NumberFormat(undefined, options).format(number)
}

export const formatPrice = (
  price: number,
  isAlgos?: boolean,
  options?: Intl.NumberFormatOptions | undefined
) => {
  const algos = isAlgos ? price : convertMicroalgosToAlgos(price)
  return new Intl.NumberFormat(undefined, options).format(algos)
}

type TruncateAddressOptions = {
  startChars?: number
  endChars?: number
}

export const truncateAddress = (addr: string | undefined, options: TruncateAddressOptions = {}) => {
  if (!addr) {
    return ''
  }

  const { startChars = 6, endChars = 4 } = options

  const start = addr.slice(0, startChars)
  const end = addr.slice(addr.length - endChars)

  return `${start}...${end}`
}
