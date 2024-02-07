import { useColorModeValue, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, VStack, ModalFooter, Input } from '@chakra-ui/react'
import styles from '../../../styles/glow.module.css'
import React from 'react'
import { useWallet } from '@txnlab/use-wallet'
import { FullGlowButton } from 'components/Buttons'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { createProfile } from 'api/backend'

export default function CreateUserProfile(props: any) {
  const { isOpen, onClose } = props
  const gradientText = useColorModeValue(styles.textAnimatedGlowL, styles.textAnimatedGlowD)
  const { activeAddress } = useWallet()
  const [ loading, setLoading ] = useState<boolean>(false)
  const [ userID, setUserID ] = useState<any>(null)
  const buttonText3 = useColorModeValue('orange.500','cyan.500')
  const buttonText4 = useColorModeValue('orange.200','cyan.100')
  const buttonText5 = useColorModeValue('orange','cyan')
  const xLightColor = useColorModeValue('orange.100','cyan.100')
  const medColor = useColorModeValue('orange.500','cyan.500')

  const createUserProfile = async () => {
    setLoading(true)
    try {
      if (!activeAddress) {
        throw new Error('Log In First Please!!')
      }

      toast.loading('Creating Profile...', { id: 'txn', duration: Infinity })

      try{
          const data = await createProfile(activeAddress, userID)
          if (data && data.includes("Error")) {
            toast.error('Oops! Profile Creation Failed!', { id: 'txn' })
            return
          }
      } catch (error: any) {
          console.log(error.message)
          toast.error('Oops! Profile Creation Failed!', { id: 'txn' })
          return
      } finally {
          setLoading(false)
      }
    } catch (error) {
      console.error(error)
      toast.error('Oops! Profile Creation Failed!', { id: 'txn' })
    }
    onClose()
    toast.success(`Your Profile Has Been Created!`, {
      id: 'txn',
      duration: 5000
    })
  }
  
  return (
    <>
        <Modal scrollBehavior={'outside'} size='md' isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay backdropFilter='blur(10px)'/>
        <ModalContent m='auto' alignItems='center' bgColor='black' borderWidth='1.5px' borderColor={buttonText3} borderRadius='2xl'>
            <ModalHeader className={gradientText} textAlign='center' fontSize='24px' fontWeight='bold'>Create New Account!</ModalHeader>
            <ModalBody>
            <VStack mx={4} alignItems='center' justifyContent='center'>
              <Input type="text" name="userid" id="userid" maxLength={19} textAlign='center' _hover={{ bgColor: 'black' }} _focus={{ borderColor: medColor }}
                  textColor={xLightColor} borderColor={medColor} borderRadius='lg' className={`block w-full bg-black sm:text-sm`} value={userID}
                  onChange={(e) => setUserID(e.target.value)} placeholder="Discord User ID" />
                  <Text pb={1} fontSize='12px' textAlign='center' textColor={buttonText5}>*You may attach a Discord User ID later*</Text>
                  <div className="pb-4"><a href="https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-" target="_blank" rel="noreferrer"><FullGlowButton text={`Find My User ID`} /></a></div>
              <FullGlowButton text={loading ? 'Creating Account...' : `Create Account!`} onClick={createUserProfile} />
            </VStack>
            </ModalBody>
            <ModalFooter>
                <FullGlowButton text='X' onClick={onClose} />
            </ModalFooter>
        </ModalContent>
        </Modal>
    </>
  )
}
