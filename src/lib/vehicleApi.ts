/**
 * Keroxio Vehicle API Client
 */

const API_BASE = import.meta.env.VITE_API_URL || 'https://api.keroxio.fr';

export interface Vehicle {
  id: string;
  plaque: string;
  marque?: string;
  modele?: string;
  version?: string;
  annee?: number;
  carburant?: string;
  boite?: string;
  kilometrage?: number;
  couleur?: string;
  puissance?: string;
  prix_estime_min?: number;
  prix_estime_moyen?: number;
  prix_estime_max?: number;
  prix_choisi?: number;
  photos_originales: string[];
  photos_traitees: string[];
  background_utilise?: string;
  annonce_titre?: string;
  annonce_description?: string;
  status: string;
  published_platforms: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateVehicleData {
  plaque: string;
  marque?: string;
  modele?: string;
  version?: string;
  annee?: number;
  carburant?: string;
  boite?: string;
  kilometrage?: number;
  couleur?: string;
  puissance?: string;
}

export interface UpdateVehicleData {
  marque?: string;
  modele?: string;
  version?: string;
  annee?: number;
  carburant?: string;
  boite?: string;
  kilometrage?: number;
  couleur?: string;
  puissance?: string;
  prix_estime_min?: number;
  prix_estime_moyen?: number;
  prix_estime_max?: number;
  prix_choisi?: number;
  photos_originales?: string[];
  photos_traitees?: string[];
  background_utilise?: string;
  annonce_titre?: string;
  annonce_description?: string;
  status?: string;
}

function getToken(): string | null {
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

function getHeaders(): HeadersInit {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export const vehicleApi = {
  /**
   * Create a new vehicle
   */
  async create(data: CreateVehicleData): Promise<Vehicle> {
    const res = await fetch(`${API_BASE}/vehicle/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || 'Failed to create vehicle');
    }
    return res.json();
  },

  /**
   * List user's vehicles
   */
  async list(status?: string): Promise<Vehicle[]> {
    const params = status ? `?status=${status}` : '';
    const res = await fetch(`${API_BASE}/vehicle/${params}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to list vehicles');
    return res.json();
  },

  /**
   * Get a vehicle by ID
   */
  async get(id: string): Promise<Vehicle> {
    const res = await fetch(`${API_BASE}/vehicle/${id}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Vehicle not found');
    return res.json();
  },

  /**
   * Update a vehicle
   */
  async update(id: string, data: UpdateVehicleData): Promise<Vehicle> {
    const res = await fetch(`${API_BASE}/vehicle/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || 'Failed to update vehicle');
    }
    return res.json();
  },

  /**
   * Delete a vehicle
   */
  async delete(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/vehicle/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete vehicle');
  },

  /**
   * Mark vehicle as published on a platform
   */
  async markPublished(id: string, platform: string): Promise<void> {
    const res = await fetch(`${API_BASE}/vehicle/${id}/publish?platform=${platform}`, {
      method: 'POST',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to mark as published');
  },
};
