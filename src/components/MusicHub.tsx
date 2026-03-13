import React, { useState, useRef, useEffect } from 'react';
import { Search, Play, Pause, SkipBack, SkipForward, Repeat, Volume2, VolumeX, Music, Loader2, RotateCcw, AlignLeft, Mic } from 'lucide-react';
import './MusicHub.css';

const CONFIG = {
  LYRIC_EP: "https://lrclib.net/api/get",
  BASE_URL: "https://music-player-eight-omega.vercel.app"
};

interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  cover: string;
  streamUrl?: string;
}

interface LyricLine {
  time: number;
  text: string;
}

interface MusicHubProps {
  currentSongIndex?: number;
  setCurrentSongIndex?: (index: number) => void;
  isPlaying?: boolean;
  togglePlay?: () => void;
}

const MusicHub: React.FC<MusicHubProps> = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tracks, setTracks] = useState<Track[]>([]); 
  const [searchResults, setSearchResults] = useState<Track[]>([]); 
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const [showingLyrics, setShowingLyrics] = useState(false);
  const [lyrics, setLyrics] = useState<string | LyricLine[]>("No lyrics available.");
  const [activeLyricIndex, setActiveLyricIndex] = useState(-1);
  const [isMuted, setIsMuted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: string} | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lyricsContentRef = useRef<HTMLDivElement>(null);
  const seekBarRef = useRef<HTMLDivElement>(null);

  const currentTrack = currentTrackIndex !== null ? tracks[currentTrackIndex] : null;

  const searchSongs = async (query: string) => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`https://api.monochrome.tf/search?s=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (!data.data || !data.data.items) {
        setSearchResults([]);
        return;
      }

      const formattedTracks: Track[] = data.data.items.map((item: any) => {
        let coverUrl = `${CONFIG.BASE_URL}/empty-art.png`;
        if (item.album && item.album.cover) {
           coverUrl = `https://resources.tidal.com/images/${item.album.cover.replace(/-/g, '/')}/640x640.jpg`;
        }
        
        return {
          id: item.id,
          title: item.title,
          artist: item.artist.name,
          album: item.album?.title || 'Unknown Album',
          cover: coverUrl,
          streamUrl: undefined
        };
      });

      setSearchResults(formattedTracks);
    } catch (error) {
      console.error('Error searching music:', error);
      showNotification("Search failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    
    if (query.length > 1) {
      searchTimeoutRef.current = setTimeout(() => searchSongs(query), 500);
    } else {
      setSearchResults([]);
    }
  };

  const fetchStreamUrl = async (trackId: number) => {
    try {
      const response = await fetch(`https://api.monochrome.tf/track?id=${trackId}&quality=HIGH`);
      const data = await response.json();
      const manifest = JSON.parse(atob(data.data.manifest));
      return manifest.urls[0];
    } catch (error) {
      console.error('Error fetching stream URL:', error);
      return null;
    }
  };

  const playTrack = async (index: number, list: Track[] = tracks) => {
    const track = list[index];
    if (!track) return;

    if (list !== tracks) {
        setTracks(list);
    }

    setLyrics("Loading lyrics...");
    setActiveLyricIndex(-1);
    fetchLyrics(track.artist, track.title);

    setCurrentTrackIndex(index);

    let streamUrl = track.streamUrl;
    if (!streamUrl) {
      setIsLoading(true);
      streamUrl = await fetchStreamUrl(track.id);
      setIsLoading(false);
    }

    if (streamUrl) {
        setTracks(prev => {
            const newTracks = [...prev];
            if (newTracks[index] && newTracks[index].id === track.id) {
                 newTracks[index] = { ...newTracks[index], streamUrl: streamUrl };
            }
            return newTracks;
        });
        
        if (audioRef.current) {
            audioRef.current.src = streamUrl;
            audioRef.current.play().catch(e => console.error("Playback failed", e));
            setIsPlaying(true);
        }
    } else {
       if (audioRef.current && track.streamUrl) {
          audioRef.current.src = track.streamUrl;
          audioRef.current.play().catch(e => console.error("Playback failed", e));
          setIsPlaying(true);
       }
    }
  };

  const fetchLyrics = async (artist: string, title: string) => {
    try {
      const cleanArtist = encodeURIComponent(artist.trim());
      const cleanTitle = encodeURIComponent(title.trim());
      const url = `${CONFIG.LYRIC_EP}?artist_name=${cleanArtist}&track_name=${cleanTitle}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error("Lyrics not found");
      
      const data = await response.json();
      
      if (data.syncedLyrics) {
        const lines = data.syncedLyrics.trim().split("\n").map((line: string) => {
          const match = line.match(/^\[(\d+):(\d+\.\d+)](.*)$/);
          if (match) {
            const time = parseInt(match[1], 10) * 60 + parseFloat(match[2]);
            const text = match[3].trim();
            return { time, text };
          }
          return null;
        }).filter(Boolean) as LyricLine[];
        setLyrics(lines);
      } else if (data.plainLyrics) {
        setLyrics(data.plainLyrics);
      } else {
        setLyrics("No lyrics available.");
      }
    } catch (error) {
      console.warn("Lyrics fetch failed:", error);
      setLyrics("No lyrics available.");
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const curr = audioRef.current.currentTime;
      setProgress(curr);
      setDuration(audioRef.current.duration);

      if (Array.isArray(lyrics)) {
        let activeIndex = -1;
        for (let i = 0; i < lyrics.length; i++) {
          if (curr >= lyrics[i].time) {
            activeIndex = i;
          } else {
            break;
          }
        }
        if (activeIndex !== activeLyricIndex) {
          setActiveLyricIndex(activeIndex);
          if (activeIndex !== -1 && lyricsContentRef.current) {
            const activeEl = document.getElementById(`lyric-${activeIndex}`);
            if (activeEl) {
              activeEl.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }
        }
      }
    }
  };

  const handleSeekMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateSeekPosition(e);
  };

  const handleSeekMouseMove = (e: React.MouseEvent) => {
    if (isDragging) updateSeekPosition(e);
  };

  const handleSeekMouseUp = () => {
    setIsDragging(false);
  };

  const updateSeekPosition = (e: React.MouseEvent) => {
    if (!audioRef.current || !seekBarRef.current) return;
    
    const rect = seekBarRef.current.getBoundingClientRect();
    const position = (e.clientX - rect.left) / rect.width;
    const percent = Math.min(Math.max(position, 0), 1);
    
    const dur = audioRef.current.duration || 0;
    audioRef.current.currentTime = percent * dur;
    setProgress(percent * dur);
  };

  const skipTime = (amount: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime += amount;
    }
  };

  const nextTrack = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  const handleEnded = () => {
    if (isRepeat) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${secs}`;
  };

  const showNotification = (message: string, type: string = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="music-hub-container" onMouseMove={handleSeekMouseMove} onMouseUp={handleSeekMouseUp}>
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search for any song..."
          value={searchQuery}
          onChange={handleSearchInput}
          autoComplete="off"
        />
        <div className={`search-results ${searchQuery.length > 0 && searchResults.length > 0 ? 'active' : ''}`}>
          {isLoading ? (
            <div className="loading">Searching...</div>
          ) : (
            searchResults.map((track, index) => (
              <div 
                key={track.id} 
                className="result-item"
                onClick={() => {
                  playTrack(index, searchResults);
                  setSearchQuery("");
                }}
              >
                <div className="result-img">
                  <img src={track.cover} alt={track.title} loading="lazy" />
                </div>
                <div className="result-info">
                  <div className="result-title">{track.title}</div>
                  <div className="result-artist">{track.artist}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="player">
        {!showingLyrics && (
          <div className="album-art">
            <img
              src={currentTrack?.cover || `${CONFIG.BASE_URL}/empty-art.png`}
              alt="Album artwork"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `${CONFIG.BASE_URL}/empty-art.png`;
              }}
            />
          </div>
        )}
        
        {showingLyrics ? (
          <div className="lyrics-info" style={{ display: 'flex' }}>
            <div className="lyrics-content" ref={lyricsContentRef}>
              {Array.isArray(lyrics) ? (
                lyrics.map((line, index) => (
                  <div 
                    key={index} 
                    id={`lyric-${index}`}
                    className={`lyric-line ${index === activeLyricIndex ? 'active' : ''} ${index === activeLyricIndex - 1 ? 'prev' : ''} ${index === activeLyricIndex + 1 ? 'next' : ''}`}
                  >
                    {line.text}
                  </div>
                ))
              ) : (
                <div dangerouslySetInnerHTML={{ __html: lyrics.replace(/\n/g, "<br>") }} />
              )}
            </div>
          </div>
        ) : (
          <div className="info">
            <div className="track-title">{currentTrack?.title || "Not Playing"}</div>
            <div className="artist">{currentTrack?.artist || "Select a song to start"}</div>
            
            <div className="controls">
              <div 
                className={`control-btn ${isRepeat ? 'active' : ''}`} 
                onClick={() => setIsRepeat(!isRepeat)}
                title="Toggle loop"
              >
                <Repeat size={20} />
              </div>
              <div className="control-btn" onClick={() => skipTime(-10)} title="Rewind 10s">
                <RotateCcw size={20} />
              </div>
              <div className="control-btn" onClick={() => skipTime(-5)} title="Rewind 5s">
                <SkipBack size={20} />
              </div>
              <div 
                className={`control-btn primary`} 
                onClick={togglePlay}
                title="Play/Pause"
              >
                {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
              </div>
              <div className="control-btn" onClick={() => skipTime(5)} title="Forward 5s">
                <SkipForward size={20} />
              </div>
              <div className="control-btn" onClick={() => skipTime(10)} title="Forward 10s">
                <RotateCcw size={20} className="scale-x-[-1]" />
              </div>
            </div>
            
            <div 
              className={`seekbar ${isDragging ? 'active' : ''}`} 
              ref={seekBarRef}
              onMouseDown={handleSeekMouseDown}
            >
              <div 
                id="progress" 
                style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }}
              ></div>
            </div>
            
            <div className="timecodes">
              <span>{formatTime(progress)}</span>
              <span>-{formatTime(duration - progress)}</span>
            </div>
          </div>
        )}
      </div>

      <div className="bottom-controls">
        <div className="bottom-btn" onClick={toggleMute}>
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          <span>{isMuted ? 'Muted' : 'Volume'}</span>
        </div>
        
        <div className="bottom-btn" onClick={() => setShowingLyrics(!showingLyrics)}>
          {showingLyrics ? <Music size={18} /> : <AlignLeft size={18} />}
          <span>{showingLyrics ? 'Player' : 'Lyrics'}</span>
        </div>
      </div>

      <audio 
        ref={audioRef} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        className="hidden"
      />

      <div className={`notification ${notification ? 'show' : ''} ${notification?.type || ''}`}>
        {notification?.message}
      </div>
    </div>
  );
};

export default MusicHub;
