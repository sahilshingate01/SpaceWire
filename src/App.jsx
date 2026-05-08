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
import ISSSpeedChart from './components/Charts/ISSSpeedChart';
import NewsDistributionChart from './components/Charts/NewsDistributionChart';

function App() {
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
    // Ensure currently loaded category is reflected even if cache is empty.
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

  // Dashboard context for chatbot (keeps both legacy + required fields)
  const dashboardContext = useMemo(() => {
    return {
      // required fields (per spec)
      issPosition: position ? { lat: position.lat, lon: position.lon } : null,
      issSpeed: speed,
      issLocation: location,
      people,
      newsHeadlines: simplifiedNewsHeadlines.map(({ title, source, category }) => ({
        title,
        source,
        category,
      })),

      // legacy keys used by current chatbot prompt
      lat: position?.lat,
      lon: position?.lon,
      locationName: location,
      speed,
      totalArticles: simplifiedNewsHeadlines.length,
    };
  }, [position, speed, location, people, simplifiedNewsHeadlines]);

  // Toasts: refresh success/fail
  const issRefreshRequestedRef = useRef(false);
  const newsRefreshRequestedRef = useRef(false);

  const handleISSRefresh = () => {
    issRefreshRequestedRef.current = true;
    refresh();
    toast.success('Refreshing ISS data…');
  };

  const handleNewsRefresh = async () => {
    newsRefreshRequestedRef.current = true;
    try {
      await refreshNews();
      toast.success(`Refreshing ${activeCategory} news…`);
    } catch (e) {
      toast.error(e?.message || 'Failed to refresh news');
    }
  };

  useEffect(() => {
    if (!issRefreshRequestedRef.current) return;
    if (loading) return;
    if (error) toast.error(error);
    else toast.success('ISS updated');
    issRefreshRequestedRef.current = false;
  }, [loading, error]);

  useEffect(() => {
    if (!newsRefreshRequestedRef.current) return;
    if (newsLoading) return;
    if (newsError) toast.error(newsError);
    else toast.success('News updated');
    newsRefreshRequestedRef.current = false;
  }, [newsLoading, newsError]);

  return (
    <div className="min-h-screen transition-colors duration-300">
      <Toaster position="top-right" />
      <Navbar />

      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-8 space-y-10">
        {/* ISS Stats cards row */}
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

        {/* ISS Map + Speed chart */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ISSMap position={position} positions={positions} speed={speed} location={location} />
          <ISSSpeedChart speedHistory={speedHistory} />
        </section>

        {/* News Distribution Chart */}
        <section className="grid grid-cols-1">
          <NewsDistributionChart
            articleCounts={articleCounts}
            onCategorySelect={(cat) => setActiveCategory(cat)}
          />
        </section>

        {/* News Panel */}
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
      </main>

      {/* Floating Chatbot */}
      <ChatButton dashboardContext={dashboardContext} />
    </div>
  );
}

export default App;
