import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import {ChatState} from "../context/chatProvider.js"
import {Flex} from "@chakra-ui/react"

import SideDrawer from '../components/mixed/SideDrawer.js';
import MyChats from '../components/MyChats.js';
import ChatBox from '../components/ChatBox.js';

const ChatPage = () => {

  const history=useHistory();
  const {user}=ChatState();
  const [fetchAgain,setFetchAgain]=useState(false);

  useEffect(()=>{
    if(!user) history.push("/")
  },[])

  return (
    <div style={{width:"100%"}}>
      {user && <SideDrawer/>}
      <Flex justifyContent="space-between" w='100%' h='91.5vh' p='10px'>
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Flex>
    </div>
  )
}

export default ChatPage