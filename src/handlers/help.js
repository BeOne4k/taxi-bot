import { getLang, setState, getState, getStateData, updateStateData, clearState } from '../utils/userData.js';
import { t } from '../locales/texts.js';
import { track } from '../utils/analytics.js';
import { askGemini } from '../utils/gemini.js';
import { MANAGER_PHONE } from '../config.js';

const HISTORY_KEY = 'gemini_history';
const MAX_HISTORY_TURNS = 10;

export async function handleHelpMenu(sock, jid) {
  const lang = getLang(jid);
  await track(jid, 'help_started', lang);
  setState(jid, 'help:chatting', { [HISTORY_KEY]: [] });
  await sock.sendMessage(jid, { text: t(lang, 'help_hello') });
}

export async function handleHelpInput(sock, jid, message) {
  const lang = getLang(jid);
  const text = (message.conversation || message.extendedTextMessage?.text || '').trim();

  if (!text) return;

  // Clear history
  if (text === '2') {
    updateStateData(jid, { [HISTORY_KEY]: [] });
    await sock.sendMessage(jid, { text: t(lang, 'help_cleared') });
    return;
  }

  // Back to menu
  if (text === '0') {
    clearState(jid);
    await sock.sendMessage(jid, { text: t(lang, 'main_menu') });
    return;
  }

  // Contact manager
  if (text === '1') {
    clearState(jid);
    if (MANAGER_PHONE) {
      await sock.sendMessage(jid, {
        text: t(lang, 'manager_phone_prompt', { phone: MANAGER_PHONE }) + '\n\n0 - ' + t(lang, 'main_menu'),
      });
    } else {
      await sock.sendMessage(jid, { text: t(lang, 'manager_transferred') + '\n\n0 - ' + t(lang, 'main_menu') });
    }
    await track(jid, 'manager_contact_shown', lang, { trigger: 'ai_help_button' });
    return;
  }

  // Load conversation history
  const data = getStateData(jid);
  let history = data[HISTORY_KEY] || [];

  history.push({ role: 'user', text });
  if (history.length > MAX_HISTORY_TURNS * 2) {
    history = history.slice(-(MAX_HISTORY_TURNS * 2));
  }

  await track(jid, 'help_message_sent', lang);

  const aiResponse = await askGemini(history, lang);
  history.push({ role: 'model', text: aiResponse });
  updateStateData(jid, { [HISTORY_KEY]: history });

  await sock.sendMessage(jid, { text: aiResponse + '\n\n' + t(lang, 'ai_response_menu') });
}
