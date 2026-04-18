import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from "motion/react";
import { Instagram, Send, Phone, Calendar as CalendarIcon, Quote } from "lucide-react";
import { useEffect, useState, useMemo } from "react";

// Initialize Gemini API
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface DateInfo {
  jalali: {
    day: string;
    month: string;
    weekday: string;
    year: string;
  };
  gregorian: {
    day: string;
    month: string;
    weekday: string;
    year: string;
  };
}

interface DailyQuote {
  fa: string;
  en: string;
}

export default function App() {
  const [dateInfo, setDateInfo] = useState<DateInfo | null>(null);
  const [quote, setQuote] = useState<DailyQuote>({
    fa: "صبر داشته باش و به مسیر اعتماد کن.",
    en: "Stay patient and trust the process."
  });
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);

  // Background image seed - shifted to a more corporate/modern desk feel
  const bgSeed = useMemo(() => {
    const today = new Date();
    return `taban_desk_${today.getFullYear()}${today.getMonth()}${today.getDate()}`;
  }, []);

  useEffect(() => {
    const today = new Date();

    // Format Jalali
    const jalaliFormatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      day: 'numeric',
      month: 'long',
      weekday: 'long',
      year: 'numeric'
    });
    const jalaliParts = jalaliFormatter.formatToParts(today);
    
    // Format Gregorian
    const gregorianFormatter = new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'long',
      weekday: 'long',
      year: 'numeric'
    });
    const gregorianParts = gregorianFormatter.formatToParts(today);

    const getPart = (parts: Intl.DateTimeFormatPart[], type: string) => 
      parts.find(p => p.type === type)?.value || "";

    setDateInfo({
      jalali: {
        day: getPart(jalaliParts, 'day'),
        month: getPart(jalaliParts, 'month'),
        weekday: getPart(jalaliParts, 'weekday'),
        year: getPart(jalaliParts, 'year')
      },
      gregorian: {
        day: getPart(gregorianParts, 'day'),
        month: getPart(gregorianParts, 'month'),
        weekday: getPart(gregorianParts, 'weekday'),
        year: getPart(gregorianParts, 'year')
      }
    });

    fetchDailyQuote();
  }, []);

  async function fetchDailyQuote() {
    setIsLoadingQuote(true);
    try {
      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Generate a short, powerful motivational quote in both Persian (Farsi) and English. Keep it concise. Format the output as JSON: { \"fa\": \"...\", \"en\": \"...\" }",
        config: {
          responseMimeType: "application/json"
        }
      });
      
      const content = response.text;
      if (content) {
        const parsed = JSON.parse(content);
        setQuote(parsed);
      }
    } catch (error) {
      console.error("Error fetching quote:", error);
    } finally {
      setIsLoadingQuote(false);
    }
  }

  if (!dateInfo) return null;

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#05070a]">
      {/* Immersive Atmosphere */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 opacity-30"
          style={{ backgroundImage: `url('https://picsum.photos/seed/${bgSeed}/1920/1080?grayscale&blur=2')` }}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,#1a237e_0%,transparent_40%),radial-gradient(circle_at_80%_70%,#4a148c_0%,transparent_40%),radial-gradient(circle_at_50%_50%,#0d47a1_0%,transparent_60%)] opacity-30" />
        {/* Animated Glows */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[10%] w-[400px] h-[400px] bg-blue-500/15 blur-[100px] rounded-full" 
        />
        <motion.div 
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.1, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-purple-500/15 blur-[100px] rounded-full" 
        />
      </div>

      {/* Main Content Layout */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-h-screen lg:max-w-6xl px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-4 lg:gap-10 items-center justify-center py-4"
      >
        
        {/* Hero Date Card (Left Side) */}
        <div className="relative bg-white/[0.03] backdrop-blur-[40px] border border-white/[0.08] rounded-[2.5rem] lg:rounded-[3rem] p-6 lg:p-12 flex flex-col items-center justify-center text-center shadow-[0_40px_100px_rgba(0,0,0,0.5)] h-[320px] lg:h-[540px]">
          
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg lg:text-2xl font-light tracking-widest text-white/60 mb-1 lg:mb-2 uppercase"
          >
            {dateInfo.gregorian.weekday}
          </motion.span>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="text-[90px] lg:text-[180px] font-extrabold leading-none text-gradient my-1 lg:my-4 tracking-tighter"
          >
            {dateInfo.jalali.day}
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center gap-0 lg:gap-1"
          >
            <span className="text-xl lg:text-3xl font-persian font-normal text-white">
              {dateInfo.jalali.month} {dateInfo.jalali.year}
            </span>
            <span className="text-[10px] lg:text-sm font-medium text-white/40 tracking-widest uppercase">
              {dateInfo.gregorian.month} {dateInfo.gregorian.day}, {dateInfo.gregorian.year}
            </span>
          </motion.div>

          <div className="absolute bottom-6 lg:bottom-10 left-12 right-12 h-px bg-white/10" />
          <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-8 pt-0 opacity-40 text-[8px] lg:text-[10px] tracking-[0.3em] uppercase text-white font-bold flex justify-center gap-2">
            <CalendarIcon className="w-3 h-3" />
            <span>Daily Immersive Calendar</span>
          </div>
        </div>

        {/* Info Tiles (Right Side) */}
        <div className="flex flex-col gap-3 lg:gap-6">
          
          {/* Quote Tile */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/[0.03] border border-white/[0.08] rounded-2xl lg:rounded-3xl p-4 lg:p-8 backdrop-blur-2xl"
          >
            <div className="text-[#4096ff] text-[9px] lg:text-[11px] font-bold font-persian uppercase tracking-widest mb-2 lg:mb-4 flex items-center gap-2">
              <Quote className="w-3 h-3" />
              <span>جمله انگیزشی روز</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={quote.fa}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-1 lg:space-y-3"
              >
                <p className="text-sm lg:text-xl font-persian font-medium leading-relaxed italic text-white/90">
                  {quote.fa}
                </p>
                <p className="text-[10px] lg:text-sm text-white/40 font-sans">
                  {quote.en}
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Business Tile */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/[0.03] border border-white/[0.08] rounded-2xl lg:rounded-3xl p-4 lg:p-8 backdrop-blur-2xl flex items-center gap-4 lg:gap-6"
          >
            <div className="w-12 h-12 lg:w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl lg:rounded-2xl flex items-center justify-center p-1.5 lg:p-2 shadow-2xl shadow-indigo-900/40 shrink-0">
               <img src="https://picsum.photos/seed/taban_corporate/100/100" alt="Taban Group Logo" className="w-full h-full object-contain filter brightness-110" referrerPolicy="no-referrer" />
            </div>
            <div className="flex flex-col gap-0 lg:gap-1">
              <div className="text-lg lg:text-2xl font-persian font-bold">گروه تابان</div>
              <a href="https://taban-group.com" target="_blank" rel="noopener noreferrer" className="text-[9px] lg:text-xs text-white/40 font-bold tracking-widest uppercase font-sans hover:text-[#4096ff] transition-colors underline decoration-white/20 underline-offset-4">taban-group.com</a>
            </div>
          </motion.div>

          {/* Social/Contact Tile */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/[0.03] border border-white/[0.08] rounded-2xl lg:rounded-3xl p-4 lg:p-8 backdrop-blur-2xl flex items-center justify-between"
          >
            <div className="flex flex-col gap-0 lg:gap-1">
              <div className="text-[#4096ff] text-[9px] lg:text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 font-persian">
                <Phone className="w-3 h-3" />
                <span>تماس با ما</span>
              </div>
              <span className="text-sm lg:text-lg font-mono font-medium tracking-tight text-white/80">+968 7174 6098</span>
            </div>
            <div className="flex gap-2 lg:gap-3">
              <a href="#" className="w-8 h-8 lg:w-10 h-10 bg-white/5 rounded-lg lg:rounded-xl border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Instagram className="w-4 h-4 lg:w-5 h-5 text-pink-400" />
              </a>
              <a href="#" className="w-8 h-8 lg:w-10 h-10 bg-white/5 rounded-lg lg:rounded-xl border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Send className="w-4 h-4 lg:w-5 h-5 text-sky-400" />
              </a>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </main>
  );
}
