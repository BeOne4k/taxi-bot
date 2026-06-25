import 'dotenv/config';

export const ODOO_URL = process.env.ODOO_URL || '';
export const ODOO_API_TOKEN = process.env.ODOO_API_TOKEN || '';

export const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || '';
export const WEBHOOK_PORT = parseInt(process.env.WEBHOOK_PORT || '8080', 10);
export const THANK_YOU_DELAY_SECONDS = parseInt(process.env.THANK_YOU_DELAY_SECONDS || '600', 10);
export const RETENTION_DELAY_SECONDS = parseInt(process.env.RETENTION_DELAY_SECONDS || '86400', 10);

export const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

export const MANAGER_WA_JID = process.env.MANAGER_WA_JID || '';
export const MANAGER_USERNAME = process.env.MANAGER_USERNAME || '';
export const MANAGER_WORK_START = parseInt(process.env.MANAGER_WORK_START || '10', 10);
export const MANAGER_WORK_END = parseInt(process.env.MANAGER_WORK_END || '18', 10);

export const SOCIALS_URL = process.env.SOCIALS_URL || 'https://www.instagram.com/weedenthailand/';

export const GA4_MEASUREMENT_ID = process.env.GA4_MEASUREMENT_ID || '';
export const GA4_API_SECRET = process.env.GA4_API_SECRET || '';

export const META_ADS_PIXEL_ID = process.env.META_ADS_PIXEL_ID || '';
export const META_ADS_ACCESS_TOKEN = process.env.META_ADS_ACCESS_TOKEN || '';

export const BOTS_API_URL = process.env.BOTS_API_URL || '';
export const BOTS_API_KEY = process.env.BOTS_API_KEY || '';

export const TWILIO_PHONE = process.env.TWILIO_PHONE || '';
export const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || '';
export const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || '';
export const TWILIO_MESSAGING_SERVICE_SID = process.env.TWILIO_MESSAGING_SERVICE_SID || '';

// TZ offset for manager hours check (UTC+7 Bangkok)
export const TZ_OFFSET_HOURS = 7;
