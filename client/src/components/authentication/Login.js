import React, { useState } from 'react'
import { VStack, FormControl, FormLabel, Input, InputGroup, InputRightElement, Button } from '@chakra-ui/react'

const Login = () => {
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit=()=>{console.log(email,password)}

    return (
        <VStack spacing='5px'>
            <FormControl id='email2' isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder='Enter Your Email'
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>
            <FormControl id='password2' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show?"text":"password"}
                        placeholder='Enter Your Password'
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement w='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={()=>setShow(!show)}>
                            {show?"Hide":"Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <Button
                colorScheme='blue'
                w='100%'
                style={{marginTop:15}}
                onClick={handleSubmit}
            >
                Login
            </Button>
            <Button
                variant='solid'
                colorScheme='red'
                w='100%'
                onClick={()=>{
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