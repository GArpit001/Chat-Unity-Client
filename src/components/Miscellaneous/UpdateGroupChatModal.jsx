import React, { useContext, useState, useEffect } from 'react'
import {
    Modal,
    useDisclosure,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Input,
    useToast,
} from '@chakra-ui/react'
import { myContext } from '../../Context/context'
import UserBadgeItem from './UserBadgeItem'
import UserList from '../Avtar/UserList'

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchAllMessage }) => {

   const BASEURL = "https://backend-chat-unity.onrender.com"
//    const BASEURL = "http://localhost:5000"


    const [groupChatName, setGroupChatName] = useState()
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [renameLoading, setRenameLoading] = useState(false)
    const [userid, setUserid] = useState()



    const { isOpen, onOpen, onClose } = useDisclosure()

    const allState = useContext(myContext)
    const { user, selectChat, setSelectChat } = allState

    const toast = useToast()


    useEffect(() => {
        setUserid(JSON.parse(localStorage.getItem("userInfo")))
    }, [fetchAgain])




    const handleAddUser = async (user1) => {

        if (selectChat.users.find((u) => u._id === user1._id)) {
            toast({
                title: "User Already in Group",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return
        }

        if (selectChat.groupAdmin._id !== JSON.parse(localStorage.getItem("userInfo"))._id) {
            toast({
                title: "Only Admins can Add Someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return
        }


        try {

            setLoading(true)

            const data = await fetch(`${BASEURL}/api/chat/addFromGroup`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": JSON.parse(localStorage.getItem("userInfo")).token
                },
                body: JSON.stringify({ chatId: selectChat._id, userId: user1._id })
            })

            const getData = await data.json()
            // console.log(getData)
            setSelectChat(getData)
            setFetchAgain(!fetchAgain)
            fetchAllMessage()
            setLoading(false)

        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false)
        }
        setGroupChatName("")

    }



    const handleRename = async () => {
        // console.log("Click The handleRename")
        setRenameLoading(true);


        if (!groupChatName) return

        try {

            // console.log(selectChat._id, groupChatName)

            const data = await fetch(`${BASEURL}/api/chat/groupRename`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": JSON.parse(localStorage.getItem('userInfo')).token
                },
                body: JSON.stringify({
                    chatId: selectChat._id, chatName: groupChatName
                })
            })

            const getData = await data.json()
            // console.log(getData)

            setSelectChat(getData)
            setFetchAgain(!fetchAgain)
            setRenameLoading(false);

        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.responce.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
            setRenameLoading(false);

        }
        setGroupChatName("")

    }

    const handleSearch = async (query) => {
        // console.log("Handle Search")

        setSearch(query)

        if (!query) {
            return;
        }

        try {

            setLoading(true)

            const data = await fetch(`${BASEURL}/api/auth/allUsers?search=${search}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": JSON.parse(localStorage.getItem("userInfo")).token
                }
            })

            const getData = await data.json()

            setLoading(false)
            setSearchResult(getData)
            // console.log(getData)


        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
            setLoading(false)
        }

    }



    const handleRemove = async (user1) => {

        // console.log(selectChat.groupAdmin._id)
        // // console.log(JSON.parse(localStorage.getItem("userInfo"))._id)
        // console.log(userid)
        // console.log(user1._id)

        if (selectChat.groupAdmin._id !== userid?._id && user1._id !== userid?._id) {
            toast({
                title: "Only admins can remove someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        try {
            setLoading(true);

            const data = await fetch(`${BASEURL}/api/chat/removeFromGroup`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": JSON.parse(localStorage.getItem("userInfo")).token
                },
                body: JSON.stringify({
                    chatId: selectChat._id,
                    userId: user1._id,
                })
            })

            const getData = await data.json()

            user1._id === userid?._id ? setSelectChat() : setSelectChat(getData);
            setFetchAgain(!fetchAgain);
            //   fetchMessages();
            setLoading(false);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.getData.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
        setGroupChatName("");
    };





    return (
        <>
            <Button onClick={onOpen}><i className="fa-solid fa-eye"></i></Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader mb={3} >{selectChat.chatName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <div className='flex flex-wrap '>

                            {
                                selectChat.users.map((u) => (
                                    <UserBadgeItem key={u._id} user={u} handleFunction={() => handleRemove(u)} />
                                ))
                            }

                        </div>

                        <div className="form flex mt-5">
                            <Input placeholder='Chat Name' mb={3} value={groupChatName} onChange={(e) => setGroupChatName(e.target.value)} />
                            <Button variant="solid"
                                colorScheme="teal"
                                ml={1}
                                isLoading={renameLoading}
                                onClick={handleRename} > Update </Button>
                        </div>

                        <div>
                            <Input placeholder='Add User to Group' mb={1} onChange={(e) => handleSearch(e.target.value)} />
                        </div>

                        {
                            loading ? (
                                <div>Loading....</div>
                            ) : (
                                searchResult?.map((user) => (
                                    <UserList key={user._id}
                                        user={user}
                                        handleFunction={() => handleAddUser(user)} />
                                ))
                            )
                        }

                    </ModalBody>

                    <ModalFooter>

                        <button type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800  font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2  dark:hover:bg-red-700 " onClick={() => handleRemove(user)}>
                            Leave Group
                        </button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )

}

export default UpdateGroupChatModal