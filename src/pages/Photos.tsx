import { useState } from 'react';
import { Search, Upload, Grid, List, Download, Trash2, Eye, Image as ImageIcon, Sparkles } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Select } from '../components/ui/Select';
import { cn, formatDate } from '../lib/utils';
import { ImageProcessor } from '../components/ImageProcessor';

interface Photo {
  id: string;
  filename: string;
  vehicle_id?: string;
  vehicle_name?: string;
  status: 'original' | 'processing' | 'transformed' | 'failed';
  original_url: string;
  transformed_url?: string;
  background_type?: string;
  created_at: string;
  file_size: number;
}

const statusOptions = [
  { value: '', label: 'Tous les statuts' },
  { value: 'original', label: 'Original' },
  { value: 'processing', label: 'En cours' },
  { value: 'transformed', label: 'Transformée' },
  { value: 'failed', label: 'Échec' },
];

// Mock data
const mockPhotos: Photo[] = [
  { id: '1', filename: 'peugeot-3008-front.jpg', vehicle_id: '1', vehicle_name: 'Peugeot 3008 GT Line', status: 'transformed', original_url: '/photos/original/1.jpg', transformed_url: '/photos/transformed/1.jpg', background_type: 'showroom_modern', created_at: '2024-06-10T10:30:00Z', file_size: 2450000 },
  { id: '2', filename: 'peugeot-3008-rear.jpg', vehicle_id: '1', vehicle_name: 'Peugeot 3008 GT Line', status: 'transformed', original_url: '/photos/original/2.jpg', transformed_url: '/photos/transformed/2.jpg', background_type: 'showroom_classic', created_at: '2024-06-10T10:31:00Z', file_size: 2380000 },
  { id: '3', filename: 'bmw-320d-front.jpg', vehicle_id: '2', vehicle_name: 'BMW 320d M Sport', status: 'processing', original_url: '/photos/original/3.jpg', created_at: '2024-06-10T11:00:00Z', file_size: 3100000 },
  { id: '4', filename: 'renault-clio-exterior.jpg', vehicle_id: '3', vehicle_name: 'Renault Clio RS Line', status: 'original', original_url: '/photos/original/4.jpg', created_at: '2024-06-09T14:20:00Z', file_size: 1850000 },
  { id: '5', filename: 'golf-r-line-side.jpg', vehicle_id: '4', vehicle_name: 'Volkswagen Golf R-Line', status: 'failed', original_url: '/photos/original/5.jpg', created_at: '2024-06-08T09:15:00Z', file_size: 2750000 },
  { id: '6', filename: 'mercedes-c-class.jpg', vehicle_name: 'Mercedes Classe C', status: 'transformed', original_url: '/photos/original/6.jpg', transformed_url: '/photos/transformed/6.jpg', background_type: 'outdoor_luxury', created_at: '2024-06-07T16:45:00Z', file_size: 2900000 },
];

const backgroundOptions = [
  { id: 'showroom_modern', name: 'Showroom Moderne' },
  { id: 'showroom_classic', name: 'Showroom Classique' },
  { id: 'outdoor_luxury', name: 'Extérieur Luxe' },
  { id: 'studio_white', name: 'Studio Blanc' },
  { id: 'garage_pro', name: 'Garage Pro' },
];

