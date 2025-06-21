
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, FileText, Volume2 } from "lucide-react";

const quickQuestions = [
  "Tire minhas dúvidas sobre uma norma",
  "Analise um documento e me dê uma resposta", 
  "Escute minhas dúvidas e me oriente"
];

export function QuickActionCards() {
  return (
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
            <p className="text-sm text-gray-707">{quickQuestions[2]}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
