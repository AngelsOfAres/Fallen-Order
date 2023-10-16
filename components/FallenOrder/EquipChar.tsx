import { HStack, Text, useColorModeValue, Box, Center, VStack, Image as CImage, Progress, Tooltip, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, useDisclosure } from '@chakra-ui/react'
import { FullGlowButton } from 'components/Buttons'
import React, { useState, useEffect } from 'react'
import styles from '../../styles/glow.module.css'
import useWalletBalance from 'hooks/useWalletBalance'
import { Rank1, Rank2, Rank3, Rank4, Rank5 } from '../Whitelists/FOChars'
import { BGRank1, BGRank2, BGRank3 } from '../Whitelists/FOBGs'
import algodClient from 'lib/algodClient'
import SelectMenu from 'components/SelectMenu'
import { Listbox } from '@headlessui/react'
import { classNames } from 'utils'
import axios from 'axios'
import { useWallet } from '@txnlab/use-wallet'
import { equipBG } from 'api/backend'

const EquipCharacter: React.FC = () => {
  const { activeAddress } = useWallet()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const allFO = [...Rank1, ...Rank2, ...Rank3, ...Rank4, ...Rank5]
  const allBGs = [...BGRank1, ...BGRank2, ...BGRank3]
  const xLightColor = useColorModeValue('orange.100','cyan.100')
  const lightColor = useColorModeValue('orange.300','cyan.300')
  const medColor = useColorModeValue('orange.500','cyan.500')
  const [equippedChar, setEquippedChar] = useState<string>('')
  const [txnID, setTxnID] = useState<any>('')
  const [equipping, setEquipping] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [userProfile, setUserProfile] = useState<any>([])
  const boxGlow = useColorModeValue(styles.boxGlowL, styles.boxGlowD)
  const bgColor = useColorModeValue("bg-orange-400", "bg-cyan-500")
  const { assetList } = useWalletBalance()
  const [options, setOptions] = useState<any[]>([])
  const gradientText = useColorModeValue(styles.textAnimatedGlowL, styles.textAnimatedGlowD)
  const [selectedFO, setSelectedFO] = useState({value: 'No Characters Found!', label: (
    <>
    </>
  ), image: '', asset_id: 0})
  const [selectedBG, setSelectedBG] = useState({value: 'No Backgrounds Found!', label: (
    <>
    </>
  ), image: '', asset_id: 0})
  
  const progress = useColorModeValue('linear(to-r, orange, red)', 'linear(to-r, purple.600, cyan)')
  const buttonText5 = useColorModeValue('yellow','cyan')
  const buttonText3 = useColorModeValue('orange.500', 'cyan.500')
  const buttonText4 = useColorModeValue('orange.100', 'cyan.100')
  const iconColor1 = useColorModeValue('orange', 'cyan')
  const user_data_wallet = "QBLXBZZ5CVAEJJBO63RQEC43XBWBJHVEO46WHHWR7XJ6YOJHPHUQ3CTSMM"

  let assetIds: any = []
  let assetData: any = []

  async function handleEquip() {
    setEquipping(true)
    onClose()
    await equipBG(selectedFO.asset_id, selectedBG.asset_id, activeAddress)
    .then((data: any) => {
      if (data && data.includes("Error")) {
        console.log(data)
        return
      }
      setTxnID(encodeURIComponent(data))
    })
    .catch((error: any) => {
      console.error(error)
    })
    setEquipping(false)
  }

  async function fetchAssetData(main_character: any) {
    const metadata_api = `https://mainnet-idx.algonode.cloud/v2/transactions?tx-type=acfg&asset-id=${main_character}&address=CHARX2GZKNZZORNV2WROPUTSB5QBVRIC62QXXLABFCKA2QALEA3OHVIDYA`;
    let data, metadata_decoded, bg_id;
  
    try {
      const response = await axios.get(metadata_api)
      if (response.status === 200) {
        data = response.data;
      } else {
        console.log('Error fetching data from API')
        return {
          fallen_image: null,
          fallen_name: null,
          bg_id: '-',
        }
      }
      const note = data.transactions[0].note
      metadata_decoded = JSON.parse(
        Buffer.from(atob(note), 'utf-8').toString('utf-8')
      );
      bg_id = metadata_decoded.properties?.Background || '-'
    } catch (error) {
      console.error('Error:', error);
      return {
        bg_id: '-',
      };
    }
    return bg_id
  }
  
  async function get_all_wallets(): Promise<any> {
    try {
      const assets = await algodClient.accountInformation('QBLXBZZ5CVAEJJBO63RQEC43XBWBJHVEO46WHHWR7XJ6YOJHPHUQ3CTSMM').do()
      const created = assets['created-assets']
  
      const batchSize = 100
      const processedAssets = await processAssetsInBatches(created, batchSize)
  
      const assetWithProfile = processedAssets.find((asset: any) => asset.properties && asset.properties.Wallet === activeAddress)
  
      if (assetWithProfile) {
        const wallet = assetWithProfile.properties['Wallet']
        const bossBattles = assetWithProfile.properties['Boss Battles']
        const mainCharacter = assetWithProfile.properties['Main Character']
        const equippedTool = assetWithProfile.properties['Equipped Tool']
        const totalDrip = assetWithProfile.properties['Total Drip']
        const userName = assetWithProfile.properties['Name']
        const image = assetWithProfile.properties['Image']
        if (mainCharacter) {
          const assetInfo = await algodClient.getAssetByID(mainCharacter).do()
          const assetName = assetInfo.params.name
          const assetImage = 'https://cloudflare-ipfs.com/ipfs/' + assetInfo.params.url.substring(7)
          const bgID = await fetchAssetData(mainCharacter)
          const bgInfo = await algodClient.getAssetByID(bgID).do()
          const bgName = bgInfo.params.name
          const bgImage = 'https://cloudflare-ipfs.com/ipfs/' + bgInfo.params.url.substring(7)
          setUserProfile({
            id: assetWithProfile.index,
            wallet: wallet,
            name: userName,
            main: mainCharacter,
            bg: bgID,
            tool: equippedTool,
            drip: totalDrip,
            battles: bossBattles,
            image: image,
          });
          setSelectedFO({
            value: assetName,
            label: (
              <>
                <span className={`inline-flex items-center rounded ${bgColor} px-2.5 py-0.5 text-sm font-medium text-black mr-3`}>
                  {mainCharacter}
                </span>
              </>
            ),
            image: assetImage,
            asset_id: mainCharacter
          });
          setSelectedBG({
            value: bgName,
            label: (
              <>
                <span className={`inline-flex items-center rounded ${bgColor} px-2.5 py-0.5 text-sm font-medium text-black mr-3`}>
                  {bgID}
                </span>
              </>
            ),
            image: bgImage,
            asset_id: bgID
          })
        }
      }
      setLoading(false)
    } catch (error) {
      console.error('Error:', error)
      setLoading(false)
    }
  }
  
  async function processAssetsInBatches(assets: any, batchSize: number): Promise<any[]> {
    const batches = [];
    for (let i = 0; i < assets.length; i += batchSize) {
      const batch = assets.slice(i, i + batchSize);
      batches.push(batch);
    }
  
    const promises = batches.map(async (batch) => {
      return process_asset(batch);
    });
  
    const results = await Promise.all(promises);
    return results.flat();
  }
  
  async function process_asset(assets: any): Promise<any[]> {
    const processedAssets = [];
  
    for (const singleAsset of assets) {
      const asset_id = singleAsset.index;
      const metadata_api = `https://mainnet-idx.algonode.cloud/v2/transactions?tx-type=acfg&asset-id=${asset_id}&address=${user_data_wallet}`;
  
      try {
        const response = await axios.get(metadata_api);
  
        if (response.status === 200) {
          const data = response.data;
          const note = data.transactions[0].note;
          const metadata_decoded_asset = JSON.parse(
            Buffer.from(atob(note), 'utf-8').toString('utf-8')
          );
          processedAssets.push(metadata_decoded_asset);
        } else {
          console.log('Error fetching data from API for asset ID', asset_id);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  
    return processedAssets;
  }

  const getNames = async () => {
    const batchSize = 30
    const getAssetInfoWithRetry = async (id: any) => {
      const maxRetries = 5;
      for (let retry = 0; retry < maxRetries; retry++) {
        try {
          const assetInfo = await algodClient.getAssetByID(id).do()
          return assetInfo;
        } catch (error: any) {
          await new Promise((resolve) => setTimeout(resolve, 500))
        }
      }
      throw new Error(`Max retries (${maxRetries}) exceeded for asset ID: ${id}`);
    };
  
    for (let i = 0; i < assetIds.length; i += batchSize) {
      const batchIds = assetIds.slice(i, i + batchSize);
      const batchPromises = batchIds.map(async (id: any) => {
        try {
          const assetInfo = await getAssetInfoWithRetry(id);
          const assetName = assetInfo.params.name;
          const convertedUrl = 'https://cloudflare-ipfs.com/ipfs/' + assetInfo.params.url.substring(7);
          assetData.push([id, assetName, convertedUrl]);
        } catch (error) {
          console.error(`Error fetching asset info for ID ${id}:`, error);
        }
      });
      await Promise.all(batchPromises);
    }
    assetData.sort((a: any, b: any) => a[0] - b[0])
    const newOptions = assetData.map((asset: any) => (
      {
      value: asset[1],
      label: (
        <>
          <span className={`inline-flex items-center rounded ${bgColor} px-2.5 py-0.5 text-sm font-medium text-black mr-3`}>
            {asset[0]}
          </span>
        </>
      ),
      image: asset[2],
      asset_id: asset[0]
    }))
    setOptions(newOptions)
    const charOptions = newOptions.filter((option: any) => allFO.includes(option.asset_id))
    const bgOptions = newOptions.filter((option: any) => allBGs.includes(option.asset_id))
    if (charOptions.length > 0) {
      setSelectedFO(charOptions[0])
    }
    if (bgOptions.length > 0) {
      setSelectedBG(bgOptions[0])
    }
  }
  

  useEffect(() => {
    if (options.length === 0) {
      if (assetList) {
        const filteredArray = assetList.filter((item: any) => [...allFO, ...allBGs].includes(item['asset-id']));
        assetIds = filteredArray.map((item: any) => item['asset-id'])
        getNames()
      }
    }
    if (selectedFO && selectedBG) {
      generateImage()
    }
  }, [assetList, options, selectedFO, selectedBG])

  useEffect(() => {
      get_all_wallets()
  }, [activeAddress])


  const generateImage = () => {
    const img1 = new Image()
    const img2 = new Image()
    img1.crossOrigin = "Anonymous"
    img2.crossOrigin = "Anonymous"
    img1.src = selectedFO.image
    img2.src = selectedBG.image
  
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
  
    return new Blob([ab], { type: 'image/png' });
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

  async function handleSelectChangeFO(value: any) {
    setSelectedFO(value)
    generateImage()
  }

  async function handleSelectChangeBG(value: any) {
    setSelectedBG(value)
    generateImage()
  }

  return (<>
    <VStack w="90%">
      <Center>
        <VStack>
          {!loading ?
          <>
          {options.length > 0 ?
          <>
            {userProfile.length > 0 ?
            <>
              <HStack spacing='24px' borderRadius='10px' borderWidth='1px' borderColor={buttonText3}>
                <Text textColor={medColor}>{userProfile.name}</Text>
              <CImage
                  className={`${boxGlow} hover-scale`}
                  _hover={{scale: 2}}
                  boxSize={16}
                  src={userProfile.image}
                  alt={`Main Character`}
                  borderRadius='10px'
                />
              </HStack>
            </>
            : null}
            {options
              .filter((option) => allFO.includes(option.asset_id))
              .length > 0 ?
              <div className="w-full pb-4 px-5 lg:flex lg:flex-col lg:flex-1">
                <label
                  htmlFor="amount"
                  className="block text-sm whitespace-nowrap font-medium"
                >
                  <Text textColor={lightColor}>Character</Text>
                </label>
                <div className="mt-1 sm:col-span-4">
                  <SelectMenu
                    selected={selectedFO}
                    setSelected={(selectedFO) => handleSelectChangeFO(selectedFO)}
                  >
                    {options
                    .filter((option) => allFO.includes(option.asset_id))
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
            : 
              <VStack my={4}>
                <Text textColor={lightColor}>No Characters Found!</Text>
                <a href='https://www.nftexplorer.app/sellers/fallen-order' target='_blank' rel='noreferrer'><FullGlowButton text='Join The Order!' /></a>
              </VStack>
            }
            {options
                .filter((option) => allBGs.includes(option.asset_id))
                .length > 0 ?
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
                    .filter((option) => allBGs.includes(option.asset_id))
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
            :
            <VStack my={4}>
              <Text textColor={lightColor}>No Backgrounds Found!</Text>
              <a href='https://www.nftexplorer.app/sellers/fallen-order-backgrounds' target='_blank' rel='noreferrer'><FullGlowButton text='Get BG!' /></a>
            </VStack>
            }
            <Tooltip py={1} px={2} borderWidth="1px" borderRadius="lg" arrowShadowColor={iconColor1} borderColor={buttonText3} bgColor="black" textColor={buttonText4} fontSize="16px" fontFamily="Orbitron" textAlign="center" hasArrow label={'Download Me!'} aria-label="Tooltip">
            <CImage
              className={`${boxGlow} hover-scale`}
              my='48px'
              _hover={{scale: 2}}
              boxSize={72}
              src={equippedChar !== '' ? equippedChar : '/placeholderQ.png'}
              alt={`Equipped Character`}
              borderRadius='10px'
              onClick={() => {
                const blob = dataURLtoBlob(equippedChar);
                const fileName = 'fo_equipped.png'; 
                downloadBlob(blob, fileName);
              }}
            />
            </Tooltip>
            {txnID !== undefined || txnID !== '' ?
            <>
              <FullGlowButton text={equipping ? 'Equipping...' : 'Equip!'} onClick={onOpen} disabled={equipping || selectedFO.asset_id === 0 || selectedBG.asset_id === 0} />
              <Modal scrollBehavior={'outside'} size='xs' isCentered isOpen={isOpen} onClose={onClose}>
                <ModalOverlay backdropFilter='blur(10px)'/>
                <ModalContent m='auto' alignItems='center' bgColor='black' borderWidth='1.5px' borderColor={buttonText3} borderRadius='lg'>
                    <ModalHeader textAlign='center' className={gradientText} fontFamily='Orbitron' fontSize='20px' fontWeight='bold'>Confirm!</ModalHeader>
                    <ModalBody>
                    <VStack m={1} alignItems='center' justifyContent='center' fontFamily='Orbitron' spacing='24px'>
                        <Text textAlign='center' textColor={buttonText4}><strong>{selectedBG.value}</strong> will be equipped onto <strong>{selectedFO.value}</strong></Text>
                        <Text textAlign='center' textColor={buttonText4}>Cost: <strong>25 $EXP</strong><br />(Clawback)</Text>
                        <HStack pb={3}>
                            <FullGlowButton text='Confirm!' onClick={handleEquip} disabled={equipping || selectedFO.asset_id === 0 || selectedBG.asset_id === 0} />
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
            <Text textColor={lightColor}>Seems you do not own any characters...</Text>
            <a href='https://www.nftexplorer.app/sellers/fallen-order' target='_blank' rel='noreferrer'><FullGlowButton text='Join The Order!' /></a>
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
      </Center>
    </VStack>
  </>
  )
}

export default EquipCharacter
