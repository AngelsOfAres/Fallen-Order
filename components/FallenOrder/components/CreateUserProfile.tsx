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
            <ModalHeader className={gradientText} textAlign='center' fontSize='24px' fontWeight='bold'>Create New Profile!</ModalHeader>
            <ModalBody>
            <VStack mx={4} alignItems='center' justifyContent='center'>
                <Text pb={4} fontSize='16px' textAlign='center' textColor={buttonText4}>This will create a new on chain user profile for your account.<br />Profiles are used to track your stats, timers, gameplay, and more.<br />They essentially act as our database, except it&apos;s on chain!</Text>
                <Input type="text" name="userid" id="userid" maxLength={19} textAlign='center' _hover={{ bgColor: 'black' }} _focus={{ borderColor: medColor }}
                    textColor={xLightColor} borderColor={medColor} borderRadius='lg' className={`block w-full bg-black sm:text-sm`} value={userID}
                    onChange={(e) => setUserID(e.target.value)} placeholder="Discord User ID" />
                    <Text pb={4} fontSize='12px' textAlign='center' textColor={buttonText5}>*You may attach a Discord User ID later*</Text>
                <FullGlowButton text={loading ? 'Creating Profile...' : `Let's Go!`} onClick={createUserProfile} />
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
