import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_MESSAGING_SERVICE_SID } from '../config.js';

// In-memory OTP store: { phone: { otp, ts, attempts } }
const otpStore = {};
const OTP_TTL = 300; // 5 minutes
const MAX_ATTEMPTS = 3;

export function generateOtp(phone) {
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  otpStore[phone] = { otp, ts: Date.now(), attempts: 0 };
  console.log(`[OTP] Generated ${otp} for ${phone}`);
  return otp;
}

/**
 * Returns { success: bool, reason: 'ok'|'wrong'|'expired'|'too_many' }
 */
export function verifyOtp(phone, entered) {
  const record = otpStore[phone];
  if (!record) return { success: false, reason: 'expired' };

  const { otp, ts, attempts } = record;

  if ((Date.now() - ts) / 1000 > OTP_TTL) {
    delete otpStore[phone];
    return { success: false, reason: 'expired' };
  }

  if (attempts >= MAX_ATTEMPTS) {
    delete otpStore[phone];
    return { success: false, reason: 'too_many' };
  }

  if (entered.trim() !== otp) {
    otpStore[phone].attempts += 1;
    if (otpStore[phone].attempts >= MAX_ATTEMPTS) {
      delete otpStore[phone];
      return { success: false, reason: 'too_many' };
    }
    return { success: false, reason: 'wrong' };
  }

  delete otpStore[phone];
  return { success: true, reason: 'ok' };
}

export async function sendOtpSms(phone, otp) {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    console.warn('[OTP] Twilio not configured, skipping SMS');
    return false;
  }
  try {
    const { default: twilio } = await import('twilio');
    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    const msg = await client.messages.create({
      to: phone,
      messagingServiceSid: TWILIO_MESSAGING_SERVICE_SID,
      body: `Code: ${otp}. Expires in ${OTP_TTL / 60} min.`,
    });
    console.log(`[OTP] SMS sent to ${phone}, SID: ${msg.sid}`);
    return true;
  } catch (err) {
    console.error(`[OTP] SMS failed for ${phone}:`, err.message);
    return false;
  }
}
