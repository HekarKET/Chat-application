import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import socketio from "socket.io-client";

function Dashboard() {
  const { name, roomId } = useParams();
  const message = useRef("");
  const [socket, setsocket] = useState(null);
  const [messages, setmessages] = useState([]);

  useEffect(() => {
    let socket = socketio(`http://${window.location.hostname}:4000`);
    socket.emit("joinRoom", { username: name, room: roomId });
    setsocket(socket);
  }, []);

  useEffect(() => {
    if (socket) {
      const messageListener = (message) => {
        console.log(messages);
        setmessages((prev) => [...prev, message]);
      };

      socket.on("message", messageListener);
    }
  }, [socket]);

  const sendMessage = () => {
    socket.emit("chatMessage", message.current.value);
  };

  return (
    <>
      <div className='dashboard'>
        <div className='chat-display'>
          <div className='sidebar'></div>
          <div className='chatroom'>
            <div className='messages'>
              {messages.map((item, idx) => (
                //Since messages dont have id
                <div className='message' key={idx}>
                  <div className='user'>{item.user}</div>
                  <div className='message-details'>
                    <div className='message'>{item.message}</div>
                    <div className='date'>{moment(item.date).fromNow()}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className='editor'>
              <input type='text' ref={message} />
              <button onClick={sendMessage}>Send</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
