import React from 'react'
import {useSelector} from 'react-redux';
import Topbar from '../Components/Topbar';

function Home() {
    const {user} = useSelector((state) => state.user);
  return (
    <div className = 'home w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden'>
        <Topbar/>
    </div>
  )
}

export default Home