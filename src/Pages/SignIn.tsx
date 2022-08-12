import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { User } from "./UserPage"

export function SignIn({setUser}: {setUser: (user: User | null) => void}) {
 
  const[alert,setAlert]=useState(false)

  const navigate=useNavigate()

  function userSignIn(event:any){
    event.preventDefault()
    const email=event.target.email.value
    const password=event.target.password.value
    
      fetch(`http://localhost:4000/users/${email}`)
                    .then((response)=>response.json())
                    .then(user=>{
                      if(user.password===password) {
                        setUser(user)
                         navigate('/user_page')
                      }
                      else{ setAlert(true)}
                    })
      
                  }
    return(
       <div className="countainer">
              <form className="signin-form" 
                 onSubmit={userSignIn}>
                <h1>Hoxhey! 👋 </h1>
                <input placeholder="Your email" type="email" required name="email"/> 
                <input placeholder="Your password" type="password" required name="password"/>
                {alert && <p className="error">Wrong email or password. Please try again. </p>}
                <button>Sign In</button>
               

              </form>
       </div> 
    )
}

