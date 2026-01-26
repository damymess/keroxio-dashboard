import { useState, useCallback } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3008';

interface UsePDFOptions {
  onError?: (error: Error) => void;
}

interface UsePDFReturn {
  pdfUrl: string | null;
  isLoading: boolean;
  error: Error | null;
  fetchPDF: (type: 'facture' | 'devis', id: string) => Promise<string | null>;
  downloadPDF: (type: 'facture' | 'devis', id: string, filename?: string) => Promise<void>;
  clearPDF: () => void;
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

export function usePDF(options: UsePDFOptions = {}): UsePDFReturn {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPDF = useCallback(async (type: 'facture' | 'devis', id: string): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const endpoint = type === 'facture'
        ? `/billing/factures/${id}/pdf`
        : `/billing/devis/${id}/pdf`;

      const token = getToken();
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur lors du chargement du PDF: ${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      return url;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erreur inconnue');
      setError(error);
      options.onError?.(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  const downloadPDF = useCallback(async (
    type: 'facture' | 'devis',
    id: string,
    filename?: string
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const endpoint = type === 'facture'
        ? `/billing/factures/${id}/pdf`
        : `/billing/devis/${id}/pdf`;

      const token = getToken();
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur lors du téléchargement du PDF: ${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `${type}-${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      URL.revokeObjectURL(url);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erreur inconnue');
      setError(error);
      options.onError?.(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  const clearPDF = useCallback(() => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }
    setPdfUrl(null);
    setError(null);
  }, [pdfUrl]);

  return {
    pdfUrl,
    isLoading,
    error,
    fetchPDF,
    downloadPDF,
    clearPDF,
  };
}

// Billing API helper functions
export const billingApi = {
  // Get PDF URL for a facture
  getFacturePDFUrl: (id: string): string => {
    return `${API_BASE_URL}/billing/factures/${id}/pdf`;
  },

  // Get PDF URL for a devis
  getDevisPDFUrl: (id: string): string => {
    return `${API_BASE_URL}/billing/devis/${id}/pdf`;
  },

  // Fetch factures list
  getFactures: async (params?: { page?: number; page_size?: number; type?: string; statut?: string }) => {
    const token = getToken();
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(`${API_BASE_URL}/billing/factures?${queryParams}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur: ${response.status}`);
    }

    return response.json();
  },

  // Fetch single facture
  getFacture: async (id: string) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/billing/factures/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur: ${response.status}`);
    }

    return response.json();
  },

  // Send facture by email
  sendFactureByEmail: async (id: string, email: string) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/billing/factures/${id}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error(`Erreur: ${response.status}`);
    }

    return response.json();
  },

  // Fetch devis list
  getDevis: async (params?: { page?: number; page_size?: number; statut?: string }) => {
    const token = getToken();
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(`${API_BASE_URL}/billing/devis?${queryParams}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur: ${response.status}`);
    }

    return response.json();
  },

  // Send devis by email
  sendDevisByEmail: async (id: string, email: string) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/billing/devis/${id}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error(`Erreur: ${response.status}`);
    }

    return response.json();
  },

  // Convert devis to facture
  convertDevisToFacture: async (id: string) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/billing/devis/${id}/convert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur: ${response.status}`);
    }

    return response.json();
  },
};
