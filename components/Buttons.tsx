import {
    Button,
    Container,
    HStack,
    Image,
    useColorModeValue,
    Text,
    Icon,
  } from '@chakra-ui/react'
  import * as React from 'react'
  import styles from '../styles/glow.module.css'
  
  interface textProp {
      fontsize? : any,
      text?: string,
      ref?: any;
      isLoading?: any,
      type?: any,
      icon?: any,
      id?: any,
      leftIcon?: any,
      onClick?: (event: any) => void;
  };
  
  export const FullGlowButton = ({ fontsize, type, leftIcon, ref, text, onClick }: textProp) => {
    return (
    <Button borderRadius='6px' px='6px' className={useColorModeValue(styles.fullglowL, styles.fullglowD)} leftIcon={leftIcon? leftIcon : null} _hover={{textColor:'white'}} textColor='black' fontSize={fontsize? fontsize : '12px'} fontFamily="Orbitron" size='xs' ref={ref} type={type} onClick={onClick}>
        <Text px={2} zIndex={1}>{text}</Text>
    </Button>
    )
  }
  
  export const OutlineGlowButton = ({ text, onClick }: textProp) => {
    return (
    <Button px='0.75px' className={useColorModeValue(styles.outlineglowL, styles.outlineglowD)} fontSize='10px' fontFamily="Orbitron" size='xs' onClick={onClick}>
        <Container className={styles.glowInnerBlack} zIndex={1}>
            <Text pt='5px' className={useColorModeValue(styles.textAnimatedGlowL, styles.textAnimatedGlowD)}>{text}</Text>
        </Container>
    </Button>
    )
  }
  
  export const IconGlowButton = ({ icon, onClick }: textProp) => {
    return (
        <Button px='0.75px' className={useColorModeValue(styles.fullglowL, styles.fullglowD)} _hover={{textColor:'white'}} textColor='black' fontSize='8px' fontFamily="Orbitron" size='xs' onClick={onClick}>
            <Icon boxSize={4} as={icon} zIndex={1} />
        </Button>
    )
  }
  