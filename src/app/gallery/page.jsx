'use client';

import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader, Upload } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const cloudName = process.env.NEXT_PUBLIC_CLOUD_NAME;
const backendUrl = process.env.NEXT_PUBLIC_API_URL;

const popSound = '/sounds/poptune.mp3';
const heartSound = '/sounds/poptune.mp3';

const Gallery = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [allNotes, setAllNotes] = useState([]);
  const [userCard, setUserCard] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('none');
  const audioRef = useRef(null);

  const router = useRouter()

  const filters = [
    { name: 'none', label: 'No Filter' },
    { name: 'sepia', label: 'Vintage' },
    { name: 'brightness-110 contrast-110', label: 'Bright' },
    { name: 'saturate-200', label: 'Colorful' },
    { name: 'grayscale', label: 'Black & White' },
    { name: 'hue-rotate-90', label: 'Cool Tone' },
    { name: 'hue-rotate-180', label: 'Warm Tone' },
  ];

  useEffect(() => {
    console.log('Cloud Name:', cloudName);
    console.log('Backend URL:', backendUrl);

    const hasCard = localStorage.getItem('card');
    if (!hasCard) {
      playSound(popSound);
      setIsDialogOpen(true);
    }
    fetchAllNotes();
  }, []);

  const playSound = (soundFile) => {
    if (typeof window !== 'undefined') {
      const audio = new Audio(soundFile);
      audio.volume = 0.3;
      audio.play().catch(e => console.log('Audio play failed:', e));
    }
  };

  const fetchAllNotes = async () => {
    try {
      const response = await axios.get(`${backendUrl}/getallnotes`);
      setAllNotes(response.data || []);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch notes');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const maxSize = 800 * 1024; // 800KB
    if (file.size > maxSize) {
      toast.error('Image must be smaller than 800 KB');
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (event) => {
      setImagePreview(event.target.result);
    };

    reader.onerror = () => {
      toast.error('Error reading the image file');
      return;
    };

    reader.readAsDataURL(file);
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (!note.trim()) {
      toast.error('Please write a note');
      return;
    }

    if (!image) {
      toast.error('Please upload an image');
      return;
    }

    const maxSize = 800 * 1024;
    if (image.size > maxSize) {
      toast.error('Image size must be less than 800KB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', image);
      formData.append('upload_preset', 'Deendayal');
      formData.append('cloud_name', cloudName);

      const imageResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );

      const imageUrl = imageResponse.data.secure_url;

      const response = await axios.post(`${backendUrl}/sendGift/tokhushi`, {
        name,
        note,
        image: imageUrl,
        filter: selectedFilter,
      });

      setUserCard(response.data);
      localStorage.setItem('card', 'true');
      setIsDialogOpen(false);
      playSound(heartSound);
      toast.success('Gift sent successfully!');
      fetchAllNotes();

      setName('');
      setNote('');
      setImage(null);
      setImagePreview('');
      setSelectedFilter('none');
    } catch (error) {
      console.error('Submission failed:', error);
      const errorMessage = error.response?.data?.error?.message || error.response?.data?.message || 'Failed to send gift';
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  // Create flying hearts animation
  const createHearts = (e) => {
    playSound(heartSound);
    const xPos = e.clientX || e.touches[0].clientX;
    const yPos = e.clientY || e.touches[0].clientY;
    
    for (let i = 0; i < 5; i++) {
      const heart = document.createElement('div');
      heart.className = 'heart';
      heart.style.left = `${xPos}px`;
      heart.style.top = `${yPos}px`;
      
      // Randomize heart appearance
      const size = Math.random() * 20 + 10;
      const duration = Math.random() * 3 + 2;
      const delay = Math.random() * 0.5;
      
      heart.style.width = `${size}px`;
      heart.style.height = `${size}px`;
      heart.style.animationDuration = `${duration}s`;
      heart.style.animationDelay = `${delay}s`;
      
      document.body.appendChild(heart);
      
      // Remove heart after animation completes
      setTimeout(() => {
        heart.remove();
      }, duration * 1000);
    }
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-b from-pink-100 to-purple-100 p-6 relative overflow-y-auto"
      onClick={createHearts}
    >
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }
        .heart {
          position: fixed;
          pointer-events: none;
          background-image: url('/constent/heart.png');
          background-size: contain;
          background-repeat: no-repeat;
          z-index: 1000;
          animation: float linear forwards;
        }
        .sparkle {
          position: absolute;
          width: 40px;
          height: 40px;
          background-image: url('/constent/spp.png');
          background-size: contain;
          animation: sparkle 1s ease-out infinite;
          pointer-events: none;
        }
        @keyframes sparkle {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(0.5); opacity: 0; }
        }
        @keyframes popIn {
          0% { transform: scale(0); opacity: 0; }
          80% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .pop-in {
          animation: popIn 0.5s ease-out forwards;
        }
        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce-slow {
          animation: bounce 2s infinite;
        }
      `}</style>

      {/* Sparkles container */}
      <div className="fixed inset-0 pointer-events-none z-20" id="sparkles-container"></div>

      <div className="absolute inset-0 z-0 ">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {allNotes.map((note) => (
            <div
              key={note._id}
              className="relative bg-white rounded-lg shadow-lg p-4 transform rotate-[-5deg] hover:rotate-0 transition-transform duration-300 hover:shadow-xl hover:z-10"
              onMouseEnter={(e) => {
                // Add sparkles animation
                const container = e.currentTarget;
                for (let i = 0; i < 10; i++) {
                  const sparkle = document.createElement('div');
                  sparkle.className = 'sparkle';
                  sparkle.style.left = `${Math.random() * 100}%`;
                  sparkle.style.top = `${Math.random() * 100}%`;
                  sparkle.style.animationDelay = `${Math.random() * 0.5}s`;
                  container.appendChild(sparkle);
                  
                  setTimeout(() => {
                    sparkle.remove();
                  }, 1000);
                }
              }}
            >
              <img
                src="/constent/gr1.png"
                alt="Garland"
                className="absolute -top-4 -left-4 w-12 h-12"
              />
              <img
                src="/constent/gr1.png"
                alt="Garland"
                className="absolute -top-4 -right-4 w-12 h-12"
              />
              <div className="relative overflow-hidden rounded-md mb-2">
                <img
                  src={note.image}
                  alt={note.name}
                  className={`w-full h-32 object-cover ${note.filter === 'sepia' ? 'filter sepia' : 
                    note.filter === 'brightness-110 contrast-110' ? 'filter brightness-110 contrast-110' :
                    note.filter === 'saturate-200' ? 'filter saturate-200' :
                    note.filter === 'grayscale' ? 'filter grayscale' :
                    note.filter === 'hue-rotate-90' ? 'filter hue-rotate-90' :
                    note.filter === 'hue-rotate-180' ? 'filter hue-rotate-180' : ''}`}
                />
              </div>
              <h3 className="text-lg font-semibold text-pink-600">{note.name}</h3>
              <p className="text-sm text-gray-600">{note.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* User Card */}
      {userCard && (
        <div className="relative z-10 max-w-md mx-auto mt-8 pop-in">
          <Card className="bg-white border-4 border-pink-300 shadow-2xl rounded-2xl overflow-hidden">
            <div className="absolute -top-6 -left-6 w-16 h-16">
              <img src="/constent/fl1.png" alt="Flower" className="w-full h-full animate-pulse" />
            </div>
            <div className="absolute -top-6 -right-6 w-16 h-16">
              <img src="/constent/fl3.png" alt="Flower" className="w-full h-full animate-pulse" />
            </div>
            <div className="absolute -bottom-6 -left-6 w-16 h-16">
              <img src="/constent/fl4.png" alt="Flower" className="w-full h-full animate-pulse" />
            </div>
            <div className="absolute -bottom-6 -right-6 w-16 h-16">
              <img src="/constent/fl5.png" alt="Flower" className="w-full h-full animate-pulse" />
            </div>
            <img
              src="/constent/gr1.png"
              alt="Garland"
              className="absolute top-0 left-0 w-full h-12 object-cover"
            />
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mt-7 font-bold text-pink-600 animate-bounce">
                {userCard.name}'s Gift
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 py-1">
              <div className="relative overflow-hidden rounded-lg mb-4">
                <img
                  src={userCard.image}
                  alt={userCard.name}
                  className={`w-full h-64 object-cover border-2 border-yellow-300 ${userCard.filter === 'sepia' ? 'filter sepia' : 
                    userCard.filter === 'brightness-110 contrast-110' ? 'filter brightness-110 contrast-110' :
                    userCard.filter === 'saturate-200' ? 'filter saturate-200' :
                    userCard.filter === 'grayscale' ? 'filter grayscale' :
                    userCard.filter === 'hue-rotate-90' ? 'filter hue-rotate-90' :
                    userCard.filter === 'hue-rotate-180' ? 'filter hue-rotate-180' : ''}`}
                />
              </div>
              <p className="text-gray-700 text-lg italic bg-yellow-100 p-4 rounded-lg">
                "{userCard.note}"
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        if (open) playSound(popSound);
        setIsDialogOpen(open);
      }}>
        <DialogContent className="bg-white rounded-2xl border-4 border-pink-400 shadow-2xl p-6 max-w-md max-h-[90vh] overflow-y-auto pop-in">
          <img
            src="/constent/gr1.png"
            alt="Garland"
            className="absolute top-0 left-0 w-full h-12 object-cover"
          />
          <img
            src="/constent/fl1.png"
            alt="Flower"
            className="absolute -top-6 -left-6 w-12 h-12 animate-spin-slow"
          />
          <img
            src="/constent/fl3.png"
            alt="Flower"
            className="absolute -top-6 -right-6 w-12 h-12 animate-spin-slow"
          />
          <DialogHeader className="mt-10">
            <DialogTitle className="text-2xl font-bold text-center text-pink-600">
              Send a Gift to Khushi! 🎉
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-pink-600 font-semibold">
                Your Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="border-pink-300 focus:border-pink-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="note" className="text-pink-600 font-semibold">
                Your Note
              </Label>
              <Textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Write a heartfelt note for Khushi..."
                className="border-pink-300 focus:border-pink-500 min-h-[100px]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image" className="text-pink-600 font-semibold">
                Upload Image
              </Label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-pink-300 rounded-lg cursor-pointer bg-pink-50 hover:bg-pink-100">
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                    disabled={uploading}
                  />
                  {imagePreview ? (
                    <div className="relative w-full h-full">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className={`w-full h-full object-contain rounded-lg ${selectedFilter === 'sepia' ? 'filter sepia' : 
                          selectedFilter === 'brightness-110 contrast-110' ? 'filter brightness-110 contrast-110' :
                          selectedFilter === 'saturate-200' ? 'filter saturate-200' :
                          selectedFilter === 'grayscale' ? 'filter grayscale' :
                          selectedFilter === 'hue-rotate-90' ? 'filter hue-rotate-90' :
                          selectedFilter === 'hue-rotate-180' ? 'filter hue-rotate-180' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setImage(null);
                          setImagePreview('');
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="w-8 h-8 text-pink-600" />
                      <p className="text-sm text-pink-600">
                        Click to upload an image (max 800KB)
                      </p>
                    </div>
                  )}
                </label>
              </div>
              
              {/* Filter Selection */}
              {imagePreview && (
                <div className="space-y-2">
                  <Label className="text-pink-600 font-semibold">
                    Choose a Filter
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {filters.map((filter) => (
                      <button
                        key={filter.name}
                        type="button"
                        onClick={() => setSelectedFilter(filter.name)}
                        className={`p-2 rounded-md border ${selectedFilter === filter.name ? 'border-pink-500 bg-pink-100' : 'border-gray-300'}`}
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 mb-1 overflow-hidden rounded-md">
                            <img
                              src={imagePreview}
                              alt="Filter preview"
                              className={`w-full h-full object-cover ${filter.name === 'sepia' ? 'filter sepia' : 
                                filter.name === 'brightness-110 contrast-110' ? 'filter brightness-110 contrast-110' :
                                filter.name === 'saturate-200' ? 'filter saturate-200' :
                                filter.name === 'grayscale' ? 'filter grayscale' :
                                filter.name === 'hue-rotate-90' ? 'filter hue-rotate-90' :
                                filter.name === 'hue-rotate-180' ? 'filter hue-rotate-180' : ''}`}
                            />
                          </div>
                          <span className="text-xs">{filter.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-600 text-white"
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Gift'
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => {
            try {
              router.push('/puzzel');
            } catch (error) {
              console.error('Navigation error:', error);
              window.location.href = '/puzzel';
            }
          }}
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-bounce-slow"
        >
          🎮 Let's Play a Game!
        </Button>
      </div>
    </div>
  );
};

export default Gallery;