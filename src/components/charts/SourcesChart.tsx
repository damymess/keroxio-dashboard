import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

interface SourceData {
  name: string;
  value: number;
  color: string;
}

interface SourcesChartProps {
  data?: SourceData[];
  title?: string;
}

const defaultData: SourceData[] = [
  { name: 'LeBonCoin', value: 35, color: 'hsl(25 95% 53%)' },
  { name: 'La Centrale', value: 25, color: 'hsl(215 100% 50%)' },
  { name: 'Site Web', value: 20, color: 'hsl(142 76% 36%)' },
  { name: 'Téléphone', value: 12, color: 'hsl(262 83% 58%)' },
  { name: 'Visite directe', value: 8, color: 'hsl(340 82% 52%)' },
];

export function SourcesChart({ data = defaultData, title = 'Sources des leads' }: SourcesChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [`${value} (${((value / total) * 100).toFixed(0)}%)`, 'Leads']}
              />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                formatter={(value) => (
                  <span style={{ color: 'hsl(var(--foreground))', fontSize: '12px' }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
