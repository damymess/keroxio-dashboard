import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Bell, Palette, Shield, CreditCard, PlayCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';

const tabs = [
  { id: 'profile', label: 'Profil', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Apparence', icon: Palette },
  { id: 'security', label: 'Sécurité', icon: Shield },
  { id: 'billing', label: 'Abonnement', icon: CreditCard },
];

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const resetOnboarding = useAuthStore((state) => state.resetOnboarding);
  const { theme, setTheme } = useUIStore();

  const handleReplayOnboarding = () => {
    resetOnboarding();
    navigate('/onboarding');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Paramètres</h1>
        <p className="text-white/40">
          Gérez vos préférences et votre compte
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-48 flex-shrink-0">
          <nav className="flex lg:flex-col gap-1 glass-card p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-2xl text-sm transition-all ${
                  activeTab === tab.id
                    ? 'glass-btn-primary text-white'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-white">Profil</CardTitle>
                <CardDescription>
                  Gérez vos informations personnelles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-ios-blue to-ios-purple flex items-center justify-center shadow-[0_4px_16px_rgba(0,122,255,0.3)]">
                    <span className="text-2xl font-bold text-white">
                      {user?.username?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <Button variant="outline">Changer la photo</Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="Nom d'utilisateur"
                    defaultValue={user?.username}
                  />
                  <Input
                    label="Email"
                    type="email"
                    defaultValue={user?.email}
                  />
                </div>

                <Button>Enregistrer</Button>
              </CardContent>
            </Card>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-white">Apparence</CardTitle>
                  <CardDescription>
                    Personnalisez l'interface
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-3 text-white/70">Thème</p>
                    <div className="flex gap-2">
                      {(['light', 'dark', 'system'] as const).map((t) => (
                        <Button
                          key={t}
                          variant={theme === t ? 'default' : 'outline'}
                          onClick={() => setTheme(t)}
                        >
                          {t === 'light' && 'Clair'}
                          {t === 'dark' && 'Sombre'}
                          {t === 'system' && 'Système'}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-white">Introduction</CardTitle>
                  <CardDescription>
                    Revoir le guide de démarrage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    onClick={handleReplayOnboarding}
                    className="flex items-center gap-2"
                  >
                    <PlayCircle className="h-4 w-4" />
                    Revoir l'introduction
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-white">Notifications</CardTitle>
                <CardDescription>
                  Configurez vos préférences de notification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: 'Nouveaux leads', description: 'Recevoir une notification pour chaque nouveau prospect' },
                  { label: 'Leads chauds', description: 'Alerte quand un prospect atteint un score élevé' },
                  { label: 'Rappels de tâches', description: 'Notification avant les échéances' },
                  { label: 'Résumé quotidien', description: 'Email récapitulatif chaque matin' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                    <div>
                      <p className="font-medium text-sm text-white">{item.label}</p>
                      <p className="text-xs text-white/40">{item.description}</p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 rounded border-white/20 bg-white/5 text-ios-blue focus:ring-ios-blue/50"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-white">Sécurité</CardTitle>
                <CardDescription>
                  Gérez la sécurité de votre compte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-3 text-white/70">Changer le mot de passe</p>
                  <div className="space-y-3 max-w-md">
                    <Input
                      label="Mot de passe actuel"
                      type="password"
                    />
                    <Input
                      label="Nouveau mot de passe"
                      type="password"
                    />
                    <Input
                      label="Confirmer le mot de passe"
                      type="password"
                    />
                    <Button>Mettre à jour</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'billing' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-white">Abonnement</CardTitle>
                <CardDescription>
                  Gérez votre abonnement et facturation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-2xl glass border-ios-blue/20 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-ios-blue">Plan Pro</p>
                      <p className="text-sm text-white/40">99€/mois</p>
                    </div>
                    <Button variant="outline">Gérer</Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Photos utilisées</span>
                    <span className="font-medium text-white">45 / 100</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-ios-blue to-ios-purple rounded-full" style={{ width: '45%' }} />
                  </div>

                  <div className="flex justify-between text-sm mt-4">
                    <span className="text-white/60">Annonces générées</span>
                    <span className="font-medium text-white">23 / 50</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-ios-green to-ios-teal rounded-full" style={{ width: '46%' }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
