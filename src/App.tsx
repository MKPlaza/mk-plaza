import React, { useState, useEffect, useRef } from 'react';
import { 
  Film, 
  Tv, 
  Gamepad2, 
  BookOpenText, 
  Settings, 
  ChevronUp, 
  ChevronDown, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  RotateCcw, 
  X, 
  Terminal, 
  Palette, 
  Ghost,
  Battery,
  BatteryCharging,
  BatteryMedium,
  BatteryLow,
  Clock,
  Github,
  ChevronLeft,
  Music,
  Home,
  EyeOff,
  Maximize2,
  ExternalLink,
  Shield,
  Handshake
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { THEMES, CLOAKS, PLAYLIST, MUSIC_BASE_URL } from './constants';
import { ThemePreset, FavoriteItem, Game } from './types';
import { GAME_PAYLOADS } from './gamePayloads';
import { MOVIES } from './movieData';
import { TV_SHOWS } from './tvData';
import { ANIME } from './animeData';
import { MANGA } from './mangaData';
import { GAMES } from './gameData';
import { PROXIES } from './proxyData';
import { PARTNERS } from './partnerData';
import MovieHub from './components/MovieHub';
import TVHub from './components/TVHub';
import AnimeHub from './components/AnimeHub';
import MangaHub from './components/MangaHub';
import MusicHub from './components/MusicHub';
import HomeHub from './components/HomeHub';
import GamesHub from './components/GamesHub';
import ProxiesHub from './components/ProxiesHub';
import PartnersHub from './components/PartnersHub';

export default function App() {
  const [currentTheme, setCurrentTheme] = useState<ThemePreset>(THEMES.original);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [activeHub, setActiveHub] = useState<string | null>('home');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCreditsOpen, setIsCreditsOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const [battery, setBattery] = useState<{ level: number; charging: boolean } | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);

  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    const saved = localStorage.getItem('mk_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('mk_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (item: FavoriteItem) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.id === item.id);
      if (exists) {
        return prev.filter(f => f.id !== item.id);
      }
      return [...prev, item];
    });
  };
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const [isPlayerCollapsed, setIsPlayerCollapsed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [cloakTarget, setCloakTarget] = useState('classroom');
  const [customCloakTitle, setCustomCloakTitle] = useState('');
  const [customCloakFavicon, setCustomCloakFavicon] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((batt: any) => {
        const updateBattery = () => {
          setBattery({ level: Math.round(batt.level * 100), charging: batt.charging });
        };
        updateBattery();
        batt.addEventListener('levelchange', updateBattery);
        batt.addEventListener('chargingchange', updateBattery);
      });
    }

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setShowWelcome(true);
    const timer = setTimeout(() => setShowWelcome(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--mk-midnight', currentTheme.midnight);
    root.style.setProperty('--mk-eye-glow', currentTheme.eyes);
    root.style.setProperty('--mk-gold', currentTheme.gold);
    
    if (currentTheme.pixel) {
      document.body.classList.add('pixel-theme');
    } else {
      document.body.classList.remove('pixel-theme');
    }
  }, [currentTheme]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const changeTrack = (dir: number) => {
    const nextIndex = (currentSongIndex + dir + PLAYLIST.length) % PLAYLIST.length;
    setCurrentSongIndex(nextIndex);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = MUSIC_BASE_URL + encodeURIComponent(PLAYLIST[currentSongIndex].filename);
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [currentSongIndex]);

  const loadHub = (type: string) => {
    setActiveHub(type);
  };

  const handleClearSelectedId = React.useCallback(() => {
    setSelectedItemId(null);
  }, []);

  const handleOpenItem = (item: FavoriteItem) => {
    if (item.type === 'game') {
      const game = GAMES.find(g => g.id === item.id);
      if (game) {
        setSelectedGame(game);
        loadHub('games');
      }
    } else {
      setSelectedItemId(item.id);
      loadHub(item.type);
    }
  };

  const goHome = () => {
    setActiveHub('home');
  };

  const initiateCloak = () => {
    let finalTitle, finalIcon;
    if (cloakTarget === 'custom') {
      finalTitle = customCloakTitle || "Home";
      finalIcon = customCloakFavicon || "https://www.google.com/favicon.ico";
    } else {
      finalTitle = CLOAKS[cloakTarget].title;
      finalIcon = CLOAKS[cloakTarget].icon;
    }

    const win = window.open('about:blank', '_blank');
    if (win) {
      const doc = win.document;
      doc.title = finalTitle;
      
      const link = doc.createElement('link');
      link.rel = 'icon';
      link.href = finalIcon;
      doc.head.appendChild(link);

      const iframe = doc.createElement('iframe');
      iframe.style.width = '100vw';
      iframe.style.height = '100vh';
      iframe.style.border = 'none';
      iframe.style.position = 'fixed';
      iframe.style.top = '0';
      iframe.style.left = '0';
      iframe.style.margin = '0';
      iframe.style.padding = '0';
      iframe.src = window.location.href;
      
      doc.body.appendChild(iframe);
      doc.body.style.margin = '0';
      doc.body.style.overflow = 'hidden';
    }
    setIsSettingsOpen(false);
  };

  const getBatteryIcon = () => {
    if (!battery) return <Battery className="w-4 h-4" />;
    if (battery.charging) return <BatteryCharging className="w-4 h-4" />;
    if (battery.level > 70) return <Battery className="w-4 h-4" />;
    if (battery.level > 30) return <BatteryMedium className="w-4 h-4" />;
    return <BatteryLow className="w-4 h-4" />;
  };

  return (
    <div 
      className="min-h-screen w-full relative transition-all duration-700"
      style={{ 
        backgroundImage: `url(${currentTheme.bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        fontFamily: currentTheme.fontFamily || 'var(--font-cinzel)',
        fontStyle: currentTheme.fontStyle || 'normal'
      }}
    >
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[5000] bg-[var(--mk-midnight)]/90 backdrop-blur-xl border border-[var(--mk-gold)]/30 px-8 py-4 rounded-2xl shadow-[0_0_30px_rgba(255,215,0,0.2)] flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-[var(--mk-gold)]/10 flex items-center justify-center">
              <motion.img 
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                src={currentTheme.logo} 
                className="w-6 h-6" 
              />
            </div>
            <div>
              <h3 className="text-[var(--mk-gold)] font-bold text-sm uppercase tracking-widest">Tab Open!</h3>
              <p className="text-[var(--mk-silver)] text-xs font-medium">Welcome to MKPlaza</p>
            </div>
            <button 
              onClick={() => setShowWelcome(false)}
              className="ml-4 text-[var(--mk-silver)]/40 hover:text-[var(--mk-gold)] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="fixed top-0 left-0 w-full h-20 bg-[var(--glass)] backdrop-blur-xl flex items-center justify-between px-8 z-[2000] shadow-2xl border-b border-white/5">
        <div className="flex items-center gap-6">
          <motion.img 
            whileHover={{ scale: 1.1, rotate: 5 }}
            src={currentTheme.logo} 
            alt="Logo" 
            className="h-12 w-auto cursor-pointer drop-shadow-[0_0_8px_var(--mk-gold)]"
            onClick={goHome}
          />
          <div 
            className="text-xl font-black uppercase tracking-[3px] text-[var(--mk-gold)] drop-shadow-[0_0_12px_var(--mk-gold)] select-none"
          >
            MKPlaza
          </div>
          
          <div className="flex items-center gap-5 bg-yellow-400/5 px-4 py-1.5 rounded-full border border-yellow-400/10 font-orbitron text-[11px] text-[var(--mk-gold)] shadow-[0_0_8px_rgba(255,215,0,0.1)]">
            <div className="flex items-center gap-2">
              {getBatteryIcon()}
              <span>{battery ? `${battery.level}%` : '--%'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{time.toLocaleTimeString([], { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden mx-8 hidden lg:flex items-center">
          <div className="flex gap-12 animate-marquee-reverse whitespace-nowrap text-[var(--mk-gold)] font-bold tracking-widest uppercase text-sm opacity-70">
            {[...Array(2)].map((_, i) => (
              <React.Fragment key={i}>
                <span>Chill Kirb Central is still peak</span>
                <span>M0v13s Galore</span>
                <span>MKPlaza Supermancy</span>
                <span>Please check the instructions before clicking the hide button gng</span>
                <span>ok im out of ideas</span>
                <span>uhh</span>
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-5">
            <a href="https://discord.gg/kZzGNnmjpv" target="_blank" className="text-[var(--mk-silver)] opacity-70 hover:opacity-100 hover:text-[var(--mk-gold)] transition-all hover:-translate-y-0.5">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z" />
              </svg>
            </a>
            <a href="https://github.com/MKPlaza" target="_blank" className="text-[var(--mk-silver)] opacity-70 hover:opacity-100 hover:text-[var(--mk-gold)] transition-all hover:-translate-y-0.5">
              <Github className="w-6 h-6" />
            </a>
          </div>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="text-[var(--mk-silver)] opacity-70 hover:opacity-100 hover:text-[var(--mk-gold)] transition-all hover:rotate-45"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </header>

      <motion.nav 
        animate={{ 
          y: isNavCollapsed ? -140 : 0,
          opacity: isNavCollapsed ? 0 : 1
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="fixed top-20 left-0 w-full h-[60px] bg-[var(--glass-heavy)] backdrop-blur-2xl border-b border-yellow-400/15 flex items-center justify-center gap-4 px-5 z-[1999]"
      >
        {[
          { id: 'hide', label: 'Hide', icon: EyeOff, action: () => setActiveHub(null) },
          { id: 'movies', label: 'M0v135', icon: Film, count: MOVIES.length },
          { id: 'tv', label: 'TV 5h0w5', icon: Tv, count: TV_SHOWS.length },
          { id: 'anime', label: 'An1m3', icon: Ghost, count: ANIME.length },
          { id: 'manga', label: 'M4ng4', icon: BookOpenText, count: MANGA.length },
          { id: 'games', label: 'G4m35', icon: Gamepad2, count: GAMES.length },
          { id: 'music', label: 'Mu51c', icon: Music },
          { id: 'proxies', label: 'Pr0x135', icon: Shield, count: PROXIES.length },
          { id: 'partners', label: 'P4rtn3r5', icon: Handshake, count: PARTNERS.length },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => item.action ? item.action() : loadHub(item.id)}
            className="flex items-center gap-2.5 text-[var(--mk-silver)] px-4 py-2 rounded-lg transition-all border border-transparent hover:bg-yellow-400/10 hover:border-yellow-400/30 hover:-translate-y-0.5 group"
          >
            <item.icon className="w-5 h-5 text-[var(--mk-eye-glow)] drop-shadow-[0_0_5px_var(--mk-eye-glow)]" />
            <div className="flex flex-col items-start">
              <span className="text-[11px] font-bold uppercase tracking-wider">{item.label}</span>
              {item.count !== undefined && (
                <span className="text-[9px] opacity-50 font-mono tracking-tighter">
                  {item.count.toString().padStart(2, '0')} Units
                </span>
              )}
            </div>
          </button>
        ))}

        <button 
          onClick={() => setIsNavCollapsed(true)}
          className="absolute -bottom-[22px] left-1/2 -translate-x-1/2 flex items-center justify-center bg-[var(--glass-heavy)] backdrop-blur-md border border-yellow-400/20 border-t-0 text-[var(--mk-gold)] w-[60px] h-[22px] rounded-b-xl hover:h-[26px] transition-all"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
      </motion.nav>

      <AnimatePresence>
        {isNavCollapsed && (
          <motion.button 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onClick={() => setIsNavCollapsed(false)}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[2001] bg-[var(--mk-gold)] text-[var(--mk-midnight)] w-[60px] h-[22px] rounded-b-xl flex items-center justify-center shadow-lg"
          >
            <ChevronDown className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>

      <main 
        className={`absolute left-0 w-full transition-all duration-500 z-50 ${activeHub === 'partners' ? 'bg-[var(--mk-midnight)]/60' : 'bg-[var(--mk-midnight)]/90'} overflow-y-auto ${activeHub ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{ 
          top: isNavCollapsed ? '80px' : '140px',
          height: isNavCollapsed ? 'calc(100% - 80px)' : 'calc(100% - 140px)'
        }}
      >
        {activeHub === 'home' && (
          <HomeHub 
            onNavigate={loadHub} 
            onOpenSettings={() => setIsSettingsOpen(true)}
            favorites={favorites}
            onRemoveFavorite={(id) => setFavorites(prev => prev.filter(f => f.id !== id))}
            currentTheme={currentTheme}
            onOpenItem={handleOpenItem}
          />
        )}
        {activeHub === 'movies' && <MovieHub favorites={favorites} onToggleFavorite={toggleFavorite} initialSelectedId={selectedItemId} onClearSelectedId={handleClearSelectedId} />}
        {activeHub === 'tv' && <TVHub favorites={favorites} onToggleFavorite={toggleFavorite} initialSelectedId={selectedItemId} onClearSelectedId={handleClearSelectedId} />}
        {activeHub === 'anime' && <AnimeHub favorites={favorites} onToggleFavorite={toggleFavorite} initialSelectedId={selectedItemId} onClearSelectedId={handleClearSelectedId} />}
        {activeHub === 'manga' && <MangaHub favorites={favorites} onToggleFavorite={toggleFavorite} />}
        {activeHub === 'games' && <GamesHub favorites={favorites} onToggleFavorite={toggleFavorite} setSelectedGame={setSelectedGame} />}
        {activeHub === 'music' && (
          <MusicHub 
            currentSongIndex={currentSongIndex} 
            setCurrentSongIndex={setCurrentSongIndex}
            isPlaying={isPlaying}
            togglePlay={togglePlay}
          />
        )}
        {activeHub === 'proxies' && <ProxiesHub />}
        {activeHub === 'partners' && <PartnersHub />}
      </main>

      <AnimatePresence>
        {selectedGame && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[6000] bg-black flex flex-col h-screen overflow-hidden"
          >
            <div className="flex-none bg-black/50 backdrop-blur-md flex items-center justify-between px-4 py-2 border-b border-white/10">
              <button 
                onClick={() => setSelectedGame(null)}
                className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors font-medium text-sm"
              >
                <X className="w-4 h-4" /> Back
              </button>
              <div className="text-white text-xs font-bold flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[var(--mk-gold)] rounded-full animate-pulse"></div>
                {selectedGame.title}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => {
                  if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen();
                  } else {
                    document.exitFullscreen();
                  }
                }} className="p-2 text-neutral-400 hover:text-white transition-colors">
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button onClick={() => {
                  if (selectedGame?.link) {
                    window.open(selectedGame.link, '_blank');
                  } else if (selectedGame && GAME_PAYLOADS[selectedGame.id]?.customHtml) {
                    const blob = new Blob([GAME_PAYLOADS[selectedGame.id].customHtml], { type: 'text/html' });
                    const url = URL.createObjectURL(blob);
                    window.open(url, '_blank');
                  }
                }} className="p-2 text-neutral-400 hover:text-white transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-grow bg-black relative">
              <iframe 
                className="w-full h-full border-none bg-black"
                allow="fullscreen; gamepad; autoplay"
                srcDoc={GAME_PAYLOADS[selectedGame.id]?.customHtml || `<!DOCTYPE html><html><body style="margin:0;background:#000;display:flex;align-items:center;justify-content:center;height:100vh;color:#fff;font-family:sans-serif">
                    <div style="text-align:center">
                        <h2 style="letter-spacing:4px">EMULATING ${selectedGame.title.toUpperCase()}</h2>
                        <div style="width:50px;height:2px;background:#e63946;margin:20px auto"></div>
                        <p style="opacity:0.6;font-size:12px;text-transform:uppercase">Connecting to secure ROM vault...</p>
                    </div>
                </body></html>`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        animate={{ left: isPlayerCollapsed ? -415 : 30 }}
        transition={{ type: 'spring', damping: 25, stiffness: 120 }}
        className="fixed bottom-[30px] flex items-center z-[1000]"
      >
        <div className="h-[54px] w-[400px] bg-[var(--mk-midnight)]/85 backdrop-blur-2xl rounded-full border border-yellow-400/10 flex items-center px-5 shadow-2xl">
          <div className="flex-1 overflow-hidden whitespace-nowrap mr-4 relative">
            <div className="inline-block text-sm text-[var(--mk-silver)] animate-marquee pl-full">
              {PLAYLIST[currentSongIndex].title}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => changeTrack(-1)} className="p-2 text-[var(--mk-silver)] hover:text-[var(--mk-gold)] transition-colors">
              <SkipBack className="w-4 h-4" />
            </button>
            <button onClick={togglePlay} className="p-2 text-[var(--mk-silver)] hover:text-[var(--mk-gold)] transition-colors">
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button onClick={() => changeTrack(1)} className="p-2 text-[var(--mk-silver)] hover:text-[var(--mk-gold)] transition-colors">
              <SkipForward className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setIsLooping(!isLooping)} 
              className={`p-2 transition-colors ${isLooping ? 'text-[var(--mk-gold)]' : 'text-[var(--mk-silver)] hover:text-[var(--mk-gold)]'}`}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
        <button 
          onClick={() => setIsPlayerCollapsed(!isPlayerCollapsed)}
          className="w-10 h-10 ml-3 bg-[var(--mk-midnight)]/85 backdrop-blur-md border border-yellow-400/15 rounded-full flex items-center justify-center text-[var(--mk-silver)] hover:text-[var(--mk-gold)] transition-all"
        >
          <motion.div animate={{ rotate: isPlayerCollapsed ? 180 : 0 }}>
            <ChevronLeft className="w-5 h-5" />
          </motion.div>
        </button>
      </motion.div>

      <AnimatePresence>
        {isSettingsOpen && (
          <div 
            className="fixed inset-0 bg-black/10 z-[3000] flex items-center justify-end pr-12"
            onClick={(e) => e.target === e.currentTarget && setIsSettingsOpen(false)}
          >
            <motion.div 
              initial={{ x: 100, opacity: 0, scale: 0.95 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: 100, opacity: 0, scale: 0.95 }}
              className="w-[400px] bg-[var(--glass-heavy)] backdrop-blur-2xl border border-yellow-400/30 rounded-2xl shadow-2xl max-h-[90vh] flex flex-col text-[var(--mk-silver)]"
            >
              <div className="flex justify-between items-center p-6 border-b border-yellow-400/15 shrink-0">
                <h2 className="text-sm font-bold text-[var(--mk-gold)] uppercase flex items-center gap-2">
                  <Terminal className="w-4 h-4" /> Settings
                </h2>
                <button onClick={() => setIsSettingsOpen(false)} className="hover:text-[var(--mk-gold)] transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                <div className="mb-8">
                  <div className="text-[11px] text-[var(--mk-eye-glow)] uppercase mb-4 font-bold flex items-center gap-2">
                  <Palette className="w-4 h-4" /> Knight Presets
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-yellow-400/5 flex flex-col gap-2">
                  <span className="text-xs opacity-70">Active Theme Profile</span>
                  <select 
                    value={Object.keys(THEMES).find(key => THEMES[key] === currentTheme)}
                    onChange={(e) => setCurrentTheme(THEMES[e.target.value])}
                    className="bg-[var(--mk-midnight)]/80 border border-yellow-400/30 text-[var(--mk-silver)] p-2.5 rounded-lg w-full outline-none text-xs"
                    style={{ fontFamily: currentTheme.fontFamily, fontStyle: currentTheme.fontStyle || 'normal' }}
                  >
                    {Object.entries(THEMES).map(([key, theme]) => (
                      <option 
                        key={key} 
                        value={key}
                        style={{ fontFamily: currentTheme.fontFamily, fontStyle: currentTheme.fontStyle || 'normal' }}
                      >
                        {theme.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="text-[11px] text-[var(--mk-eye-glow)] uppercase mb-4 font-bold flex items-center gap-2">
                  <Ghost className="w-4 h-4" /> Cloak Methods
                </div>
                <div className="flex flex-col gap-4">
                  <div className="p-3 bg-white/5 rounded-xl border border-yellow-400/5 flex flex-col gap-2">
                    <span className="text-xs opacity-70">Cloak Site</span>
                    <select 
                      value={cloakTarget}
                      onChange={(e) => setCloakTarget(e.target.value)}
                      className="bg-[var(--mk-midnight)]/80 border border-yellow-400/30 text-[var(--mk-silver)] p-2.5 rounded-lg w-full outline-none text-xs"
                      style={{ fontFamily: currentTheme.fontFamily, fontStyle: currentTheme.fontStyle || 'normal' }}
                    >
                      {Object.entries(CLOAKS).map(([key, cloak]) => (
                        <option key={key} value={key}>{cloak.title}</option>
                      ))}
                      <option value="custom">Custom</option>
                    </select>
                  </div>

                  {cloakTarget === 'custom' && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="p-3 bg-white/5 rounded-xl border border-yellow-400/5 flex flex-col gap-3"
                    >
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] opacity-70 uppercase">Custom Title</span>
                        <input 
                          type="text" 
                          value={customCloakTitle}
                          onChange={(e) => setCustomCloakTitle(e.target.value)}
                          placeholder="Enter custom title"
                          className="bg-[var(--mk-midnight)]/80 border border-yellow-400/30 text-[var(--mk-silver)] p-2 rounded-lg w-full outline-none text-xs"
                          style={{ fontFamily: currentTheme.fontFamily, fontStyle: currentTheme.fontStyle || 'normal' }}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] opacity-70 uppercase">Custom Favicon URL</span>
                        <input 
                          type="text" 
                          value={customCloakFavicon}
                          onChange={(e) => setCustomCloakFavicon(e.target.value)}
                          placeholder="https://example.com/favicon.ico"
                          className="bg-[var(--mk-midnight)]/80 border border-yellow-400/30 text-[var(--mk-silver)] p-2 rounded-lg w-full outline-none text-xs"
                          style={{ fontFamily: currentTheme.fontFamily, fontStyle: currentTheme.fontStyle || 'normal' }}
                        />
                      </div>
                    </motion.div>
                  )}

                  <button 
                    onClick={initiateCloak}
                    className="bg-[var(--mk-accent-red)] hover:bg-red-600 text-white py-3 rounded-xl font-bold transition-colors shadow-lg shadow-red-500/20"
                  >
                    Open Now
                  </button>
                </div>
              </div>
              </div>

              <div className="p-6 border-t border-yellow-400/15 shrink-0">
                <button 
                  onClick={() => setIsCreditsOpen(true)}
                  className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-[var(--mk-silver)] py-3 rounded-xl font-bold transition-colors"
                >
                  Credits
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCreditsOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-[4000] flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setIsCreditsOpen(false)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[var(--mk-midnight)] border border-[var(--mk-gold)]/30 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl shadow-[var(--mk-gold)]/10"
            >
              <h3 className="text-2xl font-bold text-[var(--mk-gold)] mb-4">Credits</h3>
              <p className="text-[var(--mk-silver)] text-lg">made by samtheskeleton.</p>
              <button 
                onClick={() => setIsCreditsOpen(false)}
                className="mt-8 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold transition-colors"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <audio 
        ref={audioRef} 
        loop={isLooping}
        onEnded={() => !isLooping && changeTrack(1)}
      />
    </div>
  );
}
