
import { Card } from "@/components/ui/card";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
}

export function ChatMessage({ message, isUser, timestamp }: ChatMessageProps) {
  return (
    <div className={`mb-4 ${isUser ? 'ml-8' : 'mr-8'}`}>
      <Card className={`p-4 ${isUser ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
        {isUser && (
          <div className="text-sm font-medium text-green-700 mb-2">Você:</div>
        )}
        <div className={`text-sm ${isUser ? 'text-green-800' : 'text-gray-800'} whitespace-pre-wrap`}>
          {message}
        </div>
        {timestamp && (
          <div className="text-xs text-gray-500 mt-2">{timestamp}</div>
        )}
      </Card>
    </div>
  );
}
