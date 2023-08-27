import { Box } from '@chakra-ui/react'
import {CloseIcon} from '@chakra-ui/icons'
import React from 'react'

const UserBadge = ({user,handleFunc}) => {
  return (
    <Box
        px='2'
        py='1'
        borderRadius='lg'
        m='1'
        mb='2'
        variant='solid'
        fontSize='12'
        backgroundColor='green'
        color='white'
        cursor='pointer'
        onClick={handleFunc}
    >
        {user.name}
        <CloseIcon boxSize='16px' pl='2'/>
    </Box>
  )
}

export default UserBadge