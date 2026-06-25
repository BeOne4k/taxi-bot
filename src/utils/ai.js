import axios from 'axios';
import { ANTHROPIC_API_KEY } from '../config.js';

const SYSTEM_PROMPT = `You are a helpful customer support assistant for a retail loyalty program bot.

You can help with:
- FAQ about the loyalty program (how to earn points, redeem rewards, etc.)
- Navigation help (how to find stores, register, etc.)
- General info about the company and stores

You MUST NOT:
- Give medical advice
- Answer legally sensitive questions
- Make up information you don't know

If a question is complex, medical, legal, or the user asks to speak with a human,
respond with exactly: [TRANSFER_TO_HUMAN]

Always respond in the same language the user writes in.
Keep answers concise and friendly.`;

export async function askAi(userMessage, lang = 'en') {
  if (!ANTHROPIC_API_KEY) {
    console.warn('[AI] ANTHROPIC_API_KEY not set');
    return '[TRANSFER_TO_HUMAN]';
  }
  try {
    const { data } = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMessage }],
      },
      {
        headers: {
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        timeout: 15000,
      },
    );
    return data.content?.[0]?.text || '[TRANSFER_TO_HUMAN]';
  } catch (err) {
    console.error('[AI] askAi error:', err.message);
    return '[TRANSFER_TO_HUMAN]';
  }
}
