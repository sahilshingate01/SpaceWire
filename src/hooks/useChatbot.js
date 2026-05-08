import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { saveMessages, loadMessages, clearMessages } from '../utils/chatStorage';

const HF_TOKEN = import.meta.env.VITE_HF_TOKEN;
const MODEL_URL = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2';

const REFUSAL =
  "I can ONLY answer using the current dashboard data (ISS + News). I can't answer that.";

function detectIntent(text) {
  const t = (text || '').toLowerCase();

  // Basic greetings/politeness should be handled by the model, 
  // but we flag them to avoid the hard refusal if they don't mention ISS/News.
  const isGreeting = /\b(hi|hello|hey|greetings|morning|evening|thanks|thank you)\b/.test(t);
  const isISS = /\biss\b|\binternational space station\b/.test(t);
  const isNews = /\bnews\b|\bheadline(s)?\b|\barticle(s)?\b/.test(t);

  // If it's a greeting, we let it pass to the model
  if (isGreeting) return { kind: 'greeting' };

  // ISS location (lat/lon/name)
  if (
    isISS &&
    (/\bwhere\b/.test(t) ||
      /\blocation\b/.test(t) ||
      /\bposition\b/.test(t) ||
      /\blat(itude)?\b/.test(t) ||
      /\blon(gitude)?\b/.test(t) ||
      /\bcoordinates?\b/.test(t))
  ) {
    return { kind: 'iss_location' };
  }

  // ISS speed
  if (isISS && /\bspeed\b|\bkm\/h\b|\bkph\b|\bvelocity\b/.test(t)) {
    return { kind: 'iss_speed' };
  }

  // Generic ISS request -> provide overview using allowed fields
  if (isISS) {
    return { kind: 'iss_overview' };
  }

  // Number of articles
  if (
    isNews &&
    (/\bhow many\b/.test(t) ||
      /\bnumber of\b/.test(t) ||
      /\bcount\b/.test(t) ||
      /\btotal\b/.test(t))
  ) {
    return { kind: 'news_count' };
  }

  // News summaries
  if (isNews) {
    return { kind: 'news_summaries' };
  }

  // If it's short and generic, let the model handle it (it will likely refuse if it's off-topic)
  if (t.length < 20) return { kind: 'general' };

  return { kind: 'unsupported' };
}

function normalizeSourceName(src) {
  if (!src) return 'Unknown';
  if (typeof src === 'string') return src;
  return src.name || 'Unknown';
}

function buildSystemPrompt(ctx, intent) {
  const lat = ctx?.lat ?? null;
  const lon = ctx?.lon ?? null;
  const speed = typeof ctx?.speed === 'number' ? ctx.speed : null;
  const locationName = ctx?.locationName ?? null;

  const articlesRaw = Array.isArray(ctx?.newsHeadlines) ? ctx.newsHeadlines : [];
  const articles = articlesRaw.slice(0, 10).map((a) => ({
    title: a?.title ?? null,
    description: a?.description ?? null,
    source: normalizeSourceName(a?.source),
    publishedAt: a?.publishedAt ?? null,
  }));

  return `You are "SpaceWire Assistant", a dashboard-restricted AI.
RULES:
1. Use ONLY the DASHBOARD DATA below. No outside knowledge.
2. If asked about something NOT in the data (and not a greeting), say: "${REFUSAL}"
3. Be brief, professional, and helpful.
4. You can respond to greetings (Hi, Hello) normally but steer back to dashboard facts.

DASHBOARD DATA:
- ISS Position: ${lat}, ${lon} (${locationName || 'Over Ocean'})
- ISS Speed: ${speed ? speed.toFixed(0) : 'N/A'} km/h
- People in Space: ${ctx?.people?.length || 0}
- News articles (${ctx?.totalArticles || 0} total): ${JSON.stringify(articles)}`;
}

export default function useChatbot() {
  const [messages, setMessages] = useState(() => loadMessages());
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  const sendMessage = useCallback(
    async (userText, dashboardContext) => {
      const userMsg = {
        role: 'user',
        content: userText,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);

      try {
        const intent = detectIntent(userText);
        
        if (intent.kind === 'unsupported') {
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: REFUSAL, timestamp: Date.now() },
          ]);
          return;
        }

        if (!HF_TOKEN) {
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: '⚠️ Missing `VITE_HF_TOKEN`. Please add it to your environment variables.',
              timestamp: Date.now(),
            },
          ]);
          return;
        }

        const systemPrompt = buildSystemPrompt(dashboardContext, intent);
        const prompt = `<s>[INST] ${systemPrompt}\n\nUser: ${userText}\n\nAnswer using ONLY the dashboard data. [/INST]`;

        const { data } = await axios.post(
          MODEL_URL,
          { inputs: prompt, parameters: { max_new_tokens: 300, temperature: 0.7 } },
          {
            headers: {
              Authorization: `Bearer ${HF_TOKEN}`,
              'Content-Type': 'application/json',
            },
          }
        );

        let reply = 'Sorry, I could not generate a response.';
        if (Array.isArray(data) && data[0]?.generated_text) {
          const full = data[0].generated_text;
          const instEnd = full.lastIndexOf('[/INST]');
          reply = instEnd !== -1 ? full.slice(instEnd + 7).trim() : full.trim();
        }

        const assistantMsg = {
          role: 'assistant',
          content: reply,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `⚠️ Error: ${err.response?.data?.error || err.message || 'Failed to connect to AI'}`,
            timestamp: Date.now(),
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    },
    []
  );

  const clearChat = useCallback(() => {
    clearMessages();
    setMessages([]);
  }, []);

  return { messages, sendMessage, clearChat, isTyping };
}
