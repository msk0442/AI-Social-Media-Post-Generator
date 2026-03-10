import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  Copy,
  Check,
  Image as ImageIcon,
  Type as TextIcon,
  Sparkles,
  RefreshCcw,
  ExternalLink,
  Github
} from 'lucide-react';

interface PostPreviewProps {
  imageUrl: string | null;
  text: string;
  onTextChange: (newText: string) => void;
  isLoading: boolean;
  topic: string;
}

const PostPreview: React.FC<PostPreviewProps> = ({ imageUrl, text, onTextChange, isLoading, topic }) => {
  const [copyButtonText, setCopyButtonText] = useState('Copy Post');
  const [isCopied, setIsCopied] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = '100px';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [text]);


  const handleDownloadImage = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    const sanitizedTopic = topic.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.download = `social_post_${sanitizedTopic || 'image'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setCopyButtonText('Copied!');
      setTimeout(() => {
        setIsCopied(false);
        setCopyButtonText('Copy Post');
      }, 2000);
    });
  };

  return (
    <div className="w-full space-y-8 min-h-[400px]">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full p-20 glass-card flex flex-col items-center justify-center space-y-6"
          >
            <div className="relative">
              <div className="w-20 h-20 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
              <div className="absolute top-0 w-20 h-20 border-4 border-transparent border-b-purple-500 rounded-full animate-spin [animation-direction:reverse] [animation-duration:1.5s]" />
              <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-indigo-400 animate-pulse" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-slate-100">Generating Perfection...</h3>
              <p className="text-slate-400 mt-2">Gemini AI is crafting your masterpiece.</p>
            </div>
          </motion.div>
        ) : imageUrl ? (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Image Preview Card */}
            <div className="glass-card overflow-hidden flex flex-col group">
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-300 text-sm font-medium">
                  <ImageIcon className="w-4 h-4" />
                  Generated Image
                </div>
                <button
                  onClick={handleDownloadImage}
                  className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all transform active:scale-95"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
              <div className="relative aspect-square flex-grow bg-black/40 group-hover:scale-[1.02] transition-transform duration-500 cursor-zoom-in">
                <img
                  src={imageUrl}
                  alt="AI Generated Social Media Content"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <p className="text-xs text-white/70 italic line-clamp-2">Concept: {topic}</p>
                </div>
              </div>
            </div>

            {/* Text Preview Card */}
            <div className="glass-card overflow-hidden flex flex-col">
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-300 text-sm font-medium">
                  <TextIcon className="w-4 h-4" />
                  Generated Copy
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopyText}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500 text-white text-xs font-bold hover:bg-indigo-600 transition-all transform active:scale-95 shadow-lg shadow-indigo-500/20"
                  >
                    {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copyButtonText}
                  </button>
                </div>
              </div>
              <div className="p-6 md:p-8 flex-grow flex flex-col space-y-4">
                <textarea
                  ref={textAreaRef}
                  value={text}
                  onChange={(e) => onTextChange(e.target.value)}
                  className="w-full flex-grow bg-white/5 border border-white/10 rounded-xl p-4 text-slate-200 text-sm md:text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none shadow-inner"
                  placeholder="Your generated post will appear here..."
                />
                <div className="flex items-center gap-4 text-xs text-slate-500 pt-2">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Optimized for reach
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Ready to share
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full p-20 glass-card flex flex-col items-center justify-center text-center space-y-6"
          >
            <div className="w-20 h-20 rounded-2xl bg-slate-800/50 flex items-center justify-center border border-white/10 text-slate-600">
              <ImageIcon className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-100">Ready for Launch</h3>
              <p className="text-slate-400 mt-2 max-w-sm">Enter a topic and select your platform to generate a professional social media post.</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600 italic">
              <Sparkles className="w-3 h-3" />
              Uses Gemini 1.5 & Imagen 3.0
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PostPreview;
