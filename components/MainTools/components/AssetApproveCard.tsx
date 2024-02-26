import * as React from 'react'
import { Box, Text, VStack, useColorModeValue, useBreakpointValue } from '@chakra-ui/react'
import styles from '../../../styles/glow.module.css'
import { IconGlowButton } from 'components/Buttons'
import { useState } from 'react'
import { useWallet } from '@txnlab/use-wallet'
import toast from 'react-hot-toast'
import { algodClient } from 'lib/algodClient'
import algosdk from 'algosdk'
import { MdAdd } from 'react-icons/md'
import { formatAssetBalance } from 'utils'

export function AssetApproveCard(props: any) {
    const { activeAddress, signTransactions } = useWallet()
    const { assetID, name, supply, decimals, unitName } = props
    const [loading, setLoading] = useState<boolean>(false)
    const boxGlow = useColorModeValue(styles.boxGlowL, styles.boxGlowD)
    const gradientText = useColorModeValue(styles.textAnimatedGlowL, styles.textAnimatedGlowD)
    const buttonText3 = useColorModeValue('orange.500','cyan.500')
    const buttonText4 = useColorModeValue('orange.200','cyan.100')
    const bgCardOff = useColorModeValue('linear(60deg, whiteAlpha.300 10%, black 35%, black 65%, whiteAlpha.300 90%)','linear(60deg, whiteAlpha.300 10%, black 35%, black 65%, whiteAlpha.300 90%)')
    const buttonText5 = useColorModeValue('orange','cyan')
    const xLightColor = useColorModeValue('orange.100','cyan.100')
    const medColor = useColorModeValue('orange.500','cyan.500')
    const boxWidth = useBreakpointValue({ base: '240px', sm: '240px', md: '280px', lg: '340px', xl: '380px' })

    const sendOptIn = async () => {
        try {      
            if (!activeAddress) {
              throw new Error('Wallet Not Connected!')
            }

            toast.loading(`Awaiting Signature...`, { id: 'txn', duration: Infinity })

            const suggestedParams = await algodClient.getTransactionParams().do()
            suggestedParams.fee = 1000
            suggestedParams.flatFee = true
            const note = Uint8Array.from('Fallen Order - Tools\n\nSuccessfully Approved Asset!'.split("").map(x => x.charCodeAt(0)))
        
            const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                from: activeAddress,
                to: activeAddress,
                amount: 0,
                assetIndex: assetID,
                suggestedParams,
                note,
            })
        
            const encodedTransaction = algosdk.encodeUnsignedTransaction(txn)
        
            const signedTransaction = await signTransactions([encodedTransaction])
        
            await algodClient.sendRawTransaction(signedTransaction).do()

            toast.success(`Successfully Approved Asset!`, {
              id: 'txn',
              duration: 5000
            })

        } catch (error) {
          console.error(error)
          setLoading(false)
          toast.error(`Oops! Asset approval failed. Please verify asset ID and try again...`, { id: 'txn' })
        }
      }
    
    return (
        <Box w={boxWidth} m={6} className={boxGlow} bgGradient={bgCardOff} borderColor={buttonText3}
            borderWidth='1.5px' borderRadius='12px'>
            <div style={{ marginTop: 12, marginBottom: -52, marginRight: 12, textAlign: 'end'}}>
                <IconGlowButton icon={MdAdd} onClick={sendOptIn} disabled={loading} />
            </div>
            <VStack mt={8} mb={6} alignContent='center'>
                <a href={'https://allo.info/asset/' + assetID} target='_blank' rel='noreferrer'><Text textAlign='center' textColor={buttonText5}>ID#{assetID}</Text></a>
                <Text textAlign='center' textColor={buttonText4} fontSize='12px'>Unit: {unitName}</Text>
                <Text textAlign='center' textColor={buttonText4} fontSize='12px'>Name: {name}</Text>
                <Text textAlign='center' textColor={buttonText4} fontSize='12px'>Supply: {formatAssetBalance(supply, 0, true, true, 3)}</Text>
                <Text textAlign='center' textColor={buttonText4} fontSize='12px'>Decimals: {decimals}</Text>
            </VStack>
        </Box>
    )

}