import React from 'react'
import { useParams } from 'react-router-dom'


function Dashboard() {
  const {name, roomId} = useParams();
  console.log(name);
  console.log(roomId);

  return (
    <div>Dashboard</div>
  )
}

export default Dashboard