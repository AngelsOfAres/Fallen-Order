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
import { BiMessageRounded } from 'react-icons/bi'

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
              <Icon boxSize={6} as={BiMessageRounded} />
            </MenuButton>
            <MenuList 
      position="fixed"
      top="0"
      right="-152px" w='340px' className={boxGlow} zIndex={999} pb={-2} mr={3} mt={6} borderRadius='20px' background='black' borderColor={buttonText3}>
              <Center><ForumPopup /></Center>
            </MenuList>
          </Menu>

          <Button ml={2} _hover={{textColor:'white'}} _active={{bgColor:'transparent'}} textColor='black' fontSize='14px' fontFamily="Orbitron" size='md' bgColor='transparent' onClick={toggleColorMode}>
            {colorMode === 'light' ? <MoonIcon boxSize={6}/> : <SunIcon boxSize={6} />}
          </Button>

          <Menu>
            <MenuButton
              _hover={{textColor:'white'}} _active={{bgColor:'transparent'}} textColor='black' fontSize='14px' fontFamily="Orbitron" size='md' bgColor='transparent' 
              as={Button}
              cursor={'pointer'}
              minW={0}
              mr={2}
              >
              <HamburgerIcon boxSize={6}/>
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