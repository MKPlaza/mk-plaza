import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gamepad2, 
  ExternalLink, 
  Settings,
  Star,
  Trash2,
  Clock,
  Zap,
  Swords,
  Globe,
  Activity
} from 'lucide-react';
import { FavoriteItem, ThemePreset } from '../types';
import { THEMES } from '../constants';

interface HomeHubProps {
  onNavigate: (hub: string) => void;
  onOpenSettings: () => void;
  favorites: FavoriteItem[];
  onRemoveFavorite: (id: string) => void;
  currentTheme: ThemePreset;
  onOpenItem?: (item: FavoriteItem) => void;
}

const CHANGELOG = [
  {
    version: 'v2',
    date: 'APR 1, 26',
    updates: [
      'Added GOAT',
      'More G4m3s coming soon',
      'Added The Super Mario Galaxy Movie!'

    ]
  },
  {
    version: 'v1.1.5',
    date: 'MAR 19, 2026',
    updates: [
      'Added Invincible Season 4 fr'
    ]
  },
  {
    version: 'v1.1',
    date: 'MAR 14, 2026',
    updates: [
      'THE DAY THAT MR. KRABS FRIES',
      'Added more m0v135, 4n1m3, 7v 5h0w5, and m4ng4'
    ]
  }
];

const THEME_IMAGES: Record<string, string> = {
  original: 'https://cdn.jsdelivr.net/gh/MKPlaza/MKPlaza.github.io@main/Meta_Knight_SSB4.png',
  classic: 'https://cdn.jsdelivr.net/gh/MKPlaza/MKPlaza.github.io@main/KA_Meta_Knight_artwork.png',
  dark: 'https://cdn.jsdelivr.net/gh/MKPlaza/MKPlaza.github.io@main/Dark_Meta_Knight4.webp',
  galacta: 'https://cdn.jsdelivr.net/gh/MKPlaza/MKPlaza.github.io@main/SKC_Aeon_Hero_Light.webp',
  morpho: 'https://cdn.jsdelivr.net/gh/MKPlaza/MKPlaza.github.io@main/Morphoknightrender.webp',
  mecha: 'https://cdn.jsdelivr.net/gh/MKPlaza/MKPlaza.github.io@main/Mecha_knight_DAKWqA_UMAAynpz.webp',
  phantom: 'https://cdn.jsdelivr.net/gh/MKPlaza/MKPlaza.github.io@main/FL_Phantom_MK.webp',
  parallel: 'https://cdn.jsdelivr.net/gh/MKPlaza/MKPlaza.github.io@main/KSA_Parallel_Meta_Knight_new.webp'
};

const SPECIAL_THANKS = [
  { name: 'ZXS', reason: 'They let me use their music player' },
  { name: 'GN-Math', reason: 'Free use of their webports, other games, etc.' },
  { name: 'Ultimate Game Stash', reason: 'Wide variety of emulator games and flash games' },
  { name: 'Slay3r', reason: 'Original owner of the predecessor' },
  { name: 'Kirby Arcade', reason: 'The predecessor, the original site!' },
  { name: 'Chillzone Docs', reason: 'Movies, TV Shows, Manga and Anime help aside from my own!' }
];

const INSTRUCTIONS = [
  { title: 'Hide', desc: 'Click the hide button to hide any tab you opened.' },
  { title: 'Logo in top left corner', desc: 'Click that to open the homepage back up' },
  { title: 'Themes', desc: 'Change the look of the website by clicking the gear in the top left corner, pick from your favorite meta knight variant! ' },
  { title: 'changelog', desc: 'Take a look at that to see what changed and what is new, might forget to update it sometimes.' },
  { title: 'favorites', desc: 'Go into any tab (excluding Music, Proxies and Partners) and click the star icon, it will then appear on the homepage when you go back to it' },
  { title: 'Proxies', desc: 'Some might not work for people but go check out the proxies and bypass a whole bunch of stuff' },
  { title: 'Partners', desc: 'Check out our partners, none right now, but you might see some familiar names.' },
  { title: 'Music players', desc: 'The pill shaped one only plays meta knight variant themes but the tabbed one plays more then just meta knight themes.' }
];

