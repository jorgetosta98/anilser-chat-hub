
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ReportsData {
  totalTimeSaved: number;
  totalInteractions: number;
  averageRating: number;
  tagUsageStats: Array<{ name: string; count: number }>;
  userDistribution: Array<{ user: string; percentage: number }>;
}

export function useReportsData() {
  const [data, setData] = useState<ReportsData>({
    totalTimeSaved: 0,
    totalInteractions: 0,
    averageRating: 0,
    tagUsageStats: [],
    userDistribution: []
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
        .select("id, used_tags, conversation_id")
        .eq("is_user", true);

      if (messagesError) throw messagesError;

      // Buscar avaliações médias
      const { data: ratings, error: ratingsError } = await supabase
        .from("conversation_ratings")
        .select("rating")
        .eq("user_id", user.id);

      if (ratingsError) throw ratingsError;

      // Buscar informações dos usuários para distribuição
      const { data: profiles, error: profilesError } = await supabase
        .from("conversations")
        .select(`
          user_id,
          profiles:user_id (full_name)
        `);

      if (profilesError) throw profilesError;

      // Calcular estatísticas
      const totalInteractions = messages?.length || 0;
      const averageRating = ratings && ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : 0;

      // Calcular tempo poupado (estimativa baseada no número de interações)
      const estimatedTimeSavedPerInteraction = 0.5; // 30 minutos por consulta
      const totalTimeSaved = totalInteractions * estimatedTimeSavedPerInteraction;

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

      // Processar distribuição de usuários
      const userCounts: Record<string, number> = {};
      profiles?.forEach(conv => {
        const userName = conv.profiles?.full_name || 'Usuário Anônimo';
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
        userDistribution
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

  return { data, isLoading, refetch: fetchReportsData };
}
