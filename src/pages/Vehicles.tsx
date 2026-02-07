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

const statusConfig: Record<string, { label: string; variant: 'secondary' | 'warning' | 'success' }> = {
  draft: { label: 'Brouillon', variant: 'secondary' },
  ready: { label: 'Prêt', variant: 'warning' },
  published: { label: 'Publié', variant: 'success' },
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
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Mes Véhicules</h1>
          <p className="text-white/40">
            {filteredVehicles.length} véhicule{filteredVehicles.length > 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-2xl glass overflow-hidden">
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
        <CardContent className="p-4 pt-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <input
                  type="text"
                  placeholder="Rechercher par marque, modèle ou plaque..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-2xl glass-input text-sm text-foreground placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-ios-blue/50"
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ios-blue" />
        </div>
      )}

      {/* Empty state */}
      {!loading && filteredVehicles.length === 0 && (
        <Card>
          <CardContent className="p-12 pt-12 text-center">
            <Car className="h-12 w-12 mx-auto text-white/10 mb-4" />
            <p className="text-lg font-medium text-white mb-2">Aucun véhicule</p>
            <p className="text-white/40 mb-4">
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
                  'overflow-hidden cursor-pointer hover:border-white/20 transition-all group',
                  viewMode === 'list' && 'flex'
                )}
                onClick={() => navigate(`/vehicles/${vehicle.id}`)}
              >
                {/* Photo */}
                <div
                  className={cn(
                    'bg-white/3 flex items-center justify-center relative',
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
                    <Car className="h-12 w-12 text-white/10" />
                  )}
                  
                  {/* Photo count */}
                  {hasPhotos && (
                    <div className="absolute bottom-2 right-2 glass text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <ImageIcon className="h-3 w-3" />
                      {vehicle.photos_traitees.length}
                    </div>
                  )}
                </div>

                {/* Info */}
                <CardContent className={cn('p-4 pt-4', viewMode === 'list' && 'flex-1')}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold truncate text-white">
                        {vehicle.marque} {vehicle.modele}
                      </p>
                      <p className="text-sm text-white/40">
                        {vehicle.plaque} {vehicle.annee && `• ${vehicle.annee}`}
                      </p>
                    </div>
                    <Badge variant={status.variant} className="text-xs flex-shrink-0">
                      {status.label}
                    </Badge>
                  </div>

                  {vehicle.prix_choisi && (
                    <p className="text-lg font-bold mt-2 text-ios-blue">
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
                      className="ml-auto h-8 w-8 text-ios-red/60 hover:text-ios-red hover:bg-ios-red/10"
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
