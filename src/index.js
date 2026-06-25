import 'dotenv/config';
import { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import pino from 'pino';
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

const logger = pino({ level: 'silent' });

async function startBot() {
  const { state: authState, saveCreds } = await useMultiFileAuthState('./auth_info_baileys');
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    logger,
    auth: authState,
    printQRInTerminal: false,
  });

  // Expose sendMessage to webhook
  setSender(async (jid, text) => {
    await sock.sendMessage(jid, { text });
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      console.log('\n📱 Scan this QR code with WhatsApp:\n');
      qrcodeTerminal.generate(qr, { small: true });
    }
    if (connection === 'close') {
      const code = new Boom(lastDisconnect?.error)?.output?.statusCode;
      const shouldReconnect = code !== DisconnectReason.loggedOut;
      console.log(`[WA] Disconnected (code=${code}). Reconnect: ${shouldReconnect}`);
      if (shouldReconnect) startBot();
    } else if (connection === 'open') {
      console.log('[WA] ✅ Connected to WhatsApp!');
    }
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;

    for (const msg of messages) {
      if (msg.key.fromMe) continue; // ignore own messages

      const jid = msg.key.remoteJid;
      if (!jid || jid.endsWith('@g.us')) continue; // ignore groups

      try {
        await handleMessage(sock, jid, msg.message);
      } catch (err) {
        console.error(`[Bot] Error handling message from ${jid}:`, err);
      }
    }
  });

  return sock;
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
    if (state === 'idle' && !getLang(jid)) {
      await handleStart(sock, jid, null);
      setState(jid, 'welcome:lang');
      return;
    }

    // Show main menu for any message when idle
    await sendMainMenu(sock, jid, lang);
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
  if (state === 'idle' || state === 'menu') {
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
    if (text === '1' && state === 'idle') {
      // menu item
    } else {
      await handleLoyaltyInput(sock, jid, message);
      return;
    }
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
