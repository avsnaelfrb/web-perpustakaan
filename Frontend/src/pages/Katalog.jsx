// src/pages/Katalog.jsx
import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import ItemCard from '../components/ItemCard';
import FiltersPanel from '../components/FiltersPanel';

export default function Katalog() {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({ q: '', author: '', category:'', genre:'', year:'', type:'' });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState('');

  // Helper: ambil origin backend dari api.defaults.baseURL
  const getBackendOrigin = () => {
    const base = api?.defaults?.baseURL || '';
    if (!base) return 'http://localhost:5000';
    return base.replace(/\/api\/?$/, '');
  };
  const backendOrigin = getBackendOrigin();

  const coverBuku = (cover) => {
    if (!cover) return null;
    if (/^https?:\/\//.test(cover)) return cover;
    // jika cover mulai dengan '/', gabungkan origin
    if (cover.startsWith('/')) return `${backendOrigin}${cover}`;
    return `${backendOrigin}/${cover}`;
  };

  const load = async () => {
    setLoading(true);
    setError('');

    try {
      const params = { page, limit: 12 };
      Object.entries(filters).forEach(([key, val]) => {
        if (String(val).trim() !== '') params[key] = val;
      });

      const res = await api.get('/book', { params });

      const resData = res?.data?.data ?? res?.data ?? [];
      const list = Array.isArray(resData) ? resData : (resData.items ?? []);
      const count = Array.isArray(resData) ? list.length : (resData.total ?? list.length);


      const normalized = list.map(b => {
        const coverField = b.cover ?? ''; 
        const coverUrl = coverBuku(coverField);
        return {
          ...b,
          coverUrl,
        };
      });

      setItems(normalized);
      setTotal(count);

    } catch (err) {
      console.error("Failed to load items:", err);
      setError(err.response?.data?.message || "Gagal mengambil data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filters, page]);

  return (
    <div className="flex gap-6">
      <div className="w-64 flex-shrink-0">
        <FiltersPanel filters={filters} setFilters={setFilters} />
      </div>

      <div className="flex-1">
        {/* Search */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={filters.q}
                onChange={e => {
                  setPage(1);
                  setFilters(f => ({ ...f, q: e.target.value }));
                }}
                className="w-full pl-10 pr-4 py-3 border rounded-lg"
                placeholder="Cari judul, penulis..."
              />
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading && <div className="p-10 text-center">Memuat...</div>}

        {/* Items */}
        {!loading && !error && items.length === 0 && (
          <div className="p-10 text-center text-gray-500">Tidak ada item ditemukan</div>
        )}

        {!loading && !error && items.length > 0 && (
          <div className="space-y-4">
            {items.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && items.length > 0 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-4 py-2 border rounded disabled:opacity-40"
            >
              Prev
            </button>

            <span className="px-4 py-2 bg-blue-600 text-white rounded">
              {page}
            </span>

            <button
              disabled={items.length < 12}
              onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 border rounded disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
