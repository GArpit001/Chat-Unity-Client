import React, { useContext } from 'react'
import "../../App.css"
import { myContext } from '../../Context/context'

const Modal = ({ eyeModal, setModal, user, modal }) => {

    // console.log(user)

    const closeModal = () => {
        setModal(false)
    }





    return (

        <div id="popup-modal" tabIndex="-1" className={` ${modal || eyeModal ? "" : "hidden"} flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-0rem)] max-h-full bg-[#00000087] select-none`}>
            <div className="relative  w-full max-w-md max-h-full ">
                <div className="relative  rounded-lg shadow bg-gray-400 border-2 border-black">
                    <button type="button" className="absolute top-3 end-2.5 text-white bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="popup-modal" onClick={closeModal}>

                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                    <div className="p-4 md:p-5 text-center text-black  text-2xl">

                        <div className='flex justify-center mb-3'>

                            <img src={eyeModal ? user.pic : JSON.parse(localStorage.getItem("userInfo")).pic} className='w-36 h-36 rounded-full  borderImg  ' alt="" />
                        </div>

                        <div >

                            <h3 className="mb-5  ">
                                <span className=''>  User Name : </span> <span className='text-red-500'> {eyeModal ? user.name : JSON.parse(localStorage.getItem("userInfo")).name} </span>
                            </h3>

                            <h1 className="mb-3 ">
                                <span className=''>  Email : </span>  <span className='text-red-500'> {eyeModal ? user.email : JSON.parse(localStorage.getItem("userInfo")).email} </span>
                            </h1>

                            {/* <h1>
                                {user.name}
                            </h1> */}
                        </div>


                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal
