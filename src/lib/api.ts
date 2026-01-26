const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3008';

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    const authData = localStorage.getItem('keroxio-auth');
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        return parsed.state?.token || null;
      } catch {
        return null;
      }
    }
    return null;
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  async fetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { params, ...fetchOptions } = options;
    const url = this.buildUrl(endpoint, params);

    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Une erreur est survenue' }));
      throw new Error(error.detail || `HTTP error ${response.status}`);
    }

    return response.json();
  }

  // GET request
  get<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    return this.fetch<T>(endpoint, { method: 'GET', params });
  }

  // POST request
  post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.fetch<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.fetch<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  delete<T>(endpoint: string): Promise<T> {
    return this.fetch<T>(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiClient(API_BASE_URL);

// Type definitions
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface Client {
  id: string;
  type: 'particulier' | 'professionnel';
  civilite?: string;
  prenom?: string;
  nom: string;
  raison_sociale?: string;
  email?: string;
  telephone?: string;
  telephone_mobile?: string;
  adresse?: string;
  code_postal?: string;
  ville?: string;
  segment: 'standard' | 'premium' | 'vip';
  source?: string;
  nb_achats: number;
  lifetime_value: number;
  created_at: string;
}

export interface Prospect {
  id: string;
  prenom?: string;
  nom?: string;
  email?: string;
  telephone?: string;
  source?: string;
  statut: string;
  score: number;
  budget_min?: number;
  budget_max?: number;
  financement: boolean;
  reprise: boolean;
  date_dernier_contact?: string;
  created_at: string;
}

export interface Deal {
  id: string;
  reference: string;
  stage: string;
  montant?: number;
  probabilite: number;
  client_id?: string;
  prospect_id?: string;
  vehicle_id?: string;
  next_step?: string;
  date_closing_prevue?: string;
  created_at: string;
}

export interface Vehicle {
  id: string;
  immatriculation?: string;
  marque: string;
  modele: string;
  version?: string;
  annee?: number;
  kilometrage?: number;
  carburant?: string;
  prix_affiche?: number;
  statut: string;
  photo_principale?: string;
  jours_en_stock?: number;
  nb_vues: number;
  nb_leads: number;
}

export interface Task {
  id: string;
  titre: string;
  description?: string;
  type: string;
  priorite: string;
  statut: string;
  date_echeance?: string;
  client_id?: string;
  prospect_id?: string;
  deal_id?: string;
}

export interface DashboardKPIs {
  period_days: number;
  leads: {
    total: number;
    trend: number;
    hot: number;
  };
  clients: {
    new: number;
  };
  deals: {
    active: number;
    won: number;
  };
  revenue: {
    total: number;
    trend: number;
  };
  tasks: {
    today: number;
    overdue: number;
  };
}

// Pipeline types
export interface PipelineColumnData {
  stage: string;
  stage_label: string;
  deals: Deal[];
  count: number;
  total_value: number;
  weighted_value: number;
}

export interface PipelineData {
  columns: PipelineColumnData[];
  total_deals: number;
  total_value: number;
  total_weighted: number;
}

export interface DealStageUpdate {
  stage: string;
  notes?: string;
}

// API functions
export const crmApi = {
  // Dashboard
  getDashboardKPIs: (days = 30) =>
    api.get<DashboardKPIs>('/crm/analytics/dashboard', { days }),

  // Clients
  getClients: (params?: { page?: number; page_size?: number; search?: string; segment?: string }) =>
    api.get<PaginatedResponse<Client>>('/crm/clients', params),

  getClient: (id: string) =>
    api.get<Client>(`/crm/clients/${id}`),

  createClient: (data: Partial<Client>) =>
    api.post<Client>('/crm/clients', data),

  updateClient: (id: string, data: Partial<Client>) =>
    api.put<Client>(`/crm/clients/${id}`, data),

  deleteClient: (id: string) =>
    api.delete(`/crm/clients/${id}`),

  // Prospects
  getProspects: (params?: { page?: number; page_size?: number; search?: string; statut?: string; is_hot?: boolean }) =>
    api.get<PaginatedResponse<Prospect>>('/crm/prospects', params),

  getProspect: (id: string) =>
    api.get<Prospect>(`/crm/prospects/${id}`),

  getHotProspects: (limit = 10) =>
    api.get<Prospect[]>('/crm/prospects/hot', { limit }),

  createProspect: (data: Partial<Prospect>) =>
    api.post<Prospect>('/crm/prospects', data),

  updateProspect: (id: string, data: Partial<Prospect>) =>
    api.put<Prospect>(`/crm/prospects/${id}`, data),

  convertProspect: (id: string, data: { client_type?: string; segment?: string }) =>
    api.post<Client>(`/crm/prospects/${id}/convert`, data),

  // Deals
  getDeals: (params?: { page?: number; page_size?: number; stage?: string }) =>
    api.get<PaginatedResponse<Deal>>('/crm/deals', params),

  getDeal: (id: string) =>
    api.get<Deal>(`/crm/deals/${id}`),

  createDeal: (data: Partial<Deal>) =>
    api.post<Deal>('/crm/deals', data),

  updateDeal: (id: string, data: Partial<Deal>) =>
    api.put<Deal>(`/crm/deals/${id}`, data),

  updateDealStage: (id: string, data: DealStageUpdate) =>
    api.put<Deal>(`/crm/deals/${id}/stage`, data),

  deleteDeal: (id: string) =>
    api.delete(`/crm/deals/${id}`),

  // Pipeline
  getPipeline: (includeClosed = false) =>
    api.get<PipelineData>('/crm/deals/pipeline', { include_closed: includeClosed }),

  getDealStats: () =>
    api.get('/crm/deals/stats'),

  // Vehicles
  getVehicles: (params?: { page?: number; page_size?: number; search?: string; statut?: string }) =>
    api.get<PaginatedResponse<Vehicle>>('/crm/vehicles', params),

  // Tasks
  getTasks: (params?: { statut?: string; assigned_to?: string }) =>
    api.get<Task[]>('/crm/tasks', params),

  getTodayTasks: () =>
    api.get<Task[]>('/crm/tasks/today'),

  getOverdueTasks: () =>
    api.get<Task[]>('/crm/tasks/overdue'),

  completeTask: (id: string) =>
    api.put(`/crm/tasks/${id}/complete`),

  // Analytics
  getLeadsAnalytics: (days = 30) =>
    api.get('/crm/analytics/leads', { days }),

  getSalesAnalytics: (days = 30) =>
    api.get('/crm/analytics/sales', { days }),
};
