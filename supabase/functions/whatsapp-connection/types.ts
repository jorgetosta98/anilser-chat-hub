
export interface ConnectionData {
  name?: string;
  phone?: string;
  instanceId?: string;
}

export interface WebhookPayload {
  event: string;
  connection_name: string;
  phone_number: string;
  instance_id: string;
  user_id: string;
  timestamp: string;
}

export interface EvolutionApiConfig {
  apiKey: string;
  baseUrl: string;
}
