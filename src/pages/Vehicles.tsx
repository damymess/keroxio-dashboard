import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Grid, List, Car, Image as ImageIcon, Trash2, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Select } from '../components/ui/Select';
import { cn } from '../lib/utils';
import { vehicleApi, type Vehicle } from '../lib/vehicleApi';

const statusOptions = [
  { value: '', label: 'Tous les statuts' },
  { value: 'draft', label: 'Brouillon' },
  { value: 'ready', label: 'Prêt' },
  { value: 'published', label: 'Publié' },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  draft: { label: 'Brouillon', color: 'bg-gray-100 text-gray-800' },
  ready: { label: 'Prêt', color: 'bg-amber-100 text-amber-800' },
  published: { label: 'Publié', color: 'bg-green-100 text-green-800' },
};

export function VehiclesPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  // Load vehicles from API
  useEffect(() => {
    loadVehicles();
  }, [statusFilter]);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const data = await vehicleApi.list(statusFilter || undefined);
      setVehicles(data);
    } catch (err) {
      console.error('Failed to load vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce véhicule ?')) return;
    try {
      await vehicleApi.delete(id);
      setVehicles(vehicles.filter(v => v.id !== id));
    } catch (err) {
      console.error('Failed to delete vehicle:', err);
    }
  };

  const filteredVehicles = vehicles.filter((v) => {
    if (search) {
      const term = search.toLowerCase();
      if (
        !v.marque?.toLowerCase().includes(term) &&
        !v.modele?.toLowerCase().includes(term) &&
        !v.plaque?.toLowerCase().includes(term)
      ) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Mes Véhicules</h1>
          <p className="text-muted-foreground">
            {filteredVehicles.length} véhicule{filteredVehicles.length > 1 ? 's' : ''}
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
          <Button onClick={() => navigate('/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau véhicule
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
                  placeholder="Rechercher par marque, modèle ou plaque..."
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

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      )}

      {/* Empty state */}
      {!loading && filteredVehicles.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">Aucun véhicule</p>
            <p className="text-muted-foreground mb-4">
              Commencez par ajouter votre premier véhicule
            </p>
            <Button onClick={() => navigate('/new')}>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau véhicule
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Vehicles Grid */}
      {!loading && filteredVehicles.length > 0 && (
        <div
          className={cn(
            'grid gap-4',
            viewMode === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1'
          )}
        >
          {filteredVehicles.map((vehicle) => {
            const status = statusConfig[vehicle.status] || statusConfig.draft;
            const hasPhotos = vehicle.photos_traitees && vehicle.photos_traitees.length > 0;
            
            return (
              <Card
                key={vehicle.id}
                className={cn(
                  'overflow-hidden cursor-pointer hover:shadow-lg transition-shadow',
                  viewMode === 'list' && 'flex'
                )}
                onClick={() => navigate(`/vehicles/${vehicle.id}`)}
              >
                {/* Photo */}
                <div
                  className={cn(
                    'bg-accent flex items-center justify-center relative',
                    viewMode === 'grid' ? 'aspect-video' : 'w-40 h-28 flex-shrink-0'
                  )}
                >
                  {hasPhotos ? (
                    <img
                      src={vehicle.photos_traitees[0]}
                      alt={`${vehicle.marque} ${vehicle.modele}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Car className="h-12 w-12 text-muted-foreground" />
                  )}
                  
                  {/* Photo count */}
                  {hasPhotos && (
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <ImageIcon className="h-3 w-3" />
                      {vehicle.photos_traitees.length}
                    </div>
                  )}
                </div>

                {/* Info */}
                <CardContent className={cn('p-4', viewMode === 'list' && 'flex-1')}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold truncate">
                        {vehicle.marque} {vehicle.modele}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {vehicle.plaque} {vehicle.annee && `• ${vehicle.annee}`}
                      </p>
                    </div>
                    <Badge className={cn('text-xs flex-shrink-0', status.color)}>
                      {status.label}
                    </Badge>
                  </div>

                  {vehicle.prix_choisi && (
                    <p className="text-lg font-bold mt-2 text-primary">
                      {vehicle.prix_choisi.toLocaleString('fr-FR')} €
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 mt-3">
                    {vehicle.published_platforms && vehicle.published_platforms.length > 0 && (
                      <div className="flex gap-1">
                        {vehicle.published_platforms.map(p => (
                          <Badge key={p} variant="outline" className="text-xs">
                            {p}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-auto h-8 w-8 text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(vehicle.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
