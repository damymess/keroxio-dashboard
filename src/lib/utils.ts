import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | undefined | null): string {
  if (amount === undefined || amount === null) return '-';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number | undefined | null): string {
  if (num === undefined || num === null) return '-';
  return new Intl.NumberFormat('fr-FR').format(num);
}

export function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return '-';
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateString));
}

export function formatDateTime(dateString: string | undefined | null): string {
  if (!dateString) return '-';
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
}

export function formatRelativeTime(dateString: string | undefined | null): string {
  if (!dateString) return '-';

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "À l'instant";
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays < 7) return `Il y a ${diffDays}j`;

  return formatDate(dateString);
}

export function getScoreColor(score: number): string {
  if (score >= 70) return 'text-red-500';
  if (score >= 40) return 'text-orange-500';
  return 'text-blue-500';
}

export function getScoreBgColor(score: number): string {
  if (score >= 70) return 'bg-red-100 text-red-700';
  if (score >= 40) return 'bg-orange-100 text-orange-700';
  return 'bg-blue-100 text-blue-700';
}

export function getScoreLabel(score: number): string {
  if (score >= 70) return 'Chaud';
  if (score >= 40) return 'Tiède';
  return 'Froid';
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    // Prospect statuses
    nouveau: 'bg-blue-100 text-blue-700',
    contacte: 'bg-cyan-100 text-cyan-700',
    qualifie: 'bg-green-100 text-green-700',
    chaud: 'bg-red-100 text-red-700',
    rendez_vous: 'bg-purple-100 text-purple-700',
    converti: 'bg-emerald-100 text-emerald-700',
    perdu: 'bg-gray-100 text-gray-700',
    inactif: 'bg-gray-100 text-gray-500',

    // Vehicle statuses
    en_arrivage: 'bg-yellow-100 text-yellow-700',
    en_preparation: 'bg-orange-100 text-orange-700',
    disponible: 'bg-green-100 text-green-700',
    reserve: 'bg-purple-100 text-purple-700',
    vendu: 'bg-blue-100 text-blue-700',
    livre: 'bg-gray-100 text-gray-700',

    // Task statuses
    a_faire: 'bg-yellow-100 text-yellow-700',
    en_cours: 'bg-blue-100 text-blue-700',
    terminee: 'bg-green-100 text-green-700',
    annulee: 'bg-gray-100 text-gray-500',

    // Deal stages
    nouveau_lead: 'bg-blue-100 text-blue-700',
    contact_initial: 'bg-cyan-100 text-cyan-700',
    qualification: 'bg-teal-100 text-teal-700',
    visite: 'bg-green-100 text-green-700',
    offre: 'bg-lime-100 text-lime-700',
    negociation: 'bg-yellow-100 text-yellow-700',
    closing: 'bg-orange-100 text-orange-700',
    gagne: 'bg-emerald-100 text-emerald-700',
    // perdu is already defined above
  };

  return colors[status] || 'bg-gray-100 text-gray-700';
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    // Prospect statuses
    nouveau: 'Nouveau',
    contacte: 'Contacté',
    qualifie: 'Qualifié',
    chaud: 'Chaud',
    rendez_vous: 'RDV',
    converti: 'Converti',
    perdu: 'Perdu',
    inactif: 'Inactif',

    // Vehicle statuses
    en_arrivage: 'En arrivage',
    en_preparation: 'Préparation',
    disponible: 'Disponible',
    reserve: 'Réservé',
    vendu: 'Vendu',
    livre: 'Livré',

    // Task statuses
    a_faire: 'À faire',
    en_cours: 'En cours',
    terminee: 'Terminée',
    annulee: 'Annulée',

    // Deal stages
    nouveau_lead: 'Nouveau',
    contact_initial: 'Contact',
    qualification: 'Qualification',
    visite: 'Visite',
    offre: 'Offre',
    negociation: 'Négociation',
    closing: 'Closing',
    gagne: 'Gagné',
  };

  return labels[status] || status;
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    basse: 'bg-gray-100 text-gray-600',
    normale: 'bg-blue-100 text-blue-700',
    haute: 'bg-orange-100 text-orange-700',
    urgente: 'bg-red-100 text-red-700',
  };

  return colors[priority] || 'bg-gray-100 text-gray-600';
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}
