import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { ChatState } from '../../context/chatProvider';
import { useDisclosure } from '@chakra-ui/hooks';
import {
    Box, Tooltip, Button, Text, Menu, MenuButton, MenuList, Avatar, MenuItem, MenuDivider,
    Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Input,useToast,Spinner
} from "@chakra-ui/react"
import { Search2Icon, BellIcon, ChevronDownIcon, CloseIcon } from '@chakra-ui/icons'

import ProfileModal from './ProfileModal';
import ChatLoading from '../ChatLoading';
import UserList from '../userAvatar/UserList';

const SideDrawer = () => {

    const history = useHistory();
    const handleLogout = () => {
        localStorage.removeItem("userInfo");
        history.push("/");
    }

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);

    const { user,setSelectedChat,chats,setChats } = ChatState();

    const toast=useToast();
    const handleSearch = async () => {
        if(!search){
            toast({
                title:"Write something to search",
                status:"warning",
                isClosable:true,
                duration:4000,
                position:'top-left' 
            })
            return;
        }

        try{
            setLoading(true);
            const config={
                headers:{
                    "Content-Type": "application/json",
                    "x-auth-token": user.token
                }
            }
            const {data}=await axios.get(`${process.env.REACT_APP_BASEURL}/api/user?search=${search}`,config)
            setLoading(false);
            setSearchResult(data);
        }
        catch(err){
            toast({
                title:"Error occured!",
                description:err.message,
                status:"error",
                isClosable:true,
                duration:4000,
                position:'top-left' 
            })
        }
    }
    const accessChat=async (userId)=>{
        try{
            setLoadingChat(true);
            const config={
                headers:{
                    "Content-Type": "application/json",
                    "x-auth-token": user.token
                }
            }
            const {data}=await axios.post(`${process.env.REACT_APP_BASEURL}/api/chat`,{userId},config);
            if(!chats.find(chat=>chat._id === data._id)) setChats([data,...chats])
            setSelectedChat(data);
            setLoadingChat(false);
            onClose();
        }
        catch(err){
            toast({
                title:"Error occured!",
                description:err.message,
                status:"error",
                isClosable:true,
                duration:4000,
                position:'top-left' 
            })
        }
    }

    return (
        <>
            <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                bg='white'
                w='100%'
                p='5px 10px 5px 10px'
                borderWidth='5px'
            >
                <Tooltip label='search users to chat' hasArrow placement='bottom-end'>
                    <Button variant='ghost' onClick={onOpen}>
                        <Search2Icon />
                        <Text display={{ base: "none", md: "flex" }} px="4">Search User</Text>
                    </Button>
                </Tooltip>

                <Text fontSize={{base:"xl",md:"2xl"}} fontFamily='work sans' >Happy-To-Chat</Text>

                <div>
                    <Menu>
                        <MenuButton p='1'>
                            <BellIcon fontSize={{base:'xl',md:'2xl'}} margin='1' />
                        </MenuButton>
                        {/* <MenuList></MenuList> */}
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />} >
                            <Avatar size='sm' cursor='pointer' name={user.name} src={user.pic} />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem onClick={handleLogout} >Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>
            <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth='1px' display='flex' justifyContent='space-between' alignItems='center'>
                        <Text>Search User</Text>
                        <Button variant='solid' onClick={onClose} >
                            <CloseIcon />
                        </Button>
                    </DrawerHeader>
                    <DrawerBody>
                        <Box display='flex' pb='2'>
                            <Input
                                placeholder="Search by email or name"
                                mr='2'
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button onClick={handleSearch} >Go</Button>
                        </Box>
                        {
                            loading?(
                                <ChatLoading/>
                            ):(
                                searchResult?.map(user=>(
                                    <UserList
                                        key={user._id}
                                        user={user}
                                        handleFunc={()=>accessChat(user._id)}
                                    />
                                ))
                            )
                        }
                        {loadingChat && <Spinner ml='auto' display='flex' />}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default SideDrawer