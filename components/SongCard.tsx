import React, { useState } from 'react';
import { Song } from '../types';

interface SongCardProps {
  song: Song;
  index: number;
  isActive?: boolean;
  onPlay?: (song: Song) => void;
}

export const SongCard: React.FC<SongCardProps> = ({ song, index, isActive = false, onPlay }) => {
  const searchQuery = encodeURIComponent(`${song.title} ${song.artist}`);
  const spotifyUrl = `https://open.spotify.com/search/${searchQuery}`;
  const [imgError, setImgError] = useState(false);

  // Use Bing Images for a reliable "real" album art thumbnail effect without API keys
  // Added extra params to try and fetch cleaner square results
  const albumArtUrl = `https://tse2.mm.bing.net/th?q=${encodeURIComponent(song.title + " " + song.artist + " album cover")}&w=400&h=400&c=7&rs=1&p=0`;

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    // Open in new tab for direct playback via Spotify Web
    window.open(spotifyUrl, '_blank');
    if (onPlay) onPlay(song);
  };

  return (
    <div 
      onClick={handlePlayClick}
      className={`group relative flex flex-col rounded-xl overflow-hidden cursor-pointer transition-all duration-300 animate-card-entrance
        ${isActive 
          ? 'scale-105 ring-2 ring-green-500 shadow-2xl shadow-green-900/40 bg-slate-800' 
          : 'bg-transparent hover:bg-slate-800/50 hover:scale-105'
        }
      `}
      style={{ 
        animationDelay: `${100 + index * 50}ms` 
      }}
    >
      {/* Image Container */}
      <div className="aspect-square w-full relative overflow-hidden bg-slate-800 rounded-lg shadow-lg">
        {!imgError ? (
          <img 
            src={albumArtUrl} 
            alt={song.title}
            onError={() => setImgError(true)}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-700 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
          />
        ) : (
          // Fallback Gradient if image fails
          <div className={`w-full h-full bg-gradient-to-br ${isActive ? 'from-green-600 to-emerald-700' : 'from-slate-700 to-slate-600'} flex items-center justify-center`}>
            <span className="text-4xl">🎵</span>
          </div>
        )}

        {/* Play Overlay on Hover */}
        <div className={`absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px] transition-opacity duration-300 ${isActive ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}>
          <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform hover:bg-green-400">
            {/* Spotify-style play icon */}
            <svg className="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
        
        {/* Spotify Logo Badge */}
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
           <svg className="w-4 h-4 text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor">
             <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.72 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.299z"/>
           </svg>
        </div>
      </div>
      
      {/* Content */}
      <div className="pt-3 pb-2 px-1">
        <h4 className={`font-semibold truncate text-base leading-tight mb-1 ${isActive ? 'text-green-400' : 'text-slate-100 group-hover:text-white'}`}>
          {song.title}
        </h4>
        <p className="text-slate-400 text-sm truncate">{song.artist}</p>
      </div>
    </div>
  );
};