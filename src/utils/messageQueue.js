/**
 * messageQueue.js
 * Оборачивает sock.sendMessage() в последовательную очередь с паузами между
 * сообщениями и имитацией "печатает...". Без этого код в handlers/* шлёт
 * несколько сообщений подряд (циклы по магазинам, 3 картинки в "О нас" и т.д.)
 * без задержек — именно такой "пачечный" паттерн WhatsApp чаще всего
 * помечает как спам и режет ошибкой 463 (rate-overlimit).
 *
 * Это не гарантия против банов (официальный путь — Cloud API), но заметно
 * снижает вероятность рейт-лимита при работе с сервера.
 */

import { setTimeout as sleep } from 'timers/promises';

const MIN_DELAY_MS = parseInt(process.env.MSG_MIN_DELAY_MS || '1500', 10);
const MAX_DELAY_MS = parseInt(process.env.MSG_MAX_DELAY_MS || '3500', 10);
const TYPING_MS_PER_CHAR = parseInt(process.env.MSG_TYPING_MS_PER_CHAR || '30', 10);
const TYPING_MAX_MS = parseInt(process.env.MSG_TYPING_MAX_MS || '3500', 10);

function randomDelay() {
  return MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS);
}

/**
 * Возвращает функцию sendMessage(jid, content) с тем же интерфейсом, что у
 * sock.sendMessage, но с сериализацией (одно сообщение за раз, без параллельной
 * отправки), случайной паузой между сообщениями и имитацией набора текста.
 */
export function createThrottledSender(sock) {
  let queue = Promise.resolve();
  let lastSendAt = 0;

  function send(jid, content) {
    // Приводим все вызовы в единую очередь — даже если несколько handlers
    // вызовут sendMessage "одновременно", реально они уйдут по одному.
    const result = queue.then(() => doSend(jid, content));
    // Не даём отклонённому промису обрушить всю цепочку очереди для следующих сообщений
    queue = result.catch(() => {});
    return result;
  }

  async function doSend(jid, content) {
    const elapsed = Date.now() - lastSendAt;
    const wait = Math.max(0, randomDelay() - elapsed);
    if (wait > 0) await sleep(wait);

    if (content?.text) {
      try {
        await sock.sendPresenceUpdate('composing', jid);
        const typingTime = Math.min(TYPING_MAX_MS, content.text.length * TYPING_MS_PER_CHAR);
        await sleep(typingTime);
        await sock.sendPresenceUpdate('paused', jid);
      } catch {
        // presence update best-effort — не блокируем отправку, если он не прошёл
      }
    }

    try {
      return await sock.sendMessage(jid, content);
    } finally {
      lastSendAt = Date.now();
    }
  }

  return send;
}
