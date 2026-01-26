import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, UserCheck, Flame } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { formatCurrency, formatDate, getScoreBgColor, getStatusColor, getStatusLabel } from '../lib/utils';

export function ProspectDetailPage() {
  const { id } = useParams();

  // Mock data
  const prospect = {
    id,
    prenom: 'Jean',
    nom: 'Dupont',
    email: 'jean.dupont@email.com',
    telephone: '06 12 34 56 78',
    source: 'leboncoin',
    statut: 'qualifie',
    score: 85,
    budget_min: 20000,
    budget_max: 25000,
    financement: true,
    reprise: false,
    created_at: '2024-06-08T10:00:00Z',
    notes: 'Recherche SUV compact, préférence pour marques françaises.',
  };

  const scoreDetails = {
    source: 12,
    profile: 18,
    budget: 15,
    engagement: 25,
    timing: 15,
  };

  const suggestedActions = [
    { priority: 'urgent', action: 'Contacter immédiatement', reason: 'Lead chaud - risque de perte' },
    { priority: 'high', action: 'Proposer un rendez-vous', reason: 'Prospect qualifié prêt pour visite' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/prospects">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">
              {prospect.prenom} {prospect.nom}
            </h1>
            {prospect.score >= 70 && <Flame className="h-6 w-6 text-red-500" />}
          </div>
          <p className="text-muted-foreground">
            Prospect depuis {formatDate(prospect.created_at)}
          </p>
        </div>
        <Button>
          <UserCheck className="h-4 w-4 mr-2" />
          Convertir en client
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Card */}
        <Card>
          <CardHeader>
            <CardTitle>Score Lead</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className={`inline-flex items-center justify-center h-24 w-24 rounded-full ${getScoreBgColor(prospect.score)}`}>
                <span className="text-3xl font-bold">{prospect.score}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Lead {prospect.score >= 70 ? 'Chaud' : prospect.score >= 40 ? 'Tiède' : 'Froid'}
              </p>
            </div>

            <div className="space-y-3">
              {Object.entries(scoreDetails).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{key}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-accent rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${(value / 25) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-6">{value}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Informations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Statut</span>
              <Badge className={getStatusColor(prospect.statut)}>
                {getStatusLabel(prospect.statut)}
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{prospect.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{prospect.telephone}</span>
            </div>

            <hr />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Source</p>
                <Badge variant="outline" className="mt-1">{prospect.source}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Budget</p>
                <p className="font-semibold">
                  {formatCurrency(prospect.budget_min)} - {formatCurrency(prospect.budget_max)}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              {prospect.financement && <Badge variant="secondary">Financement</Badge>}
              {prospect.reprise && <Badge variant="secondary">Reprise</Badge>}
            </div>

            {prospect.notes && (
              <>
                <hr />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm">{prospect.notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Actions suggérées */}
        <Card>
          <CardHeader>
            <CardTitle>Actions suggérées</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {suggestedActions.map((action, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  action.priority === 'urgent'
                    ? 'border-red-200 bg-red-50'
                    : 'border-orange-200 bg-orange-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Badge
                    variant={action.priority === 'urgent' ? 'destructive' : 'warning'}
                  >
                    {action.priority}
                  </Badge>
                </div>
                <p className="font-medium text-sm">{action.action}</p>
                <p className="text-xs text-muted-foreground mt-1">{action.reason}</p>
              </div>
            ))}

            <div className="pt-4 space-y-2">
              <Button className="w-full">
                <Phone className="h-4 w-4 mr-2" />
                Appeler
              </Button>
              <Button variant="outline" className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                Envoyer un email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
