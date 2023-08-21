import React, { useState } from 'react'
import { VStack, FormControl, FormLabel, Input, InputGroup, InputRightElement, Button } from '@chakra-ui/react'

const Signup = () => {

    const [show, setShow] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');
    const [pic, setPic] = useState('');

    const postPic=()=>{}
    const handleSubmit=()=>{console.log(name,email,password,confirmpassword)}

    return (
        <VStack spacing='5px'>
            <FormControl id='full-name' isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                    placeholder='Enter Your Name'
                    onChange={(e) => setName(e.target.value)}
                />
            </FormControl>
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder='Enter Your Email'
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>
            <FormControl id='password' isRequired>
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
            <FormControl id='confirm-password' isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show?"text":"password"}
                        placeholder='Confirm Password'
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <InputRightElement w='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={()=>setShow(!show)}>
                            {show?"Hide":"Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id='pic'>
                <FormLabel>Upload Profile Picture</FormLabel>
                <Input
                    type='file'
                    p='1.5'
                    accept='image/*'
                    onChange={(e) => postPic(e.target.files[0])}
                />
            </FormControl>
            <Button
                colorScheme='blue'
                w='100%'
                style={{marginTop:15}}
                onClick={handleSubmit}
            >
                Sign Up
            </Button>
        </VStack>
    )
}

export default Signup