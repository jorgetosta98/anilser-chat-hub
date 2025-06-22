
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { authenticateUser } from './auth.ts';
import { handleCorsRequest, corsHeaders } from './cors.ts';
import { EvolutionApiService } from './evolution-api.ts';
import { handleCreateInstance } from './handlers/create-instance.ts';
import { handleGetQRCode } from './handlers/get-qr-code.ts';
import { handleCheckStatus } from './handlers/check-status.ts';
import { handleDisconnect } from './handlers/disconnect.ts';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return handleCorsRequest();
  }

  try {
    // Authenticate user
    const { supabaseClient, user } = await authenticateUser(req);

    const { action, connectionData } = await req.json();
    const evolutionApiKey = Deno.env.get('EVOLUTION_API_KEY');
    const evolutionBaseUrl = Deno.env.get('EVOLUTION_BASE_URL');

    if (!evolutionApiKey || !evolutionBaseUrl) {
      console.error('Missing Evolution API configuration:', { 
        hasApiKey: !!evolutionApiKey, 
        hasBaseUrl: !!evolutionBaseUrl 
      });
      return new Response(
        JSON.stringify({ error: 'Evolution API configuration missing' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Processing WhatsApp connection action:', action);
    console.log('Using Evolution URL:', evolutionBaseUrl);

    const evolutionApi = new EvolutionApiService({
      apiKey: evolutionApiKey,
      baseUrl: evolutionBaseUrl
    });

    switch (action) {
      case 'create_instance':
        return await handleCreateInstance(connectionData, supabaseClient, user, evolutionApi);

      case 'get_qr_code':
        return await handleGetQRCode(connectionData, supabaseClient, user, evolutionApi);

      case 'check_status':
        return await handleCheckStatus(connectionData, supabaseClient, user, evolutionApi);

      case 'disconnect':
        return await handleDisconnect(connectionData, supabaseClient, user, evolutionApi);

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
    }
  } catch (error) {
    console.error('WhatsApp connection error:', error);
    
    if (error.message === 'Unauthorized') {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
