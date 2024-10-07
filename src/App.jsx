// import { useEffect, useState } from 'react'
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import Home from './components/Home'
import Chat from "./components/Chat"
import ChatProvider from './Context/ChatProvider'


function App() {



  return (
    <>

      <div className='App overflow-y-hidden'>

        <ChatProvider>

          <Routes>

            <Route exact path='/' element={<Home />} />

            <Route exact path='/chat' element={<Chat />} />



          </Routes>
        </ChatProvider>
      </div>

    </>
  )
}

export default App
