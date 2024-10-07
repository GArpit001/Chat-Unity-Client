import React, { useContext, useEffect, useState } from 'react'
import { myContext } from '../../Context/context'
import { Button, Spinner, useToast } from '@chakra-ui/react'
import { getSender, getSenderFull } from '../../config/ChatLogic'
import Modal from './Modal'
import UpdateGroupChatModal from './UpdateGroupChatModal'
import ScrollableChat from './ScrollableChat'
// import Lottie from 'react-lottie'
import animationData from "../../animations/typing.json"
import "../../App.css"
import Loading from '../Loaing/Loading'


import io from "socket.io-client"


const ENDPOINT = "https://backend-chat-unity.onrender.com"
// const ENDPOINT = "http://localhost:5000"

var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {

    // const BASEURL = "http://localhost:5000"
    const BASEURL = "https://backend-chat-unity.onrender.com"


    const [message, setMessage] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState("")
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)


    const allState = useContext(myContext)
    const { user, selectChat, setSelectChat, notification, setNotification } = allState


    const [eyeModal, setModal] = useState(false)
    const [loggedUser, setLoggedUser] = useState()

    const toast = useToast()

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };


    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")))

    }, [fetchAgain])


    const fetchAllMessage = async () => {

        if (!selectChat) return;

        try {
            setLoading(true)

            const data = await fetch(`${BASEURL}/api/message/${selectChat._id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": JSON.parse(localStorage.getItem("userInfo")).token
                }
            })


            const getData = await data.json()
            setMessage(getData)
            setLoading(false)


            socket.emit("join chat", selectChat._id)




        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Message! ",
                // description : error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
        }

    }



    const sendMessage = async (event) => {

        if (event.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectChat._id)
            try {
                const data = await fetch(`${BASEURL}/api/message/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": JSON.parse(localStorage.getItem("userInfo")).token
                    },
                    body: JSON.stringify({ content: newMessage, chatId: selectChat._id })
                })

                setNewMessage("")

                const getData = await data.json()

                socket.emit("new message", getData);
                setMessage([...message, getData])


            } catch (error) {
                toast({
                    title: "Error Occured!",
                    description: "Failed to send the Message! ",
                    // description : error.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "top",
                });
            }
        }

    }



    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", JSON.parse(localStorage.getItem("userInfo")));
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true))
        socket.on("stop typing", () => setIsTyping(false))
    }, [])



    useEffect(() => {
        fetchAllMessage()

        selectedChatCompare = selectChat


    }, [selectChat])


    useEffect(() => {
        socket.on("message recieved", (newMessageRecieved) => {
            if (
                !selectedChatCompare || // if chat is not selected or doesn't match current chat
                selectedChatCompare._id !== newMessageRecieved.chat._id
            ) {
                if (!notification.includes(newMessageRecieved)) {
                    setNotification([newMessageRecieved, ...notification])
                    setFetchAgain(!fetchAgain)
                }
            }
            else {
                // setMessage([...message, newMessageRecieved]);
                setMessage([...message, newMessageRecieved])
            }
        });
    });




    const typingHandler = (e) => {
        setNewMessage(e.target.value)

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true)
            socket.emit("typing", selectChat._id)
        }

        let lastTypingTime = new Date().getTime()
        var timerLength = 3000;

        setTimeout(() => {
            var timeNow = new Date().getTime()
            var timeDiff = timeNow - lastTypingTime
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectChat._id)
                setTyping(false)
            }
        }, timerLength)

    }








    return (
        <div className='p-3'>


            <div>
                {
                    selectChat ?
                        <>

                            <div className='flex justify-between items-center'>


                                <div className={`topper md:hidden `}>
                                    <Button onClick={() => { setSelectChat("") }}>
                                        <i className="fa-solid fa-arrow-left-long"></i>
                                    </Button>
                                </div>

                                <div className='w-full'>

                                    {
                                        !selectChat.isGroupChat ? (
                                            <>

                                                <div className=' pl-6 flex justify-between items-center'>

                                                    <div>
                                                        <h1 className='text-xl '>
                                                            {getSender(loggedUser, selectChat.users)}
                                                        </h1>
                                                    </div>




                                                    {/* <div className='flex leading-9'>
                                                        <div className='pr-5'>
                                                            <i className="fa-solid fa-trash"></i>
                                                        </div> */}
                                                    <div>
                                                        <Button onClick={() => setModal(true)}>
                                                            <i className="fa-solid fa-eye"></i>
                                                        </Button>

                                                        {
                                                            eyeModal && <Modal eyeModal={eyeModal} setModal={setModal} user={getSenderFull(loggedUser, selectChat.users)} />
                                                        }

                                                    </div>

                                                </div>

                                            </>
                                        )

                                            :
                                            (
                                                <>
                                                    <div className='flex justify-between items-center pl-6'>
                                                        <div className=' text-center'>
                                                            <h1 className='text-xl '>
                                                                {selectChat.chatName.toUpperCase()}
                                                            </h1>
                                                        </div>

                                                        <UpdateGroupChatModal fetchAgain={fetchAgain}
                                                            setFetchAgain={setFetchAgain} fetchAllMessage={fetchAllMessage} />

                                                    </div>



                                                </>

                                            )
                                    }

                                </div>

                            </div>

                            <div className='bg-gray-200 p-3 mt-2 flex flex-col justify-end min-h-[76vh] rounded-lg'>


                                <div className='  max-h-[76vh]  flex flex-col justify-end   '>
                                    {
                                        loading ? (
                                            <Spinner size="xl"
                                                w={20}
                                                h={20}
                                                alignSelf="center"
                                                margin="auto" />
                                        ) : (
                                            <div className='flex flex-col overflow-y-scroll  scrolls' style={{ scrollbarWidth: "none" }}>

                                                <ScrollableChat message={message} loggedUser={loggedUser} />

                                            </div>
                                        )
                                    }

                                    <div className=' flex flex-col w-full' onKeyDown={sendMessage}>

                                        {isTyping ? <div>
                                            <Loading />
                                        </div> : <></>}

                                        <input type="text" className='w-full rounded-lg mt-2 bg-slate-200' placeholder='Enter the message...' value={newMessage} onChange={typingHandler} />
                                    </div>

                                </div>

                            </div>


                        </> :

                        <div className='flex justify-center items-center  h-[400px]'>
                            <div>
                                <h1 className='text-3xl font-bold'>Click on a user to start chatting</h1>
                            </div>

                        </div>
                }
            </div>

        </div>
    )
}

export default SingleChat