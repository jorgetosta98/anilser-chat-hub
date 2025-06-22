
import { openAIApiKey } from './config.ts';

export async function generateOpenAIResponse(messages: any[]): Promise<string> {
  if (!openAIApiKey) {
    throw new Error('OPENAI_API_KEY não configurada');
  }

  console.log('Enviando para OpenAI...');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
