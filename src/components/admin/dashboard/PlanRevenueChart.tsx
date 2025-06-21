
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const planRevenueData = [
  { name: "Plano Básico", value: 35, receita: 15400, color: "#0088FE" },
  { name: "Plano Pro", value: 45, receita: 22800, color: "#00C49F" },
  { name: "Plano Premium", value: 20, receita: 12600, color: "#FFBB28" }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

export function PlanRevenueChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Receita por Plano</CardTitle>
        <CardDescription>Distribuição da receita por tipo de assinatura</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={planRevenueData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {planRevenueData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name, props) => [
              `${value}% (R$ ${props.payload.receita.toLocaleString()})`, 
              props.payload.name
            ]} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
