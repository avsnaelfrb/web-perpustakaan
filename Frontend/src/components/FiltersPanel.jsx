import React from 'react';

export default function FiltersPanel({ filters, setFilters }) {
  const update = (k, v) => setFilters(f => ({ ...f, [k]: v }));

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-3">Filter</h3>
      <div className="space-y-3">
        <div>
          <label className="text-sm">Jenis</label>
          <select value={filters.type} onChange={e => update('type', e.target.value)} className="w-full mt-1 py-2 px-2 border rounded">
            <option value="">Semua</option>
            <option value="book">Buku</option>
            <option value="journal">Jurnal</option>
            <option value="article">Artikel</option>
          </select>
        </div>
        <div>
          <label className="text-sm">Kategori</label>
          <input value={filters.category} onChange={e => update('category', e.target.value)} className="w-full mt-1 py-2 px-2 border rounded" placeholder="kategori"/>
        </div>
        <div>
          <label className="text-sm">Tema / Genre</label>
          <input value={filters.genre} onChange={e => update('genre', e.target.value)} className="w-full mt-1 py-2 px-2 border rounded" placeholder="tema"/>
        </div>
        <div>
          <label className="text-sm">Penulis</label>
          <input value={filters.author} onChange={e => update('author', e.target.value)} className="w-full mt-1 py-2 px-2 border rounded" placeholder="nama penulis"/>
        </div>
        <div>
          <label className="text-sm">Tahun</label>
          <input value={filters.year} onChange={e => update('year', e.target.value)} className="w-full mt-1 py-2 px-2 border rounded" placeholder="2021"/>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setFilters({ q:'', author:'', category:'', genre:'', year:'', type:''})} className="flex-1 py-2 border rounded">Reset</button>
        </div>
      </div>
    </div>
  );
}
