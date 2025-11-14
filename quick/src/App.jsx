import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Process from './components/Process'
import Fqs from './components/Fqs'
import Footer from './components/Footer'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard' // ✅ Naya import
import SubmitLink from './pages/SubmitLink'
import History from './pages/History'

function App() {
  return (
    <>
      <Routes>
        {/* Home route - navbar alag se */}
        <Route path="/" element={
          <>
            <Navbar/>
            <Home/>
            <Process/>
            <Fqs/>
            <Footer/>
          </>
        } />
        
        {/* Login/Register - standalone (no navbar/footer) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* ✅ Dashboard route - navbar/footer included in component */}
        <Route path="/dashboard" element={<Dashboard />} />
  
<Route path="/submit" element={<SubmitLink />} />
<Route path="/history" element={<History />} />
      </Routes>
    </>
  )
}

export default App