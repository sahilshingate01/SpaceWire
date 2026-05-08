import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { saveMessages, loadMessages, clearMessages } from '../utils/chatStorage';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const MODEL = 'llama-3.3-70b-versatile';
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const REFUSAL =
  "I can ONLY answer using the current dashboard data (ISS + News). I can't answer that.";

function detectIntent(text) {
  const t = (text || '').toLowerCase();

  const isGreeting = /\b(hi|hello|hey|greetings|morning|evening|thanks|thank you)\b/.test(t);
  const isISS = /\biss\b|\binternational space station\b/.test(t);
  const isNews = /\bnews\b|\bheadline(s)?\b|\barticle(s)?\b/.test(t);

  if (isGreeting) return { kind: 'greeting' };

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

  if (isISS && /\bspeed\b|\bkm\/h\b|\bkph\b|\bvelocity\b/.test(t)) {
    return { kind: 'iss_speed' };
  }

  if (isISS) return { kind: 'iss_overview' };

  if (
    isNews &&
    (/\bhow many\b/.test(t) ||
      /\bnumber of\b/.test(t) ||
      /\bcount\b/.test(t) ||
      /\btotal\b/.test(t))
  ) {
    return { kind: 'news_count' };
  }

  if (isNews) return { kind: 'news_summaries' };

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

        if (!GROQ_API_KEY) {
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: '⚠️ Missing `VITE_GROQ_API_KEY`. Please add it to Vercel and REDEPLOY.',
              timestamp: Date.now(),
            },
          ]);
          return;
        }

        const systemPrompt = buildSystemPrompt(dashboardContext, intent);

        const response = await axios.post(
          API_URL,
          {
            model: MODEL,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userText }
            ],
            temperature: 0.5,
            max_tokens: 500,
          },
          {
            headers: {
              Authorization: `Bearer ${GROQ_API_KEY}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const reply = response.data.choices[0].message.content;

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
            content: `⚠️ Error: ${err.response?.data?.error?.message || err.message || 'Failed to connect to AI (Check CORS/API Key)'}`,
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
