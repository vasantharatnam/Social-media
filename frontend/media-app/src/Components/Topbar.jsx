import React from 'react'
import  {useDispatch, useSelector} from 'react-redux';
import {TbSocial} from "react-icons/tb"
import {Link} from 'react-router-dom'
function Topbar() {
  
  const {theme} = useSelector((state) => state.theme);
  const {user} = useSelector((state) => state.user);
  const dispatch  = useDispatch();

  return (
    <div className='topbar w-full flex items-center justify-between py-3 md:py-6 px-4 bg-primary'>
       <Link to ='/' className = 'flex gap-2 items-center' >
          <div className = 'p-1 md:p-2 bg-[#065ad8] rounded text-white' >
           <TbSocial/>
          </div>
          <span className='text-xl md:text-2xl text-[#065ad8] font-semibold'>
            ShareFun
         </span>
       </Link>
    </div>
  )
}

export default Topbar
