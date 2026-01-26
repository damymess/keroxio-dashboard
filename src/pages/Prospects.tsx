import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Plus,
  Flame,
  Phone,
  Mail,
  Eye,
  UserCheck,
  MoreVertical,
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Select } from '../components/ui/Select';
import {
  cn,
  formatCurrency,
  formatRelativeTime,
  getScoreBgColor,
  getScoreLabel,
  getStatusColor,
  getStatusLabel,
} from '../lib/utils';
import type { Prospect } from '../lib/api';

const statusOptions = [
  { value: '', label: 'Tous les statuts' },
  { value: 'nouveau', label: 'Nouveau' },
  { value: 'contacte', label: 'Contacté' },
  { value: 'qualifie', label: 'Qualifié' },
  { value: 'chaud', label: 'Chaud' },
  { value: 'rendez_vous', label: 'RDV' },
  { value: 'perdu', label: 'Perdu' },
];

const sourceOptions = [
  { value: '', label: 'Toutes les sources' },
  { value: 'leboncoin', label: 'LeBonCoin' },
  { value: 'lacentrale', label: 'La Centrale' },
  { value: 'site', label: 'Site web' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'telephone', label: 'Téléphone' },
];

// Mock data
const mockProspects: Prospect[] = [
  { id: '1', prenom: 'Jean', nom: 'Dupont', email: 'jean.dupont@email.com', telephone: '06 12 34 56 78', source: 'leboncoin', statut: 'qualifie', score: 85, budget_max: 25000, financement: true, reprise: false, date_dernier_contact: '2024-06-10T14:30:00Z', created_at: '2024-06-08T10:00:00Z' },
  { id: '2', prenom: 'Marie', nom: 'Martin', email: 'marie.martin@email.com', telephone: '06 98 76 54 32', source: 'lacentrale', statut: 'chaud', score: 78, budget_max: 35000, financement: false, reprise: true, date_dernier_contact: '2024-06-09T16:45:00Z', created_at: '2024-06-05T09:15:00Z' },
  { id: '3', prenom: 'Pierre', nom: 'Durand', email: 'pierre.durand@email.com', telephone: '06 55 44 33 22', source: 'site', statut: 'rendez_vous', score: 72, budget_max: 18000, financement: true, reprise: false, date_dernier_contact: '2024-06-10T11:00:00Z', created_at: '2024-06-07T14:30:00Z' },
  { id: '4', prenom: 'Sophie', nom: 'Bernard', email: 'sophie.b@email.com', telephone: '06 77 88 99 00', source: 'facebook', statut: 'contacte', score: 45, budget_max: 15000, financement: false, reprise: false, date_dernier_contact: '2024-06-08T10:30:00Z', created_at: '2024-06-06T11:20:00Z' },
  { id: '5', prenom: 'Lucas', nom: 'Petit', email: 'lucas.petit@email.com', telephone: '06 11 22 33 44', source: 'telephone', statut: 'nouveau', score: 35, budget_max: 22000, financement: true, reprise: true, date_dernier_contact: undefined, created_at: '2024-06-10T08:00:00Z' },
];

export function ProspectsPage() {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [source, setSource] = useState('');
  const [showHotOnly, setShowHotOnly] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      let filtered = mockProspects;

      if (search) {
        const term = search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.nom?.toLowerCase().includes(term) ||
            p.prenom?.toLowerCase().includes(term) ||
            p.email?.toLowerCase().includes(term)
        );
      }

      if (status) {
        filtered = filtered.filter((p) => p.statut === status);
      }

      if (source) {
        filtered = filtered.filter((p) => p.source === source);
      }

      if (showHotOnly) {
        filtered = filtered.filter((p) => p.score >= 70);
      }

      // Sort by score descending
      filtered.sort((a, b) => b.score - a.score);

      setProspects(filtered);
      setLoading(false);
    }, 500);
  }, [search, status, source, showHotOnly]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Prospects</h1>
          <p className="text-muted-foreground">
            Gérez vos leads et leur qualification
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={showHotOnly ? 'default' : 'outline'}
            onClick={() => setShowHotOnly(!showHotOnly)}
          >
            <Flame className="h-4 w-4 mr-2" />
            Leads chauds
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau prospect
          </Button>
        </div>
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
                  placeholder="Rechercher par nom, email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded-lg bg-accent border-0 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="w-full sm:w-40">
              <Select
                options={statusOptions}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-40">
              <Select
                options={sourceOptions}
                value={source}
                onChange={(e) => setSource(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prospects List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
        <div className="grid gap-4">
          {prospects.map((prospect) => (
            <Card key={prospect.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Avatar & Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-lg font-medium text-primary">
                          {prospect.prenom?.[0]}{prospect.nom?.[0]}
                        </span>
                      </div>
                      {prospect.score >= 70 && (
                        <Flame className="absolute -top-1 -right-1 h-5 w-5 text-red-500" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium truncate">
                          {prospect.prenom} {prospect.nom}
                        </h3>
                        <Badge className={getStatusColor(prospect.statut)}>
                          {getStatusLabel(prospect.statut)}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        {prospect.email && (
                          <span className="flex items-center gap-1 truncate">
                            <Mail className="h-3 w-3" />
                            {prospect.email}
                          </span>
                        )}
                        {prospect.telephone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {prospect.telephone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Score & Budget */}
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <Badge className={cn('text-lg px-3 py-1', getScoreBgColor(prospect.score))}>
                        {prospect.score}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {getScoreLabel(prospect.score)}
                      </p>
                    </div>

                    <div className="text-center">
                      <p className="font-semibold">
                        {formatCurrency(prospect.budget_max)}
                      </p>
                      <p className="text-xs text-muted-foreground">Budget max</p>
                    </div>

                    <div className="text-center hidden md:block">
                      <p className="text-sm">
                        {formatRelativeTime(prospect.date_dernier_contact)}
                      </p>
                      <p className="text-xs text-muted-foreground">Dernier contact</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" title="Appeler">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Convertir en client">
                        <UserCheck className="h-4 w-4" />
                      </Button>
                      <Link to={`/prospects/${prospect.id}`}>
                        <Button variant="ghost" size="icon" title="Voir détails">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                  <Badge variant="outline">{prospect.source}</Badge>
                  {prospect.financement && (
                    <Badge variant="secondary">Financement</Badge>
                  )}
                  {prospect.reprise && (
                    <Badge variant="secondary">Reprise</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {prospects.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">Aucun prospect trouvé</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
