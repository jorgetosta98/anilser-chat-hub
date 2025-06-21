
import { Card } from "@/components/ui/card";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
}

export function ChatMessage({ message, isUser, timestamp }: ChatMessageProps) {
  return (
    <div className={`mb-6 ${isUser ? 'flex justify-end' : 'flex justify-start'}`}>
      <div className={`max-w-[80%] ${isUser ? 'mr-4' : 'ml-4'}`}>
        <Card className={`p-4 ${isUser ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
          {isUser && (
            <div className="text-sm font-medium text-green-700 mb-2">Você:</div>
          )}
          <div className={`text-sm ${isUser ? 'text-green-800' : 'text-gray-800'} whitespace-pre-wrap leading-relaxed`}>
            {message}
          </div>
          {timestamp && (
            <div className="text-xs text-gray-500 mt-3 text-right">{timestamp}</div>
          )}
        </Card>
      </div>
    </div>
  );
}
