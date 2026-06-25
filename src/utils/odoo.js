import axios from 'axios';
import { ODOO_URL, ODOO_API_TOKEN } from '../config.js';

const LANG_MAP = { en: 'eng', ru: 'ru', th: 'thai' };
const REGISTER_ENDPOINT = `${ODOO_URL}/api/client/register`;

/**
 * Register customer in Odoo CRM.
 * Returns parsed JSON on success, null on error.
 */
export async function registerCustomer({ name, phone, lang, tourist, thaiCitizen, country, email }) {
  const apiLang = LANG_MAP[lang] || 'eng';
  const payload = {
    name,
    phone,
    bot_platform: 'whatsapp',
    lang: apiLang,
    tourist,
    thai_citizen: thaiCitizen,
  };
  if (country) payload.country = country;
  if (email) payload.email = email;

  try {
    const { data } = await axios.post(REGISTER_ENDPOINT, payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ODOO_API_TOKEN}`,
      },
      timeout: 15000,
    });
    return data;
  } catch (err) {
    console.error('[Odoo] registerCustomer error:', err.message);
    return null;
  }
}
