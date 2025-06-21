
import { Button } from "@/components/ui/button";

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

export function FrequentQuestions() {
  return (
    <>
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

      <Button variant="link" className="text-primary hover:text-primary-700 mb-8">
        Ver mais perguntas →
      </Button>
    </>
  );
}
