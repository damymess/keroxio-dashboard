import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Car,
  Camera,
  FileText,
  Users,
  Kanban,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Rocket
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../stores/authStore';

interface OnboardingStep {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
  gradient: string;
}

const steps: OnboardingStep[] = [
  {
    id: 1,
    title: 'Bienvenue sur Keroxio',
    subtitle: 'Votre assistant garage intelligent',
    description: 'Keroxio vous aide a gerer votre stock de vehicules, vos prospects et vos ventes de maniere simple et efficace.',
    icon: Rocket,
    features: [
      'Gestion complete de votre stock',
      'CRM integre pour vos prospects',
      'Generation automatique d\'annonces',
      'Suivi de votre performance'
    ],
    gradient: 'from-ios-blue to-ios-purple'
  },
  {
    id: 2,
    title: 'Gerez votre stock',
    subtitle: 'Ajoutez et suivez vos vehicules',
    description: 'Ajoutez facilement vos vehicules en scannant la carte grise ou en entrant l\'immatriculation. Toutes les informations sont recuperees automatiquement.',
    icon: Car,
    features: [
      'Scan de carte grise (OCR)',
      'Recuperation automatique SIV',
      'Estimation de prix Autobiz',
      'Historique complet du vehicule'
    ],
    gradient: 'from-ios-green to-ios-teal'
  },
  {
    id: 3,
    title: 'Studio Photo Pro',
    subtitle: 'Des photos qui vendent',
    description: 'Optimisez vos photos en un clic : suppression d\'arriere-plan, correction automatique, ajout de votre logo. Des photos professionnelles sans effort.',
    icon: Camera,
    features: [
      'Suppression d\'arriere-plan IA',
      'Correction automatique',
      'Ajout de logo personnalise',
      'Export optimise pour les annonces'
    ],
    gradient: 'from-ios-purple to-ios-pink'
  },
  {
    id: 4,
    title: 'Annonces automatiques',
    subtitle: 'L\'IA qui redige pour vous',
    description: 'Notre intelligence artificielle genere des annonces attractives et professionnelles en quelques secondes. Vous gardez le controle pour personnaliser.',
    icon: FileText,
    features: [
      'Redaction automatique GPT-4',
      'Ton adapte a votre cible',
      'Multi-plateforme (LBC, Centrale...)',
      'Personnalisation facile'
    ],
    gradient: 'from-ios-orange to-ios-red'
  },
  {
    id: 5,
    title: 'CRM & Pipeline',
    subtitle: 'Ne perdez plus aucun lead',
    description: 'Suivez vos prospects du premier contact jusqu\'a la vente. Le scoring automatique vous indique les leads les plus chauds a contacter en priorite.',
    icon: Users,
    features: [
      'Scoring automatique des leads',
      'Pipeline de vente visuel',
      'Rappels et taches',
      'Historique des interactions'
    ],
    gradient: 'from-ios-pink to-ios-purple'
  },
  {
    id: 6,
    title: 'Tableau de bord',
    subtitle: 'Pilotez votre activite',
    description: 'Visualisez vos performances en temps reel : ventes, leads, stock. Prenez les bonnes decisions grace a des donnees claires et actionnables.',
    icon: BarChart3,
    features: [
      'KPIs en temps reel',
      'Graphiques de performance',
      'Alertes personnalisees',
      'Rapports exportables'
    ],
    gradient: 'from-ios-teal to-ios-blue'
  },
];

export function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { user, completeOnboarding } = useAuthStore();

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      completeOnboarding();
      navigate('/');
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    completeOnboarding();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-liquid flex flex-col">
      {/* Progress bar */}
      <div className="h-1 bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-ios-blue to-ios-purple transition-all duration-500"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 glass-header">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-ios-blue to-ios-purple flex items-center justify-center shadow-[0_2px_12px_rgba(0,122,255,0.3)]">
            <span className="text-white font-bold text-sm">K</span>
          </div>
          <span className="font-semibold text-white">Keroxio</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-white/40">
            Etape {currentStep + 1} sur {steps.length}
          </span>
          <button
            onClick={handleSkip}
            className="text-sm text-white/40 hover:text-white/60 transition-colors"
          >
            Passer l'introduction
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl animate-fade-in" key={currentStep}>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Illustration */}
            <div className="flex flex-col items-center text-center lg:text-left lg:items-start">
              <div className={`bg-gradient-to-br ${step.gradient} p-6 rounded-3xl mb-6 inline-block shadow-[0_8px_32px_rgba(0,122,255,0.2)]`}>
                <step.icon className="h-16 w-16 text-white" />
              </div>

              <div className="flex items-center gap-2 mb-2">
                {steps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentStep
                        ? 'w-8 bg-ios-blue'
                        : index < currentStep
                          ? 'w-2 bg-ios-blue/50'
                          : 'w-2 bg-white/10'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Right: Content */}
            <div>
              <p className="text-sm font-medium text-ios-blue mb-2">
                {step.subtitle}
              </p>
              <h1 className="text-3xl font-bold mb-4 text-white">
                {step.title}
              </h1>
              <p className="text-white/50 mb-6 text-lg">
                {step.description}
              </p>

              {/* Features list */}
              <ul className="space-y-3 mb-8">
                {step.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-ios-green flex-shrink-0" />
                    <span className="text-white/80">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* User greeting on first step */}
              {isFirstStep && user && (
                <div className="glass rounded-2xl p-4 mb-6 border-ios-blue/20">
                  <p className="text-sm text-white/70">
                    <span className="font-semibold text-white">Bonjour {user.username} !</span>
                    {' '}Decouvrez les fonctionnalites de Keroxio en quelques etapes.
                  </p>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={isFirstStep}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Precedent
                </Button>

                <Button
                  onClick={handleNext}
                  className="flex-1 flex items-center justify-center gap-2"
                  size="lg"
                >
                  {isLastStep ? (
                    <>
                      Commencer
                      <Rocket className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Suivant
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer tip */}
      <div className="border-t border-white/5 px-6 py-4">
        <p className="text-center text-sm text-white/30">
          Vous pouvez toujours revoir cette introduction depuis les parametres
        </p>
      </div>
    </div>
  );
}
