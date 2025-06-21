
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const activityData = [
  { time: "00:00", atividade: 12 },
  { time: "04:00", atividade: 8 },
  { time: "08:00", atividade: 45 },
  { time: "12:00", atividade: 78 },
  { time: "16:00", atividade: 65 },
  { time: "20:00", atividade: 34 }
];

export function ActivityChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividade nas Últimas 24h</CardTitle>
        <CardDescription>Número de interações por hora</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={activityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="atividade" stroke="#2563eb" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
