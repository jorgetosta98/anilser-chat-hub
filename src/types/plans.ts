
export interface Plan {
  id: string;
  name: string;
  price: number;
  whatsappLimit: number | 'unlimited';
  dailyQuestionsLimit: number;
  features: string[];
  isActive: boolean;
}

export interface UserPlan {
  userId: number;
  planId: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'cancelled' | 'expired';
}

export const DEFAULT_PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    whatsappLimit: 1,
    dailyQuestionsLimit: 10,
    features: ['1 conta WhatsApp', '10 perguntas/dia', 'Suporte básico'],
    isActive: true
  },
  {
    id: 'basic',
    name: 'Básico',
    price: 29.99,
    whatsappLimit: 2,
    dailyQuestionsLimit: 100,
    features: ['2 contas WhatsApp', '100 perguntas/dia', 'Suporte prioritário'],
    isActive: true
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 99.99,
    whatsappLimit: 'unlimited',
    dailyQuestionsLimit: 1000,
    features: ['WhatsApp ilimitado', '1.000 perguntas/dia', 'Suporte VIP', 'Analytics avançado'],
    isActive: true
  }
];
