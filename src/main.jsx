// main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AboutUs from './pages/AboutUs.jsx'
import Courses from './pages/Courses.jsx'
import Jasa from './pages/Jasa.jsx' 
import Login from './components/Login'
import Register from './components/Register'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/jasa" element={<Jasa />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)