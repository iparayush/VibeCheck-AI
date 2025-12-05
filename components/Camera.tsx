import React, { useRef, useEffect, useState } from 'react';
import ElectricBorder from './ElectricBorder';

interface CameraProps {
  onCapture: (imageSrc: string) => void;
}

export const Camera: React.FC<CameraProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let currentStream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        currentStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } 
        });
        setStream(currentStream);
        if (videoRef.current) {
          videoRef.current.srcObject = currentStream;
          // Wait for data to be loaded to avoid black frames
          videoRef.current.onloadeddata = () => {
             // Additional check: Sometimes onloadeddata fires but dimensions are 0
             if (videoRef.current && videoRef.current.videoWidth > 0) {
               setIsReady(true);
             }
          };
          // Fallback if onloadeddata doesn't trigger properly
          videoRef.current.oncanplay = () => {
             setIsReady(true);
          };
        }
      } catch (err) {
        setError("Unable to access camera. Please allow permissions.");
        console.error(err);
      }
    };

    startCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current && isReady) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Strict check to ensure video has enough data
      if (video.readyState !== 4) {
        console.warn("Video not ready yet, readyState:", video.readyState);
        // If it says ready but readyState isn't 4, it might be flickering. 
        // We can force a retry or just block.
        // For UX, if we think it's ready, try anyway, but check dimensions.
      }

      if (video.videoWidth === 0 || video.videoHeight === 0) {
         console.warn("Video dimensions 0");
         return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        // Flip horizontally for mirror effect
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Force JPEG format for API consistency
        const imageSrc = canvas.toDataURL('image/jpeg', 0.95);
        
        // Final sanity check for empty frames (simple length check)
        if (imageSrc.length > 1000) {
          onCapture(imageSrc);
        } else {
          console.error("Captured image too small, retrying...");
        }
      }
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 w-full max-w-2xl bg-slate-800 rounded-2xl border border-red-500/50 p-6 animate-fade-in">
        <p className="text-red-400 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <ElectricBorder color="#a855f7" thickness={2} chaos={0.3} style={{ borderRadius: '24px' }}>
        <div className="relative group overflow-hidden rounded-3xl bg-slate-900">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            onCanPlay={() => setIsReady(true)}
            className="w-full h-auto object-cover transform -scale-x-100 opacity-90 group-hover:opacity-100 transition-opacity duration-500 min-h-[300px]"
          />
          <canvas ref={canvasRef} className="hidden" />
          
          <div className="absolute bottom-8 left-0 right-0 flex justify-center z-10">
            <button
              onClick={handleCapture}
              disabled={!isReady}
              className={`group/btn relative flex items-center justify-center p-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-transform hover:scale-110 active:scale-95 shadow-lg shadow-purple-500/40 ${!isReady ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer'}`}
            >
              {/* Pulsing ring effect */}
              {isReady && <span className="absolute inset-0 rounded-full bg-pink-500 opacity-50 animate-ping"></span>}
              
              <div className="relative bg-white rounded-full p-4 border-4 border-transparent group-hover/btn:border-purple-100 transition-all z-10">
                 <div className="w-6 h-6 bg-slate-900 rounded-full group-hover/btn:bg-purple-600 transition-colors" />
              </div>
              <span className="absolute -top-12 bg-black/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full opacity-0 group-hover/btn:opacity-100 transition-all translate-y-2 group-hover/btn:translate-y-0 whitespace-nowrap">
                {isReady ? "Capture Vibe" : "Initializing..."}
              </span>
            </button>
          </div>
          
          {/* Scanner Lines overlay */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.3)_51%)] bg-[length:100%_4px] opacity-20"></div>
        </div>
      </ElectricBorder>
    </div>
  );
};