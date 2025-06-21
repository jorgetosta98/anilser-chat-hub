
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const statsData = [
  { name: "Jan", usuarios: 12, conversas: 45 },
  { name: "Fev", usuarios: 19, conversas: 62 },
  { name: "Mar", usuarios: 25, conversas: 78 },
  { name: "Abr", usuarios: 32, conversas: 95 },
  { name: "Mai", usuarios: 41, conversas: 123 },
  { name: "Jun", usuarios: 38, conversas: 156 }
];

export function UserGrowthChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Crescimento de Usuários e Conversas</CardTitle>
        <CardDescription>Dados dos últimos 6 meses</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={statsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="usuarios" fill="#2563eb" name="Usuários" />
            <Bar dataKey="conversas" fill="#16a34a" name="Conversas" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
