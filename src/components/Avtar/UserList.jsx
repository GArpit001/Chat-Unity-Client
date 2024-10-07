import React from 'react'

const UserList = ({user , handleFunction}) => {
    return (
        <div className='flex items-center  mx-2 my-2 bg-gray-200 rounded-lg px-4 py-2 transition-colors hover:bg-green-600 hover:text-white border border-slate-300' onClick={handleFunction}>

            <img src={user.pic} className='w-[50px] h-[50px] rounded-full border-3 border-black' alt="" />

            <h1 className='ml-4 text-xl'>
                {user.name}
            </h1>

        </div>
    )
}

export default UserList