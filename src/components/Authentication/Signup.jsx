import React, { useContext, useState } from 'react'
import { useConst, useToast } from '@chakra-ui/react'
import { Button, ButtonGroup } from '@chakra-ui/react'
// import { useNavigation } from 'react-router-dom'
import { useForm } from "react-hook-form"

import { useNavigate } from "react-router-dom"
import { myContext } from '../../Context/context'
import Load from '../Miscellaneous/Load'


const Signup = (props) => {

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
  const [pic, setPic] = useState()
  const [loading, setLoading] = useState(false)

  const [signup, setSignup] = useState({ name: "", email: "", password: "", confirmpassword: "" })
  const { name, email, password, confirmpassword } = signup



  // const [name, setName] = useState()
  // const [email, setEmail] = useState()
  // const [password, setPassword] = useState()
  // const [confirmpassword, setConfirmPassword] = useState()

  const handleClick = () => {
    setShow(!show)
    // console.log(show)
  }

  const postDetail = (pics) => {
    // console.log("Changed")
    // console.log(pics)

    setLoading(true)

    if (pics === undefined) {

      toast({
        title: 'Please Select an Image!.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })
      return

    }


    if (pics.type === "image/jpeg" || pics.type === "image/png" || pics.type === "image/jpg") {

      const data = new FormData()
      data.append("file", pics)
      data.append("upload_preset", "chat-app")
      data.append("cloud_name", "mycodeworld")

      fetch("https://api.cloudinary.com/v1_1/mycodeworld/image/upload", {
        method: 'post',
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString())
          // console.log(data.url.toString());
          setLoading(false)
        })
        .catch((err) => {
          // console.log(err)
          setLoading(false)
        })
    }
    else {
      toast({
        title: 'Please Select an Image?.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })
      setLoading(false)
    }

  }


  const onChange = (e) => {
    setSignup({ ...signup, [e.target.name]: e.target.value })

  }

  const createAccount = async () => {
    setLoading(true)

    if (!name || !email || !password || !confirmpassword) {


      toast({
        title: 'Please Fill all the Feilds.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })
      setLoading(false)
      return

    }

    if (password !== confirmpassword) {
      toast({
        title: 'Password Do Not Match.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })
      return setLoading(false)

    }

    try {

      const responce = await fetch(`${BASEURL}/api/auth/createUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, pic })
      })


      const data = await responce.json()
      // console.log(data)

      if (data.error) {
        toast({
          title: 'User Already Registered',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: "bottom"
        })
        setLoading(false)
      } else {
        toast({
          title: 'Registration Successful',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: "bottom"
        })
        setLoading(false)


        // localStorage.setItem("userInfo", JSON.stringify(data))

        setSignup({
          name: "",
          email: "",
          password: "",
          confirmpassword: "",
        })

        props.setCount(1)

        history("/")
      }
    } catch (err) {
      toast({
        title: 'Some Error',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })
      setLoading(false)
    }




  }


  return (
    <div>

      <form className="" onSubmit={handleSubmit(createAccount)}>
        <div className='relative'>
          <label htmlFor="name" className="block my-2 text-base font-medium text-white ">Enter Name <span className='text-red-500'>*</span></label>
          <i className="fa-solid fa-user absolute text-gray-400 text-[18px] left-3 top-10"></i>
          <input type="text" name="name" id="name" className="bg-[#00000081] border border-gray-600 text-white text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full py-1.5 px-2 pl-10 dark:border-gray-600 placeholder-gray-400 " placeholder="Enter Your Name" required="" value={signup.name} onChange={onChange} autoComplete="true"  />
        </div>
        <div className='relative'>
          <label htmlFor="email" className="block my-2 text-base font-medium text-white ">Email Address <span className='text-red-500'>*</span> </label>
          <i className="fa-regular fa-envelope absolute text-gray-400 text-[18px] left-3 top-10" ></i>

          <input type="email" name="email" id="emails" className="bg-[#00000081] border border-gray-600 text-white text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full py-1.5 px-2 pl-10 placeholder-gray-400" placeholder="xyz@gmail.com" required="" value={signup.email} onChange={onChange} autoComplete="true" />
        </div>
        <div className='relative'>
          <label htmlFor="password" className="block my-2 text-base font-medium text-white ">Password <span className='text-red-500'>*</span></label>
          <i className="fa-solid fa-lock absolute text-gray-400 text-[18px] left-3 top-10"></i>
          <input type={show === true ? "text" : "password"} name="password" id="passwords" placeholder="••••••••" className="bg-[#00000081] border border-gray-600 text-white text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full py-1.5 px-2 pl-10  placeholder-gray-400  " required="" value={signup.password} onChange={onChange} />

          <div className=' px-2 py-0 absolute top-9 right-2 rounded-lg cursor-pointer font-medium select-none text-white' onClick={handleClick}>{show === true ? <i className="ri-eye-fill"></i> : <i className="ri-eye-off-fill"></i>}</div>

        </div>
        <div className='relative '>
          <label htmlFor="confirm-password" className="block my-2 text-base font-medium text-white ">Confirm password <span className='text-red-500'>*</span></label>
          <i className="fa-solid fa-lock absolute text-gray-400 text-[18px] left-3 top-10"></i>
          <input type="password" name="confirmpassword" id="confirmpassword" placeholder="••••••••" className="bg-[#00000081] border border-gray-600 text-white text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full py-1.5 px-2 pl-10 placeholder-gray-400  " required="" value={signup.confirmpassword} onChange={onChange} />

          {/* <div className='bg-gray-300 px-2 py-0 absolute top-9 right-2 rounded-lg cursor-pointer font-medium select-none' onClick={handleClick}>{show === true ? <i className="ri-eye-fill"></i> : <i className="ri-eye-off-fill"></i>}</div> */}

        </div>

        <div>
          <label htmlFor="name" className="block my-2 text-base font-medium text-white ">Upload Your Picture</label>
          <input className="block h-[36px]  w-full  text-white border border-gray-600 rounded-lg cursor-pointer bg-[#00000081]  focus:outline-none  dark:border-gray-600 placeholder-white " aria-describedby="user_avatar_help" id="user_avatar" type="file" onChange={(e) => { postDetail(e.target.files[0]) }} />
        </div>

        <button type="submit" className=" flex justify-center mt-5 w-full text-white bg-blue-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-1.5 text-center dark:focus:ring-primary-800">{loading ?  <Load /> : "Create an Account" } </button>


      </form>

    </div>
  )
}

export default Signup
