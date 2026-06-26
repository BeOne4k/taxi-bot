export const TEXTS = {
  en: {
    welcome: '👋 Welcome! Please choose your language:\n\n1️⃣ English\n2️⃣ Русский\n3️⃣ ภาษาไทย\n\nReply with the number of your choice.',
    lang_set: '✅ Language set to English.',
    main_menu: '🏠 *Main Menu*\nChoose an option:\n\n1️⃣ 📍 Find nearest store\n2️⃣ 🚖 Registration\n3️⃣ 🤖 Help (AI Assistant)\n4️⃣ ℹ️ About program\n5️⃣ 📲 Our socials\n6️⃣ 🌐 Change language\n\nReply with a number.',
    btn_stores: '1',
    btn_loyalty: '2',
    btn_help: '3',
    btn_about: '4',
    btn_socials: '5',
    btn_change_lang: '6',
    btn_main_menu: '0',
    btn_back: '0',
    btn_send_geo: 'Please share your location (use the 📎 attachment button in WhatsApp → Location).',
    btn_choose_region: '2',
    btn_how_to_use: '1',
    btn_find_store: '1',
    btn_yes: '1',
    btn_no: '2',
    btn_transfer_manager: '1',
    btn_help_clear: '2',
    btn_open_maps: '🗺',

    loading: '⏳ Processing...',

    loyalty_hint: (
      'Hello! 👋 Welcome to WeedeN — one of the leading Thai brands in healthy lifestyle and cannabis-based wellness. ' +
      'We have 56+ stores all over Thailand: Bangkok, Phuket, Samui, Pattaya, and other cities.\n' +
      'Choose what you are interested in 👇'
    ),

    loyalty_start_no_card_text: (
      '🚖 *Taxi affiliate*\n\n' +
      'Register to start earning! Enter your phone number in international format:\n' +
      'Example: +66812345678'
    ),
    loyalty_already_have_card_text: (
      'Here is your card 🎁\n' +
      'Card number: `{card_number}`\n' +
      'Show the barcode at the checkout or tell them your number — both options work.'
    ),
    how_to_use_loyalty: (
      "It's simple 👌\n" +
      'Come to the checkout at any WeedeN store\n' +
      'Show your barcode or say your card number\n' +
      'The cashier will apply your discount — up to 30% off your entire receipt\n' +
      'The card works in all 56+ stores across Thailand.\n\n' +
      'Reply *0* to return to main menu.'
    ),
    btn_how_to_use_text: '1 - How to use the card\n0 - Main menu',

    loyalty_phone_invalid: '❌ Invalid phone number. Please use international format, e.g. +66812345678',
    loyalty_otp_sent: '📱 OTP code sent to *{phone}*\n\nPlease enter the 6-digit code:',
    loyalty_otp_invalid: '❌ Invalid OTP code. Please try again.',
    loyalty_otp_attempts: '❌ Too many failed attempts. Type *0* to return to main menu.',
    loyalty_ask_name: '✅ Phone verified!\n\nPlease enter your full name:',
    loyalty_name_invalid: '❌ Please enter your real full name (at least 2 characters):',
    loyalty_ask_tourist: '🌍 Are you visiting as a tourist?\n\n1 - Yes\n2 - No',
    loyalty_ask_thai_citizen: '🇹🇭 Are you a Thai citizen?\n\n1 - Yes\n2 - No',
    loyalty_crm_error: '⚠️ A technical error occurred. Please try again later or contact our manager.\n\nType *0* to return to main menu.',
    loyalty_ask_country: '🌍 Please enter your country (e.g. Thailand, Russia, USA):',
    taxi_thank_you: 'Thank you. Visit your nearest WeedeN store and get your personal affiliate card.\n\nType *0* to return to main menu.',

    loyalty_success: (
      '🎉 *Registration successful!*\n\n' +
      '📱 Phone: {phone}\n' +
      '🏷 Your loyalty card barcode: `{barcode}`\n\n' +
      'Show this code at any of our stores to get your discount!'
    ),
    loyalty_already_exists: (
      '✅ *Welcome back!*\n\n' +
      '📱 Phone: {phone}\n' +
      '🏷 Barcode: `{barcode}`\n\n' +
      'Your information has been updated.'
    ),
    loyalty_existing_card_menu: '1 - ℹ️ How to use the card\n0 - 🏠 Main menu',
    loyalty_no_card_menu: '0 - 🏠 Main menu\n\nOr just type your phone number to register.',

    stores_request_geo: (
      '📍 Find nearest store\n\n' +
      'Please share your location or type your *region* name:\n\n' +
      '📎 Share location via WhatsApp attachment button\n' +
      '_Or type region name (e.g. Phuket, Bangkok, Samui)_'
    ),
    stores_choose_region: 'Please type the name of your region (e.g. Phuket, Bangkok, Samui, Pattaya):',
    stores_not_found: '😕 There are no stores near you right now. Try typing a region name (e.g. Phuket).\n\nType *0* for main menu.',
    no_shops: '😕 No stores found nearby. Try typing a region name.\n\nType *0* for main menu.',
    no_shops_region: '😔 No stores found in that region.\n\nType *0* for main menu.',
    stores_result: '📍 *Nearest stores ({count} found):*',
    btn_open_maps_text: '🗺 Google Maps: {url}',
    store_card: '🏪 *{name}*\n📍 {address}\n🕐 {hours}\n📏 {distance} km from you',
    store_card_no_hours: '🏪 *{name}*\n📍 {address}\n📏 {distance} km from you',
    store_card_region: '🏪 *{name}*\n📍 {address}\n🕐 {hours}',
    store_card_region_no_hours: '🏪 *{name}*\n📍 {address}',
    km: 'km from you',

    manager_hello: (
      '💬 *Manager Chat*\n\n' +
      'Our AI assistant will help you first.\n' +
      'Type your question:\n\n' +
      '1 - Talk to a human\n' +
      '0 - Main menu'
    ),
    manager_offline: (
      '🕐 Our managers work from 10:00 to 18:00.\n\n' +
      'You can leave a message and we\'ll get back to you:\n\n' +
      '0 - Main menu'
    ),
    manager_transfer: '🔄 Transferring you to a live manager...',
    manager_transferred: '✅ A manager will respond shortly. Please wait.\n\nType *0* to return to main menu.',
    manager_phone_prompt: '👤 You can contact our manager directly on WhatsApp: {phone}\n\nType *0* for main menu.',
    manager_left_message: '✅ Your message has been saved. We\'ll contact you soon!\n\nType *0* for main menu.',
    btn_transfer_manager_text: '1 - Talk to a human',
    ai_error: '⚠️ AI assistant is temporarily unavailable. Connecting you to a manager...',
    ai_response_menu: '1 - Talk to a human\n2 - 🗑 Clear chat history\n0 - 🏠 Main menu',

    help_hello: (
      '🤖 *AI Assistant*\n\n' +
      'Welcome! Ask us any question and we\'ll reply quickly!\n' +
      'Type anything to get started!\n\n' +
      '2 - 🗑 Clear chat history\n' +
      '0 - 🏠 Main menu'
    ),
    help_cleared: '✅ Conversation cleared. Let\'s start fresh!\n\nType your question or *0* for main menu.',
    help_keyboard: '2 - 🗑 Clear chat history\n0 - 🏠 Main menu',

    about_text: (
      'ℹ️ *About Us*\n\n' +
      'WeedeN is the largest network of cannabis shops in Thailand 🌿\n\n' +
      '56+ stores in key locations: Bangkok, Phuket, Samui, Pattaya, and other cities. ' +
      'We are building a modern and healthy cannabis culture — quality products, friendly service, ' +
      'and a loyalty program with real discounts up to 30%.\n' +
      '🔗 Website: weeden.club\n\n' +
      'Type *0* to return to main menu.'
    ),

    socials_text: '📲 Our instagram page: https://www.instagram.com/weedenthailand/\n\nType *0* to return to main menu.',

    error_generic: '⚠️ Something went wrong. Please try again.\n\nType *0* for main menu.',
    no_shops_found: "We're coming in very soon. Guess where?\n\nType *0* for main menu.",

    review_reminder: '🙏 Thank you for your purchase!\n\nWe\'d love to hear your feedback — it takes less than a minute and helps us improve. Your opinion matters! 💬',
    retention_message: (
      'Thank you for trying WeedeN products! 🌿\n\n' +
      'Now is the perfect time to discover new favorites — we\'ve just added some items ' +
      'that are definitely worth a second visit. Come by and check them out!'
    ),
  },

  ru: {
    welcome: '👋 Добро пожаловать! Пожалуйста, выберите язык:\n\n1️⃣ English\n2️⃣ Русский\n3️⃣ ภาษาไทย\n\nОтветьте цифрой.',
    lang_set: '✅ Язык установлен: Русский.',
    main_menu: '🏠 *Главное меню*\nВыберите раздел:\n\n1️⃣ 📍 Найти ближайший магазин\n2️⃣ 🚖 Регистрация\n3️⃣ 🤖 Помощь (ИИ-ассистент)\n4️⃣ ℹ️ О программе\n5️⃣ 📲 Наши соцсети\n6️⃣ 🌐 Сменить язык\n\nОтветьте цифрой.',
    btn_stores: '1',
    btn_loyalty: '2',
    btn_help: '3',
    btn_about: '4',
    btn_socials: '5',
    btn_change_lang: '6',
    btn_main_menu: '0',
    btn_back: '0',
    btn_send_geo: 'Отправьте геолокацию через кнопку 📎 в WhatsApp → Местоположение.',
    btn_choose_region: '2',
    btn_how_to_use: '1',
    btn_find_store: '1',
    btn_yes: '1',
    btn_no: '2',
    btn_transfer_manager: '1',
    btn_help_clear: '2',

    loading: '⏳ Загрузка...',

    loyalty_hint: (
      'Привет! 👋 Добро пожаловать в WeedeN — один из ведущих тайских брендов в сфере здорового образа жизни. ' +
      'У нас 56+ магазинов по всему Таиланду: Бангкок, Пхукет, Самуи, Паттайя и другие города.\n' +
      'Выбери, что тебя интересует 👇'
    ),

    loyalty_start_no_card_text: (
      '🚖 *Партнер такси*\n\n' +
      'Зарегистрируйтесь, чтобы начать зарабатывать! Введите номер телефона в международном формате:\n' +
      'Пример: +66812345678'
    ),
    loyalty_already_have_card_text: (
      'Вот ваша карта 🎁\n' +
      'Номер карты: `{card_number}`\n' +
      'Покажите штрихкод на кассе или назовите номер — оба варианта работают.'
    ),
    how_to_use_loyalty: (
      'Всё просто 👌\n' +
      'Подходите к кассе в любом магазине WeedeN\n' +
      'Покажите штрихкод или назовите номер карты\n' +
      'Кассир применит скидку — до 30% на всю сумму чека\n' +
      'Карта работает во всех 56+ магазинах по всему Таиланду.\n\n' +
      'Напишите *0* для возврата в главное меню.'
    ),
    btn_how_to_use_text: '1 - Как использовать карту\n0 - Главное меню',

    loyalty_phone_invalid: '❌ Неверный номер телефона. Используйте международный формат, например +79123456789',
    loyalty_otp_sent: '📱 Код OTP отправлен на *{phone}*\n\nВведите 6-значный код:',
    loyalty_otp_invalid: '❌ Неверный код OTP. Попробуйте ещё раз.',
    loyalty_otp_attempts: '❌ Слишком много неверных попыток. Напишите *0* для возврата в меню.',
    loyalty_ask_name: '✅ Телефон подтверждён!\n\nВведите ваше полное имя:',
    loyalty_name_invalid: '❌ Введите настоящее имя (минимум 2 символа):',
    loyalty_ask_tourist: '🌍 Вы приехали как турист?\n\n1 - Да\n2 - Нет',
    loyalty_ask_thai_citizen: '🇹🇭 Вы гражданин Таиланда?\n\n1 - Да\n2 - Нет',
    loyalty_crm_error: '⚠️ Произошла техническая ошибка. Попробуйте позже или обратитесь к менеджеру.\n\nНапишите *0* для возврата в меню.',
    loyalty_ask_country: '🌍 Введите вашу страну (например, Россия, Украина, Беларусь):',
    taxi_thank_you: 'Спасибо. Придите в ближайший магазин WeedeN и получите вашу партнёрскую карту.\n\nНапишите *0* для возврата в меню.',

    loyalty_success: (
      '🎉 *Регистрация прошла успешно!*\n\n' +
      '📱 Телефон: {phone}\n' +
      '🏷 Штрихкод карты: `{barcode}`\n\n' +
      'Покажите этот код в магазине для получения скидки!'
    ),
    loyalty_already_exists: (
      '✅ *С возвращением!*\n\n' +
      '📱 Телефон: {phone}\n' +
      '🏷 Штрихкод: `{barcode}`\n\n' +
      'Ваши данные обновлены.'
    ),
    loyalty_existing_card_menu: '1 - ℹ️ Как использовать карту\n0 - 🏠 Главное меню',
    loyalty_no_card_menu: '0 - 🏠 Главное меню\n\nИли просто введите ваш номер телефона для регистрации.',

    stores_request_geo: (
      '📍 Поиск ближайшего магазина\n\n' +
      'Отправьте геолокацию или введите название региона:\n\n' +
      '📎 Отправить через кнопку прикрепления в WhatsApp → Местоположение\n' +
      '_Или введите регион (например: Пхукет, Бангкок, Самуи)_'
    ),
    stores_choose_region: 'Введите название вашего региона (например: Phuket, Bangkok, Samui, Pattaya):',
    stores_not_found: '😕 Рядом с вами нет наших магазинов. Попробуйте ввести название региона (например: Phuket).\n\nНапишите *0* для меню.',
    no_shops: '😕 Магазинов поблизости не найдено. Попробуйте ввести регион.\n\nНапишите *0* для меню.',
    no_shops_region: '😔 Магазинов в данном регионе не найдено.\n\nНапишите *0* для меню.',
    stores_result: '📍 *Ближайшие магазины (найдено: {count}):*',
    btn_open_maps_text: '🗺 Google Maps: {url}',
    store_card: '🏪 *{name}*\n📍 {address}\n🕐 {hours}\n📏 {distance} км от вас',
    store_card_no_hours: '🏪 *{name}*\n📍 {address}\n📏 {distance} км от вас',
    store_card_region: '🏪 *{name}*\n📍 {address}\n🕐 {hours}',
    store_card_region_no_hours: '🏪 *{name}*\n📍 {address}',
    km: 'км от вас',

    manager_hello: (
      '💬 *Чат с менеджером*\n\n' +
      'Сначала вам ответит ИИ-ассистент.\n' +
      'Напишите ваш вопрос:\n\n' +
      '1 - Связаться с человеком\n' +
      '0 - Главное меню'
    ),
    manager_offline: (
      '🕐 Менеджеры работают с 10:00 до 18:00.\n\n' +
      'Вы можете оставить сообщение, и мы свяжемся с вами:\n\n' +
      '0 - Главное меню'
    ),
    manager_transfer: '🔄 Передаём вас живому менеджеру...',
    manager_transferred: '✅ Менеджер скоро ответит. Пожалуйста, подождите.\n\nНапишите *0* для возврата в меню.',
    manager_phone_prompt: '👤 Вы можете написать нашему менеджеру напрямую в WhatsApp: {phone}\n\nНапишите *0* для меню.',
    manager_left_message: '✅ Ваше сообщение сохранено. Мы свяжемся с вами в ближайшее время!\n\nНапишите *0* для меню.',
    btn_transfer_manager_text: '1 - Связаться с человеком',
    ai_error: '⚠️ ИИ-ассистент временно недоступен. Соединяем с менеджером...',
    ai_response_menu: '1 - Связаться с человеком\n2 - 🗑 Очистить историю\n0 - 🏠 Главное меню',

    help_hello: (
      '🤖 *ИИ-ассистент*\n\n' +
      'Приветствуем! Задайте любой вопрос — ответим быстро!\n' +
      'Напишите что-нибудь для начала!\n\n' +
      '2 - 🗑 Очистить историю\n' +
      '0 - 🏠 Главное меню'
    ),
    help_cleared: '✅ История очищена. Начнём заново!\n\nНапишите вопрос или *0* для меню.',
    help_keyboard: '2 - 🗑 Очистить историю\n0 - 🏠 Главное меню',

    about_text: (
      'ℹ️ *О компании*\n\n' +
      'WeedeN — крупнейшая сеть cannabis-шопов в Таиланде 🌿\n\n' +
      '56+ магазинов: Бангкок, Пхукет, Самуи, Паттайя и другие города. ' +
      'Мы строим современную cannabis-культуру — качественные продукты, дружелюбный сервис ' +
      'и программа лояльности со скидками до 30%.\n' +
      '🔗 Сайт: weeden.club\n\n' +
      'Напишите *0* для возврата в меню.'
    ),

    socials_text: '📲 Наш инстаграм: https://www.instagram.com/weedenthailand/\n\nНапишите *0* для возврата в меню.',

    error_generic: '⚠️ Что-то пошло не так. Попробуйте ещё раз.\n\nНапишите *0* для меню.',
    no_shops_found: 'Мы скоро откроемся здесь. Угадайте, где?\n\nНапишите *0* для меню.',

    review_reminder: '🙏 Благодарим за покупку!\n\nПожалуйста, оставьте отзыв — это займёт меньше минуты и поможет нам стать лучше. Ваше мнение важно! 💬',
    retention_message: (
      'Спасибо за то, что уже попробовали продукты WeedeN! 🌿\n\n' +
      'Самое время открыть для себя новые фавориты — у нас появились позиции, ' +
      'которые точно стоят второго визита. Приходите!'
    ),
  },

  th: {
    welcome: '👋 ยินดีต้อนรับ! กรุณาเลือกภาษา:\n\n1️⃣ English\n2️⃣ Русский\n3️⃣ ภาษาไทย\n\nตอบด้วยตัวเลข',
    lang_set: '✅ ตั้งค่าภาษาเป็นภาษาไทยแล้ว',
    main_menu: '🏠 *เมนูหลัก*\nเลือกหัวข้อ:\n\n1️⃣ 📍 ค้นหาร้านใกล้เคียง\n2️⃣ 🚖 การลงทะเบียน\n3️⃣ 🤖 ช่วยเหลือ (AI)\n4️⃣ ℹ️ เกี่ยวกับโปรแกรม\n5️⃣ 📲 โซเชียลมีเดีย\n6️⃣ 🌐 เปลี่ยนภาษา\n\nตอบด้วยตัวเลข',
    btn_stores: '1',
    btn_loyalty: '2',
    btn_help: '3',
    btn_about: '4',
    btn_socials: '5',
    btn_change_lang: '6',
    btn_main_menu: '0',
    btn_back: '0',
    btn_send_geo: 'กรุณาแชร์ตำแหน่งผ่านปุ่ม 📎 ใน WhatsApp → ตำแหน่ง',
    btn_choose_region: '2',
    btn_how_to_use: '1',
    btn_find_store: '1',
    btn_yes: '1',
    btn_no: '2',
    btn_transfer_manager: '1',
    btn_help_clear: '2',

    loading: '⏳ กำลังโหลด',

    loyalty_hint: (
      'สวัสดี! 👋 ยินดีต้อนรับสู่ WeedeN — หนึ่งในแบรนด์ชั้นนำด้านไลฟ์สไตล์เพื่อสุขภาพ ' +
      'เรามีร้านค้ากว่า 56 สาขาทั่วประเทศไทย: กรุงเทพฯ ภูเก็ต สมุย พัทยา และเมืองอื่นๆ\n' +
      'เลือกสิ่งที่คุณสนใจด้านล่าง 👇'
    ),

    loyalty_start_no_card_text: (
      '🚖 *พันธมิตรแท็กซี่*\n\n' +
      'ลงทะเบียนเพื่อเริ่มสร้างรายได้! กรุณาป้อนหมายเลขโทรศัพท์ในรูปแบบสากล:\n' +
      'ตัวอย่าง: +66812345678'
    ),
    loyalty_already_have_card_text: (
      'นี่คือบัตรของคุณ 🎁\n' +
      'หมายเลขบัตร: `{card_number}`\n' +
      'แสดงบาร์โค้ดที่จุดชำระเงินหรือแจ้งหมายเลขบัตร — ใช้ได้ทั้งสองวิธี'
    ),
    how_to_use_loyalty: (
      'ง่ายๆ เพียง 👌\n' +
      'ไปที่จุดชำระเงินในร้าน WeedeN สาขาใดก็ได้\n' +
      'แสดงบาร์โค้ดหรือแจ้งหมายเลขบัตร\n' +
      'พนักงานแคชเชียร์จะใช้ส่วนลด — สูงสุด 30%\n' +
      'บัตรนี้ใช้ได้กับร้านค้ากว่า 56 สาขาทั่วประเทศไทย\n\n' +
      'พิมพ์ *0* เพื่อกลับสู่เมนูหลัก'
    ),
    btn_how_to_use_text: '1 - วิธีการใช้บัตร\n0 - เมนูหลัก',

    loyalty_phone_invalid: '❌ หมายเลขโทรศัพท์ไม่ถูกต้อง กรุณาใช้รูปแบบสากล เช่น +66812345678',
    loyalty_otp_sent: '📱 ส่งรหัส OTP ไปยัง *{phone}* แล้ว\n\nกรุณาใส่รหัส 6 หลัก:',
    loyalty_otp_invalid: '❌ รหัส OTP ไม่ถูกต้อง กรุณาลองอีกครั้ง',
    loyalty_otp_attempts: '❌ ลองผิดพลาดหลายครั้งเกินไป พิมพ์ *0* เพื่อกลับสู่เมนู',
    loyalty_ask_name: '✅ ยืนยันเบอร์โทรแล้ว!\n\nกรุณาใส่ชื่อ-นามสกุล:',
    loyalty_name_invalid: '❌ กรุณาใส่ชื่อจริง (อย่างน้อย 2 ตัวอักษร):',
    loyalty_ask_tourist: '🌍 คุณมาในฐานะนักท่องเที่ยวใช่ไหม?\n\n1 - ใช่\n2 - ไม่ใช่',
    loyalty_ask_thai_citizen: '🇹🇭 คุณเป็นพลเมืองไทยหรือไม่?\n\n1 - ใช่\n2 - ไม่ใช่',
    loyalty_crm_error: '⚠️ เกิดข้อผิดพลาด กรุณาลองใหม่ภายหลังหรือติดต่อผู้จัดการ\n\nพิมพ์ *0* เพื่อกลับสู่เมนู',
    loyalty_ask_country: '🌍 กรุณาใส่ประเทศของคุณ (เช่น Thailand, Russia):',
    taxi_thank_you: 'ขอบคุณ แวะไปที่ร้าน WeedeN สาขาใกล้บ้านและรับบัตรพันธมิตรส่วนตัวได้เลย\n\nพิมพ์ *0* เพื่อกลับสู่เมนู',

    loyalty_success: (
      '🎉 *ลงทะเบียนสำเร็จ!*\n\n' +
      '📱 เบอร์โทร: {phone}\n' +
      '🏷 บาร์โค้ดบัตร: `{barcode}`\n\n' +
      'แสดงรหัสนี้ที่ร้านเพื่อรับส่วนลด!'
    ),
    loyalty_already_exists: (
      '✅ *ยินดีต้อนรับกลับมา!*\n\n' +
      '📱 เบอร์โทร: {phone}\n' +
      '🏷 บาร์โค้ด: `{barcode}`\n\n' +
      'อัปเดตข้อมูลของคุณแล้ว'
    ),
    loyalty_existing_card_menu: '1 - ℹ️ วิธีการใช้บัตร\n0 - 🏠 เมนูหลัก',
    loyalty_no_card_menu: '0 - 🏠 เมนูหลัก\n\nหรือพิมพ์หมายเลขโทรศัพท์เพื่อลงทะเบียน',

    stores_request_geo: (
      '📍 ค้นหาร้านใกล้เคียง\n\n' +
      'แชร์ตำแหน่งหรือพิมพ์ชื่อภูมิภาค:\n\n' +
      '📎 แชร์ผ่านปุ่มแนบไฟล์ใน WhatsApp → ตำแหน่ง\n' +
      '_หรือพิมพ์ชื่อภูมิภาค (เช่น Phuket, Bangkok, Samui)_'
    ),
    stores_choose_region: 'พิมพ์ชื่อภูมิภาคของคุณ (เช่น Phuket, Bangkok, Samui, Pattaya):',
    stores_not_found: '😕 ไม่มีร้านค้าใกล้คุณ ลองพิมพ์ชื่อภูมิภาค (เช่น Phuket)\n\nพิมพ์ *0* สำหรับเมนู',
    no_shops: '😕 ไม่พบร้านค้าใกล้เคียง ลองพิมพ์ชื่อภูมิภาค\n\nพิมพ์ *0* สำหรับเมนู',
    no_shops_region: '😔 ไม่พบร้านค้าในภูมิภาคนั้น\n\nพิมพ์ *0* สำหรับเมนู',
    stores_result: '📍 *ร้านค้าใกล้เคียง (พบ {count} แห่ง):*',
    btn_open_maps_text: '🗺 Google Maps: {url}',
    store_card: '🏪 *{name}*\n📍 {address}\n🕐 {hours}\n📏 {distance} กม. จากคุณ',
    store_card_no_hours: '🏪 *{name}*\n📍 {address}\n📏 {distance} กม. จากคุณ',
    store_card_region: '🏪 *{name}*\n📍 {address}\n🕐 {hours}',
    store_card_region_no_hours: '🏪 *{name}*\n📍 {address}',
    km: 'กม. จากคุณ',

    manager_hello: (
      '💬 *แชทกับผู้จัดการ*\n\n' +
      'AI ผู้ช่วยจะตอบก่อน\n' +
      'พิมพ์คำถามของคุณ:\n\n' +
      '1 - คุยกับคน\n' +
      '0 - เมนูหลัก'
    ),
    manager_offline: (
      '🕐 ผู้จัดการทำงานตั้งแต่ 10:00 ถึง 18:00\n\n' +
      'คุณสามารถฝากข้อความไว้ได้:\n\n' +
      '0 - เมนูหลัก'
    ),
    manager_transfer: '🔄 กำลังโอนไปยังผู้จัดการ...',
    manager_transferred: '✅ ผู้จัดการจะตอบในไม่ช้า กรุณารอสักครู่\n\nพิมพ์ *0* เพื่อกลับสู่เมนู',
    manager_phone_prompt: '👤 ติดต่อผู้จัดการของเราทาง WhatsApp: {phone}\n\nพิมพ์ *0* สำหรับเมนู',
    manager_left_message: '✅ บันทึกข้อความของคุณแล้ว เราจะติดต่อกลับโดยเร็ว!\n\nพิมพ์ *0* สำหรับเมนู',
    btn_transfer_manager_text: '1 - คุยกับคน',
    ai_error: '⚠️ AI ไม่พร้อมใช้งานชั่วคราว กำลังเชื่อมต่อกับผู้จัดการ...',
    ai_response_menu: '1 - คุยกับคน\n2 - 🗑 ล้างประวัติ\n0 - 🏠 เมนูหลัก',

    help_hello: (
      '🤖 *AI ผู้ช่วย*\n\n' +
      'ยินดีต้อนรับ! ถามคำถามได้เลย!\n' +
      'พิมพ์อะไรก็ได้เพื่อเริ่มต้น!\n\n' +
      '2 - 🗑 ล้างประวัติ\n' +
      '0 - 🏠 เมนูหลัก'
    ),
    help_cleared: '✅ ล้างการสนทนาแล้ว เริ่มใหม่กันเลย!\n\nพิมพ์คำถามหรือ *0* สำหรับเมนู',
    help_keyboard: '2 - 🗑 ล้างประวัติ\n0 - 🏠 เมนูหลัก',

    about_text: (
      'ℹ️ *เกี่ยวกับเรา*\n\n' +
      'WeedeN คือเครือข่ายร้านกัญชาที่ใหญ่ที่สุดในประเทศไทย 🌿\n\n' +
      'มีมากกว่า 56 สาขา: กรุงเทพฯ, ภูเก็ต, เกาะสมุย, พัทยา และเมืองอื่นๆ ' +
      'เรากำลังสร้างวัฒนธรรมกัญชาที่ทันสมัยและดีต่อสุขภาพ — สินค้าคุณภาพ บริการเป็นกันเอง ' +
      'และโปรแกรมสะสมแต้มที่ให้ส่วนลดสูงสุด 30%\n' +
      '🔗 เว็บไซต์: weeden.club\n\n' +
      'พิมพ์ *0* เพื่อกลับสู่เมนู'
    ),

    socials_text: '📲 อินสตาแกรมของเรา: https://www.instagram.com/weedenthailand_th/\n\nพิมพ์ *0* เพื่อกลับสู่เมนู',

    error_generic: '⚠️ เกิดข้อผิดพลาด กรุณาลองอีกครั้ง\n\nพิมพ์ *0* สำหรับเมนู',
    no_shops_found: 'เรากำลังจะขยายสาขาไปที่นั่นเร็วๆ นี้!\n\nพิมพ์ *0* สำหรับเมนู',

    review_reminder: '🙏 ขอบคุณสำหรับการซื้อ!\n\nกรุณาฝากรีวิว — ใช้เวลาไม่ถึงนาทีและช่วยให้เราพัฒนาได้ดีขึ้น! 💬',
    retention_message: (
      'ขอบคุณที่ไว้วางใจเลือกใช้ผลิตภัณฑ์ของ WeedeN! 🌿\n\n' +
      'ตอนนี้เป็นเวลาที่เหมาะในการค้นหาสินค้าชิ้นโปรดใหม่ๆ ' +
      'เราเพิ่งมีสินค้าใหม่เข้ามาซึ่งคุ้มค่ากับการกลับมาเยี่ยมชม แล้วแวะมานะ!'
    ),
  },
};

export function t(lang, key, vars = {}) {
  const texts = TEXTS[lang] || TEXTS['en'];
  let text = texts[key] ?? TEXTS['en'][key] ?? key;
  for (const [k, v] of Object.entries(vars)) {
    text = text.replaceAll(`{${k}}`, v);
  }
  return text;
}
