import React, { useEffect, useState } from 'react';
import api from '../utils/api';

export default function Pengembalian(){
  const [returns, setReturns] = useState([]);
  const load = async () => {
    const res = await api.post('/return-requests');
    if (res.ok) setReturns(res.data || []);
  };
  useEffect(() => { load(); }, []);

  const approve = async (id) => {
    const res = await api.post(`/return/${id}/approve`, { method: 'POST' });
    if (res.ok) load();
    else alert('Gagal approve pengembalian');
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Permintaan Pengembalian</h2>
      {returns.length === 0 ? <p className="text-gray-500">Tidak ada pengembalian</p> :
        <div className="space-y-3">
          {returns.map(r => (
            <div key={r._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
              <div>
                <div className="font-medium">{r.itemTitle}</div>
                <div className="text-sm text-gray-500">oleh: {r.userName} • {new Date(r.returnedAt).toLocaleString()}</div>
              </div>
              <div>
                <button onClick={() => approve(r._id)} className="px-3 py-1 bg-green-600 text-white rounded">Terima & Kembalikan Stok</button>
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  );
}
