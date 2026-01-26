import { useState } from 'react';
import { Search, Plus, Grid, List, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Select } from '../components/ui/Select';
import { cn, formatCurrency, getStatusColor, getStatusLabel } from '../lib/utils';

const statusOptions = [
  { value: '', label: 'Tous les statuts' },
  { value: 'disponible', label: 'Disponible' },
  { value: 'reserve', label: 'Réservé' },
  { value: 'en_preparation', label: 'En préparation' },
  { value: 'vendu', label: 'Vendu' },
];

// Mock data
const mockVehicles = [
  { id: '1', immatriculation: 'AB-123-CD', marque: 'Peugeot', modele: '3008', version: 'GT Line', annee: 2022, kilometrage: 45000, carburant: 'diesel', prix_affiche: 28900, statut: 'disponible', photo_principale: null, jours_en_stock: 35, nb_vues: 45, nb_leads: 3 },
  { id: '2', immatriculation: 'EF-456-GH', marque: 'BMW', modele: '320d', version: 'M Sport', annee: 2021, kilometrage: 62000, carburant: 'diesel', prix_affiche: 32500, statut: 'reserve', photo_principale: null, jours_en_stock: 28, nb_vues: 128, nb_leads: 8 },
  { id: '3', immatriculation: 'IJ-789-KL', marque: 'Renault', modele: 'Clio', version: 'RS Line', annee: 2023, kilometrage: 18000, carburant: 'essence', prix_affiche: 19900, statut: 'disponible', photo_principale: null, jours_en_stock: 75, nb_vues: 23, nb_leads: 1 },
  { id: '4', immatriculation: 'MN-012-OP', marque: 'Volkswagen', modele: 'Golf', version: 'R-Line', annee: 2022, kilometrage: 35000, carburant: 'essence', prix_affiche: 26500, statut: 'en_preparation', photo_principale: null, jours_en_stock: 12, nb_vues: 0, nb_leads: 0 },
];

export function VehiclesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const filteredVehicles = mockVehicles.filter((v) => {
    if (search) {
      const term = search.toLowerCase();
      if (
        !v.marque.toLowerCase().includes(term) &&
        !v.modele.toLowerCase().includes(term) &&
        !v.immatriculation?.toLowerCase().includes(term)
      ) {
        return false;
      }
    }
    if (status && v.statut !== status) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Stock Véhicules</h1>
          <p className="text-muted-foreground">
            {filteredVehicles.length} véhicules en stock
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-lg border border-border overflow-hidden">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className="rounded-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
              className="rounded-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter véhicule
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
                  placeholder="Rechercher par marque, modèle, immatriculation..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded-lg bg-accent border-0 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select
                options={statusOptions}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicles Grid */}
      <div
        className={cn(
          'grid gap-4',
          viewMode === 'grid'
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid-cols-1'
        )}
      >
        {filteredVehicles.map((vehicle) => (
          <Card
            key={vehicle.id}
            className={cn(
              'overflow-hidden hover:shadow-md transition-shadow cursor-pointer',
              viewMode === 'list' && 'flex'
            )}
          >
            {/* Image placeholder */}
            <div
              className={cn(
                'bg-accent flex items-center justify-center text-muted-foreground',
                viewMode === 'grid' ? 'h-40' : 'w-48 h-32 flex-shrink-0'
              )}
            >
              <span className="text-4xl">🚗</span>
            </div>

            <CardContent className={cn('p-4', viewMode === 'list' && 'flex-1')}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold">
                    {vehicle.marque} {vehicle.modele}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {vehicle.version} • {vehicle.annee}
                  </p>
                </div>
                <Badge className={getStatusColor(vehicle.statut)}>
                  {getStatusLabel(vehicle.statut)}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <span>{vehicle.kilometrage?.toLocaleString()} km</span>
                <span className="capitalize">{vehicle.carburant}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">
                  {formatCurrency(vehicle.prix_affiche)}
                </span>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{vehicle.nb_vues} vues</span>
                  <span>•</span>
                  <span>{vehicle.nb_leads} leads</span>
                </div>
              </div>

              {vehicle.jours_en_stock > 60 && (
                <div className="flex items-center gap-1 mt-2 text-xs text-orange-500">
                  <AlertTriangle className="h-3 w-3" />
                  <span>{vehicle.jours_en_stock} jours en stock</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Aucun véhicule trouvé</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
