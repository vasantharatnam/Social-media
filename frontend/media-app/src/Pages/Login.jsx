import React from 'react'
import {TbSocial} from "react-icons/tb"
import TextInput from '../Components/TextInput'
import {useForm} from 'react-hook-form'
import ResetPassword from './ResetPassword';
import {Link} from 'react-router-dom'
import {useState} from 'react'
import { useDispatch } from 'react-redux';
import CustomButton from '../Components/CustomButton';
import Loading from '../Components/Loading';
import img from '../assets/img.jpeg';


function Login() {

    const {register , handleSubmit , formState : {errors}} = useForm({mode:"onChange"});

    const [errMsg , setErrMsg] = useState("");
    const [isSubmitting , setIsSubmitting] = useState(false);
    const dispatch = useDispatch();

  return (
    <div className = "bg-bgColor w-full h-[100vh] flex items-center justify-center p-6">
      <div className = "w-full md:w-2/3 h-fit lg:h-full 2xl:h-5/6 py-8  lg:py-0 flex bg-primary rounded-x1 overflow-hidden shadow-x1" >
         <div className = "w-full lg:w=1/2 h-full p-10 2xl:px-20 flex flex-col justify-center">
              <div className ="w-full flex gap-2 items-center mb-6">
                  <div className = "p-2 bg-[#065ad8] rounded text-white">
                        <TbSocial/>
                  </div>
                   <span className ="text-2xl text-[#065ad8]" font-semibold>OnlineMedia</span>
              </div>
               <p className = "text-ascent-1 text-base font-semibold">
                Log in to your account
               </p>
               <span className='text-sm mt-2  text-ascent-2'>Welcome back</span>

            <form className = "py-8 flex flex-col gap-5">
                <TextInput type = "email" placeholder = "Email"  label = "Email address"  name = "email"  register = {register("email" , {required:"Email is required"})} styles= "w-full rounded-full"  labelStyle = 'ml-2' errors = {errors.email ? errors.email.message : null}/>
                <TextInput type = "password" placeholder = "Password"  label = "Password"  name = "Password"  register = {register("password" , {required:"Password is required"})} styles= "w-full rounded-full"  labelStyle = 'ml-2' errors = {errors.password ? errors.password.message : null}/>
                <Link to= "/reset-password" className= "text-sm text-right text-blue font-semibold">Forgot Password?</Link>
                {
                  errMsg && <span className = {`text-sm ${errMsg?.status == "failed" ? "text-red-500" : "text-green-500"}`}>{errMsg?.message}</span>
                }
                {
                    isSubmitting?<Loading/>:<CustomButton type= 'submit' containerStyles={`inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline none`} title ='login'/>
                }
            </form>

            <p className = 'text-ascent-2 text-sm text-center'>
              Don't have an account?   
              <Link to = "/register" className = 'text-blue font-semibold ml-2 cursor-pointer'>Register</Link>
            </p>
         </div>
         <div className = 'hidden w-1/2 h-full lg:flex flex-col items-center justify-center bg-blue '>
           <div className = 'relative w-full flex items-center justify-center'>
              <img src= {img}  alt ='Bg Image' className ='w-48 2xl:w-64 h-48 2xl:h-64 rounded-full object-cover'/>
           </div>
        </div>
      </div>
    </div>
  )
}

export default Login