import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import  {BrowerRouter as Router, Routes, Route, Navigate , useLocation} from 'react-router-dom'
import Home from './Pages/Home'
import Profile from './Pages/Profile'
import Register from './Pages/Register'
import Login from './Pages/Login'
import ResetPassword from './Pages/ResetPassword'


function Layout(){
        const user = null;
        const location = useLocation()

        return user?.token? (
           <Outlet/>
        ):
        (<Navigate to="/login" state={{from: location}} replace/>)
}


function App() {
 
  return (
    <div className="w-full min-h-[100vh]">
       <Router>
         <Routes>
            <Route element = {<Layout/>}>
              <Route path="/" element={<Home/>}/>
              <Route path="/profile/:id?" element={<Profile/>}/>
            </Route>

             <Route path = "/register" element={<Register/>}/>
             <Route path = "/login" element={<Login/>}/>
             <Route path = "/reset-password" element = {<ResetPassword/>}/>
         </Routes>
       </Router>
    </div>
  )
}

export default App
