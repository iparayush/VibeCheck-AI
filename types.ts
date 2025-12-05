export interface Song {
  title: string;
  artist: string;
  genre: string;
  reason: string;
}

export interface VibeMetrics {
  energy: number;
  valence: number;
  danceability: number;
  calmness: number;
  intensity: number;
}

export interface AnalysisResult {
  detectedEmotion: string;
  emoji: string;
  confidence: number;
  shortDescription: string;
  vibeMetrics: VibeMetrics;
  playlist: Song[];
}

export enum AppState {
  IDLE = 'IDLE',
  CAPTURING = 'CAPTURING',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR'
}