
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Brain, FileText, MessageSquare, Shield } from "lucide-react";

const topicsData = [
  { name: "Normas Regulamentares", value: 35, color: "#0d9488" },
  { name: "Segurança do Trabalho", value: 28, color: "#14b8a6" },
  { name: "Documentação", value: 22, color: "#2dd4bf" },
  { name: "Compliance", value: 15, color: "#5eead4" },
];

const weeklyUsage = [
  { day: "Seg", morning: 4, afternoon: 6, evening: 2 },
  { day: "Ter", morning: 3, afternoon: 8, evening: 1 },
  { day: "Qua", morning: 5, afternoon: 7, evening: 3 },
  { day: "Qui", morning: 6, afternoon: 5, evening: 2 },
  { day: "Sex", morning: 4, afternoon: 9, evening: 1 },
  { day: "Sáb", morning: 1, afternoon: 2, evening: 0 },
  { day: "Dom", morning: 0, afternoon: 1, evening: 1 },
];

const recommendations = [
  {
    icon: Brain,
    title: "Otimize seu horário",
    description: "Você é mais produtivo nas tardes. Consider agendar consultas complexas neste período.",
    priority: "high"
  },
  {
    icon: FileText,
    title: "Explore documentação",
    description: "Você consulta muito sobre normas. Que tal explorar nossa base de documentos técnicos?",
    priority: "medium"
  },
  {
    icon: Shield,
    title: "Foque em compliance",
    description: "Suas consultas sobre compliance aumentaram 25% este mês.",
    priority: "low"
  }
];

export function PersonalInsights() {
  return (
    <div className="space-y-6">
      {/* Topics Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Tópicos Mais Consultados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topicsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {topicsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-3">
              {topicsData.map((topic, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: topic.color }}
                    ></div>
                    <span className="text-sm font-medium">{topic.name}</span>
                  </div>
                  <span className="text-sm text-gray-600">{topic.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Patterns */}
      <Card>
        <CardHeader>
          <CardTitle>Padrão de Uso Semanal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyUsage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Bar dataKey="morning" stackId="a" fill="#fbbf24" name="Manhã" />
                <Bar dataKey="afternoon" stackId="a" fill="#f59e0b" name="Tarde" />
                <Bar dataKey="evening" stackId="a" fill="#d97706" name="Noite" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recomendações Personalizadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className={`p-2 rounded-lg ${
                  rec.priority === 'high' ? 'bg-red-100' :
                  rec.priority === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                }`}>
                  <rec.icon className={`w-5 h-5 ${
                    rec.priority === 'high' ? 'text-red-600' :
                    rec.priority === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium mb-1">{rec.title}</h4>
                  <p className="text-sm text-gray-600">{rec.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
