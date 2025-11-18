import React from 'react';

export default function ItemCard({ item }) {
  const cover = item.coverUrl || item.cover;

  return (
    <div className="flex gap-3 lg:gap-4 p-3 lg:p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      {/* Book Cover - Responsive sizing */}
      <div className="w-16 h-24 sm:w-20 sm:h-28 lg:w-24 lg:h-32 flex-shrink-0 rounded overflow-hidden bg-gray-100">
        {cover ? (
          <img
            src={cover}
            alt={item.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error('Image failed to load:', cover);
              e.currentTarget.onerror = null;
              e.currentTarget.src = cover.includes('/thumbnails/')
                ? cover.replace('/thumbnails/', '/covers/')
                : '/uploads/placeholder-book.png';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            No image
          </div>
        )}
      </div>

      {/* Book Details - Responsive text */}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-gray-900 text-sm sm:text-base lg:text-lg mb-1 line-clamp-2">
          {item.title}
        </div>
        <div className="text-xs sm:text-sm text-gray-500 mb-2">
          {item.author}
        </div>
        <div className="text-xs sm:text-sm text-gray-600 line-clamp-2 sm:line-clamp-3">
          {item.description || '-'}
        </div>
      </div>
    </div>
  );
}