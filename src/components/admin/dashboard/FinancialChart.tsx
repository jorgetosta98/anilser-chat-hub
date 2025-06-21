
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const revenueData = [
  { name: "Jan", receita: 12400, despesas: 8200, lucro: 4200 },
  { name: "Fev", receita: 15600, despesas: 9100, lucro: 6500 },
  { name: "Mar", receita: 18900, despesas: 10500, lucro: 8400 },
  { name: "Abr", receita: 22300, despesas: 11800, lucro: 10500 },
  { name: "Mai", receita: 28700, despesas: 13200, lucro: 15500 },
  { name: "Jun", receita: 31200, despesas: 14100, lucro: 17100 }
];

export function FinancialChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Desempenho Financeiro</CardTitle>
        <CardDescription>Receita, despesas e lucro dos últimos 6 meses</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorLucro" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => [`R$ ${value.toLocaleString()}`, '']} />
            <Area 
              type="monotone" 
              dataKey="receita" 
              stackId="1" 
              stroke="#10b981" 
              fill="url(#colorReceita)" 
              name="Receita"
            />
            <Area 
              type="monotone" 
              dataKey="despesas" 
              stackId="2" 
              stroke="#ef4444" 
              fill="url(#colorDespesas)" 
              name="Despesas"
            />
            <Area 
              type="monotone" 
              dataKey="lucro" 
              stackId="3" 
              stroke="#3b82f6" 
              fill="url(#colorLucro)" 
              name="Lucro"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
