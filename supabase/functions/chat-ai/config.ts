
export const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
export const supabaseUrl = Deno.env.get('SUPABASE_URL');
export const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
