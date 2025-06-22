
import type { SupabaseClient, User } from 'https://esm.sh/@supabase/supabase-js@2';
import { EvolutionApiService } from '../evolution-api.ts';
import { sendWebhookNotification } from '../webhook.ts';
import { corsHeaders } from '../cors.ts';
import type { ConnectionData } from '../types.ts';

export async function handleCreateInstance(
  connectionData: ConnectionData,
  supabaseClient: SupabaseClient,
  user: User,
  evolutionApi: EvolutionApiService
) {
  const { name, phone } = connectionData;
  const instanceId = `safeboy_${user.id}_${Date.now()}`;
  
  console.log('Creating Evolution instance:', instanceId);
  console.log('Connection name:', name);
  console.log('Phone number:', phone);
  
  // Create instance in Evolution API
  await evolutionApi.createInstance(instanceId);

  // Store connection in database
  const { data: connection, error } = await supabaseClient
    .from('whatsapp_connections')
    .insert({
      user_id: user.id,
      name,
      phone: phone || '',
      instance_id: instanceId,
      status: 'created'
    })
    .select()
    .single();

  if (error) {
    console.error('Database error:', error);
    throw new Error('Failed to save connection');
  }

  // Send webhook notification
  await sendWebhookNotification({
    event: 'whatsapp_connection_created',
    connection_name: name || '',
    phone_number: phone || '',
    instance_id: instanceId,
    user_id: user.id,
    timestamp: new Date().toISOString()
  });

  return new Response(
    JSON.stringify({ 
      success: true, 
      connection,
      instanceId 
    }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}
