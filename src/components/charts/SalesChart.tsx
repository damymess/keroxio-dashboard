import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

interface SalesData {
  month: string;
  ventes: number;
  objectif: number;
}

interface SalesChartProps {
  data?: SalesData[];
  title?: string;
}

const defaultData: SalesData[] = [
  { month: 'Jan', ventes: 45000, objectif: 50000 },
  { month: 'Fév', ventes: 52000, objectif: 50000 },
  { month: 'Mar', ventes: 48000, objectif: 55000 },
  { month: 'Avr', ventes: 61000, objectif: 55000 },
  { month: 'Mai', ventes: 55000, objectif: 60000 },
  { month: 'Juin', ventes: 67000, objectif: 60000 },
];

export function SalesChart({ data = defaultData, title = 'Évolution des ventes' }: SalesChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVentes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="month"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <YAxis
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickFormatter={(value) => `${value / 1000}k€`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [`${value.toLocaleString()}€`, '']}
              />
              <Area
                type="monotone"
                dataKey="objectif"
                stroke="hsl(var(--muted-foreground))"
                strokeDasharray="5 5"
                fill="none"
                name="Objectif"
              />
              <Area
                type="monotone"
                dataKey="ventes"
                stroke="hsl(var(--primary))"
                fillOpacity={1}
                fill="url(#colorVentes)"
                name="Ventes"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
