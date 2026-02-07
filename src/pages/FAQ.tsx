import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, Car, CreditCard, Users, Image, FileText, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  items: FAQItem[];
}

const faqData: FAQCategory[] = [
  {
    id: 'general',
    label: 'Général',
    icon: HelpCircle,
    items: [
      {
        id: 'g1',
        question: "Qu'est-ce que Keroxio ?",
        answer: "Keroxio est une solution complète de gestion pour les garages automobiles. Elle permet de gérer votre stock de véhicules, vos prospects et clients, de créer des annonces professionnelles automatiquement, et de suivre votre activité commerciale grâce à un pipeline de vente intuitif."
      },
      {
        id: 'g2',
        question: "Comment puis-je commencer à utiliser Keroxio ?",
        answer: "Après votre inscription, vous serez guidé à travers un processus d'onboarding simple. Commencez par ajouter vos premiers véhicules, puis configurez vos paramètres de garage. Notre assistant vous accompagnera à chaque étape."
      },
      {
        id: 'g3',
        question: "Keroxio est-il disponible sur mobile ?",
        answer: "Oui ! Keroxio dispose d'une application mobile complète disponible sur iOS et Android. Vous pouvez gérer votre garage, prendre des photos de véhicules, scanner des cartes grises et suivre vos prospects directement depuis votre smartphone."
      },
      {
        id: 'g4',
        question: "Mes données sont-elles sécurisées ?",
        answer: "Absolument. Nous utilisons un chiffrement de bout en bout pour toutes vos données. Nos serveurs sont hébergés en Europe et respectent le RGPD. Nous effectuons des sauvegardes quotidiennes et des audits de sécurité réguliers."
      },
    ]
  },
  {
    id: 'vehicles',
    label: 'Véhicules',
    icon: Car,
    items: [
      {
        id: 'v1',
        question: "Comment ajouter un véhicule à mon stock ?",
        answer: "Vous pouvez ajouter un véhicule de plusieurs façons : en scannant la carte grise avec l'app mobile (reconnaissance automatique), en entrant manuellement l'immatriculation pour récupérer les informations SIV, ou en remplissant le formulaire complet manuellement."
      },
      {
        id: 'v2',
        question: "Comment fonctionne l'estimation de prix ?",
        answer: "Notre système utilise l'API Autobiz pour estimer la valeur de vos véhicules. L'estimation se base sur la marque, le modèle, l'année, le kilométrage et l'état général. Vous obtenez un prix minimum, moyen et maximum pour vous aider à fixer votre prix de vente."
      },
      {
        id: 'v3',
        question: "Comment améliorer mes photos de véhicules ?",
        answer: "Utilisez notre studio photo intégré ! Il optimise automatiquement vos photos : correction de la luminosité, suppression de l'arrière-plan, ajout de votre logo. Vous pouvez aussi utiliser notre IA pour générer des photos de qualité professionnelle."
      },
      {
        id: 'v4',
        question: "Puis-je importer mes véhicules depuis un fichier ?",
        answer: "Oui, vous pouvez importer vos véhicules via un fichier CSV ou Excel. Rendez-vous dans Paramètres > Import/Export pour télécharger notre modèle et importer vos données."
      },
    ]
  },
  {
    id: 'annonces',
    label: 'Annonces',
    icon: FileText,
    items: [
      {
        id: 'a1',
        question: "Comment générer une annonce automatiquement ?",
        answer: "Une fois votre véhicule ajouté avec ses photos, cliquez sur 'Générer l'annonce'. Notre IA (GPT-4) crée automatiquement un texte de vente attractif et professionnel basé sur les caractéristiques du véhicule."
      },
      {
        id: 'a2',
        question: "Puis-je personnaliser les annonces générées ?",
        answer: "Bien sûr ! Après la génération, vous pouvez modifier le texte, ajuster le ton, ajouter des informations spécifiques ou régénérer l'annonce avec des instructions différentes. Vous gardez le contrôle total."
      },
      {
        id: 'a3',
        question: "Sur quelles plateformes puis-je publier mes annonces ?",
        answer: "Keroxio vous permet d'exporter vos annonces pour les publier sur LeBonCoin, La Centrale, Autoscout24 et d'autres plateformes. Le multi-diffusion automatique sera disponible prochainement."
      },
    ]
  },
  {
    id: 'crm',
    label: 'CRM & Prospects',
    icon: Users,
    items: [
      {
        id: 'c1',
        question: "Comment fonctionne le scoring des leads ?",
        answer: "Chaque prospect reçoit un score de 0 à 100 basé sur son comportement : ouverture d'emails, visites de fiches véhicules, interactions. Un score > 70 est 'Chaud', 40-70 'Tiède', < 40 'Froid'. Cela vous aide à prioriser vos relances."
      },
      {
        id: 'c2',
        question: "Comment créer des rappels pour mes prospects ?",
        answer: "Dans la fiche d'un prospect ou depuis le pipeline, cliquez sur 'Ajouter un rappel'. Choisissez la date, l'heure et le type (appel, email, visite). Vous recevrez une notification au moment voulu."
      },
      {
        id: 'c3',
        question: "Comment fonctionne le pipeline de vente ?",
        answer: "Le pipeline visualise vos opportunités en colonnes : Nouveau, Contacté, Visite, Négociation, Gagné/Perdu. Glissez-déposez les deals entre les colonnes pour suivre leur progression. Chaque colonne affiche le montant total potentiel."
      },
      {
        id: 'c4',
        question: "Puis-je convertir un prospect en client ?",
        answer: "Oui ! Quand un prospect achète un véhicule, marquez le deal comme 'Gagné'. Le prospect sera automatiquement converti en client avec tout son historique conservé."
      },
    ]
  },
  {
    id: 'photos',
    label: 'Photos & Studio',
    icon: Image,
    items: [
      {
        id: 'p1',
        question: "Comment utiliser le studio photo ?",
        answer: "Accédez au studio depuis l'app mobile ou le dashboard. Prenez vos photos, puis utilisez nos outils : suppression d'arrière-plan, correction automatique, ajout de logo, et génération IA pour des rendus professionnels."
      },
      {
        id: 'p2',
        question: "Combien de photos puis-je traiter par mois ?",
        answer: "Cela dépend de votre abonnement. Le plan Starter inclut 50 photos/mois, le plan Pro 200 photos/mois, et le plan Business offre des photos illimitées. Consultez votre consommation dans Paramètres > Abonnement."
      },
      {
        id: 'p3',
        question: "Puis-je personnaliser mon logo sur les photos ?",
        answer: "Oui, uploadez votre logo dans Paramètres > Garage. Il sera automatiquement ajouté sur vos photos traitées. Vous pouvez choisir sa position et sa taille."
      },
    ]
  },
  {
    id: 'billing',
    label: 'Facturation',
    icon: CreditCard,
    items: [
      {
        id: 'b1',
        question: "Comment créer une facture ?",
        answer: "Allez dans Factures > Nouvelle facture. Sélectionnez le client, ajoutez les lignes (véhicule, services, frais), et validez. Le PDF est généré automatiquement avec vos informations légales."
      },
      {
        id: 'b2',
        question: "Puis-je personnaliser mes factures ?",
        answer: "Oui, dans Paramètres > Facturation, vous pouvez ajouter votre logo, configurer vos mentions légales, numéro de TVA, conditions de paiement et pied de page personnalisé."
      },
      {
        id: 'b3',
        question: "Comment changer d'abonnement ?",
        answer: "Rendez-vous dans Paramètres > Abonnement. Vous pouvez upgrader instantanément ou demander un downgrade effectif à la fin de votre période de facturation en cours."
      },
      {
        id: 'b4',
        question: "Quels moyens de paiement acceptez-vous ?",
        answer: "Nous acceptons les cartes bancaires (Visa, Mastercard, Amex) et le prélèvement SEPA. Tous les paiements sont sécurisés via Stripe."
      },
    ]
  },
  {
    id: 'security',
    label: 'Sécurité & Compte',
    icon: Shield,
    items: [
      {
        id: 's1',
        question: "Comment changer mon mot de passe ?",
        answer: "Allez dans Paramètres > Sécurité. Entrez votre mot de passe actuel puis votre nouveau mot de passe. Un email de confirmation vous sera envoyé."
      },
      {
        id: 's2',
        question: "Comment supprimer mon compte ?",
        answer: "Contactez notre support à support@keroxio.com avec votre demande de suppression. Conformément au RGPD, toutes vos données seront supprimées sous 30 jours."
      },
      {
        id: 's3',
        question: "Puis-je exporter toutes mes données ?",
        answer: "Oui, dans Paramètres > Export, vous pouvez télécharger une archive complète de vos données : véhicules, clients, factures, historique. Le fichier est généré sous 24h."
      },
    ]
  },
];

