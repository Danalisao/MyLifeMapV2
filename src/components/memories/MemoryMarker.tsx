import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, Image as ImageIcon, Calendar, MapPin, Heart, Star, Play, Pause, X } from 'lucide-react';
import type { Memory } from '../../types/memory';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '../ui/Button';

interface MemoryMarkerProps {
  memory: Memory;
  onClick: () => void;
}

export default function MemoryMarker({ memory, onClick }: MemoryMarkerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<{ url: string; type: string } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMarkerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
    onClick();
  };

  const handleMediaClick = (e: React.MouseEvent, media: { url: string; type: string }) => {
    e.stopPropagation();
    setSelectedMedia(media);
    if (media.type === 'video') {
      setIsPlaying(true);
    }
  };

  const handleCloseMedia = () => {
    setSelectedMedia(null);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case 'happy':
        return 'bg-yellow-500 shadow-yellow-500/50';
      case 'excited':
        return 'bg-pink-500 shadow-pink-500/50';
      case 'peaceful':
        return 'bg-blue-500 shadow-blue-500/50';
      case 'nostalgic':
        return 'bg-purple-500 shadow-purple-500/50';
      case 'sad':
        return 'bg-gray-500 shadow-gray-500/50';
      default:
        return 'bg-primary-500 shadow-primary-500/50';
    }
  };

  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case 'happy':
        return '😊';
      case 'excited':
        return '🎉';
      case 'peaceful':
        return '😌';
      case 'nostalgic':
        return '🥺';
      case 'sad':
        return '😢';
      default:
        return '😊';
    }
  };

  // Calculate positions for media items in a circle
  const getMediaPosition = (index: number, total: number) => {
    const radius = 70; // Distance from center
    const angle = (index * (360 / total) * Math.PI) / 180 - Math.PI / 2; // Start from top
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    return { x, y };
  };

  return (
    <>
      <div className="memory-marker">
        <motion.div
          initial={false}
          animate={isExpanded ? 'expanded' : 'collapsed'}
          onClick={handleMarkerClick}
          className="relative"
        >
          {/* Main Marker */}
          <motion.div
            className={`relative w-12 h-12 rounded-2xl ${getEmotionColor(
              memory.emotion
            )} shadow-lg cursor-pointer transform-gpu transition-all duration-300 hover:scale-110 border-2 border-white dark:border-slate-800 flex items-center justify-center`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            layout
          >
            <span className="text-xl">{getEmotionIcon(memory.emotion)}</span>
            
            {/* Media count badges */}
            {memory.media && memory.media.length > 0 && (
              <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 rounded-full px-1.5 py-0.5 text-xs font-medium border border-slate-200 dark:border-slate-700 shadow flex items-center gap-1">
                <ImageIcon className="w-3 h-3" />
                {memory.media.length}
              </div>
            )}
          </motion.div>

          {/* Expanded Content */}
          <AnimatePresence>
            {isExpanded && (
              <>
                {/* Title Card */}
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 p-3"
                >
                  <h3 className="font-medium text-sm mb-1 line-clamp-1">{memory.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <Calendar className="w-3 h-3" />
                    <span>{format(parseISO(memory.date), 'dd MMM yyyy', { locale: fr })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mt-1">
                    <MapPin className="w-3 h-3" />
                    <span className="line-clamp-1">{memory.location.name}</span>
                  </div>
                </motion.div>

                {/* Media Items */}
                {memory.media && memory.media.length > 0 && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={{
                      visible: {
                        transition: {
                          staggerChildren: 0.05,
                        },
                      },
                    }}
                    className="absolute top-0 left-0 w-0 h-0"
                  >
                    {memory.media.slice(0, 5).map((media, index) => {
                      const position = getMediaPosition(index, Math.min(memory.media.length, 5));
                      return (
                        <motion.div
                          key={media.id}
                          className="absolute"
                          variants={{
                            hidden: {
                              x: 0,
                              y: 0,
                              scale: 0,
                              opacity: 0,
                            },
                            visible: {
                              x: position.x,
                              y: position.y,
                              scale: 1,
                              opacity: 1,
                            },
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 25,
                          }}
                        >
                          <motion.div
                            className="w-16 h-16 rounded-lg overflow-hidden border-2 border-white dark:border-slate-800 shadow-lg cursor-pointer bg-white dark:bg-slate-800 transform-gpu"
                            onClick={(e) => handleMediaClick(e, media)}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {media.type === 'video' ? (
                              <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                                <Film className="w-6 h-6 text-white" />
                              </div>
                            ) : (
                              <img
                                src={media.url}
                                alt={memory.title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            )}
                          </motion.div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Media Viewer */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center"
            onClick={handleCloseMedia}
          >
            <button
              onClick={handleCloseMedia}
              className="absolute top-4 right-4 z-50 p-2 text-white/80 hover:text-white"
            >
              <X className="h-8 w-8" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-[90vw] max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedMedia.type === 'video' ? (
                <div className="relative">
                  <video
                    ref={videoRef}
                    src={selectedMedia.url}
                    className="max-h-[90vh] max-w-[90vw] rounded-lg"
                    autoPlay
                    playsInline
                    controls={false}
                    onEnded={() => setIsPlaying(false)}
                  />
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={togglePlay}
                      className="text-white hover:text-white hover:bg-white/20"
                    >
                      {isPlaying ? (
                        <Pause className="h-6 w-6" />
                      ) : (
                        <Play className="h-6 w-6" />
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <motion.img
                  src={selectedMedia.url}
                  alt={memory.title}
                  className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
                  layoutId={`image-${selectedMedia.url}`}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}