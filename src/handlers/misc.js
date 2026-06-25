import { getLang } from '../utils/userData.js';
import { t } from '../locales/texts.js';
import { track } from '../utils/analytics.js';

export async function handleAbout(sock, jid) {
  const lang = getLang(jid);
  await track(jid, 'about_opened', lang);
  await sock.sendMessage(jid, { text: t(lang, 'about_text') });
}

export async function handleSocials(sock, jid) {
  const lang = getLang(jid);
  await track(jid, 'socials_opened', lang);
  await sock.sendMessage(jid, { text: t(lang, 'socials_text') });
}
