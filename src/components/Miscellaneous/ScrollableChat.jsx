import React from 'react'
import {
    isLastMessage,
    isSameSender,
    isSameSenderMargin,
    isSameUser,
} from '../../config/ChatLogic'
import { Avatar, Tooltip } from '@chakra-ui/react'
import ScrollableFeed from 'react-scrollable-feed'
import { myContext } from '../../Context/context'
import { useContext } from 'react'
import "../../App.css"

const ScrollableChat = ({ message, loggedUser }) => {


    // console.log(loggedUser)

    return (
        // <div className='overflow-y-auto' >
        <ScrollableFeed className='scroller' >

            {
                message &&
                message.map((m, i) => (
                    <div key={m._id} style={{ display: "flex" }}>
                        {(isSameSender(message, m, i, loggedUser._id) ||
                            isLastMessage(message, i, loggedUser._id)) && (
                                <Tooltip label={m.sender.name} placement='bottom-start' hasArrow >

                                    <Avatar mt="7px" mr={1} size="sm" cursor="pointer" name={m.sender.name} src={m.sender.pic} />

                                </Tooltip>
                            )}

                        <span style={{
                            backgroundColor: `${m.sender._id === loggedUser._id ? "#BEE3F8" : "#B9F5D0"
                                }`,
                            marginLeft: isSameSenderMargin(message, m, i, loggedUser._id),
                            marginTop: isSameUser(message, m, i, loggedUser._id) ? 8 : 15,
                            borderRadius: "20px", padding: "5px 15px",
                            maxWidth: "75%"
                        }}>
                            {m.content}
                        </span>

                    </div>
                ))      
            }

        </ScrollableFeed>
    )
}

export default ScrollableChat