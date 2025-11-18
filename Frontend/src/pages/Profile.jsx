import React, { useEffect, useState } from 'react';
import api from '../utils/api';

export default function Profile() {
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
      <div className="flex justify-center items-center py-12 lg:py-20">
        <div className="animate-spin rounded-full h-10 w-10 lg:h-12 lg:w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-3 lg:p-4 rounded text-sm lg:text-base">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-full lg:max-w-3xl">
      {/* Profile Card */}
      <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border border-gray-200 mb-4 lg:mb-6">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-3 lg:mb-4">Profil</h2>
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <span className="text-gray-600 font-medium text-sm lg:text-base sm:w-20">Nama:</span>
            <span className="text-gray-800 text-sm lg:text-base">{profile?.name || '-'}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <span className="text-gray-600 font-medium text-sm lg:text-base sm:w-20">Email:</span>
            <span className="text-gray-800 text-sm lg:text-base break-all">{profile?.email || '-'}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <span className="text-gray-600 font-medium text-sm lg:text-base sm:w-20">Role:</span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs lg:text-sm font-medium w-fit ${
              profile?.role === 'ADMIN' 
                ? 'bg-purple-100 text-purple-700' 
                : 'bg-blue-100 text-blue-700'
            }`}>
              {profile?.role || 'USER'}
            </span>
          </div>
        </div>
      </div>

      {/* History Card */}
      <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-3 lg:mb-4">Riwayat Peminjaman</h2>
        {history.length === 0 ? (
          <div className="py-8 lg:py-12 text-center">
            <svg className="w-12 h-12 lg:w-16 lg:h-16 text-gray-300 mx-auto mb-3 lg:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 text-sm lg:text-base">Belum ada riwayat peminjaman</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item, idx) => (
              <div key={idx} className="p-3 lg:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <p className="font-semibold text-sm lg:text-base text-gray-900">{item.bookTitle}</p>
                <p className="text-xs lg:text-sm text-gray-600 mt-1">
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