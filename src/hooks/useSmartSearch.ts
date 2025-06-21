
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SearchResult {
  id: string;
  title: string;
  content: string;
  summary?: string;
  relevanceScore: number;
  category?: {
    name: string;
    color: string;
  };
  tags: string[];
}

export function useSmartSearch() {
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const performSmartSearch = async (query: string): Promise<SearchResult[]> => {
    if (!query.trim()) return [];
    
    setIsSearching(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('smart-search', {
        body: { query }
      });

      if (error) throw error;

      return data.results || [];
    } catch (error) {
      console.error('Erro na busca inteligente:', error);
      toast({
        title: "Erro na busca",
        description: "Não foi possível realizar a busca inteligente.",
        variant: "destructive",
      });
      
      // Fallback para busca tradicional
      return await performFallbackSearch(query);
    } finally {
      setIsSearching(false);
    }
  };

  const performFallbackSearch = async (query: string): Promise<SearchResult[]> => {
    try {
      const { data, error } = await supabase
        .from('knowledge_documents')
        .select(`
          id,
          title,
          content,
          summary,
          tags,
          category:knowledge_categories(name, color)
        `)
        .or(`title.ilike.%${query}%,content.ilike.%${query}%,summary.ilike.%${query}%`)
        .eq('is_public', true)
        .limit(10);

      if (error) throw error;

      return (data || []).map(doc => ({
        ...doc,
        relevanceScore: calculateBasicRelevance(doc, query)
      }));
    } catch (error) {
      console.error('Erro na busca tradicional:', error);
      return [];
    }
  };

  const calculateBasicRelevance = (doc: any, query: string): number => {
    const queryLower = query.toLowerCase();
    let score = 0;

    if (doc.title.toLowerCase().includes(queryLower)) score += 3;
    if (doc.summary?.toLowerCase().includes(queryLower)) score += 2;
    if (doc.content.toLowerCase().includes(queryLower)) score += 1;
    
    // Bonus para tags que correspondem
    doc.tags.forEach((tag: string) => {
      if (tag.toLowerCase().includes(queryLower)) score += 2;
    });

    return score;
  };

  return {
    performSmartSearch,
    isSearching
  };
}
