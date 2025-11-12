import React, { useEffect, useState } from 'react';
import api from '../utils/api';

export default function Profile(){
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await api.post('/me');
      if (res.ok) setProfile(res.data);
      const h = await api.post('/my-borrows');
      if (h.ok) setHistory(h.data || []);
    })();
  }, []);

  return (
    <div className="max-w-3xl">
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold">Profil</h2>
        <p className="mt-2 text-gray-600">Nama: {profile?.name}</p>
        <p className="text-gray-600">Email: {profile?.email}</p>
        <p className="text-gray-600">NIM: {profile?.nim}</p>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h3 className="font-semibold mb-3">Riwayat Peminjaman</h3>
        {history.length === 0 ? <p className="text-gray-500">Belum ada riwayat</p> :
          <table className="w-full text-sm">
            <thead className="text-left text-gray-600">
              <tr><th>Item</th><th>Tgl Pinjam</th><th>Tgl Kembali</th><th>Status</th></tr>
            </thead>
            <tbody>
              {history.map(h => (
                <tr key={h._id} className="border-t">
                  <td>{h.itemTitle}</td>
                  <td>{new Date(h.borrowedAt).toLocaleDateString()}</td>
                  <td>{h.returnedAt ? new Date(h.returnedAt).toLocaleDateString() : '-'}</td>
                  <td>{h.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      </div>
    </div>
  );
}
