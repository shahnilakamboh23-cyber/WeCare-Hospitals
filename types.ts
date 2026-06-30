export interface Doctor {
  id: string;
  name: string;
  title: string;
  departmentId: string;
  rating: number;
  reviewsCount: number;
  experience: string;
  image: string;
  bio: string;
  education: string;
  availability: string[]; // e.g., ["Monday", "Wednesday", "Friday"]
  timeSlots: string[]; // e.g., ["09:00 AM", "10:00 AM", "02:00 PM"]
  fee: number;
}

export interface Department {
  id: string;
  name: string;
  iconName: string; // references lucide icon dynamically
  description: string;
  longDescription: string;
  symptoms: string[];
  services: string[];
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorTitle: string;
  doctorImage: string;
  departmentName: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  date: string;
  timeSlot: string;
  symptoms: string;
  status: 'scheduled' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  patientName: string;
  rating: number;
  text: string;
  treatment: string;
  date: string;
}
