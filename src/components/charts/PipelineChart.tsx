import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

interface PipelineData {
  stage: string;
  count: number;
  value: number;
}

interface PipelineChartProps {
  data?: PipelineData[];
  title?: string;
}

const defaultData: PipelineData[] = [
  { stage: 'Nouveau', count: 12, value: 180000 },
  { stage: 'Contacté', count: 8, value: 145000 },
  { stage: 'Qualifié', count: 6, value: 120000 },
  { stage: 'Visite', count: 4, value: 95000 },
  { stage: 'Offre', count: 3, value: 75000 },
  { stage: 'Négo', count: 2, value: 52000 },
  { stage: 'Closing', count: 1, value: 28000 },
];

const COLORS = [
  'hsl(215 100% 60%)',
  'hsl(200 100% 55%)',
  'hsl(180 100% 45%)',
  'hsl(160 100% 40%)',
  'hsl(140 80% 40%)',
  'hsl(120 70% 40%)',
  'hsl(100 70% 45%)',
];

export function PipelineChart({ data = defaultData, title = 'Pipeline des ventes' }: PipelineChartProps) {
  const totalValue = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <span className="text-sm text-muted-foreground">
          Total: {(totalValue / 1000).toFixed(0)}k€
        </span>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
            >
              <XAxis
                type="number"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickFormatter={(value) => `${value / 1000}k€`}
              />
              <YAxis
                type="category"
                dataKey="stage"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                width={60}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: number, name: string, props: any) => [
                  `${value.toLocaleString()}€ (${props.payload.count} deals)`,
                  'Valeur',
                ]}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
