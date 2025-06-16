'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [lightOn, setLightOn] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [isDecorated, setIsDecorated] = useState(false);
  const [showBalloons, setShowBalloons] = useState(false);
  const [showFriends, setShowFriends] = useState(false);
  const [showCake, setShowCake] = useState(false);
  const [isDancing, setIsDancing] = useState(false);
  const [buttonText, setButtonText] = useState("Welcome to Khushi's Birthday 🎉");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();

  const balloons = Array.from({ length: 13 }, (_, index) => ({
    id: index,
    src: `/constent/b${index + 1}.png`,
    left: Math.random() * 90 + 5,
    animationDuration: Math.random() * 5 + 5,
    animationDelay: Math.random() * 2,
    sway: Math.random() * 100 - 50,
    swayEnd: Math.random() * 200 - 100,
  }));

  const friends = Array.from({ length: 7 }, (_, index) => ({
    id: index,
    src: `/constent/fr${index + 1}.jpg`,
    angle: (index * 360) / 7,
    startX: Math.random() < 0.5 ? -100 : 100,
    startY: Math.random() < 0.5 ? -100 : 100,
    danceX: Math.random() * 200 - 100,
    danceY: Math.random() * 200 - 100, 
    danceSpeed: Math.random() * 2 + 1,
  }));

  const triggerConfetti = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    import('canvas-confetti').then((confetti) => {
      const button = document.querySelector('button');
      if (!button) return;
      const rect = button.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const xPos = x / window.innerWidth;
      const yPos = y / window.innerHeight;

      confetti.default({
        particleCount: 150,
        spread: 70,
        origin: { x: xPos, y: yPos },
        colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'],
      });

      confetti.default({
        particleCount: 100,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: yPos },
      });
      confetti.default({
        particleCount: 100,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: yPos },
      });
    });

    if (buttonText === "Welcome to Khushi's Birthday 🎉") {
      setButtonText("Turn on the lights! 💡");
      setTimeout(() => setIsTransitioning(false), 4000);
    } else if (buttonText === "Turn on the lights! 💡") {
      setLightOn(true);
      setButtonText("Play Music 🎶");
      setTimeout(() => setIsTransitioning(false), 4000);
    } else if (buttonText === "Play Music 🎶") {
      setMusicPlaying(true);
      audioRef.current = new Audio('/constent/hbd.mp3');
      audioRef.current.loop = true;
      audioRef.current.play();
      setButtonText("Let's Decorate! 🎈");
      setTimeout(() => setIsTransitioning(false), 5000);
    } else if (buttonText === "Let's Decorate! 🎈") {
      setIsDecorated(true);
      setButtonText("Fly with Balloons 🎈");
      setTimeout(() => setIsTransitioning(false), 7000);
    } else if (buttonText === "Fly with Balloons 🎈") {
      setShowBalloons(true);
      setButtonText("Invite Friends 👥");
      setTimeout(() => setIsTransitioning(false), 5000);
    } else if (buttonText === "Invite Friends 👥") {
      setShowFriends(true);
      setButtonText("Serve Cake 🎂");
      setTimeout(() => setIsTransitioning(false), 5000);
    } else if (buttonText === "Serve Cake 🎂") {
      setShowCake(true);
      setButtonText("Let's Dance! 💃");
      setTimeout(() => setIsTransitioning(false), 7000);
    } else if (buttonText === "Let's Dance! 💃") {
      setIsDancing(true);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      audioRef.current = new Audio('/constent/partysong.mp3');
      audioRef.current.loop = true;
      audioRef.current.play();
      setButtonText("Go to Gallery 📸");
      setTimeout(() => setIsTransitioning(false), 4000);
    } else if (buttonText === "Go to Gallery 📸") {
      router.push('/gallery');
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <Head>
        <title>Happy Birthday Khushi!</title>
      </Head>

      <div className={lightOn ? "bg-amber-100" : "bg-black"}>
        {isDancing && (
          <video
            autoPlay
            loop
            muted
            className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-50"
          >
            <source src="/constent/bg.mp4" type="video/mp4" />
          </video>
        )}
        <div className="flex z-10 justify-center items-center min-h-screen transition-all duration-1000 relative overflow-hidden">
          {isDecorated && (
            <>
              <div className="absolute -top-52 left-0 w-full flex flex-col z-0">
                <img
                  src="/constent/haban.png"
                  alt="Happy Birthday Banner 1"
                  className="w-[90%] h-auto animate-slideDown mx-auto"
                />
              </div>
              <div className="absolute top-0 left-0 w-full flex flex-col z-0">
                <img
                  src="/constent/hs.png"
                  alt="Happy Birthday Banner 2"
                  className="w-full h-auto animate-slideDown"
                />
              </div>
            </>
          )}

          {showBalloons && (
            <>
              {balloons.map((balloon) => (
                <img
                  key={balloon.id}
                  src={balloon.src}
                  alt="Balloon"
                  className="absolute w-28 h-36 animate-float z-5"
                  style={{
                    left: `${balloon.left}%`,
                    animationDuration: `${balloon.animationDuration}s`,
                    animationDelay: `${balloon.animationDelay}s`,
                  }}
                />
              ))}
            </>
          )}

          {showFriends && (
            <div className="relative w-52 h-64 -mr-12">
              {friends.map((friend) => (
                <img
                  key={friend.id}
                  src={friend.src}
                  alt={`Friend ${friend.id + 1}`}
                  className={`absolute w-20 h-20 m-10 z-10 ${
                    isDancing ? 'animate-dance' : 'animate-gather'
                  }`}
                  style={{
                    '--angle': `${friend.angle}deg`,
                    '--start-x': `${friend.startX}vw`,
                    '--start-y': `${friend.startY}vh`,
                    '--dance-x': `${friend.danceX}px`,
                    '--dance-y': `${friend.danceY}px`,
                    '--dance-speed': `${friend.danceSpeed}s`,
                  }}
                />
              ))}
              {showCake && !isDancing && (
                <img
                  src="/constent/cake.png"
                  alt="Birthday Cake"
                  className="absolute w-24 h-24 top-[20%] left-[20%] transform -translate-x-1/2 -translate-y-1/2 z-20 animate-fadeIn"
                />
              )}
              {isDancing && (
                <div className="absolute top-[80%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 animate-fadeIn text-center">
                  <img
                    src="/constent/khusi.gif"
                    alt="Dance Celebration"
                    className="w-32 h-32"
                  />
                  <p className="text-white text-lg font-bold mt-1 bg-black bg-opacity-50 px-1.5 py-0.5 rounded">
                    Khushi
                  </p>
                </div>
              )}
            </div>
          )}

          {lightOn && (
            <>
              <div className="absolute top-4 left-4 w-8 h-8 bg-red-500 rounded-full animate-pulse shadow-[0_0_20px_10px_rgba(239,68,68,0.7)] z-5"></div>
              <div className="absolute top-4 right-4 w-8 h-8 bg-blue-500 rounded-full animate-pulse shadow-[0_0_20px_10px_rgba(59,130,246,0.7)] z-5"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 bg-green-500 rounded-full animate-pulse shadow-[0_0_20px_10px_rgba(34,197,94,0.7)] z-5"></div>
              <div className="absolute bottom-4 right-4 w-8 h-8 bg-yellow-500 rounded-full animate-pulse shadow-[0_0_20px_10px_rgba(234,179,8,0.7)] z-5"></div>
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-pink-500 rounded-full animate-pulse shadow-[0_0_20px_10px_rgba(236,72,153,0.7)] z-5"></div>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-purple-500 rounded-full animate-pulse shadow-[0_0_20px_10px_rgba(168,85,247,0.7)] z-5"></div>
              <div className="absolute top-1/2 left-4 transform -translate-y-1/2 w-8 h-8 bg-orange-500 rounded-full animate-pulse shadow-[0_0_20px_10px_rgba(249,115,22,0.7)] z-5"></div>
              <div className="absolute top-1/2 right-4 transform -translate-y-1/2 w-8 h-8 bg-teal-400 rounded-full animate-pulse shadow-[0_0_20px_10px_rgba(45,212,191,0.7)] z-5"></div>
            </>
          )}

          <div className="text-center relative z-50">
            {!lightOn && (
              <img
                src="/constent/tenor.gif"
                className="w-[98%] h-[92vh] object-cover transition-all duration-1000 opacity-90"
                alt="Dancing celebration"
              />
            )}
            <button
              onClick={triggerConfetti}
              disabled={isTransitioning}
              className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 px-4 z-[9999] text-lg font-bold py-3 rounded-lg cursor-pointer transition-all duration-300 ${
                isTransitioning ? 'opacity-50 cursor-not-allowed' : ''
              } ${
                lightOn
                  ? 'bg-yellow-400 text-black hover:bg-yellow-500 shadow-lg hover:cursor-pointer'
                  : 'bg-amber-600 text-white hover:bg-amber-700 border-amber-500 hover:cursor-pointer'
              }`}
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slideDown {
          animation: slideDown 1s ease-out forwards;
        }

        @keyframes float {
          0% {
            transform: translateY(100vh);
            opacity: 1;
          }
          50% {
            transform: translateY(50vh) translateX(${balloons[0]?.sway}px);
            opacity: 0.8;
          }
          100% {
            transform: translateY(-20vh) translateX(${balloons[0]?.swayEnd}px);
            opacity: 0;
          }
        }
        .animate-float {
          animation: float linear infinite;
        }

        @keyframes gather {
          0% {
            transform: translate(-50%, -50%) translate(var(--start-x), var(--start-y));
            opacity: 0;
          }
          100% {
            transform: translate(-50%, -50%) rotate(var(--angle)) translate(120px) rotate(calc(-1 * var(--angle)));
            opacity: 1;
          }
        }

        @keyframes dance {
          0% {
            transform: translate(-50%, -50%) translate(var(--dance-x), var(--dance-y));
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -50%) translate(calc(-1 * var(--dance-x)), calc(-1 * var(--dance-y)));
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -50%) translate(var(--dance-x), var(--dance-y));
            opacity: 1;
          }
        }
        .animate-gather {
          animation: gather 1.5s ease-out forwards;
        }

        .animate-dance {
          animation: dance var(--dance-speed) ease-in-out infinite;
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform-origin: translate(-50%, -50%) scale(0);
          }
          100% {
            opacity: 1;
            transform-origin: translate(-50%, -50%) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
      `}</style>
    </>
  );
}