function getStatusColor(status: Photo['status']) {
  switch (status) {
    case 'original':
      return 'bg-gray-100 text-gray-800';
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    case 'transformed':
      return 'bg-green-100 text-green-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function getStatusLabel(status: Photo['status']) {
  switch (status) {
    case 'original':
      return 'Original';
    case 'processing':
      return 'En cours';
    case 'transformed':
      return 'Transformée';
    case 'failed':
      return 'Échec';
    default:
      return status;
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export function PhotosPage() {
  const [activeTab, setActiveTab] = useState<'transform' | 'gallery'>('transform');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [previewPhoto, setPreviewPhoto] = useState<Photo | null>(null);

  const filteredPhotos = mockPhotos.filter((photo) => {
    if (search) {
      const term = search.toLowerCase();
      if (
        !photo.filename.toLowerCase().includes(term) &&
        !photo.vehicle_name?.toLowerCase().includes(term)
      ) {
        return false;
      }
    }
    if (statusFilter && photo.status !== statusFilter) return false;
    return true;
  });

  const toggleSelect = (photoId: string) => {
    setSelectedPhotos((prev) =>
      prev.includes(photoId)
        ? prev.filter((id) => id !== photoId)
        : [...prev, photoId]
    );
  };

  const stats = {
    total: mockPhotos.length,
    transformed: mockPhotos.filter((p) => p.status === 'transformed').length,
    processing: mockPhotos.filter((p) => p.status === 'processing').length,
  };

  return (
    <div className="space-y-6">
      {/* Header with Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Photos</h1>
          <div className="flex gap-1 mt-2">
            <Button
              variant={activeTab === 'transform' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('transform')}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Transformer
            </Button>
            <Button
              variant={activeTab === 'gallery' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('gallery')}
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Galerie
            </Button>
          </div>
        </div>
        {activeTab === 'gallery' && (
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
              <Upload className="h-4 w-4 mr-2" />
              Uploader
            </Button>
          </div>
        )}
      </div>

      {/* Transform Tab */}
      {activeTab === 'transform' && <ImageProcessor />}

      {/* Gallery Tab */}
      {activeTab === 'gallery' && (
        <>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Rechercher par nom de fichier ou véhicule..."
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

      {/* Bulk Actions */}
      {selectedPhotos.length > 0 && (
        <div className="flex items-center gap-4 p-4 bg-primary/10 rounded-lg">
          <span className="text-sm font-medium">
            {selectedPhotos.length} photo(s) sélectionnée(s)
          </span>
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Télécharger
            </Button>
            <Button variant="outline" size="sm">
              Transformer
            </Button>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
          </div>
        </div>
      )}

      {/* Photos Grid/List */}
      <div
        className={cn(
          'grid gap-4',
          viewMode === 'grid'
            ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
            : 'grid-cols-1'
        )}
      >
        {filteredPhotos.map((photo) => (
          <Card
            key={photo.id}
            className={cn(
              'overflow-hidden cursor-pointer transition-all',
              selectedPhotos.includes(photo.id) && 'ring-2 ring-primary',
              viewMode === 'list' && 'flex'
            )}
            onClick={() => toggleSelect(photo.id)}
          >
            {/* Image */}
            <div
              className={cn(
                'bg-accent flex items-center justify-center relative group',
                viewMode === 'grid' ? 'aspect-square' : 'w-32 h-24 flex-shrink-0'
              )}
            >
              <ImageIcon className="h-8 w-8 text-muted-foreground" />

              {/* Overlay actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewPhoto(photo);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>

              {/* Status badge */}
              {photo.status === 'processing' && (
                <div className="absolute bottom-2 right-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                </div>
              )}
            </div>

            {/* Info */}
            <CardContent className={cn('p-3', viewMode === 'list' && 'flex-1')}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{photo.filename}</p>
                  {photo.vehicle_name && (
                    <p className="text-xs text-muted-foreground truncate">
                      {photo.vehicle_name}
                    </p>
                  )}
                </div>
                <Badge className={cn('text-xs flex-shrink-0', getStatusColor(photo.status))}>
                  {getStatusLabel(photo.status)}
                </Badge>
              </div>

              {viewMode === 'list' && (
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span>{formatFileSize(photo.file_size)}</span>
                  <span>{formatDate(photo.created_at)}</span>
                  {photo.background_type && (
                    <Badge variant="outline" className="text-xs">
                      {backgroundOptions.find((b) => b.id === photo.background_type)?.name}
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPhotos.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Aucune photo trouvée</p>
          </CardContent>
        </Card>
      )}
      </>
      )}

      {/* Preview Modal */}
      {previewPhoto && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewPhoto(null)}
        >
          <div
            className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{previewPhoto.filename}</h3>
                <p className="text-sm text-muted-foreground">{previewPhoto.vehicle_name}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setPreviewPhoto(null)}>
                <span className="text-xl">&times;</span>
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4">
              {/* Original */}
              <div>
                <p className="text-sm font-medium mb-2">Original</p>
                <div className="aspect-video bg-accent rounded-lg flex items-center justify-center">
                  <ImageIcon className="h-16 w-16 text-muted-foreground" />
                </div>
              </div>

              {/* Transformed */}
              <div>
                <p className="text-sm font-medium mb-2">Transformée</p>
                <div className="aspect-video bg-accent rounded-lg flex items-center justify-center">
                  {previewPhoto.transformed_url ? (
                    <ImageIcon className="h-16 w-16 text-muted-foreground" />
                  ) : (
                    <p className="text-sm text-muted-foreground">Non disponible</p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 border-t flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                <span>{formatFileSize(previewPhoto.file_size)}</span>
                <span className="mx-2">•</span>
                <span>{formatDate(previewPhoto.created_at)}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
                {previewPhoto.status === 'original' && (
                  <Button>Transformer</Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
