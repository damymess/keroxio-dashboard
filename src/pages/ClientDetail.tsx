import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { formatCurrency, formatDate } from '../lib/utils';

export function ClientDetailPage() {
  const { id } = useParams();

  // Mock client data
  const client = {
    id,
    type: 'particulier',
    civilite: 'M.',
    prenom: 'Jean',
    nom: 'Dupont',
    email: 'jean.dupont@email.com',
    telephone: '06 12 34 56 78',
    telephone_mobile: '06 12 34 56 78',
    adresse: '12 rue des Lilas',
    code_postal: '75001',
    ville: 'Paris',
    segment: 'premium',
    source: 'leboncoin',
    nb_achats: 2,
    lifetime_value: 45000,
    created_at: '2024-01-15T10:00:00Z',
    notes: 'Client fidèle, préfère les véhicules allemands. Budget confortable.',
  };

  const interactions = [
    { id: '1', type: 'appel_sortant', sujet: 'Relance pour essai Peugeot 3008', date: '2024-06-10T14:30:00Z', duree: 5 },
    { id: '2', type: 'email_sortant', sujet: 'Envoi documentation 3008 GT + financement', date: '2024-06-08T10:00:00Z' },
    { id: '3', type: 'visite_showroom', sujet: 'Premier contact. Intéressé par SUV compact.', date: '2024-06-05T15:30:00Z' },
  ];

  const vehicles = [
    { id: '1', marque: 'Peugeot', modele: '208', annee: 2022, prix: 18500, date_achat: '2024-03-15' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/clients">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">
            {client.civilite} {client.prenom} {client.nom}
          </h1>
          <p className="text-muted-foreground">Client depuis {formatDate(client.created_at)}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
          <Button variant="destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Informations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{client.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{client.telephone}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{client.adresse}, {client.code_postal} {client.ville}</span>
            </div>

            <hr className="my-4" />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Segment</p>
                <Badge className="mt-1 bg-blue-100 text-blue-700">
                  {client.segment.toUpperCase()}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Source</p>
                <Badge variant="outline" className="mt-1">{client.source}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Achats</p>
                <p className="font-semibold">{client.nb_achats}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">LTV</p>
                <p className="font-semibold">{formatCurrency(client.lifetime_value)}</p>
              </div>
            </div>

            {client.notes && (
              <>
                <hr className="my-4" />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm">{client.notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Historique</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {interactions.map((interaction, index) => (
                <div key={interaction.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                    {index < interactions.length - 1 && (
                      <div className="w-0.5 h-full bg-border mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{interaction.type.replace('_', ' ')}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(interaction.date)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm">{interaction.sujet}</p>
                    {interaction.duree && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Durée: {interaction.duree} min
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Vehicles */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Véhicules achetés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-accent/50"
                >
                  <div>
                    <p className="font-medium">
                      {vehicle.marque} {vehicle.modele}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {vehicle.annee} • Acheté le {formatDate(vehicle.date_achat)}
                    </p>
                  </div>
                  <p className="font-semibold">{formatCurrency(vehicle.prix)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
