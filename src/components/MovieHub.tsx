import React, { useState, useRef } from 'react';
import { Search, Star, Play, ExternalLink, X, Maximize } from 'lucide-react';
import { MOVIES } from '../movieData';
import { motion, AnimatePresence } from 'motion/react';
import { FavoriteItem, Movie } from '../types';

interface MovieHubProps {
  favorites: FavoriteItem[];
  onToggleFavorite: (item: FavoriteItem) => void;
  initialSelectedId?: string | null;
  onClearSelectedId?: () => void;
}

export default function MovieHub({ favorites, onToggleFavorite, initialSelectedId, onClearSelectedId }: MovieHubProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVideo, setModalVideo] = useState<Movie | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const iframeContainerRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (initialSelectedId) {
      const movie = MOVIES.find(m => m.title === initialSelectedId);
      if (movie) {
        setSelectedMovie(movie);
      }
      if (onClearSelectedId) {
        onClearSelectedId();
      }
    }
  }, [initialSelectedId, onClearSelectedId]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      iframeContainerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const filteredMovies = MOVIES.filter(movie => 
    movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.year.includes(searchTerm)
  );

  return (
    <div className="p-8 max-w-7xl mx-auto pb-32">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-[var(--mk-gold)] drop-shadow-[0_0_10px_var(--mk-gold)] mb-4">
          MKPlaza's M0v13s
        </h1>
        <p className="text-[var(--mk-silver)] opacity-70 italic">
          Find a movie or sumn idk man you ask me
        </p>
      </div>

      <div className="relative max-w-2xl mx-auto mb-12">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--mk-gold)] w-5 h-5" />
        <input 
          type="text" 
          placeholder="Search movies..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[var(--mk-midnight)]/80 border border-yellow-400/30 text-[var(--mk-silver)] py-3 pl-12 pr-4 rounded-xl outline-none focus:border-[var(--mk-gold)] transition-all shadow-xl font-sans"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredMovies.map((movie, idx) => {
          const isFavorited = favorites.some(f => f.id === movie.title);
          return (
            <motion.div
              key={idx}
              onClick={() => setSelectedMovie(movie)}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-[var(--glass-heavy)] backdrop-blur-xl border border-yellow-400/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col group relative cursor-pointer"
            >
              <div className="aspect-[2/3] relative overflow-hidden">
                <img 
                  src={movie.imageUrl} 
                  alt={movie.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--mk-midnight)] to-transparent opacity-60 pointer-events-none" />
                
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggleFavorite({
                      id: movie.title,
                      type: 'movie',
                      title: movie.title,
                      imageUrl: movie.imageUrl,
                      link: movie.link
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
                <h3 className="text-lg font-bold text-[var(--mk-gold)] mb-2 line-clamp-1">{movie.title}</h3>
                <p className="text-xs text-[var(--mk-silver)]/70 mb-4 line-clamp-3 flex-1">{movie.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="text-[10px] uppercase tracking-widest font-bold text-[var(--mk-gold)]/50">
                    {movie.year}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredMovies.length === 0 && (
        <div className="text-center py-20 text-[var(--mk-silver)] opacity-50">
          No movies found. Try another search!
        </div>
      )}

      <div className="mt-12 text-center text-[10px] uppercase tracking-widest text-[var(--mk-gold)]/40">
        Showing {filteredMovies.length} movie{filteredMovies.length !== 1 ? 's' : ''}
      </div>

      <AnimatePresence>
        {selectedMovie && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedMovie(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[var(--mk-midnight)] border border-[var(--mk-gold)]/30 rounded-3xl overflow-hidden shadow-2xl relative"
            >
              <button 
                onClick={() => setSelectedMovie(null)}
                className="absolute top-4 right-4 text-white/50 hover:text-white bg-black/20 hover:bg-black/40 p-2 rounded-full transition-all z-10"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="aspect-video relative overflow-hidden">
                <img src={selectedMovie.imageUrl} alt={selectedMovie.title} className="w-full h-full object-cover opacity-50 blur-sm" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--mk-midnight)] to-transparent" />
                <div className="absolute bottom-4 left-6 right-6">
                  <h2 className="text-2xl font-black text-[var(--mk-gold)] drop-shadow-md mb-1">{selectedMovie.title}</h2>
                  <p className="text-xs text-[var(--mk-silver)]/70 uppercase tracking-widest font-bold">{selectedMovie.year}</p>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-sm text-[var(--mk-silver)]/80 mb-6 line-clamp-3">{selectedMovie.description}</p>
                
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => {
                      setModalVideo(selectedMovie);
                      setSelectedMovie(null);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-[var(--mk-gold)] hover:bg-yellow-400 text-black rounded-xl text-sm font-black tracking-widest uppercase transition-colors"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Play Here
                  </button>
                  <a 
                    href={selectedMovie.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-full flex items-center justify-center gap-2 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold text-[var(--mk-silver)] transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open in Drive
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modalVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          >
            <motion.div 
              ref={iframeContainerRef}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 relative group"
            >
              <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-50 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button 
                  onClick={() => setModalVideo(null)}
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors uppercase tracking-widest text-sm font-bold"
                >
                  <X className="w-5 h-5" />
                  Back
                </button>
                
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={toggleFullscreen}
                      className="text-white/80 hover:text-white transition-colors"
                      title="Fullscreen"
                    >
                      <Maximize className="w-5 h-5" />
                    </button>
                    <a 
                      href={modalVideo.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/80 hover:text-white transition-colors"
                      title="Open in Drive"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                  
                  <div className="flex items-center gap-2 text-white font-bold tracking-widest uppercase text-sm">
                    <span className="w-2 h-2 rounded-full bg-[var(--mk-gold)]"></span>
                    {modalVideo.title}
                  </div>
                </div>
              </div>

              <iframe 
                src={modalVideo.link.replace('/view', '/preview').replace('?usp=sharing', '').replace('?usp=share_link', '').replace('?usp=drivesdk', '')} 
                className="w-full h-full border-0" 
                allowFullScreen 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
