import React, { useEffect, useState } from 'react';
//import { fetchJson } from '../utils/api';
import ItemCard from '../components/ItemCard';
import FiltersPanel from '../components/FiltersPanel';

export default function Catalog() {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({ q: '', author: '', category:'', genre:'', year:'', type:'' });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const load = async () => {
    setLoading(true);
    // build query params
    const params = new URLSearchParams({ page, limit: 12 });
    Object.entries(filters).forEach(([k,v]) => v && params.set(k, v));
    const res = await fetchJson(`/items?${params.toString()}`);
    if (res.ok) {
      setItems(res.data.items || []);
      setTotal(res.data.total || 0);
    } else {
      // handle error
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [filters, page]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1">
        <FiltersPanel filters={filters} setFilters={setFilters} />
      </div>
      <div className="lg:col-span-3">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <input value={filters.q} onChange={e => setFilters(f => ({...f, q: e.target.value}))}
              placeholder="Cari judul, penulis..." className="w-full md:w-96 px-3 py-2 border rounded" />
          </div>
          <div className="text-sm text-gray-600">{total} hasil</div>
        </div>

        {loading ? <div>Loading...</div> : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map(it => <ItemCard key={it._id} item={it} />)}
          </div>
        )}

        {/* simple pagination */}
        <div className="mt-6 flex justify-center gap-2">
          <button disabled={page<=1} onClick={() => setPage(p => p-1)} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
          <span className="px-3 py-1 border rounded">{page}</span>
          <button disabled={items.length===0 || items.length < 12} onClick={() => setPage(p => p+1)} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  );
}
