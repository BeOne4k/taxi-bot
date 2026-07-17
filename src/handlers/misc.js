import { getLang } from '../utils/userData.js';
import { t } from '../locales/texts.js';
import { track } from '../utils/analytics.js';
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export async function handleAbout(sock, jid) {
  const lang = getLang(jid);
  await track(jid, 'about_opened', lang);
  // await sock.sendMessage(jid, { text: t(lang, 'about_text') });
  await sendAbout(sock, jid);
}



// Соответствие языка бота и суффикса в имени файла картинки.
// Английские картинки без суффикса, русские — "_ru", тайские — "_thai".
const LANG_SUFFIXES = { ru: "_ru", th: "_thai" };

export async function sendAbout(sock, jid) {
  const PROJECT_ROOT = path.resolve(__dirname, "../..");
  const imagesDir = path.join(PROJECT_ROOT, "data", "images");
  const lang = getLang(jid);
  const suffix = LANG_SUFFIXES[lang] || "";

  const baseNames = [
    "taxi-affiliate-project-1-2",
    "taxi-affiliate-project-3-4",
    "taxi-affiliate-project-5-6",
  ];

  const imgPaths = baseNames.map((baseName) => {
    const localized = path.join(imagesDir, `${baseName}${suffix}.jpg`);
    // Если локализованной картинки нет — подстрахуемся английской версией
    if (suffix && fs.existsSync(localized)) return localized;
    return path.join(imagesDir, `${baseName}.jpg`);
  });

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
