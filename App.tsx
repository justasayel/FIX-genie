import React, { useState, useRef, useEffect } from 'react';
import { AppState, UserInput, AnalysisResult, Technician, Severity, Tab, MockReport, MockPayment, MockNotification, ChatMessage, UserProfile, SettingsState, CreditCard, ReportStatus, IssueType } from './types';
import { MOCK_TECHNICIANS, INITIAL_CITIES, SAMPLE_PROMPT_BROKEN_PIPE, SAMPLE_PROMPT_FLAT_TIRE, MOCK_REPORTS, MOCK_PAYMENTS, MOCK_NOTIFICATIONS, MOCK_CHAT, MOCK_CREDIT_CARDS } from './constants';
import { analyzeIssue } from './services/geminiService';
import { Button } from './components/Button';
import { BottomNav } from './components/BottomNav';

// --- Icons ---
const CameraIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const AlertTriangleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const ToolIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>;
const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="m15 18-6-6 6-6"/></svg>;
const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-orange-500"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M9 3v4"/><path d="M3 5h4"/><path d="M3 9h4"/></svg>;
const PrinterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>;

// --- Helper Components ---
  
const SeverityBadge = ({ level }: { level: Severity }) => {
  const colors = {
    [Severity.LOW]: 'bg-emerald-600 text-white',
    [Severity.MEDIUM]: 'bg-yellow-500 text-black',
    [Severity.HIGH]: 'bg-orange-600 text-white',
    [Severity.DANGEROUS]: 'bg-red-700 text-white',
  };
  return (
    <span className={`px-4 py-1.5 rounded-sm text-xs font-bold uppercase tracking-widest border border-black/10 shadow-sm ${colors[level]}`}>
      {level}
    </span>
  );
};

