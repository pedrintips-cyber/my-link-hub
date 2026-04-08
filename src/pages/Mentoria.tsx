import { useState } from "react";
import { usePageView } from "@/hooks/usePageView";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface Question {
  id: string;
  question: string;
  type: "radio" | "input";
  options?: string[];
  placeholder?: string;
}

const questions: Question[] = [
  {
    id: "experience",
    question: "Qual o seu nível de experiência?",
    type: "radio",
    options: [
      "Sou completamente novo no mercado digital",
      "Já vi vídeos e estudei, mas nunca rodei nada",
      "Já tentei rodar alguma oferta, mas não deu certo",
      "Já rodei e tive algum resultado",
    ],
  },
  {
    id: "budget",
    question: "Quanto de caixa você tem para investir em anúncio e estrutura?",
    type: "input",
    placeholder: "Ex: R$ 500, R$ 2.000, R$ 10.000...",
  },
  {
    id: "structure",
    question: "Você já tem alguma base de estrutura?",
    type: "radio",
    options: [
      "Não tenho nada ainda",
      "Sei fazer X1 (venda 1 a 1)",
      "Sei aquecer chip de WhatsApp",
      "Já tenho estrutura montada (página, criativos, etc)",
      "Tenho conhecimento avançado de tráfego e estrutura",
    ],
  },
  {
    id: "community",
    question: "Você já faz parte de alguma comunidade VIP?",
    type: "radio",
    options: [
      "Nunca comprei nenhuma comunidade",
      "Já comprei, mas não tive resultado",
      "Faço parte de uma comunidade atualmente",
    ],
  },
  {
    id: "mentoring",
    question: "Você já comprou alguma mentoria antes?",
    type: "radio",
    options: [
      "Nunca comprei mentoria",
      "Já comprei, mas não aproveitei",
      "Já tive mentoria e sei como funciona",
    ],
  },
];

const Mentoria = () => {
  usePageView("/mentoria");
  const { data: settings } = useSiteSettings();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentQ = questions[step];
  const isLast = step === questions.length - 1;
  const whatsappUrl = settings?.whatsapp_url || "#";

  const canProceed = answers[currentQ?.id]?.trim();

  const handleNext = () => {
    if (isLast) return;
    setStep(step + 1);
  };

  const buildWhatsAppMessage = () => {
    let msg = "Olá! Acabei de preencher o quiz da mentoria. Aqui estão minhas respostas:\n\n";
    questions.forEach((q) => {
      msg += `*${q.question}*\n${answers[q.id] || "Não respondido"}\n\n`;
    });
    return encodeURIComponent(msg);
  };

  const handleFinish = () => {
    const base = whatsappUrl.includes("wa.me") ? whatsappUrl : "https://wa.me/";
    const url = `${base}${base.includes("?") ? "&" : "?"}text=${buildWhatsAppMessage()}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 py-6 pb-16">
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
        </Link>

        <div className="text-center mb-8 animate-fade-up">
          <h1 className="text-2xl font-black gold-text mb-2">Mentoria Individual</h1>
          <p className="text-muted-foreground text-sm">
            Responda algumas perguntas para que eu entenda seu perfil
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-secondary rounded-full h-1.5 mb-8">
          <div
            className="gold-gradient h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${((step + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question */}
        <Card className="animate-fade-up">
          <CardContent className="p-6">
            <p className="text-sm font-semibold text-foreground mb-4">
              {step + 1}. {currentQ.question}
            </p>

            {currentQ.type === "radio" && currentQ.options && (
              <RadioGroup
                value={answers[currentQ.id] || ""}
                onValueChange={(val) => setAnswers({ ...answers, [currentQ.id]: val })}
                className="space-y-3"
              >
                {currentQ.options.map((opt, i) => (
                  <div key={i} className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/50 border border-border hover:border-primary/30 transition-colors">
                    <RadioGroupItem value={opt} id={`${currentQ.id}-${i}`} />
                    <Label htmlFor={`${currentQ.id}-${i}`} className="text-sm cursor-pointer flex-1">{opt}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {currentQ.type === "input" && (
              <Input
                value={answers[currentQ.id] || ""}
                onChange={(e) => setAnswers({ ...answers, [currentQ.id]: e.target.value })}
                placeholder={currentQ.placeholder}
                className="mt-2"
              />
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex gap-3 mt-6">
          {step > 0 && (
            <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
              <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
            </Button>
          )}
          {!isLast ? (
            <Button onClick={handleNext} disabled={!canProceed} className="flex-1">
              Próxima <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleFinish}
              disabled={!canProceed}
              className="flex-1 gold-gradient text-primary-foreground hover:opacity-90"
            >
              <MessageCircle className="w-4 h-4 mr-1" /> Falar no WhatsApp
            </Button>
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Pergunta {step + 1} de {questions.length}
        </p>
      </div>
    </div>
  );
};

export default Mentoria;
