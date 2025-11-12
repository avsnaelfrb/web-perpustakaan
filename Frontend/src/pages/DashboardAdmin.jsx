import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import AdminItems from './AdminItems';
//import BorrowRequests from './BorrowRequests';
import ReturnApprovals from './ReturnApprovals';
import Profile from './Profile';

export default function DashboardAdmin() {
  const role = localStorage.getItem('role') || 'admin';
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role={role} />
      <div className="flex-1">
        <Navbar title="Dashboard Admin" />
        <main className="p-6">
          <Routes>
            <Route path="/" element={<Navigate to="items" replace />} />
            <Route path="items" element={<AdminItems />} />
            <Route path="returns" element={<ReturnApprovals />} />
            <Route path="profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
