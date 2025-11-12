// src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar({ role = 'USER' }) {
  const r = String(role).toUpperCase();

  const userLinks = [
    { to: 'catalog', label: 'Katalog' },
    { to: 'profile', label: 'Profile' },
  ];

  const adminLinks = [
    { to: 'barang', label: 'Barang' },
    { to: 'peminjaman', label: 'Peminjaman' },
    { to: 'pengembalian', label: 'Pengembalian' },
    { to: 'profile', label: 'Profile' },
  ];

  const links = r === 'ADMIN' ? adminLinks : userLinks;

  return (
    <nav className="p-6">
      <div className="mb-8">
        <h2 className="text-indigo-600 font-bold text-lg">E-Library</h2>
        <p className="text-sm text-gray-500">Halo, selamat datang</p>
      </div>

      <ul className="space-y-3">
        {links.map(link => (
          <li key={link.to}>
            <NavLink
              to={`/${r === 'ADMIN' ? 'DashboardAdmin' : 'DashboardUser'}/${link.to}`}
              className={({ isActive }) =>
                `block px-4 py-3 rounded ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-indigo-50'}`
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

