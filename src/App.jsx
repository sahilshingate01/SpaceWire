import React, { useMemo, useRef, useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import useISS from './hooks/useISS';
import useNews, { CATEGORIES } from './hooks/useNews';
import { getFromCache } from './utils/newsStorage';
import ISSStats from './components/ISS/ISSStats';
import ISSMap from './components/ISS/ISSMap';
import NewsPanel from './components/News/NewsPanel';
import ChatButton from './components/Chatbot/ChatButton';
import Navbar from './components/UI/Navbar';
import Sidebar from './components/UI/Sidebar';
import ISSSpeedChart from './components/Charts/ISSSpeedChart';
import NewsDistributionChart from './components/Charts/NewsDistributionChart';

import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ISS
  const { 
    position, 
    positions, 
    speed, 
    speedHistory, 
    location, 
    people, 
    loading, 
    error, 
    refresh,
    autoRefresh,
    toggleAutoRefresh
  } = useISS();

  // News (controlled from App so charts can change category)
  const [activeCategory, setActiveCategory] = useState('space');
  const {
    articles,
    loading: newsLoading,
    error: newsError,
    refresh: refreshNews,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
  } = useNews(activeCategory);

  const articleCounts = useMemo(() => {
    const counts = {};
    for (const cat of CATEGORIES) {
      const cached = getFromCache(cat);
      counts[cat] = Array.isArray(cached) ? cached.length : 0;
    }
    counts[activeCategory] = Array.isArray(articles) ? articles.length : counts[activeCategory] || 0;
    return counts;
  }, [activeCategory, articles]);

  const simplifiedNewsHeadlines = useMemo(() => {
    return (articles || []).map((a) => ({
      title: a.title,
      source: a.source?.name || 'Unknown',
      category: activeCategory,
      description: a.description,
      publishedAt: a.publishedAt,
      url: a.url,
    }));
  }, [articles, activeCategory]);

  const dashboardContext = useMemo(() => {
    return {
      issPosition: position ? { lat: position.lat, lon: position.lon } : null,
      issSpeed: speed,
      issLocation: location,
      people,
      newsHeadlines: simplifiedNewsHeadlines.map(({ title, source, category }) => ({
        title,
        source,
        category,
      })),
      lat: position?.lat,
      lon: position?.lon,
      locationName: location,
      speed,
      totalArticles: simplifiedNewsHeadlines.length,
    };
  }, [position, speed, location, people, simplifiedNewsHeadlines]);

  const issRefreshRequestedRef = useRef(false);
  const newsRefreshRequestedRef = useRef(false);

  const handleISSRefresh = () => {
    issRefreshRequestedRef.current = true;
    refresh();
    toast.success('Initiating ISS uplink…');
  };

  const handleNewsRefresh = async () => {
    newsRefreshRequestedRef.current = true;
    try {
      await refreshNews();
      toast.success(`Scanning ${activeCategory} data streams…`);
    } catch (e) {
      toast.error(e?.message || 'Uplink failed');
    }
  };

  useEffect(() => {
    if (!issRefreshRequestedRef.current) return;
    if (loading) return;
    if (error) toast.error(error);
    else toast.success('ISS Telemetry Synchronized');
    issRefreshRequestedRef.current = false;
  }, [loading, error]);

  useEffect(() => {
    if (!newsRefreshRequestedRef.current) return;
    if (newsLoading) return;
    if (newsError) toast.error(newsError);
    else toast.success('Intelligence Feed Updated');
    newsRefreshRequestedRef.current = false;
  }, [newsLoading, newsError]);

  return (
    <div className="min-h-screen flex text-white overflow-hidden bg-[#050a14]">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(13, 22, 40, 0.9)',
            color: '#fff',
            border: '1px solid rgba(0, 212, 255, 0.2)',
            backdropFilter: 'blur(10px)',
          },
        }}
      />
      
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={(tab) => {
          setActiveTab(tab);
          setIsSidebarOpen(false); // Close on mobile after selection
        }} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className={`flex-1 flex flex-col h-screen overflow-hidden transition-all duration-500 ${isSidebarOpen ? 'ml-0' : 'ml-0 lg:ml-64'}`}>
        <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="max-w-7xl mx-auto"
            >
              {activeTab === 'dashboard' && (
                <div className="space-y-6 md:space-y-8">
                  <header className="mb-8 hidden md:block">
                    <h1 className="text-4xl font-bold font-display tracking-tight mb-2">Mission Control</h1>
                    <p className="text-slate-400 font-mono text-sm tracking-wide">
                      STATUS: ONLINE | LOCAL TIME: {new Date().toLocaleTimeString()}
                    </p>
                  </header>

                  <ISSStats 
                    position={position} 
                    speed={speed} 
                    location={location} 
                    positions={positions}
                    people={people}
                    loading={loading}
                    error={error}
                    refresh={handleISSRefresh}
                    autoRefresh={autoRefresh}
                    onToggleAutoRefresh={toggleAutoRefresh}
                  />

                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
                    <div className="xl:col-span-2 space-y-6 md:space-y-8">
                      <div className="h-[400px] md:h-[500px]">
                        <ISSMap 
                          position={position} 
                          positions={positions} 
                          speed={speed} 
                          location={location} 
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        <ISSSpeedChart speedHistory={speedHistory} />
                        <NewsDistributionChart articleCounts={articleCounts} onCategorySelect={setActiveCategory} />
                      </div>
                    </div>
                    
                    <div className="xl:col-span-1">
                      <NewsPanel 
                        activeCategory={activeCategory}
                        onActiveCategoryChange={setActiveCategory}
                        articles={articles}
                        loading={newsLoading}
                        error={newsError}
                        refresh={handleNewsRefresh}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'iss' && (
                <div className="space-y-6 md:space-y-8">
                  <header className="mb-8">
                    <h1 className="text-4xl font-bold font-display tracking-tight mb-2">Orbital Tracking</h1>
                    <p className="text-slate-400 font-mono text-sm tracking-wide">REAL-TIME TELEMETRY STREAM</p>
                  </header>
                  <ISSStats 
                    position={position} 
                    speed={speed} 
                    location={location} 
                    positions={positions}
                    people={people}
                    loading={loading}
                    error={error}
                    refresh={handleISSRefresh}
                    autoRefresh={autoRefresh}
                    onToggleAutoRefresh={toggleAutoRefresh}
                    compact
                  />
                  <div className="h-[500px] md:h-[600px]">
                    <ISSMap 
                      position={position} 
                      positions={positions} 
                      speed={speed} 
                      location={location} 
                    />
                  </div>
                </div>
              )}

              {activeTab === 'news' && (
                <div className="space-y-6 md:space-y-8">
                  <header className="mb-8">
                    <h1 className="text-4xl font-bold font-display tracking-tight mb-2">News Center</h1>
                    <p className="text-slate-400 font-mono text-sm tracking-wide">GLOBAL INTELLIGENCE FEED</p>
                  </header>
                  <NewsPanel 
                    activeCategory={activeCategory}
                    onActiveCategoryChange={setActiveCategory}
                    articles={articles}
                    loading={newsLoading}
                    error={newsError}
                    refresh={handleNewsRefresh}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
        
        <ChatButton context={dashboardContext} />
      </div>
    </div>
  );
}

export default App;
