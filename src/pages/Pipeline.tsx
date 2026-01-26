import { useEffect, useState, useCallback } from 'react';
import { Plus, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { KanbanBoard, PipelineColumn, STAGE_COLORS } from '../components/pipeline';
import { crmApi, PipelineData, Deal } from '../lib/api';
import { formatCurrency } from '../lib/utils';

// Map API response to component format
function mapPipelineData(data: PipelineData): PipelineColumn[] {
  return data.columns.map((col) => ({
    stage: col.stage,
    label: col.stage_label,
    deals: col.deals.map((d) => ({
      ...d,
      montant: d.montant ? Number(d.montant) : undefined,
    })),
    totalValue: Number(col.total_value) || 0,
    weightedValue: Number(col.weighted_value) || 0,
    color: STAGE_COLORS[col.stage] || '#6B7280',
  }));
}

export function PipelinePage() {
  const [columns, setColumns] = useState<PipelineColumn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totals, setTotals] = useState({ deals: 0, value: 0, weighted: 0 });
  const [includeClosed, setIncludeClosed] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Load pipeline data
  const loadPipeline = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await crmApi.getPipeline(includeClosed);

      const mappedColumns = mapPipelineData(data);
      setColumns(mappedColumns);
      setTotals({
        deals: data.total_deals,
        value: Number(data.total_value) || 0,
        weighted: Number(data.total_weighted) || 0,
      });
    } catch (err) {
      setError('Impossible de charger le pipeline. Verifiez que le service CRM est demarre.');
      // Fallback to mock data for development
      loadMockData();
    } finally {
      setLoading(false);
    }
  }, [includeClosed]);

  // Mock data fallback for development
  const loadMockData = () => {
    const mockDeals: Deal[] = [
      { id: '1', reference: 'DEAL-2026-0001', stage: 'nouveau_lead', montant: 25000, probabilite: 10, next_step: 'Appeler le client', created_at: '2026-01-10T10:00:00Z' },
      { id: '2', reference: 'DEAL-2026-0002', stage: 'nouveau_lead', montant: 18500, probabilite: 10, next_step: 'Qualifier le besoin', created_at: '2026-01-09T14:30:00Z' },
      { id: '3', reference: 'DEAL-2026-0003', stage: 'contact_initial', montant: 32000, probabilite: 20, next_step: 'Envoyer documentation', created_at: '2026-01-08T09:15:00Z' },
      { id: '4', reference: 'DEAL-2026-0004', stage: 'qualification', montant: 28500, probabilite: 30, next_step: 'Programmer visite', created_at: '2026-01-07T16:45:00Z' },
      { id: '5', reference: 'DEAL-2026-0005', stage: 'visite', montant: 22000, probabilite: 50, next_step: 'Préparer offre', date_closing_prevue: '2026-01-20', created_at: '2026-01-05T11:00:00Z' },
      { id: '6', reference: 'DEAL-2026-0006', stage: 'offre', montant: 35000, probabilite: 60, next_step: 'Relancer pour réponse', date_closing_prevue: '2026-01-18', created_at: '2026-01-03T10:30:00Z' },
      { id: '7', reference: 'DEAL-2026-0007', stage: 'negociation', montant: 28000, probabilite: 75, next_step: 'Finaliser conditions', date_closing_prevue: '2026-01-15', created_at: '2026-01-01T14:00:00Z' },
      { id: '8', reference: 'DEAL-2026-0008', stage: 'closing', montant: 42000, probabilite: 90, next_step: 'Signature contrat', date_closing_prevue: '2026-01-12', created_at: '2025-12-28T09:00:00Z' },
    ];

    const stages = [
      { stage: 'nouveau_lead', label: 'Nouveau' },
      { stage: 'contact_initial', label: 'Contacté' },
      { stage: 'qualification', label: 'Qualifié' },
      { stage: 'visite', label: 'Visite' },
      { stage: 'offre', label: 'Offre' },
      { stage: 'negociation', label: 'Négociation' },
      { stage: 'closing', label: 'Closing' },
    ];

    const pipelineColumns: PipelineColumn[] = stages.map((stage) => {
      const stageDeals = mockDeals.filter((d) => d.stage === stage.stage);
      const totalValue = stageDeals.reduce((sum, d) => sum + (d.montant || 0), 0);
      const weightedValue = stageDeals.reduce(
        (sum, d) => sum + (d.montant || 0) * (d.probabilite / 100),
        0
      );

      return {
        stage: stage.stage,
        label: stage.label,
        deals: stageDeals,
        totalValue,
        weightedValue,
        color: STAGE_COLORS[stage.stage] || '#6B7280',
      };
    });

    setColumns(pipelineColumns);

    const totalDeals = mockDeals.length;
    const totalValue = mockDeals.reduce((sum, d) => sum + (d.montant || 0), 0);
    const weightedValue = mockDeals.reduce(
      (sum, d) => sum + (d.montant || 0) * (d.probabilite / 100),
      0
    );

    setTotals({ deals: totalDeals, value: totalValue, weighted: weightedValue });
  };

  useEffect(() => {
    loadPipeline();
  }, [loadPipeline]);

  // Handle deal move with optimistic update
  const handleDealMove = useCallback(
    async (dealId: string, fromStage: string, toStage: string) => {
      // Store previous state for rollback
      const previousColumns = [...columns];

      // Optimistic update - move deal immediately
      setColumns((prev) => {
        const newColumns = prev.map((col) => ({
          ...col,
          deals: [...col.deals],
        }));

        // Find and remove deal from source column
        const sourceColumn = newColumns.find((c) => c.stage === fromStage);
        const targetColumn = newColumns.find((c) => c.stage === toStage);

        if (!sourceColumn || !targetColumn) return prev;

        const dealIndex = sourceColumn.deals.findIndex((d) => d.id === dealId);
        if (dealIndex === -1) return prev;

        const [deal] = sourceColumn.deals.splice(dealIndex, 1);

        // Update deal stage and probability
        const stageProbabilities: Record<string, number> = {
          nouveau_lead: 10,
          contact_initial: 20,
          qualification: 30,
          visite: 50,
          offre: 60,
          negociation: 75,
          closing: 90,
          gagne: 100,
          perdu: 0,
        };

        deal.stage = toStage;
        deal.probabilite = stageProbabilities[toStage] || 10;

        // Add to target column
        targetColumn.deals.unshift(deal);

        // Recalculate totals
        newColumns.forEach((col) => {
          col.totalValue = col.deals.reduce((sum, d) => sum + (d.montant || 0), 0);
          col.weightedValue = col.deals.reduce(
            (sum, d) => sum + (d.montant || 0) * (d.probabilite / 100),
            0
          );
        });

        return newColumns;
      });

      // API call
      try {
        setIsUpdating(true);
        await crmApi.updateDealStage(dealId, { stage: toStage });
      } catch (err) {
        // Rollback on error
        setColumns(previousColumns);
        setError('Erreur lors du deplacement. Reessayez.');
        setTimeout(() => setError(null), 3000);
      } finally {
        setIsUpdating(false);
      }
    },
    [columns]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <span className="text-muted-foreground">Chargement du pipeline...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Pipeline</h1>
          <p className="text-muted-foreground">
            Gérez vos opportunités de vente en glissant-déposant les deals
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIncludeClosed(!includeClosed)}
            className={includeClosed ? 'bg-primary/10' : ''}
          >
            {includeClosed ? (
              <>
                <CheckCircle className="h-4 w-4 mr-1" />
                Avec clôturés
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 mr-1" />
                Sans clôturés
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={loadPipeline} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Nouveau deal
          </Button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-destructive hover:text-destructive/80"
          >
            ×
          </button>
        </div>
      )}

      {/* Summary stats */}
      <div className="flex flex-wrap items-center gap-6 text-sm bg-card border border-border rounded-lg p-4">
        <div>
          <span className="text-muted-foreground">Deals actifs:</span>{' '}
          <span className="font-semibold">{totals.deals}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Valeur totale:</span>{' '}
          <span className="font-semibold">{formatCurrency(totals.value)}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Pondéré:</span>{' '}
          <span className="font-semibold text-primary">
            {formatCurrency(totals.weighted)}
          </span>
        </div>
        {isUpdating && (
          <div className="ml-auto flex items-center gap-2 text-muted-foreground">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
            <span>Sauvegarde...</span>
          </div>
        )}
      </div>

      {/* Kanban Board */}
      <KanbanBoard columns={columns} onDealMove={handleDealMove} />

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span>Probabilité:</span>
        <div className="flex items-center gap-1">
          <Badge variant="outline" className="border-muted-foreground/50 text-xs">
            &lt;50%
          </Badge>
          <span>Froid</span>
        </div>
        <div className="flex items-center gap-1">
          <Badge variant="outline" className="border-yellow-500/50 text-yellow-600 text-xs">
            50-74%
          </Badge>
          <span>Tiède</span>
        </div>
        <div className="flex items-center gap-1">
          <Badge variant="outline" className="border-green-500/50 text-green-600 text-xs">
            &gt;=75%
          </Badge>
          <span>Chaud</span>
        </div>
      </div>
    </div>
  );
}
