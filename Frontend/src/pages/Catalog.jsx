import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import ItemCard from '../components/ItemCard';
import FiltersPanel from '../components/FiltersPanel';

export default function Catalog() {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({ q: '', author: '', category:'', genre:'', year:'', type:'' });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const paramsObj = { page, limit: 12 };
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== null && String(v).trim() !== '') paramsObj[k] = v;
      });

      // Sesuaikan endpoint backend-mu; aku pakai /book seperti yang kamu sebutkan
      const res = await api.get('/book', { params: paramsObj });

      // adaptif terhadap beberapa struktur response
      const payload = res.data;
      const itemsList = payload?.data?.items ?? payload?.items ?? payload?.data ?? payload ?? [];
      const totalCount = payload?.data?.total ?? payload?.total ?? (Array.isArray(itemsList) ? itemsList.length : 0);

      setItems(Array.isArray(itemsList) ? itemsList : []);
      setTotal(Number(totalCount) || 0);
    } catch (err) {
      console.error('Failed to load items:', err);
      const msg = err.response?.data?.message || err.message || 'Gagal mengambil data';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1">
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <h4 className="text-lg font-semibold mb-4 text-gray-700">Filter</h4>
          <FiltersPanel filters={filters} setFilters={setFilters} />
        </div>
      </div>

      <div className="lg:col-span-3">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <input
              value={filters.q}
              onChange={e => { setPage(1); setFilters(f => ({ ...f, q: e.target.value })); }}
              placeholder="Cari judul, penulis..."
              className="input"
            />
          </div>
          <div className="text-sm text-gray-600">{total} hasil</div>
        </div>

        {error ? (
          <div className="mb-4 error-box">{error}</div>
        ) : loading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : items.length === 0 ? (
          <div className="p-6 text-center text-gray-600">Tidak ada item.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map(it => (
              <ItemCard key={it.id ?? it._id ?? JSON.stringify(it)} item={it} />
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-3 py-1 border rounded">{page}</span>
          <button
            disabled={items.length === 0 || items.length < 12}
            onClick={() => setPage(p => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
