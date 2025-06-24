
export interface WhatsAppMessage {
  id?: string;
  connection_id: string;
  user_id?: string;
  message_id: string;
  from_number: string;
  to_number: string;
  message_type: 'text' | 'image' | 'audio' | 'video' | 'document';
  content?: string;
  media_url?: string;
  media_mimetype?: string;
  timestamp: string;
  is_from_me: boolean;
  status?: 'received' | 'sent' | 'delivered' | 'read' | 'failed';
  metadata?: any;
  created_at?: string;
  updated_at?: string;
}

export interface WhatsAppConversation {
  id?: string;
  connection_id: string;
  user_id?: string;
  participant_number: string;
  participant_name?: string;
  last_message_at?: string;
  unread_count?: number;
  is_archived?: boolean;
  metadata?: any;
  created_at?: string;
  updated_at?: string;
}
