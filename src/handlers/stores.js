import { getLang, setState, getState, clearState } from '../utils/userData.js';
import { t } from '../locales/texts.js';
import { track } from '../utils/analytics.js';
import { findStoresByLocation, findStoresByRegion, findNearestStore } from '../utils/stores.js';

function mapsUrl(store) {
  return `https://www.google.com/maps?q=${store.lat},${store.lon}`;
}

function storeCard(store, lang, withDistance = true) {
  const name = store.name || '—';
  const address = store.address || '—';
  const hours = store.hours;
  const dist = store.distance_km;
  let text = `🏪 *${name}*\n📍 ${address}`;
  if (hours) text += `\n🕐 ${hours}`;
  if (withDistance && dist != null) text += `\n📏 ${dist} ${t(lang, 'km')}`;
  text += `\n🗺 Google Maps: ${mapsUrl(store)}`;
  return text;
}

export async function handleStoresMenu(sock, jid) {
  const lang = getLang(jid);
  await track(jid, 'stores_opened', lang);
  setState(jid, 'stores:waiting_geo');
  await sock.sendMessage(jid, { text: t(lang, 'stores_request_geo') });
}

export async function handleStoresInput(sock, jid, message) {
  const lang = getLang(jid);

  // Location message (WhatsApp locationMessage)
  if (message.locationMessage) {
    const { degreesLatitude: lat, degreesLongitude: lon } = message.locationMessage;
    clearState(jid);
    const stores = findStoresByLocation(lat, lon);
    if (!stores.length) {
      await sock.sendMessage(jid, { text: t(lang, 'no_shops') + '\n\n' + t(lang, 'main_menu') });
      return;
    }
    await sock.sendMessage(jid, { text: t(lang, 'stores_result', { count: stores.length }) });
    for (const store of stores) {
      await sock.sendMessage(jid, { text: storeCard(store, lang, true) });
    }
    await sock.sendMessage(jid, { text: t(lang, 'main_menu') });
    return;
  }

  // Text input → treat as region name
  const text = (message.conversation || message.extendedTextMessage?.text || '').trim();
  if (!text) return;

  if (text === '0') {
    clearState(jid);
    await sock.sendMessage(jid, { text: t(lang, 'main_menu') });
    return;
  }

  clearState(jid);
  const stores = findStoresByRegion(text);
  if (!stores.length) {
    await sock.sendMessage(jid, { text: t(lang, 'no_shops_region') + '\n\n' + t(lang, 'main_menu') });
    return;
  }
  await sock.sendMessage(jid, { text: t(lang, 'stores_result', { count: stores.length }) });
  for (const store of stores) {
    await sock.sendMessage(jid, { text: storeCard(store, lang, false) });
  }
  await sock.sendMessage(jid, { text: t(lang, 'main_menu') });
}

// Used from loyalty flow after registration
export async function sendNearestStore(sock, jid, lat, lon) {
  const lang = getLang(jid);
  const store = findNearestStore(lat, lon);
  if (!store) {
    await sock.sendMessage(jid, { text: t(lang, 'no_shops') });
    return;
  }
  await sock.sendMessage(jid, { text: storeCard(store, lang, true) });
}
