import React, { useContext, useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    FormControl,
    Input,
    useToast,
    Center
} from '@chakra-ui/react'
import { myContext } from '../../Context/context'
import UserList from '../Avtar/UserList'
import UserBadgeItem from './UserBadgeItem'

const GroupChatModal = ({ children }) => {


    // const BASEURL = "http://localhost:5000"
    const BASEURL = "https://backend-chat-unity.onrender.com"


    const allStates = useContext(myContext)
    const { user, chats, setChats } = allStates

    const { isOpen, onOpen, onClose } = useDisclosure()

    const [groupChatName, setgroupChatName] = useState()
    const [selectedUser, setSelectedUser] = useState([])
    const [search, setSearch] = useState("")
    const [searchResult, setsearchResult] = useState([])
    const [loading, setLoading] = useState(false)

    const toast = useToast()


    const handleGroup = (userToAdd) => {

        // console.log(chats)

        if (selectedUser.includes(userToAdd)) {
            toast({
                title: "User Already Added",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return
        }

        setSelectedUser([...selectedUser, userToAdd])

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
                    "auth-token": JSON.parse(localStorage.getItem("userInfo")).token
                }
            })

            const getData = await data.json()

            setLoading(false)
            setsearchResult(getData)
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
        }

    }


    const handleDelete = (delUser) => {
        setSelectedUser(selectedUser.filter((sel) => sel._id !== delUser._id))
    }


    const handleSubmit = async () => {

        // console.log(selectedUser)


        if (!groupChatName) {
            toast({
                // title: "Please Fill The All Details",
                title: "Please Fill the Group Name",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return
        }

        if (selectedUser.length === 0) {
            toast({
                title: "Please Select The Group Member",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return
        }

        if (selectedUser.length < 2) {
            toast({
                title: "Please Select The Min. 2 Group Member",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return
        }


        try {

            const data = await fetch(`${BASEURL}/api/chat/group`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": JSON.parse(localStorage.getItem('userInfo')).token
                },
                body: JSON.stringify({
                    name: groupChatName, users: JSON.stringify(selectedUser.map((u) => u._id))
                })
            })

            const getData = await data.json()
            // console.log(getData)

            setChats([getData, ...chats])
            onClose()


            toast({
                title: "Successfully Create a Chat",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top",
            });



        } catch (error) {
            toast({
                title: "Failed to create to chat",
                description: error.message,
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
        }




    }





    return (
        <>


            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader d="flex" justifyContent="center" fontSize="25px">Create Chat Group</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <Input placeholder='Chat Name' onChange={(e) => { setgroupChatName(e.target.value) }} />
                        </FormControl>

                        <FormControl>
                            <Input placeholder='"Add Users eg: John , Piyush, Jane ' my={2} onChange={(e) => handleSearch(e.target.value)} />
                        </FormControl>

                        <div className='flex flex-wrap '>

                            {
                                selectedUser.map((u) => (
                                    <UserBadgeItem key={u._id} user={u} handleFunction={() => handleDelete(u)} />
                                ))
                            }

                        </div>

                        {loading ? (
                            // <ChatLoading />
                            <div>Loading...</div>
                        ) : (
                            searchResult
                                ?.slice(0, 4)
                                .map((user) => (
                                    <UserList
                                        key={user._id}
                                        user={user}
                                        handleFunction={() => handleGroup(user)}
                                    />
                                ))
                        )}

                    </ModalBody>

                    <ModalFooter>
                        {/* <button  className='bg-blue-600 p-3 rounded-md text-white font-semibold cursor-pointer' disabled={selectedUser.length < 2 ? true : false} onClick={handleSubmit}> */}
                        <button className='bg-blue-600 p-3 rounded-md text-white font-semibold cursor-pointer' onClick={handleSubmit}>
                            Create Chat
                        </button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </>
    )
}

export default GroupChatModal