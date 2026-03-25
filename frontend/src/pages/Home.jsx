import React from 'react';
import { useSelector } from 'react-redux'; 
import StudentDashboard from './StudentDashboard';
import VendorDashboard from './VendorDashboard';
import DeliveryDashboard from './DeliveryDashboard';

function Home({ socket }) {
  const { userData } = useSelector((state) => state.user);

  return (
    <div>
       {userData?.role === "student" && <StudentDashboard />}
       {userData?.role === "vendor" && <VendorDashboard />}  
       {userData?.role === "delivery" && <DeliveryDashboard  socket={socket}/>}  
    </div>
  );
}

export default Home;
