import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar({ role }) {
  return (
    <aside className="w-64 bg-white border-r min-h-screen p-4">
      <div className="mb-6">
        <h2 className="text-xl font-bold">E-Library</h2>
        <p className="text-sm text-gray-500">Halo, selamat datang</p>
      </div>

      <nav className="space-y-1">
        {role === 'user' ? (
          <>
            <NavLink to="/dashboard/catalog" className={({isActive}) => `block px-3 py-2 rounded ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}>Katalog</NavLink>
            <NavLink to="/dashboard/profile" className={({isActive}) => `block px-3 py-2 rounded ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}>Profile</NavLink>
          </>
        ) : (
          <>
            <NavLink to="/admin/items" className={({isActive}) => `block px-3 py-2 rounded ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}>Barang</NavLink>
            <NavLink to="/admin/requests" className={({isActive}) => `block px-3 py-2 rounded ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}>Peminjaman</NavLink>
            <NavLink to="/admin/returns" className={({isActive}) => `block px-3 py-2 rounded ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}>Pengembalian</NavLink>
            <NavLink to="/admin/profile" className={({isActive}) => `block px-3 py-2 rounded ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}>Profile</NavLink>
          </>
        )}
      </nav>
    </aside>
  );
}
