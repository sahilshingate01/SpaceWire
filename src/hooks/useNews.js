import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { saveToCache, getFromCache } from '../utils/newsStorage';

const API_KEY = import.meta.env.VITE_NEWS_API_KEY || import.meta.env.VITE_GNEWS_API_KEY;
const BASE_URL = import.meta.env.DEV
  ? '/api/news/top-headlines'
  : 'https://newsapi.org/v2/top-headlines';

const SPACE_API_URL = 'https://api.spaceflightnewsapi.net/v4/articles/';

const CATEGORIES = ['space', 'technology', 'science', 'business', 'health', 'sports'];

export { CATEGORIES };

export default function useNews(category = 'space') {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'date' | 'source'

  const fetchNews = useCallback(async (skipCache = false) => {
    setLoading(true);
    setError(null);

    // Check cache first
    if (!skipCache) {
      const cached = getFromCache(category);
      if (cached) {
        setArticles(cached);
        setLoading(false);
        return;
      }
    }

    try {
      let normalized = [];

      if (category === 'space') {
        // Use Spaceflight News API (No key required)
        const { data } = await axios.get(SPACE_API_URL, {
          params: { limit: 12 }
        });
        
        if (data.results) {
          normalized = data.results.map((a) => ({
            title: a.title,
            description: a.summary,
            url: a.url,
            urlToImage: a.image_url,
            publishedAt: a.published_at,
            source: { name: a.news_site },
            author: a.news_site,
          }));
        }
      } else {
        // Use NewsAPI.org
        if (!API_KEY) {
          const msg = 'Missing News API Key in .env';
          setError(msg);
          setLoading(false);
          return;
        }

        const { data } = await axios.get(BASE_URL, {
          params: {
            category,
            language: 'en',
            pageSize: 12,
            apiKey: API_KEY,
          },
        });

        if (data.articles) {
          normalized = data.articles.map((a) => ({
            title: a.title,
            description: a.description,
            url: a.url,
            urlToImage: a.urlToImage,
            publishedAt: a.publishedAt,
            source: a.source, // { name, id }
            author: a.author || a.source?.name,
          }));
        }
      }

      if (normalized.length > 0) {
        saveToCache(category, normalized);
        setArticles(normalized);
      } else {
        setError('No articles found');
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0] ||
        err.message ||
        'Failed to fetch news';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [category]);

  const refresh = useCallback(() => fetchNews(true), [fetchNews]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Derived: filter + sort
  const filteredArticles = useMemo(() => {
    let result = [...articles];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          (a.title && a.title.toLowerCase().includes(q)) ||
          (a.description && a.description.toLowerCase().includes(q))
      );
    }

    // Sort
    if (sortBy === 'date') {
      result.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    } else if (sortBy === 'source') {
      result.sort((a, b) =>
        (a.source?.name || '').localeCompare(b.source?.name || '')
      );
    }

    return result;
  }, [articles, searchQuery, sortBy]);

  return {
    articles: filteredArticles,
    loading,
    error,
    refresh,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
  };
}
