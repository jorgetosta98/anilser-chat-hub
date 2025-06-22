
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const webhookData = await req.json()
    console.log('WhatsApp webhook received:', JSON.stringify(webhookData, null, 2))

    const { event, instance, data } = webhookData

    switch (event) {
      case 'qrcode.updated':
        // Update QR code in database
        await supabaseClient
          .from('whatsapp_connections')
          .update({ 
            qr_code: data.qrcode,
            status: 'qr_updated'
          })
          .eq('instance_id', instance)
        break

      case 'connection.update':
        const isConnected = data.state === 'open'
        const updateData = {
          status: isConnected ? 'connected' : 'disconnected',
          last_seen: new Date().toISOString(),
          ...(isConnected && { connected_at: new Date().toISOString() })
        }

        await supabaseClient
          .from('whatsapp_connections')
          .update(updateData)
          .eq('instance_id', instance)
        break

      case 'messages.upsert':
        // Handle incoming messages if needed
        console.log('New message received:', data)
        break

      default:
        console.log('Unhandled webhook event:', event)
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
