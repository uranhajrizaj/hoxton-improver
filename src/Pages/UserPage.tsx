import { useEffect, useState } from "react";
import "./userpage.css";
type Message = {
  id: number;
  userId: string;
  message: string;
  user: {
    name: string;
    id: string;
    password: string;
    image: string;
  };
};
export type User = {
    id: string;
    name: string;
    password: string;
    image: string;
    };

type Conversation={
    messageId: number;
    userId: string;
    message: {
        id: number;
        userId: string;
        message: string;
    };
    user:User
}

export function UserPage({user}: {user: User | null}) {
  const[users,setUsers]=useState<User[]>([])
  
  const[conversations,setConversations]=useState<Conversation[]>([]);
  const[chooseFridend,setChooseFriend]=useState<User>();

  useEffect(() => {

    fetch("http://localhost:4000/users")
      .then((response) => response.json())
      .then((usersFromServer) => setUsers(usersFromServer));  
      
   fetch(`http://localhost:4000/conversations?_expand=message&_expand=user`)
        .then((response) => response.json())
        .then((conversations) => setConversations(conversations));
     

  }, []);
  

  let otherUsers=users.filter(u=>u.id!==user?.id)
  console.log(otherUsers)
 console.log(user)
  return (
    <div className="container">  
      <header className="user_header">
        <h1>Welcome</h1>
      </header>
      <div className="left_menu">
        {user!==undefined ?
        <ul>
            {
            otherUsers.map(user=>(
            <li onClick={()=>setChooseFriend(user)}>
              <img src={user.image}></img>
              <h4 className="users_name">{user.name}</h4>
            </li>
            
            ))}
        </ul>
           : <h1>Loading...</h1>
        }
      </div>
      <main className="main_content">
       
        <div className="friend_messages">
          <ul>
            {conversations.map((message) => (
              (message.message.userId===chooseFridend?.id && message.userId==="johndoe@gmail.com")?
            <div className="single_message">
              <img src={chooseFridend?.image}></img>
              <li className=""> <h4 className="users_name">{message.message.message}</h4>
              </li>
            </div>:null
            ))}
          </ul>
       
        </div>
        <div className="your_messages">
           
          <ul className="messages_list">
          {conversations.map((message) => (
            (message.message.userId==="johndoe@gmail.com"&& message.userId===chooseFridend?.id)?
            <div className="single_message">
              <li className="">
                <h4 className="users_name">{message.message.message}</h4>
              </li>
              <img src="https://images.pexels.com/photos/1571673/pexels-photo-1571673.jpeg?auto=compress&cs=tinysrgb&w=400&lazy=load"></img>
            </div>:null))}
          </ul>
       
        </div>
       
      

      </main>
    </div>
  );
}
