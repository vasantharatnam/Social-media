import React from 'react'
import {useSelector} from 'react-redux';
import Topbar from '../Components/Topbar';
import ProfileCard from '../Components/ProfileCard';
import FriendsCard from '../Components/FriendsCard';
import {friends , requests , suggest} from '../assets/data'
import {useState} from 'react';
import {Link} from 'react-router-dom'
import img from '../assets/userprofile.png'
import CustomButton from '../Components/CustomButton';
import {BsPersonFillAdd} from 'react-icons/bs'

function Home() {
    const {user} = useSelector((state) => state.user);
    const [friendRequest , setFriendRequest] = useState(requests);
    const [suggestedFriends , setSuggestedFriends] = useState(suggest);
  return (
    <div className = 'home w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden'>
        <Topbar/>
        <div className = 'w-full flex gap-2  lg:gap-4 pt-5 pb-10 h-full'>
        {/* LEFT*/}
        <div className = 'hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto'>
         <ProfileCard user = {user}/>
         <FriendsCard friends = {user?.friends}/>
        </div>
        {/*CENTER*/}
        <div className = 'flex-1 h-full bg-primary px-4 flex flex-col gap-6 overflow-y-auto'>

        </div>
         {/*RIGHT*/}
         <div className= 'hidden w-1/4  h-full lg:flex flex-col gap-8 overflow-y-auto'>
             {/*FRIEND REQUEST */}
             <div className= 'w-full bg-primary  shadow-sm rounded-lg  px-6  py-5'>
                <div className = 'flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645]'>
                  <span>Friend Request</span>
                  <span>{friendRequest?.length}</span>
                </div>
                <div className='w-full flex flex-col gap-4 pt-4'>
                  {friendRequest?.map(({_id, requestFrom : from }) => (
                    <div key = {_id} className = 'flex items-center justify-between'>
                        <Link to= {"/profile/" + from._id} className = 'w-full flex gap-4 items-center cursor-pointer'>
                         <img src= {from?.profileUrl ?? img} alt = {from?.firstName} className = 'w-10 h-10 object-cover rounded-full'/>
                          <div className = 'flex-1'>
                            <p className = 'text-base font-medium text-ascent-1'>
                                {from?.firstName} {from?.lastName}
                            </p>
                            <span className = 'text-sm text-ascent-2'>
                               {from?.profession ?? "No profession"}
                            </span>
                          </div>
                        </Link>

                         <div className = 'flex gap-1'>
                            <CustomButton title = "Accept" containerStyles= 'bg-[#0444a4] text-xs text-white px-1.5 py-1 rounded full'/>
                            <CustomButton title = "Deny" containerStyles= 'border border-[#666] text-xs text-ascent-1 px-1.5 py-1 rounded-full'/>
                         </div>
                    </div>
                  ))}
                </div>
             </div>

             {/* SUGGESTED FRIENDS */}
             <div className = 'w-full bg-primary shadow-sm rounded-lg px-5 py-5'>
                 <div className = 'flex items-center justify-between text-lg text-ascent-1 border-b border-[#66666645]'>
                     <span>Friend Suggestion</span>
                 </div>
                 <div className = 'w-full flex flex-col gap-4 pt-4'>
                   {
                    suggestedFriends.map((friend) => (<div className ='flex items-center justify-between' key = {friend._id}>
                        <Link to = {"/profile/" + friend?._id} key = {friend?._id} className = 'w-full flex gap-4 items-center cursor pointer'>
                        <img src= {friend?.profileUrl ?? img} alt = {friend?.firstName} className = 'w-10 h-10 object-cover rounded-full'/>
                         <div className ='flex-1'>
                            <p className = 'text-base font-medium text-ascent-1'>
                                {friend?.firstName}{friend?.lastName}
                            </p>
                            <span className = 'text-sm text-ascent-2'>
                               {friend?.profession ?? "No profession"}
                            </span>
                         </div>
                        </Link>
                         
                         <div className = 'flex-gap-1'>
                            <button className = 'bg-[#0444a430] text-sm text-white p-1 rounded' onClick={() =>{}}>
                                <BsPersonFillAdd size = {20} className = 'text-[#0f52b6]'/>
                            </button>
                        </div> 
                    </div>))
                   }
                 </div>
             </div>
         </div>
        </div>
    </div>
  )
}

export default Home