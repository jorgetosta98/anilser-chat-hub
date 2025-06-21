
import { useState } from 'react';

export type KnowledgeBaseType = 'normal' | 'whatsapp';

export interface KnowledgeBase {
  id: KnowledgeBaseType;
  name: string;
  description: string;
}

export const KNOWLEDGE_BASES: KnowledgeBase[] = [
  {
    id: 'normal',
    name: 'Base de Conhecimento Normal',
    description: 'Documentos e informações gerais sobre segurança do trabalho'
  },
  {
    id: 'whatsapp',
    name: 'Base WhatsApp',
    description: 'Conversas e histórico do WhatsApp'
  }
];

export function useKnowledgeBase() {
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState<KnowledgeBaseType>('normal');

  const getSelectedKnowledgeBase = () => {
    return KNOWLEDGE_BASES.find(kb => kb.id === selectedKnowledgeBase) || KNOWLEDGE_BASES[0];
  };

  return {
    selectedKnowledgeBase,
    setSelectedKnowledgeBase,
    getSelectedKnowledgeBase,
    knowledgeBases: KNOWLEDGE_BASES
  };
}
