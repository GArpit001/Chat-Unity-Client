import React, { useEffect, useContext, useRef } from 'react'
import { useState } from 'react'
import ChatLoading from "./ChatLoading"
import { myContext } from '../../Context/context'
import { useNavigate } from 'react-router-dom'
import "../../App.css"
import Modal from './Modal'
import { getSender } from '../../config/ChatLogic'


import {
    Drawer,
    useDisclosure,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerBody,
    Input,
    Box,
    Button,
    useToast
} from '@chakra-ui/react'
import UserList from '../Avtar/UserList'

const SideDrawer = (props) => {

    // const BASEURL = "http://localhost:5000"
    const BASEURL = "https://backend-chat-unity.onrender.com"


    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState()

    const [modal, setModal] = useState(false)


    const allStates = useContext(myContext)
    const { user, setUser, chats, setChats, selectChat, setSelectChat, notification, setNotification } = allStates


    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()
    const history = useNavigate()



    const focusClick = () => {
        setModal(true)
    }


    const logOut = () => {
        localStorage.removeItem("userInfo")
        history("/")
    }

    const handleSearch = async () => {

        if (!search) {
            toast({
                title: 'Please Enter something in search.',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "top left"
            })
            return
        }

        try {
            setLoading(true)

            const data = await fetch(`${BASEURL}/api/auth/allUsers?search=${search}`, {
                method: "GET",
                headers: {
                    "auth-token": `${JSON.parse(localStorage.getItem("userInfo")).token}`
                }
            })

            const getData = await data.json()
            // console.log(getData)
            setLoading(false)
            setSearchResult(getData)


        } catch (error) {
            toast({
                title: 'Error Occured!.',
                description: "Failed to Load the Search Results",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom left"
            })
        }

    }


    const accessChat = async (userId) => {
        // console.log("Chat Access")
        // console.log(userId)
        // console.log(chats)

        try {
            setLoadingChat(true)

            const data = await fetch(`${BASEURL}/api/chat/createChat`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    "auth-token": `${JSON.parse(localStorage.getItem("userInfo")).token}`
                },
                body: JSON.stringify({ userId })
            })

            const getData = await data.json()
            // console.log(getData)

            if (!chats.find((c) => c._id === getData._id)) setChats([getData, ...chats]);

            setSelectChat(getData)
            setLoadingChat(false)
            onClose()

            // console.log(selectChat)

        } catch (error) {
            toast({
                title: 'Error fetching the chat',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom left"
            })
        }
    }




    return (
        <div>

            <div className="search px-2 bg-slate-50 flex justify-between items-center">
                <button className='flex leading-4 border border-slate-200 px-3 py-4 hover:bg-slate-200 transition-all ease-in' title='Search User' onClick={onOpen} >
                    <i className="fa-solid fa-magnifying-glass max-sm:px-3"></i>
                    <h1 className='ml-3 max-sm:hidden'>Search User</h1>

                    <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                        <DrawerOverlay />
                        <DrawerContent >
                            <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
                            <DrawerBody px={2} py={3} >
                                <Box d="flex" >
                                    <Input
                                        placeholder="Search by name "
                                        value={search}
                                        w="225px"
                                        mr={2}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                    <Button onClick={handleSearch}>Go</Button>
                                </Box>

                                {
                                    loading ? (
                                        <ChatLoading />
                                    ) : (
                                        searchResult?.map((user) => (
                                            <UserList key={user._id} user={user} handleFunction={() => accessChat(user._id)} />

                                        ))
                                    )}


                            </DrawerBody>
                        </DrawerContent>
                    </Drawer>

                </button>


                <div className="font-bold max-md:text-base whitespace-nowrap">
                    Chat Unity For User
                </div>

                <div className="sidemenu flex items-center pr-5">


                    <div className="bell dropdown">

                        <button className='dropbtn text-black border-0'>

                            {
                                selectChat ? "" : <div className={`absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full top-0 left-7 ${notification.length == 0 ? "hidden" : "block"} `}>{notification.length}</div>
                            }

                            <i className="fa-solid fa-bell pr-5 text-[20px] "></i>

                        </button>


                        <div className='dropdown-content z-10 hidden bg-white divide-y divide-gray-100 rounded-xl p-3 shadow w-44 '>
                            {!notification.length && "No New Messages"}

                            {notification.map((notif) => (
                                <div
                                    key={notif._id}
                                    onClick={() => {
                                        setSelectChat(notif.chat);
                                        setNotification(notification.filter((n) => n !== notif));
                                    }}
                                >
                                    {notif.chat.isGroupChat
                                        ? `New Message in ${notif.chat.chatName}`
                                        : `New Message from ${getSender(user, notif.chat.users)}`}
                                </div>
                            ))}

                        </div>

                    </div>

                    <div className="pro">

                        <div className="dropdown">
                            <button className="dropbtn flex-shrink-0 z-10 inline-flex items-center py-1 px-2 text-sm font-medium text-center text-gray-500 rounded-lg hover:bg-gray-200 dark:text-white " type="button">

                                <div className="relative flex items-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 ">
                                    {
                                        localStorage.getItem("userInfo") ? <img className='w-10 h-10' src={JSON.parse(localStorage.getItem("userInfo")).pic} alt="" /> :
                                            <svg className="absolute w-10 h-10 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                                    }

                                </div>
                                <svg className="w-2.5 h-2.5 ms-3 text-slate-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                                </svg>

                            </button>

                            <div className=" dropdown-content z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                                <ul className="  py-1 text-sm text-gray-700 dark:text-gray-200" >
                                    <li className=" cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={focusClick}>My Profile</li>

                                    <li className=" cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={logOut}>Log out</li>


                                </ul>

                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Modal  */}

            {
                modal && <Modal modal={modal} setModal={setModal} />
            }

        </div>
    )
}

export default SideDrawer
