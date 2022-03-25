import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import socketio from "socket.io-client";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import sendArrow from "../Assets/arrow.PNG";
import boldIcon from "../Assets/bold.PNG";
import codeIcon from "../Assets/code.PNG";
import emojiIcon from "../Assets/emoji.PNG";
import italicIcon from "../Assets/italic.PNG";
import justifyIcon from "../Assets/justify.PNG";
import linkIcon from "../Assets/link.PNG";
import orderedlistIcon from "../Assets/orderedlist.PNG";
import strikethroughIcon from "../Assets/strikethrough.PNG";
import unorderedlistIcon from "../Assets/unorderdlist.PNG";
import addIcon from "../Assets/addIcon.PNG";

function Dashboard() {
  const { name, roomId } = useParams();
  const message = useRef("");
  const [socket, setsocket] = useState(null);
  const [messages, setmessages] = useState([]);
  const [editorState, seteditorState] = useState("");
  const [users, setusers] = useState([]);

  useEffect(() => {
    let socket = socketio(`http://${window.location.hostname}:4000`);
    socket.emit("joinRoom", { username: name, room: roomId });
    setsocket(socket);
  }, []);

  useEffect(() => {
    if (socket) {
      const messageListener = (message) => {
        // console.log(messages);
        setmessages((prev) => [...prev, message]);
      };
      const userListener = (user) => {
        // console.log(messages);
        let newUser = user.map((item) => ({
          text: item.username,
          value: item.username,
          url: item.username,
        }));
        console.log(newUser);
        setusers((prev) => [...prev, ...newUser]);
      };

      socket.on("message", messageListener);
      socket.on("roomUsers", userListener);
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
                    bold: { icon: boldIcon, className: undefined },
                    italic: { icon: italicIcon, className: undefined },
                    strikethrough: {
                      icon: strikethroughIcon,
                      className: undefined,
                    },
                    monospace: { icon: codeIcon, className: undefined },
                  },
                  link: {
                    options: ["link"],
                    link: { icon: linkIcon, className: undefined },
                  },
                  emoji: {
                    icon: emojiIcon,
                  },
                  image: {
                    icon: addIcon,
                  },
                  list: {
                    inDropdown: false,
                    className: undefined,
                    component: undefined,
                    dropdownClassName: undefined,
                    options: ["ordered", "unordered", "indent"],
                    ordered: { icon: orderedlistIcon, className: undefined },
                    unordered: {
                      icon: unorderedlistIcon,
                      className: undefined,
                    },
                    indent: {
                      icon: justifyIcon,
                      className: undefined,
                    },
                  },
                }}
                mention={{
                  separator: " ",
                  trigger: "@",
                  suggestions: [...users],
                }}
              />
              <button className='send' onClick={sendMessage}>
                <img src={sendArrow} alt='send-arrow' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
