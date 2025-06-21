
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, Paperclip, Send, Lightbulb, FileText, Volume2 } from "lucide-react";

const quickQuestions = [
  "Tire minhas dúvidas sobre uma norma",
  "Analise um documento e me dê uma resposta", 
  "Escute minhas dúvidas e me oriente"
];

const frequentQuestions = [
  {
    category: "Consultoria de Normas e Regulamentações",
    questions: [
      "Quais são as exigências da NR-35 para trabalhos em altura?",
      "Como identificar os riscos mais comuns em um ambiente de construção civil?"
    ]
  },
  {
    category: "Avaliação e Mitigação de Riscos", 
    questions: [
      "Quais medidas preventivas adotar para evitar acidentes com máquinas pesadas?",
      "Quais são as melhores práticas para a avaliação de riscos ergonômicos?"
    ]
  }
];

export default function Chat() {
  const [message, setMessage] = useState("");

  return (
    <div className="flex-1 flex flex-col h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-4xl mx-auto w-full">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Olá, Maria!</h1>
          <p className="text-lg text-gray-600">Como eu poderia te ajudar hoje?</p>
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 w-full max-w-3xl">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <Lightbulb className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm text-gray-700">{quickQuestions[0]}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm text-gray-700">{quickQuestions[1]}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <Volume2 className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm text-gray-700">{quickQuestions[2]}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Frequent Questions */}
        <div className="w-full max-w-4xl mb-8">
          <h2 className="text-xl font-semibold mb-6 text-center text-gray-800">
            Ou experimente sanar as dúvidas mais frequentes:
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {frequentQuestions.map((category, index) => (
              <div key={index}>
                <h3 className="font-semibold text-gray-800 mb-4">{category.category}</h3>
                <div className="space-y-3">
                  {category.questions.map((question, qIndex) => (
                    <div key={qIndex} className="flex items-start space-x-3">
                      <div className="p-1 bg-primary-50 rounded">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      </div>
                      <p className="text-sm text-gray-700 cursor-pointer hover:text-primary transition-colors">
                        {question}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* More Questions Link */}
        <Button variant="link" className="text-primary hover:text-primary-700 mb-8">
          Ver mais perguntas →
        </Button>
      </div>

      {/* Message Input */}
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
                className="pr-12 border-gray-300 focus:border-primary"
              />
              <Button 
                size="icon"
                className="absolute right-1 top-1 h-8 w-8 bg-primary hover:bg-primary-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
