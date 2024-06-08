import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { TbSocial } from "react-icons/tb"
import { Link } from 'react-router-dom'
// import TextInput from './TextInput';
import { CustomButton } from './CustomButton';
import { useForm } from 'react-hook-form';
import { IoMdNotificationsOutline } from 'react-icons/io'
import { BsMoon } from 'react-icons/bs'
import { BsSunFill } from 'react-icons/bs'
import { setTheme } from '../redux/theme';
import { Logout } from '../redux/userSlice';

function Topbar() {

   const { theme } = useSelector((state) => state.theme);
   const { user } = useSelector((state) => state.user);
   const dispatch = useDispatch();

   // const { register, handleSubmit, formState: { errors } } = useForm({ mode: "onChange" });

   const handleTheme = () => {
      const themeValue = theme === "light" ? "dark" : "light";
      dispatch(setTheme(themeValue));
   }

   // const handleSearch = async (data) => {

   // }

   return (
      <div className='topbar w-full flex items-center justify-between py-3 md:py-6 px-4 bg-primary'>
         <Link to='/' className='flex gap-2 items-center' >
            <div className='p-1 md:p-2 bg-[#065ad8] rounded text-white' >
               <TbSocial />
            </div>
            <span className='text-xl md:text-2xl text-[#065ad8] font-semibold'>
               OnlineMedia
            </span>
         </Link>
         {/* <form className='hidden md:flex items-center justify-center' onSubmit={handleSubmit(handleSearch)}>
            <TextInput placeholder='Search...' styles='w-[18rem] lg:w-[38rem] rounded-l-full py-3' register={register("search")} />
            <CustomButton title='Search' type='submit' containerStyles='bg-[#0444a4] text-white px-6 py-2.5 mt-2 rounded-r-full' />
         </form> */}
         {/*Icons */}
         <div className='flex gap-4 items-center text-ascent-1 text-md md:text-xl'>
            <button onClick={() => handleTheme()}>
               {theme ? <BsMoon /> : <BsSunFill />}
            </button>
            <div className='hidden lg:flex'>
               <IoMdNotificationsOutline />
            </div>
            <div>
               <CustomButton onclick={() => dispatch(Logout())} title='Log out' containerStyles='text-sm text-ascent-1 px-4 md:px-6 py-1 md:py-2 border border-[#666] rounded-full' />
            </div>
         </div>
      </div>
   )
}

export { Topbar };
