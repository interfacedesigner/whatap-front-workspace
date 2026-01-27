import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import ky from 'ky';
import { marked } from 'marked';
import mermaid from 'mermaid';

import { createChatbotContent } from './content';
import { aiIconHTML } from './svg';
import './tailwind.css';

// 상수 정의
let BASE_URL = '';
const API_ENDPOINTS = {
  ASK: '/chatbot/api/v1/ask',
  SCREENSHOT: '/chatbot/api/v1/screenshot',
  PROJECT_INFO: '/account/api/v5/project',
  COPILOT: '/chatbot/api/v1/copilot',
};

// 추천 타입 상수
const RECOMMEND_TYPES = {
  MESSAGE: 'message',
  COPILOT: 'copilot',
};

// 디버그 모드 설정
const DEBUG_MODE = false; // 개발 시 true로 설정

// 디버그 로그 함수
function debugLog(...args) {
  if (DEBUG_MODE) {
    console.log('[AI Chatbot Debug]', ...args);
  }
}

function debugError(...args) {
  if (DEBUG_MODE) {
    console.error('[AI Chatbot Debug]', ...args);
  }
}

function debugWarn(...args) {
  if (DEBUG_MODE) {
    console.warn('[AI Chatbot Debug]', ...args);
  }
}

// 지원 언어 목록
const SUPPORTED_LANGUAGES = [
  'ko', // 한국어
  'ja', // 일본어
  'zh', // 중국어(간체)
  'zh-TW', // 대만어(번체)
  'th', // 태국어
  'ms', // 말레이시아어
  'id', // 인도네시아어
  'vi', // 베트남어
  'ar', // 아랍어
  'hi', // 힌두어
  'tr', // 터키어
  'fr', // 프랑스어
  'de', // 독일어
  'en', // 영어
  'es', // 스페인어
  'pl', // 폴란드어
];

