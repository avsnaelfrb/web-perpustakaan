import React from 'react';

export default function ItemCard({ item }) {
  return (
    <div className="bg-white p-4 rounded shadow flex gap-4">
      <div className="w-20 h-28 bg-gray-100 rounded flex-shrink-0" />
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800">{item.title ?? item.name ?? 'Untitled'}</h3>
        <p className="text-sm text-gray-500">{item.author ?? item.writer ?? '—'} • {item.year ?? '—'}</p>
        <p className="text-sm mt-2 text-gray-600">{item.category ?? '—'} • {item.type ?? '—'}</p>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-sm px-2 py-1 border rounded text-gray-700">{item.stock ?? 0} stok</span>
          <button
            className="ml-auto btn-brand text-sm"
            disabled={!(item.stock > 0)}
          >
            Pinjam
          </button>
        </div>
      </div>
    </div>
  );
}
