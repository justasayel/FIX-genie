import { IssueType, Technician, MockReport, MockPayment, MockNotification, ChatMessage, Severity, CreditCard, ReportStatus } from "./types";

export const MOCK_TECHNICIANS: Technician[] = [
  {
    id: 't1',
    name: 'Mike "The Wrench" Kowalski',
    specialty: IssueType.PLUMBING,
    city: 'Chicago',
    rating: 4.9,
    reviewCount: 124,
    priceRange: '$$',
    hourlyRate: 85,
    availabilitySlots: ['Today 2:00 PM', 'Today 4:30 PM', 'Tomorrow 9:00 AM'],
    avatarUrl: 'https://picsum.photos/seed/mike/100/100',
    status: 'Online'
  },
  {
    id: 't2',
    name: 'Elena Rodriguez',
    specialty: IssueType.ELECTRICAL,
    city: 'New York',
    rating: 5.0,
    reviewCount: 89,
    priceRange: '$$$',
    hourlyRate: 120,
    availabilitySlots: ['Tomorrow 11:00 AM', 'Tomorrow 2:00 PM'],
    avatarUrl: 'https://picsum.photos/seed/elena/100/100',
    status: 'Busy'
  },
  {
    id: 't3',
    name: 'QuickFix Auto',
    specialty: IssueType.AUTO,
    city: 'Los Angeles',
    rating: 4.7,
    reviewCount: 312,
    priceRange: '$$',
    hourlyRate: 95,
    availabilitySlots: ['Today 5:00 PM', 'Tomorrow 8:00 AM', 'Tomorrow 10:00 AM'],
    avatarUrl: 'https://picsum.photos/seed/auto1/100/100',
    status: 'Online'
  },
  {
    id: 't4',
    name: 'Sarah Chen (HVAC Pro)',
    specialty: IssueType.HVAC,
    city: 'San Francisco',
    rating: 4.8,
    reviewCount: 56,
    priceRange: '$$$',
    hourlyRate: 110,
    availabilitySlots: ['Tomorrow 1:00 PM', 'Wednesday 9:00 AM'],
    avatarUrl: 'https://picsum.photos/seed/sarah/100/100',
    status: 'Offline'
  },
  {
    id: 't5',
    name: 'Joe Builder',
    specialty: IssueType.CONSTRUCTION,
    city: 'Chicago',
    rating: 4.5,
    reviewCount: 22,
    priceRange: '$',
    hourlyRate: 60,
    availabilitySlots: ['Today 1:00 PM', 'Today 3:00 PM'],
    avatarUrl: 'https://picsum.photos/seed/joe/100/100',
    status: 'Online'
  },
  {
    id: 't6',
    name: 'Speedy Plumbers Inc.',
    specialty: IssueType.PLUMBING,
    city: 'New York',
    rating: 4.2,
    reviewCount: 450,
    priceRange: '$$$',
    hourlyRate: 150,
    availabilitySlots: ['Today 12:30 PM', 'Today 1:00 PM'],
    avatarUrl: 'https://picsum.photos/seed/speedy/100/100',
    status: 'Online'
  }
];

export const INITIAL_CITIES = ['New York', 'Los Angeles', 'Chicago', 'San Francisco', 'Remote'];

export const SAMPLE_PROMPT_BROKEN_PIPE = "The pipe under my kitchen sink has a large crack and water is spraying everywhere when I turn it on.";
export const SAMPLE_PROMPT_FLAT_TIRE = "My car tire is completely flat and I see a nail sticking out of the sidewall.";

export const MOCK_REPORTS: MockReport[] = [
  { 
    id: 'r1', 
    title: 'Leaking Radiator - Kitchen', 
    date: '2023-10-15', 
    severity: Severity.MEDIUM, 
    technician: 'Mike Kowalski', 
    summary: 'Identified corrosion on valve joint.',
    status: ReportStatus.RESOLVED,
    category: IssueType.PLUMBING,
    possibleCause: 'Galvanic corrosion between copper pipe and aluminum radiator valve.',
    recommendedAction: 'Professional replacement of radiator valve and system flush.',
    costEstimate: '$150 - $250',
    requiredTools: ['Pipe Wrench', 'Drain Pan', 'Radiator Key'],
    images: ['https://picsum.photos/seed/leak/300/200']
  },
  { 
    id: 'r2', 
    title: 'Circuit Breaker Trip', 
    date: '2023-09-22', 
    severity: Severity.HIGH, 
    technician: 'Elena Rodriguez', 
    summary: 'Overload in main kitchen circuit.',
    status: ReportStatus.TECH_ASSIGNED,
    category: IssueType.ELECTRICAL,
    possibleCause: 'Simultaneous use of high-wattage appliances (Microwave + Toaster Oven) exceeding circuit capacity.',
    recommendedAction: 'Install dedicated circuit for microwave or upgrade panel.',
    costEstimate: '$300 - $500',
    requiredTools: ['Multimeter', 'Wire Strippers', 'Insulated Screwdriver'],
    images: ['https://picsum.photos/seed/spark/300/200']
  },
  { 
    id: 'r3', 
    title: 'Drywall Crack', 
    date: '2023-08-05', 
    severity: Severity.LOW, 
    summary: 'Settlement crack, cosmetic only. DIY repair advised.',
    status: ReportStatus.AI_COMPLETED,
    category: IssueType.CONSTRUCTION,
    possibleCause: 'Natural settling of the building foundation.',
    recommendedAction: 'Simple DIY Patch & Paint.',
    costEstimate: '$20 - $50',
    requiredTools: ['Putty Knife', 'Spackle', 'Sandpaper', 'Paint'],
    images: ['https://picsum.photos/seed/wall/300/200']
  }
];

export const MOCK_PAYMENTS: MockPayment[] = [
  { id: 'p1', bookingId: 'BK-7829', technicianName: 'Mike Kowalski', amount: 85.00, date: '2023-10-16', status: 'Paid' },
  { id: 'p2', bookingId: 'BK-6621', technicianName: 'Elena Rodriguez', amount: 120.00, date: '2023-09-23', status: 'Paid' }
];

export const MOCK_CREDIT_CARDS: CreditCard[] = [
  { id: 'cc1', type: 'Visa', last4: '4242', expiry: '12/25', holderName: 'ALEX ENGINEER' },
  { id: 'cc2', type: 'MasterCard', last4: '8899', expiry: '08/24', holderName: 'ALEX FIXIT' }
];

export const MOCK_NOTIFICATIONS: MockNotification[] = [
  { id: 'n1', title: 'Technician Arriving', message: 'Mike is 5 minutes away.', time: '10 mins ago', read: false },
  { id: 'n2', title: 'Report Ready', message: 'Your AI diagnosis for "Car Noise" is ready.', time: '1 hour ago', read: false },
  { id: 'n3', title: 'Payment Successful', message: 'Payment for Booking #BK-7829 confirmed.', time: '2 days ago', read: true }
];

export const MOCK_CHAT: ChatMessage[] = [
  { id: 'c1', sender: 'tech', text: 'Hi! I received the AI report. Is there secure parking nearby?', time: '10:00 AM' },
  { id: 'c2', sender: 'user', text: 'Yes, you can park in the driveway.', time: '10:02 AM' },
  { id: 'c3', sender: 'tech', text: 'Great, see you at 2 PM.', time: '10:05 AM' }
];
