import { getLang } from '../utils/userData.js';
import { t } from '../locales/texts.js';
import { track } from '../utils/analytics.js';
import fs from "fs";
import path from "path";
export async function handleAbout(sock, jid) {
  const lang = getLang(jid);
  await track(jid, 'about_opened', lang);
  // await sock.sendMessage(jid, { text: t(lang, 'about_text') });
  await sendAbout(sock, jid);
}


export async function sendAbout(sock, jid) {
  const PROJECT_ROOT = path.resolve(__dirname, "..");
    const imgPaths = [
        path.join(PROJECT_ROOT, "data", "images", "taxi-affiliate-project-1-2.jpg"),
        path.join(PROJECT_ROOT, "data", "images", "taxi-affiliate-project-3-4.jpg"),
        path.join(PROJECT_ROOT, "data", "images", "taxi-affiliate-project-5-6.jpg"),
    ];

    for (const imgPath of imgPaths) {
        await sock.sendMessage(jid, {
            image: fs.readFileSync(imgPath)
        });
    }

    await sock.sendMessage(jid, {
        text: "👆"
    });
}
export async function handleSocials(sock, jid) {
  const lang = getLang(jid);
  await track(jid, 'socials_opened', lang);
  await sock.sendMessage(jid, { text: t(lang, 'socials_text') });
}
