import { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

const ChatContext=createContext();

const ChatProvider=({children})=>{
    const [user,setUser]=useState();
    const [selectedChat,setSelectedChat]=useState();
    const [chats,setChats]=useState([]);
    const [notification,setNotification]=useState([]);

    const history=useHistory();

    const getUser= async (token)=>{
        try{
            const config = {
                headers: {
                    "Content-type": "application/json",
                    "x-auth-token": token
                },
            };

            const { data } = await axios.post(
                `${process.env.REACT_APP_BASEURL}/api/user/user`,config
            );
            localStorage.setItem('userInfo',JSON.stringify(data));
            setUser(data);
        }
        catch(err){
            localStorage.removeItem('userInfo');
            history.push("/")
        }
    }

    useEffect(()=>{
        const userInfo=JSON.parse(localStorage.getItem('userInfo'));
        
    },[history])
    return (
        <ChatContext.Provider value={{
            user,setUser,selectedChat,setSelectedChat,chats,setChats,notification,setNotification
            }} >
        {children}
        </ChatContext.Provider>
    )
}

export const ChatState=()=>{
    return useContext(ChatContext);
}

export default ChatProvider;