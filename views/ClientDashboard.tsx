import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store';
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  Plus,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  Sparkles,
  X,
  Send,
  Loader2,
  Volume2,
  Copy,
  Check,
  Mic,
  PhoneOff,
  Activity,
  Globe,
  ExternalLink,
  MapPin,
  Compass,
  Store
} from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { GoogleGenAI, Modality, LiveServerMessage } from "@google/genai";

interface ChatMessage {
  role: 'user' | 'marcus';
  text: string;
  isStreaming?: boolean;
  sources?: { uri: string; title: string; type: 'web' | 'maps' }[];
}

// Audio Helpers
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// Fixed: Removed conflicting Window.aistudio declaration.
// The environment already provides window.aistudio with the correct AIStudio type.

export const ClientDashboard: React.FC = () => {
  const { userPlan, projectBriefs, submitBrief, plans } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [brief, setBrief] = useState({ title: '', description: '' });

  // AI Marcus State
  const [showMarcus, setShowMarcus] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [liveTranscription, setLiveTranscription] = useState('');

  // Refs
  const liveSessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const streamRef = useRef<MediaStream | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Stripe State (Simulated for this view, would use `useUser` in full auth implementation)
  const [stripeConnected, setStripeConnected] = useState(false);
  const { connectStripe } = useStore();

  useEffect(() => {
    // Check for callback
    const params = new URLSearchParams(window.location.search);
    if (params.get('stripe_connected') === 'true') {
      setStripeConnected(true);
      // In a real app, we would save this ID to the `users` table here
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  if (!userPlan) return <Navigate to="/professional" />;

  const currentPlan = plans.find(p => p.id === userPlan);
  const isCollective = userPlan === '2';

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, liveTranscription]);

  // Fix: Adding API Key selection handling logic to comply with mandatory user-selected key requirements for certain models.
  const ensureApiKey = async () => {
    // Priority 1: Check for VITE_GEMINI_API_KEY (Developer provided)
    if (import.meta.env.VITE_GEMINI_API_KEY) {
      return true;
    }

    try {
      if (!window.aistudio) {
        console.warn("AI Studio is not available in this environment and VITE_GEMINI_API_KEY is missing");
        return false;
      }
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await window.aistudio.openSelectKey();
      }
      return true;
    } catch (e) {
      console.error("API Key selection check failed", e);
      return false;
    }
  };

  const startLiveSession = async () => {
    // Check for user-selected API key before initiating live API session.
    const keyReady = await ensureApiKey();
    if (!keyReady) return;

    setIsLive(true);
    setLiveTranscription('Connecting to Marketplace Support...');

    try {
      // Use VITE_GEMINI_API_KEY if present, otherwise fallback to process.env
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.API_KEY;
      const ai = new GoogleGenAI({ apiKey });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const inputAudioContext = new AudioContext({ sampleRate: 16000 });
      const outputAudioContext = new AudioContext({ sampleRate: 24000 });
      audioContextRef.current = outputAudioContext;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setLiveTranscription('Uplink Established. How can I help with your store strategy?');
            const source = inputAudioContext.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);

            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              // Solely rely on sessionPromise resolution as per Live API streaming rules.
              sessionPromise.then(session => {
                session.sendRealtimeInput({
                  media: { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' }
                });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              setLiveTranscription(prev => prev + ' ' + message.serverContent?.outputTranscription?.text);
            }
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContext.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext, 24000, 1);
              const source = outputAudioContext.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputAudioContext.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              audioSourcesRef.current.add(source);
              source.onended = () => audioSourcesRef.current.delete(source);
            }
            if (message.serverContent?.interrupted) {
              audioSourcesRef.current.forEach(s => s.stop());
              audioSourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => stopLiveSession(),
          onerror: (e: any) => {
            console.error("Live session error", e);
            // Handling the "Requested entity was not found" error by prompting for key selection again.
            if (e.message && e.message.includes("Requested entity was not found")) {
              if (window.aistudio) {
                window.aistudio.openSelectKey();
              }
            }
            stopLiveSession();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          outputAudioTranscription: {},
          systemInstruction: `You are Marcus K., Marketplace Architect for True T. Help sellers optimize their handmade storefronts and understand the $5 fee structure. Prohibit AI usage in art.`,
        }
      });
      liveSessionRef.current = await sessionPromise;
    } catch (e) {
      stopLiveSession();
    }
  };

  const stopLiveSession = () => {
    if (liveSessionRef.current) liveSessionRef.current.close();
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    audioSourcesRef.current.forEach(s => s.stop());
    setIsLive(false);
    setLiveTranscription('');
  };

  const consultMarcus = async () => {
    if (!userInput.trim()) return;

    // Check for API key before initiating text generation.
    const keyReady = await ensureApiKey();
    if (!keyReady) return;

    const userMsg: ChatMessage = { role: 'user', text: userInput };
    setMessages(prev => [...prev, userMsg]);
    setUserInput('');
    setIsTyping(true);

    try {
      // Use VITE_GEMINI_API_KEY if present, otherwise fallback to process.env
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.API_KEY;
      const ai = new GoogleGenAI({ apiKey });
      let latLng = undefined;
      try {
        const pos = await new Promise<GeolocationPosition>((res, rej) => navigator.geolocation.getCurrentPosition(res, rej));
        // Fixed: Use coords.longitude instead of duplicating latitude
        latLng = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
      } catch (e) { }

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [...messages, userMsg].map(m => ({
          role: m.role === 'marcus' ? 'model' : 'user',
          parts: [{ text: m.text }]
        })),
        config: {
          thinkingConfig: { includeThoughts: true },
          // @ts-ignore - thinkingBudget is valid for this model but might be missing in older types
          // thinkingBudget: 16000, 
          systemInstruction: `You are Marcus K., Marketplace Strategist for True T. Help artisans build profitable stores with human-centric branding. Use Search for grounded market data. Remind them of the $5 commission.`,
          tools: [{ googleSearch: {} }],
          toolConfig: latLng ? { retrievalConfig: { latLng } } : undefined
        },
      });

      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => {
        if (chunk.web) return { uri: chunk.web.uri, title: chunk.web.title, type: 'web' as const };
        if (chunk.maps) return { uri: chunk.maps.uri, title: chunk.maps.title, type: 'maps' as const };
        return null;
      }).filter(Boolean);

      setMessages(prev => [...prev, {
        role: 'marcus',
        text: response.text || "I'm analyzing the handmade market benchmarks...",
        sources: sources as any
      }]);
    } catch (error: any) {
      console.error(error);
      if (error.message && error.message.includes("Requested entity was not found")) {
        if (window.aistudio) {
          window.aistudio.openSelectKey();
        }
      }
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-700 min-h-screen bg-[#FAF9F6] pb-32 relative overflow-x-hidden">
      <header className="bg-white border-b border-gray-100 pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <span className="bg-[#273134] text-white text-[10px] uppercase tracking-widest px-3 py-1 font-bold">
                {currentPlan?.name} Partner
              </span>
              <Store className="w-4 h-4 text-[#273134]" />
            </div>
            <h1 className="text-5xl font-serif italic text-[#273134]">Store Manager</h1>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => { setShowMarcus(true); if (messages.length === 0) setMessages([{ role: 'marcus', text: "Marcus K. here. Let's look at your studio objectives." }]); }}
              className="group border border-[#273134] text-[#273134] px-8 py-4 uppercase tracking-[0.2em] text-[10px] font-bold hover:bg-[#273134] hover:text-white transition-all flex items-center relative overflow-hidden"
            >
              <Sparkles className="mr-2 w-4 h-4" /> Consult Architect
            </button>
            <button onClick={() => setShowForm(!showForm)} className="bg-[#273134] text-white px-10 py-4 uppercase tracking-[0.2em] text-[10px] font-bold hover:bg-black transition-all flex items-center shadow-lg">
              {showForm ? 'Close Session' : 'New Listing'} <Plus className="ml-2 w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {showForm ? (
            <div className="bg-white p-12 border border-gray-100 shadow-xl animate-in zoom-in-95 duration-500">
              <h2 className="text-3xl font-serif italic mb-8">New Listing Request</h2>
              <form onSubmit={e => { e.preventDefault(); submitBrief({ ...brief, priority: isCollective }); setShowForm(false); }} className="space-y-8">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.4em] font-bold text-gray-400 mb-3">Item Name</label>
                  <input required type="text" value={brief.title} onChange={e => setBrief({ ...brief, title: e.target.value })} placeholder="e.g., Hand-carved Walnut Spoon" className="w-full bg-[#FAF9F6] border-none p-5 text-lg font-serif italic" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.4em] font-bold text-gray-400 mb-3">Creation Story & Materials</label>
                  <textarea required rows={6} value={brief.description} onChange={e => setBrief({ ...brief, description: e.target.value })} placeholder="Explain your handmade process..." className="w-full bg-[#FAF9F6] border-none p-5 text-sm italic"></textarea>
                </div>
                <div className="bg-[#273134]/5 p-4 border-l-2 border-[#273134]">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500 italic">
                    REMINDER: NO AI-GENERATED CONTENT PERMITTED.
                  </p>
                </div>
                <button type="submit" className="w-full bg-[#273134] text-white py-6 uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-black transition-all">Submit for Vetting</button>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="text-2xl font-serif italic mb-6">Store Queue</h3>
              {projectBriefs.length === 0 ? (
                <div className="bg-white p-20 text-center border border-dashed border-gray-200">
                  <Briefcase className="w-12 h-12 text-gray-100 mx-auto mb-6" />
                  <p className="text-gray-400 italic">No active listings in queue.</p>
                </div>
              ) : (
                projectBriefs.map(pb => (
                  <div key={pb.id} className="bg-white p-8 border border-gray-100 flex items-center justify-between group hover:border-[#D4C4B5] transition-all">
                    <div className="flex items-center space-x-6">
                      <div className={`w-12 h-12 flex items-center justify-center rounded-full ${pb.status === 'Complete' ? 'bg-green-50 text-green-500' : 'bg-amber-50 text-amber-500'}`}>
                        {pb.status === 'Complete' ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6 animate-pulse" />}
                      </div>
                      <div>
                        <h4 className="text-xl font-serif italic">{pb.title}</h4>
                        <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-1">Status: {pb.status}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="bg-[#273134] text-white p-10 shadow-2xl relative overflow-hidden">
            <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#D4C4B5] mb-6">Payout Stats</h4>
            <div className="space-y-6">
              <div className="flex justify-between items-center text-sm italic"><span className="text-gray-400">Fixed Commission</span><span className="text-green-400">$5.00</span></div>
              <div className="flex justify-between items-center text-sm italic"><span className="text-gray-400">Next Payout</span><span className="text-[#D4C4B5]">Friday</span></div>
              <div className="flex justify-between items-center text-sm italic"><span className="text-gray-400">Next Payout</span><span className="text-[#D4C4B5]">Friday</span></div>
              <div className="flex justify-between items-center text-sm italic">
                <span className="text-gray-400">Stripe Status</span>
                {stripeConnected ? (
                  <span className="text-green-500 flex items-center"><Check className="w-3 h-3 mr-1" /> Active</span>
                ) : (
                  <button
                    onClick={async () => {
                      try {
                        const url = await connectStripe('/dashboard'); // Pass return path
                        window.location.href = url;
                      } catch (e) { alert('Connection failed'); }
                    }}
                    className="text-[#635BFF] flex items-center hover:text-white transition-colors"
                  >
                    Connect <ExternalLink className="w-3 h-3 ml-1" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Marcus Modal Drawer */}
      <div className={`fixed inset-y-0 right-0 w-full md:w-[600px] bg-white shadow-[-40px_0_80px_rgba(0,0,0,0.15)] z-[60] transform transition-transform duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${showMarcus ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="p-10 border-b border-gray-50 flex items-center justify-between bg-[#FAF9F6]">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#273134]">Human Strategist Online</p>
              </div>
              <h3 className="text-3xl font-serif italic">Marcus K.</h3>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={isLive ? stopLiveSession : startLiveSession} className={`p-3 rounded-full transition-all ${isLive ? 'bg-red-50 text-red-500 animate-pulse' : 'bg-[#273134]/10 text-[#273134]'}`}>
                {isLive ? <PhoneOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <button onClick={() => { setShowMarcus(false); stopLiveSession(); }} className="p-3 hover:bg-gray-100 rounded-full transition-all"><X className="w-6 h-6" /></button>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto p-10 space-y-10 custom-scrollbar bg-[#FFFCF9]">
            {isLive ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in duration-500">
                <Activity className="w-16 h-16 text-[#273134] animate-pulse" />
                <p className="text-sm italic text-gray-500 px-12">{liveTranscription || "Marcus is analyzing your store objectives..."}</p>
                <button onClick={stopLiveSession} className="px-8 py-3 bg-[#273134] text-white text-[10px] uppercase tracking-widest font-bold">End Session</button>
              </div>
            ) : (
              <>
                {messages.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`group relative max-w-[95%] p-7 rounded-sm text-[15px] italic leading-relaxed ${msg.role === 'user' ? 'bg-[#273134] text-white shadow-xl' : 'bg-white border border-gray-100 text-[#273134] shadow-sm'}`}>
                      {msg.text}
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-6 pt-4 border-t border-gray-50 space-y-3">
                          <p className="text-[8px] uppercase tracking-widest font-bold text-[#D4C4B5]">Grounded Insights</p>
                          <div className="grid grid-cols-1 gap-2">
                            {msg.sources.map((s, idx) => (
                              <a key={idx} href={s.uri} target="_blank" rel="noopener noreferrer" className="text-[10px] flex items-center justify-between bg-[#FAF9F6] px-4 py-2 text-gray-400 hover:text-black border border-transparent transition-all">
                                <span className="flex items-center">{s.type === 'maps' ? <MapPin className="w-3 h-3 mr-2" /> : <Globe className="w-3 h-3 mr-2" />} {s.title}</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex items-center space-x-4 bg-white p-6 border border-gray-100 shadow-sm rounded-sm animate-pulse">
                    <div className="relative">
                      <Loader2 className="w-5 h-5 animate-spin text-[#273134]" />
                      <div className="absolute inset-0 bg-[#D4C4B5] blur-lg opacity-20"></div>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase tracking-[0.3em] font-bold text-[#273134]">Deep Reasoning Active</span>
                      <span className="text-[9px] text-gray-400 italic">Marcus is architects the optimal solution...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </>
            )}
          </div>

          <div className="p-10 border-t border-gray-50 bg-white">
            {!isLive && (
              <div className="space-y-4">
                <div className="relative group">
                  <input
                    type="text"
                    value={userInput}
                    onChange={e => setUserInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && consultMarcus()}
                    placeholder="Brief Marcus on market or store strategy..."
                    className="w-full bg-[#FAF9F6] border border-transparent p-6 pr-14 text-sm focus:outline-none focus:ring-1 focus:ring-[#273134] italic"
                  />
                  <button onClick={() => consultMarcus()} disabled={!userInput.trim() || isTyping} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-[#273134] hover:text-black transition-colors disabled:opacity-30"><Send className="w-5 h-5" /></button>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <p className="text-[8px] uppercase tracking-[0.2em] text-gray-300 font-bold">Human Intelligence Only</p>
                  <button onClick={() => setMessages([])} className="text-[8px] uppercase tracking-[0.2em] text-gray-400 hover:text-black font-bold">Reset Chat</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
