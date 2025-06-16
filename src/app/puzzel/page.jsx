'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { JigsawPuzzle } from 'react-jigsaw-puzzle';
import 'react-jigsaw-puzzle/lib/jigsaw-puzzle.css';
import { useRouter } from 'next/navigation';

const PuzzleGame = () => {
    const router = useRouter();
    const [isComplete, setIsComplete] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [timeTaken, setTimeTaken] = useState(0);
    const [timer, setTimer] = useState(null);

    const puzzleImage = "https://plus.unsplash.com/premium_photo-1747852228947-34162c2193c8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8"; // Replace 'your-image.jpg' with your actual image filename

    useEffect(() => {
        if (isComplete) {
            setShowDialog(true);
            if (timer) clearInterval(timer);
        }
    }, [isComplete, timer]);

    useEffect(() => {
        const startTime = Date.now();
        const interval = setInterval(() => {
            setTimeTaken(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);
        setTimer(interval);

        return () => {
            if (timer) clearInterval(timer);
        };
    }, []);

    const handleRestart = () => {
        setIsComplete(false);
        setShowDialog(false);
        setTimeTaken(0);
        const startTime = Date.now();
        const interval = setInterval(() => {
            setTimeTaken(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);
        setTimer(interval);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-100 p-6 flex flex-col items-center">
            <h1 className="text-xl font-bold text-pink-600 mb-6 text-center">
                🧩 Let's see how much <span className="underline decoration-wavy decoration-pink-400">You</span> knows about Khushi 😜
            </h1>

            <div className="max-w-xl w-full bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <div className="text-lg font-medium text-gray-700">
                        Time: <span className="font-bold">{timeTaken}s</span>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="bg-pink-100 hover:bg-pink-200 text-pink-600"
                            onClick={handleRestart}
                        >
                            Restart Puzzle
                        </Button>
                        <Button
                            variant="outline"
                            className="bg-red-100 hover:bg-red-200 text-red-600"
                            onClick={() => router.push('/hbdtokhushi')}
                        >
                            End
                        </Button>
                    </div>
                </div>

                <div className="border-2 border-pink-200 rounded-lg overflow-hidden">
                    <JigsawPuzzle
                        imageSrc='/constent/k22.jpg'
                        rows={4}
                        columns={4}
                        onSolved={() => setIsComplete(true)}
                        puzzleClassName="rounded-lg"
                        containerClassName="bg-pink-50"
                        pieceClassName="border-2 border-pink-300 hover:border-pink-500 transition-all"
                    />
                </div>
            </div>

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="sm:max-w-md bg-white rounded-2xl border-4 border-pink-300">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-center text-pink-600">
                            🎉 Puzzle Complete!
                        </DialogTitle>
                    </DialogHeader>
                    <div className="text-center py-4">
                        <p className="text-lg text-gray-700 mb-4">
                            "You complete the picture of my life."
                        </p>
                        <p className="text-sm text-gray-500">
                            You finished in {timeTaken} seconds!
                        </p>
                    </div>
                    <div className="flex justify-center">
                        <Button
                            className="bg-pink-500 hover:bg-pink-600 text-white"
                            onClick={handleRestart}
                        >
                            Play Again
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <style jsx global>{`
        .react-jigsaw-puzzle > img {
          object-fit: cover;
        }
        .react-jigsaw-puzzle > div {
          background-size: cover;
          background-position: center;
        }
      `}</style>
        </div>
    );
};

export default PuzzleGame;