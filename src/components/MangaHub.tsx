import React from 'react';
import { MANGA } from '../mangaData';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';
import { FavoriteItem } from '../types';

interface MangaHubProps {
  favorites: FavoriteItem[];
  onToggleFavorite: (item: FavoriteItem) => void;
}

export default function MangaHub({ favorites, onToggleFavorite }: MangaHubProps) {
  return (
    <div className="p-8 max-w-7xl mx-auto pb-32">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-[var(--mk-gold)] drop-shadow-[0_0_10px_var(--mk-gold)] mb-4">
          MK-PLAZA MANGA
        </h1>
        <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">
          For those who like to read rather than watch
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {MANGA.map((manga, idx) => {
          const isFavorited = favorites.some(f => f.id === manga.title);
          return (
            <motion.a
              key={idx}
              href={manga.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-[var(--glass-heavy)] backdrop-blur-xl border border-yellow-400/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col group relative"
            >
              <div className="aspect-[3/4] relative overflow-hidden">
                <img 
                  src={manga.imageUrl} 
                  alt={manga.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--mk-midnight)] to-transparent opacity-60" />
                
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggleFavorite({
                      id: manga.title,
                      type: 'manga',
                      title: manga.title,
                      imageUrl: manga.imageUrl,
                      link: manga.url
                    });
                  }}
                  className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-md border transition-all z-20 ${
                    isFavorited 
                      ? 'bg-[var(--mk-gold)] border-[var(--mk-gold)] text-[var(--mk-midnight)]' 
                      : 'bg-black/40 border-white/10 text-white hover:border-[var(--mk-gold)] hover:text-[var(--mk-gold)]'
                  }`}
                >
                  <Star className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                </button>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-[var(--mk-gold)] text-center truncate mb-2">{manga.title}</h3>
                {manga.description && (
                  <p className="text-xs text-[var(--mk-silver)]/70 mb-4 line-clamp-3 flex-1 text-center">
                    {manga.description}
                  </p>
                )}
                {manga.year && (
                  <div className="text-[10px] uppercase tracking-widest font-bold text-[var(--mk-gold)]/50 text-center mt-auto">
                    {manga.year}
                  </div>
                )}
              </div>
            </motion.a>
          );
        })}
      </div>

      {MANGA.length === 0 && (
        <div className="text-center py-20 text-[var(--mk-silver)] opacity-50">
          No manga found in the archive.
        </div>
      )}
    </div>
  );
}
