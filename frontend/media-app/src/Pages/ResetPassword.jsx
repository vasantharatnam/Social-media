import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import TextInput from '../Components/TextInput';
import { CustomButton } from '../Components/CustomButton';
import { Loading } from '../Components/Loading';
import { apiRequest } from '../apiHelper/index.mjs';

function ResetPassword() {

  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({ mode: "onChange" });

  const OnSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const result = await apiRequest({
        url: "/users/request-passwordreset",
        data: data,
        method: "POST"
      });
      const { status } = result;
      const { message } = result.message;
      const notify = () => toast(`Status: ${status} Message: ${message}`);
      notify();
      setErrMsg(message);

      setIsSubmitting(false);
    }
    catch (e) {
      setIsSubmitting(false);
      console.log(e);
    }
  }

  return (
    <div className='w-full h-[100vh] bg-bgColor flex items-center justify-center p-6'>
      <div className='bg-primary w-full md:w-1/3 2xl:w-1/4 px-6 py-8 shadow-md rounded-lg'>
        <p className='text-ascent-1 text-lg font-semibold'>Email address</p>
        <span className='text-sm text-ascent-2'>
          Enter email address used during registration
        </span>
        <form onSubmit={handleSubmit(OnSubmit)} className='py-4 flex flex-col gap-5'>
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
          {
            errMsg && <span className={`text-sm ${errMsg?.status === "failed" ? "text-red-500" : "text-green-500"}`}>{errMsg?.message}</span>
          }
          {
            isSubmitting ? <Loading /> : <CustomButton type='submit' containerStyles={`inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline none`} title='Submit' onclick={onclick} />
          }
        </form>
        <ToastContainer />
      </div>
    </div>
  )
}

export { ResetPassword };