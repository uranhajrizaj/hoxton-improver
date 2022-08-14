import { useEffect, useState } from "react";
import { GoSignOut } from "react-icons/go";
import { FaPaperPlane } from "react-icons/fa";
import "./userpage.css";
import { Navigate, useNavigate } from "react-router-dom";
type Message = {
  userId: string | undefined;
  conversationId: string | undefined;
  message: string | undefined;
};
export type User = {
  id: string;
  name: string;
  password: string;
  image: string;
};

type Conversation = {
  starterId: string | undefined;
  participantId: string;
  messages: Message[];
};
type Props = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export function UserPage({ user, setUser }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [chooseFridend, setChooseFriend] = useState<User>();


  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:4000/users")
      .then((response) => response.json())
      .then((usersFromServer) => setUsers(usersFromServer));

    fetch(
      `http://localhost:4000/conversations?starterId=${user?.id}&_embed=messages`
    )
      .then((response) => response.json())
      .then((conversations) => {
        if (conversations.length === 0) {
          fetch(
            `http://localhost:4000/conversations?participantId=${user?.id}&_embed=messages`
          )
            .then((response) => response.json())
            .then((conversations) => {
              setConversations(conversations);
              console.log(conversations);
            });
        } else {
          setConversations(conversations);
        }
      });
  }, []);

  let otherUsers = users.filter((u) => u.id !== user?.id);

  return (
    <div className="container">
      <header className="user_header">
        <h1>Welcome to Hoxhey</h1>
        <div className="user_info">
          <img src={user?.image}></img>
          <h4 className="user_name">{user?.name}</h4>
          <span
            className="sign_out"
            onClick={() => {
              navigate("/sign_in");
              location.reload();
            }}
          >
            <GoSignOut />
          </span>
        </div>
      </header>
      <div className="left_menu">
        {user !== undefined ? (
          <ul>
            {otherUsers.map((user) => (
              <li onClick={() => setChooseFriend(user)} className={user.id===chooseFridend?.id ? "clicked":""}>
                <img src={user.image}></img>
                <h4 className="users_name">{user.name}</h4>
              </li>
            ))}
          </ul>
        ) : (
          <h1>Loading...</h1>
        )}
      </div>
      <main className="main_content">
        {chooseFridend !== undefined? 
          
            <div className="chat_header">
              <img src={chooseFridend.image}></img>
              <h4 className="users_name">{chooseFridend.name}</h4>
            </div>
            :null
            }    
        <div className="friend_messages">
          <ul className="messages_list">
            {conversations.map((conversation) =>
              (conversation.participantId === chooseFridend?.id ||
                conversation.starterId === chooseFridend?.id) &&
              (conversation.starterId === user?.id ||
                conversation.participantId === user?.id) ? (
                <div className="single_message">
                  {conversation.messages.map((message) =>
                    message.userId !== user?.id ? (
                      <div className="message_item">
                        <img src={chooseFridend?.image}></img>
                        <li className="">
                          {" "}
                          <h4 className="users_name">{message.message}</h4>
                        </li>
                      </div>
                    ) : null
                  )}
                </div>
              ) : null
            )}
          </ul>
        </div>
        <div className="your_messages">
          <ul className="messages_list">
            {conversations.map((conversation) =>
              (conversation.participantId === chooseFridend?.id ||
                conversation.starterId === chooseFridend?.id) &&
              (conversation.starterId === user?.id ||
                conversation.participantId === user?.id) ? (
                <div className="single_message">
                  {conversation.messages.map((message) =>
                    message.userId === user?.id ? (
                      <div className="my_message">
                        <li className="">
                          <h4 className="users_name">{message.message}</h4>
                        </li>
                        <img src={user?.image}></img>
                      </div>
                    ) : null
                  )}
                </div>
              ) : null
            )}
          </ul>
        </div>
        {chooseFridend !== undefined ? (
          <form
            className="form"
            onSubmit={(e) => {
              e.preventDefault();
              //@ts-ignore
              const message = String(e.target.message.value);
              let newid = conversations.find(
                (conversation) =>
                  (conversation.participantId === user?.id ||
                    conversation.starterId === user?.id) &&
                  (conversation.participantId === chooseFridend?.id ||
                    conversation.starterId === chooseFridend?.id)
              );
              if (newid === undefined) {
                fetch("http://localhost:4000/conversations", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    starterId: user?.id,
                    participantId: chooseFridend?.id,
                  }),
                })
                  .then((response) => response.json())
                  .then((newConversation) => {
                    fetch("http://localhost:4000/messages", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        conversationId: newConversation.id,
                        userId: user?.id,
                        message: message,
                      }),
                    })
                      .then((response) => response.json())
                      .then((newMessage) => {
                        setConversations((prevConversations) => {
                          return [
                            ...prevConversations,
                            {
                              ...newConversation,
                              messages: [newMessage],
                            },
                          ];
                        });
                      });
                  });
              }

              console.log(newid);
              //@ts-ignore
              const newMessage = {
                userId: user?.id,
                message: message,
                conversationId: newid?.id,
              };
              const newConversation = {
                starterId: user?.id,
                participantId: chooseFridend?.id,
                messages: [newMessage],
              };
              setConversations([...conversations, newConversation]);

              fetch("http://localhost:4000/messages", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(newMessage),
              });

              //@ts-ignore
              e.target.message.value = "";
            }}
          >
            <input placeholder="Sent message...." name="message"></input>
            <button>
              <FaPaperPlane />
            </button>
          </form>
        ) : null}
      </main>
    </div>
  );
}
