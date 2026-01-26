import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Euro, Calendar, GripVertical, User, Car } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { cn, formatCurrency } from '../../lib/utils';
import type { Deal } from '../../lib/api';

interface DealCardProps {
  deal: Deal;
  isDragging?: boolean;
}

export function DealCard({ deal, isDragging }: DealCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: deal.id,
    data: {
      type: 'deal',
      deal,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const dragging = isDragging || isSortableDragging;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'bg-card border border-border rounded-lg p-3 cursor-grab active:cursor-grabbing',
        'hover:shadow-md hover:border-primary/30 transition-all duration-200',
        'group touch-none',
        dragging && 'opacity-50 shadow-lg scale-105 rotate-2 z-50'
      )}
      {...attributes}
      {...listeners}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-mono text-muted-foreground">
          {deal.reference}
        </span>
        <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      <div className="space-y-2">
        {/* Amount */}
        {deal.montant && (
          <div className="flex items-center gap-2">
            <Euro className="h-4 w-4 text-green-500" />
            <span className="font-semibold text-foreground">
              {formatCurrency(deal.montant)}
            </span>
          </div>
        )}

        {/* Client/Prospect info */}
        {(deal.client_id || deal.prospect_id) && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-3.5 w-3.5" />
            <span className="truncate">
              {deal.client_id ? 'Client' : 'Prospect'}
            </span>
          </div>
        )}

        {/* Vehicle info */}
        {deal.vehicle_id && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Car className="h-3.5 w-3.5" />
            <span className="truncate">Véhicule associé</span>
          </div>
        )}

        {/* Next step */}
        {deal.next_step && (
          <p className="text-sm text-muted-foreground line-clamp-2 border-l-2 border-primary/30 pl-2">
            {deal.next_step}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <Badge
            variant="outline"
            className={cn(
              'text-xs',
              deal.probabilite >= 75 && 'border-green-500/50 text-green-600',
              deal.probabilite >= 50 && deal.probabilite < 75 && 'border-yellow-500/50 text-yellow-600',
              deal.probabilite < 50 && 'border-muted-foreground/50'
            )}
          >
            {deal.probabilite}%
          </Badge>
          {deal.date_closing_prevue && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {new Date(deal.date_closing_prevue).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'short',
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Overlay version for drag preview
export function DealCardOverlay({ deal }: { deal: Deal }) {
  return (
    <div className="bg-card border-2 border-primary rounded-lg p-3 shadow-2xl rotate-3 scale-105">
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-mono text-muted-foreground">
          {deal.reference}
        </span>
      </div>
      <div className="space-y-2">
        {deal.montant && (
          <div className="flex items-center gap-2">
            <Euro className="h-4 w-4 text-green-500" />
            <span className="font-semibold">{formatCurrency(deal.montant)}</span>
          </div>
        )}
        {deal.next_step && (
          <p className="text-sm text-muted-foreground line-clamp-1">
            {deal.next_step}
          </p>
        )}
      </div>
    </div>
  );
}