// 메시지 다국어 번역
const I18N_MESSAGES = {
  WELCOME: {
    ko: '안녕하세요! AI 상담원입니다. 무엇을 도와드릴까요?',
    ja: 'こんにちは！AIアシスタントです。ご用件をお聞かせください。',
    zh: '您好！我是AI客服，有什么可以帮您？',
    'zh-TW': '您好！我是AI客服，有什麼可以幫您？',
    th: 'สวัสดีค่ะ! ฉันคือ AI ผู้ช่วย ต้องการความช่วยเหลืออะไรคะ?',
    ms: 'Hai! Saya pembantu AI. Ada apa yang boleh saya bantu?',
    id: 'Halo! Saya asisten AI. Ada yang bisa saya bantu?',
    vi: 'Xin chào! Tôi là trợ lý AI. Tôi có thể giúp gì cho bạn?',
    ar: 'مرحبًا! أنا مساعد الذكاء الاصطناعي. كيف يمكنني مساعدتك؟',
    hi: 'नमस्ते! मैं AI सहायक हूँ। मैं आपकी कैसे मदद कर सकता हूँ?',
    tr: 'Merhaba! Ben AI asistanınızım. Size nasıl yardımcı olabilirim?',
    fr: "Bonjour ! Je suis l'assistant IA. Comment puis-je vous aider ?",
    de: 'Hallo! Ich bin Ihr KI-Assistent. Wie kann ich Ihnen helfen?',
    en: 'Hello! I am your AI assistant. How can I help you?',
    es: '¡Hola! Soy el asistente de IA. ¿En qué puedo ayudarte?',
    pl: 'Cześć! Jestem asystentem AI. W czym mogę pomóc?',
  },
  NEW_SESSION: {
    ko: '새로운 대화를 시작합니다. 이전 대화 내용은 참조하지 않습니다.',
    ja: '新しい会話を開始します。以前の内容は参照しません。',
    zh: '开始新对话。不会参考之前的内容。',
    'zh-TW': '開始新對話。不會參考之前的內容。',
    th: 'เริ่มต้นการสนทนาใหม่ ข้อมูลก่อนหน้านี้จะไม่ถูกอ้างอิง',
    ms: 'Memulakan perbualan baru. Kandungan sebelum ini tidak akan dirujuk.',
    id: 'Memulai percakapan baru. Percakapan sebelumnya tidak akan dirujuk.',
    vi: 'Bắt đầu cuộc trò chuyện mới. Nội dung trước đó sẽ không được tham chiếu.',
    ar: 'بدء محادثة جديدة. لن يتم الرجوع إلى المحادثات السابقة.',
    hi: 'नई बातचीत शुरू हो रही है। पिछली बातचीत का संदर्भ नहीं लिया जाएगा।',
    tr: 'Yeni bir sohbet başlatılıyor. Önceki konuşmalar dikkate alınmaz.',
    fr: 'Nouvelle conversation commencée. Les messages précédents ne seront pas pris en compte.',
    de: 'Neues Gespräch gestartet. Frühere Inhalte werden nicht berücksichtigt.',
    en: 'Starting a new conversation. Previous messages will not be referenced.',
    es: 'Iniciando una nueva conversación. No se hará referencia a mensajes anteriores.',
    pl: 'Rozpoczynanie nowej rozmowy. Poprzednie wiadomości nie będą brane pod uwagę.',
  },
  SCREENSHOT_QUESTION: {
    ko: '대시보드 화면을 분석한 후, 간단한 요약을 먼저 제시하고 그 다음에 자세한 설명을 제공해 주세요.',
    ja: 'ダッシュボード画面を分析し、簡単な要約の後に詳細な説明をお願いします。',
    zh: '请先简要总结仪表板画面，然后再详细说明。',
    'zh-TW': '請先簡要總結儀表板畫面，然後再詳細說明。',
    th: 'กรุณาวิเคราะห์หน้าจอแดชบอร์ด สรุปสั้น ๆ ก่อน แล้วค่อยอธิบายรายละเอียด',
    ms: 'Sila analisis paparan papan pemuka, berikan ringkasan ringkas dahulu kemudian penjelasan terperinci.',
    id: 'Silakan analisis tampilan dasbor, berikan ringkasan singkat terlebih dahulu lalu penjelasan detail.',
    vi: 'Vui lòng phân tích màn hình bảng điều khiển, trước tiên đưa ra tóm tắt ngắn gọn rồi giải thích chi tiết.',
    ar: 'يرجى تحليل شاشة لوحة المعلومات، وتقديم ملخص موجز أولاً ثم شرح مفصل.',
    hi: 'कृपया डैशबोर्ड स्क्रीन का विश्लेषण करें, पहले संक्षिप्त सारांश दें फिर विस्तार से समझाएं।',
    tr: 'Lütfen gösterge paneli ekranını analiz edin, önce kısa bir özet sunun, ardından ayrıntılı açıklama yapın.',
    fr: "Veuillez analyser l'écran du tableau de bord, fournir d'abord un résumé puis une explication détaillée.",
    de: 'Bitte analysieren Sie das Dashboard, geben Sie zuerst eine kurze Zusammenfassung und dann eine ausführliche Erklärung.',
    en: 'Please analyze the dashboard screen, provide a brief summary first, then a detailed explanation.',
    es: 'Por favor, analice la pantalla del panel, proporcione primero un breve resumen y luego una explicación detallada.',
    pl: 'Przeanalizuj ekran pulpitu nawigacyjnego, najpierw podaj krótkie podsumowanie, a następnie szczegółowe wyjaśnienie.',
  },
  SCREENSHOT_CAPTURED: {
    ko: '스크린샷이 캡처되었습니다. 질문을 입력하고 전송 버튼을 클릭하세요.',
    ja: 'スクリーンショットがキャプチャされました。質問を入力して送信ボタンを押してください。',
    zh: '已截取屏幕截图。请输入问题并点击发送按钮。',
    'zh-TW': '已截取螢幕截圖。請輸入問題並點擊發送按鈕。',
    th: 'จับภาพหน้าจอแล้ว กรุณากรอกคำถามและกดปุ่มส่ง',
    ms: 'Tangkapan skrin telah diambil. Sila masukkan soalan dan klik butang hantar.',
    id: 'Tangkapan layar telah diambil. Silakan masukkan pertanyaan dan klik tombol kirim.',
    vi: 'Đã chụp ảnh màn hình. Vui lòng nhập câu hỏi và nhấn nút gửi.',
    ar: 'تم التقاط لقطة الشاشة. الرجاء إدخال السؤال والنقر على زر الإرسال.',
    hi: 'स्क्रीनशॉट लिया गया है। कृपया प्रश्न दर्ज करें और भेजें बटन पर क्लिक करें।',
    tr: 'Ekran görüntüsü alındı. Lütfen soruyu girip gönder düğmesine tıklayın.',
    fr: "Capture d'écran effectuée. Veuillez saisir votre question et cliquer sur le bouton d'envoi.",
    de: 'Screenshot wurde aufgenommen. Bitte geben Sie Ihre Frage ein und klicken Sie auf Senden.',
    en: 'Screenshot captured. Please enter your question and click the send button.',
    es: 'Captura de pantalla realizada. Por favor, introduzca su pregunta y haga clic en enviar.',
    pl: 'Zrzut ekranu został wykonany. Wpisz pytanie i kliknij przycisk wyślij.',
  },
  SCREENSHOT_GUIDE: {
    ko: '이미지와 함께 질문을 입력하고 전송 버튼을 클릭하세요.',
    ja: '画像と一緒に質問を入力し、送信ボタンを押してください。',
    zh: '请与图片一起输入问题并点击发送按钮。',
    'zh-TW': '請與圖片一起輸入問題並點擊發送按鈕。',
    th: 'กรุณากรอกคำถามพร้อมภาพแล้วกดปุ่มส่ง',
    ms: 'Sila masukkan soalan bersama gambar dan klik butang hantar.',
    id: 'Silakan masukkan pertanyaan beserta gambar dan klik tombol kirim.',
    vi: 'Vui lòng nhập câu hỏi cùng với hình ảnh và nhấn nút gửi.',
    ar: 'يرجى إدخال السؤال مع الصورة والنقر على زر الإرسال.',
    hi: 'कृपया प्रश्न को चित्र के साथ दर्ज करें और भेजें बटन पर क्लिक करें।',
    tr: 'Lütfen soruyu resimle birlikte girip gönder düğmesine tıklayın.',
    fr: "Veuillez saisir la question avec l'image et cliquer sur le bouton d'envoi.",
    de: 'Bitte geben Sie die Frage zusammen mit dem Bild ein und klicken Sie auf Senden.',
    en: 'Please enter the question with the image and click the send button.',
    es: 'Por favor, introduzca la pregunta junto con la imagen y haga clic en enviar.',
    pl: 'Wpisz pytanie wraz z obrazem i kliknij przycisk wyślij.',
  },
  ERROR_DEFAULT: {
    ko: '죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    ja: '申し訳ありません。一時的なエラーが発生しました。しばらくしてから再度お試しください。',
    zh: '抱歉，发生了临时错误。请稍后再试。',
    'zh-TW': '抱歉，發生了暫時性錯誤。請稍後再試。',
    th: 'ขออภัย เกิดข้อผิดพลาดชั่วคราว กรุณาลองใหม่อีกครั้งในภายหลัง',
    ms: 'Maaf, berlaku ralat sementara. Sila cuba lagi sebentar lagi.',
    id: 'Maaf, terjadi kesalahan sementara. Silakan coba lagi nanti.',
    vi: 'Xin lỗi, đã xảy ra lỗi tạm thời. Vui lòng thử lại sau.',
    ar: 'عذراً، حدث خطأ مؤقت. يرجى المحاولة مرة أخرى لاحقًا.',
    hi: 'क्षमा करें, अस्थायी त्रुटि हुई है। कृपया बाद में पुनः प्रयास करें।',
    tr: 'Üzgünüz, geçici bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
    fr: 'Désolé, une erreur temporaire est survenue. Veuillez réessayer plus tard.',
    de: 'Entschuldigung, ein vorübergehender Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.',
    en: 'Sorry, a temporary error occurred. Please try again later.',
    es: 'Lo siento, se produjo un error temporal. Por favor, inténtelo de nuevo más tarde.',
    pl: 'Przepraszamy, wystąpił tymczasowy błąd. Spróbuj ponownie później.',
  },
  ERROR_CONNECTION: {
    ko: '서버에 연결할 수 없습니다. 인터넷 연결을 확인하거나 잠시 후 다시 시도해주세요.',
    ja: 'サーバーに接続できません。インターネット接続を確認するか、しばらくしてから再度お試しください。',
    zh: '无法连接到服务器。请检查您的网络连接或稍后再试。',
    'zh-TW': '無法連接到伺服器。請檢查您的網路連線或稍後再試。',
    th: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตหรือรอสักครู่แล้วลองใหม่',
    ms: 'Tidak dapat menyambung ke pelayan. Sila semak sambungan internet anda atau cuba lagi sebentar lagi.',
    id: 'Tidak dapat terhubung ke server. Silakan periksa koneksi internet Anda atau coba lagi nanti.',
    vi: 'Không thể kết nối với máy chủ. Vui lòng kiểm tra kết nối internet hoặc thử lại sau.',
    ar: 'لا يمكن الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت أو المحاولة مرة أخرى لاحقًا.',
    hi: 'सर्वर से कनेक्ट नहीं हो सका। कृपया इंटरनेट कनेक्शन जांचें या बाद में पुनः प्रयास करें।',
    tr: 'Sunucuya bağlanılamıyor. Lütfen internet bağlantınızı kontrol edin veya daha sonra tekrar deneyin.',
    fr: 'Impossible de se connecter au serveur. Veuillez vérifier votre connexion Internet ou réessayer plus tard.',
    de: 'Verbindung zum Server nicht möglich. Bitte überprüfen Sie Ihre Internetverbindung oder versuchen Sie es später erneut.',
    en: 'Cannot connect to the server. Please check your internet connection or try again later.',
    es: 'No se puede conectar al servidor. Por favor, compruebe su conexión a Internet o inténtelo de nuevo más tarde.',
    pl: 'Nie można połączyć się z serwerem. Sprawdź połączenie internetowe lub spróbuj ponownie później.',
  },
  ERROR_ABORTED: {
    ko: '이전 요청이 중단되었습니다.',
    ja: '前回のリクエストが中断されました。',
    zh: '上一个请求已中止。',
    'zh-TW': '上一個請求已中止。',
    th: 'คำขอก่อนหน้านี้ถูกยกเลิกแล้ว',
    ms: 'Permintaan sebelumnya telah dibatalkan.',
    id: 'Permintaan sebelumnya telah dibatalkan.',
    vi: 'Yêu cầu trước đó đã bị hủy.',
    ar: 'تم إلغاء الطلب السابق.',
    hi: 'पिछला अनुरोध रद्द कर दिया गया है।',
    tr: 'Önceki istek iptal edildi.',
    fr: 'La demande précédente a été annulée.',
    de: 'Die vorherige Anfrage wurde abgebrochen.',
    en: 'The previous request was aborted.',
    es: 'La solicitud anterior fue cancelada.',
    pl: 'Poprzednie żądanie zostało przerwane.',
  },
  ERROR_UNKNOWN_FORMAT: {
    ko: '응답을 받았지만 예상된 형식이 아닙니다.',
    ja: '応答を受信しましたが、予期された形式ではありません。',
    zh: '已收到响应，但格式不符合预期。',
    'zh-TW': '已收到回應，但格式不符合預期。',
    th: 'ได้รับการตอบกลับแล้วแต่รูปแบบไม่ถูกต้อง',
    ms: 'Telah menerima respons tetapi format tidak dijangka.',
    id: 'Respons diterima tetapi format tidak sesuai.',
    vi: 'Đã nhận được phản hồi nhưng định dạng không đúng.',
    ar: 'تم استلام الرد ولكن التنسيق غير متوقع.',
    hi: 'प्रतिक्रिया प्राप्त हुई है लेकिन स्वरूप अपेक्षित नहीं है।',
    tr: 'Yanıt alındı ancak beklenen formatta değil.',
    fr: "Réponse reçue mais le format n'est pas celui attendu.",
    de: 'Antwort erhalten, aber das Format ist nicht wie erwartet.',
    en: 'Response received but format is not as expected.',
    es: 'Respuesta recibida pero el formato no es el esperado.',
    pl: 'Odpowiedź została odebrana, ale format nie jest zgodny z oczekiwaniami.',
  },
  ERROR_UNKNOWN: {
    ko: '알 수 없는 오류가 발생했습니다.',
    ja: '不明なエラーが発生しました。',
    zh: '发生了未知错误。',
    'zh-TW': '發生了未知錯誤。',
    th: 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ',
    ms: 'Ralat tidak diketahui telah berlaku.',
    id: 'Terjadi kesalahan yang tidak diketahui.',
    vi: 'Đã xảy ra lỗi không xác định.',
    ar: 'حدث خطأ غير معروف.',
    hi: 'अज्ञात त्रुटि हुई है।',
    tr: 'Bilinmeyen bir hata oluştu.',
    fr: 'Une erreur inconnue est survenue.',
    de: 'Ein unbekannter Fehler ist aufgetreten.',
    en: 'An unknown error occurred.',
    es: 'Ocurrió un error desconocido.',
    pl: 'Wystąpił nieznany błąd.',
  },
  // UI 다국어 메시지
  UI_SCREENSHOT: {
    ko: '스크린샷',
    ja: 'スクリーンショット',
    zh: '截图',
    'zh-TW': '截圖',
    th: 'ภาพหน้าจอ',
    ms: 'Tangkapan skrin',
    id: 'Tangkapan layar',
    vi: 'Chụp màn hình',
    ar: 'لقطة شاشة',
    hi: 'स्क्रीनशॉट',
    tr: 'Ekran görüntüsü',
    fr: "Capture d'écran",
    de: 'Screenshot',
    en: 'Screenshot',
    es: 'Captura de pantalla',
    pl: 'Zrzut ekranu',
  },
  UI_REFRESH: {
    ko: '새로고침',
    ja: '更新',
    zh: '刷新',
    'zh-TW': '重新整理',
    th: 'รีเฟรช',
    ms: 'Muat semula',
    id: 'Segarkan',
    vi: 'Làm mới',
    ar: 'تحديث',
    hi: 'रिफ्रेश',
    tr: 'Yenile',
    fr: 'Actualiser',
    de: 'Aktualisieren',
    en: 'Refresh',
    es: 'Actualizar',
    pl: 'Odśwież',
  },
  UI_FULLSCREEN: {
    ko: '전체화면',
    ja: '全画面',
    zh: '全屏',
    'zh-TW': '全螢幕',
    th: 'เต็มหน้าจอ',
    ms: 'Skrin penuh',
    id: 'Layar penuh',
    vi: 'Toàn màn hình',
    ar: 'ملء الشاشة',
    hi: 'पूर्ण स्क्रीन',
    tr: 'Tam ekran',
    fr: 'Plein écran',
    de: 'Vollbild',
    en: 'Fullscreen',
    es: 'Pantalla completa',
    pl: 'Pełny ekran',
  },
  UI_FULLSCREEN_EXIT: {
    ko: '전체화면 해제',
    ja: '全画面解除',
    zh: '退出全屏',
    'zh-TW': '退出全螢幕',
    th: 'ออกจากเต็มหน้าจอ',
    ms: 'Keluar skrin penuh',
    id: 'Keluar layar penuh',
    vi: 'Thoát toàn màn hình',
    ar: 'الخروج من ملء الشاشة',
    hi: 'पूर्ण स्क्रीन से बाहर निकलें',
    tr: 'Tam ekrandan çık',
    fr: 'Quitter le plein écran',
    de: 'Vollbild beenden',
    en: 'Exit fullscreen',
    es: 'Salir de pantalla completa',
    pl: 'Wyjdź z pełnego ekranu',
  },
  UI_INPUT_PLACEHOLDER: {
    ko: '문의하실 내용을 입력해주세요.',
    ja: 'お問い合わせ内容を入力してください。',
    zh: '请输入您要咨询的内容。',
    'zh-TW': '請輸入您要諮詢的內容。',
    th: 'กรุณากรอกเนื้อหาที่ต้องการสอบถาม',
    ms: 'Sila masukkan kandungan yang ingin anda tanya.',
    id: 'Silakan masukkan konten yang ingin Anda tanyakan.',
    vi: 'Vui lòng nhập nội dung bạn muốn hỏi.',
    ar: 'يرجى إدخال المحتوى الذي تريد استشارته.',
    hi: 'कृपया वह सामग्री दर्ज करें जिसके बारे में आप पूछना चाहते हैं।',
    tr: 'Lütfen sormak istediğiniz içeriği girin.',
    fr: 'Veuillez saisir le contenu que vous souhaitez consulter.',
    de: 'Bitte geben Sie den Inhalt ein, den Sie konsultieren möchten.',
    en: 'Please enter the content you want to inquire about.',
    es: 'Por favor, introduzca el contenido sobre el que desea consultar.',
    pl: 'Proszę wprowadzić treść, o którą chcesz się zapytać.',
  },
  UI_SEND: {
    ko: '전송',
    ja: '送信',
    zh: '发送',
    'zh-TW': '發送',
    th: 'ส่ง',
    ms: 'Hantar',
    id: 'Kirim',
    vi: 'Gửi',
    ar: 'إرسال',
    hi: 'भेजें',
    tr: 'Gönder',
    fr: 'Envoyer',
    de: 'Senden',
    en: 'Send',
    es: 'Enviar',
    pl: 'Wyślij',
  },
  UI_AI_DISCLAIMER: {
    ko: 'AI가 생성한 답변으로, 정확하지 않을 수 있습니다.',
    ja: 'AIが生成した回答で、正確でない場合があります。',
    zh: '这是AI生成的回答，可能不准确。',
    'zh-TW': '這是AI生成的回答，可能不準確。',
    th: 'นี่คือคำตอบที่สร้างโดย AI ซึ่งอาจไม่ถูกต้อง',
    ms: 'Ini adalah jawapan yang dijana oleh AI yang mungkin tidak tepat.',
    id: 'Ini adalah jawaban yang dibuat oleh AI yang mungkin tidak akurat.',
    vi: 'Đây là câu trả lời được tạo bởi AI và có thể không chính xác.',
    ar: 'هذه إجابة مولدة بواسطة الذكاء الاصطناعي وقد تكون غير دقيقة.',
    hi: 'यह AI द्वारा उत्पन्न उत्तर है जो सटीक नहीं हो सकता है।',
    tr: 'Bu AI tarafından oluşturulan bir yanıttır ve doğru olmayabilir.',
    fr: "Ceci est une réponse générée par l'IA qui peut ne pas être exacte.",
    de: 'Dies ist eine von KI generierte Antwort, die möglicherweise nicht korrekt ist.',
    en: 'This is an AI-generated answer that may not be accurate.',
    es: 'Esta es una respuesta generada por IA que puede no ser precisa.',
    pl: 'To jest odpowiedź wygenerowana przez AI, która może nie być dokładna.',
  },
  UI_POWERED_BY: {
    ko: 'Powered by',
    ja: 'Powered by',
    zh: 'Powered by',
    'zh-TW': 'Powered by',
    th: 'Powered by',
    ms: 'Powered by',
    id: 'Powered by',
    vi: 'Powered by',
    ar: 'Powered by',
    hi: 'Powered by',
    tr: 'Powered by',
    fr: 'Powered by',
    de: 'Powered by',
    en: 'Powered by',
    es: 'Powered by',
    pl: 'Powered by',
  },
  UI_CHARACTER_COUNT: {
    ko: '자',
    ja: '文字',
    zh: '字符',
    'zh-TW': '字元',
    th: 'ตัวอักษร',
    ms: 'aksara',
    id: 'karakter',
    vi: 'ký tự',
    ar: 'حرف',
    hi: 'अक्षर',
    tr: 'karakter',
    fr: 'caractères',
    de: 'Zeichen',
    en: 'characters',
    es: 'caracteres',
    pl: 'znaki',
  },
  LOADING_GENERATING: {
    ko: '답변을 작성중입니다...',
    ja: '回答を作成中...',
    zh: '正在生成回答...',
    'zh-TW': '正在生成回答...',
    th: 'กำลังสร้างคำตอบ...',
    ms: 'Menjana jawapan...',
    id: 'Membuat jawaban...',
    vi: 'Đang tạo câu trả lời...',
    ar: 'جاري إنشاء الإجابة...',
    hi: 'उत्तर बना रहा है...',
    tr: 'Cevap oluşturuluyor...',
    fr: 'Génération de la réponse...',
    de: 'Antwort wird generiert...',
    en: 'Generating answer...',
    es: 'Generando respuesta...',
    pl: 'Generowanie odpowiedzi...',
  },
};

