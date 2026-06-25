/**
 * webhookApi.js
 * Express server accepting Odoo CRM purchase webhooks.
 *
 * POST /odoo/purchase
 * Header: X-API-Key: <WEBHOOK_SECRET>
 * Body: { phone, customer_name, product_name, order_id?, lang? }
 */

import express from 'express';
import { WEBHOOK_SECRET, WEBHOOK_PORT, THANK_YOU_DELAY_SECONDS, RETENTION_DELAY_SECONDS } from './config.js';
import { getJid } from './utils/chatRegistry.js';

const app = express();
app.use(express.json());

// Bot sender reference — set after sock is ready
let _sendMessage = null;
const _pending = {}; // { phone: [{ lang, order_id, ts }] }

export function setSender(fn) {
  _sendMessage = fn;
}

// ── Message templates (mirrors Python webhook_api.py) ──────────────────────
const MESSAGES = {
  thank_you: {
    ru: 'Спасибо за покупку в WeedeN 🌿 Мы тщательно отбираем каждый продукт и будем рады видеть вас снова за новым опытом и любимыми позициями.',
    en: 'Thank you for your purchase at WeedeN 🌿 We carefully select every product and look forward to seeing you again for new experiences and your favorite items.',
    th: 'ขอบคุณสำหรับการซื้อสินค้าที่ WeedeN 🌿 เราคัดสรรทุกผลิตภัณฑ์อย่างพิถีพิถัน และยินดีที่จะต้อนรับคุณอีกครั้ง',
  },
  retention: {
    ru: 'Спасибо за то, что вы уже попробовали продукты WeedeN! 🌿\n\nТеперь самое время открыть для себя новые фавориты — у нас как раз появились позиции, которые точно стоят второго визита. Приходите!',
    en: "Thank you for trying WeedeN products! 🌿\n\nNow is the perfect time to discover new favorites — we've just added some items that are definitely worth a second visit. Come by and check them out!",
    th: 'ขอบคุณที่ไว้วางใจเลือกใช้ผลิตภัณฑ์ของ WeedeN! 🌿\n\nตอนนี้เป็นเวลาที่เหมาะที่สุดในการค้นหาสินค้าชิ้นโปรดใหม่ๆ เราเพิ่งมีสินค้าใหม่เข้ามา แล้วแวะมานะ!',
  },
};

function buildMessage(type, lang) {
  return MESSAGES[type]?.[lang] || MESSAGES[type]?.en || '';
}

async function sendDelayed(jid, lang, type, delaySec) {
  if (delaySec > 0) await new Promise((r) => setTimeout(r, delaySec * 1000));
  if (!_sendMessage) return;
  try {
    await _sendMessage(jid, buildMessage(type, lang));
    console.log(`[Webhook] Sent ${type} to ${jid}`);
  } catch (err) {
    console.error(`[Webhook] Failed to send ${type} to ${jid}:`, err.message);
  }
}

async function scheduleMessages(jid, lang, orderId, initialDelay = THANK_YOU_DELAY_SECONDS) {
  sendDelayed(jid, lang, 'thank_you', initialDelay);
  const retentionDelay = initialDelay + (RETENTION_DELAY_SECONDS - THANK_YOU_DELAY_SECONDS);
  sendDelayed(jid, lang, 'retention', retentionDelay);
}

export function flushPending(phone) {
  const jid = getJid(phone);
  if (!jid) return;
  const tasks = _pending[phone] || [];
  delete _pending[phone];
  const now = Date.now() / 1000;
  for (const task of tasks) {
    const elapsed = Math.floor(now - task.ts);
    const remaining = Math.max(0, THANK_YOU_DELAY_SECONDS - elapsed);
    scheduleMessages(jid, task.lang, task.order_id, remaining);
  }
}

// ── Webhook endpoint ────────────────────────────────────────────────────────
app.post('/odoo/purchase', (req, res) => {
  const apiKey = req.headers['x-api-key'];
  if (WEBHOOK_SECRET && apiKey !== WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'Invalid or missing X-API-Key' });
  }

  const { phone, customer_name, product_name, order_id, lang = 'en' } = req.body;
  if (!phone || !customer_name || !product_name) {
    return res.status(400).json({ error: 'phone, customer_name, product_name are required' });
  }

  const normalizedPhone = phone.trim().replace(/[\s-]/g, '');
  const resolvedLang = ['en', 'ru', 'th'].includes(lang) ? lang : 'en';

  const jid = getJid(normalizedPhone);
  if (!jid) {
    if (!_pending[normalizedPhone]) _pending[normalizedPhone] = [];
    _pending[normalizedPhone].push({ lang: resolvedLang, order_id, ts: Date.now() / 1000 });
    console.warn(`[Webhook] No JID for phone=${normalizedPhone} — queued`);
    return res.status(202).json({ status: 'queued' });
  }

  scheduleMessages(jid, resolvedLang, order_id);
  return res.status(200).json({ status: 'scheduled', jid, messages: ['thank_you', 'retention'] });
});

app.get('/health', (_req, res) => res.json({ status: 'ok', sender_ready: !!_sendMessage }));

export function startWebhookServer() {
  app.listen(WEBHOOK_PORT, () => {
    console.log(`[Webhook] Server listening on port ${WEBHOOK_PORT}`);
  });
}
