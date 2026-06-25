import axios from 'axios';
import { GA4_MEASUREMENT_ID, GA4_API_SECRET, META_ADS_PIXEL_ID, META_ADS_ACCESS_TOKEN } from '../config.js';

export async function track(jid, eventName, lang, params = {}) {
  const clientId = jid.replace(/[^0-9]/g, '') || 'unknown';

  // GA4
  if (GA4_MEASUREMENT_ID && GA4_API_SECRET) {
    try {
      await axios.post(
        `https://www.google-analytics.com/mp/collect?measurement_id=${GA4_MEASUREMENT_ID}&api_secret=${GA4_API_SECRET}`,
        {
          client_id: clientId,
          events: [{ name: eventName, params: { lang, platform: 'whatsapp', ...params } }],
        },
      );
    } catch (_) {}
  }

  // Meta CAPI
  if (META_ADS_PIXEL_ID && META_ADS_ACCESS_TOKEN) {
    try {
      await axios.post(
        `https://graph.facebook.com/v19.0/${META_ADS_PIXEL_ID}/events?access_token=${META_ADS_ACCESS_TOKEN}`,
        {
          data: [
            {
              event_name: eventName,
              event_time: Math.floor(Date.now() / 1000),
              user_data: { external_id: clientId },
              custom_data: { lang, platform: 'whatsapp', ...params },
            },
          ],
        },
      );
    } catch (_) {}
  }
}
