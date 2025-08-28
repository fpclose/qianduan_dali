import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TypewriterText from '../components/TypewriterText';
import PageTransition from '../components/PageTransition';
import SharedBackground from '../components/SharedBackground';

function Home() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black relative overflow-hidden">
        <SharedBackground />
        
        {/* Content */}
        <div className="relative z-10">
          <Navbar />
          
          <main className="flex flex-col items-center justify-center min-h-screen px-4">
            <div className="text-center space-y-8">
              <TypewriterText text="大理大学CTF终端" />
              <p className="mt-4 text-2xl text-blue-300 animate-fade-in">CTF 线上对战平台</p>
            </div>
          </main>

          <Footer />
        </div>
      </div>
    </PageTransition>
  );
}

export default Home