export default function HomeHub({ onNavigate, onOpenSettings, favorites, onRemoveFavorite, currentTheme, onOpenItem }: HomeHubProps) {
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const themeKey = Object.keys(THEMES).find(key => THEMES[key] === currentTheme) || 'original';
  const metaKnightImage = THEME_IMAGES[themeKey] || THEME_IMAGES.original;

  const getThemeBadge = () => {
    switch (themeKey) {
      case 'original':
        return { prefix: 'META', suffix: 'KNIGHT' };
      case 'classic':
        return { prefix: 'CLASSIC META', suffix: 'KNIGHT' };
      case 'dark':
        return { prefix: 'DARK META', suffix: 'KNIGHT' };
      case 'galacta':
        return { prefix: 'GALACTA', suffix: 'KNIGHT' };
      case 'morpho':
        return { prefix: 'MORPHO', suffix: 'KNIGHT' };
      case 'mecha':
        return { prefix: 'MECHA', suffix: 'KNIGHT' };
      case 'phantom':
        return { prefix: 'PHANTOM META', suffix: 'KNIGHT' };
      case 'parallel':
        return { prefix: 'PARALLEL META', suffix: 'KNIGHT' };
      default:
        return { prefix: themeKey.toUpperCase() + ' META', suffix: 'KNIGHT' };
    }
  };

  const badge = getThemeBadge();

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 space-y-8 pb-32">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-7 flex flex-col gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-black/60 to-black/20 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 lg:p-10 relative overflow-hidden group flex-grow"
          >
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-[var(--mk-gold)]/10 rounded-full blur-[100px] group-hover:bg-[var(--mk-gold)]/20 transition-all duration-700" />
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
            
            <div className="relative z-10 h-full flex flex-col items-center text-center justify-center space-y-8">
              <div className="space-y-4 flex flex-col items-center">
                <motion.img 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  src={currentTheme.logo} 
                  alt="Logo" 
                  className="h-20 w-auto drop-shadow-[0_0_12px_var(--mk-gold)] mb-2"
                />
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold tracking-widest uppercase">
                  <Activity className="w-3 h-3 animate-pulse" style={{ color: currentTheme.gold }} />
                  <span className="text-white/40">{badge.prefix}</span>
                  <span style={{ color: currentTheme.gold }}>{badge.suffix}</span>
                </div>
                <h1 className="text-5xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[var(--mk-silver)] to-gray-500 tracking-tighter drop-shadow-sm">
                  MKPLAZA
                </h1>
                <p className="text-lg lg:text-xl text-[var(--mk-silver)] opacity-70 font-medium tracking-wide max-w-xl leading-relaxed">
                  Your favorite entertainment center featuring all your favorite Meta Knight variants.
                </p>
              </div>

              <div className="text-lg text-[var(--mk-silver)] font-bold tracking-wide">
                Soon to be successor of Kirby Arcade/Chill Kirb Central.
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 h-32 overflow-hidden relative"
          >
            <div className="absolute top-4 left-6 z-10 flex items-center gap-2 text-[var(--mk-gold)] font-black uppercase tracking-widest text-xs bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              <Star className="w-4 h-4" />
              Special Thanks
            </div>
            
            <div className="h-full flex items-center mt-4">
              <div className="flex gap-12 animate-marquee whitespace-nowrap">
                {[...SPECIAL_THANKS, ...SPECIAL_THANKS].map((thanks, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-white font-black text-xl tracking-tight">{thanks.name}</span>
                    <span className="text-[var(--mk-silver)] opacity-50 text-xs font-medium uppercase tracking-widest">{thanks.reason}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-5 flex flex-col gap-6"
        >
          <div className="p-0 flex-1">
            <img 
              src={metaKnightImage}
              alt="Meta Knight"
              className="w-full h-full object-cover rounded-[2rem]"
              referrerPolicy="no-referrer"
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsInstructionsOpen(true)}
            className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 flex items-center justify-center h-32 group transition-all hover:border-[var(--mk-gold)]/50"
          >
            <div className="flex items-center gap-3 text-white font-black uppercase tracking-widest text-sm group-hover:text-[var(--mk-gold)] transition-colors">
              <Zap className="w-5 h-5 text-[var(--mk-gold)]" />
              Instructions
            </div>
          </motion.button>
        </motion.div>
      </div>

      <AnimatePresence>
        {isInstructionsOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsInstructionsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-[var(--mk-midnight)] border border-white/10 rounded-[2rem] p-5 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar"
            >
              <div className="sticky top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--mk-gold)] to-transparent opacity-50 z-20" />

              <div className="space-y-4 pt-1">
                <div className="space-y-1">
                  <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[var(--mk-gold)]" />
                    HOW TO USE
                  </h2>
                  <p className="text-[9px] text-[var(--mk-silver)] opacity-60 font-medium uppercase tracking-widest">Guide to MKPlaza</p>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {INSTRUCTIONS.map((item, i) => (
                    <div key={i} className="space-y-1 p-2.5 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                      <h3 className="text-[var(--mk-gold)] font-black uppercase tracking-widest text-[8px]">{item.title}</h3>
                      <p className="text-[10px] text-white/70 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-center sticky bottom-0 bg-gradient-to-t from-[var(--mk-midnight)] via-[var(--mk-midnight)] to-transparent pb-1">
                  <button 
                    onClick={() => setIsInstructionsOpen(false)}
                    className="px-5 py-1.5 bg-[var(--mk-gold)] text-[var(--mk-midnight)] font-black uppercase tracking-widest text-[9px] rounded-full hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,215,0,0.2)]"
                  >
                    Got it!
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <section className="space-y-6 pt-8">
        <div className="flex items-end justify-between border-b border-white/10 pb-4">
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Star className="w-8 h-8 text-[var(--mk-gold)]" />
            Favorites
          </h2>
          <span className="text-sm font-mono text-white/40 bg-white/5 px-3 py-1 rounded-full">
            {favorites.length} SAVED
          </span>
        </div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {favorites.map((item) => {
              const handleClick = (e: React.MouseEvent) => {
                if (item.type === 'movie' || item.type === 'game' || item.link === '#' || item.link === '') {
                  e.preventDefault();
                  if (onOpenItem) onOpenItem(item);
                }
              };

              const isGame = item.type === 'game';

            return (
              <motion.a
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                href={item.type === 'movie' || item.type === 'game' || item.link === '#' || item.link === '' ? undefined : item.link}
                target={item.type === 'movie' || item.type === 'game' || item.link === '#' || item.link === '' ? undefined : "_blank"}
                rel="noopener noreferrer"
                onClick={handleClick}
                className={`group relative ${isGame ? 'bg-[#0a1128] game-card' : 'bg-black/40'} border border-white/10 rounded-2xl overflow-hidden hover:border-[var(--mk-gold)]/50 transition-all shadow-xl cursor-pointer`}
              >
                <div className="aspect-[3/4] relative">
                  {isGame ? (
                    <>
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-all duration-700 opacity-20 group-hover:opacity-60 group-hover:scale-110 z-0" 
                        style={{ backgroundImage: `url('${item.imageUrl}')` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/80 to-transparent z-0 pointer-events-none" />
                    </>
                  ) : (
                    <>
                      <img 
                        src={item.imageUrl} 
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                    </>
                  )}
                  
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onRemoveFavorite(item.id);
                    }}
                    className="absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-md rounded-full text-white/50 hover:text-red-400 hover:bg-black/80 transition-all z-20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="absolute top-3 left-3 px-2 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider rounded-md">
                    {item.type}
                  </div>
                  
                  <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <h3 className="text-sm font-bold text-white line-clamp-2 leading-tight group-hover:text-[var(--mk-gold)] transition-colors">{item.title}</h3>
                  </div>
                </div>
              </motion.a>
            );
            })}
          </div>
        ) : (
          <div className="h-40 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-[2rem] bg-black/20">
            <Star className="w-8 h-8 text-white/20 mb-3" />
            <p className="text-sm text-white/40 font-medium">Your favorite items will appear here.</p>
          </div>
        )}
      </section>

      <section className="pt-8 space-y-6">
        <div className="flex items-end justify-between border-b border-white/10 pb-4">
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Clock className="w-8 h-8 text-[var(--mk-silver)]" />
            Changelog
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CHANGELOG.map((entry, idx) => (
            <div key={idx} className="p-8 bg-black/40 backdrop-blur-sm border border-white/10 rounded-[2rem] space-y-6 hover:bg-white/5 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-2xl font-black text-white">{entry.version}</span>
                  <div className="text-xs font-bold text-[var(--mk-gold)] tracking-widest uppercase mt-1">
                    {entry.date}
                  </div>
                </div>
              </div>
              <ul className="space-y-3">
                {entry.updates.map((update, uIdx) => (
                  <li key={uIdx} className="text-sm text-white/70 flex items-start gap-3 leading-relaxed">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20 mt-2 shrink-0" />
                    {update}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <footer className="pt-12 border-t border-white/10 text-center text-white/30 text-sm">
        <p>&copy; 2026 MKPLAZA. Name is mine, but I do not own the rights to any game, movie, etc.</p>
      </footer>
    </div>
  );
}
