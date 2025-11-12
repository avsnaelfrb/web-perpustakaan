import React from 'react';

export default function Navbar({ title }) {
  return (
    <div className="flex items-center justify-between bg-white p-4 border-b">
      <h1 className="text-lg font-semibold">{title}</h1>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">Signed in</span>
        <button onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('role'); window.location.href = '/login'; }} className="text-sm px-3 py-2 rounded bg-red-50 text-red-600">Logout</button>
      </div>
    </div>
  );
}
