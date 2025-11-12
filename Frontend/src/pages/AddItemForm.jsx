import React, { useState } from 'react';
import api from '../utils/api';

export default function AddItemForm({ onAdded }) {
  const [form, setForm] = useState({ title:'', author:'', type:'book', category:'', genre:'', year:'', stock:1 });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await api.post('/items', { method: 'POST', body: JSON.stringify(form) });
    if (res.ok) {
      onAdded(res.data);
      setForm({ title:'', author:'', type:'book', category:'', genre:'', year:'', stock:1 });
    } else {
      alert(res.data?.message || 'Gagal tambah barang');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={submit} className="bg-white p-4 rounded shadow mb-4 grid grid-cols-1 md:grid-cols-2 gap-3">
      <input required placeholder="Judul" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="p-2 border rounded"/>
      <input placeholder="Penulis" value={form.author} onChange={e=>setForm({...form,author:e.target.value})} className="p-2 border rounded"/>
      <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} className="p-2 border rounded">
        <option value="book">Buku</option>
        <option value="journal">Jurnal</option>
        <option value="article">Artikel</option>
      </select>
      <input placeholder="Kategori" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="p-2 border rounded"/>
      <input placeholder="Genre" value={form.genre} onChange={e=>setForm({...form,genre:e.target.value})} className="p-2 border rounded"/>
      <input placeholder="Tahun" value={form.year} onChange={e=>setForm({...form,year:e.target.value})} className="p-2 border rounded"/>
      <input type="number" min="0" placeholder="Stock" value={form.stock} onChange={e=>setForm({...form,stock:parseInt(e.target.value||0)})} className="p-2 border rounded"/>
      <div className="md:col-span-2 text-right">
        <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded">{loading ? 'Menyimpan...' : 'Simpan'}</button>
      </div>
    </form>
  );
}
