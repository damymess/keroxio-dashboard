import { useState } from 'react';
import { Modal } from './ui/Modal';
import { PDFViewer } from './ui/PDFViewer';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import {
  Download,
  Send,
  Printer,
  FileText,
  User,
  Car,
  Calendar,
  Euro,
  ExternalLink,
  Mail,
  Loader2
} from 'lucide-react';
import { formatCurrency, formatDate, cn } from '../lib/utils';

interface Facture {
  id: string;
  numero: string;
  type: 'devis' | 'facture';
  client_id: string;
  client_name: string;
  client_email?: string;
  statut: 'brouillon' | 'envoye' | 'paye' | 'annule';
  montant_ht: number;
  montant_ttc: number;
  date_emission: string;
  date_echeance?: string;
  date_paiement?: string;
  vehicle_name?: string;
  pdf_url?: string;
}

interface FactureModalProps {
  facture: Facture | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload?: (facture: Facture) => Promise<void>;
  onSend?: (facture: Facture) => Promise<void>;
  onPrint?: (facture: Facture) => void;
  pdfUrl?: string;
}

function getStatusColor(status: Facture['statut']) {
  switch (status) {
    case 'brouillon':
      return 'bg-gray-100 text-gray-800';
    case 'envoye':
      return 'bg-blue-100 text-blue-800';
    case 'paye':
      return 'bg-green-100 text-green-800';
    case 'annule':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function getStatusLabel(status: Facture['statut']) {
  switch (status) {
    case 'brouillon':
      return 'Brouillon';
    case 'envoye':
      return 'Envoyé';
    case 'paye':
      return 'Payé';
    case 'annule':
      return 'Annulé';
    default:
      return status;
  }
}

export function FactureModal({
  facture,
  isOpen,
  onClose,
  onDownload,
  onSend,
  onPrint,
  pdfUrl,
}: FactureModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState('');

  if (!facture) return null;

  const handleDownload = async () => {
    if (!onDownload) return;
    setIsDownloading(true);
    try {
      await onDownload(facture);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSend = async () => {
    if (!onSend) return;
    setIsSending(true);
    try {
      await onSend(facture);
      setShowEmailInput(false);
      setEmail('');
    } finally {
      setIsSending(false);
    }
  };

  const handlePrint = () => {
    if (onPrint) {
      onPrint(facture);
    } else if (pdfUrl) {
      const printWindow = window.open(pdfUrl, '_blank');
      if (printWindow) {
        printWindow.onload = () => printWindow.print();
      }
    }
  };

  const documentTitle = facture.type === 'devis'
    ? `Devis ${facture.numero}`
    : `Facture ${facture.numero}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      showCloseButton={true}
      title={documentTitle}
      description={`Client: ${facture.client_name}`}
    >
      <div className="flex flex-col lg:flex-row">
        {/* Left side - Document info */}
        <div className="lg:w-80 p-6 border-b lg:border-b-0 lg:border-r bg-accent/30">
          {/* Status badge */}
          <div className="mb-4">
            <Badge className={cn('text-sm', getStatusColor(facture.statut))}>
              {getStatusLabel(facture.statut)}
            </Badge>
          </div>

          {/* Document type */}
          <div className="flex items-center gap-2 mb-4">
            <FileText className={cn(
              'h-5 w-5',
              facture.type === 'devis' ? 'text-blue-500' : 'text-green-500'
            )} />
            <span className="font-medium">
              {facture.type === 'devis' ? 'Devis' : 'Facture'}
            </span>
          </div>

          {/* Info list */}
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <User className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">{facture.client_name}</p>
                {facture.client_email && (
                  <p className="text-muted-foreground text-xs">{facture.client_email}</p>
                )}
              </div>
            </div>

            {facture.vehicle_name && (
              <div className="flex items-center gap-3">
                <Car className="h-4 w-4 text-muted-foreground" />
                <span>{facture.vehicle_name}</span>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Émis le {formatDate(facture.date_emission)}</span>
            </div>

            {facture.date_echeance && (
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Échéance: {formatDate(facture.date_echeance)}</span>
              </div>
            )}

            {facture.date_paiement && (
              <div className="flex items-center gap-3 text-green-600">
                <Calendar className="h-4 w-4" />
                <span>Payé le {formatDate(facture.date_paiement)}</span>
              </div>
            )}
          </div>

          {/* Amounts */}
          <div className="mt-6 pt-4 border-t space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Montant HT</span>
              <span>{formatCurrency(facture.montant_ht)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total TTC</span>
              <span className="text-lg">{formatCurrency(facture.montant_ttc)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 pt-4 border-t space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleDownload}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Télécharger PDF
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4 mr-2" />
              Imprimer
            </Button>

            {facture.statut !== 'annule' && (
              <>
                {!showEmailInput ? (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setShowEmailInput(true)}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Envoyer par email
                  </Button>
                ) : (
                  <div className="space-y-2 p-3 bg-accent rounded-lg">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <input
                        type="email"
                        value={email || facture.client_email || ''}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email du destinataire"
                        className="flex-1 bg-background text-sm px-2 py-1 rounded border"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={handleSend}
                        disabled={isSending}
                      >
                        {isSending ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          'Envoyer'
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowEmailInput(false)}
                      >
                        Annuler
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}

            {pdfUrl && (
              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground"
                onClick={() => window.open(pdfUrl, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Ouvrir dans un nouvel onglet
              </Button>
            )}
          </div>
        </div>

        {/* Right side - PDF Preview */}
        <div className="flex-1 min-h-[500px] lg:min-h-[600px]">
          {pdfUrl ? (
            <PDFViewer
              url={pdfUrl}
              title={documentTitle}
              showToolbar={false}
              className="h-full rounded-none border-0"
            />
          ) : (
            <div className="h-full flex items-center justify-center bg-accent/30">
              <div className="text-center p-6">
                <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="font-medium">Aperçu non disponible</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Cliquez sur "Télécharger PDF" pour obtenir le document
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
