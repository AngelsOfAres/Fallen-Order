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
  import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon, InfoIcon, UpDownIcon } from '@chakra-ui/icons';
  import styles from '../styles/glow.module.css'
import Connect from './Connect';

  export default function Navbar() {
  const buttonText4 = useColorModeValue('orange.300','cyan.300')
  const borderC = useColorModeValue('orange.600','cyan.600')
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
          variant="ghost"
          onClick={toggleColorMode}
        >
          {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
        </Button>
        <Image
          src="/logo.svg"
          alt="Fallen Order"
          w="60px"
        />
        <Menu>
          <MenuButton
            as={Button}
            variant="ghost" // Transparent button
          >
            <HamburgerIcon />
          </MenuButton>
          <MenuList
            bgColor="black"
            borderRadius="4px"
            fontSize="12px"
            fontFamily="Orbitron"
            mt={2}
          >
            <Center>
                <MenuItem
                  borderRadius='4px'
                >
                <Connect />
                </MenuItem>
            </Center>
          </MenuList>
        </Menu>
    </Flex>
      </>
    )
}