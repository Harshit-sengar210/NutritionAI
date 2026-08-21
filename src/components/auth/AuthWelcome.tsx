"use client";

import React from 'react';
import Link from 'next/link';
import { NutritionLogo } from '../brand/NutritionLogo';
import { AuthVisual } from './AuthVisual';
import { GoogleButton } from './GoogleButton';

export const AuthWelcome = () => {
  return (
    <div className="min-h-screen w-full bg-[#FAFAF9] flex flex-col lg:flex-row overflow-hidden">
      
      {/* LEFT COLUMN: Visual Brand Area */}
      <div className="relative w-full lg:w-1/2 min-h-[40vh] lg:min-h-screen flex flex-col justify-center px-8 py-12 lg:px-16 xl:px-24 border-b lg:border-b-0 lg:border-r border-stone-100 bg-white z-10">
        
        {/* Subtle Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-green-50/50 rounded-full blur-3xl opacity-60" />
        </div>

        <div className="relative z-10 flex flex-col h-full justify-between max-w-lg mx-auto w-full">
          
          {/* Header */}
          <div className="flex items-center gap-3 animate-fade-in">
            <NutritionLogo className="w-10 h-10" />
            <span className="text-xl font-semibold text-stone-900 tracking-tight">Nutrition AI</span>
          </div>

          {/* Main Visual Content */}
          <div className="flex-grow flex flex-col justify-center mt-12 mb-8 lg:mt-0 lg:mb-0">
            <div className="space-y-4 mb-12 animate-fade-in-up">
              <h1 className="text-4xl lg:text-5xl font-semibold text-stone-900 leading-tight tracking-tight">
                Eat smarter.<br />
                <span className="text-green-600">Understand your nutrition.</span>
              </h1>
              <p className="text-lg text-stone-500 font-medium leading-relaxed max-w-md">
                Your personalized AI nutrition companion for better food decisions and healthier habits.
              </p>
            </div>
            
            <div className="flex justify-center lg:justify-start">
              <AuthVisual />
            </div>
          </div>

        </div>
      </div>

      {/* RIGHT COLUMN: Auth Actions Area */}
      <div className="relative w-full lg:w-1/2 flex flex-col justify-center items-center px-8 py-16 lg:px-16 z-20">
        
        <div className="w-full max-w-sm space-y-8 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
          
          {/* Welcome Text */}
          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-3xl font-semibold text-stone-900 tracking-tight">
              Welcome to Nutrition AI
            </h2>
            <p className="text-stone-500 font-medium">
              Your personalized nutrition journey starts here.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-6 pt-4">
            
            <GoogleButton />

            <div className="flex items-center justify-center space-x-4">
              <div className="h-px bg-stone-200 flex-grow" />
              <span className="text-xs text-stone-400 font-medium uppercase tracking-wider">or continue with email</span>
              <div className="h-px bg-stone-200 flex-grow" />
            </div>

            <div className="space-y-4">
              <Link href="/login" className="block w-full">
                <button className="w-full py-3.5 px-4 rounded-2xl bg-stone-900 text-white font-medium hover:bg-stone-800 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]">
                  Log In
                </button>
              </Link>

              <div className="pt-2 text-center">
                <span className="text-stone-500 text-sm">New to Nutrition AI? </span>
                <Link href="/signup" className="text-green-600 font-semibold text-sm hover:text-green-700 transition-colors">
                  Create Account
                </Link>
              </div>
            </div>

          </div>

          {/* Legal */}
          <div className="pt-12 text-center lg:text-left">
            <p className="text-xs text-stone-400">
              By continuing, you agree to our{' '}
              <Link href="/terms" className="underline hover:text-stone-600 transition-colors">Terms of Service</Link>
              {' '}and{' '}
              <Link href="/privacy" className="underline hover:text-stone-600 transition-colors">Privacy Policy</Link>.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
