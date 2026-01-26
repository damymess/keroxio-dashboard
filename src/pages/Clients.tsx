import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  Eye,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { cn, formatCurrency, formatDate } from '../lib/utils';
import type { Client } from '../lib/api';

const segmentOptions = [
  { value: '', label: 'Tous les segments' },
  { value: 'standard', label: 'Standard' },
  { value: 'premium', label: 'Premium' },
  { value: 'vip', label: 'VIP' },
];

// Mock data
const mockClients: Client[] = [
  { id: '1', type: 'particulier', prenom: 'Jean', nom: 'Dupont', email: 'jean.dupont@email.com', telephone: '06 12 34 56 78', ville: 'Paris', segment: 'premium', nb_achats: 2, lifetime_value: 45000, created_at: '2024-01-15T10:00:00Z' },
  { id: '2', type: 'professionnel', raison_sociale: 'Auto Services SARL', nom: 'Auto Services', email: 'contact@autoservices.fr', telephone: '01 23 45 67 89', ville: 'Lyon', segment: 'vip', nb_achats: 8, lifetime_value: 180000, created_at: '2023-06-20T14:30:00Z' },
  { id: '3', type: 'particulier', prenom: 'Marie', nom: 'Martin', email: 'marie.martin@email.com', telephone: '06 98 76 54 32', ville: 'Marseille', segment: 'standard', nb_achats: 1, lifetime_value: 18500, created_at: '2024-03-10T09:15:00Z' },
  { id: '4', type: 'particulier', prenom: 'Pierre', nom: 'Durand', email: 'pierre.durand@email.com', telephone: '06 55 44 33 22', ville: 'Bordeaux', segment: 'standard', nb_achats: 0, lifetime_value: 0, created_at: '2024-06-01T16:45:00Z' },
];

export function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [segment, setSegment] = useState('');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      let filtered = mockClients;

      if (search) {
        const term = search.toLowerCase();
        filtered = filtered.filter(
          (c) =>
            c.nom.toLowerCase().includes(term) ||
            c.prenom?.toLowerCase().includes(term) ||
            c.email?.toLowerCase().includes(term) ||
            c.raison_sociale?.toLowerCase().includes(term)
        );
      }

      if (segment) {
        filtered = filtered.filter((c) => c.segment === segment);
      }

      setClients(filtered);
      setLoading(false);
    }, 500);
  }, [search, segment]);

  const getSegmentColor = (seg: string) => {
    switch (seg) {
      case 'vip':
        return 'bg-purple-100 text-purple-700';
      case 'premium':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Clients</h1>
          <p className="text-muted-foreground">
            Gérez vos clients et leur historique
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau client
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
                  placeholder="Rechercher par nom, email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded-lg bg-accent border-0 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select
                options={segmentOptions}
                value={segment}
                onChange={(e) => setSegment(e.target.value)}
                placeholder="Segment"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-accent/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Segment
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Achats
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      LTV
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Depuis
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {clients.map((client) => (
                    <tr key={client.id} className="hover:bg-accent/30 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-medium text-primary">
                              {client.type === 'professionnel'
                                ? client.raison_sociale?.[0]
                                : `${client.prenom?.[0]}${client.nom[0]}`}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">
                              {client.type === 'professionnel'
                                ? client.raison_sociale
                                : `${client.prenom} ${client.nom}`}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {client.ville}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          {client.email && (
                            <div className="flex items-center gap-1 text-sm">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              <span className="truncate max-w-[150px]">{client.email}</span>
                            </div>
                          )}
                          {client.telephone && (
                            <div className="flex items-center gap-1 text-sm">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              <span>{client.telephone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Badge className={getSegmentColor(client.segment)}>
                          {client.segment.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-medium">{client.nb_achats}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-medium">
                          {formatCurrency(client.lifetime_value)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">
                        {formatDate(client.created_at)}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/clients/${client.id}`}>
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {clients.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Aucun client trouvé</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
