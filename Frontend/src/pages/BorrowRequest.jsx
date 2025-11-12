import React, { useEffect, useState } from 'react';
//import { fetchJson } from '../utils/api';

export default function BorrowRequests(){
  const [requests, setRequests] = useState([]);

  const load = async () => {
    const res = await fetchJson('/borrow-requests');
    if (res.ok) setRequests(res.data || []);
  };
  useEffect(() => { load(); }, []);

  const approve = async (id) => {
    const res = await fetchJson(`/borrow/${id}/approve`, { method: 'POST' });
    if (res.ok) load();
    else alert('Gagal approve');
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Permintaan Peminjaman</h2>
      {requests.length===0 ? <p className="text-gray-500">Tidak ada permintaan</p> :
        <div className="space-y-3">
          {requests.map(r => (
            <div key={r._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
              <div>
                <div className="font-medium">{r.itemTitle}</div>
                <div className="text-sm text-gray-500">oleh: {r.userName} • {new Date(r.requestedAt).toLocaleString()}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => approve(r._id)} className="px-3 py-1 bg-green-600 text-white rounded">Approve</button>
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  );
}
