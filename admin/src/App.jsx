import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Login from './pages/Login'
import { Toaster } from "sonner";
import Dashboard from './pages/Dashboard'
import Customer from './pages/Customer'


function App() {
  return (
    <Router>
      <Toaster richColors position="top-right" />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path='/customer' element={<Customer />} />
      </Routes>
    </Router>
  )
}

export default App
