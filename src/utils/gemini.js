import axios from 'axios';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { GEMINI_API_KEY } from '../config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const GEMINI_MODEL = 'gemini-2.5-flash';
const INSTRUCTIONS_FILE = join(__dirname, '../../data/gemini_instructions.txt');

function loadInstructions() {
  try {
    const raw = readFileSync(INSTRUCTIONS_FILE, 'utf-8');
    return raw
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('#'))
      .join('\n');
  } catch {
    return 'You are a helpful assistant. Be concise and friendly.';
  }
}

/**
 * conversation: [{ role: 'user'|'model', text: '...' }]
 */
export async function askGemini(conversation, lang = 'en') {
  if (!GEMINI_API_KEY) {
    return '⚠️ Gemini API key is not configured.';
  }

  const sysInstruction = loadInstructions();

  const contents = [
    {
      role: 'user',
      parts: [{ text: `[System instructions]\n${sysInstruction}\n\n[Conversation starts]` }],
    },
    { role: 'model', parts: [{ text: 'Understood. I will follow these instructions.' }] },
    ...conversation.map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
  ];

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  try {
    const { data } = await axios.post(
      url,
      { contents, generationConfig: { maxOutputTokens: 900, temperature: 0.7 } },
      { timeout: 20000 },
    );
    const parts = data?.candidates?.[0]?.content?.parts;
    return parts?.[0]?.text?.trim() || '⚠️ Could not get a response. Please try again.';
  } catch (err) {
    console.error('[Gemini] error:', err.message);
    return '⚠️ AI service error. Please try again later.';
  }
}
