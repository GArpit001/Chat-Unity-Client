import React, { useState, useContext, useEffect } from 'react'
import { useToast } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { myContext } from '../../Context/context'
import Load from '../Miscellaneous/Load'
// import { myContext } from './Context/context'



const Login = (props) => {

    const username = useContext(myContext)
    // console.log(user)
    const { user, setUser } = username

    // const BASEURL = "http://localhost:5000"
    const BASEURL = "https://backend-chat-unity.onrender.com"




    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm()

    const toast = useToast()
    const history = useNavigate()
    const [show, setShow] = useState(false)



    const [login, setLogin] = useState({ email: "", password: "" })
    const { email, password } = login

    const handleClick = () => {
        setShow(!show)
        // console.log(show)
    }


    const onChange = (e) => {
        setLogin({ ...login, [e.target.name]: e.target.value })
    }





    const loginAccount = async () => {

        if (!email || !password) {

            toast({
                title: 'Please Fill all the Feilds.',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            //   setLoading(false)
            return


        }

        try {

            const responce = await fetch(`${BASEURL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password })
            })

            const getResponceData = await responce.json()
            // console.log(getResponceData.token)
            // setUser(getResponceData)
            // localStorage.setItem("info", getResponceData.name)
            // setUser(getResponceData)


            if (getResponceData.token) {
                toast({
                    title: 'Login Successful',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    position: "bottom"
                })

                // localStorage.setItem("token", getResponceData.token)
                localStorage.setItem("userInfo", JSON.stringify(getResponceData));
                setUser(getResponceData)



                history("/chat")

            } else {
                toast({
                    title: 'Invalid Details',
                    status: 'warning',
                    duration: 2000,
                    isClosable: true,
                    position: "top-right"
                })


            }
        } catch (error) {
            // console.log(error.message)

            toast({
                title: error.message,
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            //   setLoading(false)
            return

        }

    }




    return (
        <div className=''>
            <form className="" onSubmit={handleSubmit(loginAccount)} >
                <div className='relative'>
                    <label htmlFor="email" className="block my-2 text-base font-medium text-white ">Enter Your Email</label>
                    <i className="fa-regular fa-envelope absolute text-gray-400 text-[24px] left-3 top-11" ></i>
                    <input type="email" name="email" id="email" className="bg-[#00000081] border border-gray-600 text-white rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  pl-11 dark:border-gray-600 dark:placeholder-gray-400  " placeholder="xyz@gmail.com" required="" value={login.email} onChange={onChange}  autoComplete="true"/>
                </div>
                <div className='relative'>
                    <label htmlFor="password" className="block my-2 text-base font-medium text-white ">Enter Your Password</label>
                    <i className="fa-solid fa-lock absolute text-gray-400 text-[22px] left-3 top-11"></i>
                    <input type={`${show === true ? "text" : "password"}`} name="password" id="password" placeholder="••••••••" className="bg-[#00000081] border border-gray-600 text-white rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pl-10 dark:border-gray-600 placeholder-gray-400   " required="" value={login.password} onChange={onChange} />

                    <div className=' px-4 py-1 absolute top-10 right-2 rounded-lg cursor-pointer font-medium select-none text-white' onClick={handleClick}>{show === true ? <i className="ri-eye-fill"></i> : <i className="ri-eye-off-fill"></i>}</div>

                </div>

                <button type="submit" className="flex justify-center  mt-5 w-full text-white bg-blue-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-1.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">{isSubmitting ? <Load /> : <h1>Log In</h1>}</button>

                <button type="submit" className="mt-5 w-full text-white bg-red-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-1.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" onClick={() => {
                    setLogin({
                        email: "guest@example.com",
                        password: "123456"
                    })
                }} >  Get Guest User Credentials</button>

            </form>
        </div>
    )
}

export default Login
