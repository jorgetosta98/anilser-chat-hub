
export interface ChatbotInstruction {
  id?: string;
  persona_name: string;
  persona_description: string;
  instructions: string;
  additional_context: string;
  is_active: boolean;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}
