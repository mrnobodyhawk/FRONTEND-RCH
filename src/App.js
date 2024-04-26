import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from './components/SignIn/SignIn';
import SignUp from './components/SignUp/SignUp';
import Homepage from './components/Homepage/Homepage';
import AboutUs from './components/Homepage/AboutUs';
import NoPageFound from './components/NoPageFound/NoPageFound';
import ContactUs from './components/Homepage/ContactUs';
import UserHomepage from './components/User/UserHomepage/UserHomepage';
import UserMaintenance from './components/User/UserMaintenance/UserMaintenance';
import UserNotification from './components/User/UserNotification/UserNotification';
import UserVisitor from './components/User/UserVisitor/UserVisitor';
import AdminHomepage from './components/Admin/AdminHomepage/AdminHomepage';
import AdminVisitor from './components/Admin/AdminVisitor/AdminVisitor';
import AdminMaintenance from './components/Admin/AdminMaintenance/AdminMaintenance';
import AdminNotification from './components/Admin/AdminNotification/AdminNotification';

function App() {
  return (
    <div className="App">
      <header className="App-header">

        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Homepage />} />
            <Route exact path="/sign-in" element={<SignIn />} />
            <Route exact path="/sign-up" element={<SignUp />} />
            <Route exact path="/about" element={<AboutUs />} />
            <Route exact path="/contact" element={<ContactUs />} />

            <Route exact path="/user-dashboard" element={<UserHomepage />} />
            <Route exact path="/user-dashboard/visitor" element={<UserVisitor />} />
            <Route exact path="/user-dashboard/maintenance" element={<UserMaintenance />} />
            <Route exact path="/user-dashboard/notification" element={<UserNotification />} />

            <Route exact path="/admin-dashboard" element={<AdminHomepage />} />
            <Route exact path="/admin-dashboard/visitor" element={<AdminVisitor />} />
            <Route exact path="/admin-dashboard/maintenance" element={<AdminMaintenance />} />
            <Route exact path="/admin-dashboard/notification" element={<AdminNotification />} />
            <Route path="*" element={<NoPageFound />} />
          </Routes>
        </BrowserRouter>

      </header>
    </div>
  );
}

export default App;

