// src/pages/AdminItems.jsx
import React, { useEffect, useState } from 'react';
import api from '../utils/api';

export default function AdminItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadItems = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/book', { params: { limit: 1000 } });
      const list = res?.data?.data;

      if (!Array.isArray(list)) {
        setItems([]);
      } else {
        setItems(list);
      }

    } catch (err) {
      console.error("AdminItems load failed", err);
      setError(err.response?.data?.message || 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadItems(); }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="p-4 bg-red-50 text-red-700 rounded">{error}</div>;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Manajemen Barang</h2>
      <div className="grid gap-3">
        {items.length === 0 ? (
          <div>Tidak ada item.</div>
        ) : (
          items.map(item => (
            <div key={item.id} className="p-3 border rounded bg-white">
              <div className="font-semibold">{item.title}</div>
              <div className="text-sm text-gray-500">{item.author}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
