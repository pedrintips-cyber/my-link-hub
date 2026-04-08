import { useState } from "react";
import { usePageView } from "@/hooks/usePageView";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, MessageCircle, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import bannerMentoria from "@/assets/banner-mentoria.webp";

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
  const [step, setStep] = useState(-1); // -1 = banner/intro
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentQ = step >= 0 ? questions[step] : null;
  const isLast = step === questions.length - 1;
  const whatsappUrl = settings?.whatsapp_url || "#";
  const canProceed = currentQ ? answers[currentQ.id]?.trim() : false;

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

  // Banner/Intro screen
  if (step === -1) {
    return (
      <div className="min-h-screen bg-[#050a18] flex flex-col">
        <div className="px-4 pt-4">
          <Link to="/" className="inline-flex items-center text-blue-300/70 hover:text-blue-200 text-sm transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
          </Link>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
          <div className="w-full max-w-md">
            <img
              src={bannerMentoria}
              alt="Mentoria Individual 1:1"
              className="w-full rounded-2xl shadow-2xl shadow-blue-500/10 mb-8"
            />

            <div className="text-center space-y-4">
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Acompanhamento{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  Individual 1:1
                </span>
              </h1>
              <p className="text-blue-200/60 text-sm sm:text-base leading-relaxed">
                Responda algumas perguntas rápidas para que eu conheça seu perfil e te direcione da melhor forma.
              </p>

              <Button
                onClick={() => setStep(0)}
                className="w-full py-6 text-base font-bold bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-blue-500/40 hover:scale-[1.02]"
              >
                Começar Quiz <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050a18] flex flex-col">
      <div className="flex-1 w-full max-w-lg mx-auto px-4 py-6 pb-24 flex flex-col">
        {/* Header */}
        <button
          onClick={() => setStep(step > 0 ? step - 1 : -1)}
          className="inline-flex items-center text-blue-300/70 hover:text-blue-200 text-sm transition-colors mb-6 self-start"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
        </button>

        <div className="text-center mb-6">
          <h1 className="text-xl sm:text-2xl font-black text-white mb-1">
            Mentoria{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Individual
            </span>
          </h1>
          <p className="text-blue-200/50 text-xs sm:text-sm">
            Pergunta {step + 1} de {questions.length}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-blue-950/50 rounded-full h-2 mb-8 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-600 to-cyan-400 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((step + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                i < step
                  ? "bg-blue-600 text-white"
                  : i === step
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white scale-110 shadow-lg shadow-blue-500/30"
                  : "bg-blue-950/50 text-blue-400/40 border border-blue-800/30"
              }`}
            >
              {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
            </div>
          ))}
        </div>

        {/* Question Card */}
        <div className="flex-1">
          <div className="bg-blue-950/30 border border-blue-800/20 rounded-2xl p-5 sm:p-6 shadow-xl shadow-blue-900/10">
            <p className="text-base sm:text-lg font-semibold text-white mb-5">
              {currentQ!.question}
            </p>

            {currentQ!.type === "radio" && currentQ!.options && (
              <RadioGroup
                value={answers[currentQ!.id] || ""}
                onValueChange={(val) => setAnswers({ ...answers, [currentQ!.id]: val })}
                className="space-y-3"
              >
                {currentQ!.options.map((opt, i) => (
                  <div
                    key={i}
                    className={`flex items-center space-x-3 p-3.5 sm:p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                      answers[currentQ!.id] === opt
                        ? "bg-blue-600/20 border-blue-500/50 shadow-md shadow-blue-500/10"
                        : "bg-blue-950/40 border-blue-800/20 hover:border-blue-700/40 hover:bg-blue-900/30"
                    }`}
                  >
                    <RadioGroupItem
                      value={opt}
                      id={`${currentQ!.id}-${i}`}
                      className="border-blue-500 text-blue-400"
                    />
                    <Label
                      htmlFor={`${currentQ!.id}-${i}`}
                      className="text-sm sm:text-base cursor-pointer flex-1 text-blue-100/90 leading-snug"
                    >
                      {opt}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {currentQ!.type === "input" && (
              <Input
                value={answers[currentQ!.id] || ""}
                onChange={(e) => setAnswers({ ...answers, [currentQ!.id]: e.target.value })}
                placeholder={currentQ!.placeholder}
                className="mt-2 bg-blue-950/50 border-blue-800/30 text-white placeholder:text-blue-400/40 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl py-6 text-base"
              />
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-6 space-y-3">
          {!isLast ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed}
              className="w-full py-6 text-base font-bold bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-blue-500/40 disabled:opacity-40 disabled:shadow-none"
            >
              Próxima <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleFinish}
              disabled={!canProceed}
              className="w-full py-6 text-base font-bold bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white rounded-xl shadow-lg shadow-green-500/25 transition-all duration-300 hover:shadow-green-500/40 disabled:opacity-40 disabled:shadow-none"
            >
              <MessageCircle className="w-5 h-5 mr-2" /> Falar no WhatsApp
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Mentoria;
