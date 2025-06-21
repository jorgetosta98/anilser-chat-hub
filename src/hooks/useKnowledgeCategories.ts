
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color: string;
}

export function useKnowledgeCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const { toast } = useToast();

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('knowledge_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
      return data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as categorias.",
        variant: "destructive",
      });
      return [];
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    fetchCategories,
  };
}
