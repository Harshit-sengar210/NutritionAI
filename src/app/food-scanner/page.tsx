"use client";

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ScannerHero, ScannerState } from '@/components/scanner/ScannerHero';
import { DetectionResultCard } from '@/components/scanner/DetectionResultCard';
import { RecentScans } from '@/components/scanner/RecentScans';
import { DetectionResult } from '@/lib/nutrition/mockDetectionEngine';

export default function FoodScannerPage() {
  const [scannerState, setScannerState] = useState<ScannerState>('EMPTY');
  const [result, setResult] = useState<DetectionResult | null>(null);

  const handleResult = (detection: DetectionResult, imageSrc: string) => {
    setResult(detection);
    setScannerState('RESULT');
  };

  const handleRetry = () => {
    setResult(null);
    setScannerState('EMPTY');
  };

  return (
    <DashboardLayout>
      
      <div className="mb-8 animate-fade-in">
        <h1 className="text-2xl md:text-3xl font-semibold text-stone-900 tracking-tight">Food Scanner</h1>
        <p className="text-stone-500 font-medium text-sm md:text-base mt-1">
          Snap your meal and let Nutrition AI analyze it.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Column - Scanner */}
        <div className="lg:col-span-6 xl:col-span-7">
          <ScannerHero 
            onResult={handleResult} 
            scannerState={scannerState} 
            setScannerState={setScannerState} 
          />
        </div>

        {/* Sidebar Column - Result */}
        <div className="lg:col-span-6 xl:col-span-5">
          {scannerState === 'RESULT' && result ? (
            <DetectionResultCard 
              result={result} 
              onRetry={handleRetry} 
            />
          ) : (
            <div className="h-full min-h-[400px] border-2 border-dashed border-stone-200 rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-center bg-stone-50/50">
              <span className="text-4xl text-stone-300 mb-4">✨</span>
              <p className="text-stone-400 font-medium">Awaiting image scan...</p>
            </div>
          )}
        </div>

      </div>

      <RecentScans />

    </DashboardLayout>
  );
}
