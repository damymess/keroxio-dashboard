import { useState, useEffect } from 'react';
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
import { vehicleApi, type Vehicle } from '../lib/vehicleApi';
import { cn } from '../lib/utils';

const statusConfig: Record<string, { label: string; variant: 'secondary' | 'warning' | 'success'; icon: React.ComponentType<{ className?: string }> }> = {
  draft: { label: 'Brouillon', variant: 'secondary', icon: Loader2 },
  ready: { label: 'Prêt', variant: 'warning', icon: CheckCircle },
  published: { label: 'Publié', variant: 'success', icon: ExternalLink },
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
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  // Load recent vehicles
  useEffect(() => {
    vehicleApi.list()
      .then(data => setVehicles(data.slice(0, 5))) // Show only 5 most recent
      .catch(err => console.error('Failed to load vehicles:', err))
      .finally(() => setLoading(false));
  }, []);

  // Calculate stats
  const stats = {
    total: vehicles.length,
    photos: vehicles.reduce((sum, v) => sum + (v.photos_traitees?.length || 0), 0),
    published: vehicles.filter(v => v.status === 'published').length,
    ready: vehicles.filter(v => v.status === 'ready').length,
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Bonjour{user?.username ? `, ${user.username}` : ''} 👋
        </h1>
        <p className="text-white/40 mt-1">
          Vendez votre véhicule en 5 minutes
        </p>
      </div>

      {/* Main CTA */}
      <div
        className="glass-card cursor-pointer hover:border-ios-blue/30 transition-all group overflow-hidden relative"
        onClick={() => navigate('/new')}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-ios-blue/10 to-ios-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="p-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-ios-blue to-ios-purple text-white shadow-[0_4px_24px_rgba(0,122,255,0.3)]">
              <Plus className="h-10 w-10" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-white mb-2">Vendre un véhicule</h2>
              <p className="text-white/40 mb-4">
                Créez une annonce professionnelle en quelques clics
              </p>
              
              {/* Steps preview */}
              <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                {steps.map((step, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full glass-subtle text-xs">
                      <step.icon className="h-3.5 w-3.5 text-ios-blue" />
                      <span className="font-medium text-white/70">{step.label}</span>
                    </div>
                    {i < steps.length - 1 && (
                      <ArrowRight className="h-3 w-3 text-white/20" />
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
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { value: stats.total, label: 'Véhicules', color: 'text-ios-blue' },
          { value: stats.photos, label: 'Photos traitées', color: 'text-ios-teal' },
          { value: stats.published, label: 'Publiés', color: 'text-ios-green' },
          { value: stats.ready, label: 'Prêts à publier', color: 'text-ios-orange' },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-5 text-center">
              <p className={cn('text-3xl font-bold', stat.color)}>{stat.value}</p>
              <p className="text-sm text-white/40 mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Vehicles */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white">
            <Clock className="h-5 w-5 text-white/40" />
            Véhicules récents
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => navigate('/vehicles')} className="text-ios-blue">
            Voir tout
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-ios-blue/50" />
            </div>
          ) : vehicles.length > 0 ? (
            <div className="space-y-2">
              {vehicles.map((vehicle) => {
                const status = statusConfig[vehicle.status] || statusConfig.draft;
                const StatusIcon = status.icon;
                
                return (
                  <div
                    key={vehicle.id}
                    onClick={() => navigate(`/vehicles/${vehicle.id}`)}
                    className="flex items-center justify-between p-4 rounded-2xl glass-subtle hover:bg-white/8 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden border border-white/10">
                        {vehicle.photos_traitees && vehicle.photos_traitees.length > 0 ? (
                          <img
                            src={vehicle.photos_traitees[0]}
                            alt={`${vehicle.marque} ${vehicle.modele}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Car className="h-7 w-7 text-white/20" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-white">
                          {vehicle.marque} {vehicle.modele}
                        </p>
                        <p className="text-sm text-white/40">
                          {vehicle.plaque} {vehicle.annee && `• ${vehicle.annee}`}
                          {vehicle.photos_traitees && ` • ${vehicle.photos_traitees.length} photos`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {vehicle.prix_choisi && (
                        <p className="font-bold text-lg text-white">
                          {vehicle.prix_choisi.toLocaleString('fr-FR')} €
                        </p>
                      )}
                      <Badge variant={status.variant}>
                        <StatusIcon className={cn('h-3 w-3 mr-1', vehicle.status === 'draft' && 'animate-spin')} />
                        {status.label}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Car className="h-12 w-12 mx-auto mb-4 text-white/10" />
              <p className="font-medium text-white/60">Aucun véhicule</p>
              <p className="text-sm text-white/30">Commencez par ajouter votre premier véhicule</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* How it works */}
      <Card>
        <CardHeader>
          <CardTitle className="text-white">Comment ça marche ?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {steps.map((step, i) => (
              <div key={i} className="text-center">
                <div className="h-14 w-14 rounded-2xl glass flex items-center justify-center mx-auto mb-3 relative">
                  <step.icon className="h-6 w-6 text-ios-blue" />
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-ios-blue text-white text-xs font-bold flex items-center justify-center shadow-[0_2px_8px_rgba(0,122,255,0.4)]">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-semibold text-sm text-white">{step.label}</h3>
                <p className="text-xs text-white/40">{step.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
