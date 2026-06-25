import { getLang, setLang, clearState } from '../utils/userData.js';
import { t } from '../locales/texts.js';
import { track } from '../utils/analytics.js';
import { registerChannel } from '../utils/apiClient.js';
import { bind as registryBind } from '../utils/chatRegistry.js';
import { flushPending } from '../webhookApi.js';

export async function handleStart(sock, jid, args) {
  const lang = getLang(jid);
  clearState(jid);
  await track(jid, 'bot_started', lang);

  // Deep-link: /start <phone>
  if (args) {
    const phone = args.trim();
    await registerChannel(phone, jid);
    registryBind(phone, jid);
    flushPending(phone);
  }

  await sock.sendMessage(jid, { text: t(lang, 'welcome') });
}

export async function handleLangSelect(sock, jid, input) {
  const map = { '1': 'en', '2': 'ru', '3': 'th' };
  const lang = map[input.trim()];
  if (!lang) return false; // not handled

  setLang(jid, lang);
  await track(jid, 'language_selected', lang, { selected_lang: lang });
  await sock.sendMessage(jid, { text: t(lang, 'lang_set') });
  await sock.sendMessage(jid, { text: t(lang, 'loyalty_hint') });
  await sock.sendMessage(jid, { text: t(lang, 'main_menu') });
  return true;
}

export async function sendMainMenu(sock, jid, lang) {
  await sock.sendMessage(jid, { text: t(lang, 'main_menu') });
}
