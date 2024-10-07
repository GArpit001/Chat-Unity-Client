import React from 'react'

const UserBadgeItem = ({ user, handleFunction }) => {
    // console.log(user)
    return (
        <div className='bg-purple-600 px-3 text-white rounded-xl cursor-pointer ml-2 mb-2' onClick={handleFunction}>
            {user.name}

            <span className='ml-3 '>
                x
            </span>
        </div>
    )
}

export default UserBadgeItem