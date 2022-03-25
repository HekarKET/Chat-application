import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import socketio from "socket.io-client";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import sendArrow from "../Assets/arrow.PNG"

function Dashboard() {
  const { name, roomId } = useParams();
  const message = useRef("");
  const [socket, setsocket] = useState(null);
  const [messages, setmessages] = useState([]);
  const [editorState, seteditorState] = useState("");

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
    let data = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    socket.emit("chatMessage", data);
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
                    <div className='message-text'>
                      {
                        <div
                          dangerouslySetInnerHTML={{ __html: item.message }}
                        />
                      }
                    </div>
                    <div className='date'>{moment(item.date).fromNow()}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className='editor-div-chat'>
              <Editor
                editorState={editorState}
                onEditorStateChange={(e) => seteditorState(e)}
                placeholder='Chat comes here'
                wrapperClassName='demo-wrapper'
                editorClassName='demo-editor'
                toolbar={{
                  options: ["inline", "link", "list", "emoji", "image"],
                  inline: {
                    inDropdown: false,
                    className: undefined,
                    component: undefined,
                    dropdownClassName: undefined,
                    options: ["bold", "italic", "strikethrough", "monospace"],
                  },
                  list: {
                    inDropdown: false,
                    className: undefined,
                    component: undefined,
                    dropdownClassName: undefined,
                    options: ["ordered", "unordered", "indent"],
                  },
                }}
                mention={{
                  separator: " ",
                  trigger: "@",
                  suggestions: [
                    { text: "APPLE", value: "apple", url: "apple" },
                    { text: "BANANA", value: "banana", url: "banana" },
                    { text: "CHERRY", value: "cherry", url: "cherry" },
                    { text: "DURIAN", value: "durian", url: "durian" },
                    { text: "EGGFRUIT", value: "eggfruit", url: "eggfruit" },
                    { text: "FIG", value: "fig", url: "fig" },
                    {
                      text: "GRAPEFRUIT",
                      value: "grapefruit",
                      url: "grapefruit",
                    },
                    { text: "HONEYDEW", value: "honeydew", url: "honeydew" },
                  ],
                }}
              />
              <button onClick={sendMessage}><img src={sendArrow} alt="send-arrow" /></button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
