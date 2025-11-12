import React, { useEffect, useState } from 'react';
//import { fetchJson } from '../utils/api';
import AddItemForm from './AddItemForm';

export default function AdminItems(){
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const res = await fetchJson('/items?limit=1000');
    if (res.ok) setItems(res.data.items || []);
  };

  useEffect(() => { load(); }, []);

  const onAdded = (newItem) => {
    setItems(prev => [newItem, ...prev]);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Manajemen Barang</h2>
        <button onClick={() => setShowForm(s => !s)} className="px-3 py-2 bg-indigo-600 text-white rounded">
          {showForm ? 'Tutup' : 'Tambah Barang'}
        </button>
      </div>

      {showForm && <AddItemForm onAdded={onAdded} />}

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map(it => (
          <div key={it._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <div className="font-semibold">{it.title}</div>
              <div className="text-sm text-gray-500">{it.author} • {it.type} • {it.category}</div>
            </div>
            <div className="text-sm text-gray-600">stok: {it.stock}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
