import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { DealCard } from './DealCard';
import { cn, formatCurrency } from '../../lib/utils';
import type { Deal } from '../../lib/api';

export interface PipelineColumn {
  stage: string;
  label: string;
  deals: Deal[];
  totalValue: number;
  weightedValue: number;
  color: string;
}

interface KanbanColumnProps {
  column: PipelineColumn;
  isOver?: boolean;
}

// Stage colors
export const STAGE_COLORS: Record<string, string> = {
  nouveau_lead: '#6366F1',    // Indigo
  contact_initial: '#8B5CF6', // Violet
  qualification: '#EC4899',   // Pink
  visite: '#F59E0B',         // Amber
  offre: '#10B981',          // Emerald
  negociation: '#14B8A6',    // Teal
  closing: '#06B6D4',        // Cyan
  gagne: '#22C55E',          // Green
  perdu: '#EF4444',          // Red
};

export function KanbanColumn({ column, isOver }: KanbanColumnProps) {
  const { setNodeRef, isOver: isDroppableOver } = useDroppable({
    id: column.stage,
    data: {
      type: 'column',
      stage: column.stage,
    },
  });

  const dealIds = column.deals.map((deal) => deal.id);
  const showDropIndicator = isOver || isDroppableOver;

  return (
    <div className="flex-shrink-0 w-72">
      <Card
        className={cn(
          'h-full transition-all duration-200',
          showDropIndicator && 'ring-2 ring-primary ring-offset-2 bg-primary/5'
        )}
      >
        {/* Header */}
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: STAGE_COLORS[column.stage] || '#6B7280' }}
              />
              <CardTitle className="text-sm font-medium">
                {column.label}
              </CardTitle>
            </div>
            <Badge variant="secondary" className="font-mono">
              {column.deals.length}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Total: {formatCurrency(column.totalValue)}</span>
            <span className="text-primary font-medium">
              ~{formatCurrency(column.weightedValue)}
            </span>
          </div>
        </CardHeader>

        {/* Deals list */}
        <CardContent
          className={cn(
            'scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent',
            showDropIndicator && 'bg-primary/5'
          )}
        >
          <div
            ref={setNodeRef}
            className="space-y-3 min-h-[200px] max-h-[calc(100vh-320px)] overflow-y-auto"
          >
            <SortableContext items={dealIds} strategy={verticalListSortingStrategy}>
              {column.deals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </SortableContext>

            {/* Empty state */}
            {column.deals.length === 0 && (
              <div
                className={cn(
                  'py-8 text-center text-muted-foreground text-sm border-2 border-dashed rounded-lg',
                  showDropIndicator ? 'border-primary bg-primary/10' : 'border-border'
                )}
              >
                {showDropIndicator ? (
                  <span className="text-primary font-medium">Déposer ici</span>
                ) : (
                  'Aucun deal'
                )}
              </div>
            )}

            {/* Drop indicator at bottom */}
            {showDropIndicator && column.deals.length > 0 && (
              <div className="h-16 border-2 border-dashed border-primary rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-sm text-primary font-medium">Déposer ici</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
