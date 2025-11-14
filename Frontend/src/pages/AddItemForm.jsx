import React, { useState, useEffect } from 'react';
import api from '../utils/api';

export default function AddItemForm({ onAdded }) {
  const [form, setForm] = useState({
    title: '',
    author: '',
    description: '',
    coverUrl: '',
    type: '',
    yearOfRelease: '',
    genreId: '',
    stock: 1
  });
  const [genres, setGenres] = useState([]);
  const [loadingGenres, setLoadingGenres] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    async function loadGenres() {
      setLoadingGenres(true);
      try {
        const res = await api.get('/genre');

        const body = res?.data ?? res;
        const list = Array.isArray(body)
          ? body
          : Array.isArray(body?.data)
          ? body.data
          : Array.isArray(body?.results)
          ? body.results
          : [];
  
        if (mounted) setGenres(list);
      } catch (err) {
        console.error('Error loading genres', err);
        if (mounted) setGenres([]);
      } finally {
        if (mounted) setLoadingGenres(false);
      }
    }
    loadGenres();
    return () => { mounted = false; };
  }, []);  

  const handleChange = (e) => {
    const { name, value, type: inputType } = e.target;
    if (name === 'stock') {
      const n = Number(value);
      setForm(prev => ({ ...prev, [name]: Number.isNaN(n) ? 0 : n }));
      return;
    }
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const submit = async (e) => {
    e.preventDefault();
  
    // guard: jika sedang submit, abaikan panggilan berikutnya
    if (submitting) {
      console.log('submit ignored (already submitting)');
      return;
    }
  
    setError('');
    setSubmitting(true);
    console.log('submit handler called', form);
  
    if (!form.title || !form.author || !form.genreId) {
      setError('Title, author, dan genre wajib diisi');
      setSubmitting(false);
      return;
    }
  
    const data = {
      title: form.title,
      author: form.author,
      description: form.description,
      coverUrl: form.coverUrl,
      type: form.type || 'BOOK',
      genreId: Number(form.genreId),
      year: form.yearOfRelease || undefined,
      stock: Number(form.stock) || 1
    };
  
    try {
      console.log('About to POST via fetch to http://localhost:5000/api/book');
      const resp = await fetch('http://localhost:5000/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        // credentials: 'include' // kalau backend pakai cookie, uncomment
      });
    
      console.log('fetch returned status', resp.status);
      const body = await resp.json().catch(() => null);
      console.log('fetch response body', body);
    
      if (!resp.ok) {
        setError(body?.message || `Server returned ${resp.status}`);
      } else {
        const created = body?.data ?? body;
        onAdded && onAdded(created);
        setForm({ title:'', author:'', description:'', coverUrl:'', type:'', yearOfRelease:'', genreId:'', stock:1 });
      }
    } catch (err) {
      console.error('fetch submit error', err);
      setError(err.message || 'Gagal koneksi ke server');
    }
  }    
  
  return (
    <form onSubmit={submit} className="bg-white p-4 rounded shadow mb-4 grid grid-cols-1 md:grid-cols-2 gap-3">
      <input required placeholder="Judul" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="p-2 text-white border rounded"/>
      <input placeholder="Penulis" value={form.author} onChange={e=>setForm({...form,author:e.target.value})} className="p-2 text-white border rounded"/>
      <input placeholder="Deskripsi" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="p-2 text-white border rounded"/>
      <input placeholder="Cover Buku" value={form.coverUrl} onChange={e=>setForm({...form,coverUrl:e.target.value})} className="p-2 text-white border rounded"/>
      <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} className="p-2 text-white border rounded">
        <option value="BOOK">Buku</option>
        <option value="JOURNAL">Jurnal</option>
        <option value="ARTICLE">Artikel</option>
      </select>
      <input placeholder="Tahun" value={form.yearOfRelease} onChange={e=>setForm({...form,yearOfRelease:e.target.value})} className="p-2 text-white border rounded"/>
      {loadingGenres ? (
        <div>Memuat genre...</div>
      ) : (
        <select
          name="genreId"
          value={form.genreId}
          onChange={handleChange}
          className="p-2 text-white border rounded"
        >
        {Array.isArray(genres) && genres.length > 0 ? (
  genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)
) : (
  <option value="">-- Tidak ada genre --</option>
)}
        </select>
      )}
      <input type="number" min="0" placeholder="Stok Barang" value={form.stock} onChange={e=>setForm({...form,stock:parseInt(e.target.value||0)})} className="p-2 text-white border rounded"/>
      <div className="md:col-span-2 text-right">
        <button type="submit" disabled={submitting} className="px-4 py-2 bg-green-600 text-white rounded">{submitting ? 'Menyimpan...' : 'Simpan'}</button>
      </div>
    </form>
  );
}
