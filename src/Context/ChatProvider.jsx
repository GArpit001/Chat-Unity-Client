import React, { useEffect } from 'react'
import { myContext } from './context'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const ChatProvider = (props) => {
    const [user, setUser] = useState()
    const [pro, setPro] = useState()
    const [selectChat, setSelectChat] = useState()
    const [chats, setChats] = useState([])
    const [notification, setNotification] = useState([])
    const history = useNavigate()


    const userInfo = JSON.parse(localStorage.getItem("userInfo"))

    useEffect(() => {

        if (!userInfo) {
            setUser(userInfo)
            history("/")
        }
    }, [history])

    // "start": "nodemon backend/server.js"






    return (
        <myContext.Provider value={{ user, setUser, pro, setPro, selectChat, setSelectChat, chats, setChats, notification, setNotification }}>
            {props.children}
        </myContext.Provider>
    )
}

export default ChatProvider
