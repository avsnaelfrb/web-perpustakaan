// src/components/ItemCard.jsx
import React from 'react';

export default function ItemCard({ item }) {
  // item.coverUrl sudah disiapkan di Katalog.jsx
  const cover = item.cover;

  return (
    <div className="flex gap-4 p-4 bg-white rounded-lg shadow-sm">
      <div className="w-20 h-28 flex-shrink-0 rounded overflow-hidden bg-gray-100">
        {cover ? (
          <img
            src={cover}
            alt={item.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              // fallback: jika tidak ada thumbnail, coba /uploads/covers or placeholder
              e.currentTarget.src = cover.includes('/thumbnails/')
                ? cover.replace('/thumbnails/', '/covers/')
                : '/uploads/placeholder-book.png';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
        )}
      </div>

      <div className="flex-1">
        <div className="font-semibold text-gray-900">{item.title}</div>
        <div className="text-sm text-gray-500">{item.author}</div>
        <div className="text-sm text-gray-600 mt-2 line-clamp-3">{item.description || '-'}</div>
      </div>
    </div>
  );
}
