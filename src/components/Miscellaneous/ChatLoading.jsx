import React from 'react'
import { Skeleton, Stack, SkeletonText } from '@chakra-ui/react'

const ChatLoading = () => {
    return (
        <Stack>
            <Skeleton height='60px' />
            <Skeleton height='60px' />
            <Skeleton height='60px' />
            <Skeleton height='60px' />
            <Skeleton height='60px' />
            <Skeleton height='60px' />
            <Skeleton height='60px' />
            <Skeleton height='60px' />
            <Skeleton height='60px' />
            <Skeleton height='60px' />
            <Skeleton height='60px' />
        </Stack>
    )
}

export default ChatLoading