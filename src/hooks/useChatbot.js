import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { saveMessages, loadMessages, clearMessages } from '../utils/chatStorage';

const HF_TOKEN = import.meta.env.VITE_HF_TOKEN;
const MODEL_URL =
  'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2';

const REFUSAL =
  "I can ONLY answer using the current dashboard data (ISS + News). I can't answer that.";

function detectIntent(text) {
  const t = (text || '').toLowerCase();

  const isISS = /\biss\b|\binternational space station\b/.test(t);
  const isNews = /\bnews\b|\bheadline(s)?\b|\barticle(s)?\b/.test(t);

  // Generic "tell me about ..." requests should still be supported
  const isAbout = /\babout\b|\btell me\b|\bwhat('?s| is)\b/.test(t);

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
  if (isISS && /\bspeed\b|\bkm\/h\b|\bkph\b/.test(t)) {
    return { kind: 'iss_speed' };
  }

  // Generic ISS request -> provide overview using allowed fields
  if (isISS && (isAbout || /\bstatus\b|\bupdate\b|\bnow\b/.test(t))) {
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
  if (
    isNews &&
    (/\bsummar(y|ies)\b/.test(t) ||
      /\bsummary\b/.test(t) ||
      /\bsummarize\b/.test(t) ||
      /\bbrief\b/.test(t) ||
      /\brecap\b/.test(t))
  ) {
    return { kind: 'news_summaries' };
  }

  // Generic news request -> treat as summaries
  if (isNews && (isAbout || /\blatest\b|\btop\b|\bupdate\b|\bnow\b/.test(t))) {
    return { kind: 'news_summaries' };
  }

  // If it mentions ISS/news but doesn't match above, still try to respond safely.
  if (isISS) return { kind: 'iss_overview' };
  if (isNews) return { kind: 'news_summaries' };
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

  return `You are a dashboard-restricted assistant.
RULES (must follow):
- You can ONLY use the DASHBOARD DATA provided below (ISS + News).
- No outside knowledge. No guessing. No adding facts not present in the data.
- If the data is missing for what the user asked, say exactly: "${REFUSAL}"
- Keep answers short and direct.

ALLOWED QUESTIONS:
- ISS location (lat/lon and locationName if present)
- ISS speed
- News summaries (based ONLY on article title + description)
- Number of articles

USER INTENT: ${intent.kind}

DASHBOARD DATA (ONLY SOURCE OF TRUTH):
ISS:
- lat: ${lat ?? 'N/A'}
- lon: ${lon ?? 'N/A'}
- speed_kmh: ${speed ?? 'N/A'}
- locationName: ${locationName ?? 'N/A'}
NEWS:
- totalArticles: ${ctx?.totalArticles ?? articlesRaw.length ?? 0}
- topArticles: ${JSON.stringify(articles)}`;
}

export default function useChatbot() {
  const [messages, setMessages] = useState(() => loadMessages());
  const [isTyping, setIsTyping] = useState(false);

  // Persist whenever messages change
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

        // Deterministic responses (no model) for pure dashboard facts
        if (intent.kind === 'iss_location' || intent.kind === 'iss_speed' || intent.kind === 'iss_overview') {
          const lat = dashboardContext?.lat;
          const lon = dashboardContext?.lon;
          const speed = dashboardContext?.speed;
          const locationName = dashboardContext?.locationName;

          const parts = [];
          if (intent.kind !== 'iss_speed') {
            if (typeof lat === 'number' && typeof lon === 'number') {
              parts.push(`ISS location: ${lat.toFixed(4)}, ${lon.toFixed(4)}`);
            } else {
              parts.push(`ISS location: N/A`);
            }
            if (locationName) parts.push(`Location name: ${locationName}`);
          }
          if (intent.kind !== 'iss_location') {
            if (typeof speed === 'number' && Number.isFinite(speed) && speed > 0) {
              parts.push(`ISS speed: ${speed.toFixed(0)} km/h`);
            } else {
              parts.push(`ISS speed: N/A`);
            }
          }

          const reply = parts.length ? parts.join('\n') : REFUSAL;
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: reply, timestamp: Date.now() },
          ]);
          return;
        }

        if (intent.kind === 'news_count') {
          const total =
            typeof dashboardContext?.totalArticles === 'number'
              ? dashboardContext.totalArticles
              : Array.isArray(dashboardContext?.newsHeadlines)
                ? dashboardContext.newsHeadlines.length
                : 0;
          const reply = `Number of articles: ${total}`;
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: reply, timestamp: Date.now() },
          ]);
          return;
        }

        if (!HF_TOKEN) {
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content:
                '⚠️ Missing `VITE_HF_TOKEN`. Add it to your `.env` file to enable the dashboard assistant.',
              timestamp: Date.now(),
            },
          ]);
          return;
        }

        const systemPrompt = buildSystemPrompt(dashboardContext, intent);

        // Build conversation for the model
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
          // Extract only the assistant's response (after [/INST])
          const full = data[0].generated_text;
          const instEnd = full.lastIndexOf('[/INST]');
          reply =
            instEnd !== -1
              ? full.slice(instEnd + 7).trim()
              : full.trim();
        }

        // Hard safety: if model tries to answer outside the restriction, replace with refusal.
        // (We do a light check to catch common failures.)
        const lower = reply.toLowerCase();
        if (
          lower.includes('as an ai') ||
          lower.includes('i don’t have access') ||
          lower.includes("i don't have access")
        ) {
          reply = REFUSAL;
        }

        const assistantMsg = {
          role: 'assistant',
          content: reply,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err) {
        const errorMsg = {
          role: 'assistant',
          content: `⚠️ Error: ${err.response?.data?.error || err.message || 'Failed to get response'}`,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errorMsg]);
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
