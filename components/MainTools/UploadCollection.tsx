import { useState } from 'react'
import {
  Box,
  useColorMode,
  useColorModeValue,
  Text,
  Switch,
  Button,
  Center,
  Progress,
  VStack,
  Input,
  Tooltip,
  HStack,
} from '@chakra-ui/react'
import styles from '../../styles/glow.module.css'
import { FullGlowButton } from '../Buttons'
import { Web3Storage } from 'web3.storage'
import { ClipboardIcon } from '@heroicons/react/20/solid'
import { copyToClipboard } from 'utils/clipboard'

export default function UploadCollection() {
  const [uploading, setUploading] = useState<boolean>(false)
  const [apiKey, setApiKey] = useState<string>('')
  const [publicOn, setPublicOn] = useState<boolean>(false)
  const [CID, setCID] = useState<any>('')
  const [folder, setFolder] = useState<any>(null)
  const [searchComplete, setSearchComplete] = useState<boolean>(true)
  const { colorMode } = useColorMode()
  const boxGlow = useColorModeValue(styles.boxGlowL, styles.boxGlowD)
  const xLightColor = useColorModeValue('orange.100', 'cyan.100')
  const lightColor = useColorModeValue('orange.300', 'cyan.300')
  const medColor = useColorModeValue('orange.500', 'cyan.500')
  const progress = useColorModeValue('linear(to-r, orange, red)', 'linear(to-r, purple.600, cyan)')
  const buttonText5 = useColorModeValue('yellow', 'cyan')

  const baseColor = colorMode === 'light' ? 'orange' : 'cyan'

  const buttonText3 = useColorModeValue('orange.500', 'cyan.500')
  const buttonText4 = useColorModeValue('orange.100', 'cyan.100')
  const iconColor1 = useColorModeValue('orange', 'cyan')

  const hoverBgColor = colorMode === "light" ? "hover:bg-orange-400" : "hover:bg-cyan-500"
  const textColor = colorMode === "light" ? "text-orange-200" : "text-cyan-200"
  const borderColor = colorMode === "light" ? 'border-orange-500' : 'border-cyan-400'

  const uploadCollection = async () => {
    setUploading(true)
    if (!folder || folder.length === 0) {
      console.log('No files found!')
      return
    }
    const client = new Web3Storage({ token: publicOn ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDVmRTgwNEY5MmUyZjdhQzc0MzlFRkFENDUzQTNkOUFBNDA1OUExQTYiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2OTY0NDkwNzAzNzksIm5hbWUiOiJBYnlzc2FsIFBvcnRhbCAtIFB1YmxpYyBLZXkifQ.1yIRnodkQY2dzB85KW0eoWWVsQtkAOQ_O5bchl950U4' : apiKey })
    const files = Array.from(folder).map((file: any) => new File([file], file.name))

    try {
      const cid = await client.put(files)
      setCID(cid)
      setUploading(false)
    } catch (error) {
      setUploading(false)
      console.error('Error uploading files to IPFS:', error)
    }
  }

  const handleFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (selectedFiles && selectedFiles.length > 0) {
      setFolder(selectedFiles)
    } else {
      console.log('No folder selected.')
      setFolder(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSearchComplete(false)
    uploadCollection()
  }

  const toggleNewSearch = () => {
    setSearchComplete(true)
    setFolder(null)
  }

  return (
    <Box className={boxGlow} p="6px" m="20px" minW="300px" maxW="480px" bg="black" borderRadius="20px">
      <div className="pt-5 sm:px-6 flex justify-center items-center">
        <Text className="hFont" textColor={medColor}>
          IPFS Upload
        </Text>
      </div>
      <Center mt={6} mx={4}>
        <Tooltip
          py={1}
          px={2}
          borderWidth="1px"
          borderRadius="lg"
          arrowShadowColor={iconColor1}
          borderColor={buttonText3}
          bgColor="black"
          textColor={buttonText4}
          fontSize="16px"
          fontFamily="Orbitron"
          textAlign="center"
          hasArrow
          label={'Use publically available storage API token. DO NOT USE FOR LONG TERM STORAGE!'}
          aria-label="Tooltip"
        >
          <VStack mb={6} spacing="12px" w="fit-content">
            <Text textColor={lightColor} className="whitespace-nowrap">
              Public Token
            </Text>
            <Switch
              defaultChecked={false}
              size="lg"
              colorScheme={baseColor}
              css={{ '& .chakra-switch__thumb': { backgroundColor: 'black' } }}
              onChange={() => setPublicOn(!publicOn)}
            />
          </VStack>
        </Tooltip>
      </Center>
      {!publicOn ? (
        <>
          <Text mt={-2} textColor={lightColor} mx={4} mb="1" fontWeight="semibold">
            Api Key
          </Text>
          <div className="flex mx-4 mb-6 rounded-md shadow-sm max-w-md">
            <Input
              type="text"
              name="api-key"
              id="api-key"
              borderRightRadius={'0px'}
              _hover={{ bgColor: 'black' }}
              _focus={{ borderColor: medColor }}
              textColor={xLightColor}
              borderColor={medColor}
              className={`block w-full rounded-none rounded-l-md bg-black sm:text-sm`}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Web3 Storage API Token"
            />
            <Button
              _hover={{ bgColor: 'black', textColor: medColor }}
              bgColor="black"
              textColor={xLightColor}
              borderWidth={1}
              borderLeftRadius={'0px'}
              borderColor={medColor}
              type="button"
              className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md px-4 py-2"
              onClick={() => setApiKey('')}
            >
              Clear
            </Button>
          </div>
          <Center mb={6}>
            <a href={`https://web3.storage/`} target='_blank' rel='noreferrer'>
                <FullGlowButton text="Get API Key" />
            </a>
        </Center>
        </>
      ) : null}
      {searchComplete ? (
        <form onSubmit={handleSubmit} className="lg:flex lg:flex-col lg:flex-1">
            {!folder ?
            <>
          <Center mb="26px">
          <label htmlFor="folderInput">
            <Button
              as="span"
              bgColor="black"
              textColor={xLightColor}
              borderWidth={1}
              borderColor={medColor}
              type="button"
            >
              Select Files
              <input
                id="folderInput"
                type="file"
                accept="./*"
                onChange={handleFolderChange}
                style={{ display: 'none' }}
                multiple={true}
              />
            </Button>
          </label>
        </Center>
        </> :
        <Center>
          <HStack mb="26px" spacing='24px'>
            <FullGlowButton text="Upload!" onClick={handleSubmit} disabled={publicOn ? false : apiKey === ''} />
            <FullGlowButton text="X" onClick={toggleNewSearch} />
          </HStack>
        </Center>
        }
        </form>
      ) : (
        <>
          {uploading ? (
            <Center>
              <VStack>
                <Text textAlign="center" textColor={xLightColor} className="pt-4 text-sm">
                  Upload In Progress...
                </Text>
                <Box w="150px" mt="12px" mb="36px">
                  <Progress size="xs" bgGradient={progress} colorScheme={buttonText5} isIndeterminate borderRadius="xl" />
                </Box>
              </VStack>
            </Center>
          ) : (
            <>
              <Center mb="16px">
                <VStack>
                <Text mb={2} textAlign='center' textColor={xLightColor} fontSize='16px'>Upload Successful!</Text>
                    <HStack my='12px'>
                      <FullGlowButton text="Upload More!" onClick={toggleNewSearch} />
                      <a href={`https://ipfs.algonft.tools/ipfs/${CID}`} target='_blank' rel='noreferrer'>
                          <FullGlowButton text="View Files" />
                      </a>
                      <div className="rounded-md shadow-sm ml-3 sm:ml-4">
                        <button
                          type="button"
                          className={`relative inline-flex items-center first:rounded-l-md last:rounded-r-md border ${borderColor} bg-black px-3.5 py-2.5 sm:px-2.5 sm:py-2 text-sm font-medium ${textColor} hover:text-black ${hoverBgColor} focus:z-20`}
                          data-clipboard-text={CID}
                          data-clipboard-message="Collection CID Copied!"
                          onClick={copyToClipboard}
                          id="copy-cid"
                          data-tooltip-content="Copy Collection CID"
                        >
                        <ClipboardIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </div>
                  </HStack>
                </VStack>
              </Center>
            </>
          )}
        </>
      )}
      {folder ? 
        <Text mb={2} textAlign='center' textColor={xLightColor} fontSize='16px'>Files: <strong>{folder.length}</strong></Text>
     : null}
    </Box>
  )
}
