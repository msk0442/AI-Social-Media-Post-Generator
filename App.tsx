import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Send,
  Linkedin,
  Instagram,
  Facebook,
  Twitter,
  Smartphone,
  Github,
  ChevronRight,
  Zap,
  Layout,
  Type
} from 'lucide-react';
import { generateImageFromTopic, generatePostTextFromTopic } from './services/geminiService';
import PostPreview from './components/ImageDisplay';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Platform = 'linkedin' | 'instagram' | 'facebook' | 'twitter' | 'story';

const platformConfig = {
  linkedin: { name: 'LinkedIn', aspectRatio: '1:1', icon: <Linkedin className="w-4 h-4 mr-2" /> },
  instagram: { name: 'Instagram', aspectRatio: '1:1', icon: <Instagram className="w-4 h-4 mr-2" /> },
  facebook: { name: 'Facebook', aspectRatio: '4:3', icon: <Facebook className="w-4 h-4 mr-2" /> },
  twitter: { name: 'X / Twitter', aspectRatio: '16:9', icon: <Twitter className="w-4 h-4 mr-2" /> },
  story: { name: 'Story', aspectRatio: '9:16', icon: <Smartphone className="w-4 h-4 mr-2" /> },
};

const App: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [platform, setPlatform] = useState<Platform>('linkedin');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedText, setGeneratedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePost = useCallback(async () => {
    if (!topic.trim()) {
      setError('Please enter a topic to get started.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    setGeneratedText('');

    try {
      const aspectRatio = platformConfig[platform].aspectRatio;
      const [imageUrl, postText] = await Promise.all([
        generateImageFromTopic(topic, aspectRatio),
        generatePostTextFromTopic(topic)
      ]);

      setGeneratedImage(imageUrl);
      setGeneratedText(postText);
    } catch (err) {
      setError('Failed to generate post. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [topic, platform]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleGeneratePost();
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full" />

      <div className="w-full max-w-5xl px-6 py-12 relative z-10 flex flex-col items-center">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-6"
          >
            <Sparkles className="w-3 h-3" />
            <span>AI-Powered Content Creation</span>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            AI Social Media <br />
            <span className="gradient-text">Post Generator</span>
          </h1>
          <p className="text-slate-400 mt-2 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Transform your ideas into high-engagement social media posts with professional imagery and compelling copy in seconds.
          </p>
        </motion.header>

        {/* Main Interface */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-1 gap-12 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-1 pb-1 overflow-hidden"
          >
            <div className="p-8">
              <div className="space-y-8">
                {/* Topic Input */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <Type className="w-4 h-4" />
                    </div>
                    <label htmlFor="topic-input" className="text-sm font-semibold text-slate-200">What's your post about?</label>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-grow group">
                      <input
                        id="topic-input"
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="e.g., 'A day in the life of a software engineer'"
                        className="w-full pl-4 pr-12 py-4 bg-slate-900/50 border border-slate-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-slate-100 placeholder:text-slate-500 group-hover:border-slate-600/50"
                        disabled={isLoading}
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-indigo-400 transition-colors">
                        <Zap className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Platform Selector */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                      <Layout className="w-4 h-4" />
                    </div>
                    <label className="text-sm font-semibold text-slate-200">Select Platform</label>
                  </div>
                  <div className="flex flex-wrap items-center justify-start gap-3">
                    {Object.entries(platformConfig).map(([key, { name, icon }]) => (
                      <button
                        key={key}
                        onClick={() => setPlatform(key as Platform)}
                        disabled={isLoading}
                        className={cn(
                          "flex items-center px-4 py-2.5 rounded-xl border transition-all duration-300 transform active:scale-95",
                          platform === key
                            ? "bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                            : "bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-slate-300"
                        )}
                      >
                        {icon}
                        <span className="text-sm font-medium">{name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(99, 102, 241, 0.4)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGeneratePost}
                  disabled={isLoading || !topic.trim()}
                  className="w-full flex items-center justify-center gap-3 gradient-bg text-white font-bold py-5 px-8 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-indigo-500/20"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Synthesizing Genius...</span>
                    </div>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Generate Professional Post</span>
                    </>
                  )}
                </motion.button>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2"
                  >
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Results Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full"
          >
            <PostPreview
              imageUrl={generatedImage}
              text={generatedText}
              onTextChange={setGeneratedText}
              isLoading={isLoading}
              topic={topic}
            />
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-24 text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-6">
            <a
              href="https://github.com/msk0442/AI-Social-Media-Post-Generator"
              target="_blank"
              rel="noreferrer"
              className="text-slate-500 hover:text-white transition-colors flex items-center gap-1 text-sm"
            >
              <Github className="w-4 h-4" />
              Source Code
            </a>
            <div className="w-1 h-1 rounded-full bg-slate-700" />
            <a
              href="https://www.linkedin.com/in/muhammadschees/"
              target="_blank"
              rel="noreferrer"
              className="text-slate-500 hover:text-white transition-colors flex items-center gap-1 text-sm"
            >
              <Linkedin className="w-4 h-4" />
              Developer
            </a>
          </div>
          <p className="text-slate-500 text-sm">
            Built with <span className="text-red-500/50">❤</span> using Google Gemini & Framer Motion
          </p>
        </motion.footer>
      </div>
    </div>
  );
};

export default App;
