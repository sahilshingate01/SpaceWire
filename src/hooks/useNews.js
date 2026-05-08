import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { saveToCache, getFromCache } from '../utils/newsStorage';

const API_KEY = import.meta.env.VITE_NEWS_API_KEY || import.meta.env.VITE_GNEWS_API_KEY;
const BASE_URL = import.meta.env.DEV
  ? '/api/gnews/top-headlines'
  : 'https://gnews.io/api/v4/top-headlines';
const CATEGORIES = ['technology', 'science', 'health', 'business', 'sports'];

export { CATEGORIES };

export default function useNews(category = 'technology') {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'date' | 'source'

  const fetchNews = useCallback(async (skipCache = false) => {
    setLoading(true);
    setError(null);

    if (!API_KEY) {
      const msg = 'Missing `VITE_NEWS_API_KEY` (or `VITE_GNEWS_API_KEY`) in .env';
      setError(msg);
      setLoading(false);
      throw new Error(msg);
    }

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
      const { data } = await axios.get(BASE_URL, {
        params: {
          category,
          lang: 'en',
          max: 10,
          token: API_KEY,
        },
      });

      if (data.articles) {
        // Normalize GNews response to a consistent shape
        const normalized = data.articles.map((a) => ({
          title: a.title,
          description: a.description,
          url: a.url,
          urlToImage: a.image,
          publishedAt: a.publishedAt,
          source: a.source,         // { name, url }
          author: a.source?.name || null,
        }));
        saveToCache(category, normalized);
        setArticles(normalized);
      } else {
        const msg = 'Failed to fetch news';
        setError(msg);
        throw new Error(msg);
      }
    } catch (err) {
      const msg =
        err.response?.data?.errors?.[0] ||
        err.response?.data?.message ||
        err.message ||
        'Failed to fetch news';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, [category]);

  const refresh = useCallback(() => fetchNews(true), [fetchNews]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Derived: filter + sort
  const filteredArticles = (() => {
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
  })();

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
