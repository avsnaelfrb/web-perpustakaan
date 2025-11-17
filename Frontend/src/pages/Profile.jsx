import React, { useEffect, useState } from 'react';
import api from '../utils/api';

export default function Profile(){
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        
        const userData = JSON.parse(localStorage.getItem('currentUser'));
        if (userData) {
          setProfile(userData);
        }

      } catch (err) {
        console.error('Failed to load profile:', err);
        setError('Gagal memuat profil');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Profil</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-gray-600 font-medium w-20">Nama:</span>
            <span className="text-gray-800">{profile?.name || '-'}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-600 font-medium w-20">Email:</span>
            <span className="text-gray-800">{profile?.email || '-'}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-600 font-medium w-20">Role:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              profile?.role === 'ADMIN' 
                ? 'bg-purple-100 text-purple-700' 
                : 'bg-blue-100 text-blue-700'
            }`}>
              {profile?.role || 'USER'}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Riwayat Peminjaman</h2>
        {history.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Belum ada riwayat</p>
        ) : (
          <div className="space-y-3">
            {history.map((item, idx) => (
              <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                <p className="font-semibold">{item.bookTitle}</p>
                <p className="text-sm text-gray-600">
                  {item.borrowDate} - {item.returnDate || 'Belum dikembalikan'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}