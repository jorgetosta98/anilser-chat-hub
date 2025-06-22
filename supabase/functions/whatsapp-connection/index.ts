
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
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the current user
    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const { action, connectionData } = await req.json()
    const evolutionApiKey = Deno.env.get('EVOLUTION_API_KEY')
    const evolutionBaseUrl = Deno.env.get('EVOLUTION_BASE_URL')

    if (!evolutionApiKey || !evolutionBaseUrl) {
      return new Response(
        JSON.stringify({ error: 'Evolution API configuration missing' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Processing WhatsApp connection action:', action)

    switch (action) {
      case 'create_instance': {
        const { name } = connectionData
        const instanceId = `safeboy_${user.id}_${Date.now()}`
        
        console.log('Creating Evolution instance:', instanceId)
        
        // Create instance in Evolution API
        const createResponse = await fetch(`${evolutionBaseUrl}/instance/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': evolutionApiKey,
          },
          body: JSON.stringify({
            instanceName: instanceId,
            token: evolutionApiKey,
            qrcode: true,
            chatwoot_account_id: null,
            chatwoot_token: null,
            chatwoot_url: null,
            webhook_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/whatsapp-webhook`,
            webhook_by_events: false,
            events: ["APPLICATION_STARTUP", "QRCODE_UPDATED", "CONNECTION_UPDATE", "MESSAGES_UPSERT"]
          })
        })

        if (!createResponse.ok) {
          const errorText = await createResponse.text()
          console.error('Failed to create Evolution instance:', errorText)
          return new Response(
            JSON.stringify({ error: 'Failed to create WhatsApp instance', details: errorText }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        const createResult = await createResponse.json()
        console.log('Evolution instance created successfully:', createResult)

        // Store connection in database
        const { data: connection, error } = await supabaseClient
          .from('whatsapp_connections')
          .insert({
            user_id: user.id,
            name,
            phone: '', // Será preenchido após conexão
            instance_id: instanceId,
            status: 'created',
            webhook_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/whatsapp-webhook`
          })
          .select()
          .single()

        if (error) {
          console.error('Database error:', error)
          return new Response(
            JSON.stringify({ error: 'Failed to save connection' }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        return new Response(
          JSON.stringify({ 
            success: true, 
            connection,
            instanceId 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      case 'get_qr_code': {
        const { instanceId } = connectionData
        
        console.log('Getting QR code for instance:', instanceId)
        
        // Get QR code from Evolution API
        const qrResponse = await fetch(`${evolutionBaseUrl}/instance/connect/${instanceId}`, {
          method: 'GET',
          headers: {
            'apikey': evolutionApiKey,
          }
        })

        if (!qrResponse.ok) {
          const errorText = await qrResponse.text()
          console.error('Failed to get QR code:', errorText)
          return new Response(
            JSON.stringify({ error: 'Failed to get QR code', details: errorText }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        const qrData = await qrResponse.json()
        console.log('QR code response:', qrData)
        
        const qrCode = qrData.code || qrData.qrcode || qrData.base64
        
        if (qrCode) {
          // Update connection with QR code
          await supabaseClient
            .from('whatsapp_connections')
            .update({ 
              qr_code: qrCode,
              status: 'qr_generated'
            })
            .eq('instance_id', instanceId)
            .eq('user_id', user.id)

          return new Response(
            JSON.stringify({ 
              success: true, 
              qrCode: qrCode 
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        } else {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: 'QR code not available yet' 
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }
      }

      case 'check_status': {
        const { instanceId } = connectionData
        
        console.log('Checking status for instance:', instanceId)
        
        // Check connection status
        const statusResponse = await fetch(`${evolutionBaseUrl}/instance/connectionState/${instanceId}`, {
          method: 'GET',
          headers: {
            'apikey': evolutionApiKey,
          }
        })

        if (!statusResponse.ok) {
          const errorText = await statusResponse.text()
          console.error('Failed to check status:', errorText)
          return new Response(
            JSON.stringify({ error: 'Failed to check status' }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        const statusData = await statusResponse.json()
        console.log('Status response:', statusData)
        
        const isConnected = statusData.instance?.state === 'open'
        
        // Update database status
        const updateData = {
          status: isConnected ? 'connected' : 'disconnected',
          ...(isConnected && { 
            connected_at: new Date().toISOString(),
            phone: statusData.instance?.owner || '' 
          })
        }

        await supabaseClient
          .from('whatsapp_connections')
          .update(updateData)
          .eq('instance_id', instanceId)
          .eq('user_id', user.id)

        return new Response(
          JSON.stringify({ 
            success: true, 
            connected: isConnected,
            status: statusData.instance?.state,
            phone: statusData.instance?.owner 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      case 'disconnect': {
        const { instanceId } = connectionData
        
        console.log('Disconnecting instance:', instanceId)
        
        // Disconnect from Evolution API
        await fetch(`${evolutionBaseUrl}/instance/logout/${instanceId}`, {
          method: 'DELETE',
          headers: {
            'apikey': evolutionApiKey,
          }
        })

        // Update database
        await supabaseClient
          .from('whatsapp_connections')
          .update({ 
            status: 'disconnected',
            qr_code: null 
          })
          .eq('instance_id', instanceId)
          .eq('user_id', user.id)

        return new Response(
          JSON.stringify({ success: true }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
    }
  } catch (error) {
    console.error('WhatsApp connection error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
