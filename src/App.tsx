import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { SignIn } from './Pages/SignIn'
import { Navigate, Route, Routes } from 'react-router-dom'
import { UserPage } from './Pages/UserPage'

function App() {
 

  return (
    <div className="App">
      <Routes>
        <Route index element={<Navigate to="/sign_in"/>} />
        <Route path="/sign_in" element={<SignIn/>}/>
        <Route path="/user_page" element={<UserPage />}/>
     
      </Routes>
    </div>
  )
}

export default App
