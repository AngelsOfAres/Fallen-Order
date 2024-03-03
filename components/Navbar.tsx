import Link from 'next/link'
import * as React from 'react'
import {
    Flex,
    HStack,
    Button,
    Center,
    Menu,
    MenuItem,
    MenuButton,
    Image,
    MenuList,
    MenuDivider,
    useColorModeValue,
    useColorMode,
    Icon,
  } from '@chakra-ui/react';
  import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon, InfoIcon, UpDownIcon } from '@chakra-ui/icons'
  import styles from '../styles/glow.module.css'
import Connect from './MainTools/Connect'
import ForumPopup from './FallenOrder/components/ForumPopup'
import { BiMessageRounded, BiWallet } from 'react-icons/bi'
import { IoColorWandOutline } from 'react-icons/io5'
import GuideBoxPopup from './FallenOrder/components/Popups/GuideBox'
import { BsShop } from 'react-icons/bs'
import { GoPerson } from 'react-icons/go'
import { AiFillThunderbolt } from "react-icons/ai"
import { GiAnvilImpact, GiRollingDices } from 'react-icons/gi';
import { IconGlowButton } from './Buttons';
import { FaTools } from "react-icons/fa";
import { MdOutlineWavingHand } from "react-icons/md"

  export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode()
  const navBG = useColorModeValue(styles.navglowL, styles.navglowD)
  const buttonText3 = useColorModeValue('orange.500','cyan.500')
  const boxGlow = useColorModeValue(styles.boxGlowL, styles.boxGlowD)

    return (
      <>
    <Flex className={navBG} w="100%" h="64px" alignItems="center" justifyContent="space-between">
        <Link href='/'>
        <Image
          src="/logo.svg"
          alt="Fallen Order"
          w="60px"
          ml={4}
        />
        </Link>
        
        <HStack w='100%' justifyContent='flex-end'>

          <Menu>
            <MenuButton
              _hover={{textColor:'white'}} _active={{bgColor:'transparent'}} textColor='black' fontSize='14px' fontFamily="Orbitron" size='md' bgColor='transparent' 
              as={Button}
              cursor={'pointer'}
              minW={0}
              >
              <Icon boxSize={'18px'} as={IoColorWandOutline} />
            </MenuButton>
            <MenuList w='340px' className={boxGlow} zIndex={999} pb={-2} mr={3} mt={6} borderRadius='20px'
              background='black' borderColor={buttonText3}>
              <Center><GuideBoxPopup /></Center>
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton
              _hover={{textColor:'white'}} _active={{bgColor:'transparent'}} textColor='black' fontSize='14px' fontFamily="Orbitron" size='md' bgColor='transparent' 
              as={Button}
              cursor={'pointer'}
              minW={0}
              >
              <Icon boxSize={'19px'} as={BiMessageRounded} />
            </MenuButton>
            <MenuList position="fixed" top="0" right="-200px" w='420px' className={boxGlow} zIndex={999} pb={-2} mr={3} mt={6} borderRadius='20px'
              background='black' borderColor={buttonText3}>
              <Center><ForumPopup /></Center>
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton
              _hover={{textColor:'white'}} _active={{bgColor:'transparent'}} textColor='black' fontSize='14px' fontFamily="Orbitron" size='md' bgColor='transparent' 
              as={Button}
              cursor={'pointer'}
              minW={0}
              >
              <Icon boxSize={'20px'} as={AiFillThunderbolt} />
            </MenuButton>
            <MenuList minW={0} position="fixed" top="0" right="-140px" className={boxGlow} zIndex={999} mt={4} borderRadius='10px'
              background='black' borderColor={buttonText3}>

              <HStack px={4} w='100%' alignItems='center' justifyContent='center' spacing='16px'>
              
                <Link href='/myfo'>
                      <IconGlowButton icon={GoPerson} />
                </Link>

                <Link href='/ge'>
                    <IconGlowButton icon={BsShop} />
                </Link>

                <Link href='/shuffle'>
                    <IconGlowButton icon={GiRollingDices} />
                </Link>

                <Link href='/forge'>
                    <IconGlowButton icon={GiAnvilImpact} />
                </Link>

                <Link href='/tools'>
                    <IconGlowButton icon={FaTools} />
                </Link>

                <Link href='/onboard'>
                    <IconGlowButton icon={MdOutlineWavingHand} />
                </Link>

            </HStack>

            </MenuList>
          </Menu>

          <Button _hover={{textColor:'white'}} _active={{bgColor:'transparent'}} textColor='black' fontSize='14px' fontFamily="Orbitron" size='md' bgColor='transparent' onClick={toggleColorMode}>
            {colorMode === 'light' ? <MoonIcon boxSize={'16px'}/> : <SunIcon boxSize={'16px'} />}
          </Button>

          <Menu>
            <MenuButton
              _hover={{textColor:'white'}} _active={{bgColor:'transparent'}} textColor='black' fontSize='14px' fontFamily="Orbitron" size='md' bgColor='transparent' 
              as={Button}
              cursor={'pointer'}
              minW={0}
              mr={2}
              >
              <Icon boxSize={'20px'} as={BiWallet} />
            </MenuButton>
            <MenuList zIndex={999} p={0} m={6} borderRadius='20px'>
              <Connect />
            </MenuList>
          </Menu>
        </HStack>
    </Flex>
      </>
    )
}