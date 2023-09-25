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
import Connect from './Connect';

  export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode()
  const navBG = useColorModeValue(styles.navglowL, styles.navglowD)

    return (
      <>
    <Flex
      className={navBG}
      w="100%"
      h="64px"
      alignItems="center"
      justifyContent="space-between"
      px={8}
      boxShadow="lg"
    >
        <Button
          mx='16px'
          variant="ghost"
          onClick={toggleColorMode}
        >
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
          <MenuButton mx='16px' as={Button} variant="ghost">
            <HamburgerIcon />
          </MenuButton>
          <MenuList bgColor="black" borderRadius="8px" fontSize="12px" fontFamily="Orbitron" mt='28px' >
            <Center>
                <MenuItem closeOnSelect={false} borderRadius='8px'>
                <Connect />
                </MenuItem>
            </Center>
          </MenuList>
        </Menu>
    </Flex>
      </>
    )
}