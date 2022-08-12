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
type User = {
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
}

export function UserPage() {
 const[users,setUsers]=useState<User[]>([])
  const [messages, setmessages] = useState<Message[]>([]);
  const[signinuser,setSigninUser]=useState<User>();
  const[conversations,setConversations]=useState<Conversation[]>([]);
  useEffect(() => {

    fetch("http://localhost:4000/signin")
    .then((response) => response.json())
      .then((user) => setSigninUser(user));

    fetch("http://localhost:4000/messages?_expand=user")
      .then((response) => response.json())
      .then((messages) => setmessages(messages));

    fetch("http://localhost:4000/users")
      .then((response) => response.json())
      .then((usersFromServer) => setUsers(usersFromServer));  
      
   fetch(`http://localhost:4000/conversations?_expand=message`)
        .then((response) => response.json())
        .then((conversations) => setConversations(conversations));
    
  }, []);

  return (
    <div className="container">
      <header className="user_header">
        <h1>Welcome</h1>
      </header>
      <div className="left_menu">
        <ul>
            {users.map(user=>(
              
            <li>
              <img src={user.image}></img>
              <h4 className="users_name">{user.name}</h4>
            </li>
       
            ))}
        </ul>
      </div>
      <main className="main_content">
       
        <div className="friend_messages">
          <ul>
            {messages.map((message) => (
            
            <div className="single_message">
              <img src={message.user.image}></img>
              <li className=""> <h4 className="users_name">{message.message}</h4>
              </li>
            </div>
            ))}
          </ul>
        </div>
        <div className="your_messages">
           
          <ul className="messages_list">
          {messages.map((message) => (
          
            <div className="single_message">
              <li className="">
                <h4 className="users_name">Uran</h4>
              </li>
              <img src="https://images.pexels.com/photos/13146110/pexels-photo-13146110.jpeg?auto=compress&cs=tinysrgb&w=400&lazy=load"></img>
            </div>))}
          </ul>
       
        </div>
       
      

      </main>
    </div>
  );
}
