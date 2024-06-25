import React from 'react'
import { TbSocial } from "react-icons/tb"
import TextInput from '../Components/TextInput'
import { useForm } from 'react-hook-form'
import { ToastContainer, toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useDispatch } from 'react-redux';
import { CustomButton } from '../Components/CustomButton';
import { Loading } from '../Components/Loading';
import { BgImage } from '../assets';
import { BsShare } from 'react-icons/bs'
import { AiOutlineInteraction } from 'react-icons/ai';
import { ImConnection } from 'react-icons/im'
import { apiRequest } from "../apiHelper/index.mjs"
import { getSignup } from '../apiHelper/getSignup.mjs';
import 'react-toastify/dist/ReactToastify.css';

// dotenv.config();

function Register() {

  const navigate = useNavigate();
  const { register, handleSubmit, getValues, formState: { errors } } = useForm({ mode: "onChange" });
  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  // const BACKEND_URL = "http://127.0.0.1:8800";BACKEND_URL + 


  const onSubmit = async (data, event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const inside = {
        url: "/auth/signup",
        data: data,
        method: "POST",
        // token: token
      };
      const adding = await apiRequest(inside);
      // const adding = await getSignup(data);
      console.log(adding);
      const { status } = adding;
      let message;
      if (status === 201) {
        message = adding.message.message
      }
      else {
        message = adding.message
      }
      // const { message } = adding.message;
      const notify = () => toast(`Status: ${status} Message: ${message}`);
      notify();
      // setErrMsg(adding);

      console.log(status);

      setTimeout(() => {
        if (status === 201) {
          // navigate('/login');
          window.location.replace("/");
        }
      }, 5000);
      setIsSubmitting(false);
    }
    catch (e) {
      console.log(e);
      setIsSubmitting(false);
    }

  };

  return (
    <div className="bg-bgColor w-full h-[100vh] flex items-center justify-center p-6">
      <div className="w-full md:w-2/3 h-fit lg:h-full 2xl:h-5/6 py-8  lg:py-0 flex  flex-row-reverse bg-primary rounded-x1 overflow-hidden shadow-x1" >
        <div className="w-full lg:w-1/2 h-full p-10 2xl:px-20 flex flex-col justify-center">
          <div className="w-full flex gap-2 items-center mb-6">
            <div className="p-2 bg-[#065ad8] rounded text-white">
              <TbSocial />
            </div>
            <span className="text-2xl text-[#065ad8] font-semibold" >OnlineMedia</span>
          </div>
          <p className="text-ascent-1 text-base font-semibold">
            Create your account
          </p>

          <form className="py-8 flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
            <div className='w-full flex flex-col lg:flex-row gap-1 md:gap-2'>
              <TextInput
                name='firstName'
                label='First Name'
                placeholder='First Name'
                type='text'
                styles='w-full'
                register={register("firstName", {
                  required: "First Name is required!",
                })}
                error={errors.firstName ? errors.firstName?.message : ""}
              />

              <TextInput
                label='Last Name'
                placeholder='Last Name'
                type='lastName'
                styles='w-full'
                register={register("lastName", {
                  required: "Last Name do no match",
                })}
                error={errors.lastName ? errors.lastName?.message : ""}
              />
            </div>


            <TextInput
              name='email'
              placeholder='email@example.com'
              label='Email Address'
              type='email'
              register={register("email", {
                required: "Email Address is required",
              })}
              styles='w-full'
              error={errors.email ? errors.email.message : ""}
            />

            <TextInput
              name='password'
              label='Password'
              placeholder='Password'
              type='password'
              styles='w-full'
              labelStyle='ml-2'
              register={register("password", {
                required: "Password is required!",
              })}
              error={errors.password ? errors.password?.message : ""}
            />

            <TextInput
              label='Confirm Password'
              placeholder='Password'
              type='password'
              styles='w-full'
              register={register("cPassword", {
                validate: (value) => {
                  const { password } = getValues();

                  if (password != value) {
                    return "Passwords do no match";
                  }
                },
              })}
              error={
                errors.cPassword && errors.cPassword.type === "validate"
                  ? errors.cPassword?.message
                  : ""
              }
            />

            {
              errMsg && <span className={`text-sm ${errMsg?.status === "failed" ? "text-red-500" : "text-green-500"}`}>{errMsg?.message}</span>
            }
            {
              isSubmitting ? <Loading /> : <CustomButton type='submit' containerStyles={`inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline none`} title='Register' onclick={onclick} />
            }
          </form>
          <ToastContainer />

          <p className='text-ascent-2 text-sm text-center'>
            Already have an account?
            <Link to="/Login" className='text-blue font-semibold ml-2 cursor-pointer'>Login</Link>
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

export { Register };