import { Text, useColorModeValue, Box, VStack, Progress, Flex } from '@chakra-ui/react'
import { FullGlowButton } from 'components/Buttons'
import React, { useState, useEffect } from 'react'
import algodClient from 'lib/algodClient'
import { CharCard } from './components/CharCard'
import { getShuffle1 } from 'api/backend'
import { useWallet } from '@txnlab/use-wallet'

const Shuffle: React.FC = () => {
  const { activeAddress } = useWallet()
  const xLightColor = useColorModeValue('orange.100','cyan.100')
  const lightColor = useColorModeValue('orange.300','cyan.300')
  const [loading, setLoading] = useState<boolean>(true)
  const progress = useColorModeValue('linear(to-r, orange, red)', 'linear(to-r, purple.600, cyan)')
  const buttonText5 = useColorModeValue('yellow','cyan')

  
  async function handleShuffle1() {
    setLoading(true)
        try{
            const data = await getShuffle1([activeAddress, 0])
            if (data && data.includes("Error")) {
                console.log(data)
            } else {
                console.log(data)
            }
        } catch (error) {

        } finally {
            setLoading(false)
        }
    }

  return (
    <>
        <VStack w='90%'>
          {!loading ?
          <>
          <FullGlowButton text='SHUFFLE!' onClick={handleShuffle1} />
          </>
          :
          <>
            <Text mb={-4} textColor={xLightColor} align={'center'} className='pt-4 text-sm'>Loading...</Text>
            <Box w='250px' my='24px'>
                <Progress size='xs' bgGradient={progress} colorScheme={buttonText5} isIndeterminate borderRadius='xl'/>
            </Box>
          </>
          }
        </VStack>
  </>
  )
}

export default Shuffle
