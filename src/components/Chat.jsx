import React, { useContext, useState } from 'react'
import SideDrawer from './Miscellaneous/SideDrawer'
import MyChats from './MyChats'
import ChatBox from './ChatBox'

const Chat = (props) => {

  const [fetchAgain , setFetchAgain] = useState(false)



    return (
      <div>
        {localStorage.getItem("userInfo") && <SideDrawer/>}

        <div className='flex justify-center '>
        {localStorage.getItem("userInfo") && <MyChats fetchAgain={fetchAgain} />}
        {localStorage.getItem("userInfo") && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}

        </div>


      </div>
    )
}

export default Chat
