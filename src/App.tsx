import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { SignIn } from './Pages/SignIn'
import { Navigate, Route, Routes } from 'react-router-dom'
import { User, UserPage } from './Pages/UserPage'

function App() {
  const[user,setUser]=useState<User | null>(null)

  return (
    <div className="App">
      <Routes>
        <Route index element={<Navigate to="/sign_in"/>} />
        <Route path="/sign_in" element={<SignIn setUser={setUser}/>}/>
        <Route path="/user_page" element={<UserPage user={user}/>}/>
     
      </Routes>
    </div>
  )
}

export default App
