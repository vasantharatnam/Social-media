import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import  {Routes, Route, Navigate , useLocation} from 'react-router-dom'
import Home from './Pages/Home'
import Profile from './Pages/Profile'
import Register from './Pages/Register'
import Login from './Pages/Login'
import ResetPassword from './Pages/ResetPassword'
import {useSelector} from "react-redux";


function Layout(){
        const user = useSelector((state) => state.user);
        const location = useLocation()
       
        return user?.token? (
           <Outlet/>
        ):
        (<Navigate to="/login" state={{from: location}} replace/>)
}


function App() {
   
    const {theme} = useSelector((state) => state.theme);

  return (
    <div data-theme={theme}  className="w-full min-h-[100vh]">
       
         <Routes>
            <Route element = {<Layout/>}>
              <Route path="/" element={<Home/>}/>
              <Route path="/profile/:id?" element={<Profile/>}/>
            </Route>

             <Route path = "/register" element={<Register/>}/>
             <Route path = "/login" element={<Login/>}/>
             <Route path = "/reset-password" element = {<ResetPassword/>}/>
         </Routes>
    </div>
  )
}

export default App