export function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('general');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleItem = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const filteredCategories = searchQuery
    ? faqData.map((category) => ({
        ...category,
        items: category.items.filter(
          (item) =>
            item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter((category) => category.items.length > 0)
    : faqData;

  const currentCategory = searchQuery
    ? filteredCategories
    : filteredCategories.filter((c) => c.id === activeCategory);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">FAQ</h1>
        <p className="text-white/40">
          Questions fréquemment posées sur Keroxio
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 z-10" />
        <Input
          placeholder="Rechercher dans la FAQ..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Categories sidebar */}
        {!searchQuery && (
          <div className="lg:w-56 flex-shrink-0">
            <nav className="flex lg:flex-col gap-1 glass-card p-2">
              {faqData.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-2xl text-sm transition-all text-left ${
                    activeCategory === category.id
                      ? 'glass-btn-primary text-white'
                      : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                  }`}
                >
                  <category.icon className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium">{category.label}</span>
                  <span className="ml-auto text-xs opacity-50">
                    {category.items.length}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 space-y-4">
          {currentCategory.map((category) => (
            <div key={category.id}>
              {searchQuery && (
                <div className="flex items-center gap-2 mb-3">
                  <category.icon className="h-5 w-5 text-ios-blue" />
                  <h2 className="font-semibold text-lg text-white">{category.label}</h2>
                </div>
              )}

              <Card>
                <CardHeader className={searchQuery ? 'hidden' : ''}>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <category.icon className="h-5 w-5 text-ios-blue" />
                    {category.label}
                  </CardTitle>
                  <CardDescription>
                    {category.items.length} question{category.items.length > 1 ? 's' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent className={searchQuery ? 'pt-4' : ''}>
                  <div className="space-y-2">
                    {category.items.map((item) => (
                      <div
                        key={item.id}
                        className="border border-white/8 rounded-2xl overflow-hidden"
                      >
                        <button
                          onClick={() => toggleItem(item.id)}
                          className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-white/5 transition-colors"
                        >
                          <span className="font-medium text-sm pr-4 text-white">
                            {item.question}
                          </span>
                          {expandedItems.includes(item.id) ? (
                            <ChevronUp className="h-4 w-4 flex-shrink-0 text-white/30" />
                          ) : (
                            <ChevronDown className="h-4 w-4 flex-shrink-0 text-white/30" />
                          )}
                        </button>
                        {expandedItems.includes(item.id) && (
                          <div className="px-4 pb-4 pt-1 text-sm text-white/50 border-t border-white/5 bg-white/3">
                            {item.answer}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}

          {currentCategory.length === 0 && searchQuery && (
            <Card>
              <CardContent className="py-12 pt-12 text-center">
                <HelpCircle className="h-12 w-12 mx-auto text-white/10 mb-4" />
                <p className="text-lg font-medium text-white">Aucun résultat trouvé</p>
                <p className="text-white/40 mt-1">
                  Essayez avec d'autres mots-clés ou{' '}
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-ios-blue hover:underline"
                  >
                    parcourez les catégories
                  </button>
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Contact support */}
      <Card className="border-ios-blue/20">
        <CardContent className="py-6 pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-white">Vous n'avez pas trouvé votre réponse ?</h3>
              <p className="text-sm text-white/40">
                Notre équipe support est disponible pour vous aider
              </p>
            </div>
            <a
              href="mailto:support@keroxio.com"
              className="glass-btn-primary text-white px-5 py-2.5 rounded-2xl text-sm font-medium inline-flex items-center"
            >
              Contacter le support
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
