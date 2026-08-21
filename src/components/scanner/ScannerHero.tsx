"use client";

import React, { useState, useRef } from 'react';
import { simulateImageDetection, DetectionResult } from '@/lib/nutrition/mockDetectionEngine';

export type ScannerState = 'EMPTY' | 'IMAGE_SELECTED' | 'CAMERA' | 'ANALYZING' | 'RESULT' | 'ERROR';

interface ScannerHeroProps {
  onResult: (result: DetectionResult, imageSrc: string) => void;
  scannerState: ScannerState;
  setScannerState: (state: ScannerState) => void;
}

export const ScannerHero = ({ onResult, scannerState, setScannerState }: ScannerHeroProps) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMsg("Please upload a valid image file.");
        setScannerState('ERROR');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target?.result as string);
        setScannerState('IMAGE_SELECTED');
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setScannerState('CAMERA');
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setErrorMsg("Camera access is unavailable.");
      setScannerState('ERROR');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const captureCamera = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setImageSrc(dataUrl);
        stopCamera();
        setScannerState('IMAGE_SELECTED');
      }
    }
  };

  const handleAnalyze = async () => {
    setScannerState('ANALYZING');
    try {
      // Simulate detection using the local mock engine
      const result = await simulateImageDetection(imageSrc || "");
      onResult(result, imageSrc || "");
    } catch (err) {
      setErrorMsg("Unable to process this image.");
      setScannerState('ERROR');
    }
  };

  const handleRetry = () => {
    setImageSrc(null);
    setScannerState('EMPTY');
  };

  return (
    <div className="relative w-full aspect-square md:aspect-[4/3] rounded-[2.5rem] overflow-hidden border border-stone-200 bg-stone-50 shadow-sm flex flex-col items-center justify-center animate-fade-in group">
      
      {/* Background aesthetics when empty */}
      {scannerState === 'EMPTY' && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-100/50 via-stone-50/10 to-transparent blur-2xl" />
          <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-emerald-100/60 rounded-full blur-3xl animate-pulse" />
        </div>
      )}

      {/* STATE: EMPTY */}
      {scannerState === 'EMPTY' && (
        <div className="relative z-10 flex flex-col items-center text-center p-8">
          <div className="w-20 h-20 rounded-full bg-white border border-stone-100 shadow-sm flex items-center justify-center text-3xl mb-6 text-stone-600 group-hover:scale-110 transition-transform">
            📷
          </div>
          <h2 className="text-2xl font-semibold text-stone-900 mb-2">Scan your meal</h2>
          <p className="text-stone-500 max-w-xs mb-8">Discover what&apos;s on your plate using Nutrition AI.</p>
          
          <div className="flex flex-col gap-3 w-full max-w-[240px]">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3.5 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors shadow-sm"
            >
              Upload Food Image
            </button>
            <div className="flex items-center gap-4 w-full">
              <div className="flex-1 h-px bg-stone-200" />
              <span className="text-xs text-stone-400 uppercase font-medium">or</span>
              <div className="flex-1 h-px bg-stone-200" />
            </div>
            <button 
              onClick={startCamera}
              className="w-full py-3.5 bg-white text-stone-700 border border-stone-200 rounded-xl font-medium hover:bg-stone-50 transition-colors shadow-sm"
            >
              Open Camera
            </button>
          </div>
        </div>
      )}

      {/* STATE: CAMERA */}
      {scannerState === 'CAMERA' && (
        <div className="absolute inset-0 z-10 bg-black flex flex-col">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />
          
          <div className="absolute inset-x-0 bottom-0 p-8 flex justify-between items-center bg-gradient-to-t from-black/80 to-transparent">
            <button 
              onClick={() => { stopCamera(); setScannerState('EMPTY'); }}
              className="w-12 h-12 rounded-full bg-white/20 text-white flex items-center justify-center backdrop-blur-md"
            >
              ✕
            </button>
            <button 
              onClick={captureCamera}
              className="w-16 h-16 rounded-full border-4 border-white/30 bg-white shadow-lg flex items-center justify-center active:scale-95 transition-transform"
            />
            <div className="w-12 h-12" /> {/* Spacer */}
          </div>
        </div>
      )}

      {/* STATE: IMAGE_SELECTED */}
      {scannerState === 'IMAGE_SELECTED' && imageSrc && (
        <div className="absolute inset-0 z-10 flex flex-col">
          <img src={imageSrc} alt="Selected food" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-stone-900/20" />
          
          <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col sm:flex-row gap-3 bg-gradient-to-t from-stone-900/90 via-stone-900/50 to-transparent pt-20">
            <button 
              onClick={handleRetry}
              className="flex-1 py-3.5 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors backdrop-blur-md border border-white/10"
            >
              Retake
            </button>
            <button 
              onClick={handleAnalyze}
              className="flex-[2] py-3.5 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors shadow-lg"
            >
              ✨ Analyze Food
            </button>
          </div>
        </div>
      )}

      {/* STATE: ANALYZING */}
      {scannerState === 'ANALYZING' && imageSrc && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
          <img src={imageSrc} alt="Analyzing food" className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" />
          
          {/* Scanning Line Animation */}
          <div className="absolute inset-x-0 h-1 bg-green-400 shadow-[0_0_15px_3px_rgba(74,222,128,0.5)] animate-scanline z-20" />

          <div className="relative z-30 flex flex-col items-center text-center px-4">
            <div className="w-16 h-16 rounded-full border-4 border-white/20 border-t-green-400 animate-spin mb-6" />
            <h3 className="text-2xl font-bold text-white mb-2 tracking-wide">Analyzing your meal...</h3>
            
            <div className="space-y-2 mt-4 text-left inline-block">
              <div className="flex items-center gap-3 text-green-300 font-medium animate-fade-in">
                <span className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-xs">✓</span>
                Image received
              </div>
              <div className="flex items-center gap-3 text-green-300 font-medium animate-fade-in" style={{ animationDelay: '500ms' }}>
                <span className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-xs">✓</span>
                Identifying food
              </div>
              <div className="flex items-center gap-3 text-white/50 font-medium animate-fade-in opacity-0" style={{ animationDelay: '1000ms', animationFillMode: 'forwards' }}>
                <span className="w-5 h-5 rounded-full border border-white/30 flex items-center justify-center text-xs" />
                Estimating nutrition
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STATE: RESULT */}
      {scannerState === 'RESULT' && imageSrc && (
        <div className="absolute inset-0 z-10">
          <img src={imageSrc} alt="Analyzed food" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/30 to-transparent" />
          
          <div className="absolute top-4 left-4">
            <div className="bg-stone-900/60 backdrop-blur-md border border-white/10 text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Analysis Complete
            </div>
          </div>
        </div>
      )}

      {/* STATE: ERROR */}
      {scannerState === 'ERROR' && (
        <div className="relative z-10 flex flex-col items-center text-center p-8">
          <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-2xl mb-4">
            !
          </div>
          <h3 className="text-xl font-semibold text-stone-900 mb-2">{errorMsg}</h3>
          <p className="text-stone-500 mb-6 max-w-xs text-sm">Please try again or select a different image.</p>
          <button 
            onClick={handleRetry}
            className="py-2.5 px-6 bg-white text-stone-700 border border-stone-200 rounded-xl font-medium hover:bg-stone-50 transition-colors shadow-sm"
          >
            Try Again
          </button>
        </div>
      )}

    </div>
  );
};
