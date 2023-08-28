import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { getSenderName } from '../config/chatLogic';
import GroupChatModal from './mixed/GroupChatModal';
import ChatLoading from './ChatLoading';
import { ChatState } from '../context/chatProvider'
import { useToast, Box, Button, Stack, Text } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

const MyChats = ({fetchAgain}) => {

  const toast = useToast();
  const [loggedUser, setLoggedUser] = useState('');
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": user.token
        }
      }
      const { data } = await axios.get(`${process.env.REACT_APP_BASEURL}/api/chat`, config);
      setChats(data);
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
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain])

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir='column'
      alignItems='center'
      p='3' bg='white'
      w={{ base: '100%', md: "31%" }}
      borderRadius='lg'
      borderWidth='1px'
    >
      <Box
        pb='3'
        px='3'
        fontSize={{ base: '28px', md: '30px' }}
        fontFamily='work sans'
        display='flex'
        w='100%'
        justifyContent='space-between'
        alignItems='center'
      >
        My Chats
        <GroupChatModal>
          <Button display='flex' fontSize={{ base: '17px', md: '10px', lg: '17px' }} rightIcon={<AddIcon />}>
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display='flex'
        flexDir='column'
        p='3'
        bg='#F8F8F8'
        w='100%'
        h='100%'
        borderRadius='lg'
        overflowY='hidden'
      >
        {
          chats ? (
            <Stack overflowY='scroll'>
              {
                chats.map(chat => (
                  <Box
                    onClick={() => setSelectedChat(chat)}
                    cursor='pointer'
                    bg={selectedChat === chat ? "#3882AC" : "#E8E8E8"}
                    color={selectedChat === chat ? "white" : "black"}
                    px='3' py='2'
                    borderRadius='lg'
                    key={chat._id}
                  >
                    <Text>
                      {
                        (!chat.isGroupChat && loggedUser)
                          ? getSenderName(loggedUser, chat.users)
                          : chat.chatName
                      }
                    </Text>
                  </Box>
                ))
              }
            </Stack>
          ) : (
            <ChatLoading />
          )
        }
      </Box>
    </Box>
  )
}

export default MyChats