// 현재 브라우저 언어 감지 및 지원 언어 매핑
function detectLanguage() {
  // 쿠키에서 언어 설정 확인 (우선순위 1)
  const cookieLang = getCookie('lang');
  if (cookieLang && SUPPORTED_LANGUAGES.includes(cookieLang.toLowerCase())) {
    return cookieLang.toLowerCase();
  }

  // 브라우저 언어 설정 확인 (우선순위 2)
  const navLangs = navigator.languages || [navigator.language || 'en'];
  for (let lang of navLangs) {
    lang = lang.toLowerCase();
    // zh-tw, zh-cn 등은 정확히 매칭
    if (SUPPORTED_LANGUAGES.includes(lang)) {
      return lang;
    }
    // zh, en 등은 앞 2글자만 매칭
    const short = lang.split('-')[0];
    if (SUPPORTED_LANGUAGES.includes(short)) {
      return short;
    }
  }
  return 'en'; // 기본값
}

// 쿠키에서 값을 가져오는 헬퍼 함수
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length > 1) {
    return parts.pop().split(';').shift();
  }
  return null;
}
const CURRENT_LANG = detectLanguage();

// 메시지 헬퍼
function t(key) {
  return (
    (I18N_MESSAGES[key] && I18N_MESSAGES[key][CURRENT_LANG]) || (I18N_MESSAGES[key] && I18N_MESSAGES[key]['en']) || key
  );
}

// 기본 메시지
const DEFAULT_MESSAGES = {
  WELCOME: t('WELCOME'),
  NEW_SESSION: t('NEW_SESSION'),
  SCREENSHOT_QUESTION: t('SCREENSHOT_QUESTION'),
  SCREENSHOT_CAPTURED: t('SCREENSHOT_CAPTURED'),
  SCREENSHOT_GUIDE: t('SCREENSHOT_GUIDE'),
};

// UI 다국어 메시지
const UI_MESSAGES = {
  SCREENSHOT: t('UI_SCREENSHOT'),
  REFRESH: t('UI_REFRESH'),
  FULLSCREEN: t('UI_FULLSCREEN'),
  FULLSCREEN_EXIT: t('UI_FULLSCREEN_EXIT'),
  INPUT_PLACEHOLDER: t('UI_INPUT_PLACEHOLDER'),
  SEND: t('UI_SEND'),
  AI_DISCLAIMER: t('UI_AI_DISCLAIMER'),
  POWERED_BY: t('UI_POWERED_BY'),
  CHARACTER_COUNT: t('UI_CHARACTER_COUNT'),
};

// 다국어 메시지 export
export { UI_MESSAGES, t };

const ERROR_MESSAGES = {
  DEFAULT: t('ERROR_DEFAULT'),
  CONNECTION: t('ERROR_CONNECTION'),
  ABORTED: t('ERROR_ABORTED'),
  UNKNOWN_FORMAT: t('ERROR_UNKNOWN_FORMAT'),
  UNKNOWN_ERROR: t('ERROR_UNKNOWN'),
};

// UI 관련 상수
const UI_ELEMENTS = {
  CHAT_INPUT: 'chatInput',
  CHAT_INPUT_LENGTH: 'chatInputLength',
  SEND_BUTTON: 'sendButton',
  RESET_BUTTON: 'resetButton',
  CHAT_MESSAGES: 'chatMessages',
  LOADING_INDICATOR: 'loadingIndicator',
  SCREENSHOT_BUTTON: 'screenshotButton',
  FULL_SCREEN_BUTTON: 'fullScreenButton',
  CLOSE_BUTTON: 'closeChatbotButton',
  CHATBOT_DIALOG: 'chatbotDialog',
  CHATBOT_CONTENT: 'chatbotContent',
  COPILOT_MENU: 'copilotMenu',
  COPILOT_MENU_TOGGLE: 'copilotMenuToggle',
  COPILOT_MENU_ARROW: 'copilotMenuArrow',
};

const CSS_CLASSES = {
  SEND_BUTTON: {
    ENABLED: ['bg-blue-600', 'hover:bg-blue-700', 'cursor-pointer'],
    DISABLED: ['bg-gray-400', 'cursor-not-allowed'],
  },
};

// hsnam 250616: pcode와 platform 정보를 저장할 캐시 추가
const projectCache = {
  platformMap: new Map(), // pcode -> platform 매핑
  projectInfoMap: new Map(), // pcode -> {platform, productType} 매핑

  // hsnam 250616: 현재 URL에서 pcode 추출
  extractPcodeFromUrl() {
    const path = window.location.pathname;
    const match = path.match(/\/v2\/project\/[^/]+\/(\d+)\/(.*)/);
    return match ? match[1] : null;
  },

  // hsnam 250616: 현재 프로젝트 정보를 로딩하는 함수
  async loadCurrentProject() {
    const currentPcode = this.extractPcodeFromUrl();
    if (currentPcode !== null && currentPcode !== undefined) {
      debugLog('현재 프로젝트 정보를 로딩합니다:', currentPcode);
      return await this.getPlatform(currentPcode);
    }
    return null;
  },

  // hsnam 250616: 모든 프로젝트 정보를 로딩하는 함수
  async loadAllProject() {
    try {
      debugLog('모든 프로젝트 정보를 로딩합니다.');

      // 현재 프로젝트 정보 로딩
      const currentPcode = this.extractPcodeFromUrl();
      if (currentPcode !== null && currentPcode !== undefined) {
        await this.getPlatform(currentPcode);
        debugLog('현재 프로젝트 정보 로딩 완료:', currentPcode);
      }

      // 사용자의 모든 프로젝트 목록을 가져와서 캐시에 저장
      try {
        const response = await fetch(`${BASE_URL}/account/api/v5/project/list`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page: 1,
            max: 99999,
            search: '',
            group: '',
            favorite: false,
            onlyNoGroup: false,
            layerUuid: '',
          }),
        });

        const data = await response.json();
        if (data.code === 200 && data.data && data.data.projects) {
          debugLog('프로젝트 목록 API 호출 성공. 프로젝트 수:', data.data.projects.length);

          // 각 프로젝트의 pcode, productType, platform 정보를 캐시에 저장
          for (const project of data.data.projects) {
            if (project.pcode && project.platform) {
              const pcodeStr = project.pcode.toString();
              // platform 정보를 캐시에 저장 (기존 getPlatform 로직과 동일)
              this.platformMap.set(pcodeStr, project.platform);
              // 상세 프로젝트 정보를 캐시에 저장
              this.projectInfoMap.set(pcodeStr, {
                name: project.name,
                platform: project.platform,
                productType: project.productType || 'UNKNOWN',
              });
              debugLog(
                `프로젝트 정보 캐시 저장: pcode=${project.pcode}, platform=${project.platform}, productType=${project.productType}`,
              );
            }
          }
        } else {
          debugError('프로젝트 목록 API 응답 오류:', data);
        }
      } catch (error) {
        debugError('프로젝트 목록 API 호출 실패:', error);
      }

      debugLog('프로젝트 정보 로딩 완료. 캐시된 프로젝트 수:', this.platformMap.size);
      return this.platformMap.size > 0;
    } catch (error) {
      debugError('프로젝트 정보 로딩 중 오류:', error);
      return false;
    }
  },

  // hsnam 250616: pcode에 해당하는 platform 정보 조회
  async getPlatform(pcode) {
    if (!pcode) {
      return null;
    }

    // 캐시에 있으면 캐시된 값 반환
    if (this.platformMap.has(pcode)) {
      return this.platformMap.get(pcode);
    }

    try {
      // API 호출하여 platform 정보 조회
      const response = await fetch(`${BASE_URL}${API_ENDPOINTS.PROJECT_INFO}/${pcode}`);
      const data = await response.json();
      if (data.code === 200 && data.data && data.data.platform) {
        // 캐시에 저장
        this.platformMap.set(pcode, data.data.platform);
        return data.data.platform;
      }
    } catch (error) {
      debugError('Failed to fetch project info:', error);
    }

    return null;
  },
};

// hsnam 250616: userContext 처리 함수들
const userContextHandlers = {
  // projects 컨텍스트 처리
  async projects() {
    try {
      const currentPcode = projectCache.extractPcodeFromUrl();

      // 캐시가 비어있으면 현재 프로젝트 정보를 로딩
      if (projectCache.platformMap.size === 0) {
        await projectCache.loadAllProject();
      }

      // 모든 캐시된 프로젝트 정보 수집
      const allProjects = [];

      // 현재 프로젝트 정보 추가
      if (currentPcode) {
        const currentPlatform = await projectCache.getPlatform(currentPcode);
        if (currentPlatform) {
          const currentProjectInfo = projectCache.projectInfoMap.get(currentPcode) || {
            platform: currentPlatform,
            productType: 'UNKNOWN',
          };
          allProjects.push({
            pcode: currentPcode,
            platform: currentPlatform,
            productType: currentProjectInfo.productType,
            isCurrent: true,
          });
        }
      }

      // 캐시된 모든 프로젝트 정보 추가
      for (const [pcode, projectInfo] of projectCache.projectInfoMap.entries()) {
        // 현재 프로젝트는 이미 추가했으므로 중복 제거
        if (pcode !== currentPcode) {
          allProjects.push({
            name: projectInfo.name,
            pcode: pcode,
            platform: projectInfo.platform,
            productType: projectInfo.productType,
            isCurrent: false,
          });
        }
      }

      if (allProjects.length === 0) {
        return '캐시된 프로젝트 정보가 없습니다. 현재 프로젝트 정보를 가져올 수 없습니다.';
      }

      // YAML 형식으로 모든 프로젝트 정보 구성
      let projectInfo = `# 프로젝트 정보

## 현재 프로젝트
- 현재 URL: ${window.location.pathname}
- 캐시된 프로젝트 총 개수: ${projectCache.platformMap.size}

## 프로젝트 목록
`;

      allProjects.forEach((project, index) => {
        const currentMarker = project.isCurrent ? ' (현재)' : '';
        projectInfo += `
### 프로젝트 ${project.pcode}
- name: ${project.name}
- pcode: ${project.pcode}
- platform: ${project.platform}
- productType: ${project.productType}
`;
      });

      projectInfo += `
# 도메인 정보
- 현재 도메인: ${window.location.origin}

## 사용 가능한 프로젝트 데이터
프로젝트 캐시에서 가져온 모든 프로젝트 정보를 기반으로 분석을 수행할 수 있습니다.
`;

      return projectInfo;
    } catch (error) {
      debugError('프로젝트 컨텍스트 처리 중 오류:', error);
      return '프로젝트 정보를 가져오는 중 오류가 발생했습니다.';
    }
  },

  // 향후 확장을 위한 다른 컨텍스트 핸들러들
  // async servers() { ... },
  // async transactions() { ... },
  // async alerts() { ... },
};

// hsnam 250616: userContext 배열을 받아서 문자열로 변환하는 함수
async function getUserContext(userContextArray) {
  if (!Array.isArray(userContextArray) || userContextArray.length === 0) {
    return '';
  }

  const contextResults = [];

  for (const contextKey of userContextArray) {
    if (typeof contextKey === 'string' && userContextHandlers[contextKey]) {
      try {
        const result = await userContextHandlers[contextKey]();
        if (result) {
          contextResults.push(`## ${contextKey.toUpperCase()} 컨텍스트\n${result}`);
        }
      } catch (error) {
        debugError(`${contextKey} 컨텍스트 처리 중 오류:`, error);
        contextResults.push(`## ${contextKey.toUpperCase()} 컨텍스트\n처리 중 오류가 발생했습니다.`);
      }
    } else {
      debugWarn(`지원하지 않는 컨텍스트 키: ${contextKey}`);
    }
  }

  if (contextResults.length === 0) {
    return '';
  }

  return `# 사용자 컨텍스트 정보

다음은 현재 사용자의 컨텍스트 정보입니다:

${contextResults.join('\n\n')}

---
*이 정보는 AI가 더 정확한 답변을 제공하기 위해 자동으로 포함되었습니다.*
`;
}

