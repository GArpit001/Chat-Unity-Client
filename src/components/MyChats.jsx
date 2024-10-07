import React, { useContext, useEffect, useState } from 'react'
import { useToast } from "@chakra-ui/toast";
import { Button, Text } from '@chakra-ui/react';
import { myContext } from '../Context/context';
import { getSender } from '../config/ChatLogic';
import ChatLoading from './Miscellaneous/ChatLoading';
import GroupChatModal from './Miscellaneous/GroupChatModal';

const MyChats = ({ fetchAgain }) => {

   const BASEURL = "https://backend-chat-unity.onrender.com"
  //  const BASEURL = "http://localhost:5000"


  const allStates = useContext(myContext)
  const { chats, setChats, selectChat, setSelectChat, user } = allStates

  const [loggedUser, setLoggedUser] = useState()

  const toast = useToast();


  const fetchChat = async () => {
    try {
      // console.log(user._id)

      const data = await fetch(`${BASEURL}/api/chat/fetchChat`, {
        method: "GET",
        headers: {
          "auth-token": `${JSON.parse(localStorage.getItem("userInfo")).token}`
        }
      })

      const getData = await data.json()
      setChats(getData)
      // console.log(getData, chats)


    } catch (err) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }

  }

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")))
    fetchChat()
  }, [fetchAgain])


  return (
    <div className={`bg-white w-[25rem] min-h-[88vh] m-2 rounded-2xl   ${selectChat ? "max-md:hidden max-md:w-[35rem]" : ""}`}>
      <div className='flex justify-between p-[10px] '>
        <h1 className='font-bold text-xl ml-2 mt-2 max-md:text-lg max-lg:text-xl' > My Chats</h1>

        <GroupChatModal>

          <Button className='max-lg-px-0' title='Create a New Group'> <i className="fa-solid fa-people-group"></i>+</Button>

        </GroupChatModal>
      </div>

    <div className='min-h-[77vh] bg-gray-200 rounded-xl m-2 pt-[0.2rem] '>

      <div className=' max-h-[77vh]   overflow-y-scroll scrollBarEdit'>
        {chats ? (
          <div >
            {chats.map((chat) => (
              <div onClick={() => setSelectChat(chat)} key={chat._id} className=" bg-gray-400  rounded-xl m-3 p-3 cursor-pointer font-medium hover:bg-green-600 hover:text-white" >
                <h2>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </h2>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}

              </div>
            ))}
          </div>

        ) : (
          <ChatLoading />
        )}


      </div>
    </div>



    </div>
  )
}

export default MyChats
