export enum AppState {
  // Diagnosis Flow States
  UPLOAD = 'UPLOAD',
  ANALYZING = 'ANALYZING',
  DIAGNOSIS = 'DIAGNOSIS',
  DIY_GUIDE = 'DIY_GUIDE',
  PRO_MATCHING = 'PRO_MATCHING', 
  BOOKING = 'BOOKING',
  SUCCESS = 'SUCCESS',
  
  // Chat Flow specific
  ENGINEER_LIST = 'ENGINEER_LIST',
  CONTEXT_SELECTION = 'CONTEXT_SELECTION',
  CHAT_ROOM = 'CHAT_ROOM',
  
  // Report Views
  REPORT_DETAIL = 'REPORT_DETAIL'
}

export enum Tab {
  HOME = 'HOME',
  REPORTS = 'REPORTS',
  WALLET = 'WALLET',
  RATINGS = 'RATINGS',
  SETTINGS = 'SETTINGS',
  NOTIFICATIONS = 'NOTIFICATIONS'
}

export enum Severity {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  DANGEROUS = 'Dangerous'
}

export enum IssueType {
  PLUMBING = 'Plumbing',
  ELECTRICAL = 'Electrical',
  AUTO = 'Auto',
  HVAC = 'HVAC',
  CONSTRUCTION = 'Construction',
  GENERAL = 'General'
}

export enum ReportStatus {
  DRAFT = 'Draft',
  AI_COMPLETED = 'AI Completed',
  AWAITING_TECH = 'Awaiting Technician',
  TECH_ASSIGNED = 'Technician Assigned',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved'
}

export interface DIYGuide {
  steps: string[];
  tools: string[];
  timeEstimate: string;
  safetyWarnings: string[];
}

export interface TechnicianReport {
  problemTitle: string;
  description: string;
  suspectedCause: string;
  urgency: string;
  requiredSkills: string;
}

export interface AnalysisResult {
  classification: 'Simple DIY' | 'Needs Professional';
  severity: Severity;
  summary: string;
  possibleCause: string;
  detectedSpecialty: IssueType;
  diyGuide?: DIYGuide;
  technicianReport?: TechnicianReport;
}

export interface Technician {
  id: string;
  name: string;
  specialty: IssueType;
  city: string;
  rating: number;
  reviewCount: number;
  priceRange: string; // e.g., "$$ - $$$"
  hourlyRate: number;
  availabilitySlots: string[]; // ISO date strings or simple "Today 2pm"
  avatarUrl: string;
  status: 'Online' | 'Busy' | 'Offline';
}

export interface UserInput {
  images: File[];
  description: string;
  location: string;
}

export interface MockReport {
  id: string;
  title: string;
  date: string;
  severity: Severity;
  technician?: string;
  summary: string;
  status: ReportStatus;
  // Extended details for printable view
  category: IssueType;
  possibleCause: string;
  recommendedAction: string; 
  costEstimate: string;
  requiredTools: string[];
  images?: string[]; 
}

export interface MockPayment {
  id: string;
  bookingId: string;
  technicianName: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Pending';
}

export interface CreditCard {
  id: string;
  type: 'Visa' | 'MasterCard' | 'Amex';
  last4: string;
  expiry: string;
  holderName: string;
}

export interface MockNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'tech';
  text: string;
  time: string;
  isSmartReply?: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  city: string;
  language: string;
}

export interface SettingsState {
  language: 'English' | 'Arabic';
  notifications: {
    booking: boolean;
    updates: boolean;
    reports: boolean;
  };
  contactMethod: 'Email' | 'Phone';
}