// 유틸리티 함수
// 텍스트 포맷팅 정규식 (백틱을 볼드체로 변환)
const formatText = (text) => {
  if (!text || typeof text !== 'string') {
    return '';
  }
  return text.replace(/(?<!`)`(?!`)(.*?)(?<!`)`(?!`)/g, '**$1**');
};

// 스트리밍 응답 처리를 위한 유틸리티 함수
async function processStreamingResponse(response, onChunkReceived) {
  if (!response.ok) {
    throw new Error(`서버 오류: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullAnswer = '';
  let relevantDocs = [];
  let errorOccurred = false;
  let buffer = '';

  while (true) {
    if (errorOccurred) {
      break;
    }

    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    const chunk = decoder.decode(value);
    buffer += chunk;

    let startIdx = 0;
    let endIdx;

    while ((endIdx = buffer.indexOf('\n', startIdx)) !== -1) {
      const line = buffer.substring(startIdx, endIdx).trim();
      startIdx = endIdx + 1;

      if (line === '') {
        continue;
      }

      try {
        const data = JSON.parse(line);

        if (data.status === 'error') {
          onChunkReceived(data.answer || ERROR_MESSAGES.UNKNOWN_ERROR, true);
          errorOccurred = true;
          fullAnswer = data.answer || ERROR_MESSAGES.UNKNOWN_ERROR;
          break;
        }

        if (data.chunk) {
          fullAnswer += data.chunk;
          onChunkReceived(data.chunk, false);
        }

        if (data.relevant_docs) {
          relevantDocs = relevantDocs || {};
          relevantDocs.relevant_docs = data.relevant_docs;
        }

        if (data.recommendedQuestions) {
          relevantDocs = relevantDocs || {};
          relevantDocs.recommendedQuestions = data.recommendedQuestions;
        }

        if (data.mxqlExecutes) {
          relevantDocs = relevantDocs || {};
          relevantDocs.mxqlExecutes = data.mxqlExecutes;
        }

        if (data.done) {
          fullAnswer = data.answer || fullAnswer;
          onChunkReceived(data.answer || fullAnswer, true, relevantDocs);
        }
      } catch (parseError) {
        // 파싱 에러는 무시하고 계속 진행
      }
    }

    buffer = buffer.substring(startIdx);
  }

  // 버퍼에 남은 데이터가 있는지 확인하고 처리
  if (buffer.trim() !== '') {
    try {
      const data = JSON.parse(buffer.trim());

      if (data.status === 'error') {
        onChunkReceived(data.answer || ERROR_MESSAGES.UNKNOWN_ERROR, true);
        fullAnswer = data.answer || ERROR_MESSAGES.UNKNOWN_ERROR;
      }

      if (data.relevant_docs) {
        relevantDocs = relevantDocs || {};
        relevantDocs.relevant_docs = data.relevant_docs;
      }

      if (data.recommendedQuestions) {
        relevantDocs = relevantDocs || {};
        relevantDocs.recommendedQuestions = data.recommendedQuestions;
      }

      if (data.mxqlExecutes) {
        relevantDocs = relevantDocs || {};
        relevantDocs.mxqlExecutes = data.mxqlExecutes;
      }

      if (data.done) {
        fullAnswer = data.answer || fullAnswer;
        onChunkReceived(data.answer || fullAnswer, true, relevantDocs);
      } else if (data.chunk) {
        fullAnswer += data.chunk;
        onChunkReceived(data.chunk, data.done, relevantDocs);
      }
    } catch (parseError) {
      onChunkReceived(fullAnswer, true, relevantDocs);
    }
  }

  return {
    success: !errorOccurred,
    answer: fullAnswer,
    relevantDocs: relevantDocs,
  };
}

// 마크다운 렌더러 설정
function initializeMarkdownRenderer() {
  // 필요한 라이브러리가 없으면 초기화하지 않음
  if (typeof marked === 'undefined') {
    debugWarn('Marked 라이브러리가 로드되지 않았습니다.');
    return;
  }

  // Mermaid 초기화
  if (typeof mermaid !== 'undefined') {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'strict',
    });
  }

  // Marked 렌더러 설정
  const renderer = new marked.Renderer();

  // 코드 블록 처리를 위한 원본 렌더러 저장
  const originalCodeRenderer = renderer.code.bind(renderer);

  // 링크 커스텀 렌더러 (새창에서 열기)
  renderer.link = function (href, title, text) {
    let url, linkText, linkTitle;

    // href가 객체이고 title, text가 undefined인 경우
    if (typeof href === 'object' && (title === undefined || title === null) && (text === undefined || text === null)) {
      url = href.href || href;
      linkText = href.text || url;
      linkTitle = href.title || null;
    } else {
      // 기존 로직
      url = typeof href === 'object' && href.href ? href.href : href;

      // text 처리
      if (typeof text === 'object') {
        if (text.text) {
          linkText = text.text;
        } else if (text.href) {
          linkText = text.href;
        } else if (text.toString) {
          linkText = text.toString();
        } else {
          linkText = 'link';
        }
      } else if (!text || text === 'undefined') {
        linkText = url;
      } else {
        linkText = text;
      }

      linkTitle = title;
    }

    const target = 'target="_blank"';
    const rel = 'rel="noopener noreferrer"';
    const titleAttr = linkTitle ? ` title="${linkTitle}"` : '';
    return `<a href="${url}" ${target} ${rel}${titleAttr}>${linkText}</a>`;
  };

  // 코드 블록 커스텀 렌더러
  renderer.code = function (code, language) {
    if (language === 'mermaid') {
      return `<div class="mermaid">${code}</div>`;
    }

    // 기본 처리로 돌아가기
    const html = originalCodeRenderer(code, language);

    // 코드에 복사 버튼 추가
    return `<div class="code-container">${html}<button class="copy-button">Copy</button></div>`;
  };

  // Marked 설정
  marked.setOptions({
    renderer: renderer,
    highlight: function (code, language) {
      if (language && typeof hljs !== 'undefined' && hljs.getLanguage(language)) {
        return hljs.highlight(code, { language }).value;
      }
      return typeof hljs !== 'undefined' ? hljs.highlightAuto(code).value : code;
    },
    breaks: true,
    gfm: true,
  });
}

// 전역 변수
let chatStore;
let screenshotLibLoaded = window.screenshotLibLoaded || false;
let capturedImageData = null; // 캡처된 이미지 데이터 저장
let isFullScreen = false; // 전체화면 상태
let copilotGalleries = []; // 코파일럿 갤러리 데이터
let selectedCopilotId = null; // 선택된 코파일럿 ID
let selectedUserContext = null; // 선택된 userContext

// 챗봇 UI 요소 생성 함수
function createChatbotElements() {
  // 챗봇 다이얼로그 생성
  const chatbotDialog = document.createElement('div');
  chatbotDialog.id = UI_ELEMENTS.CHATBOT_DIALOG;
  chatbotDialog.className = 'chatbot-dialog';

  // 챗봇 콘텐츠 컨테이너 생성
  const chatbotContent = document.createElement('div');
  chatbotContent.id = UI_ELEMENTS.CHATBOT_CONTENT;
  chatbotContent.className = 'h-full w-full flex flex-col';

  // 다이얼로그에 콘텐츠 추가
  chatbotDialog.appendChild(chatbotContent);

  // body에 요소들 추가
  document.body.appendChild(chatbotDialog);

  return {
    chatbotDialog,
    chatbotContent,
  };
}

// 다이얼로그 관련 기능
function initializeDialog() {
  // 챗봇 UI 요소 생성
  const elements = createChatbotElements();
  const { chatbotDialog, chatbotContent } = elements;

  // 챗봇 콘텐츠 주입
  chatbotContent.innerHTML = createChatbotContent();

  // 닫기 버튼 이벤트 리스너 추가
  const closeChatbotButton = document.getElementById(UI_ELEMENTS.CLOSE_BUTTON);
  if (closeChatbotButton) {
    closeChatbotButton.addEventListener('click', hideChatbotDialog);
  }

  // 전체화면 버튼 이벤트 리스너 추가
  const fullScreenButton = document.getElementById(UI_ELEMENTS.FULL_SCREEN_BUTTON);
  if (fullScreenButton) {
    fullScreenButton.addEventListener('click', toggleFullScreen);
  }

  // 스크린샷 버튼 초기화
  initializeScreenshotFeature();

  // ESC 키 이벤트
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (isFullScreen) {
        toggleFullScreen(); // 전체화면 모드에서는 전체화면 해제
      } else {
        hideChatbotDialog(); // 일반 모드에서는 다이얼로그 닫기
      }
    }
  });
}

// 챗봇 다이얼로그 표시
export function showChatbotDialog() {
  if (!chatStore) {
    debugWarn('chatStore가 초기화되지 않았습니다.');
    return;
  }

  document.getElementById(UI_ELEMENTS.CHATBOT_DIALOG).style.display = 'block';

  // 챗봇이 처음 열릴 때만 안내 메시지 표시
  const chatMessages = document.getElementById(UI_ELEMENTS.CHAT_MESSAGES);
  if (chatMessages && chatMessages.children.length === 0) {
    // 안내 메시지가 없으면 초기화
    chatStore.initializeChat();
  } else if (chatMessages && !chatMessages.querySelector('.message-container')) {
    // 메시지 컨테이너가 없으면 초기화
    chatStore.initializeChat();
  }

  // 코파일럿 메뉴 표시 및 렌더링 (메시지 영역에 표시)
  renderCopilotMenu();

  // 토글 버튼 숨기기
  const copilotMenuToggle = document.getElementById(UI_ELEMENTS.COPILOT_MENU_TOGGLE);
  if (copilotMenuToggle) {
    copilotMenuToggle.style.display = 'none';
  }
}

// 챗봇 다이얼로그 숨기기
export function hideChatbotDialog() {
  const chatbotDialog = document.getElementById(UI_ELEMENTS.CHATBOT_DIALOG);
  if (chatbotDialog) {
    chatbotDialog.style.display = 'none';

    // 전체화면 상태 초기화
    if (isFullScreen) {
      isFullScreen = false;
      // 스타일 초기화
      chatbotDialog.style.position = '';
      chatbotDialog.style.top = '';
      chatbotDialog.style.left = '';
      chatbotDialog.style.width = '';
      chatbotDialog.style.height = '';
      chatbotDialog.style.zIndex = '';
      chatbotDialog.style.borderRadius = '';
      chatbotDialog.style.boxShadow = '';

      // 버튼 아이콘 복원
      const fullScreenButton = document.getElementById(UI_ELEMENTS.FULL_SCREEN_BUTTON);
      if (fullScreenButton) {
        fullScreenButton.title = UI_MESSAGES.FULLSCREEN;
        fullScreenButton.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M4.18509 12.5001L2.49983 12.5001L2.50013 17.5001L7.50039 17.5001L7.50047 15.8334L4.18548 15.8334L4.18509 12.5001Z" fill="#757575"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M15.8278 7.50031L17.5131 7.50031L17.5128 2.50028L12.5126 2.50028L12.5125 4.167L15.8275 4.16699L15.8278 7.50031Z" fill="#757575"/>
            <rect width="1.66667" height="7.08482" transform="matrix(-0.707107 -0.707107 -0.707107 0.707107 9.52148 11.9602)" fill="#757575"/>
            <rect width="1.66667" height="7.08479" transform="matrix(0.707107 0.707107 0.707107 -0.707107 10.4917 8.34311)" fill="#757575"/>
          </svg>
        `;
      }
    }
  }
}

