"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function ReadPage() {
  const [selectedPara, setSelectedPara] = useState(null);
  
  // Generate mock paras for demonstration
  const paras = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    name: `Para ${i + 1}`,
    arabicName: `الجزء ${i + 1}`,
    verses: Math.floor(Math.random() * 300) + 100, // Random verse count
    isCompleted: [1, 3, 5, 7].includes(i + 1) // Random completion status
  }));
  
  return (
    <main className="flex min-h-screen flex-col p-4 md:p-6">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Select a Para to Read</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            Back to Dashboard
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {paras.map((para) => (
              <button
                key={para.id}
                onClick={() => setSelectedPara(para)}
                className={`p-4 rounded-lg border ${
                  para.isCompleted 
                    ? 'bg-green-100 border-green-300 text-green-800' 
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                } transition`}
              >
                <div className="text-lg font-semibold">{para.name}</div>
                <div className="text-sm text-gray-600">{para.arabicName}</div>
                <div className="text-xs mt-2">Verses: {para.verses}</div>
                {para.isCompleted && (
                  <div className="text-xs text-green-600 mt-1">✓ Completed</div>
                )}
              </button>
            ))}
          </div>
        </div>
        
        {selectedPara && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">
                {selectedPara.name} ({selectedPara.arabicName})
              </h2>
              <button
                onClick={() => {
                  alert(`Para ${selectedPara.id} marked as completed!`);
                  // In a real app, this would update the state and make an API call
                }}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Mark as Completed
              </button>
            </div>
            <div className="border rounded-lg p-6 bg-gray-50">
              <p className="text-right text-2xl font-arabic leading-loose mb-6">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              <p className="text-right text-2xl font-arabic leading-loose">
                {/* Sample Quran text - would be loaded from a real Quran API */}
                الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ﴿١﴾ الرَّحْمَٰنِ الرَّحِيمِ ﴿٢﴾ مَالِكِ يَوْمِ الدِّينِ ﴿٣﴾ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ﴿٤﴾ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ﴿٥﴾ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ ﴿٦﴾
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 