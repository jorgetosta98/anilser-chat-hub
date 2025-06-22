
import type { SupabaseClient, User } from 'https://esm.sh/@supabase/supabase-js@2';
import { EvolutionApiService } from '../evolution-api.ts';
import { corsHeaders } from '../cors.ts';
import type { ConnectionData } from '../types.ts';

export async function handleCheckStatus(
  connectionData: ConnectionData,
  supabaseClient: SupabaseClient,
  user: User,
  evolutionApi: EvolutionApiService
) {
  const { instanceId } = connectionData;
  
  if (!instanceId) {
    throw new Error('Instance ID is required');
  }
  
  const statusResult = await evolutionApi.checkConnectionStatus(instanceId);
  
  // Update database status
  const updateData = {
    status: statusResult.isConnected ? 'connected' : 'disconnected',
    ...(statusResult.isConnected && { 
      connected_at: new Date().toISOString(),
      phone: statusResult.phone || '' 
    })
  };

  await supabaseClient
    .from('whatsapp_connections')
    .update(updateData)
    .eq('instance_id', instanceId)
    .eq('user_id', user.id);

  return new Response(
    JSON.stringify({ 
      success: true, 
      connected: statusResult.isConnected,
      status: statusResult.status,
      phone: statusResult.phone 
    }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
}
