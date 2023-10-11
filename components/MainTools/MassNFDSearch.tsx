import { useState } from 'react'
import { Box, useColorModeValue, Text, Center, Textarea, VStack, Progress, HStack } from '@chakra-ui/react'
import styles from '../../styles/glow.module.css'
import { FullGlowButton } from '../Buttons'
import axios from 'axios'
import { ClipboardIcon } from '@heroicons/react/20/solid'
import { copyToClipboard } from 'utils/clipboard'

export default function MassNFDSearch() {
  const [nfdList, setNfdList] = useState<any>([])
  const [finalWallets, setFinalWallets] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [search, setSearch] = useState<boolean>(false)
  const boxGlow = useColorModeValue(styles.boxGlowL, styles.boxGlowD)
  const xLightColor = useColorModeValue('orange.100','cyan.100')
  const lightColor = useColorModeValue('orange.300','cyan.300')
  const medColor = useColorModeValue('orange.500','cyan.500')
  const progress = useColorModeValue('linear(to-r, orange, red)', 'linear(to-r, purple.600, cyan)')
  const buttonText5 = useColorModeValue('yellow','cyan')  
  const hoverBgColor = useColorModeValue("hover:bg-orange-400", "hover:bg-cyan-500")
  const textColor =  useColorModeValue("text-orange-200", "text-cyan-200")
  const borderColor =  useColorModeValue('border-orange-500', 'border-cyan-400')
  let wallets: any = []

  const getNFDs = async () => {
    setLoading(true)
    setSearch(false)
    setFinalWallets([])
    wallets = []
    const processedWords = nfdList.flatMap((item: any) => {
        const words = item.split(' ').map((word: any) => {
            word = word.replace(/,/g, '')
            if (!word.includes('.algo')) {
                word += '.algo'
            }
            return word
        })
        return words
    })
    setNfdList(processedWords)
    const batchSize = 50;
    
    async function processNFD(nfd: any) {
        try{
        const apiEndpoint = `https://api.nf.domains/nfd/${nfd}`;
        const response = await axios.get(apiEndpoint);
        if (response.data.depositAccount) {
            wallets.push(response.data.depositAccount);
        }
        } catch (error) {
        }
    }
    const batches = [];
    for (let i = 0; i < processedWords.length; i += batchSize) {
        batches.push(processedWords.slice(i, i + batchSize));
    }
    
    for (const batch of batches) {
        await Promise.all(batch.map((nfd: any) => processNFD(nfd)));
    }
    setSearch(true)
    setLoading(false)
    console.log(wallets)
    setFinalWallets(wallets)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    getNFDs()
  }

  return (
    <Box className={boxGlow} p='6px' m='20px' minW='300px' maxW='480px' bg="black" borderRadius="20px">
      <div className="pt-5 sm:px-6 relative">
        <Text className='hFont' textColor={medColor} textAlign="center">Mass NFD Lookup</Text>
      </div>
      <div className="mx-5 pb-1 pt-3">
        <form onSubmit={handleSubmit}>
          <Text textColor={lightColor} mb="1" fontWeight="semibold">
            NFDs
          </Text>
          <Textarea
            minH='85px'
            mb={6}
            value={nfdList.join('\n')}
            onChange={(e) => setNfdList(e.target.value.split('\n'))}
            placeholder={`degenerate.algo\nmj.algo\nirl.algo`}
            _hover={{bgColor: 'black'}}
            _focus={{borderColor: medColor}}
            textColor={xLightColor}
            borderColor={medColor}
          />
          {!loading ?
            <Center my={4}>
              <FullGlowButton text='Get Wallets!' disabled={nfdList.length === 0 || nfdList.includes('')} onClick={handleSubmit}/>
            </Center>
          : 
            <Center my={4}>
                <Box w='200px'>
                    <Progress size='xs' bgGradient={progress} colorScheme={buttonText5} isIndeterminate borderRadius='xl'/>
                </Box>
            </Center>
          }
        {search ?
            <>
            <Center>
                <HStack my={4}>
                    <Text textAlign='center' textColor={xLightColor} fontSize='24px'>Wallets: {finalWallets.length}</Text>
                    <div className="rounded-md shadow-sm ml-3">
                        <button
                            type="button"
                            className={`relative inline-flex items-center first:rounded-l-md last:rounded-r-md border ${borderColor} bg-black px-3.5 py-2.5 sm:px-2.5 sm:py-2 text-sm font-medium ${textColor} hover:text-black ${hoverBgColor} focus:z-20`}
                            data-clipboard-text={finalWallets}
                            data-clipboard-message="Wallets Copied!"
                            onClick={copyToClipboard}
                            id="copy-wallets"
                            data-tooltip-content="Copy Wallets List"
                            >
                            <ClipboardIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>
                </HStack>
            </Center>
            </>
        : null}
        </form>
      </div>
    </Box>
  ) 
}