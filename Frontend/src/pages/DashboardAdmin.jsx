import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Barang from './Barang';
import Pengadaan from './Pengadaan';
import BorrowRequest from './BorrowRequest';
import ReturnApprovals from './ReturnApprovals';
import Profile from './Profile';

export default function DashboardAdmin() {
  const role = (localStorage.getItem('role') || 'ADMIN').toUpperCase();

  if (role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role={role} />
      <div className="flex-1">
        <Navbar title="Dashboard Admin" />
        <main className="p-6">
          <Routes>
            <Route path="/" element={<Navigate to="book" replace />} />
            <Route path="barang/*" element={<Barang />} />
            <Route path="pengadaan" element={<Pengadaan />} />
            <Route path="peminjaman" element={<BorrowRequest />} />
            <Route path="pengembalian" element={<ReturnApprovals />} />
            <Route path="profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

