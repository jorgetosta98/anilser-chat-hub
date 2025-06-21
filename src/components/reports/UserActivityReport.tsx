
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, Target, Award } from "lucide-react";

interface ActivityData {
  period: string;
  interactions: number;
  timeSaved: number;
  accuracy: number;
}

const userActivityData: ActivityData[] = [
  { period: "Esta semana", interactions: 23, timeSaved: 12, accuracy: 94 },
  { period: "Semana passada", interactions: 18, timeSaved: 9, accuracy: 91 },
  { period: "Há 2 semanas", interactions: 31, timeSaved: 18, accuracy: 96 },
  { period: "Há 3 semanas", interactions: 27, timeSaved: 15, accuracy: 93 },
];

const achievements = [
  { title: "Consultor Expert", description: "100+ consultas realizadas", unlocked: true },
  { title: "Economia de Tempo", description: "50+ horas poupadas", unlocked: true },
  { title: "Precisão Master", description: "95%+ de precisão", unlocked: false },
  { title: "Usuário Ativo", description: "30 dias consecutivos", unlocked: true },
];

export function UserActivityReport() {
  const totalInteractions = userActivityData.reduce((sum, item) => sum + item.interactions, 0);
  const totalTimeSaved = userActivityData.reduce((sum, item) => sum + item.timeSaved, 0);
  const avgAccuracy = userActivityData.reduce((sum, item) => sum + item.accuracy, 0) / userActivityData.length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total de Interações</p>
                <p className="text-2xl font-bold text-gray-900">{totalInteractions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Horas Poupadas</p>
                <p className="text-2xl font-bold text-gray-900">{totalTimeSaved}h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Precisão Média</p>
                <p className="text-2xl font-bold text-gray-900">{avgAccuracy.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Atividade Semanal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userActivityData.map((week, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{week.period}</span>
                    <span className="text-sm text-gray-600">{week.interactions} interações</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{week.timeSaved}h poupadas</span>
                    <span>{week.accuracy}% precisão</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="w-5 h-5" />
            <span>Conquistas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <div key={index} className={`p-4 rounded-lg border ${achievement.unlocked ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{achievement.title}</h4>
                  <Badge variant={achievement.unlocked ? "default" : "secondary"}>
                    {achievement.unlocked ? "Desbloqueado" : "Bloqueado"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{achievement.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
