import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDisclosure } from '@chakra-ui/hooks'
import UserList from '../userAvatar/UserList'
import UserBadge from '../userAvatar/UserBadge';
import {
    Box, Modal, ModalOverlay, ModalContent, ModalHeader,
    ModalCloseButton, ModalBody, ModalFooter, Button, useToast, FormControl, Input
} from '@chakra-ui/react'
import { ChatState } from '../../context/chatProvider'

const GroupChatModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [groupName, setGroupName] = useState('');
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const { user, chats, setChats } = ChatState();

    const toast = useToast();

    const handleSearch = async () => {
        if (!search) {
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": user.token
                }
            }
            const { data } = await axios.get(`${process.env.REACT_APP_BASEURL}/api/user?search=${search}`, config)
            setLoading(false);
            setSearchResults(data);
            setSearch('')
        }
        catch (err) {
            toast({
                title: "Error occured!",
                description: err.message,
                status: "error",
                isClosable: true,
                duration: 4000,
                position: 'top'
            })
        }
    }
    const handleSubmit = async () => {
        if(!groupName){
            toast({
                title: "Please fill group name",
                status: "warning",
                isClosable: true,
                duration: 4000,
                position: 'top'
            })
            return;
        }
        if(selectedUsers.length <2){
            toast({
                title: "Atleast 2 member is needed to create group",
                status: "warning",
                isClosable: true,
                duration: 4000,
                position: 'top'
            })
            return;
        }
        try{
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": user.token
                }
            }
            const { data } = await axios.post(`${process.env.REACT_APP_BASEURL}/api/chat/group`,{
                name:groupName,
                users:JSON.stringify(selectedUsers.map(user=>user._id))
            }, config)
            setChats([data,...chats]);
            onClose();
            toast({
                title: "New group created successfully",
                status: "success",
                isClosable: true,
                duration: 4000,
                position: 'top'
            })
        }
        catch(err){
            toast({
                title: "Failed to create group",
                description:err.response.data,
                status: "error",
                isClosable: true,
                duration: 4000,
                position: 'top'
            })
        }
    }

    const handleGroup = (userToAdd) => {
        if (selectedUsers.filter(user=>user._id===userToAdd._id).length !==0) {
            toast({
                title: "User already added",
                status: "warning",
                isClosable: true,
                duration: 4000,
                position: 'top'
            })
            return;
        }
        setSelectedUsers([...selectedUsers, userToAdd])

    }

    const handleDelete = (userToDelete) => {
        setSelectedUsers(selectedUsers.filter(user => user._id !== userToDelete._id))
    }

    useEffect(() => {
        handleSearch()
    }, [search])

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
                            <Input placeholder='Group name' mb='3' onChange={(e) => setGroupName(e.target.value)} />
                        </FormControl>
                        <FormControl>
                            <Input placeholder='Add users ex: Ashanur, Honey, Ashik' mb='1' onChange={(e) => setSearch(e.target.value)} />
                        </FormControl>
                        <Box w='100%' display='flex' flexWrap='wrap'>
                            {
                                selectedUsers.map(user => (
                                    <UserBadge key={user._id} user={user} handleFunc={() => handleDelete(user)} />
                                ))
                            }
                        </Box>
                        {
                            loading ? <div>Loading...</div> : (
                                searchResults?.slice(0, 4).map(user => (
                                    <UserList key={user._id} user={user} handleFunc={() => handleGroup(user)} />
                                ))
                            )
                        }
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