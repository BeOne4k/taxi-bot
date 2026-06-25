import { getLang, setState, getState, getStateData, updateStateData, clearState } from '../utils/userData.js';
import { t } from '../locales/texts.js';
import { track } from '../utils/analytics.js';
import { generateOtp, verifyOtp, sendOtpSms } from '../utils/otp.js';
import { registerCustomer } from '../utils/odoo.js';
import { registerChannel } from '../utils/apiClient.js';
import { bind as registryBind } from '../utils/chatRegistry.js';
import { flushPending } from '../webhookApi.js';
import { sendNearestStore } from './stores.js';
import axios from 'axios';
import crypto from 'crypto';
import { META_ADS_PIXEL_ID, META_ADS_ACCESS_TOKEN } from '../config.js';

const PHONE_REGEX = /^\+?[1-9]\d{7,14}$/;

// ── Helpers ──────────────────────────────────────────────────────────────────

async function sendMetaAdsEvent(phone) {
  if (!META_ADS_PIXEL_ID || !META_ADS_ACCESS_TOKEN) return;
  try {
    await axios.post(
      `https://graph.facebook.com/v19.0/${META_ADS_PIXEL_ID}/events?access_token=${META_ADS_ACCESS_TOKEN}`,
      {
        data: [{
          event_name: 'CompleteRegistration',
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'system_generated',
          user_data: { ph: crypto.createHash('sha256').update(phone).digest('hex') },
        }],
      },
    );
  } catch (err) {
    console.error('[Meta] sendMetaAdsEvent error:', err.message);
  }
}

// ── Entry point ──────────────────────────────────────────────────────────────

export async function handleLoyaltyMenu(sock, jid) {
  const lang = getLang(jid);
  await track(jid, 'loyalty_started', lang);
  setState(jid, 'loyalty:phone');
  await sock.sendMessage(jid, { text: t(lang, 'loyalty_start_no_card_text') });
}

export async function handleLoyaltyHowToUse(sock, jid) {
  const lang = getLang(jid);
  await sock.sendMessage(jid, { text: t(lang, 'how_to_use_loyalty') });
}

// ── FSM input handler ─────────────────────────────────────────────────────────

export async function handleLoyaltyInput(sock, jid, message) {
  const lang = getLang(jid);
  const state = getState(jid);
  const text = (message.conversation || message.extendedTextMessage?.text || '').trim();

  // Location in taxi state
  if (state === 'loyalty:taxi' && message.locationMessage) {
    const { degreesLatitude: lat, degreesLongitude: lon } = message.locationMessage;
    clearState(jid);
    await sendNearestStore(sock, jid, lat, lon);
    await sock.sendMessage(jid, { text: t(lang, 'main_menu') });
    return;
  }

  if (!text) return;

  // Global escape
  if (text === '0') {
    clearState(jid);
    await sock.sendMessage(jid, { text: t(lang, 'main_menu') });
    return;
  }

  switch (state) {
    case 'loyalty:phone':
      await processPhone(sock, jid, lang, text);
      break;
    case 'loyalty:otp':
      await processOtp(sock, jid, lang, text);
      break;
    case 'loyalty:name':
      await processName(sock, jid, lang, text);
      break;
    case 'loyalty:taxi':
      await processTaxiText(sock, jid, lang, text);
      break;
    case 'loyalty:country':
      await processCountry(sock, jid, lang, text);
      break;
    case 'loyalty:tourist':
      await processTourist(sock, jid, lang, text);
      break;
    case 'loyalty:thai_citizen':
      await processThaiCitizen(sock, jid, lang, text);
      break;
    default:
      break;
  }
}

// ── Step handlers ─────────────────────────────────────────────────────────────

async function processPhone(sock, jid, lang, text) {
  let phone = text.replace(/[\s-]/g, '');
  if (!PHONE_REGEX.test(phone)) {
    await sock.sendMessage(jid, { text: t(lang, 'loyalty_phone_invalid') });
    return;
  }
  if (!phone.startsWith('+')) phone = '+' + phone;

  updateStateData(jid, { phone });
  // OTP is skipped per original Python bot (commented out), go straight to name
  // const otp = generateOtp(phone);
  // await sendOtpSms(phone, otp);
  // setState(jid, 'loyalty:otp');
  // await sock.sendMessage(jid, { text: t(lang, 'loyalty_otp_sent', { phone }) });
  setState(jid, 'loyalty:name');
  await sock.sendMessage(jid, { text: t(lang, 'loyalty_ask_name') });
}

