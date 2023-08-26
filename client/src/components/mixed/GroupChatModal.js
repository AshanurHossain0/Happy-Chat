import React, { useState } from 'react'
import { useDisclosure } from '@chakra-ui/hooks'
import {
    IconButton, Modal, ModalOverlay, ModalContent, ModalHeader,
    ModalCloseButton, ModalBody, ModalFooter, Button, Image, Text, useToast, FormControl, Input
} from '@chakra-ui/react'
import { ChatState } from '../../context/chatProvider'

const GroupChatModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [selectedUsers,setSelectedUsers]=useState([]);
    const [groupName,setGroupName]=useState('');
    const [search,setSearch] =useState('');
    const [searchResults,setSearchResults] =useState([]);
    const [loading,setLoading] =useState(false);

    const {user,chats,setChats}=ChatState();

    const toast=useToast();

    const handleSearch=()=>{}
    const handleSubmit=()=>{}

    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize='35px'
                        fontFamily='Work sans'
                        display='flex'
                        justifyContent='center'
                    >Create Group</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display='flex' flexDir='column' alignItems='center'>
                        <FormControl>
                            <Input placeholder='Chat name' mb='3' onChange={(e)=>setGroupName(e.target.value)} />
                        </FormControl>
                        <FormControl>
                            <Input placeholder='Add users ex: Ashanur, Honey, Ashik' mb='1' onChange={(e)=>handleSearch(e.target.value)} />
                        </FormControl>
                        {/* selected users */}
                        {/* render searched users */}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' onClick={handleSubmit}>
                            Create Chat
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModal