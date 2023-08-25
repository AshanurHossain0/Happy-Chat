import React from 'react'
import {Stack,Skeleton} from '@chakra-ui/react'

const ChatLoading = () => {
  return (
    <Stack>
        <Skeleton h='45px' />
        <Skeleton h='45px' />
        <Skeleton h='45px' />
        <Skeleton h='45px' />
        <Skeleton h='45px' />
        <Skeleton h='45px' />
        <Skeleton h='45px' />
    </Stack>
  )
}

export default ChatLoading