import { useEffect, useState } from 'react';
import {
  Users,
  UserPlus,
  Car,
  Euro,
  TrendingUp,
  TrendingDown,
  Flame,
  CheckSquare,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { cn, formatCurrency, formatRelativeTime, getScoreBgColor } from '../lib/utils';
import { crmApi, type DashboardKPIs, type Prospect, type Task } from '../lib/api';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: number;
  icon: React.ElementType;
  iconColor?: string;
}

function StatCard({ title, value, trend, icon: Icon, iconColor = 'text-primary' }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {trend !== undefined && (
              <div className="flex items-center gap-1 mt-1">
                {trend >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span
                  className={cn(
                    'text-sm font-medium',
                    trend >= 0 ? 'text-green-500' : 'text-red-500'
                  )}
                >
                  {trend >= 0 ? '+' : ''}{trend}%
                </span>
              </div>
            )}
          </div>
          <div className={cn('p-3 rounded-xl bg-accent', iconColor)}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function Dashboard() {
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [hotProspects, setHotProspects] = useState<Prospect[]>([]);
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        // For demo, use mock data
        setKpis({
          period_days: 30,
          leads: { total: 45, trend: 15, hot: 8 },
          clients: { new: 12 },
          deals: { active: 23, won: 7 },
          revenue: { total: 156000, trend: 8 },
          tasks: { today: 5, overdue: 2 },
        });

        setHotProspects([
          { id: '1', prenom: 'Jean', nom: 'Dupont', email: 'jean@email.com', telephone: '06 12 34 56 78', source: 'leboncoin', statut: 'qualifie', score: 85, budget_max: 25000, financement: true, reprise: false, created_at: new Date().toISOString() },
          { id: '2', prenom: 'Marie', nom: 'Martin', email: 'marie@email.com', telephone: '06 98 76 54 32', source: 'lacentrale', statut: 'chaud', score: 78, budget_max: 35000, financement: false, reprise: true, created_at: new Date().toISOString() },
          { id: '3', prenom: 'Pierre', nom: 'Durand', email: 'pierre@email.com', telephone: '06 55 44 33 22', source: 'site', statut: 'rendez_vous', score: 72, budget_max: 18000, financement: true, reprise: false, created_at: new Date().toISOString() },
        ]);

        setTodayTasks([
          { id: '1', titre: 'Rappeler M. Dupont', type: 'appel', priorite: 'haute', statut: 'a_faire', date_echeance: new Date().toISOString() },
          { id: '2', titre: 'Envoyer devis Clio', type: 'email', priorite: 'normale', statut: 'a_faire', date_echeance: new Date().toISOString() },
          { id: '3', titre: 'RDV 14h Mme Martin', type: 'rendez_vous', priorite: 'haute', statut: 'a_faire', date_echeance: new Date().toISOString() },
        ]);
      } catch (error) {
        // Error tracked via PostHog
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Vue d'ensemble de votre activité
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Nouveaux Leads"
          value={kpis?.leads.total || 0}
          trend={kpis?.leads.trend}
          icon={UserPlus}
        />
        <StatCard
          title="Leads Chauds"
          value={kpis?.leads.hot || 0}
          icon={Flame}
          iconColor="text-red-500"
        />
        <StatCard
          title="Deals Actifs"
          value={kpis?.deals.active || 0}
          icon={Car}
          iconColor="text-blue-500"
        />
        <StatCard
          title="CA du Mois"
          value={formatCurrency(kpis?.revenue.total)}
          trend={kpis?.revenue.trend}
          icon={Euro}
          iconColor="text-green-500"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hot Prospects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-red-500" />
              Leads Chauds
            </CardTitle>
            <Badge variant="destructive">{hotProspects.length}</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {hotProspects.map((prospect) => (
              <div
                key={prospect.id}
                className="flex items-center justify-between p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {prospect.prenom?.[0]}{prospect.nom?.[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">
                      {prospect.prenom} {prospect.nom}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Budget: {formatCurrency(prospect.budget_max)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getScoreBgColor(prospect.score)}>
                    Score: {prospect.score}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {prospect.source}
                  </p>
                </div>
              </div>
            ))}
            {hotProspects.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                Aucun lead chaud pour le moment
              </p>
            )}
          </CardContent>
        </Card>

        {/* Today's Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-blue-500" />
              Tâches du Jour
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant="secondary">{todayTasks.length}</Badge>
              {(kpis?.tasks.overdue || 0) > 0 && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {kpis?.tasks.overdue} en retard
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-input"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm">{task.titre}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {task.type}
                  </p>
                </div>
                <Badge
                  variant={
                    task.priorite === 'urgente' || task.priorite === 'haute'
                      ? 'destructive'
                      : 'secondary'
                  }
                >
                  {task.priorite}
                </Badge>
              </div>
            ))}
            {todayTasks.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                Aucune tâche pour aujourd'hui
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      <Card className="border-warning/50 bg-warning/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-warning">
            <AlertCircle className="h-5 w-5" />
            Alertes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-warning" />
              3 véhicules en stock depuis plus de 60 jours
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-warning" />
              CT expire dans 7 jours : Renault Clio AB-456-CD
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-warning" />
              5 leads sans réponse depuis 48h
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
