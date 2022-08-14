import { useEffect, useState } from "react";
import {GoSignOut} from "react-icons/go";
import {FaPaperPlane} from "react-icons/fa"
import "./userpage.css";
type Message = {

  userId: string ;
  conversationId: string ;
  message: string;
};
export type User = {
    id: string;
    name: string;
    password: string;
    image: string;
    };

type Conversation={
    starterId: string ;
    participantId: string ;
    messages: Message[];
    
}


export function UserPage({user}: {user: User | null}) {
  const[users,setUsers]=useState<User[]>([])
  
  const[conversations,setConversations]=useState<Conversation[]>([]);
  const[chooseFridend,setChooseFriend]=useState<User>();

  useEffect(() => {

    fetch("http://localhost:4000/users")
      .then((response) => response.json())
      .then((usersFromServer) => setUsers(usersFromServer));  
      
   fetch(`http://localhost:4000/conversations?starterId=${user?.id}&_embed=messages`)
        .then((response) => response.json())
        .then((conversations) => setConversations(conversations));
     

  }, []);
  

  let otherUsers=users.filter(u=>u.id!==user?.id)
 
  return (
    <div className="container">  
      <header className="user_header">
        <h1>Welcome to Hoxhey</h1>
        <div className="user_info">
          <img src={user?.image}></img>
          <h4 className="user_name">{user?.name}</h4>
          <span className="sign_out"><GoSignOut/></span>

        </div>
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
          <ul className="messages_list">
            {conversations.map((conversation) => (
              (conversation.participantId===chooseFridend?.id && conversation.starterId===user?.id)?
            <div className="single_message">
             { conversation.messages.map(message=>(
              message.userId===conversation.participantId?
              <>
              <img src={chooseFridend?.image}></img>
              <li className=""> <h4 className="users_name">{message.message}</h4>
               </li>
              </>
              :null
             ))}
            </div>
            :null
            ))}
          </ul>
       
        </div>
        <div className="your_messages">
           
          <ul className="messages_list">
          {conversations.map((conversation) => (
            (conversation.starterId===user?.id && conversation.participantId===chooseFridend?.id)?
            <div className="single_message">
              { conversation.messages.map(message=>(
              message.userId===conversation.starterId?
                <div className="my_message">
              <li className="">
                <h4 className="users_name">{message.message}</h4>
              </li>
               <img src={user?.image}></img>
               </div>
              :null
                ))}
            </div>:null))}
          </ul>
       
        </div>
        {chooseFridend!==undefined?
       <form className="form" 
       onSubmit={(e)=>{
        e.preventDefault()
       
        let randomId=Math.floor(Math.random()*1000000)
         //@ts-ignore
        const message=String(e.target.message.value)
        const newMessage={ userId:user?.id, message:message,conversationId: randomId }
        const newConversation={starterId:user?.id,participantId:chooseFridend?.id,messages:[newMessage]}
        setConversations([...conversations,newConversation])
        fetch("http://localhost:4000/messages",{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify(newMessage)
        })
     
          fetch("http://localhost:4000/conversations",{
            method:"POST",
            headers:{
              "Content-Type":"application/json"
            },
            body:JSON.stringify({
              starterId:user?.id,
              participantId:chooseFridend?.id,
             id:randomId})
          })
  
        //@ts-ignore
        e.target.message.value=""
       }}>
       
        <input placeholder="Sent message...." name="message"></input>
        <button><FaPaperPlane/></button>
        </form>
       :null}

      </main>
    </div>
  );
}
