// Mock API service for PetCare
// In production, replace these with actual API calls to your Spring Boot backend

export type UserRole = 'PET_OWNER' | 'VETERINARIAN' | 'ADMIN';

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface Pet {
  id: number;
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: number;
  ownerId: number;
  imageUrl?: string;
}

export interface Appointment {
  id: number;
  petId: number;
  petName: string;
  ownerName: string;
  vetId: number;
  vetName: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  reason: string;
}

export interface HealthRecord {
  id: number;
  petId: number;
  petName: string;
  date: string;
  type: string;
  description: string;
  vetName: string;
}

export interface Message {
  id: number;
  senderId: number;
  senderName: string;
  receiverId: number;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Prescription {
  id: number;
  petId: number;
  petName: string;
  medication: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  vetName: string;
}

// Mock data storage
const mockUsers: User[] = [
  { id: 1, email: 'owner@petcare.com', name: 'John Smith', role: 'PET_OWNER' },
  { id: 2, email: 'vet@petcare.com', name: 'Dr. Sarah Johnson', role: 'VETERINARIAN' },
  { id: 3, email: 'admin@petcare.com', name: 'Admin User', role: 'ADMIN' },
];

const mockPets: Pet[] = [
  { id: 1, name: 'Buddy', species: 'Dog', breed: 'Golden Retriever', age: 3, weight: 30, ownerId: 1 },
  { id: 2, name: 'Whiskers', species: 'Cat', breed: 'Persian', age: 5, weight: 4.5, ownerId: 1 },
  { id: 3, name: 'Max', species: 'Dog', breed: 'German Shepherd', age: 2, weight: 35, ownerId: 1 },
];

const mockAppointments: Appointment[] = [
  { id: 1, petId: 1, petName: 'Buddy', ownerName: 'John Smith', vetId: 2, vetName: 'Dr. Sarah Johnson', date: '2026-01-25', time: '10:00 AM', status: 'scheduled', reason: 'Annual checkup' },
  { id: 2, petId: 2, petName: 'Whiskers', ownerName: 'John Smith', vetId: 2, vetName: 'Dr. Sarah Johnson', date: '2026-01-26', time: '2:00 PM', status: 'scheduled', reason: 'Vaccination' },
  { id: 3, petId: 3, petName: 'Max', ownerName: 'John Smith', vetId: 2, vetName: 'Dr. Sarah Johnson', date: '2026-01-20', time: '11:00 AM', status: 'completed', reason: 'Dental cleaning' },
];

const mockHealthRecords: HealthRecord[] = [
  { id: 1, petId: 1, petName: 'Buddy', date: '2026-01-15', type: 'Vaccination', description: 'Rabies vaccine administered', vetName: 'Dr. Sarah Johnson' },
  { id: 2, petId: 1, petName: 'Buddy', date: '2025-12-10', type: 'Checkup', description: 'Annual wellness exam - all clear', vetName: 'Dr. Sarah Johnson' },
  { id: 3, petId: 2, petName: 'Whiskers', date: '2026-01-10', type: 'Treatment', description: 'Treated for mild ear infection', vetName: 'Dr. Sarah Johnson' },
];

const mockPrescriptions: Prescription[] = [
  { id: 1, petId: 2, petName: 'Whiskers', medication: 'Amoxicillin', dosage: '50mg', frequency: 'Twice daily', startDate: '2026-01-10', endDate: '2026-01-20', vetName: 'Dr. Sarah Johnson' },
  { id: 2, petId: 1, petName: 'Buddy', medication: 'Heartgard', dosage: '1 tablet', frequency: 'Monthly', startDate: '2026-01-01', endDate: '2026-12-31', vetName: 'Dr. Sarah Johnson' },
];

const mockMessages: Message[] = [
  { id: 1, senderId: 1, senderName: 'John Smith', receiverId: 2, content: 'Hi Dr. Johnson, I have a question about Buddy\'s medication.', timestamp: '2026-01-22T10:30:00', read: true },
  { id: 2, senderId: 2, senderName: 'Dr. Sarah Johnson', receiverId: 1, content: 'Of course! What would you like to know?', timestamp: '2026-01-22T10:35:00', read: false },
];

// API Functions
export const api = {
  // Auth
  login: async (email: string, password: string, role: UserRole): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    const user = mockUsers.find(u => u.email === email && u.role === role);
    if (user) {
      localStorage.setItem('petcare_user', JSON.stringify(user));
      return user;
    }
    // For demo, allow any email with password "demo123"
    if (password === 'demo123') {
      const newUser: User = {
        id: Date.now(),
        email,
        name: email.split('@')[0],
        role,
      };
      localStorage.setItem('petcare_user', JSON.stringify(newUser));
      return newUser;
    }
    return null;
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem('petcare_user');
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem('petcare_user');
    return stored ? JSON.parse(stored) : null;
  },

  // Pets
  getPets: async (ownerId?: number): Promise<Pet[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return ownerId ? mockPets.filter(p => p.ownerId === ownerId) : mockPets;
  },

  getPetById: async (id: number): Promise<Pet | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockPets.find(p => p.id === id);
  },

  // Appointments
  getAppointments: async (userId?: number, role?: UserRole): Promise<Appointment[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (role === 'VETERINARIAN' && userId) {
      return mockAppointments.filter(a => a.vetId === userId);
    }
    return mockAppointments;
  },

  getUpcomingAppointments: async (): Promise<Appointment[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockAppointments.filter(a => a.status === 'scheduled');
  },

  // Health Records
  getHealthRecords: async (petId?: number): Promise<HealthRecord[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return petId ? mockHealthRecords.filter(r => r.petId === petId) : mockHealthRecords;
  },

  // Prescriptions
  getPrescriptions: async (petId?: number): Promise<Prescription[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return petId ? mockPrescriptions.filter(p => p.petId === petId) : mockPrescriptions;
  },

  // Messages
  getMessages: async (userId: number): Promise<Message[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockMessages.filter(m => m.senderId === userId || m.receiverId === userId);
  },

  getUnreadCount: async (userId: number): Promise<number> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockMessages.filter(m => m.receiverId === userId && !m.read).length;
  },

  // Dashboard stats
  getDashboardStats: async (role: UserRole): Promise<Record<string, number>> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    if (role === 'PET_OWNER') {
      return {
        totalPets: mockPets.length,
        upcomingAppointments: mockAppointments.filter(a => a.status === 'scheduled').length,
        healthRecords: mockHealthRecords.length,
        unreadMessages: 1,
      };
    }
    if (role === 'VETERINARIAN') {
      return {
        todayAppointments: 5,
        pendingConsultations: 3,
        activePrescriptions: mockPrescriptions.length,
        unreadMessages: 2,
      };
    }
    return {
      totalUsers: mockUsers.length,
      totalPets: mockPets.length,
      totalAppointments: mockAppointments.length,
    };
  },
};
