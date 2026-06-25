import { getLang, setState, getState, clearState } from '../utils/userData.js';
import { t } from '../locales/texts.js';
import { track } from '../utils/analytics.js';
import { askAi } from '../utils/ai.js';
import { MANAGER_WA_JID, MANAGER_USERNAME, MANAGER_WORK_START, MANAGER_WORK_END, TZ_OFFSET_HOURS } from '../config.js';

function isManagerOnline() {
  const now = new Date(Date.now() + TZ_OFFSET_HOURS * 3600 * 1000);
  const hour = now.getUTCHours();
  return hour >= MANAGER_WORK_START && hour < MANAGER_WORK_END;
}

async function notifyManager(sock, user, userText, lang) {
  if (!MANAGER_WA_JID) {
    console.warn('[Manager] MANAGER_WA_JID not set, cannot notify manager');
    return;
  }
  try {
    const text = `🔔 *New message from user*\nUser: ${user.jid} (lang: ${lang})\n\nMessage:\n${userText}`;
    await sock.sendMessage(MANAGER_WA_JID, { text });
  } catch (err) {
    console.error('[Manager] notifyManager error:', err.message);
  }
}

export async function handleManagerMenu(sock, jid) {
  const lang = getLang(jid);
  await track(jid, 'manager_started', lang);
  setState(jid, 'manager:chatting');

  if (!isManagerOnline()) {
    await sock.sendMessage(jid, { text: t(lang, 'manager_offline') });
  } else {
    await sock.sendMessage(jid, { text: t(lang, 'manager_hello') });
  }
}

export async function handleManagerInput(sock, jid, message) {
  const lang = getLang(jid);
  const text = (message.conversation || message.extendedTextMessage?.text || '').trim();

  if (!text) return;

  // Transfer to human
  if (text === '1') {
    await sock.sendMessage(jid, { text: t(lang, 'manager_transfer') });
    await notifyManager(sock, { jid }, 'User requested human agent.', lang);
    await track(jid, 'manager_transferred', lang);

    let response;
    if (MANAGER_USERNAME) {
      response = t(lang, 'manager_username_prompt', { username: MANAGER_USERNAME });
    } else {
      response = t(lang, 'manager_transferred');
    }
    clearState(jid);
    await sock.sendMessage(jid, { text: response + '\n\n0 - ' + t(lang, 'main_menu') });
    return;
  }

  // Back to menu
  if (text === '0') {
    clearState(jid);
    await sock.sendMessage(jid, { text: t(lang, 'main_menu') });
    return;
  }

  if (!isManagerOnline()) {
    await notifyManager(sock, { jid }, text, lang);
    await track(jid, 'manager_message_left', lang);
    clearState(jid);
    await sock.sendMessage(jid, { text: t(lang, 'manager_left_message') });
    return;
  }

  // Try AI first
  const aiResponse = await askAi(text, lang);

  if (aiResponse.includes('[TRANSFER_TO_HUMAN]')) {
    await sock.sendMessage(jid, { text: t(lang, 'manager_transfer') });
    await notifyManager(sock, { jid }, text, lang);
    await track(jid, 'manager_transferred', lang, { trigger: 'ai_escalation' });
    clearState(jid);

    let response;
    if (MANAGER_USERNAME) {
      response = t(lang, 'manager_username_prompt', { username: MANAGER_USERNAME });
    } else {
      response = t(lang, 'manager_transferred');
    }
    await sock.sendMessage(jid, { text: response + '\n\n0 - ' + t(lang, 'main_menu') });
  } else {
    await sock.sendMessage(jid, { text: aiResponse + '\n\n' + t(lang, 'btn_transfer_manager_text') + '\n0 - ' + t(lang, 'main_menu') });
  }
}
