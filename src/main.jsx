import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter, Routes , Route } from 'react-router'
import HomePage from './pages/home.page.jsx'
import SignUpPage from './pages/sign-up.page.jsx'
import SignInPage from './pages/sing-in.page.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/signup" element={<SignUpPage/>}/>
        <Route path="/signin" element={<SignInPage/>}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
