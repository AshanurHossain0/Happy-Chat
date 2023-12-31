import React, { useState } from 'react';
import axios from 'axios';
import { ChatState } from '../../context/chatProvider';
import {useToast, VStack, FormControl, FormLabel, Input, InputGroup, InputRightElement, Button } from '@chakra-ui/react'
import {useHistory} from 'react-router-dom'

const Login = () => {
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const toast=useToast();
    const history=useHistory();
    const {setUser}=ChatState();

    const handleSubmit = async () => {
        setLoading(true);
        if (!email || !password) {
            toast({
                title: "Please Fill all the Feilds",
                status: "warning",
                duration: 4000,
                isClosable: true,
                position: "top",
            });
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };

            const { data } = await axios.post(
                `${process.env.REACT_APP_BASEURL}/api/user/login`,
                { email, password },
                config
            );

            toast({
                title: "Login Successful",
                status: "success",
                duration: 4000,
                isClosable: true,
                position: "top",
            });
            setUser(data);
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            history.push("/chats");
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            setLoading(false);
        }
    }

    return (
        <VStack spacing='5px'>
            <FormControl id='email2' isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder='Enter Your Email'
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
            </FormControl>
            <FormControl id='password2' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? "text" : "password"}
                        placeholder='Enter Your Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement w='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={() => setShow(!show)}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <Button
                colorScheme='blue'
                w='100%'
                style={{ marginTop: 15 }}
                onClick={handleSubmit}
                isLoading={loading}
            >
                Login
            </Button>
            <Button
                variant='solid'
                colorScheme='red'
                w='100%'
                onClick={() => {
                    setEmail('guest@example.com')
                    setPassword("123456")
                }}
            >
                Get guest user credential
            </Button>
        </VStack>
    )
}

export default Login