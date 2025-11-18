import React from 'react';

export default function FiltersPanel({ filters, setFilters }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 lg:p-5">
      <h2 className="text-lg lg:text-xl font-bold mb-4 lg:mb-6">Filter</h2>

      {/* Jenis */}
      <div className="mb-4 lg:mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Jenis
        </label>
        <select
          value={filters.type}
          onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
          className="w-full px-3 py-2 border rounded-lg text-sm lg:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Semua Jenis</option>
          <option value="BOOK">Buku</option>
          <option value="MAGAZINE">Majalah</option>
          <option value="JOURNAL">Jurnal</option>
        </select>
      </div>

      {/* Kategori */}
      <div className="mb-4 lg:mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kategori
        </label>
        <input
          type="text"
          value={filters.category}
          onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
          className="w-full px-3 py-2 border rounded-lg text-sm lg:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Cari kategori..."
        />
      </div>

      {/* Tema / Genre */}
      <div className="mb-4 lg:mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tema / Genre
        </label>
        <input
          type="text"
          value={filters.genre}
          onChange={e => setFilters(f => ({ ...f, genre: e.target.value }))}
          className="w-full px-3 py-2 border rounded-lg text-sm lg:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Cari tema..."
        />
      </div>

      {/* Penulis */}
      <div className="mb-4 lg:mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Penulis
        </label>
        <input
          type="text"
          value={filters.author}
          onChange={e => setFilters(f => ({ ...f, author: e.target.value }))}
          className="w-full px-3 py-2 border rounded-lg text-sm lg:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Nama penulis..."
        />
      </div>

      {/* Tahun Terbit */}
      <div className="mb-4 lg:mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tahun Terbit
        </label>
        <input
          type="text"
          value={filters.year}
          onChange={e => setFilters(f => ({ ...f, year: e.target.value }))}
          className="w-full px-3 py-2 border rounded-lg text-sm lg:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="2024"
        />
      </div>

      {/* Reset Button */}
      <button
        onClick={() => setFilters({ q: '', author: '', category:'', genre:'', year:'', type:'' })}
        className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm lg:text-base font-medium"
      >
        Reset Filter
      </button>
    </div>
  );
}