export interface User {
  id: number;
  name: string;
  email: string;
  role: "customer" | "doctor" | "barber" | "admin";
  organization_id?: number;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: number;
  name: string;
  description: string;
  established_date: string;
  address: string;
  phone: string;
  email: string;
  created_at: string;
  updated_at: string;
  members?: User[];
  is_approved: number;
}

export interface Appointment {
  id: number;
  customer_id: number;
  professional_id: number;
  date: string;
  time: string;
  service: string;
  duration: number;
  price: number;
  status:
    | "scheduled"
    | "completed"
    | "cancelled"
    | "reschedule_requested"
    | "reschedule_approved"
    | "reschedule_rejected";
  notes?: string;
  created_at: string;
  updated_at: string;
  customer?: User;
  professional?: User;
  client?: User;
  reschedule_date?: string;
  reschedule_time?: string;
  feedback?: FeedbackData | null;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  role: "customer" | "doctor" | "barber";
}

export interface CreateAppointmentData {
  professional_id: number;
  date: string;
  time: string;
  service: string;
  duration: number;
  price: number;
  notes?: string;
}

export interface CreateOrganizationData {
  name: string;
  description: string;
  established_date: string;
  address: string;
  phone: string;
  email: string;
}

export interface RescheduleRequest {
  date: string;
  time: string;
}

export interface FeedbackData {
  professional_id: User;
  user_id: User;
  date: string;
  time: string;
  experience: string;
  suggestion: string;
  image_url?: string;
  rating: number;
}

export interface AssignUserToOrganization {
  userId: number;
  organizationId: number;
}
