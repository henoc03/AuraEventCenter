import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import SideBar from '../components/common/SideBar';
import "../style/layout.css"

function AdminLayout() {
return (
  <>
    <Header />
    <div className="main-container">
      <SideBar userType="admin" />
      <main className="main">
        <div className="inside-container">
          <Outlet />
        </div>
      </main>
    </div>
  </>
);
}

export default AdminLayout;
