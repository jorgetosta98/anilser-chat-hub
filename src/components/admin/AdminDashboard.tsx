
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, Activity, TrendingUp, DollarSign, CreditCard } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from "recharts";

// Mock data - em um app real viria de uma API
const statsData = [
  { name: "Jan", usuarios: 12, conversas: 45 },
  { name: "Fev", usuarios: 19, conversas: 62 },
  { name: "Mar", usuarios: 25, conversas: 78 },
  { name: "Abr", usuarios: 32, conversas: 95 },
  { name: "Mai", usuarios: 41, conversas: 123 },
  { name: "Jun", usuarios: 38, conversas: 156 }
];

const activityData = [
  { time: "00:00", atividade: 12 },
  { time: "04:00", atividade: 8 },
  { time: "08:00", atividade: 45 },
  { time: "12:00", atividade: 78 },
  { time: "16:00", atividade: 65 },
  { time: "20:00", atividade: 34 }
];

// Novos dados financeiros
const revenueData = [
  { name: "Jan", receita: 12400, despesas: 8200, lucro: 4200 },
  { name: "Fev", receita: 15600, despesas: 9100, lucro: 6500 },
  { name: "Mar", receita: 18900, despesas: 10500, lucro: 8400 },
  { name: "Abr", receita: 22300, despesas: 11800, lucro: 10500 },
  { name: "Mai", receita: 28700, despesas: 13200, lucro: 15500 },
  { name: "Jun", receita: 31200, despesas: 14100, lucro: 17100 }
];

const planRevenueData = [
  { name: "Plano Básico", value: 35, receita: 15400, color: "#0088FE" },
  { name: "Plano Pro", value: 45, receita: 22800, color: "#00C49F" },
  { name: "Plano Premium", value: 20, receita: 12600, color: "#FFBB28" }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Estatísticas principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +12% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversas Hoje</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              +3% em relação a ontem
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              Últimas 24 horas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Crescimento</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+15.2%</div>
            <p className="text-xs text-muted-foreground">
              Crescimento mensal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 31.2k</div>
            <p className="text-xs text-muted-foreground">
              +23% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assinaturas Ativas</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">847</div>
            <p className="text-xs text-muted-foreground">
              +8% este mês
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos - primeira linha */}
      <div className="grid gap-4 md:grid-cols-2">
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
      </div>

      {/* Gráficos financeiros - segunda linha */}
      <div className="grid gap-4 md:grid-cols-2">
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
      </div>

      {/* Informações do sistema */}
      <Card>
        <CardHeader>
          <CardTitle>Status do Sistema</CardTitle>
          <CardDescription>Informações em tempo real</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Sistema Online</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Base de Dados OK</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm">API com Latência</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
