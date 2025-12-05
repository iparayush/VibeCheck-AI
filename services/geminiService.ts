import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

// Initialize Gemini client
// API Key is injected via environment variable as per instructions
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    detectedEmotion: { type: Type.STRING, description: "The dominant emotion detected in the face (e.g., Happy, Melancholic, Excited)." },
    emoji: { type: Type.STRING, description: "A single emoji representing the mood." },
    confidence: { type: Type.NUMBER, description: "Confidence score between 0 and 100." },
    shortDescription: { type: Type.STRING, description: "A poetic or witty one-sentence description of the user's vibe." },
    vibeMetrics: {
      type: Type.OBJECT,
      description: "Scores from 0 to 100 for audio features matching this mood.",
      properties: {
        energy: { type: Type.NUMBER },
        valence: { type: Type.NUMBER },
        danceability: { type: Type.NUMBER },
        calmness: { type: Type.NUMBER },
        intensity: { type: Type.NUMBER }
      },
      required: ["energy", "valence", "danceability", "calmness", "intensity"]
    },
    playlist: {
      type: Type.ARRAY,
      description: "A curated list of at least 15-20 songs mixing Marathi, Hindi, English, and other languages that perfectly match the mood.",
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          artist: { type: Type.STRING },
          genre: { type: Type.STRING },
          reason: { type: Type.STRING, description: "Why this song fits the current mood." }
        },
        required: ["title", "artist", "genre", "reason"]
      }
    }
  },
  required: ["detectedEmotion", "emoji", "confidence", "shortDescription", "vibeMetrics", "playlist"]
};

export const analyzeMoodAndRecommend = async (base64Image: string): Promise<AnalysisResult> => {
  try {
    // Robust Base64 extraction: split by comma if present, otherwise assume raw base64
    const cleanBase64 = base64Image.includes(',') 
      ? base64Image.split(',')[1] 
      : base64Image;

    if (!cleanBase64 || cleanBase64.length < 100) {
      throw new Error("Invalid image data captured.");
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: cleanBase64
              }
            },
            {
              text: "Analyze the facial expression and environment in this image to determine the user's mood. Based on this, suggest a perfectly curated music playlist of 20 songs. The playlist MUST include a diverse mix of languages including Marathi, Hindi, English, and other relevant regional languages that fit the vibe. Return the result in strict JSON."
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text) as AnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};