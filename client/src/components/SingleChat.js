import React, { useState,useEffect } from 'react';
import axios from 'axios';
import "./styles.css";
import { ChatState } from '../context/chatProvider'
import { Box, Text, IconButton, Spinner, FormControl, Input, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSenderName, getSender } from '../config/chatLogic';
import ProfileModal from './mixed/ProfileModal';
import UpdateGroupModal from './mixed/UpdateGroupModal';
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client';
import Lottie from "lottie-react";
import animationTyping from "../animations/typing.json"

const ENDPOINT=process.env.REACT_APP_BASEURL;
var socket,selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {

    const toast = useToast();

    const { user, selectedChat, setSelectedChat } = ChatState();

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            setLoading(true);
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": user.token
                }
            }
            const { data } = await axios.get(`${process.env.REACT_APP_BASEURL}/api/message/${selectedChat._id}`, config);
            setMessages(data);
            setLoading(false);
            socket.emit('join_chat',selectedChat._id);

        } catch (err) {
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
    };

    const sendMessage = async (e) => {
        if (e.key === "Enter" && newMessage) {
            socket.emit('stop_typing',selectedChat._id)
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        "x-auth-token": user.token
                    }
                }
                const { data } = await axios.post(`${process.env.REACT_APP_BASEURL}/api/message`, {
                    chatId: selectedChat._id,
                    content: newMessage
                }, config);
                setNewMessage('');
                setMessages([...messages, data])
                socket.emit('new_message',data)
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
    }

    useEffect(()=>{
        socket=io(ENDPOINT);
        socket.emit('setup',user);
        socket.on("connected",()=>setSocketConnected(true));
        socket.on('typing',(userData)=>{
            if(userData._id !== user._id) setIsTyping(true);
        });
        socket.on('stop_typing',()=>setIsTyping(false));
    },[])

    const typingHandler = (e) => {
        setNewMessage(e.target.value)
        if(!socketConnected) return;
        if(!typing){
            setTyping(true);
            socket.emit('typing',selectedChat._id,user);
        }
        let lastTypingTime=new Date().getTime();
        var timerLength=3000;
        setTimeout(()=>{
            var timenow=new Date().getTime();
            var timeDiff=timenow-lastTypingTime;
            if(timeDiff>=timerLength && typing){
                socket.emit('stop_typing',selectedChat._id);
                setTyping(false);
            }
        },timerLength)
    }

    useEffect(()=>{
        fetchMessages();
        selectedChatCompare=selectedChat;
    },[selectedChat])

    useEffect(()=>{
        socket.on('message_received',(newMessage)=>{
            if(!selectedChatCompare || selectedChatCompare._id !== newMessage.chat._id){
                //give notification
            }
            else{
                setMessages([...messages,newMessage])
            }
        })
    })

    return (
        <>
            {
                selectedChat ? (
                    <>
                        <Text
                            fontSize={{ base: "21px", md: "30px" }}
                            pb={3}
                            px={2}
                            w="100%"
                            fontFamily="Work sans"
                            display="flex"
                            justifyContent={{ base: "space-between" }}
                            alignItems="center"
                        >
                            <IconButton
                                display={{ base: "flex", md: "none" }}
                                icon={<ArrowBackIcon />}
                                onClick={() => setSelectedChat("")}
                            />
                            {
                                (!selectedChat.isGroupChat) ? (
                                    <>
                                        {getSenderName(user, selectedChat.users)}
                                        <ProfileModal user={getSender(user, selectedChat.users)} />
                                    </>
                                ) : (
                                    <>
                                        {selectedChat.chatName.toUpperCase()}
                                        <UpdateGroupModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages} />
                                    </>
                                )
                            }
                        </Text>
                        <Box
                            display="flex"
                            flexDir="column"
                            justifyContent="flex-end"
                            p={3}
                            bg="#E8E8E8"
                            w="100%"
                            h="100%"
                            borderRadius="lg"
                            overflowY="hidden"
                        >
                            {
                                loading ? (
                                    <Spinner size='xl' w='20' h='20' alignSelf='center' margin='auto' />
                                ) : (
                                    <div className='messages'>
                                        <ScrollableChat messages={messages} />
                                    </div>
                                )
                            }
                            <FormControl onKeyDown={sendMessage} isRequired mt='3'>
                                {
                                    isTyping?<div style={{width:'60px'}}>
                                        <Lottie
                                        width={45}
                                         style={{marginBottom:'15',marginLeft:'0'}}
                                            animationData={animationTyping} 
                                         />
                                    </div>:<div style={{width:'60px'}}>{' '}</div>
                                }
                                <Input
                                    variant='filled'
                                    bg='#E0E0E0'
                                    placeholder='Enter a message...'
                                    onChange={typingHandler}
                                    value={newMessage}
                                />
                            </FormControl>
                        </Box>
                    </>
                ) : (
                    <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                        <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                            Click on a user to start chatting
                        </Text>
                    </Box>
                )
            }
        </>
    )
}

export default SingleChat