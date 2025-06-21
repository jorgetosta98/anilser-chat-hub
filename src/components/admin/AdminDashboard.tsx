
import { Users, MessageSquare, Activity, TrendingUp, DollarSign, CreditCard } from "lucide-react";
import { StatCard } from "./dashboard/StatCard";
import { UserGrowthChart } from "./dashboard/UserGrowthChart";
import { ActivityChart } from "./dashboard/ActivityChart";
import { FinancialChart } from "./dashboard/FinancialChart";
import { PlanRevenueChart } from "./dashboard/PlanRevenueChart";
import { SystemStatus } from "./dashboard/SystemStatus";

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Estatísticas principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <StatCard
          title="Total de Usuários"
          value="1,234"
          description="+12% em relação ao mês passado"
          icon={Users}
        />
        <StatCard
          title="Conversas Hoje"
          value="89"
          description="+3% em relação a ontem"
          icon={MessageSquare}
        />
        <StatCard
          title="Usuários Ativos"
          value="156"
          description="Últimas 24 horas"
          icon={Activity}
        />
        <StatCard
          title="Taxa de Crescimento"
          value="+15.2%"
          description="Crescimento mensal"
          icon={TrendingUp}
        />
        <StatCard
          title="Receita Mensal"
          value="R$ 31.2k"
          description="+23% em relação ao mês passado"
          icon={DollarSign}
        />
        <StatCard
          title="Assinaturas Ativas"
          value="847"
          description="+8% este mês"
          icon={CreditCard}
        />
      </div>

      {/* Gráficos - primeira linha */}
      <div className="grid gap-4 md:grid-cols-2">
        <UserGrowthChart />
        <ActivityChart />
      </div>

      {/* Gráficos financeiros - segunda linha */}
      <div className="grid gap-4 md:grid-cols-2">
        <FinancialChart />
        <PlanRevenueChart />
      </div>

      {/* Informações do sistema */}
      <SystemStatus />
    </div>
  );
}