// html2canvas 라이브러리 동적 로드
async function loadScreenshotLibrary() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = '/javascripts/lib/html2canvas.min.js';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// 스크린샷 관련 기능
function initializeScreenshotFeature() {
  const screenshotButton = document.getElementById(UI_ELEMENTS.SCREENSHOT_BUTTON);

  if (!screenshotButton) {
    return; // 스크린샷 버튼이 없으면 초기화하지 않음
  }

  screenshotButton.addEventListener('click', async function () {
    try {
      // 스크린샷 과정 시작
      window.dispatchEvent(new CustomEvent('takeScreenshotAndClose'));
    } catch (error) {
      debugError('Screenshot processing failed:', error);
      showToast('Screenshot processing failed');
    }
  });
}

// 복사 버튼 기능
function setupCopyButtons() {
  document.querySelectorAll('.copy-button').forEach((button) => {
    button.addEventListener('click', async function () {
      const container = this.parentElement;
      const codeElement = container.querySelector('code');

      if (codeElement) {
        try {
          await navigator.clipboard.writeText(codeElement.textContent);

          // 버튼 스타일 변경
          const originalText = this.textContent;
          const originalClass = this.className;

          this.textContent = 'Copied!';
          this.className = 'copy-button bg-green-500';

          // 2초 후 원래 상태로 복구
          setTimeout(() => {
            this.textContent = originalText;
            this.className = originalClass;
          }, 2000);
        } catch (error) {
          debugError('Copy failed:', error);
          showToast('Fail to copy.');
        }
      }
    });
  });
}

// 토스트 메시지 표시
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'fixed bottom-6 right-6 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg z-50';
  toast.style.animation = 'fadeInOut 3s forwards';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// 마크다운 렌더링 및 다이어그램 처리
function renderMarkdown(text) {
  // marked 라이브러리가 없으면 텍스트를 그대로 반환
  if (typeof marked === 'undefined') {
    return `<div>${text}</div>`;
  }

  // 마크다운을 HTML로 변환
  const html = marked.parse(text);

  // HTML 요소에 삽입 (이 예제에서는 더미 div 사용)
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  tempDiv.classList.add('markdown-content');

  // Mermaid 다이어그램 처리
  setTimeout(() => {
    try {
      if (typeof mermaid !== 'undefined') {
        mermaid.init(undefined, document.querySelectorAll('.mermaid'));
      }
    } catch (error) {
      debugError('Mermaid rendering failed:', error);
    }
    setupCopyButtons();
  }, 0);

  return tempDiv.innerHTML;
}

// 새로운 MXQL 실행 및 마크다운 렌더링 함수
async function executeMxqlAndRenderMarkdown(mxqlExecutes) {
  if (!mxqlExecutes || !Array.isArray(mxqlExecutes) || mxqlExecutes.length === 0) {
    return '';
  }

  const results = [];

  for (const mxqlExecute of mxqlExecutes) {
    try {
      // projectCache에서 일치하는 platform의 pcode 찾기
      let targetPcode = null;
      let targetProjectName = null;
      for (const [pcode, projectInfo] of projectCache.projectInfoMap.entries()) {
        if (projectInfo.platform.toLowerCase() === mxqlExecute.platform.toLowerCase()) {
          targetPcode = pcode;
          targetProjectName = projectInfo.name;
          break;
        }
      }

      if (!targetPcode) {
        debugWarn(`Platform '${mxqlExecute.platform}'에 해당하는 프로젝트를 찾을 수 없습니다.`);
        continue;
      }

      // 현재 시간과 30분 전 시간 계산 (unix epoch millisecond)
      const now = Date.now();
      const thirtyMinutesAgo = now - 30 * 60 * 1000;

      // API 호출
      const response = await fetch('/yard/api/flush', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'mxql',
          pcode: parseInt(targetPcode),
          params: {
            pcode: parseInt(targetPcode),
            stime: thirtyMinutesAgo,
            etime: now,
            trigger: 0,
            mql: mxqlExecute.mxql,
            limit: 100,
            userId: 'sa@whatap.io',
            pageKey: 'mxql',
            param: {},
          },
          path: 'text',
          authKey: '',
        }),
      });

      const data = await response.json();

      // 응답이 빈 배열이면 건너뛰기
      if (!Array.isArray(data) || data.length === 0) {
        continue;
      }

      // 테이블 헤더 생성
      const headers = ['프로젝트'];
      const firstRow = data[0];

      // 태그와 필드 키들을 헤더에 추가
      for (const key in firstRow) {
        if (key !== '_rows_') {
          headers.push(key);
        }
      }

      // 테이블 행 생성
      const rows = data.map((row) => {
        const rowData = [targetProjectName];

        for (const key in firstRow) {
          if (key === '_rows_') {
            continue;
          }
          if (key === 'time') {
            // unix epoch millisecond를 로컬시간으로 변환
            const timestamp = row[key];
            if (timestamp && typeof timestamp === 'number') {
              const date = new Date(timestamp);
              const formattedTime = date.toLocaleString(undefined, {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              });
              rowData.push(formattedTime);
            } else {
              rowData.push(row[key] || '');
            }
          } else {
            rowData.push(row[key] || '');
          }
        }

        return rowData;
      });

      // 마크다운 테이블 생성
      let markdownTable = `\n\n## MXQL 실행 결과 (${mxqlExecute.platform})\n\n`;
      markdownTable += '| ' + headers.join(' | ') + ' |\n';
      markdownTable += '| ' + headers.map(() => '---').join(' | ') + ' |\n';

      rows.forEach((row) => {
        markdownTable += '| ' + row.map((cell) => String(cell).replace(/\|/g, '\\|')).join(' | ') + ' |\n';
      });

      results.push(markdownTable);
    } catch (error) {
      debugError('MXQL 실행 중 오류:', error);
      results.push(
        `\n\n## MXQL 실행 오류 (${mxqlExecute.platform})\n\n실행 중 오류가 발생했습니다: ${error.message}\n`,
      );
    }
  }

  return results.join('');
}

