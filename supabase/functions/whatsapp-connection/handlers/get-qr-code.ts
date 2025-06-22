
import type { SupabaseClient, User } from 'https://esm.sh/@supabase/supabase-js@2';
import { EvolutionApiService } from '../evolution-api.ts';
import { corsHeaders } from '../cors.ts';
import type { ConnectionData } from '../types.ts';

export async function handleGetQRCode(
  connectionData: ConnectionData,
  supabaseClient: SupabaseClient,
  user: User,
  evolutionApi: EvolutionApiService
) {
  const { instanceId } = connectionData;
  
  if (!instanceId) {
    throw new Error('Instance ID is required');
  }
  
  const qrCode = await evolutionApi.getQRCode(instanceId);
  
  if (qrCode) {
    // Update connection with QR code
    await supabaseClient
      .from('whatsapp_connections')
      .update({ 
        qr_code: qrCode,
        status: 'qr_generated'
      })
      .eq('instance_id', instanceId)
      .eq('user_id', user.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        qrCode: qrCode 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } else {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'QR code not available yet' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}
