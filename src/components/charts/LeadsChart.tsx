import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

interface LeadsData {
  month: string;
  nouveaux: number;
  qualifies: number;
  convertis: number;
}

interface LeadsChartProps {
  data?: LeadsData[];
  title?: string;
}

const defaultData: LeadsData[] = [
  { month: 'Jan', nouveaux: 45, qualifies: 32, convertis: 12 },
  { month: 'Fév', nouveaux: 52, qualifies: 38, convertis: 15 },
  { month: 'Mar', nouveaux: 48, qualifies: 35, convertis: 14 },
  { month: 'Avr', nouveaux: 61, qualifies: 45, convertis: 18 },
  { month: 'Mai', nouveaux: 55, qualifies: 42, convertis: 16 },
  { month: 'Juin', nouveaux: 67, qualifies: 52, convertis: 22 },
];

export function LeadsChart({ data = defaultData, title = 'Évolution des leads' }: LeadsChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="month"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <YAxis
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar
                dataKey="nouveaux"
                fill="hsl(var(--primary))"
                name="Nouveaux"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="qualifies"
                fill="hsl(210 100% 60%)"
                name="Qualifiés"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="convertis"
                fill="hsl(142 76% 36%)"
                name="Convertis"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
