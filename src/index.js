import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import RegisterPage from './register';
import LoginPage from './login';
import ResetPasswordPage from './resetpassword';
import Middleware from './middleware';
import SuperAdminLogin from './adminlogin';
import SuperAdminRegister from './adminregister';
import SuperAdminReset from './adminreset';
import UserManagement from './adminusermanagement';
import Dashboard from './admindashboard';
import AdminLayout from './adminlayout';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} /> 
        <Route 
  path="/dashboard" 
  element={
    <Middleware>
      <App />
    </Middleware>
  }
/>

        <Route path='/forgot-password' element={<ResetPasswordPage/>}/>
     <Route path='/adminlogin' element={<SuperAdminLogin/>}/>
     <Route path='/adminregister' element={<SuperAdminRegister/>}/>
     <Route path='/adminreset' element={<SuperAdminReset/>}/>
<Route element={<AdminLayout/>}>
<Route path='/usermanagement' element={<UserManagement/>}/>
<Route path='/admindashboard' element={<Dashboard/>}/> 

</Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
