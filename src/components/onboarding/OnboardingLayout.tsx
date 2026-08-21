"use client";

import React, { useState } from 'react';
import { OnboardingState, initialOnboardingState } from '@/types/onboarding';
import { useNutrition } from '@/context/NutritionContext';
import { NutritionLogo } from '../brand/NutritionLogo';
import { OnboardingProgress } from './OnboardingProgress';
import { OnboardingNavigation } from './OnboardingNavigation';
import { StepPersonal } from './StepPersonal';
import { StepLifestyle } from './StepLifestyle';
import { StepDiet } from './StepDiet';
import { StepAllergies } from './StepAllergies';
import { StepGoals } from './StepGoals';
import { StepNutritionTargets } from './StepNutritionTargets';
import { StepSummary } from './StepSummary';
import { ProfileComplete } from './ProfileComplete';

const stepHeadings = [
  "Let's get to know you.",
  "Tell us about your lifestyle.",
  "How do you like to eat?",
  "Let's understand your restrictions.",
  "What are you working toward?",
  "Let's build your nutrition targets.",
  "Your nutrition profile is ready."
];

const stepSubtitles = [
  "These details help us personalize your nutrition experience.",
  "Activity levels and daily routines impact your energy needs.",
  "We'll tailor meal recommendations to your specific tastes.",
  "Select any ingredients we should absolutely avoid.",
  "This helps us optimize your macros and calories.",
  "You can review and adjust your estimated baseline.",
  "Review your details before creating your profile."
];

export const OnboardingLayout = () => {
  const { setProfile } = useNutrition();
  const [currentStep, setCurrentStep] = useState(0);
  const [state, setState] = useState<OnboardingState>(initialOnboardingState);
  const [isCompleting, setIsCompleting] = useState(false);

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Final submission
      setProfile(state);
      setIsCompleting(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const isNextDisabled = () => {
    if (currentStep === 0) {
      return !state.personalInfo.fullName || !state.personalInfo.age || !state.personalInfo.gender || !state.personalInfo.height || !state.personalInfo.weight;
    }
    if (currentStep === 1) {
      return !state.lifestyle.activityLevel;
    }
    if (currentStep === 2) {
      return !state.diet.preference;
    }
    if (currentStep === 4) {
      return !state.goals.primary;
    }
    return false;
  };

  if (isCompleting) {
    return (
      <div className="min-h-screen w-full bg-[#FAFAF9] flex flex-col lg:flex-row overflow-hidden relative">
        <ProfileComplete />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#FAFAF9] flex flex-col lg:flex-row overflow-hidden relative">
      
      {/* LEFT COLUMN: Visual Brand Area */}
      <div className="relative w-full lg:w-5/12 min-h-[30vh] lg:min-h-screen flex flex-col justify-center px-8 py-10 lg:px-16 border-b lg:border-b-0 lg:border-r border-stone-100 bg-white z-10 transition-all duration-500">
        
        {/* Subtle Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-green-50/50 rounded-full blur-3xl opacity-60" />
        </div>

        <div className="relative z-10 flex flex-col h-full lg:justify-center max-w-sm mx-auto w-full">
          
          <div className="flex items-center gap-3 mb-8 lg:mb-16">
            <NutritionLogo className="w-8 h-8" />
            <span className="text-lg font-semibold text-stone-900 tracking-tight">Nutrition AI</span>
          </div>

          <div className="space-y-4 animate-fade-in-up" key={`heading-${currentStep}`}>
            <h1 className="text-3xl lg:text-4xl font-semibold text-stone-900 leading-tight tracking-tight">
              {stepHeadings[currentStep]}
            </h1>
            <p className="text-base text-stone-500 font-medium leading-relaxed">
              {stepSubtitles[currentStep]}
            </p>
          </div>
          
        </div>
      </div>

      {/* RIGHT COLUMN: Form Area */}
      <div className="relative w-full lg:w-7/12 flex flex-col items-center px-6 py-12 lg:px-16 xl:px-24 overflow-y-auto z-20">
        
        <div className="w-full max-w-xl flex flex-col h-full min-h-[60vh] justify-between">
          
          <div className="w-full">
            <OnboardingProgress currentStepIndex={currentStep} />
            
            <div className="mt-8 relative" key={`content-${currentStep}`}>
              {currentStep === 0 && (
                <StepPersonal 
                  data={state.personalInfo} 
                  updateData={(d) => setState(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, ...d } }))} 
                />
              )}
              {currentStep === 1 && (
                <StepLifestyle 
                  data={state.lifestyle} 
                  updateData={(d) => setState(prev => ({ ...prev, lifestyle: { ...prev.lifestyle, ...d } }))} 
                />
              )}
              {currentStep === 2 && (
                <StepDiet 
                  data={state.diet} 
                  updateData={(d) => setState(prev => ({ ...prev, diet: { ...prev.diet, ...d } }))} 
                />
              )}
              {currentStep === 3 && (
                <StepAllergies 
                  data={state.allergies} 
                  updateData={(d) => setState(prev => ({ ...prev, allergies: d }))} 
                />
              )}
              {currentStep === 4 && (
                <StepGoals 
                  data={state.goals} 
                  updateData={(d) => setState(prev => ({ ...prev, goals: { ...prev.goals, ...d } }))} 
                />
              )}
              {currentStep === 5 && (
                <StepNutritionTargets 
                  data={state.nutritionTargets} 
                  fullState={state}
                  updateData={(d) => setState(prev => ({ ...prev, nutritionTargets: { ...prev.nutritionTargets, ...d } }))} 
                />
              )}
              {currentStep === 6 && (
                <StepSummary 
                  data={state} 
                  goToStep={(step) => setCurrentStep(step)} 
                />
              )}
            </div>
          </div>

          <OnboardingNavigation 
            onBack={currentStep > 0 ? handleBack : undefined}
            onContinue={handleNext}
            continueText={currentStep === 6 ? "Create My Nutrition Profile" : "Continue"}
            isContinueDisabled={isNextDisabled()}
          />
          
        </div>
      </div>

    </div>
  );
};
