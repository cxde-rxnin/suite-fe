
import React from 'react';
import bgImg from '../assets/suite-bg1.462Z.png';

function LandingPage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Background image */}
      <img src={bgImg} alt="Suite Background" className="absolute inset-0 w-full h-full object-cover z-0" style={{ opacity: 0.6 }} />
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-black/40 via-black/60 to-black" />
      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen w-full">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-white geist-mono drop-shadow-lg">Welcome to Suite</h1>
        <p className="text-xl md:text-2xl text-white mb-8 geist-mono drop-shadow">Book your next stay with ease and comfort.</p>
        <a href="/hotels" className="geist-mono px-6 py-3 bg-sky-500 text-white rounded-lg shadow hover:bg-sky-600 transition text-lg font-semibold">Browse Hotels</a>
      </div>
    </div>
  );
}

export default LandingPage;

