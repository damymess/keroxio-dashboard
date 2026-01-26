import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Download, Eye, FileText, Send, Loader2 } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Select } from '../components/ui/Select';
import { FactureModal } from '../components/FactureModal';
import { Dialog } from '../components/ui/Modal';
import { usePDF, billingApi } from '../hooks/usePDF';
import { cn, formatDate, formatCurrency } from '../lib/utils';

interface Facture {
  id: string;
  numero: string;
  type: 'devis' | 'facture';
  client_id: string;
  client_name: string;
  client_email?: string;
  statut: 'brouillon' | 'envoye' | 'paye' | 'annule';
  montant_ht: number;
  montant_ttc: number;
  date_emission: string;
  date_echeance?: string;
  date_paiement?: string;
  vehicle_name?: string;
  pdf_url?: string;
}

const typeOptions = [
  { value: '', label: 'Tous les types' },
  { value: 'devis', label: 'Devis' },
  { value: 'facture', label: 'Factures' },
];

const statusOptions = [
  { value: '', label: 'Tous les statuts' },
  { value: 'brouillon', label: 'Brouillon' },
  { value: 'envoye', label: 'Envoyé' },
  { value: 'paye', label: 'Payé' },
  { value: 'annule', label: 'Annulé' },
];

// Mock data (sera remplacé par l'API)
const mockFactures: Facture[] = [
  {
    id: '1',
    numero: 'FAC-2024-0042',
    type: 'facture',
    client_id: '1',
    client_name: 'Jean Dupont',
    client_email: 'jean.dupont@email.com',
    statut: 'paye',
    montant_ht: 24166.67,
    montant_ttc: 29000,
    date_emission: '2024-06-01T10:00:00Z',
    date_echeance: '2024-06-30T00:00:00Z',
    date_paiement: '2024-06-15T14:30:00Z',
    vehicle_name: 'Peugeot 3008 GT Line',
  },
  {
    id: '2',
    numero: 'FAC-2024-0041',
    type: 'facture',
    client_id: '2',
    client_name: 'Marie Martin',
    client_email: 'marie.martin@email.com',
    statut: 'envoye',
    montant_ht: 27083.33,
    montant_ttc: 32500,
    date_emission: '2024-06-08T09:00:00Z',
    date_echeance: '2024-07-08T00:00:00Z',
    vehicle_name: 'BMW 320d M Sport',
  },
  {
    id: '3',
    numero: 'DEV-2024-0023',
    type: 'devis',
    client_id: '3',
    client_name: 'Pierre Petit',
    client_email: 'pierre.petit@email.com',
    statut: 'envoye',
    montant_ht: 16583.33,
    montant_ttc: 19900,
    date_emission: '2024-06-10T11:00:00Z',
    vehicle_name: 'Renault Clio RS Line',
  },
  {
    id: '4',
    numero: 'DEV-2024-0022',
    type: 'devis',
    client_id: '4',
    client_name: 'Sophie Bernard',
    client_email: 'sophie.bernard@email.com',
    statut: 'brouillon',
    montant_ht: 22083.33,
    montant_ttc: 26500,
    date_emission: '2024-06-09T16:00:00Z',
    vehicle_name: 'Volkswagen Golf R-Line',
  },
  {
    id: '5',
    numero: 'FAC-2024-0040',
    type: 'facture',
    client_id: '5',
    client_name: 'Luc Durand',
    statut: 'annule',
    montant_ht: 15000,
    montant_ttc: 18000,
    date_emission: '2024-05-25T10:00:00Z',
    vehicle_name: 'Citroën C3',
  },
];

