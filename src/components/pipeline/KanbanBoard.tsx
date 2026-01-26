import { useState, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { KanbanColumn, PipelineColumn } from './KanbanColumn';
import { DealCardOverlay } from './DealCard';
import type { Deal } from '../../lib/api';

interface KanbanBoardProps {
  columns: PipelineColumn[];
  onDealMove: (dealId: string, fromStage: string, toStage: string) => Promise<void>;
}

export function KanbanBoard({ columns, onDealMove }: KanbanBoardProps) {
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);
  const [overColumn, setOverColumn] = useState<string | null>(null);

  // Configure sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Find deal by ID across all columns
  const findDeal = useCallback(
    (id: string): Deal | undefined => {
      for (const column of columns) {
        const deal = column.deals.find((d) => d.id === id);
        if (deal) return deal;
      }
      return undefined;
    },
    [columns]
  );

  // Find which column a deal belongs to
  const findColumnByDealId = useCallback(
    (dealId: string): string | undefined => {
      for (const column of columns) {
        if (column.deals.some((d) => d.id === dealId)) {
          return column.stage;
        }
      }
      return undefined;
    },
    [columns]
  );

  // Handle drag start
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      const deal = findDeal(active.id as string);
      setActiveDeal(deal || null);
    },
    [findDeal]
  );

  // Handle drag over (for visual feedback)
  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { over } = event;

    if (over) {
      // Check if over a column directly
      if (over.data.current?.type === 'column') {
        setOverColumn(over.id as string);
      }
      // Check if over another deal (use that deal's column)
      else if (over.data.current?.type === 'deal') {
        const deal = over.data.current.deal as Deal;
        const column = columns.find((c) =>
          c.deals.some((d) => d.id === deal.id)
        );
        if (column) {
          setOverColumn(column.stage);
        }
      }
    } else {
      setOverColumn(null);
    }
  }, [columns]);

  // Handle drag end
  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;

      // Reset state
      setActiveDeal(null);
      setOverColumn(null);

      if (!over) return;

      const activeId = active.id as string;
      let targetStage: string | undefined;

      // Determine target stage
      if (over.data.current?.type === 'column') {
        targetStage = over.id as string;
      } else if (over.data.current?.type === 'deal') {
        // Dropped on another deal - find its column
        const targetDeal = over.data.current.deal as Deal;
        for (const column of columns) {
          if (column.deals.some((d) => d.id === targetDeal.id)) {
            targetStage = column.stage;
            break;
          }
        }
      }

      if (!targetStage) return;

      // Find source stage
      const sourceStage = findColumnByDealId(activeId);
      if (!sourceStage) return;

      // Only update if stage changed
      if (sourceStage !== targetStage) {
        await onDealMove(activeId, sourceStage, targetStage);
      }
    },
    [columns, findColumnByDealId, onDealMove]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {columns.map((column) => (
            <KanbanColumn
              key={column.stage}
              column={column}
              isOver={overColumn === column.stage}
            />
          ))}
        </div>
      </div>

      {/* Drag overlay - follows cursor */}
      <DragOverlay dropAnimation={{
        duration: 200,
        easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
      }}>
        {activeDeal ? <DealCardOverlay deal={activeDeal} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
