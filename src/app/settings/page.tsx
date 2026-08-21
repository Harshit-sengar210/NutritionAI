"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useNutrition } from '@/context/NutritionContext';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { 
    profile, 
    notificationPreferences, setNotificationPreferences,
    aiPreferences, setAiPreferences,
    appearancePreferences, setAppearancePreferences,
    privacyPreferences, setPrivacyPreferences,
    clearLocalData
  } = useNutrition();
  
  const router = useRouter();

  const [activeSection, setActiveSection] = useState('Account');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState('');

  const sections = [
    'Account', 'Nutrition', 'Notifications', 'AI & Personalization', 'Privacy & Data', 'Appearance', 'Security', 'Help & Support'
  ];

  const handleDownloadData = () => {
    const data = {
      profile,
      notificationPreferences,
      aiPreferences,
      appearancePreferences,
      privacyPreferences
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "nutrition_ai_data.json";
    link.click();
    showToast('Data downloaded');
  };

  const handleClearData = () => {
    clearLocalData();
    setShowClearConfirm(false);
    showToast('Local data cleared');
    setTimeout(() => router.push('/'), 1500);
  };

  const showToast = (msg: string) => {
    setShowSuccess(`✓ ${msg}`);
    setTimeout(() => setShowSuccess(''), 3000);
  };

  const filteredSections = sections.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto pb-20 animate-fade-in relative">
        
        {/* Success Toast */}
        <div className={`fixed top-8 left-1/2 transform -translate-x-1/2 bg-stone-900 text-white px-6 py-3 rounded-full font-medium shadow-lg transition-all z-50 flex items-center gap-2 ${showSuccess ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
          {showSuccess}
        </div>

        <div className="mb-10">
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Settings</h1>
          <p className="text-stone-500 font-medium mt-1">Manage your account, nutrition preferences and app experience.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDEBAR */}
          <div className="lg:w-64 shrink-0">
            <div className="bg-white border border-stone-200 rounded-3xl p-4 shadow-sm mb-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-lg">
                {profile.personalInfo.fullName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-stone-900 truncate">{profile.personalInfo.fullName}</div>
                <Link href="/profile" className="text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors">View Profile</Link>
              </div>
            </div>

            <div className="relative mb-6">
              <span className="absolute left-4 top-3 text-stone-400">🔍</span>
              <input 
                type="text" 
                placeholder="Search settings..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl text-sm font-medium focus:outline-none focus:border-stone-900 transition-colors"
              />
            </div>

            <nav className="space-y-1 hidden lg:block sticky top-8">
              {filteredSections.map(section => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`w-full text-left px-4 py-3 rounded-xl font-medium text-sm transition-colors ${activeSection === section ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-600 hover:bg-stone-100'}`}
                >
                  {section}
                </button>
              ))}
              {filteredSections.length === 0 && <div className="text-sm text-stone-500 px-4">No settings found.</div>}
            </nav>
            
            {/* Mobile Nav */}
            <div className="lg:hidden flex overflow-x-auto gap-2 pb-4 hide-scrollbar">
              {filteredSections.map(section => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`shrink-0 px-5 py-2.5 rounded-xl font-medium text-sm transition-colors ${activeSection === section ? 'bg-stone-900 text-white shadow-sm' : 'bg-white border border-stone-200 text-stone-600'}`}
                >
                  {section}
                </button>
              ))}
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="flex-1 space-y-6">
            
            {(activeSection === 'Account' || searchQuery) && filteredSections.includes('Account') && (
              <section className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm">
                <h3 className="text-lg font-bold text-stone-900 mb-6">Account Settings</h3>
                <div className="space-y-6">
                  <div className="flex justify-between items-center py-4 border-b border-stone-100">
                    <div>
                      <div className="font-bold text-stone-900">Personal Information</div>
                      <div className="text-sm text-stone-500 mt-1">Update your name, age, height, and weight.</div>
                    </div>
                    <Link href="/profile" className="px-4 py-2 bg-stone-100 text-stone-700 font-semibold text-sm rounded-lg hover:bg-stone-200 transition-colors">Edit</Link>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-stone-100">
                    <div>
                      <div className="font-bold text-stone-900">Email Address</div>
                      <div className="text-sm text-stone-500 mt-1">{profile.personalInfo.fullName.split(' ')[0].toLowerCase()}@example.com</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-stone-100">
                    <div>
                      <div className="font-bold text-stone-900">Connected Accounts</div>
                      <div className="text-sm text-stone-500 mt-1">Google (Connected)</div>
                    </div>
                    <button className="px-4 py-2 text-stone-400 font-semibold text-sm hover:text-stone-900 transition-colors">Disconnect</button>
                  </div>
                </div>
              </section>
            )}

            {(activeSection === 'Notifications' || searchQuery) && filteredSections.includes('Notifications') && (
              <section className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm">
                <h3 className="text-lg font-bold text-stone-900 mb-6">Notifications</h3>
                <div className="space-y-6">
                  <div className="flex justify-between items-center py-4 border-b border-stone-100">
                    <div className="pr-8">
                      <div className="font-bold text-stone-900">Meal Reminders</div>
                      <div className="text-sm text-stone-500 mt-1">Receive reminders to log your meals.</div>
                    </div>
                    <button 
                      onClick={() => {
                        setNotificationPreferences({...notificationPreferences, mealReminders: !notificationPreferences.mealReminders});
                        showToast('Preferences updated');
                      }}
                      className={`relative w-12 h-6 rounded-full transition-colors ${notificationPreferences.mealReminders ? 'bg-green-500' : 'bg-stone-300'}`}
                    >
                      <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${notificationPreferences.mealReminders ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {notificationPreferences.mealReminders && (
                    <div className="pl-4 border-l-2 border-stone-100 ml-4 mb-6 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="text-sm font-semibold text-stone-600 w-24">Breakfast</div>
                        <input type="time" defaultValue="08:00" className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-md text-sm font-medium focus:outline-none" />
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm font-semibold text-stone-600 w-24">Lunch</div>
                        <input type="time" defaultValue="13:00" className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-md text-sm font-medium focus:outline-none" />
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm font-semibold text-stone-600 w-24">Dinner</div>
                        <input type="time" defaultValue="20:00" className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-md text-sm font-medium focus:outline-none" />
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center py-4 border-b border-stone-100">
                    <div className="pr-8">
                      <div className="font-bold text-stone-900">Daily Nutrition Summary</div>
                      <div className="text-sm text-stone-500 mt-1">Get an end-of-day summary of your performance.</div>
                    </div>
                    <button 
                      onClick={() => setNotificationPreferences({...notificationPreferences, dailySummary: !notificationPreferences.dailySummary})}
                      className={`relative w-12 h-6 rounded-full transition-colors ${notificationPreferences.dailySummary ? 'bg-green-500' : 'bg-stone-300'}`}
                    >
                      <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${notificationPreferences.dailySummary ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>
                  
                </div>
              </section>
            )}

            {(activeSection === 'AI & Personalization' || searchQuery) && filteredSections.includes('AI & Personalization') && (
              <section className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm">
                <h3 className="text-lg font-bold text-stone-900 mb-6">AI Context & Personalization</h3>
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-800 font-medium mb-6 flex gap-3">
                  <span>ℹ️</span> Control what data the AI Nutritionist can use to personalize your experience.
                </div>
                
                <div className="space-y-6">
                  <div className="flex justify-between items-center py-4 border-b border-stone-100">
                    <div className="pr-8">
                      <div className="font-bold text-stone-900">Use Meal History</div>
                      <div className="text-sm text-stone-500 mt-1">Allows Nutrition AI to consider your logged meals when generating recommendations.</div>
                    </div>
                    <button 
                      onClick={() => setAiPreferences({...aiPreferences, useMealHistory: !aiPreferences.useMealHistory})}
                      className={`relative w-12 h-6 rounded-full transition-colors ${aiPreferences.useMealHistory ? 'bg-green-500' : 'bg-stone-300'}`}
                    >
                      <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${aiPreferences.useMealHistory ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-stone-100">
                    <div className="pr-8">
                      <div className="font-bold text-stone-900">Personalized Context</div>
                      <div className="text-sm text-stone-500 mt-1">Allow AI to use your profile goals and diet preferences.</div>
                    </div>
                    <button 
                      onClick={() => setAiPreferences({...aiPreferences, aiNutritionistContext: !aiPreferences.aiNutritionistContext})}
                      className={`relative w-12 h-6 rounded-full transition-colors ${aiPreferences.aiNutritionistContext ? 'bg-green-500' : 'bg-stone-300'}`}
                    >
                      <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${aiPreferences.aiNutritionistContext ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>
              </section>
            )}

            {(activeSection === 'Appearance' || searchQuery) && filteredSections.includes('Appearance') && (
              <section className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm">
                <h3 className="text-lg font-bold text-stone-900 mb-6">Appearance</h3>
                <div className="space-y-6">
                  <div className="py-4 border-b border-stone-100">
                    <div className="font-bold text-stone-900 mb-4">Theme</div>
                    <div className="flex gap-4">
                      <button onClick={() => setAppearancePreferences({...appearancePreferences, theme: 'light'})} className={`flex-1 py-3 border-2 rounded-xl font-bold text-sm transition-all ${appearancePreferences.theme === 'light' ? 'border-stone-900 bg-stone-50 text-stone-900' : 'border-stone-200 text-stone-500 hover:border-stone-300'}`}>
                        Light
                      </button>
                      <button onClick={() => setAppearancePreferences({...appearancePreferences, theme: 'dark'})} className={`flex-1 py-3 border-2 rounded-xl font-bold text-sm transition-all ${appearancePreferences.theme === 'dark' ? 'border-stone-900 bg-stone-50 text-stone-900' : 'border-stone-200 text-stone-500 hover:border-stone-300'}`}>
                        Dark
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {(activeSection === 'Privacy & Data' || searchQuery) && filteredSections.includes('Privacy & Data') && (
              <section className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm">
                <h3 className="text-lg font-bold text-stone-900 mb-6">Privacy & Data</h3>
                
                <div className="space-y-4">
                  <div className="p-4 border border-stone-200 rounded-xl flex justify-between items-center">
                    <div>
                      <div className="font-bold text-stone-900">Download My Data</div>
                      <div className="text-sm text-stone-500 mt-1">Export your profile and nutrition history as a JSON file.</div>
                    </div>
                    <button onClick={handleDownloadData} className="px-4 py-2 bg-stone-100 text-stone-900 font-bold text-sm rounded-lg hover:bg-stone-200 transition-colors">Export</button>
                  </div>

                  <div className="p-4 border border-red-100 bg-red-50/30 rounded-xl flex justify-between items-center">
                    <div>
                      <div className="font-bold text-red-700">Clear Local Data</div>
                      <div className="text-sm text-red-600/70 mt-1">Removes locally stored meals and demo data.</div>
                    </div>
                    <button onClick={() => setShowClearConfirm(true)} className="px-4 py-2 bg-white border border-red-200 text-red-700 font-bold text-sm rounded-lg hover:bg-red-50 transition-colors">Clear Data</button>
                  </div>

                  <div className="p-4 border border-red-200 bg-red-50 rounded-xl flex justify-between items-center mt-8">
                    <div>
                      <div className="font-bold text-red-900">Delete Account</div>
                      <div className="text-sm text-red-700 mt-1">Permanently delete your account. This action cannot be undone.</div>
                    </div>
                    <button onClick={() => setShowDeleteConfirm(true)} className="px-4 py-2 bg-red-600 text-white font-bold text-sm rounded-lg hover:bg-red-700 transition-colors">Delete Account</button>
                  </div>
                </div>
              </section>
            )}

            {(activeSection === 'Security' || searchQuery) && filteredSections.includes('Security') && (
              <section className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm">
                <h3 className="text-lg font-bold text-stone-900 mb-6">Security</h3>
                <div className="space-y-6">
                  <div className="flex justify-between items-center py-4 border-b border-stone-100">
                    <div>
                      <div className="font-bold text-stone-900">Change Password</div>
                      <div className="text-sm text-stone-500 mt-1">Update your authentication password.</div>
                    </div>
                    <button className="px-4 py-2 bg-stone-100 text-stone-700 font-semibold text-sm rounded-lg hover:bg-stone-200 transition-colors">Update</button>
                  </div>
                  
                  <div className="pt-4">
                    <div className="font-bold text-stone-900 mb-4">Recent Login Activity</div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex gap-4 items-center">
                          <div className="text-xl">💻</div>
                          <div>
                            <div className="font-bold text-sm text-stone-900">Windows PC (Current Session)</div>
                            <div className="text-xs text-stone-500">San Francisco, CA • Active now</div>
                          </div>
                        </div>
                        <div className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">Active</div>
                      </div>
                      <div className="flex justify-between items-center opacity-60">
                        <div className="flex gap-4 items-center">
                          <div className="text-xl">📱</div>
                          <div>
                            <div className="font-bold text-sm text-stone-900">iPhone 14</div>
                            <div className="text-xs text-stone-500">San Francisco, CA • Yesterday</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {(activeSection === 'Help & Support' || searchQuery) && filteredSections.includes('Help & Support') && (
              <section className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm">
                <h3 className="text-lg font-bold text-stone-900 mb-6">Help & Support</h3>
                <div className="space-y-4 mb-10">
                  <details className="group bg-stone-50 border border-stone-200 rounded-xl overflow-hidden">
                    <summary className="p-4 font-bold text-stone-900 cursor-pointer list-none flex justify-between">
                      How is my nutrition score calculated?
                      <span className="group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="p-4 pt-0 text-sm text-stone-600">
                      The nutrition score is a dynamic calculation based on how closely you meet your macro targets, your diet plan adherence, and your meal tracking consistency.
                    </div>
                  </details>
                  <details className="group bg-stone-50 border border-stone-200 rounded-xl overflow-hidden">
                    <summary className="p-4 font-bold text-stone-900 cursor-pointer list-none flex justify-between">
                      How does AI Nutritionist use my data?
                      <span className="group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="p-4 pt-0 text-sm text-stone-600">
                      If enabled in settings, the AI references your profile goals, dietary preferences, and logged meals for the day to provide highly personalized food recommendations.
                    </div>
                  </details>
                </div>

                <div className="pt-6 border-t border-stone-100 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-xl mb-4 flex items-center justify-center text-white font-bold text-xl shadow-inner">NA</div>
                  <div className="font-bold text-stone-900">Nutrition AI</div>
                  <div className="text-xs text-stone-500 mt-1 mb-4">Version 1.0.0 (Prototype)</div>
                  <p className="text-sm text-stone-600 max-w-md">
                    Nutrition AI is a personalized nutrition assistance platform designed to help users track meals, understand nutrition, receive personalized recommendations and explore food knowledge.
                  </p>
                </div>
              </section>
            )}

          </div>
        </div>
      </div>

      {/* Clear Data Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-stone-900 mb-2">Clear local data?</h3>
            <p className="text-sm text-stone-500 mb-8">This will remove locally stored meals, preferences and demo nutrition data. Your session will be reset.</p>
            <div className="flex gap-4">
              <button onClick={() => setShowClearConfirm(false)} className="flex-1 py-3 bg-stone-100 text-stone-700 font-bold rounded-xl hover:bg-stone-200 transition-colors">Cancel</button>
              <button onClick={handleClearData} className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-md">Clear Data</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl text-center border-t-8 border-red-600">
            <h3 className="text-xl font-bold text-stone-900 mb-2">Delete Account?</h3>
            <p className="text-sm text-stone-500 mb-6">This action cannot be undone. Note: Account deletion will be connected to the backend in the production version.</p>
            <div className="flex gap-4">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-3 bg-stone-100 text-stone-700 font-bold rounded-xl hover:bg-stone-200 transition-colors">Cancel</button>
              <button onClick={() => {
                setShowDeleteConfirm(false);
                showToast("Demo: Account deletion recorded.");
              }} className="flex-1 py-3 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition-colors shadow-md">Understood</button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
