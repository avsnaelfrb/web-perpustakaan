import React from 'react';

export default function ItemCard({ item }) {
  return (
    <div className="bg-white p-4 rounded shadow flex gap-4">
      <div className="w-20 h-28 bg-gray-100 rounded" />
      <div className="flex-1">
        <h3 className="font-semibold">{item.title}</h3>
        <p className="text-sm text-gray-500">{item.author} • {item.year}</p>
        <p className="text-sm mt-2">{item.category} • {item.type}</p>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-sm px-2 py-1 border rounded">{item.stock ?? 0} stok</span>
          <button className="ml-auto px-3 py-1 bg-indigo-600 text-white rounded text-sm disabled:opacity-50" disabled={!(item.stock>0)}>Pinjam</button>
        </div>
      </div>
    </div>
  );
}
