import './App.css';
import Sidebar from './Sidebar';
import Chat from './Chat';
import React, { useEffect, useState } from 'react';
import Pusher from "pusher-js"
import axios from "./axios"

function App() {

  const [messages, setMessages] = useState([])

  // when app loads, run this once
  useEffect(() => {
    axios.get("/messages/sync")
    .then(response => {
      setMessages(response.data)
    })
  }, [])

  // new message effect
  useEffect(() => {
    const pusher = new Pusher('ec4f3ea4626953853beb', {
      cluster: 'ap2'
    });

    const channel = pusher.subscribe('messages');   // "messages" getting from server.js
    channel.bind('inserted', (newMessage) => {    // "inserted" getting from server.js
      setMessages([...messages, newMessage])
    }); 

    // clean-up function after sending message
    return () => {  
      channel.unbind_all()
      channel.unsubscribe()
    }
  }, [messages])

  console.log(messages)

  return (
    <div className="app">
      <div className="app__body">
        <Sidebar />
        <Chat messages={messages}/>
      </div>
    </div>
  );
}

export default App;
