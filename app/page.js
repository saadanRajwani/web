"use client";

import { useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  useEffect(() => {
    // Load mock data and update UI (this will run in browser)
    const mockData = {
      khatm: { number: 1, type: "Full Quran", participants: 15, progress: 25 },
      user: { name: "User", completedSections: 3, percentile: "80th" }
    };
    
    // Update UI elements with mock data
    document.querySelectorAll('[data-mock]').forEach(el => {
      const key = el.getAttribute('data-mock');
      let value = "";
      
      if (key === 'khatm.number') value = mockData.khatm.number;
      if (key === 'khatm.type') value = mockData.khatm.type;
      if (key === 'khatm.participants') value = mockData.khatm.participants;
      if (key === 'khatm.progress') value = mockData.khatm.progress;
      if (key === 'user.completedSections') value = mockData.user.completedSections;
      if (key === 'user.percentile') value = mockData.user.percentile;
      
      el.textContent = value;
    });
  }, []);
  
  return (
    <main className="flex min-h-screen flex-col p-4 md:p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">Quran Reader Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Current Khatm</h2>
            <p>Khatm #<span data-mock="khatm.number">1</span></p>
            <p>Type: <span data-mock="khatm.type">Full Quran</span></p>
            <p>Participants: <span data-mock="khatm.participants">15</span></p>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '25%' }}></div>
              </div>
              <p className="text-sm text-gray-600 mt-1"><span data-mock="khatm.progress">25</span>% Completed</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Your Contribution</h2>
            <p>Sections Completed: <span data-mock="user.completedSections">3</span></p>
            <p>Your standing: <span data-mock="user.percentile">80th</span> percentile</p>
            <div className="mt-4">
              <Link 
                href="/read" 
                className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Continue Reading
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Completions</h2>
            <ul className="space-y-2">
              <li>Ali completed Para 5</li>
              <li>Fatima completed Para 8</li>
              <li>Ahmed completed Para 12</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Start Reading</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((para) => (
              <Link 
                key={para}
                href={`/read/${para}`}
                className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-3 px-4 rounded text-center"
              >
                Para {para}
              </Link>
            ))}
            <Link 
              href="/read"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded text-center"
            >
              View All
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
} 