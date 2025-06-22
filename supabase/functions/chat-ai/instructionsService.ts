
export async function getActiveInstructions(supabase: any, userId: string) {
  try {
    const { data, error } = await supabase
      .from('chatbot_instructions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('updated_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Erro ao buscar instruções ativas:', error);
      return null;
    }

    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Erro na busca de instruções ativas:', error);
    return null;
  }
}
