import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Catalog from './Catalog';
import Profile from './Profile';

export default function DashboardUser() {
  const role = localStorage.getItem('role') || 'user';

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role={role} />
      <div className="flex-1">
        <Navbar title="Dashboard User" />
        <main className="p-6">
          <Routes>
            <Route path="/" element={<Navigate to="catalog" replace />} />
            <Route path="catalog/*" element={<Catalog />} />
            <Route path="profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

