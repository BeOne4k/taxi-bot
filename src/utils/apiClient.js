import axios from 'axios';
import { BOTS_API_URL, BOTS_API_KEY } from '../config.js';

function headers() {
  return { 'X-API-Key': BOTS_API_KEY, 'Content-Type': 'application/json' };
}

async function ensureUser(phone, name = '') {
  if (!BOTS_API_URL || !BOTS_API_KEY) return false;
  try {
    const { status } = await axios.post(
      `${BOTS_API_URL.replace(/\/$/, '')}/users/`,
      { phone, name },
      { headers: headers(), timeout: 10000 },
    );
    return [201, 409].includes(status);
  } catch {
    return false;
  }
}

export async function registerChannel(phone, jid, name = '') {
  if (!BOTS_API_URL || !BOTS_API_KEY) {
    console.warn('[BotsAPI] Not configured, skipping');
    return false;
  }
  await ensureUser(phone, name);
  try {
    const { status } = await axios.post(
      `${BOTS_API_URL.replace(/\/$/, '')}/channels/bind`,
      { phone, channel_type: 'whatsapp', external_id: jid },
      { headers: headers(), timeout: 10000 },
    );
    if ([200, 201].includes(status)) {
      console.log(`[BotsAPI] Bound WA jid=${jid} to phone=${phone}`);
      return true;
    }
    return false;
  } catch (err) {
    console.warn('[BotsAPI] registerChannel error:', err.message);
    return false;
  }
}
