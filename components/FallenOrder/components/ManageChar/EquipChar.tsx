import { HStack, Text, useColorModeValue, Box, Center, VStack, Image as CImage, Progress, Tooltip, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, useDisclosure } from '@chakra-ui/react'
import { FullGlowButton } from 'components/Buttons'
import React, { useState, useEffect } from 'react'
import styles from '../../../../styles/glow.module.css'
import useWalletBalance from 'hooks/useWalletBalance'
import { BGRank1, BGRank2, BGRank3 } from '../../../Whitelists/FOBGs'
import algodClient from 'lib/algodClient'
import SelectMenu from 'components/SelectMenu'
import { Listbox } from '@headlessui/react'
import { classNames } from 'utils'
import { useWallet } from '@txnlab/use-wallet'
import { manageChar } from 'api/backend'
import { SuccessPopup } from '../Popups/Success'

const EquipCharacter = (props: any) => {
  const { char_name, char_id, char_image, bg_id, bg_image, bg_name } = props
  const { activeAddress } = useWallet()
  const [popTitle, setPopTitle] = useState<any>('')
  const [popMessage, setPopMessage] = useState<any>('')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isOpen2, onOpen: onOpen2, onClose: onClose2 } = useDisclosure()
  const allBGs = [...BGRank1, ...BGRank2, ...BGRank3]
  const xLightColor = useColorModeValue('orange.100','cyan.100')
  const lightColor = useColorModeValue('orange.300','cyan.300')
  const [equippedChar, setEquippedChar] = useState<string>('')
  const [txnID, setTxnID] = useState<any>('')
  const [equipping, setEquipping] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const boxGlow = useColorModeValue(styles.boxGlowL, styles.boxGlowD)
  const bgColor = useColorModeValue("bg-orange-400", "bg-cyan-500")
  const { assetList } = useWalletBalance()
  const [options, setOptions] = useState<any>([])
  const gradientText = useColorModeValue(styles.textAnimatedGlowL, styles.textAnimatedGlowD)
  const { isOpen: isSuccessOpen, onOpen: onSuccessOpen, onClose: onSuccessClose } = useDisclosure()
  const success_msg1 = `Character Equip Successful!`
  const success_msg2 = `Character Dequip Successful!`
  const fail_msg = `Character Equip Failed!`
  const [selectedBG, setSelectedBG] = useState({value: bg_id === 0 ? 'Select BG' : bg_name, label: (
    <>
    </>
  ), image: bg_image, asset_id: bg_id})
  
  const progress = useColorModeValue('linear(to-r, orange, red)', 'linear(to-r, purple.600, cyan)')
  const buttonText5 = useColorModeValue('yellow','cyan')
  const buttonText3 = useColorModeValue('orange.500', 'cyan.500')
  const buttonText4 = useColorModeValue('orange.100', 'cyan.100')
  const iconColor1 = useColorModeValue('orange', 'cyan')

  async function processAssets(assets: any): Promise<any[]> {
    const processedAssets = []
  
    for (const singleAsset of assets) {  
      try {
        const assetInfo = await algodClient.getAssetByID(singleAsset['asset-id']).do()
        const assetImage = 'https://cloudflare-ipfs.com/ipfs/' + assetInfo.params.url.substring(7)
        
        processedAssets.push([singleAsset['asset-id'], assetInfo.params['name'], assetInfo.params['unit-name'], assetImage])
      } catch (error) {
        console.error('Error:', error)
      }}
    setLoading(false)
    const bgOptions = processedAssets.map((asset: any) => ({
      value: asset[2],
      label: (
        <>
          <span className={`inline-flex items-center rounded ${bgColor} px-2.5 py-0.5 text-sm font-medium text-black mr-3`}>
            {asset[0]}
          </span>
        </>
      ),
      image: asset[3],
      asset_id: parseInt(asset[0])
    }))
    setOptions(bgOptions)
    if (bg_image === '-') {
      setSelectedBG(bgOptions[0])
    }
    return processedAssets
  }

  useEffect(() => {
    if (assetList) {
      if (assetList.length > 0) {
        setLoading(true)
        const filteredAssetList = assetList.filter((item: any) => allBGs.includes(item['asset-id']))
        if (filteredAssetList.length > 0) {
          processAssets(filteredAssetList)
        }
        else {
          setLoading(false)
        }
      }
      if (assetList === -1) {
        setLoading(false)
      }
    }
    }, [assetList])

    useEffect(() => {
      generateImage([char_image, selectedBG.image])
    }, [options])

    async function handleEquip(type: any) {
      setLoading(true)
      onClose()

      try{
          const data = await manageChar(activeAddress, ['equip', char_id, selectedBG.asset_id, type])
          if (data && data.includes("Error")) {
            setPopTitle('Woops!')
            setPopMessage(fail_msg)
          console.log(data)
          } else {
          console.log(data)
          if (data) {
              setPopTitle('Success!')
              if (type === 1) {
                setPopMessage(success_msg1)
              }
              else {
                setPopMessage(success_msg2)
              }
          }
          else {
              setPopTitle('Woops!')
              setPopMessage(fail_msg)
          }
          }
      } catch (error) {
          setPopTitle('Woops!')
          setPopMessage(error)
      } finally {
          setLoading(false)
          onSuccessOpen()
      }
  }

  const generateImage = (images: any) => {
    if (images[1] === '-') {
      return
    }
    const img1 = new Image()
    const img2 = new Image()
    img1.crossOrigin = "Anonymous"
    img2.crossOrigin = "Anonymous"
    img1.src = images[0]
    img2.src = images[1]
  
    img1.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        console.error('Canvas is not supported in this browser.')
        return
      }
      canvas.width = 2000
      canvas.height = 2000
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img2, 0, 0, canvas.width, canvas.height)
      ctx.drawImage(img1, 0, 0, canvas.width, canvas.height)
  
      const finalImageDataURL = canvas.toDataURL('image/png')
      setEquippedChar(finalImageDataURL)
    }
  }

  function dataURLtoBlob(dataURL: any) {
    const byteString = atob(dataURL.split(',')[1])
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
  
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }
  
    return new Blob([ab], { type: 'image/png' })
  }

  function createObjectURL(blob: any) {
    return URL.createObjectURL(blob)
  }

  function downloadBlob(blob: any, fileName: any) {
    const a = document.createElement('a')
    a.href = createObjectURL(blob)
    console.log(a.href)
    a.download = fileName
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  async function handleSelectChangeBG(value: any) {
    setSelectedBG(value)
    generateImage([char_image, value.image])
  }

  return (
    <>
      <Center mb={4}><FullGlowButton text={equipping ? 'Dequipping...' : 'Dequip!'} onClick={onOpen2} disabled={equipping || selectedBG.asset_id === 0} /></Center>
      <Modal scrollBehavior={'outside'} size='xs' isCentered isOpen={isOpen2} onClose={onClose2}>
        <ModalOverlay backdropFilter='blur(10px)'/>
        <ModalContent m='auto' alignItems='center' bgColor='black' borderWidth='1.5px' borderColor={buttonText3} borderRadius='2xl'>
            <ModalHeader textAlign='center' className={gradientText} fontFamily='Orbitron' fontSize='20px' fontWeight='bold'>Confirm!</ModalHeader>
            <ModalBody>
            <VStack m={1} alignItems='center' justifyContent='center' fontFamily='Orbitron' spacing='24px'>
                <Text textAlign='center' textColor={buttonText4}><strong>{char_name}</strong> will be fully dequipped...</Text>
                <Text textAlign='center' textColor={buttonText4}>Cost: <strong>25 $EXP</strong><br />(Clawback)</Text>
                <HStack pb={3}>
                    <FullGlowButton text='Confirm!' onClick={() => handleEquip(2)} disabled={equipping || selectedBG.asset_id === 0} />
                    <FullGlowButton text='X' onClick={onClose2} />
                </HStack>
            </VStack>
            </ModalBody>
        </ModalContent>
      </Modal>
      <Center>
        <VStack>
          {!loading ?
          <>
          {options.length > 0 ?
          <>
              <div className="w-full py-2 px-5 lg:flex lg:flex-col lg:flex-1">
              <label
                htmlFor="amount"
                className="block text-sm whitespace-nowrap font-medium"
              >
                <Text textColor={lightColor}>Background</Text>
              </label>
              <div className="mt-1 sm:col-span-4">
                  <SelectMenu
                    selected={selectedBG}
                    setSelected={(selectedBG) => handleSelectChangeBG(selectedBG)}
                  >
                    {options
                    .map((option: any) => (
                      <Listbox.Option
                        key={option.value}
                        className={({ active }) =>
                          classNames(
                            active ? `text-white ${bgColor}` : 'text-black',
                            `relative cursor-pointer select-none py-2 pl-3 pr-10`
                          )
                        }
                        value={option}
                      >
                        <span className="text-sm">{option.label}</span>
                        <span className="text-sm pl-2">{option.value}</span>
                      </Listbox.Option>
                    ))}
                  </SelectMenu>
                </div>
              </div>
            <Tooltip py={1} px={2} borderWidth="1px" borderRadius="lg" arrowShadowColor={iconColor1} borderColor={buttonText3} bgColor="black" textColor={buttonText4} fontSize="16px" fontFamily="Orbitron" textAlign="center" hasArrow label={'Download Me!'} aria-label="Tooltip">
            <CImage
              className={`${boxGlow} hover-scale`}
              my='12px'
              _hover={{scale: 2}}
              boxSize={72}
              src={equippedChar !== '' ? equippedChar : '/placeholderQ.png'}
              alt={`Equipped Character`}
              borderRadius='10px'
              onClick={() => {
                const blob = dataURLtoBlob(equippedChar)
                const fileName = 'fo_equipped.png'
                downloadBlob(blob, fileName)
              }}
            />
            </Tooltip>
            {txnID !== undefined || txnID !== '' ?
            <>
              <FullGlowButton text={equipping ? 'Equipping...' : 'Equip!'} onClick={onOpen} disabled={equipping || selectedBG.asset_id === 0} />
              <Modal scrollBehavior={'outside'} size='xs' isCentered isOpen={isOpen} onClose={onClose}>
                <ModalOverlay backdropFilter='blur(10px)'/>
                <ModalContent m='auto' alignItems='center' bgColor='black' borderWidth='1.5px' borderColor={buttonText3} borderRadius='2xl'>
                    <ModalHeader textAlign='center' className={gradientText} fontFamily='Orbitron' fontSize='20px' fontWeight='bold'>Confirm!</ModalHeader>
                    <ModalBody>
                    <VStack m={1} alignItems='center' justifyContent='center' fontFamily='Orbitron' spacing='24px'>
                        <Text textAlign='center' textColor={buttonText4}><strong>{selectedBG.value}</strong> will be equipped onto <strong>{char_name}</strong></Text>
                        <Text textAlign='center' textColor={buttonText4}>Cost: <strong>25 $EXP</strong><br />(Clawback)</Text>
                        <HStack pb={3}>
                            <FullGlowButton text='Confirm!' onClick={() => handleEquip(1)} disabled={equipping || selectedBG.asset_id === 0} />
                            <FullGlowButton text='X' ref={null} isLoading={null} onClick={onClose} />
                        </HStack>
                    </VStack>
                    </ModalBody>
                </ModalContent>
              </Modal>
            </>
            :
            <>
              <a href={`https://algoexplorer.io/tx/group/${txnID}`} target='_blank' rel='noreferrer'><Text textColor={xLightColor} align={'center'} className='pb-4 text-md'>View Txn</Text></a>
              <FullGlowButton text='Re-Equip!' onClick={() => setTxnID('')} />
            </>
            }
          </>
          :
          <VStack my={4}>
            <Text textAlign='center' textColor={lightColor}>No Backgrounds Found!</Text>
            <a href='https://www.nftexplorer.app/sellers/fallen-order-backgrounds' target='_blank' rel='noreferrer'><FullGlowButton text='Get BG!' /></a>
          </VStack>
          }
          </>
          :
          <>
            <Text mb={-4} textColor={xLightColor} align={'center'} className='pt-4 text-sm'>Loading User Profile...</Text>
            <Box w='250px' my='24px'>
                <Progress size='xs' bgGradient={progress} colorScheme={buttonText5} isIndeterminate borderRadius='xl'/>
            </Box>
          </>
          }
        </VStack>
      <SuccessPopup isOpen={isSuccessOpen} onClose={onSuccessClose} message={popMessage}  title={popTitle} />
      </Center>
  </>
  )
}

export default EquipCharacter