// 챗봇 초기화
export function initializeChatbot({ baseUrl } = {}) {
  BASE_URL = baseUrl || BASE_URL;
  initializeDialog();

  // 코파일럿 갤러리 로드
  fetchCopilotGalleries().then((success) => {
    if (success) {
      debugLog('코파일럿 갤러리 로드 성공');
    } else {
      debugWarn('코파일럿 갤러리 로드 실패, 기본 메뉴 사용');
    }
  });

  document.addEventListener('takeScreenshotAndCloseDialog', async function () {
    try {
      // 챗봇 인터페이스 숨기기
      toggleChatbotDialog(false);

      // 스크린샷 전에 약간의 시간 지연 (UI가 업데이트될 시간)
      await new Promise((resolve) => setTimeout(resolve, 300));

      // 화면 캡처
      const imageData = await captureScreenshot();

      // 캡처된 이미지 데이터 저장
      capturedImageData = imageData;

      // 챗봇 다이얼로그 다시 표시
      toggleChatbotDialog(true);

      // 캡처된 이미지를 바로 표시
      if (chatStore) {
        setTimeout(() => {
          chatStore.displayCapturedImage(imageData);
        }, 300);
      }
    } catch (error) {
      debugError('Screenshot capture failed:', error);

      // 에러가 발생해도 챗봇 다이얼로그 다시 표시
      toggleChatbotDialog(true);

      // 에러 메시지 처리
      if (chatStore) {
        chatStore.addMessage({
          id: Date.now(),
          position: 'left',
          text: 'Error occurred while processing screenshot: ' + error.message,
          isAI: true,
          timestamp: new Date().getTime(),
        });
      }
    }
  });

  // 마크다운 렌더러 초기화
  if (typeof marked !== 'undefined') {
    initializeMarkdownRenderer();
  }

  const chatInput = document.getElementById(UI_ELEMENTS.CHAT_INPUT);
  const sendButton = document.getElementById(UI_ELEMENTS.SEND_BUTTON);
  const resetButton = document.getElementById(UI_ELEMENTS.RESET_BUTTON);
  const chatMessages = document.getElementById(UI_ELEMENTS.CHAT_MESSAGES);

  if (!chatInput || !sendButton || !resetButton || !chatMessages) {
    return; // 필요한 요소가 없으면 초기화하지 않음
  }

  // 입력창 초기화
  chatInput.value = '';

  // 스크린샷 이벤트 리스너 설정
  window.addEventListener('takeScreenshotAndClose', async function () {
    if (chatStore) {
      try {
        // 챗봇 다이얼로그 숨기기 (스크린샷을 위해)
        document.dispatchEvent(new Event('takeScreenshotAndCloseDialog'));
      } catch (error) {
        debugError('Screenshot event processing failed:', error);
        showToast('Error occurred while processing screenshot.');
      }
    }
  });

  // 상태 관리
  chatStore = {
    messages: [],
    isLoading: false,
    questionHistory: [],
    answerHistory: [],
    currentController: null,
    screenshotRequestCount: 0,

    initializeChat() {
      this.messages = [
        {
          id: Date.now(),
          position: 'left',
          text: DEFAULT_MESSAGES.WELCOME,
          isAI: true,
          timestamp: new Date().getTime(),
        },
      ];
      this.questionHistory = [];
      this.answerHistory = [];
      this.screenshotRequestCount = 0;
      this.isLoading = false;
      this.renderMessages();
    },

    addMessage(message) {
      this.messages.push(message);
      this.renderMessages();
    },

    updateMessage(messageId, updates) {
      this.messages = this.messages.map((message) => (message.id === messageId ? { ...message, ...updates } : message));
      this.renderMessages();
    },

    setLoading(isLoading) {
      this.isLoading = isLoading;
      const loadingIndicator = document.getElementById(UI_ELEMENTS.LOADING_INDICATOR);
      if (loadingIndicator) {
        loadingIndicator.style.display = isLoading ? 'flex' : 'none';
      }
      updateButtonState();
    },

    addQuestion(question) {
      this.questionHistory.push(question);
    },

    addAnswer(answer) {
      this.answerHistory.push(answer);
    },

    resetQuestionHistory() {
      this.questionHistory = [];
      this.answerHistory = [];
    },

    getRecentQuestions(maxCount = 5) {
      return [...this.questionHistory].slice(-maxCount);
    },

    getRecentAnswers(maxCount = 5) {
      return [...this.answerHistory].slice(-maxCount);
    },

    addNewSessionMessage() {
      const newSessionMessage = {
        id: Date.now(),
        position: 'left',
        text: DEFAULT_MESSAGES.NEW_SESSION,
        isAI: true,
        timestamp: new Date().getTime(),
      };
      this.addMessage(newSessionMessage);
    },

    createUserMessage(text) {
      return {
        id: Date.now() + 1,
        position: 'right',
        text,
        isAI: false,
        timestamp: new Date().getTime(),
      };
    },

    createAIMessage() {
      return {
        id: Date.now() + 2,
        position: 'left',
        text: '',
        isAI: true,
        isStreaming: true,
        timestamp: new Date().getTime(),
      };
    },

    // 캡처된 이미지를 표시하는 메서드 추가
    displayCapturedImage(imageData) {
      const userMessage = {
        id: Date.now() + 1,
        position: 'right',
        text: DEFAULT_MESSAGES.SCREENSHOT_CAPTURED,
        isAI: false,
        timestamp: new Date().getTime(),
        imageData: imageData,
        isCapturedImage: true, // 캡처된 이미지임을 표시
      };
      this.addMessage(userMessage);
    },

    async handleMessageProcess(messageData, apiMethod, apiArgs) {
      const aiMessage = this.createAIMessage();
      this.addMessage(aiMessage);

      let fullOriginalAnswer = '';

      try {
        this.setLoading(true);

        // 이전 요청이 있으면 중단
        if (this.currentController) {
          this.currentController.abort();
          this.currentController = null;
        }

        // 새 컨트롤러 생성
        this.currentController = new AbortController();

        const handleChunkReceived = (chunk, isDone, relevantDocs) => {
          fullOriginalAnswer += chunk;
          const processedText = isDone && chunk ? formatText(chunk) : formatText(fullOriginalAnswer);

          if (isDone) {
            this.updateMessage(aiMessage.id, {
              text: processedText,
              isStreaming: false,
              relevantDocs: relevantDocs,
            });

            this.setLoading(false);

            if (apiMethod === this.askQuestion || apiMethod === this.analyzeScreenshot) {
              this.addAnswer(processedText);
            }

            // 코파일럿 ID와 userContext는 리셋하기 전까지 유지
            // selectedCopilotId = null;
            // selectedUserContext = null;

            setTimeout(() => {
              if (this.isLoading) {
                this.setLoading(false);
              }
            }, 500);
          } else {
            this.updateMessage(aiMessage.id, {
              text: processedText,
              isStreaming: true,
            });
          }
        };

        try {
          const result = await apiMethod.apply(this, [...apiArgs, handleChunkReceived]);
          if (!result.success) {
            this.updateMessage(aiMessage.id, {
              text: result.answer || ERROR_MESSAGES.DEFAULT,
              isStreaming: false,
            });
            this.setLoading(false);
          }
          return result.success;
        } catch (error) {
          debugError('Message processing failed:', error);
          debugError('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
          });

          this.updateMessage(aiMessage.id, {
            text: ERROR_MESSAGES.DEFAULT,
            isStreaming: false,
          });
          this.setLoading(false);
          return false;
        }
      } catch (error) {
        debugError('Outer message processing failed:', error);
        debugError('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack,
        });

        this.updateMessage(aiMessage.id, {
          text: ERROR_MESSAGES.DEFAULT,
          isStreaming: false,
        });
        this.setLoading(false);
        return false;
      }
    },

    async sendMessage(inputText) {
      const trimmedText = inputText.trim();
      if (trimmedText === '' || this.isLoading) {
        return false;
      }

      // 사용자가 직접 질문을 입력했을 때 코파일럿 메뉴 숨기기
      const chatMessages = document.getElementById(UI_ELEMENTS.CHAT_MESSAGES);
      const copilotMenuContent = chatMessages?.querySelector('.copilot-menu-content');
      if (copilotMenuContent) {
        copilotMenuContent.style.display = 'none';
      }

      this.addQuestion(trimmedText);
      const userMessage = this.createUserMessage(trimmedText);
      this.addMessage(userMessage);

      const previousQuestions = this.getRecentQuestions(5);
      const previousAnswers = this.getRecentAnswers(5);

      // 코파일럿 메뉴를 통해 입력된 질문인지 확인 (selectedCopilotId가 설정되었는지로 판단)
      const isCopilotQuestion = selectedCopilotId !== null;

      const recommendType = isCopilotQuestion ? RECOMMEND_TYPES.COPILOT : RECOMMEND_TYPES.MESSAGE;

      // 캡처된 이미지가 있으면 스크린샷 분석으로 전송
      if (capturedImageData) {
        const imageData = capturedImageData;
        capturedImageData = null; // 사용 후 초기화

        const result = await this.handleMessageProcess(userMessage, this.analyzeScreenshot, [
          trimmedText,
          imageData,
          recommendType,
        ]);
        return result;
      } else {
        const result = await this.handleMessageProcess(userMessage, this.askQuestion, [
          trimmedText,
          previousQuestions,
          previousAnswers,
          recommendType,
        ]);
        return result;
      }
    },

    async sendScreenshot(question, imageBase64) {
      this.screenshotRequestCount++;
      const questionWithSequence = `${DEFAULT_MESSAGES.SCREENSHOT_QUESTION} (${this.screenshotRequestCount})`;
      this.addQuestion(questionWithSequence);

      // 유저 메시지 추가 (이미지 표시 및 질문 포함)
      const userMessage = {
        id: Date.now() + 1,
        position: 'right',
        text: question,
        isAI: false,
        timestamp: new Date().getTime(),
        imageData: imageBase64, // 이미지 데이터 추가
      };
      this.addMessage(userMessage);

      return this.handleMessageProcess(userMessage, this.analyzeScreenshot, [question, imageBase64]);
    },

    async askQuestion(
      question,
      previousQuestions = [],
      previousAnswers = [],
      recommend = null,
      onChunkReceived = null,
    ) {
      const useStreaming = typeof onChunkReceived === 'function';
      const payload = {
        question: question,
        previousQuestions: previousQuestions,
        previousAnswers: previousAnswers,
        streaming: useStreaming,
      };

      // recommend 파라미터가 있으면 payload에 추가
      if (recommend) {
        payload.recommend = recommend;
      }

      return this.makeApiCall(API_ENDPOINTS.ASK, payload, onChunkReceived);
    },

    async analyzeScreenshot(question, imageBase64, recommend = null, onChunkReceived = null) {
      const useStreaming = typeof onChunkReceived === 'function';
      const payload = {
        question: question,
        image: imageBase64,
        streaming: useStreaming,
      };

      // recommend 파라미터가 있으면 payload에 추가
      if (recommend) {
        payload.recommend = recommend;
      }

      return this.makeApiCall(API_ENDPOINTS.SCREENSHOT, payload, onChunkReceived);
    },

    async makeApiCall(endpoint, payload, onChunkReceived = null) {
      const useStreaming = typeof onChunkReceived === 'function';
      const url = BASE_URL + endpoint;

      // hsnam 250616: 현재 페이지의 pcode와 platform 정보 추가
      const pcode = projectCache.extractPcodeFromUrl();
      if (pcode) {
        const platform = await projectCache.getPlatform(pcode);
        if (platform) {
          payload.pcode = pcode;
          payload.platform = platform;
        }
      } else {
        // pcode가 없으면 현재 프로젝트 정보를 로딩 시도
        const currentPlatform = await projectCache.loadCurrentProject();
        if (currentPlatform) {
          const currentPcode = projectCache.extractPcodeFromUrl();
          if (currentPcode) {
            payload.pcode = currentPcode;
            payload.platform = currentPlatform;
          }
        }
      }

      // 선택된 코파일럿 ID가 있으면 payload에 추가
      if (selectedCopilotId) {
        payload.copilot_id = selectedCopilotId;
        debugLog('코파일럿 ID 추가됨:', selectedCopilotId);
      }

      // 선택된 userContext가 있으면 payload에 추가
      if (selectedUserContext && Array.isArray(selectedUserContext) && selectedUserContext.length > 0) {
        try {
          const userContextString = await getUserContext(selectedUserContext);
          if (userContextString) {
            payload.userContext = userContextString;
            debugLog('userContext 추가됨:', selectedUserContext);
          }
        } catch (error) {
          debugError('userContext 처리 중 오류:', error);
        }
      }

      if (useStreaming) {
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            signal: this.currentController.signal,
          });

          return await processStreamingResponse(response, onChunkReceived);
        } catch (error) {
          debugError('Streaming API call failed:', error);
          debugError('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            response: error.response,
          });

          if (error.name === 'AbortError') {
            return {
              success: false,
              answer: ERROR_MESSAGES.ABORTED,
            };
          }

          onChunkReceived(ERROR_MESSAGES.DEFAULT, true);

          return {
            success: false,
            answer: ERROR_MESSAGES.DEFAULT,
          };
        }
      } else {
        try {
          const response = await ky
            .post(url, {
              json: payload,
              signal: this.currentController.signal,
            })
            .json();

          let processedAnswer = '';
          if (response.data && response.data.answer) {
            processedAnswer = formatText(response.data.answer);
          } else {
            processedAnswer = ERROR_MESSAGES.UNKNOWN_FORMAT;
          }

          return {
            success: response.data.status !== 'error',
            answer: processedAnswer,
            relevantDocs: response.data.relevant_docs || [],
          };
        } catch (error) {
          debugError('Non-streaming API call failed:', error);
          debugError('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            response: error.response,
          });

          if (error.name === 'AbortError') {
            return {
              success: false,
              answer: ERROR_MESSAGES.ABORTED,
            };
          }

          if (error.response && error.response.data) {
            return {
              success: false,
              answer: error.response.data.answer || ERROR_MESSAGES.DEFAULT,
            };
          }

          return {
            success: false,
            answer: ERROR_MESSAGES.CONNECTION,
          };
        }
      }
    },

    resetChat() {
      this.messages = [];
      this.questionHistory = [];
      this.answerHistory = [];
      this.isLoading = false;
      this.isFullScreen = false;

      // 코파일럿 ID와 userContext 초기화 (리셋 버튼 클릭 시에만)
      selectedCopilotId = null;
      selectedUserContext = null;

      // UI 초기화
      const chatMessages = document.getElementById(UI_ELEMENTS.CHAT_MESSAGES);
      if (chatMessages) {
        chatMessages.innerHTML = '';
      }

      const chatInput = document.getElementById(UI_ELEMENTS.CHAT_INPUT);
      if (chatInput) {
        chatInput.value = '';
        window.adjustTextareaHeight();
      }

      // 안내 메시지 먼저 표시
      this.initializeChat();

      // 코파일럿 메뉴 다시 표시
      renderCopilotMenu();

      // 토글 버튼 숨기기
      const copilotMenuToggle = document.getElementById(UI_ELEMENTS.COPILOT_MENU_TOGGLE);
      if (copilotMenuToggle) {
        copilotMenuToggle.style.display = 'none';
      }

      debugLog('챗봇 대화가 초기화되었습니다.');
    },

    renderRecommendedQuestions(questions) {
      const recommendedQuestionsContainer = document.createElement('div');
      recommendedQuestionsContainer.className = 'flex flex-col items-start p-4 gap-2 w-full mt-3';

      const initialQuestions = questions.slice(0, 3);
      const remainingQuestions = questions.slice(3);

      // 추천 질문 버튼 생성 함수
      const createQuestionButton = (question, container) => {
        const button = document.createElement('button');
        button.className =
          'flex items-center cursor-pointer transition-all duration-200 ease-in-out text-sm font-medium text-center';
        button.style =
          'padding: 4px 8px; font-size: 14px; font-weight: 500; border: 1px solid #EAEAEA; border-radius: 4px; background-color: #FFFFFF; color: #222222; cursor: pointer; transition: all 0.2s; width: fit-content; min-height: 28px; white-space: nowrap;';
        button.textContent = question;

        // 마우스 오버 이벤트
        button.addEventListener('mouseenter', function () {
          this.style.backgroundColor = '#FFFFFF';
          this.style.color = '#296CF2';
          this.style.borderColor = '#296CF2';
        });

        button.addEventListener('mouseleave', function () {
          if (this.style.backgroundColor !== '#3b82f6') {
            this.style.backgroundColor = '#FFFFFF';
            this.style.color = '#222222';
            this.style.borderColor = '#EAEAEA';
          }
        });

        // 클릭 이벤트
        button.addEventListener('click', () => {
          const chatInput = document.getElementById(UI_ELEMENTS.CHAT_INPUT);
          if (chatInput) {
            // 모든 버튼 상태 초기화
            container.querySelectorAll('button').forEach((btn) => {
              btn.style.backgroundColor = '#FFFFFF';
              btn.style.color = '#222222';
              btn.style.borderColor = '#EAEAEA';
            });

            // 선택된 버튼 상태 변경
            button.style.backgroundColor = '#3b82f6';
            button.style.color = '#FFFFFF';
            button.style.borderColor = '#3b82f6';

            chatInput.value = question;
            chatInput.focus();
            chatInput.dispatchEvent(new Event('input', { bubbles: true }));
            window.adjustTextareaHeight();
          }

          // 추천 프롬프트 선택 후 코파일럿 메뉴 숨기기
          const chatMessages = document.getElementById(UI_ELEMENTS.CHAT_MESSAGES);
          const copilotMenuContent = chatMessages?.querySelector('.copilot-menu-content');
          if (copilotMenuContent) {
            copilotMenuContent.style.display = 'none';
          }
        });

        return button;
      };

      // 버튼들을 컨테이너에 추가하는 함수
      const addButtonsToContainer = (questionsToAdd) => {
        questionsToAdd.forEach((question) => {
          const button = createQuestionButton(question, recommendedQuestionsContainer);
          recommendedQuestionsContainer.appendChild(button);
        });
      };

      // 처음 3개 질문 표시
      addButtonsToContainer(initialQuestions);

      // 나머지 질문들이 있으면 "+" 버튼 추가
      if (remainingQuestions.length > 0) {
        const showMoreButton = document.createElement('button');
        showMoreButton.className =
          'flex items-center cursor-pointer transition-all duration-200 ease-in-out text-sm font-medium text-center';
        showMoreButton.style =
          'padding: 4px 8px; font-size: 14px; font-weight: 500; border: 1px solid #EAEAEA; border-radius: 4px; background-color: #FFFFFF; color: #222222; cursor: pointer; transition: all 0.2s; width: fit-content; min-height: 28px; white-space: nowrap;';
        showMoreButton.innerHTML = `+ ${remainingQuestions.length} more`;

        // 마우스 오버 이벤트
        showMoreButton.addEventListener('mouseenter', function () {
          this.style.backgroundColor = '#FFFFFF';
          this.style.color = '#296CF2';
          this.style.borderColor = '#296CF2';
        });

        showMoreButton.addEventListener('mouseleave', function () {
          this.style.backgroundColor = '#FFFFFF';
          this.style.color = '#222222';
          this.style.borderColor = '#EAEAEA';
        });

        // "+" 버튼 클릭 이벤트
        showMoreButton.addEventListener('click', () => {
          recommendedQuestionsContainer.innerHTML = '';
          addButtonsToContainer(questions);
        });

        recommendedQuestionsContainer.appendChild(showMoreButton);
      }

      return recommendedQuestionsContainer;
    },

    renderMessages() {
      const chatMessages = document.getElementById(UI_ELEMENTS.CHAT_MESSAGES);
      chatMessages.innerHTML = '';

      this.messages.forEach((message) => {
        const messageContainer = document.createElement('div');
        messageContainer.className = `message-container flex items-start gap-2 ${message.isAI ? '' : 'justify-end'}`;

        const outerDiv = document.createElement('div');
        outerDiv.style.maxWidth = message.isAI ? '100%' : '80%';

        const nameDiv = document.createElement('div');
        nameDiv.style.fontSize = '13px';
        nameDiv.style.color = '#4C4C4C';
        nameDiv.style.fontWeight = 'normal';
        if (!message.isAI) {
          nameDiv.style.textAlign = 'right';
        }
        nameDiv.innerHTML = message.isAI ? `<div class="flex items-center gap-2">${aiIconHTML(20)}</div>` : 'Me';

        const msgDiv = document.createElement('div');
        msgDiv.className = `break-all mt-1 px-4 py-1 ${message.isAI ? 'rounded-[0_8px_8px_8px]' : 'rounded-[8px_0_8px_8px]'}`;
        msgDiv.style.backgroundColor = message.isAI ? '#ffffff' : 'rgba(41,108,242,0.1)';
        msgDiv.style.fontSize = '13px';
        msgDiv.style.color = '#222';
        msgDiv.style.overflowWrap = 'break-word';

        // 폰트 스타일 조정
        if (message.position === 'right') {
          msgDiv.style.fontWeight = '400'; // 사용자 메시지 폰트 가중치 조정
        }

        // 이미지 데이터가 있으면 이미지를 추가
        if (message.imageData) {
          const imageContainer = document.createElement('div');
          imageContainer.className = 'mb-3';

          const image = document.createElement('img');
          image.src = `data:image/jpeg;base64,${message.imageData}`;
          image.className = 'screenshot-image';
          image.style.maxHeight = '300px';
          image.style.objectFit = 'contain';
          image.style.width = '100%';
          image.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';

          imageContainer.appendChild(image);
          msgDiv.appendChild(imageContainer);
        }

        // 캡처된 이미지인 경우 추가 안내 메시지 표시
        if (message.isCapturedImage) {
          const infoDiv = document.createElement('div');
          infoDiv.className = 'mt-2 text-xs text-gray-500 italic';
          infoDiv.textContent = DEFAULT_MESSAGES.SCREENSHOT_GUIDE;
          msgDiv.appendChild(infoDiv);
        }

        // 일반 텍스트 대신 마크다운으로 렌더링
        if (message.text) {
          const textContainer = document.createElement('div');

          // MXQL 실행이 필요한지 확인
          if (
            message.relevantDocs &&
            message.relevantDocs.mxqlExecutes &&
            message.text.includes('####QUERY_RESULT_PLACEHOLDER####')
          ) {
            // 로딩 상태로 먼저 렌더링
            textContainer.innerHTML = renderMarkdown(
              message.text.replace(
                '####QUERY_RESULT_PLACEHOLDER####',
                '<div class="text-sm text-gray-500">MXQL 실행 중...</div>',
              ),
            );
            msgDiv.appendChild(textContainer);

            // 비동기로 MXQL 실행 결과를 마크다운으로 생성하고 텍스트에 삽입
            executeMxqlAndRenderMarkdown(message.relevantDocs.mxqlExecutes)
              .then((markdownResult) => {
                const finalText = message.text.replace('####QUERY_RESULT_PLACEHOLDER####', markdownResult);
                textContainer.innerHTML = renderMarkdown(finalText);
              })
              .catch((error) => {
                debugError('MXQL 렌더링 오류:', error);
                const errorText = message.text.replace(
                  '####QUERY_RESULT_PLACEHOLDER####',
                  '\n\n## MXQL 실행 오류\n\n실행 중 오류가 발생했습니다.\n',
                );
                textContainer.innerHTML = renderMarkdown(errorText);
              });
          } else {
            // 일반 텍스트 렌더링
            textContainer.innerHTML = renderMarkdown(message.text);
            msgDiv.appendChild(textContainer);
          }
        }

        // 추천 질문 렌더링
        if (
          message.isAI &&
          message.relevantDocs &&
          message.relevantDocs.recommendedQuestions &&
          Array.isArray(message.relevantDocs.recommendedQuestions) &&
          message.relevantDocs.recommendedQuestions.length > 0
        ) {
          const recommendedQuestionsContainer = this.renderRecommendedQuestions(
            message.relevantDocs.recommendedQuestions,
          );
          msgDiv.appendChild(recommendedQuestionsContainer);
        }

        outerDiv.appendChild(nameDiv);
        outerDiv.appendChild(msgDiv);

        messageContainer.appendChild(outerDiv);
        chatMessages.appendChild(messageContainer);
      });

      // 로딩 인디케이터
      const loadingIndicator = document.createElement('div');
      loadingIndicator.id = UI_ELEMENTS.LOADING_INDICATOR;
      loadingIndicator.className = 'flex items-center justify-start gap-2 text-gray-500';
      loadingIndicator.style.display = this.isLoading ? 'flex' : 'none';
      loadingIndicator.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500">
                  <path d="M2 12a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V7H2Z"></path>
                  <path d="M6 11V7a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v4"></path>
              </svg>
              <span>${t('LOADING_GENERATING')}</span>
          `;
      chatMessages.appendChild(loadingIndicator);

      // 스크롤을 아래로 이동
      scrollToBottom();
    },
  };

  // 스크롤을 아래로 이동하는 함수
  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // 버튼 상태 업데이트 함수
  function updateButtonState() {
    const trimmedText = chatInput.value.trim();
    const shouldDisable = !trimmedText || chatStore.isLoading;

    if (shouldDisable) {
      sendButton.classList.remove(...CSS_CLASSES.SEND_BUTTON.ENABLED);
      sendButton.classList.add(...CSS_CLASSES.SEND_BUTTON.DISABLED);
      sendButton.disabled = true;
    } else {
      sendButton.classList.remove(...CSS_CLASSES.SEND_BUTTON.DISABLED);
      sendButton.classList.add(...CSS_CLASSES.SEND_BUTTON.ENABLED);
      sendButton.disabled = false;
    }
  }

  // Textarea 높이 조절 (전역 함수로 이동)
  window.adjustTextareaHeight = function () {
    const chatInput = document.getElementById(UI_ELEMENTS.CHAT_INPUT);
    if (!chatInput) {
      return;
    }

    chatInput.style.height = 'auto';
    const maxRows = 10;
    const lineHeight = parseFloat(getComputedStyle(chatInput).lineHeight) || 20;
    const padding =
      parseFloat(getComputedStyle(chatInput).paddingTop) + parseFloat(getComputedStyle(chatInput).paddingBottom);
    const maxHeight = lineHeight * maxRows + padding;
    chatInput.style.height = Math.min(chatInput.scrollHeight, maxHeight) + 'px';
  };

  // 입력 변경 이벤트
  chatInput.addEventListener('input', function (e) {
    updateButtonState();
    window.adjustTextareaHeight();

    // 입력 길이 계산 및 제한
    const length = e.target.value.length;
    const $chatInputLength = document.getElementById(UI_ELEMENTS.CHAT_INPUT_LENGTH);
    $chatInputLength.textContent = `${length} / 3000 ${UI_MESSAGES.CHARACTER_COUNT}`;
    if (length >= 3000) {
      e.target.value = e.target.value.slice(0, 3000);
      $chatInputLength.style.color = '#FFA1A1';
    } else {
      $chatInputLength.style = {};
    }
  });

  // 키 이벤트
  chatInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!sendButton.disabled) {
        sendMessage();
      }
    }
  });

  // 전송 버튼 이벤트
  sendButton.addEventListener('click', sendMessage);

  // 초기화 버튼 이벤트
  resetButton.addEventListener('click', function () {
    chatStore.resetChat();
  });

  // 메시지 전송 함수
  function sendMessage() {
    const inputText = chatInput.value;
    if (inputText.trim() && !chatStore.isLoading) {
      chatStore.sendMessage(inputText);
      updateButtonState();
      setTimeout(() => {
        chatInput.focus();
        chatInput.value = '';
        document.getElementById(UI_ELEMENTS.CHAT_INPUT_LENGTH).textContent = `0 / 3000 ${UI_MESSAGES.CHARACTER_COUNT}`;
      }, 48);
    }
  }

  // 초기화
  chatStore.initializeChat();
  chatInput.focus();
}

// 화면 캡처 기능
async function captureScreenshot() {
  try {
    // html2canvas 라이브러리 로드 (필요한 경우)
    if (!screenshotLibLoaded) {
      await loadScreenshotLibrary();
      screenshotLibLoaded = true;
    }

    // 화면 캡처
    const canvas = await html2canvas(document.body);
    return canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
  } catch (error) {
    debugError('Screenshot capture failed:', error);
    throw error;
  }
}

// 다이얼로그 표시/숨김 유틸리티
function toggleChatbotDialog(show) {
  const chatbotDialog = document.getElementById(UI_ELEMENTS.CHATBOT_DIALOG);

  if (chatbotDialog) {
    chatbotDialog.style.display = show ? 'block' : 'none';
  }
}

// 전체화면 토글 함수
function toggleFullScreen() {
  const chatbotDialog = document.getElementById(UI_ELEMENTS.CHATBOT_DIALOG);
  const fullScreenButton = document.getElementById(UI_ELEMENTS.FULL_SCREEN_BUTTON);

  if (!chatbotDialog || !fullScreenButton) {
    return;
  }

  isFullScreen = !isFullScreen;

  if (isFullScreen) {
    // 전체화면 모드로 전환
    chatbotDialog.style.position = 'fixed';
    chatbotDialog.style.top = '0';
    chatbotDialog.style.left = '0';
    chatbotDialog.style.width = '100vw';
    chatbotDialog.style.height = '100vh';
    chatbotDialog.style.zIndex = '9999';
    chatbotDialog.style.borderRadius = '0';
    chatbotDialog.style.boxShadow = 'none';

    // 버튼 툴팁 변경
    fullScreenButton.title = UI_MESSAGES.FULLSCREEN_EXIT;

    // 아이콘 변경 (전체화면 해제 아이콘으로)
    fullScreenButton.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M12.4723 4.69111L10.788 4.69111L10.788 9.35749L15.4544 9.35749L15.4544 7.67317L12.4723 7.67317L12.4723 4.69111Z" fill="#757575"/>
<rect width="1.70142" height="6.80568" transform="matrix(-0.707107 -0.707106 -0.707107 0.707106 17.5 3.70298)" fill="#757575"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M4.42047 12.4725L4.42047 10.7882L9.08685 10.7882L9.08685 15.4546L7.40253 15.4546V12.4725L4.42047 12.4725Z" fill="#757575"/>
<rect width="1.70142" height="6.80568" transform="matrix(-0.707107 -0.707106 0.707107 -0.707106 3.70312 17.5)" fill="#757575"/>
</svg>`;
  } else {
    // 일반 모드로 복원
    chatbotDialog.style.position = '';
    chatbotDialog.style.top = '';
    chatbotDialog.style.left = '';
    chatbotDialog.style.width = '';
    chatbotDialog.style.height = '';
    chatbotDialog.style.zIndex = '';
    chatbotDialog.style.borderRadius = '';
    chatbotDialog.style.boxShadow = '';

    // 버튼 툴팁 변경
    fullScreenButton.title = UI_MESSAGES.FULLSCREEN;

    // 아이콘 복원 (전체화면 아이콘으로)
    fullScreenButton.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M4.18509 12.5001L2.49983 12.5001L2.50013 17.5001L7.50039 17.5001L7.50047 15.8334L4.18548 15.8334L4.18509 12.5001Z" fill="#757575"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M15.8279 7.5003L17.5132 7.5003L17.5129 2.50027L12.5126 2.50027L12.5125 4.16699L15.8275 4.16699L15.8279 7.5003Z" fill="#757575"/>
<rect width="1.66667" height="7.08482" transform="matrix(-0.707107 -0.707107 -0.707107 0.707107 9.52161 11.9602)" fill="#757575"/>
<rect width="1.66667" height="7.08479" transform="matrix(0.707107 0.707107 0.707107 -0.707107 10.4916 8.3431)" fill="#757575"/>
</svg>

    `;
  }
}

// 코파일럿 갤러리 데이터 가져오기
async function fetchCopilotGalleries() {
  try {
    const response = await fetch(`${BASE_URL}${API_ENDPOINTS.COPILOT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    const data = await response.json();

    if (data.status == 'success' && data.data) {
      copilotGalleries = data.data;
      debugLog('코파일럿 갤러리 로드 완료:', copilotGalleries);
      return true;
    } else {
      debugError('코파일럿 갤러리 로드 실패:', data);
      return false;
    }
  } catch (error) {
    debugError('코파일럿 갤러리 API 호출 실패:', error);
    return false;
  }
}

