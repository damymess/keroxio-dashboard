import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Car,
  Image as ImageIcon,
  Euro,
  FileText,
  ExternalLink,
  ArrowRight,
  Clock,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAuthStore } from '../stores/authStore';
import { cn } from '../lib/utils';

// Mock recent vehicles
const recentVehicles = [
  {
    id: '1',
    plaque: 'AB-123-CD',
    marque: 'Peugeot',
    modele: '308',
    annee: 2020,
    prix_estime: 15900,
    status: 'published',
    photos: 6,
    created_at: '2026-02-01',
  },
  {
    id: '2',
    plaque: 'EF-456-GH',
    marque: 'Renault',
    modele: 'Clio',
    annee: 2019,
    prix_estime: 12500,
    status: 'ready',
    photos: 4,
    created_at: '2026-01-30',
  },
  {
    id: '3',
    plaque: 'IJ-789-KL',
    marque: 'BMW',
    modele: 'Série 3',
    annee: 2021,
    prix_estime: 32000,
    status: 'processing',
    photos: 8,
    created_at: '2026-01-28',
  },
];

const statusConfig = {
  processing: { label: 'En cours', color: 'bg-blue-100 text-blue-800', icon: Loader2 },
  ready: { label: 'Prêt à publier', color: 'bg-amber-100 text-amber-800', icon: CheckCircle },
  published: { label: 'Publié', color: 'bg-green-100 text-green-800', icon: ExternalLink },
};

const steps = [
  { icon: Car, label: 'Plaque', desc: 'Lecture automatique' },
  { icon: ImageIcon, label: 'Photos', desc: 'Fonds pro' },
  { icon: Euro, label: 'Prix', desc: 'Estimation marché' },
  { icon: FileText, label: 'Annonce', desc: 'Texte auto' },
  { icon: ExternalLink, label: 'Publier', desc: 'LeBonCoin...' },
];

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold">
          Bonjour{user?.username ? `, ${user.username}` : ''} 👋
        </h1>
        <p className="text-muted-foreground">
          Vendez votre véhicule en 5 minutes
        </p>
      </div>

      {/* Main CTA */}
      <Card 
        className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 cursor-pointer hover:border-primary/50 transition-all"
        onClick={() => navigate('/new')}
      >
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="p-4 rounded-2xl bg-primary text-primary-foreground">
              <Plus className="h-10 w-10" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2">Vendre un véhicule</h2>
              <p className="text-muted-foreground mb-4">
                Créez une annonce professionnelle en quelques clics
              </p>
              
              {/* Steps preview */}
              <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                {steps.map((step, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-background/80 text-xs">
                      <step.icon className="h-3.5 w-3.5 text-primary" />
                      <span className="font-medium">{step.label}</span>
                    </div>
                    {i < steps.length - 1 && (
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <Button size="lg" className="gap-2">
              Commencer
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">3</p>
            <p className="text-sm text-muted-foreground">Véhicules</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-blue-500">18</p>
            <p className="text-sm text-muted-foreground">Photos traitées</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-green-500">1</p>
            <p className="text-sm text-muted-foreground">Annonces publiées</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-amber-500">2</p>
            <p className="text-sm text-muted-foreground">Prêts à publier</p>
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
            {recentVehicles.map((vehicle) => {
              const status = statusConfig[vehicle.status as keyof typeof statusConfig];
              const StatusIcon = status.icon;
              
              return (
                <div
                  key={vehicle.id}
                  onClick={() => navigate(`/vehicles/${vehicle.id}`)}
                  className="flex items-center justify-between p-4 rounded-lg bg-accent/50 hover:bg-accent transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-lg bg-muted flex items-center justify-center">
                      <Car className="h-7 w-7 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold">
                        {vehicle.marque} {vehicle.modele}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {vehicle.plaque} • {vehicle.annee} • {vehicle.photos} photos
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">
                      {vehicle.prix_estime.toLocaleString('fr-FR')} €
                    </p>
                    <Badge className={cn('text-xs', status.color)}>
                      <StatusIcon className={cn('h-3 w-3 mr-1', vehicle.status === 'processing' && 'animate-spin')} />
                      {status.label}
                    </Badge>
                  </div>
                </div>
              );
            })}

            {recentVehicles.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="font-medium">Aucun véhicule</p>
                <p className="text-sm">Commencez par ajouter votre premier véhicule</p>
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {steps.map((step, i) => (
              <div key={i} className="text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 relative">
                  <step.icon className="h-6 w-6 text-primary" />
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-semibold text-sm">{step.label}</h3>
                <p className="text-xs text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
