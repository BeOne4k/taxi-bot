import 'dotenv/config';
import pkg from 'whatsapp-web.js';
const { Client, LocalAuth, MessageMedia } = pkg;
import qrcodeTerminal from 'qrcode-terminal';

import { getLang, getState, setState, clearState } from './utils/userData.js';
import { t } from './locales/texts.js';
import { handleStart, handleLangSelect, sendMainMenu } from './handlers/start.js';
import { handleStoresMenu, handleStoresInput } from './handlers/stores.js';
import { handleLoyaltyMenu, handleLoyaltyHowToUse, handleLoyaltyInput } from './handlers/loyalty.js';
import { handleManagerMenu, handleManagerInput } from './handlers/manager.js';
import { handleHelpMenu, handleHelpInput } from './handlers/help.js';
import { handleAbout, handleSocials } from './handlers/misc.js';
import { setSender, startWebhookServer } from './webhookApi.js';
import { createThrottledSender } from './utils/messageQueue.js';

// ── jid helpers ──────────────────────────────────────────────────────────
// The rest of the codebase (handlers/*, .env, saved registry entries) was
// written against Baileys-style jids (number@s.whatsapp.net / @lid).
// whatsapp-web.js addresses chats as number@c.us. We normalize on the way
// in/out so nothing else in the app has to change.
function toWwebId(jid) {
  if (!jid) return jid;
  return jid.replace(/@s\.whatsapp\.net$/, '@c.us').replace(/@lid$/, '@c.us');
}

/**
 * whatsapp-web.js can hand back @lid ids for incoming messages in
 * multi-device mode. Resolve to the stable @c.us id via the contact,
 * same trick the working bot (whatsapp-bot) uses.
 */
async function resolveChatId(msg) {
  try {
    const contact = await msg.getContact();
    if (contact?.id?._serialized) {
      return contact.id._serialized; // e.g. "66812345678@c.us"
    }
  } catch (e) {
    // fall through
  }
  return (msg.from || '').replace(/:\d+@/, '@');
}

function guessMimeType(filePath) {
  const ext = (filePath.split('.').pop() || '').toLowerCase();
  if (ext === 'png') return 'image/png';
  if (ext === 'webp') return 'image/webp';
  return 'image/jpeg';
}

/**
 * Builds the sock-like object handlers/* already expect:
 *   sock.sendMessage(jid, { text })
 *   sock.sendMessage(jid, { image: Buffer | { url }, caption })
 *   sock.sendPresenceUpdate(state, jid)
 * so none of the existing handler code needs to change.
 */
function buildSock(client) {
  async function withRetry(fn, attempts = 2) {
    let lastErr;
    for (let i = 0; i <= attempts; i++) {
      try {
        return await fn();
      } catch (err) {
        lastErr = err;
        const isTimeout = /timed out|Runtime\.callFunctionOn|Protocol error/i.test(err?.message || '');
        if (!isTimeout || i === attempts) break;
        console.warn(`[Bot] sendMessage timeout, retry ${i + 1}/${attempts}...`);
        await new Promise((r) => setTimeout(r, 1500 * (i + 1)));
      }
    }
    throw lastErr;
  }

  async function rawSend(jid, content) {
    const chatId = toWwebId(jid);

    if (content?.text !== undefined) {
      return withRetry(() => client.sendMessage(chatId, content.text));
    }

    if (content?.image !== undefined) {
      let media;
      if (Buffer.isBuffer(content.image)) {
        media = new MessageMedia('image/jpeg', content.image.toString('base64'));
      } else if (content.image?.url) {
        media = await MessageMedia.fromUrl(content.image.url, { unsafeMime: true });
      } else if (typeof content.image === 'string') {
        media = new MessageMedia(guessMimeType(content.image), Buffer.from(content.image).toString('base64'));
      } else {
        throw new Error('Unsupported image payload');
      }
      return withRetry(() => client.sendMessage(chatId, media, { caption: content.caption || undefined }));
    }

    throw new Error(`Unsupported message content: ${JSON.stringify(content)}`);
  }

  async function sendPresenceUpdate(state, jid) {
    try {
      const chat = await client.getChatById(toWwebId(jid));
      if (state === 'composing') await chat.sendStateTyping();
      else await chat.clearState();
    } catch {
      // best-effort, same as before
    }
  }

  return { sendMessage: rawSend, sendPresenceUpdate };
}