async function processOtp(sock, jid, lang, text) {
  const { phone } = getStateData(jid);
  const { success, reason } = verifyOtp(phone, text);
  if (!success) {
    if (reason === 'too_many') {
      clearState(jid);
      await sock.sendMessage(jid, { text: t(lang, 'loyalty_otp_attempts') });
    } else {
      await sock.sendMessage(jid, { text: t(lang, 'loyalty_otp_invalid') });
    }
    return;
  }
  setState(jid, 'loyalty:name');
  await sock.sendMessage(jid, { text: t(lang, 'loyalty_ask_name') });
}

async function processName(sock, jid, lang, name) {
  if (name.length < 2) {
    await sock.sendMessage(jid, { text: t(lang, 'loyalty_name_invalid') });
    return;
  }
  updateStateData(jid, { name });
  setState(jid, 'loyalty:taxi');
  await sock.sendMessage(jid, {
    text: t(lang, 'taxi_thank_you') + '\n\n' + t(lang, 'stores_request_geo'),
  });
}

async function processTaxiText(sock, jid, lang, text) {
  // If user types region name in taxi state
  const { findStoresByRegion } = await import('../utils/stores.js');
  const stores = findStoresByRegion(text);
  clearState(jid);
  if (!stores.length) {
    await sock.sendMessage(jid, { text: t(lang, 'no_shops_region') });
  } else {
    for (const store of stores.slice(0, 3)) {
      const line = `🏪 *${store.name}*\n📍 ${store.address}${store.hours ? '\n🕐 ' + store.hours : ''}\n🗺 https://www.google.com/maps?q=${store.lat},${store.lon}`;
      await sock.sendMessage(jid, { text: line });
    }
  }
  await sock.sendMessage(jid, { text: t(lang, 'main_menu') });
}

async function processCountry(sock, jid, lang, country) {
  updateStateData(jid, { country });
  setState(jid, 'loyalty:tourist');
  await sock.sendMessage(jid, { text: t(lang, 'loyalty_ask_tourist') });
}

async function processTourist(sock, jid, lang, text) {
  if (text === '1') {
    updateStateData(jid, { tourist: true, thaiCitizen: false });
    await finalize(sock, jid, lang);
  } else if (text === '2') {
    updateStateData(jid, { tourist: false });
    setState(jid, 'loyalty:thai_citizen');
    await sock.sendMessage(jid, { text: t(lang, 'loyalty_ask_thai_citizen') });
  } else {
    await sock.sendMessage(jid, { text: t(lang, 'loyalty_ask_tourist') });
  }
}

async function processThaiCitizen(sock, jid, lang, text) {
  if (text === '1' || text === '2') {
    updateStateData(jid, { thaiCitizen: text === '1' });
    await finalize(sock, jid, lang);
  } else {
    await sock.sendMessage(jid, { text: t(lang, 'loyalty_ask_thai_citizen') });
  }
}

async function finalize(sock, jid, lang) {
  const data = getStateData(jid);
  clearState(jid);

  const { phone, name, country, tourist = false, thaiCitizen = false } = data;

  await sock.sendMessage(jid, { text: t(lang, 'loading') });

  const result = await registerCustomer({ name, phone, lang, tourist, thaiCitizen, country });

  if (!result) {
    await track(jid, 'loyalty_error', lang);
    await sock.sendMessage(jid, { text: t(lang, 'loyalty_crm_error') + '\n\n' + t(lang, 'main_menu') });
    return;
  }

  await registerChannel(phone, jid, name);
  registryBind(phone, jid);
  flushPending(phone);

  const messages = result?.content?.messages || [];
  let apiMessage = null;
  let barcodeUrl = null;
  for (const msg of messages) {
    if (msg.type === 'text') apiMessage = msg.text;
    if (msg.type === 'image') barcodeUrl = msg.url;
  }

  sendMetaAdsEvent(phone);
  await track(jid, 'loyalty_completed', lang);

  if (apiMessage) {
    await sock.sendMessage(jid, { text: apiMessage });
  }
  if (barcodeUrl) {
    await sock.sendMessage(jid, { image: { url: barcodeUrl }, caption: '' });
  }
  if (!apiMessage && !barcodeUrl) {
    await sock.sendMessage(jid, { text: t(lang, 'loyalty_crm_error') });
  }

  await sock.sendMessage(jid, { text: t(lang, 'main_menu') });
}
