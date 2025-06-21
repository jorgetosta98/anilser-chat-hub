
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ReportsData {
  totalTimeSaved: number;
  totalInteractions: number;
  averageRating: number;
  tagUsageStats: Array<{ name: string; count: number }>;
  userDistribution: Array<{ user: string; percentage: number }>;
  monthlyTimeSaved: Array<{ month: string; documents: number; consulting: number; research: number }>;
}

export function useReportsData() {
  const [data, setData] = useState<ReportsData>({
    totalTimeSaved: 0,
    totalInteractions: 0,
    averageRating: 0,
    tagUsageStats: [],
    userDistribution: [],
    monthlyTimeSaved: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchReportsData();
  }, []);

  const fetchReportsData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Buscar total de interações (mensagens do usuário)
      const { data: messages, error: messagesError } = await supabase
        .from("messages")
        .select("id, used_tags, conversation_id, created_at")
        .eq("is_user", true);

      if (messagesError) throw messagesError;

      // Buscar avaliações médias
      const { data: ratings, error: ratingsError } = await supabase
        .from("conversation_ratings")
        .select("rating")
        .eq("user_id", user.id);

      if (ratingsError) throw ratingsError;

      // Buscar conversas do usuário
      const { data: conversations, error: conversationsError } = await supabase
        .from("conversations")
        .select("id, user_id")
        .eq("user_id", user.id);

      if (conversationsError) throw conversationsError;

      // Buscar perfis de usuários
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name");

      if (profilesError) throw profilesError;

      // Calcular estatísticas
      const totalInteractions = messages?.length || 0;
      const averageRating = ratings && ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : 0;

      // Calcular tempo poupado (estimativa baseada no número de interações)
      const estimatedTimeSavedPerInteraction = 0.5; // 30 minutos por consulta
      const totalTimeSaved = totalInteractions * estimatedTimeSavedPerInteraction;

      // Processar dados mensais para o gráfico
      const monthlyData = generateMonthlyData(messages || []);

      // Processar tags mais utilizadas
      const tagCounts: Record<string, number> = {};
      messages?.forEach(message => {
        if (message.used_tags) {
          message.used_tags.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          });
        }
      });

      const tagUsageStats = Object.entries(tagCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Processar distribuição de usuários baseado nas conversas e perfis
      const userCounts: Record<string, number> = {};
      conversations?.forEach(conv => {
        const profile = profiles?.find(p => p.id === conv.user_id);
        const userName = profile?.full_name || 'Usuário Anônimo';
        userCounts[userName] = (userCounts[userName] || 0) + 1;
      });

      const totalConversations = Object.values(userCounts).reduce((sum, count) => sum + count, 0);
      const userDistribution = Object.entries(userCounts)
        .map(([user, count]) => ({
          user,
          percentage: totalConversations > 0 ? Math.round((count / totalConversations) * 100) : 0
        }))
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 5);

      setData({
        totalTimeSaved,
        totalInteractions,
        averageRating,
        tagUsageStats,
        userDistribution,
        monthlyTimeSaved: monthlyData
      });

    } catch (error) {
      console.error("Erro ao buscar dados dos relatórios:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados dos relatórios.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateMonthlyData = (messages: any[]) => {
    const months = [
      "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
      "Jul", "Ago", "Set", "Out", "Nov", "Dez"
    ];

    // Agrupar mensagens por mês
    const messagesByMonth: Record<string, number> = {};
    
    messages.forEach(message => {
      if (message.created_at) {
        const date = new Date(message.created_at);
        const monthKey = months[date.getMonth()];
        messagesByMonth[monthKey] = (messagesByMonth[monthKey] || 0) + 1;
      }
    });

    // Gerar dados para todos os meses
    return months.map(month => {
      const totalMessages = messagesByMonth[month] || 0;
      
      // Distribuir as mensagens entre as categorias baseado em estimativas
      const documents = Math.round(totalMessages * 0.4); // 40% para documentos
      const consulting = Math.round(totalMessages * 0.3); // 30% para consultoria
      const research = totalMessages - documents - consulting; // Resto para pesquisa
      
      return {
        month,
        documents: Math.max(0, documents),
        consulting: Math.max(0, consulting),
        research: Math.max(0, research)
      };
    });
  };

  return { data, isLoading, refetch: fetchReportsData };
}
