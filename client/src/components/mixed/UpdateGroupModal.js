import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useDisclosure } from '@chakra-ui/hooks'
import {
  IconButton, Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalCloseButton, ModalBody, ModalFooter, Button, useToast, Box, FormControl, Input, Spinner
} from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import { ChatState } from '../../context/chatProvider'
import UserBadge from '../userAvatar/UserBadge'
import UserList from '../userAvatar/UserList'

const UpdateGroupModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const { user, selectedChat, setSelectedChat } = ChatState();

  const toast = useToast();

  const handleAddUser = async (userToAdd) => {
    if (selectedChat.users.find(user => user._id === userToAdd._id)) {
      toast({
        title: "User already exist in the group",
        status: "error",
        isClosable: true,
        duration: 4000,
        position: 'top'
      })
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admin can add member",
        status: "error",
        isClosable: true,
        duration: 4000,
        position: 'top'
      })
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
      const { data } = await axios.put(`${process.env.REACT_APP_BASEURL}/api/chat/groupadd`, {
        chatId: selectedChat._id,
        userId: userToAdd._id
      }, config);
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
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
      setLoading(false)
    }
  }

  const handleRemove = async (userToRemove) => {
    if (selectedChat.groupAdmin._id !== user._id && userToRemove._id !== user._id) {
      toast({
        title: "Only admin can remove member!",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
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
      const { data } = await axios.put(`${process.env.REACT_APP_BASEURL}/api/chat/groupremove`, {
        chatId: selectedChat._id,
        userId: userToRemove._id
      }, config);
      userToRemove._id===user._id?setSelectedChat():setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
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
      setLoading(false);
    }
  }

  const handleRename = async (userToRemove) => {
    if (!groupName) return;
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": user.token
        }
      }
      const { data } = await axios.put(`${process.env.REACT_APP_BASEURL}/api/chat/rename`, {
        chatId: selectedChat._id,
        chatName: groupName
      }, config);
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
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
      setRenameLoading(false);
    }
    setGroupName("");
  }

  const handleSearch = async (userToRemove) => {
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

  useEffect(() => {
    handleSearch()
  }, [search])

  return (
    <>
      <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize='35px'
            fontFamily='Work sans'
            display='flex'
            justifyContent='center'
          >{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w='100%' display='flex' flexWrap='wrap' pb='2'>
              {
                selectedChat.users.map(user => (
                  <UserBadge key={user._id} user={user} handleFunc={() => handleRemove(user)} />
                ))
              }
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Group Name"
                mb={3}
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => setSearch(e.target.value)}
              />
            </FormControl>
            {
              loading ? <Spinner size='lg' /> : (
                searchResults?.slice(0, 4).map(user => (
                  <UserList key={user._id} user={user} handleFunc={() => handleAddUser(user)} />
                ))
              )
            }
          </ModalBody>

          <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupModal