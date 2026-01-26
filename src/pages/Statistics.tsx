import { useState } from 'react';
import { TrendingUp, TrendingDown, Users, Car, Euro, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { SalesChart, LeadsChart, PipelineChart, SourcesChart } from '../components/charts';
import { cn, formatCurrency } from '../lib/utils';

interface StatCard {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: typeof TrendingUp;
}

const periodOptions = [
  { value: '7d', label: '7 derniers jours' },
  { value: '30d', label: '30 derniers jours' },
  { value: '90d', label: '3 derniers mois' },
  { value: '12m', label: '12 derniers mois' },
  { value: 'ytd', label: 'Année en cours' },
];

const stats: StatCard[] = [
  {
    title: 'Chiffre d\'affaires',
    value: '328 500€',
    change: 12.5,
    changeLabel: 'vs période précédente',
    icon: Euro,
  },
  {
    title: 'Véhicules vendus',
    value: '47',
    change: 8.3,
    changeLabel: 'vs période précédente',
    icon: Car,
  },
  {
    title: 'Nouveaux leads',
    value: '156',
    change: -3.2,
    changeLabel: 'vs période précédente',
    icon: Users,
  },
  {
    title: 'Taux de conversion',
    value: '32%',
    change: 5.1,
    changeLabel: 'vs période précédente',
    icon: Target,
  },
];

const topVehicles = [
  { model: 'Peugeot 3008', sales: 12, revenue: 347000 },
  { model: 'Renault Clio', sales: 9, revenue: 179100 },
  { model: 'BMW Série 3', sales: 6, revenue: 195000 },
  { model: 'Volkswagen Golf', sales: 5, revenue: 132500 },
  { model: 'Mercedes Classe A', sales: 4, revenue: 148000 },
];

const topSellers = [
  { name: 'Jean Dupont', sales: 15, revenue: 412000 },
  { name: 'Marie Martin', sales: 12, revenue: 356000 },
  { name: 'Pierre Bernard', sales: 10, revenue: 289000 },
  { name: 'Sophie Petit', sales: 8, revenue: 234000 },
];

export function StatisticsPage() {
  const [period, setPeriod] = useState('30d');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Statistiques</h1>
          <p className="text-muted-foreground">
            Analysez les performances de votre activité
          </p>
        </div>
        <div className="flex gap-2">
          <Select
            options={periodOptions}
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          />
          <Button variant="outline">Exporter</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div
                  className={cn(
                    'flex items-center gap-1 text-sm font-medium',
                    stat.change >= 0 ? 'text-green-500' : 'text-red-500'
                  )}
                >
                  {stat.change >= 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {Math.abs(stat.change)}%
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart />
        <LeadsChart />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PipelineChart />
        <SourcesChart />
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Vehicles */}
        <Card>
          <CardHeader>
            <CardTitle>Top véhicules vendus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topVehicles.map((vehicle, index) => (
                <div key={vehicle.model} className="flex items-center gap-4">
                  <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium">{vehicle.model}</p>
                    <p className="text-sm text-muted-foreground">
                      {vehicle.sales} ventes
                    </p>
                  </div>
                  <span className="font-semibold">
                    {formatCurrency(vehicle.revenue)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Sellers */}
        <Card>
          <CardHeader>
            <CardTitle>Top vendeurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSellers.map((seller, index) => (
                <div key={seller.name} className="flex items-center gap-4">
                  <span
                    className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium',
                      index === 0 && 'bg-yellow-100 text-yellow-800',
                      index === 1 && 'bg-gray-100 text-gray-800',
                      index === 2 && 'bg-orange-100 text-orange-800',
                      index > 2 && 'bg-primary/10'
                    )}
                  >
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium">{seller.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {seller.sales} ventes
                    </p>
                  </div>
                  <span className="font-semibold">
                    {formatCurrency(seller.revenue)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
