import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useToast, VStack, FormControl, FormLabel, Input, InputGroup, InputRightElement, Button,Text } from '@chakra-ui/react'

const Signup = () => {

    const [show, setShow] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');
    const [pic, setPic] = useState('');
    const [loading, setLoading] = useState(false);
    const [otp,setOtp]=useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [timeLeft,setTimeLeft]=useState(160);

    const toast = useToast();

    const postPic = (pic) => {
        setLoading(true);
        if (pic === undefined) {
            toast({
                title: 'Select an image',
                status: 'warning',
                duration: 4000,
                isClosable: true,
                position: "top"
            })
            return;
        }
        if (pic.type === "image/jpeg" || pic.type === "image/png") {
            const data = new FormData();
            data.append('file', pic);
            data.append('folder', 'happy-to-chat');
            data.append('upload_preset', 'happy-to-chat');
            data.append('cloud_name', 'dglwbgm9j');
            fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDNAME}/image/upload`, {
                method: 'post',
                body: data
            }).then(res => res.json())
                .then(data => {
                    setPic(data.url.toString());
                    setLoading(false);
                    return;
                })
                .catch(err => {
                    console.log(err);
                    setLoading(false);
                    return;
                })
        }
        else {
            toast({
                title: 'Select an image',
                status: 'warning',
                duration: 4000,
                isClosable: true,
                position: "top"
            })
            return;
        }
    }
    const handleSubmit = async () => {
        setLoading(true);
        if (!name || !email || !password || !confirmpassword) {
            toast({
                title: "Please Fill all the Feilds",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top"
            });
            setLoading(false);
            return;
        }
        if (password !== confirmpassword) {
            toast({
                title: "Passwords Do Not Match",
                status: "warning",
                duration: 4000,
                isClosable: true,
                position: "top"
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
                `${process.env.REACT_APP_BASEURL}/api/user`,
                { name, email, password, pic },
                config
            );
            setLoading(false);
            setIsVerifying(true);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top"
            });
            setLoading(false);
        }
    }

    const handleSubmitOtp= async ()=>{
        setLoading(true);
        if (otp==0) {
            toast({
                title: "Please fill the otp field",
                status: "warning",
                duration: 4000,
                isClosable: true,
                position: "top"
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
                `${process.env.REACT_APP_BASEURL}/api/user/verify`,
                { email,otp },
                config
            );
            setIsVerifying(false);
            setLoading(false);
            setOtp()
            toast({
                title: "Registration Successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top"
            });
            
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 4000,
                isClosable: true,
                position: "top"
            });
            setOtp();
            setLoading(false);
        }

    }

    useEffect(()=>{
        if(isVerifying){
            const intId=setInterval(()=>{
                if(timeLeft>0){
                    setTimeLeft(time=>time-1);
                }
                if(timeLeft<=0){
                    setIsVerifying(false);
                    clearInterval(intId);
                }
            },1000)

            return ()=>{clearInterval(intId)};
        }
    },[isVerifying,timeLeft])

    return (
        <div>
            {
                !isVerifying ? (
                    <VStack spacing='5px'>
                        <FormControl id='full-name' isRequired>
                            <FormLabel>Name</FormLabel>
                            <Input
                                value={name}
                                placeholder='Enter Your Name'
                                onChange={(e) => setName(e.target.value)}
                            />
                        </FormControl>
                        <FormControl id='email' isRequired>
                            <FormLabel>Email</FormLabel>
                            <Input
                                value={email}
                                placeholder='Enter Your Email'
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </FormControl>
                        <FormControl id='password' isRequired>
                            <FormLabel>Password</FormLabel>
                            <InputGroup>
                                <Input
                                    value={password}
                                    type={show ? "text" : "password"}
                                    placeholder='Enter Your Password'
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <InputRightElement w='4.5rem'>
                                    <Button h='1.75rem' size='sm' onClick={() => setShow(!show)}>
                                        {show ? "Hide" : "Show"}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <FormControl id='confirm-password' isRequired>
                            <FormLabel>Confirm Password</FormLabel>
                            <InputGroup>
                                <Input
                                    value={confirmpassword}
                                    type={show ? "text" : "password"}
                                    placeholder='Confirm Password'
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <InputRightElement w='4.5rem'>
                                    <Button h='1.75rem' size='sm' onClick={() => setShow(!show)}>
                                        {show ? "Hide" : "Show"}
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
                            style={{ marginTop: 15 }}
                            onClick={handleSubmit}
                            isLoading={loading}
                        >
                            Sign Up
                        </Button>
                    </VStack>
                ) : (
                    <VStack spacing='5px'>
                        <FormControl id='otp' isRequired>
                            <FormLabel>OTP</FormLabel>
                            <Input
                                value={otp}
                                placeholder='Enter OTP'
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        </FormControl>
                        {
                            isVerifying && <Text color='green' >Time Left : {timeLeft}s</Text>
                        }
                        
                        <Button
                            isDisabled={loading}
                            colorScheme='blue'
                            w='100%'
                            style={{ marginTop: 15 }}
                            onClick={handleSubmitOtp}
                            isLoading={loading}
                        >
                            Verify OTP
                        </Button>
                    </VStack>
                )
            }
        </div>
    )
}

export default Signup