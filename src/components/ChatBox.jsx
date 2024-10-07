import { useConst } from '@chakra-ui/react'
import React, { useContext } from 'react'
import { myContext } from '../Context/context'
import SingleChat from './Miscellaneous/SingleChat'

const ChatBox = ({ fetchAgain, setFetchAgain }) => {

  const allState = useContext(myContext)
  const { selectChat } = allState

  return (
    <div className={`bg-white w-[77rem] overflow-x-hidden  m-2 rounded-2xl ${selectChat ? "" : "max-md:hidden"}`}>



      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />


    </div>
  )
}

export default ChatBox
