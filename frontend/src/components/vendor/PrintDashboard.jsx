import React from 'react'
import Navbar from '../Navbar'
import AddShop from './AddShop'
import ShowShop from './ShowShop'
import Footer from './../Footer'

function PrintDashboard() {
  return (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
    }}
  >
    <Navbar />

    {/* IMPORTANT WRAPPER */}
    <div style={{ flex: 1 }}>
      <AddShop />
      <ShowShop />
    </div>

    <Footer />
  </div>
);
}

export default PrintDashboard