import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  Image as ImageIcon,
  Car,
  Zap,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../stores/authStore';
import { cn } from '../lib/utils';

// Recent vehicles mock data (would come from API)
const recentVehicles = [
  { id: '1', name: 'Peugeot 308', photos: 6, processed: true, date: '2026-02-01' },
  { id: '2', name: 'Renault Clio', photos: 4, processed: true, date: '2026-01-30' },
  { id: '3', name: 'BMW Série 3', photos: 8, processed: false, date: '2026-01-28' },
];

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Navigate to photos page with files
    navigate('/photos');
  }, [navigate]);

  const isPro = user?.plan === 'pro' || user?.plan === 'pro_business';

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold">
          Bonjour{user?.username ? `, ${user.username}` : ''} 👋
        </h1>
        <p className="text-muted-foreground">
          Transformez vos photos de véhicules en images professionnelles
        </p>
      </div>

      {/* Quick Upload Zone */}
      <Card className="border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors">
        <CardContent className="p-8">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              'flex flex-col items-center justify-center text-center cursor-pointer transition-all',
              isDragging && 'scale-105'
            )}
            onClick={() => navigate('/photos')}
          >
            <div className={cn(
              'p-4 rounded-full mb-4 transition-colors',
              isDragging ? 'bg-primary text-primary-foreground' : 'bg-primary/10'
            )}>
              <Upload className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              {isDragging ? 'Déposez vos photos ici' : 'Traiter des photos'}
            </h2>
            <p className="text-muted-foreground mb-4 max-w-md">
              Glissez-déposez vos photos ou cliquez pour commencer. 
              L'IA supprime le fond et ajoute un background professionnel.
            </p>
            <Button size="lg" className="gap-2">
              <Sparkles className="h-5 w-5" />
              Commencer le traitement
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/10">
              <ImageIcon className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">24</p>
              <p className="text-sm text-muted-foreground">Photos traitées</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-500/10">
              <Car className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">5</p>
              <p className="text-sm text-muted-foreground">Véhicules</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-500/10">
              <Zap className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{isPro ? '∞' : '10'}</p>
              <p className="text-sm text-muted-foreground">
                {isPro ? 'Photos illimitées' : 'Crédits restants'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Vehicles */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            Véhicules récents
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => navigate('/vehicles')}>
            Voir tout
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                onClick={() => navigate(`/vehicles/${vehicle.id}`)}
                className="flex items-center justify-between p-4 rounded-lg bg-accent/50 hover:bg-accent transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                    <Car className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{vehicle.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {vehicle.photos} photos • {vehicle.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {vehicle.processed ? (
                    <span className="flex items-center gap-1 text-sm text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      Traité
                    </span>
                  ) : (
                    <Button size="sm" variant="outline">
                      Traiter
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {recentVehicles.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucun véhicule pour le moment</p>
                <p className="text-sm">Commencez par uploader des photos</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* How it works */}
      <Card>
        <CardHeader>
          <CardTitle>Comment ça marche ?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-primary">1</span>
              </div>
              <h3 className="font-semibold mb-1">Uploadez</h3>
              <p className="text-sm text-muted-foreground">
                Déposez vos photos de véhicules (jusqu'à 10 par véhicule)
              </p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-primary">2</span>
              </div>
              <h3 className="font-semibold mb-1">Traitement IA</h3>
              <p className="text-sm text-muted-foreground">
                Notre IA supprime le fond et ajoute un background pro
              </p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-primary">3</span>
              </div>
              <h3 className="font-semibold mb-1">Téléchargez</h3>
              <p className="text-sm text-muted-foreground">
                Récupérez vos photos prêtes pour vos annonces
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
