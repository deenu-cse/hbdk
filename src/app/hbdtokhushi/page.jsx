'use client';
import { useEffect, useRef } from 'react';
import Head from 'next/head';

const HbdToKhushi = () => {
  const audioRef = useRef(null);
  const petalCount = 50;
  const sparkleCount = 20;

  const petals = Array.from({ length: petalCount }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 8 + Math.random() * 10,
    size: 20 + Math.random() * 30,
    spin: Math.random() > 0.5 ? 'rotate-left' : 'rotate-right'
  }));

  const sparkles = Array.from({ length: sparkleCount }, (_, i) => ({
    id: i,
    left: 70 + Math.random() * 25,
    right: 70 + Math.random() * 25,
    bottom: 5 + Math.random() * 15,
    delay: Math.random() * 3,
    duration: 1 + Math.random() * 2,
    size: 5 + Math.random() * 10
  }));

  useEffect(() => {
    // Handle audio with user interaction
    const handleAudio = () => {
      if (audioRef.current) {
        audioRef.current.play().catch(error => {
          console.log("Audio playback failed:", error);
        });
      }
    };

    // Add click event listener to the document
    document.addEventListener('click', handleAudio);

    // Initialize audio
    audioRef.current = new Audio('/constent/Tainu-Happy.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;

    const triggerConfetti = async () => {
      const confetti = await import('canvas-confetti');
      const count = 200;
      const defaults = {
        origin: { x: 0.8, y: 0.8 },
        spread: 70,
        startVelocity: 50,
      };

      function fire(particleRatio, opts) {
        confetti.default({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      }

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    };

    const confettiInterval = setInterval(triggerConfetti, 3000);

    return () => {
      clearInterval(confettiInterval);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      document.removeEventListener('click', handleAudio);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Happy Birthday Khushi!</title>
      </Head>

      <div className="relative w-full h-screen overflow-hidden bg-pink-50">
        <div className="absolute inset-0 z-0">
          <img
            src="/constent/k11.jpg"
            alt="Birthday Celebration"
            className="w-full h-full object-contain opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-pink-500 to-transparent opacity-30"></div>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 text-shadow-lg shadow-pink-800">
            Happy Birthday Khushi!
          </h1>
          <p className="text-2xl md:text-3xl text-white text-shadow shadow-pink-800">
            Wishing you a day filled with love and joy!
          </p>
        </div>

        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50" id="audio-overlay">
          <button 
            onClick={() => {
              document.getElementById('audio-overlay').style.display = 'none';
              if (audioRef.current) {
                audioRef.current.play();
              }
            }}
            className="px-6 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
          >
            Click to Play Music 🎵
          </button>
        </div>

        {petals.map((petal) => (
          <div
            key={petal.id}
            className="absolute z-5 text-4xl text-pink-400 opacity-80"
            style={{
              left: `${petal.left}%`,
              top: '-50px',
              fontSize: `${petal.size}px`,
              animation: `fall ${petal.duration}s linear ${petal.delay}s infinite`,
              position: 'absolute',
              willChange: 'transform',
            }}
          >
            ❁
          </div>
        ))}

        {sparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            className="absolute z-20 text-yellow-300 animate-sparkle"
            style={{
              left: `${sparkle.left}%`,
              bottom: `${sparkle.bottom}%`,
              fontSize: `${sparkle.size}px`,
              animationDelay: `${sparkle.delay}s`,
              animationDuration: `${sparkle.duration}s`,
            }}
          >
            ✨
          </div>
        ))}
        {sparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            className="absolute z-20 text-yellow-300 animate-sparkle"
            style={{
              left: `${sparkle.right}%`,
              bottom: `${sparkle.bottom}%`,
              fontSize: `${sparkle.size}px`,
              animationDelay: `${sparkle.delay}s`,
              animationDuration: `${sparkle.duration}s`,
            }}
          >
            ✨
          </div>
        ))}

        <canvas id="confetti-canvas" className="absolute bottom-0 right-0 w-full h-full pointer-events-none z-30"></canvas>
      </div>

      <style jsx global>{`
        @keyframes fall {
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(calc(100vh + 100px)) rotate(360deg);
            opacity: 0.5;
          }
        }
        @keyframes rotate-left {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        @keyframes rotate-right {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes sparkle {
          0% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.2); }
          100% { opacity: 0; transform: scale(0.5); }
        }
        .animate-sparkle {
          animation: sparkle infinite;
        }
        .text-shadow {
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }
        .shadow-pink-800 {
          text-shadow: 2px 2px 8px rgba(157, 23, 77, 0.8);
        }
      `}</style>
    </>
  );
};

export default HbdToKhushi;