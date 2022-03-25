import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";

function OnBoarding() {
  const [createRoom, setcreateRoom] = useState(false);
  const [onboard, setonboard] = useState(true);
  const [name, setname] = useState("");
  const [roomId, setroomId] = useState("");
  let navigate = useNavigate();

  //function currying to navigate properly
  const withNotEmpty = (variable, fn) => {
    if (variable !== "") {
      return function () {
        fn();
      };
    }
  };
  const withNameNotEmpty = withNotEmpty.bind(this, name);
  const withRoomIdNotEmpty = withNotEmpty.bind(this, roomId);

  const handleCreateRoom = withNameNotEmpty(() => {
    setcreateRoom(true);
    setroomId(v4());
    setonboard(false);
  });

  const handleJoinRoom = withNameNotEmpty(() => {
    if (name !== "") {
      setcreateRoom(false);
      setonboard(false);
    }
  });

  const navigateToChatRoom = withRoomIdNotEmpty(() => {
    let path = `${name}&${roomId}`;
    navigate(path);
  });

  return (
    <div className='on-boarding'>
      {onboard ? (
        <>
          <input
            type='text'
            value={name}
            onChange={(e) => setname(e.target.value)}
            placeholder={"Join as"}
          />

          <div className='create-room option' onClick={handleCreateRoom}>
            Create Room
          </div>
          <div className='join-room option' onClick={handleJoinRoom}>
            Join Room
          </div>
        </>
      ) : createRoom ? (
        <>
          <div className='create-room rooms'>
            <button onClick={navigateToChatRoom}> Create Room {roomId}</button>
          </div>
        </>
      ) : (
        <>
          <div className='join-room rooms'>
            <input
              type='text'
              value={roomId}
              onChange={(e) => setroomId(e.target.value)}
            />
            <button onClick={navigateToChatRoom}>NEXT</button>
          </div>
        </>
      )}
    </div>
  );
}

export default OnBoarding;