// 코파일럿 메뉴 데이터 (기본값)
const DEFAULT_COPILOT_MENU_ITEMS = [];

// 코파일럿 갤러리를 메뉴 아이템으로 변환
function convertGalleriesToMenuItems() {
  if (!copilotGalleries || copilotGalleries.length === 0) {
    return DEFAULT_COPILOT_MENU_ITEMS;
  }

  return copilotGalleries.map((gallery) => ({
    category: gallery.name,
    description: gallery.description,
    id: gallery.id,
    items: gallery.recommendedQuestions.map((question) => ({
      title: question,
      question: question,
      copilotId: gallery.id,
      systemPrompt: gallery.systemPrompt,
      userPrompt: gallery.userPrompt,
      userContext: gallery.userContext || [], // userContext 추가
    })),
  }));
}

// 코파일럿 메뉴 렌더링 함수
function renderCopilotMenu() {
  const chatMessages = document.getElementById(UI_ELEMENTS.CHAT_MESSAGES);
  if (!chatMessages) {
    return;
  }

  // 기존 코파일럿 메뉴 요소 제거
  const existingCopilotMenu = chatMessages.querySelector('.copilot-menu-content');
  if (existingCopilotMenu) {
    existingCopilotMenu.remove();
  }

  const menuItems = convertGalleriesToMenuItems();
  if (menuItems.length === 0) {
    return;
  }

  // AI 안내 메시지 찾기
  const aiMessage = chatMessages.querySelector('.message-container');
  if (!aiMessage) {
    return;
  }

  // AI 메시지의 msgDiv 찾기
  const msgDiv = aiMessage.querySelector('.break-all');
  if (!msgDiv) {
    return;
  }

  // 코파일럿 메뉴 컨테이너 생성
  const copilotMenuContent = document.createElement('div');
  copilotMenuContent.className = 'copilot-menu-content';
  copilotMenuContent.style.cssText = `
    margin-top: 16px;
    padding-top: 16px;
  `;

  // 카테고리 버튼들을 감싸는 컨테이너
  const categoryButtonsContainer = document.createElement('div');
  categoryButtonsContainer.style.cssText = `
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
    flex-wrap: wrap;
  `;

  // 각 카테고리별 아이템 컨테이너를 저장할 객체
  const categoryItemsContainers = {};

  menuItems.forEach((category, categoryIndex) => {
    // 카테고리 헤더 (클릭 가능한 버튼)
    const categoryHeader = document.createElement('button');
    categoryHeader.className = 'copilot-category-header';
    categoryHeader.style.cssText = `
      font-size: 10px;
      font-weight: 500;
      color: #6b7280;
      padding: 8px 12px;
      background-color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: all 0.2s ease;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      text-align: left;
      outline: none;
      white-space: nowrap;
      flex-shrink: 0;
    `;

    const headerText = document.createElement('span');
    headerText.textContent = category.category;
    headerText.style.cssText = `
      font-size: 12px;
      font-weight: 500;
      color: #6b7280;
      letter-spacing: -0.025em;
    `;

    const arrowIcon = document.createElement('svg');
    arrowIcon.className = 'category-arrow';
    arrowIcon.style.cssText = `
      width: 12px;
      height: 12px;
      transition: transform 0.2s ease;
      color: #9ca3af;
      flex-shrink: 0;
      margin-left: 6px;
    `;
    arrowIcon.innerHTML =
      '<polyline points="6,9 12,15 18,9" stroke="currentColor" stroke-width="2" fill="none"></polyline>';

    categoryHeader.appendChild(headerText);
    categoryHeader.appendChild(arrowIcon);

    // 카테고리 아이템 컨테이너 (초기에는 숨김)
    const categoryItemsContainer = document.createElement('div');
    categoryItemsContainer.className = 'copilot-category-items';
    categoryItemsContainer.style.cssText = `
      display: none;
      background-color: white;
      padding: 12px 0px;
      margin-bottom: 12px;
    `;

    // 버튼들을 감싸는 컨테이너
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.cssText = `
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    `;

    // 카테고리 아이템들 생성 (버튼 형태)
    category.items.forEach((item) => {
      const menuButton = document.createElement('button');
      menuButton.className = 'copilot-menu-button';
      menuButton.style.cssText = `
        padding: 10px 16px;
        margin: 0;
        cursor: pointer;
        border-radius: 8px;
        transition: all 0.2s ease;
        font-size: 11px;
        color: #333;
        background-color: white;
        border: 1px solid #d1d5db;
        white-space: nowrap;
        flex-shrink: 0;
        font-weight: 500;
        line-height: 1.4;
      `;
      menuButton.textContent = item.title;

      // 마우스 오버 이벤트
      menuButton.addEventListener('mouseenter', function () {
        this.style.backgroundColor = 'white';
        this.style.borderColor = '#296CF2';
        this.style.color = '#296CF2';
      });

      menuButton.addEventListener('mouseleave', function () {
        this.style.backgroundColor = 'white';
        this.style.borderColor = '#d1d5db';
        this.style.color = '#333';
      });

      // 클릭 이벤트
      menuButton.addEventListener('click', () => {
        if (chatStore) {
          const chatInput = document.getElementById(UI_ELEMENTS.CHAT_INPUT);
          if (chatInput) {
            chatInput.value = item.question;
            chatInput.focus();
            chatInput.dispatchEvent(new Event('input', { bubbles: true }));
            window.adjustTextareaHeight();
          }

          // 코파일럿 ID 설정
          if (item.copilotId) {
            selectedCopilotId = item.copilotId;
            debugLog('선택된 코파일럿 ID:', selectedCopilotId);
          }

          // userContext 설정
          if (item.userContext && Array.isArray(item.userContext) && item.userContext.length > 0) {
            selectedUserContext = item.userContext;
            debugLog('선택된 userContext:', selectedUserContext);
          } else {
            selectedUserContext = null;
          }

          // 추천 프롬프트 선택 후 코파일럿 메뉴 숨기기
          const copilotMenuContent = chatMessages.querySelector('.copilot-menu-content');
          if (copilotMenuContent) {
            copilotMenuContent.style.display = 'none';
          }
        }
      });

      buttonsContainer.appendChild(menuButton);
    });

    // 카테고리 헤더 클릭 이벤트
    categoryHeader.addEventListener('click', () => {
      const isVisible = categoryItemsContainer.style.display !== 'none';

      // 모든 카테고리 아이템 컨테이너 숨기기
      Object.values(categoryItemsContainers).forEach((container) => {
        container.style.display = 'none';
      });

      // 모든 카테고리 헤더 스타일 초기화
      const allHeaders = document.querySelectorAll('.copilot-category-header');
      allHeaders.forEach((header) => {
        const headerText = header.querySelector('span');
        const arrowIcon = header.querySelector('.category-arrow');
        if (headerText && arrowIcon) {
          header.style.backgroundColor = 'white';
          header.style.borderColor = '#e2e8f0';
          headerText.style.color = '#6b7280';
          arrowIcon.style.color = '#9ca3af';
          arrowIcon.style.transform = 'rotate(0deg)';
        }
      });

      if (isVisible) {
        // 현재 카테고리 아이템 숨기기
        categoryItemsContainer.style.display = 'none';
        arrowIcon.style.transform = 'rotate(0deg)';
        categoryHeader.style.backgroundColor = 'white';
        categoryHeader.style.borderColor = '#e2e8f0';
        headerText.style.color = '#6b7280';
        arrowIcon.style.color = '#9ca3af';
      } else {
        // 현재 카테고리 아이템 보이기
        categoryItemsContainer.style.display = 'block';
        arrowIcon.style.transform = 'rotate(180deg)';
        categoryHeader.style.backgroundColor = 'white';
        categoryHeader.style.borderColor = '#296CF2';
        headerText.style.color = '#296CF2';
        arrowIcon.style.color = '#296CF2';
      }
    });

    // 마우스 오버 이벤트
    categoryHeader.addEventListener('mouseenter', function () {
      if (categoryItemsContainer.style.display === 'none') {
        this.style.backgroundColor = 'white';
        this.style.borderColor = '#296CF2';
        headerText.style.color = '#296CF2';
        arrowIcon.style.color = '#296CF2';
      }
    });

    categoryHeader.addEventListener('mouseleave', function () {
      if (categoryItemsContainer.style.display === 'none') {
        this.style.backgroundColor = 'white';
        this.style.borderColor = '#e2e8f0';
        headerText.style.color = '#6b7280';
        arrowIcon.style.color = '#9ca3af';
      }
    });

    categoryItemsContainer.appendChild(buttonsContainer);
    categoryButtonsContainer.appendChild(categoryHeader);

    // 카테고리별 아이템 컨테이너를 저장
    categoryItemsContainers[categoryIndex] = categoryItemsContainer;
  });

  // 카테고리 버튼 컨테이너를 먼저 추가
  copilotMenuContent.appendChild(categoryButtonsContainer);

  // 각 카테고리별 아이템 컨테이너를 순서대로 추가
  Object.values(categoryItemsContainers).forEach((container) => {
    copilotMenuContent.appendChild(container);
  });

  // AI 메시지 내부에 코파일럿 메뉴 추가
  msgDiv.appendChild(copilotMenuContent);
}

// 코파일럿 메뉴 토글 함수
function toggleCopilotMenu() {
  const copilotMenu = document.getElementById(UI_ELEMENTS.COPILOT_MENU);
  const copilotMenuToggle = document.getElementById(UI_ELEMENTS.COPILOT_MENU_TOGGLE);
  const copilotMenuArrow = document.getElementById(UI_ELEMENTS.COPILOT_MENU_ARROW);

  if (!copilotMenu || !copilotMenuToggle || !copilotMenuArrow) {
    return;
  }

  const isVisible = copilotMenu.style.display !== 'none';

  if (isVisible) {
    // 메뉴 숨기기
    copilotMenu.style.display = 'none';
    copilotMenuToggle.querySelector('span').textContent = '💡 코파일럿 추천 메뉴 보기';
    copilotMenuArrow.style.transform = 'rotate(0deg)';
  } else {
    // 메뉴 보이기
    copilotMenu.style.display = 'block';
    renderCopilotMenu(); // 메뉴 내용 렌더링
    copilotMenuToggle.querySelector('span').textContent = '💡 코파일럿 추천 메뉴 숨기기';
    copilotMenuArrow.style.transform = 'rotate(180deg)';
  }
}
