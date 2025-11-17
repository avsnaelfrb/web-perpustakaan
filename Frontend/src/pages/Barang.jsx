import React, { useEffect, useState } from 'react';
import api from '../utils/api';

export default function Barang() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState('title'); 


  // di atas component atau dalam file
// helper untuk convert cover field menjadi URL yang bisa diakses browser
const coverBuku = (cover) => {
  if (!cover) return null;
  // kalau sudah full URL
  if (/^https?:\/\//i.test(cover)) return cover;

  // jika value dimulai dengan '/uploads' -> gabungkan dengan origin (http://localhost:5000)
  if (cover.startsWith('/uploads')) {
    // gunakan window.location.origin untuk domain yang dipakai browser ke frontend
    // tapi backend mungkin di port berbeda -> ganti origin jika backend di host lain
    const backendOrigin = window.__BACKEND_ORIGIN__ || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : window.location.origin);
    return `${backendOrigin}${cover}`;
  }

  // jika value tanpa leading slash, tambahkan
  const backendOrigin = window.__BACKEND_ORIGIN__ || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : window.location.origin);
  return `${backendOrigin}/${cover.startsWith('/') ? cover.slice(1) : cover}`;
};



  const loadItems = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/book', { params: { limit: 1000 } });
      
      const list = res?.data?.data || res?.data || [];
      
      console.log('API Response:', list);
  
      if (!Array.isArray(list)) {
        setItems([]);
      } else {
        // Normalize data structure
        const normalizedList = list.map(item => ({
          id: item.id,
          title: item.title || '',
          author: item.author || '',
          description: item.description || '',
          type: item.type || '',
          genre: item.genre?.name || '',
          genreId: item.genreId,
          stock: item.stock || 0,
          cover: item.cover || '',
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        }));
        
        setItems(normalizedList);
      }
    } catch (err) {
      console.error("Barang load failed", err);
      setError(err.response?.data?.message || 'Gagal memuat data barang');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadItems(); }, []);


const filteredItems = items
.filter(item => {
  const title = item.title || '';
  const author = item.author || '';
  const type = item.type || '';
  
  const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       author.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesCategory = !filterCategory || type === filterCategory;
  
  return matchesSearch && matchesCategory;
})
.sort((a, b) => {
  const aVal = sortBy === 'title' ? a.title :
               sortBy === 'author' ? a.author :
               a.id; 
  const bVal = sortBy === 'title' ? b.title :
               sortBy === 'author' ? b.author :
               b.id;
  
  if (typeof aVal === 'number') return bVal - aVal;
  return String(aVal).localeCompare(String(bVal));
});

const categories = [...new Set(items.map(b => b.type).filter(Boolean))];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Daftar Barang</h1>
        <p className="text-gray-600">Lihat semua koleksi buku perpustakaan</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Buku</p>
              <p className="text-2xl font-bold text-gray-800">{items.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Kategori</p>
              <p className="text-2xl font-bold text-gray-800">{categories.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Ditampilkan</p>
              <p className="text-2xl font-bold text-gray-800">{filteredItems.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-64">
            <div className="relative">
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Cari judul atau penulis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-white pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 text-white py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Semua Kategori</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Sort */}
          <select
  value={sortBy}
  onChange={(e) => setSortBy(e.target.value)}
  className="px-4 text-white py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
>
  <option value="title">Urutkan: Judul</option>
  <option value="author">Urutkan: Penulis</option>
  <option value="id">Urutkan: Terbaru</option>
</select>

          {/* Refresh Button */}
          <button
            onClick={loadItems}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Table List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Tidak ada buku</h3>
            <p className="text-gray-500">Tidak ada buku yang sesuai dengan pencarian</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
  <tr>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      No
    </th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      Judul Buku
    </th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      Penulis
    </th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      Tipe
    </th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      Genre
    </th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      Stok
    </th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      Status
    </th>
  </tr>
</thead>
              <tbody className="divide-y divide-gray-200">
  {filteredItems.map((item, index) => (
    <tr key={item.id} className="hover:bg-gray-50 transition">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {index + 1}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center">
        <div className="w-12 h-12 rounded flex items-center justify-center flex-shrink-0 overflow-hidden bg-gray-100">
  {item.cover ? (
    (() => {
      const src = coverBuku(item.cover);
      console.log('Render cover for id', item.id, '->', item.cover, '->', src);
      return (
        <img
          src={src}
          alt={item.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.style.display = 'none';
            const p = e.currentTarget.parentNode;
            if (p) p.innerHTML = '📚';
          }}
        />
      );
    })()
  ) : (
    <div className="text-lg">📚</div>
  )}
</div>

          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {item.title}
            </div>
            {item.description && (
              <div className="text-xs text-gray-500 mt-1">
                {item.description.substring(0, 50)}...
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        {item.author}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded uppercase">
          {item.type}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
          {item.genre || '-'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {item.stock} buku
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
          item.stock > 0 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {item.stock > 0 ? 'Tersedia' : 'Habis'}
        </span>
      </td>
    </tr>
  ))}
</tbody>
            </table>
          </div>
        )}
      </div>

      {/* Info Footer */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Informasi</p>
            <p>Data barang hanya dapat diupdate melalui menu <strong>Pengadaan</strong>, <strong>Peminjaman</strong>, dan <strong>Pengembalian</strong>.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
