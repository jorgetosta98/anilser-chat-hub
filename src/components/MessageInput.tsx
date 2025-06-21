
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, Paperclip, Send, ArrowUp } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isViewingChat?: boolean;
}

export function MessageInput({ onSendMessage, isViewingChat = false }: MessageInputProps) {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="border-t bg-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="text-primary">
            <Paperclip className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-primary">
            <Mic className="w-5 h-5" />
          </Button>
          <div className="flex-1 relative">
            <Input
              placeholder="Digite sua mensagem ou comando"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-12 border-gray-300 focus:border-primary"
            />
            <Button 
              size="icon"
              onClick={handleSendMessage}
              className="absolute right-1 top-1 h-8 w-8 bg-primary hover:bg-primary-700"
            >
              {isViewingChat ? <ArrowUp className="w-4 h-4" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
