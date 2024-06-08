import React from 'react'
import { TbSocial } from "react-icons/tb"
import { ToastContainer, toast } from 'react-toastify';
import TextInput from '../Components/TextInput'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useDispatch } from 'react-redux';
import { CustomButton } from '../Components/CustomButton';
import { UserLogin } from "../redux/userSlice";
import { Loading } from '../Components/Loading';
import { BgImage } from '../assets';
import { BsShare } from 'react-icons/bs'
import { AiOutlineInteraction } from 'react-icons/ai';
import { ImConnection } from 'react-icons/im'
import { apiRequest } from '../apiHelper/index.mjs';
import 'react-toastify/dist/ReactToastify.css';


function Login() {

  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm({ mode: "onChange" });

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const result = await apiRequest({
        url: "/auth/login",
        data: data,
        method: "POST"
      });
      console.log(result);
      const { status } = result;
      let message;
      if (status === 201) {
        message = result.message.message;
      }
      else {
        message = result.message;
      }
      // const { message } = result;
      // const message = result.message;
      const notify = () => toast(`Status: ${status} Message: ${message}`);
      notify();
      setErrMsg(message);

      // console.log(status);
      console.log(result);

      if (status === 201) {
        // navigate('/login');
        let resul = result.message
        const newData = { token: resul?.token, ...resul?.user };
        console.log(newData, "token");
        dispatch(UserLogin(newData));
      }

      setTimeout(() => {
        if (status === 201)
          window.location.replace("/");
      }, 5000);
      setIsSubmitting(false);
    }
    catch (e) {
      setIsSubmitting(false);
      // setErrMsg(e.message);
      console.log(e);
    }
  }


  return (
    <div className="bg-bgColor w-full h-[100vh] flex items-center justify-center p-6">
      <div className="w-full md:w-2/3 h-fit lg:h-full 2xl:h-5/6 py-8  lg:py-0 flex bg-primary rounded-x1 overflow-hidden shadow-x1" >
        <div className="w-full lg:w-1/2 h-full p-10 2xl:px-20 flex flex-col justify-center">
          <div className="w-full flex gap-2 items-center mb-6">
            <div className="p-2 bg-[#065ad8] rounded text-white">
              <TbSocial />
            </div>
            <span className="text-2xl text-[#065ad8] font-semibold" >OnlineMedia</span>
          </div>
          <p className="text-ascent-1 text-base font-semibold">
            Log in to your account
          </p>
          <span className='text-sm mt-2  text-ascent-2'>Welcome back</span>

          <form className="py-8 flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
            <TextInput
              name='email'
              placeholder='email@example.com'
              label='Email Address'
              type='email'
              register={register("email", {
                required: "Email Address is required",
              })}
              styles='w-full rounded-full'
              labelStyle='ml-2'
              error={errors.email ? errors.email.message : ""}
            />

            <TextInput
              name='password'
              label='Password'
              placeholder='Password'
              type='password'
              styles='w-full rounded-full'
              labelStyle='ml-2'
              register={register("password", {
                required: "Password is required!",
              })}
              error={errors.password ? errors.password?.message : ""}
            />

            <Link to="/reset-password" className="text-sm text-right text-blue font-semibold">Forgot Password?</Link>
            {
              errMsg && <span className={`text-sm ${errMsg?.status === "failed" ? "text-red-500" : "text-green-500"}`}>{errMsg?.message}</span>
            }
            {
              isSubmitting ? <Loading /> : <CustomButton type='submit' containerStyles={`inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline none`} title='login' onclick={onclick} />
            }
          </form>
          <ToastContainer />

          <p className='text-ascent-2 text-sm text-center'>
            Don't have an account?
            <Link to="/register" className='text-blue font-semibold ml-2 cursor-pointer'>Register</Link>
          </p>
        </div>
        <div className='hidden w-1/2 h-full lg:flex flex-col items-center justify-center bg-blue '>
          <div className='relative w-full flex items-center justify-center'>
            <img src={BgImage} alt='Bg Image' className='w-48 2xl:w-64 h-48 2xl:h-64 rounded-full object-cover' />
            <div className='absolute flex items-center gap-1 bg-white right-10 top-10 py-2 px-5 rounded-full'>
              <BsShare size={14} />
              <span className='text-xs font-medium'>Share</span>
            </div>

            <div className='absolute flex items-center gap-1 bg-white left-10 top-6 py-2 px-5 rounded-full'>
              <ImConnection />
              <span className='text-xs font-medium'>Connect</span>
            </div>

            <div className='absolute flex items-center gap-1 bg-white left-12 bottom-6 py-2 px-5 rounded-full'>
              <AiOutlineInteraction />
              <span className='text-xs font-medium'>Interact</span>
            </div>
          </div>
          <div className='mt-16 text-center'>
            <p className='text-white text-base'>
              Connect with friends and have share for fun
            </p>
            <span className='text-sm text-white/80'>
              Share memories with friends and the world.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export { Login };