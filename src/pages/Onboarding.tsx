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
  color: string;
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
    color: 'bg-blue-500'
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
    color: 'bg-green-500'
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
    color: 'bg-purple-500'
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
    color: 'bg-orange-500'
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
    color: 'bg-pink-500'
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
    color: 'bg-cyan-500'
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress bar */}
      <div className="h-1 bg-accent">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm">K</span>
          </div>
          <span className="font-semibold">Keroxio</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Etape {currentStep + 1} sur {steps.length}
          </span>
          <button
            onClick={handleSkip}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Passer l'introduction
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Illustration */}
            <div className="flex flex-col items-center text-center lg:text-left lg:items-start">
              <div className={`${step.color} p-6 rounded-2xl mb-6 inline-block`}>
                <step.icon className="h-16 w-16 text-white" />
              </div>

              <div className="flex items-center gap-2 mb-2">
                {steps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentStep
                        ? 'w-8 bg-primary'
                        : index < currentStep
                          ? 'w-2 bg-primary/50'
                          : 'w-2 bg-accent'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Right: Content */}
            <div>
              <p className="text-sm font-medium text-primary mb-2">
                {step.subtitle}
              </p>
              <h1 className="text-3xl font-bold mb-4">
                {step.title}
              </h1>
              <p className="text-muted-foreground mb-6 text-lg">
                {step.description}
              </p>

              {/* Features list */}
              <ul className="space-y-3 mb-8">
                {step.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* User greeting on first step */}
              {isFirstStep && user && (
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
                  <p className="text-sm">
                    <span className="font-semibold">Bonjour {user.username} !</span>
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
      <div className="border-t border-border px-6 py-4">
        <p className="text-center text-sm text-muted-foreground">
          Vous pouvez toujours revoir cette introduction depuis les parametres
        </p>
      </div>
    </div>
  );
}
