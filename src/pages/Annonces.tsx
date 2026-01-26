import { useState } from 'react';
import { Search, Plus, Edit, Copy, ExternalLink, Trash2, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Select } from '../components/ui/Select';
import { cn, formatDate, formatCurrency } from '../lib/utils';

interface Annonce {
  id: string;
  vehicle_id: string;
  vehicle_name: string;
  titre: string;
  contenu: string;
  statut: 'brouillon' | 'publie' | 'archive';
  plateformes: string[];
  prix: number;
  vues: number;
  leads: number;
  created_at: string;
  updated_at: string;
}

const statusOptions = [
  { value: '', label: 'Tous les statuts' },
  { value: 'brouillon', label: 'Brouillon' },
  { value: 'publie', label: 'Publié' },
  { value: 'archive', label: 'Archivé' },
];

// Mock data
const mockAnnonces: Annonce[] = [
  {
    id: '1',
    vehicle_id: '1',
    vehicle_name: 'Peugeot 3008 GT Line',
    titre: 'Peugeot 3008 GT Line 1.5 BlueHDi 130ch - Garantie 12 mois',
    contenu: 'Superbe Peugeot 3008 GT Line en excellent état...',
    statut: 'publie',
    plateformes: ['leboncoin', 'lacentrale'],
    prix: 28900,
    vues: 245,
    leads: 8,
    created_at: '2024-06-05T10:00:00Z',
    updated_at: '2024-06-08T14:30:00Z',
  },
  {
    id: '2',
    vehicle_id: '2',
    vehicle_name: 'BMW 320d M Sport',
    titre: 'BMW Série 3 320d M Sport xDrive - Full Options',
    contenu: 'Magnifique BMW 320d pack M Sport...',
    statut: 'publie',
    plateformes: ['leboncoin', 'lacentrale', 'autoscout24'],
    prix: 32500,
    vues: 512,
    leads: 15,
    created_at: '2024-06-01T09:00:00Z',
    updated_at: '2024-06-09T11:00:00Z',
  },
  {
    id: '3',
    vehicle_id: '3',
    vehicle_name: 'Renault Clio RS Line',
    titre: 'Renault Clio V RS Line TCe 100 - Faible kilométrage',
    contenu: 'Renault Clio dernière génération...',
    statut: 'brouillon',
    plateformes: [],
    prix: 19900,
    vues: 0,
    leads: 0,
    created_at: '2024-06-10T08:00:00Z',
    updated_at: '2024-06-10T08:00:00Z',
  },
  {
    id: '4',
    vehicle_id: '5',
    vehicle_name: 'Audi A4 S-Line',
    titre: 'Audi A4 2.0 TDI 150ch S-Line S tronic',
    contenu: 'Audi A4 finition S-Line avec boîte automatique...',
    statut: 'archive',
    plateformes: ['leboncoin'],
    prix: 26500,
    vues: 380,
    leads: 12,
    created_at: '2024-05-15T10:00:00Z',
    updated_at: '2024-06-01T09:00:00Z',
  },
];

function getStatusColor(status: Annonce['statut']) {
  switch (status) {
    case 'brouillon':
      return 'bg-yellow-100 text-yellow-800';
    case 'publie':
      return 'bg-green-100 text-green-800';
    case 'archive':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function getStatusLabel(status: Annonce['statut']) {
  switch (status) {
    case 'brouillon':
      return 'Brouillon';
    case 'publie':
      return 'Publié';
    case 'archive':
      return 'Archivé';
    default:
      return status;
  }
}

function getPlatformLabel(platform: string) {
  const labels: Record<string, string> = {
    leboncoin: 'LeBonCoin',
    lacentrale: 'La Centrale',
    autoscout24: 'AutoScout24',
    paruvendu: 'ParuVendu',
  };
  return labels[platform] || platform;
}

export function AnnoncesPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedAnnonce, setSelectedAnnonce] = useState<Annonce | null>(null);

  const filteredAnnonces = mockAnnonces.filter((annonce) => {
    if (search) {
      const term = search.toLowerCase();
      if (
        !annonce.titre.toLowerCase().includes(term) &&
        !annonce.vehicle_name.toLowerCase().includes(term)
      ) {
        return false;
      }
    }
    if (statusFilter && annonce.statut !== statusFilter) return false;
    return true;
  });

  const stats = {
    total: mockAnnonces.length,
    published: mockAnnonces.filter((a) => a.statut === 'publie').length,
    totalViews: mockAnnonces.reduce((sum, a) => sum + a.vues, 0),
    totalLeads: mockAnnonces.reduce((sum, a) => sum + a.leads, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Annonces</h1>
          <p className="text-muted-foreground">
            {stats.total} annonces • {stats.published} publiées • {stats.totalViews} vues • {stats.totalLeads} leads
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle annonce
        </Button>
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
                  placeholder="Rechercher par titre ou véhicule..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded-lg bg-accent border-0 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select
                options={statusOptions}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Annonces List */}
      <div className="space-y-4">
        {filteredAnnonces.map((annonce) => (
          <Card key={annonce.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                {/* Image placeholder */}
                <div className="w-32 h-24 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold line-clamp-1">{annonce.titre}</h3>
                      <p className="text-sm text-muted-foreground">{annonce.vehicle_name}</p>
                    </div>
                    <Badge className={getStatusColor(annonce.statut)}>
                      {getStatusLabel(annonce.statut)}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {annonce.contenu}
                  </p>

                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-lg font-bold text-primary">
                      {formatCurrency(annonce.prix)}
                    </span>

                    {annonce.plateformes.length > 0 && (
                      <div className="flex gap-1">
                        {annonce.plateformes.map((p) => (
                          <Badge key={p} variant="outline" className="text-xs">
                            {getPlatformLabel(p)}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-4 ml-auto text-sm text-muted-foreground">
                      <span>{annonce.vues} vues</span>
                      <span>{annonce.leads} leads</span>
                      <span>Modifié {formatDate(annonce.updated_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="icon" title="Modifier">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" title="Copier">
                    <Copy className="h-4 w-4" />
                  </Button>
                  {annonce.statut === 'publie' && (
                    <Button variant="outline" size="icon" title="Voir">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredAnnonces.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucune annonce trouvée</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
