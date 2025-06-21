
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Clock, MessageSquare, Star, Shield, Users, TrendingUp } from "lucide-react";
import { UserActivityReport } from "@/components/reports/UserActivityReport";
import { PersonalInsights } from "@/components/reports/PersonalInsights";

const monthlyData = [
  { month: "Jan", documents: 12, consulting: 8, research: 15 },
  { month: "Fev", documents: 18, consulting: 12, research: 20 },
  { month: "Mar", documents: 16, consulting: 10, research: 18 },
  { month: "Abr", documents: 20, consulting: 15, research: 22 },
  { month: "Mai", documents: 18, consulting: 12, research: 19 },
  { month: "Jun", documents: 19, consulting: 14, research: 21 },
  { month: "Jul", documents: 17, consulting: 11, research: 18 },
  { month: "Ago", documents: 21, consulting: 16, research: 23 },
  { month: "Set", documents: 20, consulting: 15, research: 22 },
  { month: "Out", documents: 19, consulting: 13, research: 20 },
  { month: "Nov", documents: 18, consulting: 12, research: 19 },
  { month: "Dez", documents: 17, consulting: 11, research: 18 },
];

const pieData = [
  { name: "Consultoria de normas", value: 32, color: "#0d9488" },
  { name: "Avaliação de riscos", value: 32, color: "#14b8a6" },
  { name: "Pesquisas em documentos", value: 32, color: "#2dd4bf" },
  { name: "Lorem Ipsum", value: 32, color: "#fca5a5" },
];

export default function Relatorios() {
  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Relatórios e Análises</h1>
            <p className="text-gray-600 mt-1">Acompanhe seu desempenho e insights personalizados</p>
          </div>
          <Select defaultValue="2023">
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
              <SelectItem value="2021">2021</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Meu Desempenho</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center space-x-2">
              <Star className="w-4 h-4" />
              <span>Insights</span>
            </TabsTrigger>
            <TabsTrigger value="general" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Estatísticas Gerais</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <UserActivityReport />
          </TabsContent>

          <TabsContent value="insights">
            <PersonalInsights />
          </TabsContent>

          <TabsContent value="general">
            {/* Time Saved Section */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>Tempo poupado</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-3 bg-primary-50 rounded-lg">
                        <Star className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-gray-900">187 horas</div>
                        <div className="text-sm text-gray-600">
                          Quantidade de horas poupadas no total desde o início do uso do Safeboy.
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Bar dataKey="documents" stackId="a" fill="#0d9488" name="Elaboração de Documentos" />
                        <Bar dataKey="consulting" stackId="a" fill="#14b8a6" name="Consultoria de normas" />
                        <Bar dataKey="research" stackId="a" fill="#2dd4bf" name="Pesquisas em documentos" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Total Interactions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    <span>Total de Interações</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-gray-900 mb-2">157</div>
                    <div className="text-sm text-gray-600">Interações totais</div>
                  </div>
                  
                  <div className="w-48 h-48 mx-auto">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-2 mt-4">
                    {pieData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <span className="text-gray-700">{item.name}</span>
                        </div>
                        <span className="text-gray-900 font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quality and Impact */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-primary" />
                      <span>Qualidade das consultas</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-primary-50 rounded-lg">
                        <Star className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-gray-900">4.7</div>
                        <div className="text-sm text-gray-600">
                          Média geral das avaliações após interações
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-primary" />
                      <span>Impacto na segurança</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-primary-50 rounded-lg">
                        <Users className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-gray-900">131</div>
                        <div className="text-sm text-gray-600">
                          Estimativa do número de incidentes de segurança evitados devido às recomendações e suporte do Safeboy.
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
