import { useQuery } from '@tanstack/react-query'
import { useWallet } from '@txnlab/use-wallet'
import { useEffect, useState } from 'react'
import algodClient from 'lib/algodClient'
import { formatAssetBalance } from 'utils'

export default function useWalletBalance() {
  const [walletBalance, setWalletBalance] = useState<string | null>(null)
  const [walletAvailableBalance, setWalletAvailableBalance] = useState<string | null>(null)
  const [assetList, setAssetList] = useState<any | null>(null)
  const [createdAssets, setCreatedAssets] = useState<any | null>(null)
  const [expBal, setExpBal] = useState<any>(-1)

  const { activeAccount } = useWallet()

  const getAccountInfo = async () => {
    if (!activeAccount) throw new Error('No selected account.')
    const accountInfo = await algodClient.accountInformation(activeAccount.address).do()
    try {
    const exp_balance = await algodClient.accountAssetInformation(activeAccount.address, 811721471).do()
    setExpBal(formatAssetBalance(exp_balance['asset-holding']['amount'], 0, true, true, 6))
    } catch (error) {
      console.error('Error:', error)
    }

    return accountInfo
  }

  const { data: accountInfo } = useQuery(['balance', activeAccount?.address], getAccountInfo, {
    enabled: !!activeAccount?.address,
    refetchInterval: 30000
  })

  useEffect(() => {
    if (accountInfo && accountInfo.amount !== undefined && accountInfo['min-balance'] !== undefined) {
      const balance = formatAssetBalance(accountInfo.amount, 6, true, true, 8)
      const availableBalance = formatAssetBalance(accountInfo.amount - accountInfo['min-balance'], 6, true, true, 8)
      const assets = accountInfo.assets
      assets.reverse()
      const created = accountInfo['created-assets']
      created.reverse()
      setAssetList(assets)
      setCreatedAssets(created)
      setWalletBalance(balance)
      setWalletAvailableBalance(availableBalance)
    } else {
      setAssetList([])
      setCreatedAssets([])
      setWalletBalance('0.000')
      setWalletAvailableBalance('0.000')
    }
  }, [accountInfo, assetList, createdAssets, walletBalance, walletAvailableBalance, expBal])

  return {
    accountInfo,
    assetList,
    createdAssets,
    walletBalance,
    walletAvailableBalance,
    expBal
  }
}