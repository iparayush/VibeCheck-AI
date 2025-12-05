import React, { useState, useEffect } from 'react';
import { Camera } from './components/Camera';
import { VibeRadar } from './components/VibeRadar';
import { SongCard } from './components/SongCard';
import { analyzeMoodAndRecommend } from './services/geminiService';
import { AppState, AnalysisResult, Song } from './types';
import ElectricBorder from './components/ElectricBorder';
import { Logo } from './components/Logo';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeSong, setActiveSong] = useState<Song | null>(null);

  const handleCapture = async (imageSrc: string) => {
    setCapturedImage(imageSrc);
    setAppState(AppState.ANALYZING);
    setErrorMsg(null);
    setActiveSong(null);

    try {
      const analysis = await analyzeMoodAndRecommend(imageSrc);
      setResult(analysis);
      setAppState(AppState.RESULTS);
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to analyze the vibe. The spirits are quiet today.");
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setCapturedImage(null);
    setResult(null);
    setErrorMsg(null);
    setActiveSong(null);
  };

  const handlePlaySong = (song: Song) => {
    setActiveSong(song);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-purple-500 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-white/10 transition-all duration-300">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={handleReset}>
            <Logo className="w-10 h-10 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-transform group-hover:scale-110" />
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 group-hover:to-white transition-all">
              VibeCheck<span className="text-purple-400">.AI</span>
            </h1>
          </div>
          {appState === AppState.RESULTS && (
            <button 
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors animate-fade-in"
            >
              Scan Again
            </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Step 1: Idle / Camera */}
        {appState === AppState.IDLE && (
          <div key="idle" className="flex flex-col items-center animate-fade-in-up">
            <div className="text-center mb-8 max-w-lg">
              <h2 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500">
                What's your soundtrack?
              </h2>
              <p className="text-slate-400 text-lg">
                Let our AI analyze your expression to curate the perfect playlist for your current mood.
              </p>
            </div>
            <Camera onCapture={handleCapture} />
          </div>
        )}

        {/* Step 2: Analyzing */}
        {appState === AppState.ANALYZING && capturedImage && (
          <div key="analyzing" className="flex flex-col items-center justify-center min-h-[50vh] space-y-8 animate-fade-in">
             <ElectricBorder color="#c084fc" speed={2} chaos={0.6} style={{ borderRadius: '50%' }}>
                <div className="relative w-56 h-56 rounded-full overflow-hidden bg-black">
                    <img src={capturedImage} alt="You" className="w-full h-full object-cover opacity-60 blur-sm scale-110 animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                    <div className="w-20 h-20 border-4 border-t-purple-500 border-r-purple-300 border-b-purple-500 border-l-transparent rounded-full animate-spin" />
                    </div>
                </div>
             </ElectricBorder>
             <div className="text-center">
                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 animate-pulse">Reading your energy...</p>
                <p className="text-slate-500 text-sm mt-2">Consulting the musical oracle</p>
             </div>
          </div>
        )}

        {/* Step 3: Error */}
        {appState === AppState.ERROR && (
          <div key="error" className="flex flex-col items-center justify-center min-h-[50vh] text-center animate-pop-in">
            <div className="text-7xl mb-6 filter drop-shadow-lg">👾</div>
            <h3 className="text-2xl font-bold text-red-400 mb-2">System Glitch</h3>
            <p className="text-slate-400 mb-8 max-w-md">{errorMsg}</p>
            <button 
              onClick={handleReset}
              className="px-8 py-3 bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-200 font-semibold rounded-xl transition-all shadow-lg shadow-red-900/10"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Step 4: Results */}
        {appState === AppState.RESULTS && result && (
          <div key="results" className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pop-in relative">
            
            {/* Left Column: Analysis & Image */}
            <div className="lg:col-span-5 space-y-6">
              <ElectricBorder color="#34d399" thickness={2} chaos={0.4} style={{ borderRadius: '24px' }}>
                <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl p-1 overflow-hidden h-full">
                    <div className="relative h-72 w-full overflow-hidden rounded-t-[20px] group">
                    <img src={capturedImage!} alt="Analysis" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex items-center gap-4 mb-2">
                        <span className="text-5xl drop-shadow-md animate-bounce" style={{ animationDuration: '2s' }}>{result.emoji}</span>
                        <div>
                            <h2 className="text-3xl font-bold text-white tracking-tight leading-none">{result.detectedEmotion}</h2>
                            <div className="inline-flex items-center mt-1 px-2 py-0.5 rounded bg-white/10 backdrop-blur-md border border-white/10">
                            <span className="text-[10px] font-mono font-bold text-green-300 tracking-wider">CONFIDENCE: {result.confidence}%</span>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                    
                    <div className="p-6">
                    <p className="text-lg text-slate-300 leading-relaxed italic mb-8 border-l-4 border-green-500/50 pl-4">
                        "{result.shortDescription}"
                    </p>
                    <VibeRadar metrics={result.vibeMetrics} />
                    </div>
                </div>
              </ElectricBorder>
            </div>

            {/* Right Column: Playlist */}
            <div className="lg:col-span-7">
               <div className="bg-slate-900/50 rounded-3xl p-6 sm:p-8 border border-slate-800/60 backdrop-blur-sm">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-slate-200">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/20 text-purple-400">♫</span>
                    Recommended Tracks
                  </h3>
                  {/* Updated to Grid Layout for Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {result.playlist.map((song, idx) => (
                      <SongCard 
                        key={`${song.title}-${idx}`} 
                        song={song} 
                        index={idx} 
                        isActive={activeSong?.title === song.title}
                        onPlay={handlePlaySong}
                      />
                    ))}
                  </div>
               </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default App;