function getStatusColor(status: Facture['statut']) {
  switch (status) {
    case 'brouillon':
      return 'bg-gray-100 text-gray-800';
    case 'envoye':
      return 'bg-blue-100 text-blue-800';
    case 'paye':
      return 'bg-green-100 text-green-800';
    case 'annule':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function getStatusLabel(status: Facture['statut']) {
  switch (status) {
    case 'brouillon':
      return 'Brouillon';
    case 'envoye':
      return 'Envoyé';
    case 'paye':
      return 'Payé';
    case 'annule':
      return 'Annulé';
    default:
      return status;
  }
}

export function FacturesPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [factures, setFactures] = useState<Facture[]>(mockFactures);

  // Modal state
  const [selectedFacture, setSelectedFacture] = useState<Facture | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Convert dialog state
  const [convertDialogOpen, setConvertDialogOpen] = useState(false);
  const [factureToConvert, setFactureToConvert] = useState<Facture | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  // Download state
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // PDF hook
  const { pdfUrl, fetchPDF, downloadPDF, clearPDF, isLoading: pdfLoading } = usePDF({
    onError: () => {
      // Error tracked via PostHog
    },
  });

  const filteredFactures = factures.filter((facture) => {
    if (search) {
      const term = search.toLowerCase();
      if (
        !facture.numero.toLowerCase().includes(term) &&
        !facture.client_name.toLowerCase().includes(term)
      ) {
        return false;
      }
    }
    if (typeFilter && facture.type !== typeFilter) return false;
    if (statusFilter && facture.statut !== statusFilter) return false;
    return true;
  });

  const stats = {
    totalDevis: factures.filter((f) => f.type === 'devis').length,
    totalFactures: factures.filter((f) => f.type === 'facture').length,
    enAttente: factures.filter((f) => f.statut === 'envoye' && f.type === 'facture').reduce((sum, f) => sum + f.montant_ttc, 0),
    paye: factures.filter((f) => f.statut === 'paye').reduce((sum, f) => sum + f.montant_ttc, 0),
  };

  // Handle view PDF
  const handleViewPDF = useCallback(async (facture: Facture) => {
    setSelectedFacture(facture);
    setIsModalOpen(true);
    await fetchPDF(facture.type, facture.id);
  }, [fetchPDF]);

  // Handle download PDF
  const handleDownloadPDF = useCallback(async (facture: Facture) => {
    setDownloadingId(facture.id);
    try {
      await downloadPDF(facture.type, facture.id, `${facture.numero}.pdf`);
    } finally {
      setDownloadingId(null);
    }
  }, [downloadPDF]);

  // Handle send PDF
  const handleSendPDF = useCallback(async (facture: Facture) => {
    try {
      if (facture.type === 'facture') {
        await billingApi.sendFactureByEmail(facture.id, facture.client_email || '');
      } else {
        await billingApi.sendDevisByEmail(facture.id, facture.client_email || '');
      }
      // Update status to 'envoye'
      setFactures((prev) =>
        prev.map((f) =>
          f.id === facture.id ? { ...f, statut: 'envoye' as const } : f
        )
      );
    } catch (error) {
      // Error tracked via PostHog
    }
  }, []);

  // Handle convert devis to facture
  const handleConvertToFacture = useCallback(async () => {
    if (!factureToConvert) return;

    setIsConverting(true);
    try {
      await billingApi.convertDevisToFacture(factureToConvert.id);
      // Remove from list or update
      setFactures((prev) => prev.filter((f) => f.id !== factureToConvert.id));
      setConvertDialogOpen(false);
      setFactureToConvert(null);
    } catch (error) {
      // Error tracked via PostHog
    } finally {
      setIsConverting(false);
    }
  }, [factureToConvert]);

  // Close modal and cleanup
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedFacture(null);
    clearPDF();
  }, [clearPDF]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Devis & Factures</h1>
          <p className="text-muted-foreground">
            {stats.totalDevis} devis • {stats.totalFactures} factures
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau devis
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle facture
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Devis en cours</p>
            <p className="text-2xl font-bold">{stats.totalDevis}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Factures émises</p>
            <p className="text-2xl font-bold">{stats.totalFactures}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">En attente</p>
            <p className="text-2xl font-bold text-orange-500">{formatCurrency(stats.enAttente)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Encaissé</p>
            <p className="text-2xl font-bold text-green-500">{formatCurrency(stats.paye)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Rechercher par numéro ou client..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded-lg bg-accent border-0 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="w-full sm:w-40">
              <Select
                options={typeOptions}
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-40">
              <Select
                options={statusOptions}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-accent/50">
                  <th className="text-left p-4 font-medium text-sm">Numéro</th>
                  <th className="text-left p-4 font-medium text-sm">Client</th>
                  <th className="text-left p-4 font-medium text-sm">Véhicule</th>
                  <th className="text-left p-4 font-medium text-sm">Montant TTC</th>
                  <th className="text-left p-4 font-medium text-sm">Date</th>
                  <th className="text-left p-4 font-medium text-sm">Statut</th>
                  <th className="text-right p-4 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFactures.map((facture) => (
                  <tr key={facture.id} className="border-b hover:bg-accent/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <FileText className={cn(
                          'h-4 w-4',
                          facture.type === 'devis' ? 'text-blue-500' : 'text-green-500'
                        )} />
                        <span className="font-mono text-sm">{facture.numero}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-medium">{facture.client_name}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-muted-foreground">
                        {facture.vehicle_name || '-'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold">{formatCurrency(facture.montant_ttc)}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm">{formatDate(facture.date_emission)}</span>
                    </td>
                    <td className="p-4">
                      <Badge className={getStatusColor(facture.statut)}>
                        {getStatusLabel(facture.statut)}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Voir le PDF"
                          onClick={() => handleViewPDF(facture)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Télécharger PDF"
                          onClick={() => handleDownloadPDF(facture)}
                          disabled={downloadingId === facture.id}
                        >
                          {downloadingId === facture.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                        </Button>
                        {facture.statut === 'brouillon' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Envoyer par email"
                            onClick={() => handleSendPDF(facture)}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        )}
                        {facture.type === 'devis' && facture.statut === 'envoye' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="ml-2"
                            onClick={() => {
                              setFactureToConvert(facture);
                              setConvertDialogOpen(true);
                            }}
                          >
                            Convertir en facture
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredFactures.length === 0 && (
              <div className="p-12 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Aucun document trouvé</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* PDF Modal */}
      <FactureModal
        facture={selectedFacture}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onDownload={handleDownloadPDF}
        onSend={handleSendPDF}
        pdfUrl={pdfUrl || undefined}
      />

      {/* Convert Dialog */}
      <Dialog
        isOpen={convertDialogOpen}
        onClose={() => {
          setConvertDialogOpen(false);
          setFactureToConvert(null);
        }}
        onConfirm={handleConvertToFacture}
        title="Convertir en facture"
        description={`Êtes-vous sûr de vouloir convertir le devis ${factureToConvert?.numero} en facture ? Cette action est irréversible.`}
        confirmText="Convertir"
        loading={isConverting}
      />
    </div>
  );
}
