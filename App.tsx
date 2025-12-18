
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Calendar, 
  MapPin, 
  Loader2, 
  Sparkles, 
  Sun, 
  Moon, 
  Info, 
  ArrowRightCircle, 
  Star, 
  Compass, 
  CalendarDays, 
  Zap,
  ChevronRight
} from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';
import { DISTRICTS } from './constants';
import { District, PanchangamData } from './types';

const App: React.FC = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<District>(DISTRICTS[2]); // Default Chennai
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<PanchangamData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'daily' | 'festivals' | 'transits'>('daily');

  const fetchPanchangam = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Generate a comprehensive Tamil Thirukanitha Panchangam for ${selectedDistrict.name} (${selectedDistrict.tamilName}) on ${selectedDate}.
      
      Requirements:
      1. All text content must be in Tamil.
      2. Daily Details: Tithi, Nakshatram, Yogam, Karanam, Rasi, Rahukalam, Yamagandam, Kuligai, Nalla Neram, Gowri Nalla Neram, Chandrashtamam.
      3. Planetary Positions: Current degrees and Rasi for Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, and Ketu.
      4. Festivals: List 3-5 major festivals or Vratams occurring in the current Tamil month of the selected date, including their significance.
      5. Transits: List the most significant planetary transits (especially Guru, Sani, Rahu/Ketu) occurring in the year of the selected date.
      6. Provide a concise spiritual summary for the day.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              panchangam: {
                type: Type.OBJECT,
                properties: {
                  tamilYear: { type: Type.STRING },
                  tamilMonth: { type: Type.STRING },
                  tamilDay: { type: Type.STRING },
                  ayanam: { type: Type.STRING },
                  ruthu: { type: Type.STRING },
                  tithi: { type: Type.STRING },
                  nakshatram: { type: Type.STRING },
                  yogam: { type: Type.STRING },
                  karanam: { type: Type.STRING },
                  rasi: { type: Type.STRING },
                  rahukalam: { type: Type.STRING },
                  yamagandam: { type: Type.STRING },
                  kuligai: { type: Type.STRING },
                  nallaNeram: { type: Type.STRING },
                  gowriNallaNeram: { type: Type.STRING },
                  chandrashtamam: { type: Type.STRING },
                  summary: { type: Type.STRING },
                  planetaryPositions: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        planet: { type: Type.STRING },
                        rasi: { type: Type.STRING },
                        degrees: { type: Type.STRING }
                      },
                      required: ['planet', 'rasi', 'degrees']
                    }
                  },
                  festivals: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        date: { type: Type.STRING },
                        significance: { type: Type.STRING }
                      },
                      required: ['name', 'date', 'significance']
                    }
                  },
                  transits: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        planet: { type: Type.STRING },
                        fromRasi: { type: Type.STRING },
                        toRasi: { type: Type.STRING },
                        date: { type: Type.STRING }
                      },
                      required: ['planet', 'fromRasi', 'toRasi', 'date']
                    }
                  }
                },
                required: [
                  'tamilYear', 'tamilMonth', 'tamilDay', 'ayanam', 'ruthu', 'tithi', 
                  'nakshatram', 'yogam', 'karanam', 'rasi', 'rahukalam', 'yamagandam', 
                  'kuligai', 'nallaNeram', 'gowriNallaNeram', 'chandrashtamam', 'summary', 
                  'planetaryPositions', 'festivals', 'transits'
                ]
              }
            },
            required: ['panchangam']
          }
        }
      });

      const result = JSON.parse(response.text);
      setData(result.panchangam);
    } catch (err) {
      console.error(err);
      setError('பஞ்சாங்கம் விவரங்களைப் பெறுவதில் பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.');
    } finally {
      setLoading(false);
    }
  }, [selectedDistrict, selectedDate]);

  useEffect(() => {
    fetchPanchangam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen pb-12 flex flex-col">
      {/* Header */}
      <header className="bg-tamil-gold text-white pt-10 pb-12 px-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-5">
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md shadow-inner">
              <Sun className="w-10 h-10 text-yellow-300" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight drop-shadow-sm">தமிழ் திருக்கணித பஞ்சாங்கம்</h1>
              <p className="text-yellow-100 mt-1 text-lg opacity-90">38 மாவட்டங்கள் மற்றும் புதுச்சேரிக்கான ஆன்மீக வழிகாட்டி</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 items-center bg-black/10 p-5 rounded-2xl backdrop-blur-md border border-white/10 shadow-2xl">
            <div className="flex items-center gap-2 min-w-[150px]">
              <MapPin className="w-5 h-5 text-yellow-300" />
              <select 
                value={selectedDistrict.name}
                onChange={(e) => setSelectedDistrict(DISTRICTS.find(d => d.name === e.target.value) || DISTRICTS[0])}
                className="bg-transparent border-b border-white/30 text-white focus:outline-none cursor-pointer p-1 w-full appearance-none"
              >
                {DISTRICTS.map(d => (
                  <option key={d.name} value={d.name} className="text-black">{d.tamilName}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-yellow-300" />
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent border-b border-white/30 text-white focus:outline-none cursor-pointer p-1"
              />
            </div>
            <button 
              onClick={fetchPanchangam}
              disabled={loading}
              className="bg-white text-tamil-gold px-8 py-3 rounded-xl font-bold hover:scale-105 transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center gap-2 ml-auto md:ml-0"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
              கணித்திடு
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 flex overflow-x-auto no-scrollbar">
          <TabButton active={activeTab === 'daily'} onClick={() => setActiveTab('daily')} icon={<Sun className="w-4 h-4"/>} label="இன்றைய விவரங்கள்" />
          <TabButton active={activeTab === 'festivals'} onClick={() => setActiveTab('festivals')} icon={<Star className="w-4 h-4"/>} label="பண்டிகைகள்" />
          <TabButton active={activeTab === 'transits'} onClick={() => setActiveTab('transits')} icon={<Compass className="w-4 h-4"/>} label="பெயர்ச்சிகள்" />
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 mt-8 flex-grow w-full">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-8 flex items-center gap-4 animate-pulse">
            <Info className="w-6 h-6" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-tamil-gold">
            <Loader2 className="w-20 h-20 animate-spin mb-6 opacity-80" />
            <p className="text-2xl font-semibold animate-pulse">திருக்கணித முறைப்படி கணிக்கப்படுகிறது...</p>
            <p className="text-gray-400 mt-2">கிரக நிலைகள் மற்றும் காலநேரம் கணக்கிடப்படுகிறது</p>
          </div>
        ) : data ? (
          <div className="animate-in fade-in duration-500">
            {activeTab === 'daily' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  {/* Daily Header Card */}
                  <section className="panchangam-card p-8 rounded-3xl shadow-xl border-orange-100">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8 border-b border-orange-100 pb-6">
                      <div className="flex items-center gap-4">
                        <div className="bg-orange-100 p-4 rounded-2xl">
                           <span className="text-4xl">🗓️</span>
                        </div>
                        <div>
                          <h2 className="text-3xl font-black text-orange-900 leading-tight">{data.tamilMonth} {data.tamilDay}</h2>
                          <p className="text-orange-700 font-bold text-lg">{data.tamilYear} ஆண்டு • {data.ayanam} • {data.ruthu}</p>
                        </div>
                      </div>
                      <div className="bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-orange-50 text-right self-end sm:self-auto">
                        <div className="flex items-center justify-end gap-2 text-gray-500 text-sm font-bold mb-1">
                          <MapPin className="w-3 h-3" /> {selectedDistrict.tamilName}
                        </div>
                        <p className="text-gray-400 text-xs tracking-widest uppercase">{selectedDate}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                      <div className="space-y-5">
                        <PanchangamItem icon={<Sun className="w-5 h-5 text-orange-600" />} label="திதி" value={data.tithi} />
                        <PanchangamItem icon={<Moon className="w-5 h-5 text-indigo-600" />} label="நட்சத்திரம்" value={data.nakshatram} />
                        <PanchangamItem icon={<Sparkles className="w-5 h-5 text-purple-600" />} label="யோகம்" value={data.yogam} />
                        <PanchangamItem icon={<Info className="w-5 h-5 text-blue-600" />} label="கரணம்" value={data.karanam} />
                        <PanchangamItem icon={<Star className="w-5 h-5 text-red-600" />} label="ராசி" value={data.rasi} />
                      </div>
                      <div className="space-y-5">
                        <PanchangamItem icon={<Info className="w-5 h-5 text-amber-600" />} label="சந்திராஷ்டமம்" value={data.chandrashtamam} highlight />
                        <PanchangamItem icon={<Sun className="w-5 h-5 text-yellow-600" />} label="நல்ல நேரம்" value={data.nallaNeram} success />
                        <PanchangamItem icon={<Sun className="w-5 h-5 text-yellow-500" />} label="கௌரி நல்ல நேரம்" value={data.gowriNallaNeram} success />
                        <div className="pt-4 border-t border-orange-50 mt-4">
                           <TimingItem label="ராகு காலம்" value={data.rahukalam} color="text-red-700" />
                           <TimingItem label="எமகண்டம்" value={data.yamagandam} color="text-red-700" />
                           <TimingItem label="குளிகை" value={data.kuligai} color="text-blue-700" />
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Summary Card */}
                  <section className="bg-gradient-to-r from-orange-50 to-amber-50 p-8 rounded-3xl border border-orange-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                      <Sparkles className="w-16 h-16" />
                    </div>
                    <h3 className="text-xl font-black text-orange-900 mb-4 flex items-center gap-3">
                      <Sparkles className="w-6 h-6 text-orange-500" /> இன்றைய ஆன்மீகத் தொகுப்பு
                    </h3>
                    <p className="text-orange-800 text-lg leading-relaxed font-medium">{data.summary}</p>
                  </section>

                  {/* Detailed Planetary Positions */}
                  <section className="panchangam-card p-8 rounded-3xl shadow-lg">
                    <h3 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-3">
                      <Compass className="w-6 h-6 text-indigo-600" /> கிரக நிலைகள் (Planet Positions)
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                      {data.planetaryPositions.map((p, idx) => (
                        <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 hover:border-indigo-200 transition-all hover:shadow-md group">
                          <span className="text-gray-400 text-xs font-bold uppercase tracking-widest block mb-2 group-hover:text-indigo-400">{p.planet}</span>
                          <span className="text-indigo-900 text-lg font-black block">{p.rasi}</span>
                          <span className="text-gray-500 text-xs font-medium">{p.degrees}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                  <section className="bg-indigo-900 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
                    <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                       <CalendarDays className="w-6 h-6" /> முக்கிய விசேஷங்கள்
                    </h3>
                    <div className="space-y-6">
                      {data.festivals.slice(0, 3).map((f, i) => (
                        <div key={i} className="relative pl-6 border-l-2 border-indigo-500/30 py-1">
                          <div className="absolute -left-1.5 top-2 w-3 h-3 bg-indigo-400 rounded-full border-2 border-indigo-900"></div>
                          <h4 className="font-black text-lg">{f.name}</h4>
                          <p className="text-indigo-300 text-sm font-bold mb-1">{f.date}</p>
                          <p className="text-indigo-100/80 text-xs leading-relaxed line-clamp-2">{f.significance}</p>
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={() => setActiveTab('festivals')}
                      className="mt-8 w-full py-3 bg-indigo-800 hover:bg-indigo-700 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      அனைத்தையும் காண்க <ChevronRight className="w-4 h-4" />
                    </button>
                  </section>

                  <div className="bg-white p-8 rounded-3xl border-2 border-orange-50 shadow-sm">
                    <h3 className="text-lg font-black text-orange-900 mb-6 flex items-center gap-2">
                       <Info className="w-5 h-5" /> பஞ்சாங்கத் தகவல்கள்
                    </h3>
                    <div className="space-y-5">
                      <FaqItem q="திருக்கணிதம் என்றால் என்ன?" a="இது நவீன வான்வெளி ஆராய்ச்சியை அடிப்படையாகக் கொண்டு கிரகங்களின் துல்லியமான பாகை நிலைகளை கணிக்கும் முறையாகும்." />
                      <FaqItem q="மாவட்ட வாரியான கணிப்பு?" a="ஒவ்வொரு மாவட்டத்தின் அட்சரேகை மற்றும் தீர்க்கரேகைக்கு ஏற்ப சூரிய உதயம் மற்றும் திதி முடிவுகள் சில நிமிடங்கள் மாறுபடும்." />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'festivals' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-10 duration-500">
                {data.festivals.map((f, i) => (
                  <div key={i} className="panchangam-card p-8 rounded-3xl shadow-lg border-indigo-50 flex flex-col">
                    <div className="bg-indigo-100 text-indigo-700 text-xs font-black uppercase tracking-widest w-fit px-3 py-1 rounded-full mb-4">
                      {f.date}
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-4">{f.name}</h3>
                    <p className="text-gray-600 leading-relaxed text-lg flex-grow">{f.significance}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'transits' && (
              <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom-10 duration-500">
                <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 mb-8 text-center">
                  <h2 className="text-2xl font-black text-orange-900">முக்கிய கிரக பெயர்ச்சிகள்</h2>
                  <p className="text-orange-700">இந்த ஆண்டில் நிகழும் பிரதான கிரக மாற்றங்கள்</p>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {data.transits.map((t, i) => (
                    <div key={i} className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 flex flex-col md:flex-row items-center gap-8 group">
                      <div className="w-full md:w-1/4 text-center">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">கிரகம்</p>
                        <p className="text-3xl font-black text-indigo-900">{t.planet}</p>
                      </div>
                      <div className="flex-grow flex items-center justify-center gap-6">
                        <div className="text-center">
                          <p className="text-xs font-bold text-gray-400 uppercase mb-1">இருந்து</p>
                          <p className="text-xl font-bold text-gray-700">{t.fromRasi}</p>
                        </div>
                        <div className="bg-indigo-50 p-3 rounded-full group-hover:rotate-12 transition-transform">
                          <ArrowRightCircle className="w-8 h-8 text-indigo-500" />
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-bold text-gray-400 uppercase mb-1">நோக்கி</p>
                          <p className="text-xl font-bold text-indigo-600">{t.toRasi}</p>
                        </div>
                      </div>
                      <div className="w-full md:w-1/4 text-center border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">தேதி</p>
                        <p className="text-xl font-black text-orange-600">{t.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-32 bg-white/50 rounded-3xl border-2 border-dashed border-gray-200">
            <CalendarDays className="w-20 h-20 text-gray-200 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-400">தகவல்கள் தயாராக இல்லை</h3>
            <p className="text-gray-400 mt-2">மாவட்டத்தையும் தேதியையும் தேர்ந்தெடுத்து 'கணித்திடு' பொத்தானை அழுத்தவும்.</p>
          </div>
        )}
      </main>

      <footer className="max-w-6xl mx-auto px-4 mt-20 text-center border-t border-gray-100 pt-12 pb-12 w-full">
        <div className="flex justify-center gap-6 mb-8">
           <div className="w-12 h-1 bg-tamil-gold rounded-full opacity-20"></div>
           <div className="w-12 h-1 bg-tamil-gold rounded-full opacity-50"></div>
           <div className="w-12 h-1 bg-tamil-gold rounded-full opacity-20"></div>
        </div>
        <p className="text-gray-800 font-bold">© 2024 தமிழ் திருக்கணித பஞ்சாங்கம்</p>
        <p className="text-gray-400 text-sm mt-2 max-w-xl mx-auto">
          இந்த பஞ்சாங்கம் நவீன திருக்கணித முறைப்படி AI தொழில்நுட்பத்தைப் பயன்படுத்தி கணிக்கப்பட்டுள்ளது. விசேஷ காரியங்களுக்கு உள்ளூர் புரோகிதர்களை அணுகுவது சிறந்தது.
        </p>
      </footer>
    </div>
  );
};

// --- Helper Components ---

const TabButton: React.FC<{ active: boolean; onClick: () => void; label: string; icon: React.ReactNode }> = ({ active, onClick, label, icon }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-8 py-5 text-sm font-black whitespace-nowrap transition-all border-b-2 outline-none
      ${active ? 'border-tamil-gold text-tamil-gold bg-orange-50/50' : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
  >
    {icon}
    {label}
  </button>
);

const PanchangamItem: React.FC<{ icon: React.ReactNode; label: string; value: string; highlight?: boolean; success?: boolean }> = ({ icon, label, value, highlight, success }) => (
  <div className={`flex items-center gap-4 p-3 rounded-2xl transition-all ${highlight ? 'bg-orange-50 border border-orange-100' : success ? 'bg-green-50/50 border border-green-100' : 'hover:bg-gray-50'}`}>
    <div className={`p-3 rounded-xl shadow-sm ${highlight ? 'bg-white' : success ? 'bg-white' : 'bg-gray-50'}`}>{icon}</div>
    <div>
      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{label}</p>
      <p className={`text-lg font-black leading-tight ${highlight ? 'text-orange-900' : success ? 'text-green-800' : 'text-gray-800'}`}>{value}</p>
    </div>
  </div>
);

const TimingItem: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <div className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 px-2 rounded-lg transition-colors">
    <span className="text-sm text-gray-500 font-bold uppercase tracking-wider">{label}</span>
    <span className={`text-base font-black ${color}`}>{value}</span>
  </div>
);

const FaqItem: React.FC<{ q: string; a: string }> = ({ q, a }) => (
  <div className="group cursor-default">
    <p className="text-sm font-black text-gray-800 mb-1 group-hover:text-tamil-gold transition-colors">{q}</p>
    <p className="text-xs text-gray-500 leading-relaxed">{a}</p>
  </div>
);

export default App;
