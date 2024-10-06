import React, { useEffect } from 'react'
import "./App.css";
import SideBar from "./components/Sidebar/SideBar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Messages from "./pages/Messages";
import FileManager from "./pages/FileManager";
import Analytics from "./pages/Analytics";
import Order from "./pages/Order";
import Saved from "./pages/Saved";
import Setting from "./pages/Setting";

import 'bootstrap/dist/css/bootstrap.min.css';


import SidebarNavMenu from './components/SidebarNavMenu/SidebarNavMenu'
import SideBarNav from './components/SideBarNav/SideBarNav';
import Grid from './components/Grid/Grid';
import Home from './pages/Home';
import Rent from './pages/Rent';
import Idea from './pages/Idea';
import Login from './pages/Login';
import SummaryApi from './common';
import { useDispatch } from 'react-redux';
import { setUserDetails } from "./store/userSlice";
import Context from './context/index';
import SignUp from './pages/SignUp';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoutes from './auth/ProtectedRoutes';

const App = () => {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const pixelSize = 10; // Each pixel is 10x10

  const rows = Math.floor(screenHeight / pixelSize);
  const cols = Math.floor(screenWidth / pixelSize);
/*
  console.log("rows", rows); // rows 73
  console.log("cols", cols); // cols 153
  console.log("screenWidth", screenWidth); // screenWidth 1536
  console.log("screenHeight", screenHeight); // screenHeight 730
*/
const dispatch = useDispatch();

const fetchUserDetials = async()=> {
  const dataResponse = await fetch(SummaryApi.current_user.url,{
    method: SummaryApi.current_user.method,
    credentials : 'include',
  })
  const dataApi = await dataResponse.json();
  //console.log('data-user:', dataResponse);
  if(dataApi.success) {
    //dispatch({type: 'SET_USER_DETAILS', payload: dataApi.data});
    dispatch(setUserDetails(dataApi.data));
    //SummaryApi.current_uer.data = dataApi.data;

  }
}

useEffect(()=> {
  /**user Details */
  fetchUserDetials();
},[]);

  return (
    <div>
      <Context.Provider value={{
      fetchUserDetials, // user detail fetch
    }}>
      <ToastContainer
      position="top-center"
      autoClose={2000}
      closeOnClick
      draggable={false}      
      />
      <Router>
      {/* <SidebarNavMenu> */}
      {/* <SideBarNav> */}
      <SideBar>
        {/* <Grid/> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          <Route path="/users" element={<ProtectedRoutes><Users rows={rows} cols={cols}/></ProtectedRoutes>} />
          
          {/* <Route path="/users" element={<Users rows={33} cols={67}/>} /> */}
          <Route path="/messages" element={<Messages />} />
          <Route path="/rent" element={<Rent />} />
          <Route path="/idea" element={<Idea />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/file-manager" element={<FileManager />} />
          <Route path="/order" element={<Order />} />
          <Route path="/saved" element={<Saved rows={rows} cols={cols} />} />
          <Route path="/settings" element={<Setting />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />

          <Route path="*" element={<> not found</>} />
        </Routes>
      </SideBar>
      {/* </SideBarNav> */}
        {/* </SidebarNavMenu> */}
      </Router>
      </Context.Provider>
    </div>
  )
}

export default App