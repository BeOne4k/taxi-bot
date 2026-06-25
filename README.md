# WeedeN Taxi WhatsApp Bot (JS)

Полный аналог Telegram-бота WeedeN на WhatsApp, написанный на Node.js с использованием [Baileys](https://github.com/WhiskeySockets/Baileys).

## Функции (1 в 1 с Telegram-ботом)

| Функция | Telegram | WhatsApp |
|---|---|---|
| Выбор языка (EN / RU / TH) | ✅ | ✅ |
| Главное меню | ✅ | ✅ |
| Поиск ближайшего магазина по геолокации | ✅ | ✅ |
| Поиск магазина по региону (текстом) | ✅ | ✅ |
| Регистрация такси-партнёра (FSM) | ✅ | ✅ |
| OTP через Twilio SMS | ✅ | ✅ |
| Подключение к Odoo CRM | ✅ | ✅ |
| AI-ассистент (Claude Haiku) с эскалацией | ✅ | ✅ |
| Чат-бот помощи (Gemini) с историей диалога | ✅ | ✅ |
| Уведомление менеджера в WhatsApp | ✅ | ✅ |
| Вебхук от Odoo (покупка → спасибо + retention) | ✅ | ✅ |
| Аналитика (GA4 + Meta CAPI) | ✅ | ✅ |
| Привязка телефона → JID (реестр) | ✅ | ✅ |
| BotsAPI интеграция | ✅ | ✅ |

## Установка

```bash
cd wdn-whatsapp-bot
npm install
cp .env.example .env
# Заполните .env своими ключами
npm start
```

При первом запуске в терминале появится QR-код — отсканируйте его WhatsApp-приложением (Связанные устройства).

## Структура проекта

```
src/
  index.js              # Точка входа, роутинг сообщений
  config.js             # Все переменные из .env
  webhookApi.js         # Express-сервер для вебхуков от Odoo
  handlers/
    start.js            # Старт, выбор языка, главное меню
    stores.js           # Поиск магазинов
    loyalty.js          # Регистрация (FSM)
    manager.js          # Чат с менеджером (AI + эскалация)
    help.js             # Gemini AI помощник
    misc.js             # О компании, соцсети
  utils/
    userData.js         # Состояние пользователя (in-memory FSM)
    odoo.js             # Odoo CRM API
    otp.js              # Генерация и проверка OTP (Twilio)
    ai.js               # Claude AI (FAQ / эскалация)
    gemini.js           # Gemini AI (диалог с историей)
    stores.js           # Поиск магазинов по гео / региону
    chatRegistry.js     # phone → WA JID (JSON persistence)
    apiClient.js        # BotsAPI
    analytics.js        # GA4 + Meta CAPI
  locales/
    texts.js            # Все тексты (EN / RU / TH)
data/
  stores.json           # База магазинов
  whatsapp_registry.json  # Реестр phone → JID
  gemini_instructions.txt # Системный промпт для Gemini
```

## Навигация по боту (текстовые команды)

В WhatsApp нет inline-кнопок как в Telegram, поэтому вместо кнопок пользователь отвечает цифрами:

| Команда | Действие |
|---|---|
| `/start` | Перезапуск бота |
| `1` | Найти ближайший магазин |
| `2` | Регистрация (лояльность/такси) |
| `3` | Помощь (Gemini AI) |
| `4` | О компании |
| `5` | Соцсети |
| `6` | Сменить язык |
| `0` | Назад / главное меню |

## Вебхук от Odoo

```
POST http://your-server:8080/odoo/purchase
X-API-Key: <WEBHOOK_SECRET>

{
  "phone": "+66812345678",
  "customer_name": "Иван",
  "product_name": "WeedeN Gold",
  "order_id": "SO-1234",
  "lang": "ru"
}
```

Бот отправит пользователю «спасибо» через 10 минут и retention-сообщение через 24 часа.

## Переменные окружения

Смотрите `.env.example` — все параметры прокомментированы.