const StatusBadge = ({ status }: { status: ReportStatus }) => {
  const colors = {
    [ReportStatus.DRAFT]: 'bg-neutral-200 text-neutral-600',
    [ReportStatus.AI_COMPLETED]: 'bg-blue-100 text-blue-700',
    [ReportStatus.AWAITING_TECH]: 'bg-yellow-100 text-yellow-700',
    [ReportStatus.TECH_ASSIGNED]: 'bg-orange-100 text-orange-700',
    [ReportStatus.IN_PROGRESS]: 'bg-purple-100 text-purple-700',
    [ReportStatus.RESOLVED]: 'bg-emerald-100 text-emerald-700',
  };
  return (
    <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider ${colors[status]}`}>
      {status}
    </span>
  );
};

interface TechnicalFrameProps {
  children?: React.ReactNode;
  label?: string;
  className?: string;
}

const TechnicalFrame = ({ children, label, className = '' }: TechnicalFrameProps) => (
  <div className={`relative group overflow-hidden bg-black/5 ${className}`}>
    {/* Corner Brackets */}
    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-orange-500 z-10"></div>
    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-orange-500 z-10"></div>
    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-orange-500 z-10"></div>
    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-orange-500 z-10"></div>
    
    {/* Label Tag */}
    {label && (
      <div className="absolute top-3 left-3 bg-orange-600/90 text-white text-[10px] font-mono uppercase px-2 py-0.5 z-20 backdrop-blur-sm border-l-2 border-white shadow-sm">
        {label}
      </div>
    )}

    {/* Content */}
    <div className="relative">
      {children}
    </div>
  </div>
);

// --- Feature Components ---

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-neutral-900 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-grid-pattern"></div>
      
      <div className="relative z-10 animate-fade-in">
        <div className="w-24 h-24 bg-white text-neutral-900 mx-auto mb-8 flex items-center justify-center font-black text-4xl shadow-[0_0_30px_rgba(255,255,255,0.2)] rounded-sm transform rotate-3">
          FG
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter mb-2">
          Fix<span className="text-orange-600">Genie</span>
        </h1>
        <p className="text-neutral-400 text-sm font-mono uppercase tracking-widest mb-12">
          AI Home & Auto Repair Companion
        </p>
        <div className="h-1 w-24 bg-neutral-800 mx-auto overflow-hidden rounded-full">
           <div className="h-full bg-orange-600 animate-[scan_2s_ease-in-out_infinite]"></div>
        </div>
      </div>
      
      <div className="absolute bottom-12 text-neutral-500 text-xs font-bold uppercase tracking-widest opacity-0 animate-[fade-in_1s_ease-out_3s_forwards]">
        "Snap the problem. Get the fix."
      </div>
    </div>
  );
};

const AIAssistantOverlay = ({ 
  isOpen, 
  onClose,
  onSaveReport 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSaveReport: (report: MockReport) => void; 
}) => {
  const [internalState, setInternalState] = useState<'UPLOAD' | 'ANALYZING' | 'RESULT'>('UPLOAD');
  const [input, setInput] = useState<UserInput>({ images: [], description: '', location: 'New York' });
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setInternalState('UPLOAD');
    setInput({ images: [], description: '', location: 'New York' });
    setAnalysis(null);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setInput(prev => ({ ...prev, images: [...prev.images, ...Array.from(e.target.files!).slice(0,3-prev.images.length)] }));
    }
  };

  const startAnalysis = async () => {
    setInternalState('ANALYZING');
    try {
      const result = await analyzeIssue(input.images, input.description, input.location);
      setAnalysis(result);
      setInternalState('RESULT');
    } catch (e: any) {
      console.error(e);
      alert(`Analysis failed: ${e.message || "Unknown error"}.`);
      setInternalState('UPLOAD');
    }
  };

  const save = () => {
    if (analysis) {
      onSaveReport({
        id: `gen-${Date.now().toString().slice(-4)}`,
        title: analysis.summary,
        date: new Date().toLocaleDateString(),
        severity: analysis.severity,
        summary: analysis.summary,
        status: ReportStatus.AI_COMPLETED,
        category: analysis.detectedSpecialty,
        possibleCause: analysis.possibleCause,
        recommendedAction: analysis.classification === 'Simple DIY' ? 'Proceed with DIY Guide' : 'Professional Service Required',
        costEstimate: analysis.classification === 'Simple DIY' ? '$20 - $50 (Materials)' : '$150 - $300 (Estimate)',
        requiredTools: analysis.diyGuide?.tools || [],
        images: input.images.map(f => URL.createObjectURL(f))
      });
      onClose();
      reset();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-neutral-900/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in no-print">
       <div className="w-full max-w-2xl bg-white h-[90vh] rounded-lg shadow-2xl flex flex-col overflow-hidden relative border border-neutral-700">
          
          {/* Header */}
          <div className="p-4 border-b border-neutral-200 flex justify-between items-center bg-neutral-50">
             <div className="flex items-center gap-2 text-orange-600 font-black uppercase tracking-tight text-lg">
                <SparklesIcon /> AI Assistant
             </div>
             <button onClick={onClose} className="p-2 hover:bg-neutral-200 rounded-full transition-colors"><XIcon /></button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
             {internalState === 'UPLOAD' && (
                <div className="space-y-6">
                   <div className="text-center space-y-2">
                      <h2 className="text-2xl font-black text-neutral-900 uppercase">Input Diagnostics</h2>
                      <p className="text-neutral-500 text-sm">Upload visuals for rapid AI assessment.</p>
                   </div>
                   
                   <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-neutral-300 bg-neutral-50 hover:bg-orange-50 hover:border-orange-500 rounded-lg p-12 cursor-pointer transition-all group text-center"
                   >
                      <input type="file" ref={fileInputRef} className="hidden" multiple accept="image/*" onChange={handleUpload} />
                      <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400 group-hover:text-orange-600 transition-colors">
                         <CameraIcon />
                      </div>
                      <span className="font-bold text-neutral-700 uppercase">Tap to Upload</span>
                   </div>

                   {input.images.length > 0 && (
                      <div className="flex gap-2 justify-center">
                        {input.images.map((img, i) => (
                          <div key={i} className="w-20 h-20 rounded-md overflow-hidden border border-neutral-200 relative">
                             <img src={URL.createObjectURL(img)} className="w-full h-full object-cover" />
                             <button onClick={(e) => {e.stopPropagation(); setInput(p => ({...p, images: p.images.filter((_,idx)=>idx!==i)}))}} className="absolute top-0 right-0 bg-red-500 text-white p-0.5"><XIcon /></button>
                          </div>
                        ))}
                      </div>
                   )}

                   <textarea 
                      className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-md focus:border-orange-500 outline-none font-mono text-sm"
                      placeholder="Describe the issue..."
                      rows={3}
                      value={input.description}
                      onChange={e => setInput({...input, description: e.target.value})}
                   />

                   <div className="flex gap-2">
                      <Button fullWidth onClick={() => {setInput(p=>({...p, images:[], description: SAMPLE_PROMPT_BROKEN_PIPE}));}} variant="secondary">Sample Pipe</Button>
                      <Button fullWidth onClick={startAnalysis} disabled={!input.images.length && !input.description}>Analyze</Button>
                   </div>
                </div>
             )}

             {internalState === 'ANALYZING' && (
                <div className="h-full flex flex-col items-center justify-center text-center">
                   <div className="w-24 h-24 border-4 border-orange-100 border-t-orange-600 rounded-full animate-spin mb-6"></div>
                   <h3 className="text-xl font-black uppercase text-neutral-900">Processing Data</h3>
                   <p className="text-neutral-500 font-mono text-xs mt-2">Identifying structural anomalies...</p>
                </div>
             )}

             {internalState === 'RESULT' && analysis && (
                <div className="space-y-6">
                   <TechnicalFrame label="Analysis Complete" className="bg-neutral-900 text-white p-6 rounded-sm">
                      <div className="flex justify-between items-start mb-4">
                         <h2 className="text-2xl font-black uppercase text-white">{analysis.summary}</h2>
                         <SeverityBadge level={analysis.severity} />
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xs font-mono text-neutral-400 mb-4">
                         <div>CLASS: <span className="text-white">{analysis.classification}</span></div>
                         <div>TYPE: <span className="text-white">{analysis.detectedSpecialty}</span></div>
                      </div>
                      <p className="text-sm text-neutral-300">{analysis.possibleCause}</p>
                   </TechnicalFrame>

                   {analysis.classification === 'Simple DIY' && analysis.diyGuide ? (
                      <div className="bg-emerald-50 p-6 border-l-4 border-emerald-500 rounded-r-sm">
                         <h3 className="font-bold text-emerald-800 uppercase mb-4 flex items-center gap-2"><ToolIcon /> DIY Guide</h3>
                         <ol className="list-decimal list-inside space-y-2 text-sm text-emerald-900">
                            {analysis.diyGuide.steps.map((s,i) => <li key={i}>{s}</li>)}
                         </ol>
                      </div>
                   ) : (
                      <div className="bg-orange-50 p-6 border-l-4 border-orange-500 rounded-r-sm">
                         <h3 className="font-bold text-orange-800 uppercase mb-4 flex items-center gap-2"><AlertTriangleIcon /> Professional Recommended</h3>
                         <p className="text-sm text-orange-900">{analysis.technicianReport?.description}</p>
                      </div>
                   )}

                   <div className="grid grid-cols-2 gap-4 pt-4">
                      <Button variant="outline" onClick={reset}>Discard</Button>
                      <Button onClick={save}>Save to Reports</Button>
                   </div>
                </div>
             )}
          </div>
       </div>
    </div>
  );
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.HOME);
  const [appState, setAppState] = useState<AppState>(AppState.ENGINEER_LIST);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  
  // Data State
  const [reports, setReports] = useState<MockReport[]>(MOCK_REPORTS);
  const [activeReport, setActiveReport] = useState<MockReport | null>(null);
  const [reportFilter, setReportFilter] = useState<'ALL' | 'OPEN' | 'RESOLVED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [globalAlert, setGlobalAlert] = useState<{message: string, type: 'info' | 'success'} | null>(null);

  // Chat Flow State
  const [selectedTech, setSelectedTech] = useState<Technician | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(MOCK_CHAT);
  const [newMessage, setNewMessage] = useState('');
  
  // Other State
  const [input, setInput] = useState<UserInput>({ images: [], description: '', location: 'New York' });
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null); 
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Wallet
  const [cards, setCards] = useState<CreditCard[]>(MOCK_CREDIT_CARDS);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState({ holderName: '', number: '', expiry: '', cvv: '' });

  // Profile/Settings
  const [profile, setProfile] = useState<UserProfile>({ name: 'Alex Engineer', email: 'alex@example.com', phone: '555-0123', city: 'Chicago', language: 'English' });
  const [settings, setSettings] = useState<SettingsState>({ language: 'English', notifications: { booking: true, updates: true, reports: false }, contactMethod: 'Email' });

  // Notifications
  const [notifications, setNotifications] = useState<MockNotification[]>(MOCK_NOTIFICATIONS);
  const [rating, setRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');

  // --- Actions ---

  const handleTechSelection = (tech: Technician) => {
    setSelectedTech(tech);
    setAppState(AppState.CONTEXT_SELECTION);
  };

  const handleSendMessage = (text = newMessage) => {
    if (!text.trim()) return;
    const msg: ChatMessage = { id: Date.now().toString(), sender: 'user', text, time: new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}) };
    setChatMessages(prev => [...prev, msg]);
    setNewMessage('');
    setTimeout(() => {
      setChatMessages(prev => [...prev, { id: (Date.now()+1).toString(), sender: 'tech', text: 'Received. Analyzing request.', time: new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}) }]);
    }, 1500);
  };

  const startChatDiagnosis = async () => {
    setAppState(AppState.ANALYZING);
    try {
      const result = await analyzeIssue(input.images, input.description, input.location);
      setAnalysis(result);
      setAppState(AppState.DIAGNOSIS);
    } catch (e: any) {
      console.error(e);
      alert(`Analysis failed: ${e.message || "Unknown error"}. Please check your connection or try again.`);
      setAppState(AppState.UPLOAD);
    }
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate simple length for demo purposes
    if (newCard.number.length < 4) {
      alert("Please enter a valid card number.");
      return;
    }
    const card: CreditCard = {
      id: Date.now().toString(),
      type: newCard.number.startsWith('4') ? 'Visa' : 'MasterCard',
      last4: newCard.number.slice(-4),
      expiry: newCard.expiry,
      holderName: newCard.holderName
    };
    setCards([...cards, card]);
    setShowAddCard(false);
    setNewCard({ holderName: '', number: '', expiry: '', cvv: '' });
    setGlobalAlert({ message: "Payment Method Saved", type: 'success' });
    setTimeout(() => setGlobalAlert(null), 3000);
  };

  const handleSaveSettings = () => {
    setGlobalAlert({ message: "Profile Settings Saved", type: 'success' });
    setTimeout(() => setGlobalAlert(null), 3000);
  };

  const handleSubmitRating = () => {
    if (rating === 0) {
      alert("Please select a star rating first.");
      return;
    }
    setRating(0);
    setRatingComment('');
    setGlobalAlert({ message: "Review Submitted Successfully", type: 'success' });
    setTimeout(() => setGlobalAlert(null), 3000);
  };

  // --- Views ---

  if (loading) {
    return <SplashScreen onComplete={() => setLoading(false)} />;
  }

  const renderEngineerList = () => (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-32 animate-fade-in bg-grid-pattern min-h-screen">
      <div className="flex items-center justify-between mb-6 pt-4">
         <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Available Specialists</h3>
         <div className="h-px bg-neutral-300 flex-1 ml-4"></div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {MOCK_TECHNICIANS.map(tech => (
           <div key={tech.id} onClick={() => handleTechSelection(tech)} className="bg-white hover:bg-neutral-50 border border-neutral-200 hover:border-orange-500 p-4 rounded-lg shadow-sm cursor-pointer transition-all group flex items-center gap-4 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-16 h-16 bg-neutral-50 -mr-8 -mt-8 rotate-45 transform group-hover:bg-orange-50 transition-colors"></div>
              <div className="relative">
                 <img src={tech.avatarUrl} alt={tech.name} className="w-16 h-16 object-cover rounded-full grayscale group-hover:grayscale-0 transition-all border-2 border-white shadow-sm"/>
                 <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${tech.status === 'Online' ? 'bg-emerald-500' : 'bg-neutral-400'}`}></div>
              </div>
              <div className="flex-1 relative z-10">
                 <h4 className="font-bold text-neutral-900 group-hover:text-orange-600 transition-colors text-lg">{tech.name}</h4>
                 <div className="text-xs text-neutral-500 font-mono mt-0.5">{tech.specialty} // {tech.city}</div>
                 <div className="flex flex-col gap-1 mt-3">
                    <div className="flex items-center gap-2">
                       <span className="bg-neutral-100 text-neutral-700 text-[10px] font-bold px-2 py-0.5 rounded-sm flex items-center gap-1"><StarIcon /> {tech.rating}</span>
                       <span className="text-[10px] text-neutral-400 font-mono">({tech.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                       <div className="text-xs font-bold text-neutral-700 bg-orange-50 px-2 py-0.5 rounded-sm border border-orange-100">
                          {tech.priceRange} • ${tech.hourlyRate}/hr
                       </div>
                       <div className="text-[10px] font-mono text-neutral-400">
                          Est. Visit: ${tech.hourlyRate + 50}
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        ))}
      </div>
    </div>
  );

  const renderChatFlow = () => {
    switch (appState) {
      case AppState.ENGINEER_LIST: return renderEngineerList();
      case AppState.CONTEXT_SELECTION: return (
        <div className="max-w-xl mx-auto px-4 py-12 pb-32 text-center animate-fade-in">
           <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white shadow-lg relative">
              <img src={selectedTech?.avatarUrl} className="w-full h-full object-cover" />
           </div>
           <h2 className="text-2xl font-black text-neutral-900 uppercase mb-2">Connect with {selectedTech?.name.split(' ')[0]}</h2>
           <p className="text-neutral-500 mb-8 text-sm">How would you like to proceed?</p>
           <div className="space-y-4">
              <button onClick={() => setAppState(AppState.UPLOAD)} className="w-full bg-white p-6 rounded-lg border border-neutral-200 hover:border-orange-500 hover:shadow-lg transition-all flex items-center gap-4 group text-left">
                 <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"><PlusIcon /></div>
                 <div>
                    <div className="font-bold text-neutral-900">New Diagnosis</div>
                    <div className="text-xs text-neutral-500">Upload images & analyze</div>
                 </div>
              </button>
              <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest my-2">- OR -</div>
              {reports.slice(0,2).map(r => (
                 <button key={r.id} onClick={() => setAppState(AppState.CHAT_ROOM)} className="w-full bg-white p-4 rounded-lg border border-neutral-200 hover:border-neutral-400 flex justify-between items-center transition-all text-left">
                    <div>
                       <div className="font-bold text-neutral-900">{r.title}</div>
                       <div className="text-xs text-neutral-500 font-mono">{r.date}</div>
                    </div>
                    <SeverityBadge level={r.severity} />
                 </button>
              ))}
              <Button fullWidth onClick={() => { setAppState(AppState.CHAT_ROOM); setGlobalAlert({message: "Session Started", type: 'success'}); setTimeout(()=>setGlobalAlert(null),2000);}}>Just Chat</Button>
           </div>
           <button onClick={() => setAppState(AppState.ENGINEER_LIST)} className="mt-8 text-neutral-400 hover:text-neutral-600 text-xs font-bold uppercase tracking-widest">Cancel Connection</button>
        </div>
      );
      case AppState.UPLOAD: return (
        <div className="max-w-2xl mx-auto px-4 py-8 pb-32 animate-fade-in">
           <button onClick={() => setAppState(AppState.ENGINEER_LIST)} className="text-neutral-500 hover:text-orange-600 font-bold uppercase text-xs mb-6 flex items-center gap-2"><BackIcon /> Cancel</button>
           <div className="bg-white p-8 rounded-lg border border-neutral-200 shadow-xl">
              <h2 className="text-2xl font-black uppercase text-neutral-900 mb-6">New Diagnostic Session</h2>
              <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-neutral-300 hover:border-orange-500 rounded-lg p-12 text-center cursor-pointer transition-colors bg-neutral-50">
                 <input type="file" ref={fileInputRef} className="hidden" multiple onChange={e => e.target.files && setInput({...input, images: Array.from(e.target.files)})} />
                 <CameraIcon />
                 <span className="block mt-2 font-bold text-sm text-neutral-600">UPLOAD VISUALS</span>
              </div>
              <div className="mt-4 flex gap-2 overflow-x-auto">
                 {input.images.map((img, i) => <img key={i} src={URL.createObjectURL(img)} className="w-16 h-16 rounded-md object-cover border border-neutral-200" />)}
              </div>
              <textarea className="w-full mt-6 p-4 bg-neutral-50 rounded-md border border-neutral-200 font-mono text-sm focus:border-orange-500 outline-none" rows={3} placeholder="Describe the issue..." value={input.description} onChange={e => setInput({...input, description: e.target.value})} />
              <Button fullWidth onClick={startChatDiagnosis} disabled={!input.images.length && !input.description} className="mt-6">Analyze</Button>
           </div>
        </div>
      );
      case AppState.ANALYZING: return (
        <div className="h-[60vh] flex flex-col items-center justify-center text-center animate-fade-in">
           <div className="w-24 h-24 border-4 border-neutral-200 border-t-orange-600 rounded-full animate-spin mb-8"></div>
           <h2 className="text-2xl font-black text-neutral-900 uppercase">Analyzing System</h2>
           <p className="text-neutral-500 font-mono text-sm mt-2">Processing visual inputs...</p>
        </div>
      );
      case AppState.DIAGNOSIS: return (
        <div className="max-w-2xl mx-auto px-4 py-8 pb-32 animate-fade-in">
           {analysis && (
             <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-neutral-200">
                <div className={`h-2 w-full ${analysis.severity === Severity.LOW ? 'bg-emerald-500' : 'bg-orange-600'}`}></div>
                <div className="p-6">
                   <div className="flex justify-between items-start mb-4">
                      <h2 className="text-xl font-black uppercase text-neutral-900">{analysis.summary}</h2>
                      <SeverityBadge level={analysis.severity} />
                   </div>
                   <p className="text-neutral-600 text-sm mb-6">{analysis.possibleCause}</p>
                   <div className="flex gap-4">
                      <Button variant="outline" onClick={() => setAppState(AppState.UPLOAD)} fullWidth>Retake</Button>
                      <Button onClick={() => setAppState(AppState.CHAT_ROOM)} fullWidth>Consult Engineer</Button>
                   </div>
                </div>
             </div>
           )}
        </div>
      );
      case AppState.CHAT_ROOM: return (
        <div className="flex flex-col h-[calc(100vh-180px)] max-w-3xl mx-auto bg-white shadow-2xl border-x border-neutral-200 rounded-lg overflow-hidden">
           <div className="p-4 border-b border-neutral-200 flex justify-between items-center bg-white z-10">
              <div className="flex items-center gap-3">
                 <button onClick={() => setAppState(AppState.ENGINEER_LIST)}><BackIcon /></button>
                 <div>
                    <div className="font-bold text-neutral-900 uppercase leading-none">{selectedTech?.name || 'Support'}</div>
                    <div className="text-[10px] text-emerald-600 font-bold uppercase mt-1">● Online</div>
                 </div>
              </div>
              <Button onClick={() => { setGlobalAlert({message: "Booking Request Sent", type: 'success'}); setTimeout(()=>setGlobalAlert(null),3000); }} className="!py-1 !px-3 !text-xs">Book Now</Button>
           </div>
           <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50/50">
              {chatMessages.map(msg => (
                 <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.sender === 'user' ? 'bg-neutral-900 text-white rounded-br-none' : 'bg-white border border-neutral-200 rounded-bl-none shadow-sm'}`}>
                       {msg.text}
                       <div className={`text-[10px] mt-1 text-right ${msg.sender === 'user' ? 'text-neutral-500' : 'text-neutral-400'}`}>{msg.time}</div>
                    </div>
                 </div>
              ))}
           </div>
           <div className="p-4 border-t border-neutral-200 bg-white">
              <div className="flex gap-2 overflow-x-auto pb-3 mb-2 no-scrollbar">
                 {["Availability?", "Estimate?", "Location"].map(t => (
                    <button key={t} onClick={() => handleSendMessage(t)} className="whitespace-nowrap px-3 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-full text-xs font-bold uppercase text-neutral-600 transition-colors">{t}</button>
                 ))}
              </div>
              <div className="flex gap-2">
                 <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} className="flex-1 bg-neutral-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Type message..." />
                 <button onClick={() => handleSendMessage()} className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white hover:bg-orange-700 transition-colors"><SendIcon /></button>
              </div>
           </div>
        </div>
      );
      default: return null;
    }
  };

  const renderReportDetail = () => {
    if (!activeReport) return null;
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 pb-32 animate-fade-in bg-white min-h-screen report-container">
        <div className="flex justify-between items-center mb-6 no-print">
           <button onClick={() => setActiveReport(null)} className="text-neutral-500 hover:text-orange-600 font-bold uppercase text-xs flex items-center gap-2"><BackIcon /> Back to Reports</button>
           <button onClick={() => window.print()} className="bg-neutral-900 text-white px-4 py-2 rounded-sm text-xs font-bold uppercase flex items-center gap-2 hover:bg-orange-600 transition-colors"><PrinterIcon /> Print Report</button>
        </div>

        <div className="border border-neutral-200 p-8 rounded-lg shadow-sm print:shadow-none print:border-none">
           {/* Header */}
           <div className="flex justify-between items-start border-b-4 border-orange-600 pb-6 mb-8">
              <div>
                 <h1 className="text-3xl font-black text-neutral-900 uppercase tracking-tighter mb-1">FixGenie Report</h1>
                 <p className="text-neutral-500 font-mono text-xs">ID: {activeReport.id.toUpperCase()} // DATE: {activeReport.date}</p>
              </div>
              <div className="text-right">
                 <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">Status</div>
                 <StatusBadge status={activeReport.status} />
              </div>
           </div>

           {/* Main Grid */}
           <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                 <h2 className="text-sm font-bold text-neutral-500 uppercase tracking-widest mb-4">Problem Detail</h2>
                 <div className="bg-neutral-50 p-4 rounded-md border border-neutral-100 space-y-4">
                    <div>
                       <div className="text-xs text-neutral-400 font-bold uppercase">Issue Title</div>
                       <div className="font-bold text-lg">{activeReport.title}</div>
                    </div>
                    <div>
                       <div className="text-xs text-neutral-400 font-bold uppercase">Detected Category</div>
                       <div className="font-mono text-sm">{activeReport.category}</div>
                    </div>
                    <div>
                       <div className="text-xs text-neutral-400 font-bold uppercase">Severity</div>
                       <SeverityBadge level={activeReport.severity} />
                    </div>
                 </div>
              </div>
              
              <div>
                 <h2 className="text-sm font-bold text-neutral-500 uppercase tracking-widest mb-4">Visual Evidence</h2>
                 {activeReport.images && activeReport.images.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                       {activeReport.images.map((img, i) => (
                          <div key={i} className="aspect-square bg-neutral-100 rounded-md overflow-hidden border border-neutral-200">
                             <img src={img} className="w-full h-full object-cover" />
                          </div>
                       ))}
                    </div>
                 ) : (
                    <div className="bg-neutral-50 h-32 flex items-center justify-center text-neutral-400 text-xs font-mono uppercase border border-neutral-200 rounded-md">No images archived</div>
                 )}
              </div>
           </div>

           {/* Analysis Section */}
           <div className="mb-8">
              <h2 className="text-sm font-bold text-neutral-500 uppercase tracking-widest mb-4">AI Diagnostics</h2>
              <div className="bg-neutral-50 p-6 rounded-md border border-neutral-200">
                 <div className="grid md:grid-cols-2 gap-6">
                    <div>
                       <h3 className="font-bold text-orange-600 uppercase text-xs mb-2">Summary</h3>
                       <p className="text-sm text-neutral-700 mb-4">{activeReport.summary}</p>
                       <h3 className="font-bold text-orange-600 uppercase text-xs mb-2">Possible Root Cause</h3>
                       <p className="text-sm text-neutral-700">{activeReport.possibleCause || "Analysis pending."}</p>
                    </div>
                    <div className="border-l border-neutral-200 pl-6">
                       <h3 className="font-bold text-emerald-600 uppercase text-xs mb-2">Recommended Action</h3>
                       <p className="text-sm text-neutral-700 mb-4">{activeReport.recommendedAction || "Consult technician."}</p>
                       <h3 className="font-bold text-neutral-600 uppercase text-xs mb-2">Estimated Cost</h3>
                       <div className="font-mono font-bold text-lg">{activeReport.costEstimate || "TBD"}</div>
                    </div>
                 </div>
              </div>
           </div>
           
           {/* Tools Section */}
           {activeReport.requiredTools && activeReport.requiredTools.length > 0 && (
             <div className="mb-8">
               <h2 className="text-sm font-bold text-neutral-500 uppercase tracking-widest mb-4">Required Equipment</h2>
               <div className="flex flex-wrap gap-2">
                  {activeReport.requiredTools.map(t => (
                     <span key={t} className="px-3 py-1 bg-neutral-100 text-neutral-600 text-xs font-bold uppercase rounded-full border border-neutral-200">{t}</span>
                  ))}
               </div>
             </div>
           )}

           {/* Footer */}
           <div className="border-t border-neutral-200 pt-6 mt-12 flex justify-between items-end">
              <div>
                 <div className="font-black text-xl tracking-tighter text-neutral-900">Fix<span className="text-orange-600">Genie</span></div>
                 <div className="text-[10px] text-neutral-400 font-mono uppercase">AI-Powered Repair Diagnostics</div>
              </div>
              <div className="text-right text-[10px] text-neutral-400 font-mono">
                 Generated on {new Date().toLocaleDateString()}
              </div>
           </div>
        </div>
      </div>
    );
  };

  const renderReports = () => {
    if (activeReport) return renderReportDetail();

    const filteredReports = reports.filter(r => {
       // Filter by Status
       const matchesStatus = (reportFilter === 'ALL') || 
                             (reportFilter === 'RESOLVED' && r.status === ReportStatus.RESOLVED) ||
                             (reportFilter === 'OPEN' && r.status !== ReportStatus.RESOLVED);
       
       // Filter by Search Query (Technician, Specialty/Category, Title)
       const query = searchQuery.toLowerCase();
       const matchesSearch = !query || 
                             (r.technician && r.technician.toLowerCase().includes(query)) || 
                             r.category.toLowerCase().includes(query) ||
                             r.title.toLowerCase().includes(query);

       return matchesStatus && matchesSearch;
    });

    return (
      <div className="max-w-4xl mx-auto px-4 py-8 pb-32 animate-fade-in">
         <h1 className="text-3xl font-black text-neutral-900 uppercase tracking-tight mb-8">Reports Log</h1>
         
         <div className="mb-6 space-y-4">
            {/* Search Input */}
            <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                  <SearchIcon />
               </div>
               <input 
                 type="text" 
                 className="block w-full pl-10 pr-3 py-3 border border-neutral-200 rounded-lg leading-5 bg-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                 placeholder="Search by technician, specialty, or title..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
            </div>

            {/* Status Tabs */}
            <div className="flex gap-2 border-b border-neutral-200 pb-1">
              {['ALL', 'OPEN', 'RESOLVED'].map(f => (
                 <button 
                   key={f}
                   onClick={() => setReportFilter(f as any)}
                   className={`px-4 py-2 text-xs font-bold uppercase transition-colors relative ${reportFilter === f ? 'text-orange-600' : 'text-neutral-400 hover:text-neutral-600'}`}
                 >
                   {f}
                   {reportFilter === f && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600"></div>}
                 </button>
              ))}
            </div>
         </div>

         <div className="grid gap-4">
            {filteredReports.length > 0 ? filteredReports.map(r => (
               <div key={r.id} onClick={() => setActiveReport(r)} className="bg-white p-6 rounded-lg border border-neutral-200 shadow-sm hover:shadow-md transition-all flex justify-between items-center group cursor-pointer hover:border-orange-500">
                  <div>
                     <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg text-neutral-900 group-hover:text-orange-600 transition-colors">{r.title}</h3>
                        <SeverityBadge level={r.severity} />
                     </div>
                     <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-500">
                        <span>{r.date}</span>
                        <span className="w-1 h-1 bg-neutral-300 rounded-full"></span>
                        <span className="uppercase">{r.category}</span>
                        {r.technician && (
                           <>
                              <span className="w-1 h-1 bg-neutral-300 rounded-full"></span>
                              <span className="text-orange-600">Tech: {r.technician}</span>
                           </>
                        )}
                        <span className="w-1 h-1 bg-neutral-300 rounded-full"></span>
                        <StatusBadge status={r.status} />
                     </div>
                  </div>
                  <div className="text-neutral-300 group-hover:text-orange-600 transition-colors">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                  </div>
               </div>
            )) : (
               <div className="text-center py-12 text-neutral-400">
                  <p className="text-sm font-bold uppercase tracking-widest">No matching reports found</p>
               </div>
            )}
         </div>
      </div>
    );
  };

  const renderWallet = () => (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-32 animate-fade-in">
       <h1 className="text-3xl font-black text-neutral-900 uppercase tracking-tight mb-8">Secure Wallet</h1>
       
       {/* Cards */}
       <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-neutral-500 uppercase text-xs tracking-widest">Payment Methods</h3>
            <button onClick={() => setShowAddCard(!showAddCard)} className="text-orange-600 text-xs font-bold uppercase hover:underline">+ Add Card</button>
          </div>
          
          {showAddCard && (
             <form onSubmit={handleAddCard} className="bg-neutral-900 border border-neutral-700 p-6 rounded-lg mb-6 animate-fade-in shadow-xl text-white">
                <h3 className="text-white text-sm font-bold uppercase mb-4">Add New Card</h3>
                <div className="grid gap-4">
                   <input type="text" placeholder="Cardholder Name" required value={newCard.holderName} onChange={e => setNewCard({...newCard, holderName: e.target.value})} className="p-3 bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500 text-sm rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-600" />
                   <input type="text" placeholder="Card Number" required value={newCard.number} onChange={e => setNewCard({...newCard, number: e.target.value})} className="p-3 bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500 text-sm font-mono rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-600" maxLength={16} />
                   <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="MM/YY" required value={newCard.expiry} onChange={e => setNewCard({...newCard, expiry: e.target.value})} className="p-3 bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500 text-sm font-mono rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-600" />
                      <input type="text" placeholder="CVV" required value={newCard.cvv} onChange={e => setNewCard({...newCard, cvv: e.target.value})} className="p-3 bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500 text-sm font-mono rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-600" maxLength={3} />
                   </div>
                   <div className="flex justify-end gap-2 mt-2">
                      <Button type="button" variant="outline" className="!text-white !border-neutral-600 hover:!border-white" onClick={() => setShowAddCard(false)}>Cancel</Button>
                      <Button type="submit" variant="primary">Save Method</Button>
                   </div>
                </div>
             </form>
          )}

          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
             {cards.map(card => (
                <div key={card.id} className="min-w-[300px] bg-neutral-900 text-white p-6 rounded-xl shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer border border-neutral-700">
                   <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-orange-500/10 transition-colors"></div>
                   <div className="relative z-10">
                      <div className="flex justify-between items-start mb-8">
                         <div className="text-xs font-mono text-neutral-400">CREDIT</div>
                         <div className="text-lg font-bold italic">{card.type}</div>
                      </div>
                      <div className="font-mono text-2xl tracking-widest mb-6">•••• •••• •••• {card.last4}</div>
                      <div className="flex justify-between items-end">
                         <div>
                            <div className="text-[10px] text-neutral-500 font-bold uppercase mb-1">Cardholder</div>
                            <div className="text-sm font-bold uppercase tracking-wide">{card.holderName}</div>
                         </div>
                         <div>
                            <div className="text-[10px] text-neutral-500 font-bold uppercase mb-1">Expires</div>
                            <div className="text-sm font-mono">{card.expiry}</div>
                         </div>
                      </div>
                   </div>
                </div>
             ))}
          </div>
       </div>

       {/* Transactions */}
       <div>
          <h3 className="font-bold text-neutral-500 uppercase text-xs tracking-widest mb-4">Transaction History</h3>
          <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
             {MOCK_PAYMENTS.map((p, idx) => (
                <div key={p.id} className={`p-4 flex justify-between items-center hover:bg-neutral-50 ${idx !== MOCK_PAYMENTS.length-1 ? 'border-b border-neutral-100' : ''}`}>
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center"><CheckCircleIcon /></div>
                      <div>
                         <div className="font-bold text-neutral-900">{p.technicianName}</div>
                         <div className="text-xs text-neutral-500 font-mono">ID: {p.bookingId} • {p.date}</div>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="font-mono font-bold text-neutral-900">${p.amount.toFixed(2)}</div>
                      <button className="text-[10px] font-bold text-orange-600 uppercase hover:underline mt-1">Invoice</button>
                   </div>
                </div>
             ))}
          </div>
       </div>
    </div>
  );

  const renderRatings = () => (
    <div className="max-w-xl mx-auto px-4 py-8 pb-32 animate-fade-in text-center">
       <h1 className="text-3xl font-black text-neutral-900 uppercase tracking-tight mb-8">Feedback</h1>
       <div className="bg-white p-8 rounded-xl shadow-xl border border-neutral-200 text-left">
          <div className="text-center mb-6">
             <div className="w-20 h-20 bg-neutral-100 rounded-full mx-auto mb-4 overflow-hidden"><img src="https://picsum.photos/seed/mike/100/100" className="w-full h-full object-cover grayscale" /></div>
             <h2 className="text-xl font-bold text-neutral-900 mb-1">Mike Kowalski</h2>
             <p className="text-xs text-neutral-500 uppercase font-bold">Plumbing Job #8821</p>
          </div>
          
          <div className="flex justify-center gap-2 mb-6">
             {[1,2,3,4,5].map(s => <button key={s} onClick={() => setRating(s)} className={`text-4xl transition-transform hover:scale-110 ${s <= rating ? 'text-orange-500' : 'text-neutral-200'}`}>★</button>)}
          </div>
          
          <div className="mb-6">
             <label className="text-xs font-bold text-neutral-500 uppercase mb-2 block">Your Comments (Optional)</label>
             <textarea 
               className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-md focus:border-orange-500 outline-none font-sans text-sm h-32 resize-none"
               placeholder="How was your experience with Mike?"
               value={ratingComment}
               onChange={(e) => setRatingComment(e.target.value)}
             />
          </div>

          <Button fullWidth onClick={handleSubmitRating}>Submit Review</Button>
       </div>
    </div>
  );

  const renderSettings = () => (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-32 animate-fade-in">
       <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-neutral-900 uppercase tracking-tight">Settings</h1>
          <Button onClick={handleSaveSettings} className="!py-2 !px-4 !text-xs hidden md:flex">Save</Button>
       </div>
       
       <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-neutral-100 bg-neutral-50">
             <h3 className="font-bold text-neutral-900 uppercase text-sm">Profile</h3>
          </div>
          <div className="p-6 space-y-4">
             <div>
               <label className="text-xs font-bold text-neutral-500 uppercase mb-1 block">Full Name</label>
               <input 
                 type="text" 
                 value={profile.name} 
                 onChange={(e) => setProfile({...profile, name: e.target.value})}
                 className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-md text-sm focus:border-orange-500 outline-none transition-colors" 
               />
             </div>
             <div>
               <label className="text-xs font-bold text-neutral-500 uppercase mb-1 block">Email Address</label>
               <input 
                 type="email" 
                 value={profile.email} 
                 onChange={(e) => setProfile({...profile, email: e.target.value})}
                 className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-md text-sm focus:border-orange-500 outline-none transition-colors" 
               />
             </div>
             <div>
               <label className="text-xs font-bold text-neutral-500 uppercase mb-1 block">Phone Number</label>
               <input 
                 type="tel" 
                 value={profile.phone} 
                 onChange={(e) => setProfile({...profile, phone: e.target.value})}
                 className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-md text-sm focus:border-orange-500 outline-none transition-colors" 
               />
             </div>
             <div>
               <label className="text-xs font-bold text-neutral-500 uppercase mb-1 block">City</label>
               <input 
                 type="text" 
                 value={profile.city} 
                 onChange={(e) => setProfile({...profile, city: e.target.value})}
                 className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-md text-sm focus:border-orange-500 outline-none transition-colors" 
               />
             </div>
          </div>
       </div>
       <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-neutral-100 bg-neutral-50">
             <h3 className="font-bold text-neutral-900 uppercase text-sm">Preferences</h3>
          </div>
          <div className="divide-y divide-neutral-100">
             <div className="p-4 flex justify-between items-center">
                <span className="text-sm font-medium text-neutral-700">Language</span>
                <button className="text-xs font-bold uppercase bg-neutral-100 px-3 py-1 rounded-full text-neutral-600">{settings.language}</button>
             </div>
             <div className="p-4 flex justify-between items-center cursor-pointer" onClick={() => setSettings(prev => ({
                ...prev,
                notifications: {
                    ...prev.notifications,
                    updates: !prev.notifications.updates
                }
             }))}>
                <span className="text-sm font-medium text-neutral-700">Notifications</span>
                <div className={`w-10 h-6 rounded-full relative transition-colors ${settings.notifications.updates ? 'bg-orange-600' : 'bg-neutral-300'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-all ${settings.notifications.updates ? 'right-1' : 'left-1'}`}></div>
                </div>
             </div>
          </div>
       </div>
       
       <div className="flex justify-end mt-6">
          <Button onClick={handleSaveSettings} className="w-full md:w-auto">Save Changes</Button>
       </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-32 animate-fade-in">
       <h1 className="text-3xl font-black text-neutral-900 uppercase tracking-tight mb-8">Notifications</h1>
       <div className="space-y-4">
          {notifications.map(n => (
             <div key={n.id} className={`bg-white p-4 rounded-lg border shadow-sm flex gap-4 ${n.read ? 'border-neutral-200 opacity-70' : 'border-orange-200 border-l-4 border-l-orange-500'}`}>
                <div className="flex-1">
                   <h3 className="font-bold text-neutral-900 text-sm">{n.title}</h3>
                   <p className="text-neutral-600 text-xs mt-1">{n.message}</p>
                   <div className="text-[10px] text-neutral-400 font-mono mt-2 uppercase">{n.time}</div>
                </div>
                {!n.read && <div className="w-2 h-2 bg-orange-500 rounded-full mt-1"></div>}
             </div>
          ))}
          {notifications.length === 0 && (
             <div className="text-center py-12 text-neutral-400 text-sm font-bold uppercase">No new notifications</div>
          )}
       </div>
    </div>
  );

  // --- Main Render ---

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-orange-200 selection:text-orange-900">
      
      {/* Navbar (Hidden on Print) */}
      <nav className="fixed top-0 left-0 right-0 bg-neutral-900/95 backdrop-blur-md text-white px-6 py-4 flex justify-between items-center z-50 border-b border-white/10 shadow-lg no-print">
         <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setActiveTab(Tab.HOME); setAppState(AppState.ENGINEER_LIST); }}>
            <div className="w-8 h-8 bg-white text-neutral-900 rounded-sm flex items-center justify-center font-black text-sm tracking-tighter">FG</div>
            <span className="font-bold uppercase tracking-wider text-sm hidden sm:inline">FixGenie</span>
         </div>
         <div className="flex items-center gap-4">
            <button 
               onClick={() => setActiveTab(Tab.NOTIFICATIONS)}
               className="p-2 hover:bg-white/10 rounded-full transition-colors relative"
            >
               <div className="w-2 h-2 bg-orange-500 rounded-full absolute top-2 right-2 border-2 border-neutral-900"></div>
               <BellIcon />
            </button>
         </div>
      </nav>

      {/* Floating AI Button (Hidden on Print) */}
      <button 
        onClick={() => setShowAIAssistant(true)}
        className="fixed bottom-24 right-4 z-[55] w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-700 text-white rounded-full shadow-[0_10px_25px_rgba(234,88,12,0.6)] flex items-center justify-center border-2 border-white/20 hover:scale-110 transition-all active:scale-95 group no-print"
      >
         <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
         <span className="font-black text-2xl tracking-tighter italic drop-shadow-sm">AI</span>
         <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-neutral-900"></span>
         </span>
      </button>

      {/* Global Alert */}
      {globalAlert && (
         <div className="fixed top-16 left-0 right-0 bg-emerald-600 text-white p-3 text-center text-xs font-bold uppercase tracking-widest z-40 animate-slide-up shadow-md no-print">
            {globalAlert.message}
         </div>
      )}

      {/* Main Content */}
      <main className="pt-20">
         {activeTab === Tab.HOME && renderChatFlow()}
         {activeTab === Tab.REPORTS && renderReports()}
         {activeTab === Tab.WALLET && renderWallet()}
         {activeTab === Tab.RATINGS && renderRatings()}
         {activeTab === Tab.SETTINGS && renderSettings()}
         {activeTab === Tab.NOTIFICATIONS && renderNotifications()}
      </main>

      <AIAssistantOverlay 
         isOpen={showAIAssistant} 
         onClose={() => setShowAIAssistant(false)} 
         onSaveReport={(r) => { setReports(p => [r, ...p]); setGlobalAlert({message: "Report Saved", type: 'success'}); setTimeout(()=>setGlobalAlert(null), 3000); }} 
      />

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}