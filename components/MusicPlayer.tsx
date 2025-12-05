import React from 'react';
import { Song } from '../types';

interface MusicPlayerProps {
  song: Song;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ song }) => {
  // Construct search query for YouTube Embed
  // listType=search&list=... plays the top result for the query
  // appending 'audio' helps target official audio tracks
  const query = encodeURIComponent(`${song.title} ${song.artist} audio`);
  const origin = window.location.origin;
  
  // URL Parameters explanation:
  // autoplay=1: Starts playing immediately
  // listType=search & list=...: Performs a search and plays the first result
  // enablejsapi=1: Allows control via JS (helps with some browser policies)
  // origin=...: Security requirement for enablejsapi
  const src = `https://www.youtube.com/embed?listType=search&list=${query}&autoplay=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&enablejsapi=1&origin=${origin}`;

  return (
    <div className="w-full h-full overflow-hidden">
       <iframe 
         className="w-full h-full"
         src={src}
         title={`Playing ${song.title}`}
         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
         allowFullScreen
         style={{ border: 0 }}
       ></iframe>
    </div>
  );
};