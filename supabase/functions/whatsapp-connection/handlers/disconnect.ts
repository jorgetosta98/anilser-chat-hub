
import type { SupabaseClient, User } from 'https://esm.sh/@supabase/supabase-js@2';
import { EvolutionApiService } from '../evolution-api.ts';
import { corsHeaders } from '../cors.ts';
import type { ConnectionData } from '../types.ts';

export async function handleDisconnect(
  connectionData: ConnectionData,
  supabaseClient: SupabaseClient,
  user: User,
  evolutionApi: EvolutionApiService
) {
  const { instanceId } = connectionData;
  
  if (!instanceId) {
    throw new Error('Instance ID is required');
  }
  
  // Disconnect from Evolution API
  await evolutionApi.disconnectInstance(instanceId);

  // Update database
  await supabaseClient
    .from('whatsapp_connections')
    .update({ 
      status: 'disconnected',
      qr_code: null 
    })
    .eq('instance_id', instanceId)
    .eq('user_id', user.id);

  return new Response(
    JSON.stringify({ success: true }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
}
