import React from 'react'
import {useDisclosure} from '@chakra-ui/hooks'
import {IconButton,Modal,ModalOverlay,ModalContent,ModalHeader,
  ModalCloseButton,ModalBody,ModalFooter,Button,Image,Text
} from '@chakra-ui/react'

import {ViewIcon} from '@chakra-ui/icons'

const ProfileModal = ({user,children}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      {
        children? <span onClick={onOpen} >{children}</span> : (
          <IconButton display={{base:"flex"}} icon={<ViewIcon/>} onClick={onOpen} />
        )
      }
      <Modal size='lg' isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent h='412px'>
          <ModalHeader fontSize='40px' fontFamily='work sans' display='flex'
           justifyContent='center'
           >{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody display='flex' flexDirection='column' alignItems='center' justifyContent='space-between'>
            <Image
              borderRadius='full'
              boxSize='150px'
              src={user.pic}
              alt={user.name}
            />
            <Text fontFamily='work sans' fontSize={{base:'23px',md:'30px'}}>
              Email : {user.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ProfileModal