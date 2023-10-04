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
  } from '@chakra-ui/react';
  import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon, InfoIcon, UpDownIcon } from '@chakra-ui/icons'
  import styles from '../styles/glow.module.css'
import Connect from './MainTools/Connect'

  export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode()
  const navBG = useColorModeValue(styles.navglowL, styles.navglowD)

    return (
      <>
    <Flex className={navBG} w="100%" h="64px" alignItems="center" justifyContent="space-between">
        <Button ml={2} _hover={{textColor:'white'}} _active={{bgColor:'transparent'}} textColor='black' fontSize='14px' fontFamily="Orbitron" size='md' bgColor='transparent' onClick={toggleColorMode}>
                  {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            </Button>
        <Link href='/'>
        <Image
          src="/logo.svg"
          alt="Fallen Order"
          w="60px"
        />
        </Link>
        <Menu>
          <MenuButton
            _hover={{textColor:'white'}} _active={{bgColor:'transparent'}} textColor='black' fontSize='14px' fontFamily="Orbitron" size='md' bgColor='transparent' 
            as={Button}
            cursor={'pointer'}
            minW={0}
            mr={2}
            >
            <HamburgerIcon />
          </MenuButton>
          <MenuList p={0} m={3} borderRadius='20px'>
                <MenuItem closeOnSelect={false} p={0} m={0}  borderRadius='20px'>
                  <Connect />
                </MenuItem>
          </MenuList>
        </Menu>
    </Flex>
      </>
    )
}