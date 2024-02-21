import { Box, VStack, HStack, useColorModeValue, Text, Textarea, Tooltip, useBreakpointValue, Image, } from '@chakra-ui/react'
import * as React from 'react'
import styles from '../../../styles/glow.module.css'
import { useState, useEffect, useCallback } from 'react'
import { IconGlowButton } from 'components/Buttons'
import { RiSendPlaneFill } from 'react-icons/ri'
import { useWallet } from '@txnlab/use-wallet'
import { sendForumMessage } from 'api/backend'
import toast from 'react-hot-toast'
import { TfiMoreAlt } from 'react-icons/tfi'
import useWalletBalance from 'hooks/useWalletBalance'

export default function ForumPopup() {
  const buttonText3 = useColorModeValue('orange.500','cyan.500')
  const buttonText4 = useColorModeValue('orange.200','cyan.100')
  const xLightColor = useColorModeValue('orange.100','cyan.100')
  const mLightColor = useColorModeValue('orange.200','cyan.200')
  const medColor = useColorModeValue('orange.500','cyan.500')
  const buttonText5 = useColorModeValue('orange','cyan')
  const fontSize1 = useBreakpointValue({ base: '6px', sm: '8px', md: '9px', lg: '10px', xl: '11px' })
  const fontSize2 = useBreakpointValue({ base: '8px', sm: '9px', md: '10px', lg: '11px', xl: '12px' })
  const [loading, setLoading] = useState<boolean>(false)
  const gradientText = useColorModeValue(styles.textAnimatedGlowL, styles.textAnimatedGlowD)
  const boxGlow = useColorModeValue(styles.boxGlowL, styles.boxGlowD)

  const { activeAddress } = useWallet()
  const { expBal } = useWalletBalance()
  const [message, setMessage] = useState<any>('')
  const [currentRound, setCurrentRound] = useState<number>(0)
  const apiUrl = 'https://mainnet-idx.algonode.cloud/v2/transactions?tx-type=axfer&asset-id=811721471&address=FQA75PMGC6WD24GGGBKZQVBXPBPYPBNWVI3WAOA7EX26LFDFUPPPI636LM'
  const [data, setData] = useState<any>([])
  const [currentPage, setCurrentPage] = useState<number>(1)

  const removeExtraLineBreaks = (text: any) => {
    return text.replace(/\n{2,}/g, '\n')
  }

  const handleNote = (note: any) => {
  if (!note || typeof note !== 'string') {
      return '-'
  }
  const cleanedNote = atob(note)
  return cleanedNote
  }

  const fetchData = useCallback(async (): Promise<any> => {
    try {
      const response = await fetch(apiUrl)
      if (!response.ok) {
        return null
      }
      const newData = await response.json()
      const newMessages = [...newData.transactions.filter((transaction: any) => transaction['confirmed-round'] > currentRound)]
      if (newMessages.length > 0) {
        setData(() => [...newMessages, ...data])
        setCurrentRound(newData.transactions[0]['confirmed-round'])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      return []
    }
  }, [apiUrl, currentRound, data, setData, setCurrentRound])

  useEffect(() => {
    const intervalId = setInterval(fetchData, 5000)
    return () => clearInterval(intervalId)
  }, [fetchData])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const fetchNextPage = async (currentPage: number): Promise<any> => {
    try {
      const response = await fetch(apiUrl + `?next=${currentPage + 1}`)
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching next page data:', error)
      return []
    }
  }

  const loadNextPage = async () => {
    const nextPageData = await fetchNextPage(currentPage)
    if (nextPageData !== null) {
      setData((prevData: any) => [...prevData, ...nextPageData])
      setCurrentPage(prevPage => prevPage + 1)
    } else {
      console.log('No more data to fetch')
    }
  }

  async function handleSendMessage() {
    setLoading(true)
    setMessage('')
    toast.loading('Sending Message...', { id: 'txn', duration: Infinity })
    try{
        const data = await sendForumMessage(activeAddress, message)
        if (data && data.message) {
          toast.success(`Message Sent Successfully!`, {
            id: 'txn',
            duration: 5000
            })
        } else {
          toast.error(`Oops! Message sending failed. Please contact an admin if issue persists...`, { id: 'txn' })
        }
    } catch (error) {
      toast.error(`Oops! Message sending failed. Please contact an admin if issue persists...`, { id: 'txn' })
    } finally {
      setLoading(false)
    }
}

const formatTimestamp = (roundTime: number): string => {
  const timestampInMillis = roundTime * 1000
  const date = new Date(timestampInMillis)

  const currentDate = new Date()
  const currentDay = currentDate.getDate()
  const currentMonth = currentDate.getMonth() + 1
  const currentYear = currentDate.getFullYear()

  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  if (currentDay === day && currentMonth === month && currentYear === year) {
    return `Today ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}`;
  }

  const yesterday = new Date(currentDate)
  yesterday.setDate(currentDay - 1)
  if (yesterday.getDate() === day && yesterday.getMonth() + 1 === month && yesterday.getFullYear() === year) {
    return `Yesterday ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}`
  }

  return date.toLocaleString([], { month: 'short', day: 'numeric', year: '2-digit', hour: 'numeric', minute: '2-digit', hour12: true }).replace(/^0/, '');
}

    return (
      <>
        <Box zIndex={999} px={4} h='75vh' w='100%' justifyContent='center' overflow='scroll'
        css={`
            /* Hide scrollbar display */
            ::-webkit-scrollbar {
            display: none;
            }
        `}>
            <HStack mb={-6} spacing='2px' justifyContent='flex-start'>
                <Image boxSize='12px' alt='$EXP Balance' src='exp.png' />
                <Text fontSize='11px' textColor={buttonText5}>{expBal == -1 ? 0 : expBal}</Text>
            </HStack>
            <HStack mt={6} w='100%' justifyContent='center'>
            <VStack w='full'>
                <Textarea
                w='100%'
                maxLength={250}
                minH='40px'
                fontSize='10px'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Insert Your Message Here!`}
                _hover={{bgColor: 'black'}}
                _focus={{borderColor: medColor}}
                textColor={xLightColor}
                borderColor={medColor}
                />
            </VStack>
            <Tooltip py={1} px={2} borderWidth='1px' borderRadius='lg' arrowShadowColor={buttonText5} borderColor={buttonText5} bgColor='black' textColor={buttonText4} fontSize='12px' fontFamily='Orbitron' textAlign='center' hasArrow label={'Send Message'} aria-label='Tooltip'>
                <div style={{alignSelf: 'flex-end', marginBottom: 2, marginLeft: -4}}>
                <IconGlowButton icon={RiSendPlaneFill} disabled={loading || message == null || message.length == 0} onClick={handleSendMessage} />
                </div>
            </Tooltip>
            </HStack>
            <Text textAlign='center' textColor={'gray.400'} fontSize={'8px'}>1 $EXP/Message</Text>
            
            {data
            .filter((transaction: any) => transaction['asset-transfer-transaction']['amount'] == 1)
            .map((transaction: any, index: any) => (
            <Box key={index} className={boxGlow} my={2} py={1} px={2} w='100%' borderColor={buttonText3} borderRadius='xl' borderWidth='1px'>

                <HStack w='100%' justifyContent='space-between'>
                <Text fontSize={fontSize1} whiteSpace="pre-wrap" textColor={mLightColor}>{formatTimestamp(transaction["round-time"])}</Text>
                <a
                    href={`https://allo.info/account/${transaction["asset-transfer-transaction"]["sender"]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Text textColor={medColor} fontSize={fontSize1} whiteSpace="pre-wrap">
                      {transaction["asset-transfer-transaction"]["sender"].substring(0, 5) + "..." + transaction["asset-transfer-transaction"]["sender"].substring(transaction["asset-transfer-transaction"]["sender"].length - 5)}
                    </Text>
                </a>
                </HStack>

                <Text fontSize={fontSize2} whiteSpace="pre-wrap" textColor={xLightColor}>{removeExtraLineBreaks(handleNote(transaction.note))}</Text>

            </Box>
            ))}
        </Box>
        {data.length >= 1000 ?
            <IconGlowButton icon={TfiMoreAlt} onClick={loadNextPage} />
        : null}
    </>
    );
  }

