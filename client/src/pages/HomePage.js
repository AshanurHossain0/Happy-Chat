import React from 'react'
import { Container, Text, Flex,Tabs,Tab,TabPanels,TabPanel,TabList } from "@chakra-ui/react";
import Login from '../components/authentication/Login';
import Signup from '../components/authentication/Signup';

const HomePage = () => {

  return (
    <Container maxW='xl' centerContent>
      <Flex
        justifyContent="center"
        p='3'
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily="Work sans">
          Happy-To-Chat
        </Text>
      </Flex>
      <Flex bg='white' w='100%' p='4' borderRadius='lg' borderWidth='1px'>
        <Tabs w='100%' variant='soft-rounded' >
          <TabList mb='1em'>
            <Tab w='50%'>Login</Tab>
            <Tab w='50%'>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login/>
            </TabPanel>
            <TabPanel>
              <Signup/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </Container>
  )
}

export default HomePage