async function startBot() {
  const client = new Client({
    authStrategy: new LocalAuth({ dataPath: './data/.wwebjs_auth' }),
    // Дефолтного protocolTimeout (30с) иногда не хватает на медленной машине —
    // тогда puppeteer падает с "Runtime.callFunctionOn timed out" на sendMessage.
    puppeteer: {
      headless: true,
      protocolTimeout: 180000,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        // Chrome троттлит JS на "невидимой" странице (актуально и в headless
        // на Windows) — из-за этого evaluate() внутри whatsapp-web.js может
        // не укладываться в таймаут. Отключаем троттлинг явно.
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
      ],
    },
  });

  const sock = buildSock(client);

  // Очередь с паузами и имитацией набора текста остаётся — это просто
  // приятнее для пользователей (сообщения не сыпятся пачкой). Строгой
  // необходимости прятаться от антиспама тут уже нет: это настоящая
  // веб-сессия в браузере, а не реимплементация протокола.
  const throttledSendMessage = createThrottledSender(sock);
  const throttledSock = { ...sock, sendMessage: throttledSendMessage };

  setSender(async (jid, text) => {
    await throttledSendMessage(jid, { text });
  });

  client.on('qr', (qr) => {
    console.log('\n📱 Scan this QR code with WhatsApp:\n');
    qrcodeTerminal.generate(qr, { small: true });
  });

  client.on('authenticated', () => console.log('[WA] Authenticated'));

  client.on('ready', () => {
    console.log('[WA] ✅ Connected to WhatsApp!');
  });

  client.on('auth_failure', (msg) => {
    console.error('[WA] Auth failure:', msg);
    process.exit(1);
  });

  client.on('disconnected', (reason) => {
    console.warn('[WA] Disconnected:', reason);
    process.exit(1);
  });

  client.on('message_create', async (msg) => {
    if (msg.fromMe) return;
    
    try {
      if (msg.from.endsWith("@g.us")) return;

      const jid = await resolveChatId(msg);

      // Adapt whatsapp-web.js's message shape into the minimal Baileys-style
      // shape handlers/* already understand (message.conversation /
      // message.locationMessage), so downstream handler code is untouched.
      const message = {
        conversation: msg.body || '',
        locationMessage: msg.location
          ? { degreesLatitude: msg.location.latitude, degreesLongitude: msg.location.longitude }
          : undefined,
      };

      await handleMessage(throttledSock, jid, message);
    } catch (err) {
      console.error('[Bot] Error handling message:', err);
    }
  });

  await client.initialize();
  return client;
}

async function handleMessage(sock, jid, message) {
  if (!message) return;

  const lang = getLang(jid);
  const state = getState(jid);

  // Extract text
  const text = (
    message.conversation ||
    message.extendedTextMessage?.text ||
    ''
  ).trim();

  // ── Welcome / language selection ──────────────────────────────────────────
  if (!state || state === 'idle') {
    // First contact or /start
    if (text === '/start' || text.startsWith('/start ')) {
      const args = text.includes(' ') ? text.split(' ').slice(1).join(' ') : null;
      await handleStart(sock, jid, args);
      setState(jid, 'welcome:lang');
      return;
    }

    // If user has never selected a language yet, show welcome
    if (!getLang(jid)) {
      await handleStart(sock, jid, null);
      setState(jid, 'welcome:lang');
      return;
    }

    // Route main menu (handles "1","2",... AND falls back to showing menu)
    await routeMainMenu(sock, jid, lang, text, message);
    return;
  }

  // ── Language selection state ──────────────────────────────────────────────
  if (state === 'welcome:lang') {
    const handled = await handleLangSelect(sock, jid, text);
    if (handled) {
      clearState(jid);
    } else {
      await sock.sendMessage(jid, { text: t(lang, 'welcome') });
    }
    return;
  }

  // ── Main menu navigation ───────────────────────────────────────────────────
  if (state === 'menu') {
    await routeMainMenu(sock, jid, lang, text, message);
    return;
  }

  // ── Active FSM states ──────────────────────────────────────────────────────

  // Stores
  if (state === 'stores:waiting_geo') {
    await handleStoresInput(sock, jid, message);
    return;
  }

  // Loyalty
  if (state.startsWith('loyalty:')) {
    await handleLoyaltyInput(sock, jid, message);
    return;
  }

  // Manager chat
  if (state === 'manager:chatting') {
    await handleManagerInput(sock, jid, message);
    return;
  }

  // Help / Gemini chat
  if (state === 'help:chatting') {
    await handleHelpInput(sock, jid, message);
    return;
  }

  // Fallback: treat any message as main menu navigation
  await routeMainMenu(sock, jid, lang, text, message);
}

async function routeMainMenu(sock, jid, lang, text, message) {
  clearState(jid);

  switch (text) {
    case '1':
      await handleStoresMenu(sock, jid);
      break;
    case '2':
      await handleLoyaltyMenu(sock, jid);
      break;
    case '3':
      await handleHelpMenu(sock, jid);
      break;
    case '4':
      await handleAbout(sock, jid);
      break;
    case '5':
      await handleSocials(sock, jid);
      break;
    case '6':
      setState(jid, 'welcome:lang');
      await sock.sendMessage(jid, { text: t(lang, 'welcome') });
      break;
    case '0':
    default:
      await sendMainMenu(sock, jid, lang);
      break;
  }
}

// ── Start everything ─────────────────────────────────────────────────────────
startWebhookServer();
startBot().then(() => {
  console.log('[Bot] Starting WeedeN WhatsApp Bot...');
}).catch((err) => {
  console.error('[Bot] Fatal error:', err);
  process.exit(1);
});
